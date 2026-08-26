import assert from "node:assert/strict";
import test from "node:test";
import {
  APPROVED_RADAR_SOURCES,
  deriveSourceAlert,
  mapRadarItemToArticle,
  parseRadarSourceBody,
  type RadarSourceStatus,
} from "./radar";

function sourceFor(id: string) {
  const source = APPROVED_RADAR_SOURCES.find((candidate) => candidate.id === id);
  assert.ok(source, `Expected approved Radar source ${id}`);
  return source;
}

function statusFor(overrides: Partial<RadarSourceStatus>): RadarSourceStatus {
  const source = APPROVED_RADAR_SOURCES[0];
  return {
    id: source.id,
    name: source.name,
    category: source.category,
    sourceUrl: source.sourceUrl,
    status: "pending",
    lastAttemptAt: null,
    lastSuccessAt: null,
    itemsFound: 0,
    itemsAdded: 0,
    error: null,
    consecutiveFailures: 0,
    ...overrides,
  };
}

function assertSourceMapping({
  sourceId,
  body,
  articlePath,
  expectedCategory,
  expectedName,
  expectedUrl,
  expectedPublishedAt,
}: {
  sourceId: string;
  body: string;
  articlePath?: string;
  expectedCategory: string;
  expectedName: string;
  expectedUrl: string;
  expectedPublishedAt: string;
}) {
  const source = sourceFor(sourceId);
  const item = parseRadarSourceBody(body, source)
    .find((candidate) => !articlePath || new URL(candidate.articleUrl).pathname === articlePath);
  assert.ok(item, `${source.name} should produce an item`);
  assert.equal(item.publishedAt?.toISOString(), expectedPublishedAt);

  const article = mapRadarItemToArticle(item, source, new Date("2026-08-26T00:00:00.000Z"));
  assert.equal(article.category, expectedCategory);
  assert.equal(article.sourceName, expectedName);
  assert.equal(article.sourceUrl, expectedUrl);
  assert.equal(article.publishedAt?.toISOString(), expectedPublishedAt);
}

test("maps LPJK RSS updates to their official attribution and published date", () => {
  assertSourceMapping({
    sourceId: "lpjk",
    body: `<?xml version="1.0"?>
      <rss><channel><item>
        <title><![CDATA[LPJK menerbitkan pembaruan layanan sertifikasi]]></title>
        <link>https://binakonstruksi.pu.go.id/informasi-terkini/lpjk-menerbitkan-pembaruan/</link>
        <description>Pembaruan resmi LPJK.</description>
        <pubDate>Thu, 13 Aug 2026 01:44:57 +0000</pubDate>
      </item></channel></rss>`,
    expectedCategory: "lpjk-regulasi",
    expectedName: "Ditjen Bina Konstruksi — Pembaruan LPJK",
    expectedUrl: "https://binakonstruksi.pu.go.id/",
    expectedPublishedAt: "2026-08-13T01:44:57.000Z",
  });
});

test("keeps the official LPJK alternative stream limited to LPJK-related RSS content", () => {
  const source = sourceFor("lpjk");
  const items = parseRadarSourceBody(`<?xml version="1.0"?>
    <rss><channel>
      <item>
        <title>Pembaruan layanan sertifikasi konstruksi</title>
        <link>https://binakonstruksi.pu.go.id/informasi-terkini/pembaruan-sertifikasi/</link>
        <description>LPJK menerbitkan ketentuan layanan terbaru.</description>
        <pubDate>Thu, 13 Aug 2026 01:44:57 +0000</pubDate>
      </item>
      <item>
        <title>Pelatihan keselamatan konstruksi nasional</title>
        <link>https://binakonstruksi.pu.go.id/informasi-terkini/pelatihan-keselamatan/</link>
        <description>Informasi umum Ditjen Bina Konstruksi.</description>
        <pubDate>Thu, 20 Aug 2026 08:28:00 +0000</pubDate>
      </item>
      <item>
        <title>Tautan tidak disetujui</title>
        <link>https://example.invalid/berita-eksternal</link>
        <description>LPJK</description>
        <pubDate>Thu, 20 Aug 2026 08:28:00 +0000</pubDate>
      </item>
    </channel></rss>`, source);

  assert.equal(items.length, 1);
  assert.equal(items[0].title, "Pembaruan layanan sertifikasi konstruksi");
  assert.equal(items[0].articleUrl, "https://binakonstruksi.pu.go.id/informasi-terkini/pembaruan-sertifikasi/");
});

test("maps Kementerian PU RSS updates to their official attribution and published date", () => {
  assertSourceMapping({
    sourceId: "kementerian-pekerjaan-umum",
    body: `<?xml version="1.0"?>
      <rss><channel><item>
        <title>Kementerian PU memperkuat standar keselamatan konstruksi</title>
        <link>https://binakonstruksi.pu.go.id/informasi-terkini/standar-keselamatan-konstruksi/</link>
        <description>Pembaruan dari Ditjen Bina Konstruksi.</description>
        <pubDate>Thu, 20 Aug 2026 08:28:00 +0000</pubDate>
      </item></channel></rss>`,
    expectedCategory: "kementerian",
    expectedName: "Kementerian PU — Ditjen Bina Konstruksi",
    expectedUrl: "https://binakonstruksi.pu.go.id/",
    expectedPublishedAt: "2026-08-20T08:28:00.000Z",
  });
});

test("maps LKPP tender announcements to their official attribution and published date", () => {
  assertSourceMapping({
    sourceId: "spse-icb-lkpp",
    body: `<table><tr>
      <td class="pkt_nama"><a href="/spseicb/lelang/view/2730999;jsessionid=temporary">Paket konstruksi resmi</a></td>
      <td class="instansi">Kementerian Pekerjaan Umum</td>
      <td class="tgl_download_dokumen">26 Aug - 9 Sep 2026</td>
    </tr></table>
    <b>August 19, 2026 10:57</b><br />
    <a href="/spseicb/publicberitadetail/927999;jsessionid=temporary">Pengumuman tender konstruksi</a>`,
    articlePath: "/spseicb/publicberitadetail/927999",
    expectedCategory: "tender-pengadaan",
    expectedName: "SPSE ICB LKPP — Tender",
    expectedUrl: "https://spseicb.lkpp.go.id/spseicb/",
    expectedPublishedAt: "2026-08-19T10:57:00.000Z",
  });
});

test("keeps SPSE tender schedules attributed to LKPP without inventing a publication date", () => {
  const source = sourceFor("spse-icb-lkpp");
  const [tender] = parseRadarSourceBody(`<table><tr>
    <td class="pkt_nama"><a href="/spseicb/lelang/view/2730999;jsessionid=temporary">Paket konstruksi resmi</a></td>
    <td class="instansi">Kementerian Pekerjaan Umum</td>
    <td class="tgl_download_dokumen">26 Aug - 9 Sep 2026</td>
  </tr></table>`, source);

  assert.ok(tender);
  assert.equal(tender.articleUrl, "https://spseicb.lkpp.go.id/spseicb/lelang/view/2730999");
  assert.equal(tender.publishedAt, null);

  const article = mapRadarItemToArticle(tender, source, new Date("2026-08-26T00:00:00.000Z"));
  assert.equal(article.category, "tender-pengadaan");
  assert.equal(article.sourceName, "SPSE ICB LKPP — Tender");
  assert.match(article.summary, /Instansi: Kementerian Pekerjaan Umum/);
  assert.match(article.summary, /Jadwal unduh dokumen: 26 Aug - 9 Sep 2026/);
});

test("flags a source that has failed two refresh cycles in a row", () => {
  const status = statusFor({
    status: "error",
    error: "Sumber merespons HTTP 503",
    consecutiveFailures: 2,
    lastSuccessAt: new Date("2026-08-24T00:00:00.000Z"),
  });

  const alert = deriveSourceAlert(status, new Date("2026-08-26T00:00:00.000Z"));
  assert.ok(alert, "Two consecutive failures should raise an alert");
  assert.equal(alert.reason, "repeated_failures");
  assert.match(alert.message, /2x berturut-turut/);
  assert.equal(alert.lastSuccessAt?.toISOString(), "2026-08-24T00:00:00.000Z");
  assert.equal(alert.error, "Sumber merespons HTTP 503");
});

test("does not flag a single failed attempt as a repeated failure", () => {
  const status = statusFor({
    status: "error",
    error: "fetch failed",
    consecutiveFailures: 1,
    lastSuccessAt: new Date(),
  });

  assert.equal(deriveSourceAlert(status, new Date()), null);
});

test("flags a source that has gone past its daily schedule without a successful refresh, even if the last attempt reported success", () => {
  const status = statusFor({
    status: "success",
    consecutiveFailures: 0,
    lastSuccessAt: new Date("2026-08-20T00:00:00.000Z"),
  });

  const alert = deriveSourceAlert(status, new Date("2026-08-26T00:00:00.000Z"));
  assert.ok(alert, "A stale last-success date should raise an alert");
  assert.equal(alert.reason, "stale");
});

test("does not flag a source that has never run and never failed", () => {
  const status = statusFor({ status: "pending", consecutiveFailures: 0, lastSuccessAt: null });
  assert.equal(deriveSourceAlert(status, new Date()), null);
});

test("clears once a source recovers: zero consecutive failures and a recent success produce no alert", () => {
  const status = statusFor({
    status: "success",
    consecutiveFailures: 0,
    lastSuccessAt: new Date(),
  });
  assert.equal(deriveSourceAlert(status, new Date()), null);
});