import dns from "node:dns/promises";
import http from "node:http";
import https from "node:https";
import net from "node:net";
import type { IncomingMessage } from "node:http";

export const MAX_FETCH_RESPONSE_SIZE = 2 * 1024 * 1024;
export const MAX_REDIRECTS = 3;
export const FETCH_TIMEOUT_MS = 10_000;

const ALLOWED_CONTENT_TYPES = new Set([
  "application/xhtml+xml",
  "text/html",
  "text/markdown",
  "text/plain",
]);

const METADATA_ADDRESSES = new Set(["100.100.100.200"]);

export class UrlFetchError extends Error {
  constructor(
    message: string,
    public readonly statusCode = 400,
  ) {
    super(message);
    this.name = "UrlFetchError";
  }
}

function parseIpv4(address: string): number[] | null {
  if (net.isIP(address) !== 4) return null;
  const octets = address.split(".").map(Number);
  return octets.length === 4 && octets.every((octet) => octet >= 0 && octet <= 255)
    ? octets
    : null;
}

function parseIpv6(address: string): number[] | null {
  if (net.isIP(address) !== 6) return null;

  const normalized = address.toLowerCase();
  const [withoutCompression, compression] = normalized.split("::");
  if (compression !== undefined && normalized.indexOf("::") !== normalized.lastIndexOf("::")) {
    return null;
  }

  const parseGroups = (value: string): number[] => {
    if (!value) return [];
    const groups = value.split(":");
    const lastGroup = groups[groups.length - 1];
    if (lastGroup.includes(".")) {
      const ipv4 = parseIpv4(lastGroup);
      if (!ipv4) return [];
      groups.splice(-1, 1, ((ipv4[0] << 8) | ipv4[1]).toString(16), ((ipv4[2] << 8) | ipv4[3]).toString(16));
    }
    if (groups.some((group) => !/^[0-9a-f]{1,4}$/.test(group))) return [];
    return groups.map((group) => Number.parseInt(group, 16));
  };

  const left = parseGroups(withoutCompression);
  if (compression === undefined) {
    return left.length === 8 ? left : null;
  }

  const right = parseGroups(compression);
  const missingGroups = 8 - left.length - right.length;
  return missingGroups > 0 && left.length + missingGroups + right.length === 8
    ? [...left, ...Array.from({ length: missingGroups }, () => 0), ...right]
    : null;
}

/**
 * Returns true for address ranges that must never be contacted by URL import.
 * This intentionally blocks special-use ranges in addition to RFC1918/private,
 * loopback, link-local, and cloud metadata addresses.
 */
export function isBlockedAddress(address: string): boolean {
  const normalized = address.toLowerCase().replace(/^\[|\]$/g, "");
  if (METADATA_ADDRESSES.has(normalized)) return true;

  const ipv4 = parseIpv4(normalized);
  if (ipv4) {
    const [first, second, third] = ipv4;
    return (
      first === 0 ||
      first === 10 ||
      first === 127 ||
      (first === 100 && second >= 64 && second <= 127) ||
      (first === 169 && second === 254) ||
      (first === 172 && second >= 16 && second <= 31) ||
      (first === 192 && second === 0 && third === 0) ||
      (first === 192 && second === 0 && third === 2) ||
      (first === 192 && second === 168) ||
      (first === 198 && (second === 18 || second === 19)) ||
      (first === 198 && second === 51 && third === 100) ||
      (first === 203 && second === 0 && third === 113) ||
      first >= 224
    );
  }

  const ipv6 = parseIpv6(normalized);
  if (!ipv6) return true;

  const firstGroup = ipv6[0];
  const isIpv4Mapped = ipv6.slice(0, 5).every((group) => group === 0) && ipv6[5] === 0xffff;
  const isIpv4Compatible = ipv6.slice(0, 6).every((group) => group === 0);
  if (isIpv4Mapped || isIpv4Compatible) {
    return isBlockedAddress(
      `${ipv6[6] >> 8}.${ipv6[6] & 0xff}.${ipv6[7] >> 8}.${ipv6[7] & 0xff}`,
    );
  }

  return (
    ipv6.every((group) => group === 0) ||
    (ipv6.slice(0, 7).every((group) => group === 0) && ipv6[7] === 1) ||
    (firstGroup & 0xfe00) === 0xfc00 ||
    (firstGroup & 0xffc0) === 0xfe80 ||
    (firstGroup & 0xff00) === 0xff00
  );
}

function normalizedHostname(hostname: string): string {
  return hostname.replace(/^\[|\]$/g, "").replace(/\.$/, "").toLowerCase();
}

export type AddressResolver = (hostname: string) => Promise<string[]>;

export const resolveAndValidateHost: AddressResolver = async (hostname) => {
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

  let records: Array<{ address: string }>;
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

function validateHttpUrl(target: URL): void {
  if (target.protocol !== "http:" && target.protocol !== "https:") {
    throw new UrlFetchError("Hanya URL http/https yang diizinkan");
  }
  if (target.username || target.password) {
    throw new UrlFetchError("URL dengan kredensial tidak diizinkan");
  }
}

export async function validateUrlTarget(
  target: URL,
  resolveAddresses: AddressResolver = resolveAndValidateHost,
): Promise<string[]> {
  validateHttpUrl(target);
  const addresses = await resolveAddresses(target.hostname);
  if (addresses.length === 0 || addresses.some(isBlockedAddress)) {
    throw new UrlFetchError("Host tujuan tidak diizinkan");
  }
  return addresses;
}

export async function validateRedirectTarget(
  currentUrl: URL,
  location: string,
  resolveAddresses: AddressResolver = resolveAndValidateHost,
): Promise<{ url: URL; addresses: string[] }> {
  let redirectUrl: URL;
  try {
    redirectUrl = new URL(location, currentUrl);
  } catch {
    throw new UrlFetchError("Redirect URL tidak valid");
  }
  const addresses = await validateUrlTarget(redirectUrl, resolveAddresses);
  return { url: redirectUrl, addresses };
}

export type ResponseResult =
  | { kind: "redirect"; location: string }
  | { kind: "body"; contentType: string; body: Buffer };

export type UrlRequest = (target: URL, validatedAddresses: string[]) => Promise<ResponseResult>;

function readResponseBody(response: IncomingMessage): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let totalSize = 0;
    let settled = false;
    const fail = (error: Error) => {
      if (settled) return;
      settled = true;
      reject(error);
    };

    response.on("data", (chunk: Buffer | string) => {
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

function requestOnce(target: URL, addresses: string[]): Promise<ResponseResult> {
  return new Promise((resolve, reject) => {
    let deadline: ReturnType<typeof setTimeout> | undefined;
    let settled = false;
    const complete = <T>(callback: (value: T) => void, value: T) => {
      if (settled) return;
      settled = true;
      if (deadline) clearTimeout(deadline);
      callback(value);
    };
    const hostname = normalizedHostname(target.hostname);
    const transport = target.protocol === "https:" ? https : http;
    const requestOptions: http.RequestOptions & { servername?: string } = {
      hostname,
      port: target.port || undefined,
      path: `${target.pathname || "/"}${target.search}`,
      method: "GET",
      headers: {
        Accept: "text/html, application/xhtml+xml, text/plain, text/markdown",
        Host: target.host,
        "User-Agent": "Mozilla/5.0 KonstruksiAI/1.0",
      },
      lookup: (_hostname, options, callback) => {
        const connectionAddresses = addresses.map((address) => ({
          address,
          family: net.isIP(address),
        }));
        if (typeof options === "object" && options !== null && "all" in options && options.all) {
          (
            callback as unknown as (
              error: NodeJS.ErrnoException | null,
              result: typeof connectionAddresses,
            ) => void
          )(null, connectionAddresses);
          return;
        }

        const [address] = connectionAddresses;
        callback(null, address.address, address.family);
      },
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
      const contentLength = rawLength === undefined ? undefined : Number(rawLength);
      if (
        !contentType ||
        !ALLOWED_CONTENT_TYPES.has(contentType) ||
        (contentLength !== undefined &&
          (!Number.isSafeInteger(contentLength) || contentLength < 0 || contentLength > MAX_FETCH_RESPONSE_SIZE))
      ) {
        response.resume();
        complete(reject, new UrlFetchError("Tipe atau ukuran respons URL tidak diizinkan", 415));
        return;
      }

      readResponseBody(response)
        .then((body) => complete(resolve, { kind: "body", contentType, body }))
        .catch((error: Error) => complete(reject, error));
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

/**
 * Sends one request using an address set that has already passed URL and DNS
 * validation. Kept separate so the transport's DNS pinning can be tested.
 */
export function requestValidatedUrl(
  target: URL,
  validatedAddresses: string[],
): Promise<ResponseResult> {
  return requestOnce(target, validatedAddresses);
}

export interface FetchUrlOptions {
  resolveAddresses?: AddressResolver;
  request?: UrlRequest;
}

export async function fetchUrlContent(
  initialUrl: URL,
  options: FetchUrlOptions = {},
): Promise<{ content: string; url: string; contentType: string }> {
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
      url: currentUrl.toString(),
    };
  }
}