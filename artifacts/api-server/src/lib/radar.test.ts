import assert from "node:assert/strict";
import test from "node:test";
import {
  APPROVED_RADAR_SOURCES,
  mapRadarItemToArticle,
  parseRadarSourceBody,
} from "./radar";

function sourceFor(id: string) {
  const source = APPROVED_RADAR_SOURCES.find((candidate) => candidate.id === id);
  assert.ok(source, `Expected approved Radar source ${id}`);
  return source;
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