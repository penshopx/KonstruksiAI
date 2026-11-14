// src/lib/url-fetch.test.ts
import assert from "node:assert/strict";
import { createServer } from "node:http";
import test from "node:test";

// src/lib/url-fetch.ts
import dns from "node:dns/promises";
import http from "node:http";
import https from "node:https";
import net from "node:net";
var MAX_FETCH_RESPONSE_SIZE = 2 * 1024 * 1024;
var MAX_REDIRECTS = 3;
var FETCH_TIMEOUT_MS = 1e4;
var ALLOWED_CONTENT_TYPES = /* @__PURE__ */ new Set([
  "application/xhtml+xml",
  "text/html",
  "text/markdown",
  "text/plain"
]);
var METADATA_ADDRESSES = /* @__PURE__ */ new Set(["100.100.100.200"]);
var UrlFetchError = class extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.name = "UrlFetchError";
  }
};
function parseIpv4(address) {
  if (net.isIP(address) !== 4) return null;
  const octets = address.split(".").map(Number);
  return octets.length === 4 && octets.every((octet) => octet >= 0 && octet <= 255) ? octets : null;
}
function parseIpv6(address) {
  if (net.isIP(address) !== 6) return null;
  const normalized = address.toLowerCase();
  const [withoutCompression, compression] = normalized.split("::");
  if (compression !== void 0 && normalized.indexOf("::") !== normalized.lastIndexOf("::")) {
    return null;
  }
  const parseGroups = (value) => {
    if (!value) return [];
    const groups = value.split(":");
    const lastGroup = groups[groups.length - 1];
    if (lastGroup.includes(".")) {
      const ipv4 = parseIpv4(lastGroup);
      if (!ipv4) return [];
      groups.splice(-1, 1, (ipv4[0] << 8 | ipv4[1]).toString(16), (ipv4[2] << 8 | ipv4[3]).toString(16));
    }
    if (groups.some((group) => !/^[0-9a-f]{1,4}$/.test(group))) return [];
    return groups.map((group) => Number.parseInt(group, 16));
  };
  const left = parseGroups(withoutCompression);
  if (compression === void 0) {
    return left.length === 8 ? left : null;
  }
  const right = parseGroups(compression);
  const missingGroups = 8 - left.length - right.length;
  return missingGroups > 0 && left.length + missingGroups + right.length === 8 ? [...left, ...Array.from({ length: missingGroups }, () => 0), ...right] : null;
}
function isBlockedAddress(address) {
  const normalized = address.toLowerCase().replace(/^\[|\]$/g, "");
  if (METADATA_ADDRESSES.has(normalized)) return true;
  const ipv4 = parseIpv4(normalized);
  if (ipv4) {
    const [first, second, third] = ipv4;
    return first === 0 || first === 10 || first === 127 || first === 100 && second >= 64 && second <= 127 || first === 169 && second === 254 || first === 172 && second >= 16 && second <= 31 || first === 192 && second === 0 && third === 0 || first === 192 && second === 0 && third === 2 || first === 192 && second === 168 || first === 198 && (second === 18 || second === 19) || first === 198 && second === 51 && third === 100 || first === 203 && second === 0 && third === 113 || first >= 224;
  }
  const ipv6 = parseIpv6(normalized);
  if (!ipv6) return true;
  const firstGroup = ipv6[0];
  const isIpv4Mapped = ipv6.slice(0, 5).every((group) => group === 0) && ipv6[5] === 65535;
  const isIpv4Compatible = ipv6.slice(0, 6).every((group) => group === 0);
  if (isIpv4Mapped || isIpv4Compatible) {
    return isBlockedAddress(
      `${ipv6[6] >> 8}.${ipv6[6] & 255}.${ipv6[7] >> 8}.${ipv6[7] & 255}`
    );
  }
  return ipv6.every((group) => group === 0) || ipv6.slice(0, 7).every((group) => group === 0) && ipv6[7] === 1 || (firstGroup & 65024) === 64512 || (firstGroup & 65472) === 65152 || (firstGroup & 65280) === 65280;
}
function normalizedHostname(hostname) {
  return hostname.replace(/^\[|\]$/g, "").replace(/\.$/, "").toLowerCase();
}
var resolveAndValidateHost = async (hostname) => {
  const normalized = normalizedHostname(hostname);
  if (!normalized || normalized === "localhost" || normalized.endsWith(".localhost")) {
    throw new UrlFetchError("Host tujuan tidak diizinkan");
  }
  if (net.isIP(normalized)) {
    if (isBlockedAddress(normalized)) {
      throw new UrlFetchError("Host tujuan tidak diizinkan");
    }
    return [normalized];
  }
  let records;
  try {
    records = await dns.lookup(normalized, { all: true, verbatim: true });
  } catch {
    throw new UrlFetchError("Host tujuan tidak dapat di-resolve", 502);
  }
  const addresses = records.map((record) => record.address);
  if (addresses.length === 0 || addresses.some(isBlockedAddress)) {
    throw new UrlFetchError("Host tujuan tidak diizinkan");
  }
  return addresses;
};
function validateHttpUrl(target) {
  if (target.protocol !== "http:" && target.protocol !== "https:") {
    throw new UrlFetchError("Hanya URL http/https yang diizinkan");
  }
  if (target.username || target.password) {
    throw new UrlFetchError("URL dengan kredensial tidak diizinkan");
  }
}
async function validateUrlTarget(target, resolveAddresses = resolveAndValidateHost) {
  validateHttpUrl(target);
  const addresses = await resolveAddresses(target.hostname);
  if (addresses.length === 0 || addresses.some(isBlockedAddress)) {
    throw new UrlFetchError("Host tujuan tidak diizinkan");
  }
  return addresses;
}
async function validateRedirectTarget(currentUrl, location, resolveAddresses = resolveAndValidateHost) {
  let redirectUrl;
  try {
    redirectUrl = new URL(location, currentUrl);
  } catch {
    throw new UrlFetchError("Redirect URL tidak valid");
  }
  const addresses = await validateUrlTarget(redirectUrl, resolveAddresses);
  return { url: redirectUrl, addresses };
}
function readResponseBody(response) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let totalSize = 0;
    let settled = false;
    const fail = (error) => {
      if (settled) return;
      settled = true;
      reject(error);
    };
    response.on("data", (chunk) => {
      const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      totalSize += buffer.length;
      if (totalSize > MAX_FETCH_RESPONSE_SIZE) {
        response.destroy();
        fail(new UrlFetchError("Respons URL terlalu besar (maksimal 2MB)", 413));
        return;
      }
      chunks.push(buffer);
    });
    response.on("end", () => {
      if (settled) return;
      settled = true;
      resolve(Buffer.concat(chunks));
    });
    response.on("error", fail);
  });
}
function requestOnce(target, addresses) {
  return new Promise((resolve, reject) => {
    let deadline;
    let settled = false;
    const complete = (callback, value) => {
      if (settled) return;
      settled = true;
      if (deadline) clearTimeout(deadline);
      callback(value);
    };
    const hostname = normalizedHostname(target.hostname);
    const transport = target.protocol === "https:" ? https : http;
    const requestOptions = {
      hostname,
      port: target.port || void 0,
      path: `${target.pathname || "/"}${target.search}`,
      method: "GET",
      headers: {
        Accept: "text/html, application/xhtml+xml, text/plain, text/markdown",
        Host: target.host,
        "User-Agent": "Mozilla/5.0 KonstruksiAI/1.0"
      },
      lookup: (_hostname, options, callback) => {
        const connectionAddresses = addresses.map((address2) => ({
          address: address2,
          family: net.isIP(address2)
        }));
        if (typeof options === "object" && options !== null && "all" in options && options.all) {
          callback(null, connectionAddresses);
          return;
        }
        const [address] = connectionAddresses;
        callback(null, address.address, address.family);
      }
    };
    if (target.protocol === "https:" && !net.isIP(hostname)) {
      requestOptions.servername = hostname;
    }
    const request = transport.request(requestOptions, (response) => {
      const statusCode = response.statusCode ?? 0;
      if ([301, 302, 303, 307, 308].includes(statusCode)) {
        const location = response.headers.location;
        response.resume();
        if (!location) {
          complete(reject, new UrlFetchError("Redirect URL tidak ditemukan", 502));
        } else {
          complete(resolve, { kind: "redirect", location });
        }
        return;
      }
      if (statusCode < 200 || statusCode >= 300) {
        response.resume();
        complete(reject, new UrlFetchError(`Server tujuan mengembalikan status ${statusCode}`, 502));
        return;
      }
      const rawContentType = response.headers["content-type"];
      const contentType = rawContentType?.split(";", 1)[0]?.trim().toLowerCase();
      const rawLength = response.headers["content-length"];
      const contentLength = rawLength === void 0 ? void 0 : Number(rawLength);
      if (!contentType || !ALLOWED_CONTENT_TYPES.has(contentType) || contentLength !== void 0 && (!Number.isSafeInteger(contentLength) || contentLength < 0 || contentLength > MAX_FETCH_RESPONSE_SIZE)) {
        response.resume();
        complete(reject, new UrlFetchError("Tipe atau ukuran respons URL tidak diizinkan", 415));
        return;
      }
      readResponseBody(response).then((body) => complete(resolve, { kind: "body", contentType, body })).catch((error) => complete(reject, error));
    });
    request.setTimeout(FETCH_TIMEOUT_MS, () => {
      request.destroy(new UrlFetchError("Waktu pengambilan URL habis", 504));
    });
    deadline = setTimeout(() => {
      request.destroy(new UrlFetchError("Waktu pengambilan URL habis", 504));
    }, FETCH_TIMEOUT_MS);
    request.on("error", (error) => complete(reject, error));
    request.end();
  });
}
function requestValidatedUrl(target, validatedAddresses) {
  return requestOnce(target, validatedAddresses);
}
async function fetchUrlContent(initialUrl, options = {}) {
  const resolveAddresses = options.resolveAddresses ?? resolveAndValidateHost;
  const request = options.request ?? requestOnce;
  let currentUrl = initialUrl;
  let addresses = await validateUrlTarget(currentUrl, resolveAddresses);
  for (let redirectCount = 0; ; redirectCount += 1) {
    const response = await request(currentUrl, addresses);
    if (response.kind === "redirect") {
      if (redirectCount >= MAX_REDIRECTS) {
        throw new UrlFetchError("Terlalu banyak redirect", 502);
      }
      const redirect = await validateRedirectTarget(currentUrl, response.location, resolveAddresses);
      currentUrl = redirect.url;
      addresses = redirect.addresses;
      continue;
    }
    return {
      content: response.body.toString("utf-8"),
      contentType: response.contentType,
      url: currentUrl.toString()
    };
  }
}

// src/lib/url-fetch.test.ts
test("rejects private, loopback, link-local, and metadata addresses", () => {
  for (const address of [
    "10.0.0.1",
    "172.16.0.1",
    "192.168.1.1",
    "127.0.0.1",
    "169.254.169.254",
    "100.100.100.200",
    "::1",
    "fc00::1",
    "fe80::1",
    "::ffff:127.0.0.1",
    "::127.0.0.1",
    "::10.0.0.1",
    "::192.168.1.1"
  ]) {
    assert.equal(isBlockedAddress(address), true, `${address} must be blocked`);
  }
});
test("rejects a private URL target before making a request", async () => {
  await assert.rejects(
    () => validateUrlTarget(new URL("http://127.0.0.1/internal")),
    /Host tujuan tidak diizinkan/
  );
});
test("rejects a host when any DNS result is private", async () => {
  await assert.rejects(
    () => validateUrlTarget(
      new URL("https://public.example/document"),
      async () => ["93.184.216.34", "10.0.0.5"]
    ),
    /Host tujuan tidak diizinkan/
  );
});
test("revalidates redirects and rejects a redirect to a private host", async () => {
  await assert.rejects(
    () => validateRedirectTarget(
      new URL("https://public.example/document"),
      "http://169.254.169.254/latest/meta-data"
    ),
    /Host tujuan tidak diizinkan/
  );
});
test("accepts a public URL whose every resolved address is public", async () => {
  const addresses = await validateUrlTarget(
    new URL("https://public.example/document"),
    async () => ["93.184.216.34", "2001:4860:4860::8888"]
  ).catch((error) => {
    throw error;
  });
  assert.deepEqual(addresses, ["93.184.216.34", "2001:4860:4860::8888"]);
});
test("carries each validated address set through the redirect transport flow", async () => {
  const receivedHosts = [];
  const requestAddresses = [];
  let port = 0;
  const server = createServer((request, response) => {
    receivedHosts.push(request.headers.host ?? "");
    if (request.url === "/start") {
      response.writeHead(302, { Location: `http://redirected.example:${port}/final` });
      response.end();
      return;
    }
    response.writeHead(200, {
      "Content-Length": "2",
      "Content-Type": "text/plain; charset=utf-8"
    });
    response.end("ok");
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  port = server.address().port;
  try {
    const initialUrl = new URL(`http://origin.example:${port}/start`);
    const fetched = await fetchUrlContent(initialUrl, {
      resolveAddresses: async (hostname) => {
        if (hostname === "origin.example") return ["93.184.216.34"];
        if (hostname === "redirected.example") return ["1.1.1.1"];
        throw new Error(`Unexpected hostname: ${hostname}`);
      },
      request: async (target, addresses) => {
        requestAddresses.push({ hostname: target.hostname, addresses });
        return requestValidatedUrl(target, ["127.0.0.1"]);
      }
    });
    assert.equal(fetched.content, "ok");
    assert.equal(fetched.url, `http://redirected.example:${port}/final`);
    assert.deepEqual(requestAddresses, [
      { hostname: "origin.example", addresses: ["93.184.216.34"] },
      { hostname: "redirected.example", addresses: ["1.1.1.1"] }
    ]);
    assert.deepEqual(receivedHosts, [`origin.example:${port}`, `redirected.example:${port}`]);
  } finally {
    await new Promise(
      (resolve, reject) => server.close((error) => error ? reject(error) : resolve())
    );
  }
});
