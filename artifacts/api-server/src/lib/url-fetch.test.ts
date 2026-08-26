import assert from "node:assert/strict";
import { createServer } from "node:http";
import test from "node:test";
import {
  fetchUrlContent,
  isBlockedAddress,
  requestValidatedUrl,
  validateRedirectTarget,
  validateUrlTarget,
} from "./url-fetch";

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
    "::192.168.1.1",
  ]) {
    assert.equal(isBlockedAddress(address), true, `${address} must be blocked`);
  }
});

test("rejects a private URL target before making a request", async () => {
  await assert.rejects(
    () => validateUrlTarget(new URL("http://127.0.0.1/internal")),
    /Host tujuan tidak diizinkan/,
  );
});

test("rejects a host when any DNS result is private", async () => {
  await assert.rejects(
    () =>
      validateUrlTarget(
        new URL("https://public.example/document"),
        async () => ["93.184.216.34", "10.0.0.5"],
      ),
    /Host tujuan tidak diizinkan/,
  );
});

test("revalidates redirects and rejects a redirect to a private host", async () => {
  await assert.rejects(
    () =>
      validateRedirectTarget(
        new URL("https://public.example/document"),
        "http://169.254.169.254/latest/meta-data",
      ),
    /Host tujuan tidak diizinkan/,
  );
});

test("accepts a public URL whose every resolved address is public", async () => {
  const addresses = await validateUrlTarget(
    new URL("https://public.example/document"),
    async () => ["93.184.216.34", "2001:4860:4860::8888"],
  ).catch((error: unknown) => {
    throw error;
  });

  // The resolver is injected to keep this test deterministic; the production
  // resolver performs the same validation on every DNS result.
  assert.deepEqual(addresses, ["93.184.216.34", "2001:4860:4860::8888"]);
});

test("carries each validated address set through the redirect transport flow", async () => {
  const receivedHosts: string[] = [];
  const requestAddresses: Array<{ hostname: string; addresses: string[] }> = [];
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
      "Content-Type": "text/plain; charset=utf-8",
    });
    response.end("ok");
  });

  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  port = (server.address() as { port: number }).port;

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
        // This local test transport can only connect to loopback. Production
        // uses requestOnce directly with the public addresses above.
        return requestValidatedUrl(target, ["127.0.0.1"]);
      },
    });

    assert.equal(fetched.content, "ok");
    assert.equal(fetched.url, `http://redirected.example:${port}/final`);
    assert.deepEqual(requestAddresses, [
      { hostname: "origin.example", addresses: ["93.184.216.34"] },
      { hostname: "redirected.example", addresses: ["1.1.1.1"] },
    ]);
    assert.deepEqual(receivedHosts, [`origin.example:${port}`, `redirected.example:${port}`]);
  } finally {
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
  }
});