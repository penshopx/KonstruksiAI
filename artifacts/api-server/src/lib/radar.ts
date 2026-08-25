import { createHash } from "node:crypto";
import { db, radarArticles, type RadarArticle } from "../db";

export const RADAR_CATEGORIES = [
  "kementerian",
  "lpjk-regulasi",
  "infrastruktur",
  "tender-pengadaan",
] as const;

export type RadarCategory = (typeof RADAR_CATEGORIES)[number];
type SourceKind = "rss" | "html" | "tender-html";

type RadarSource = {
  id: string;
  name: string;
  category: RadarCategory;
  sourceUrl: string;
  feedUrl: string;
  kind: SourceKind;
  allowedHosts: string[];
  keywords?: string[];
};

type ParsedItem = {
  title: string;
  summary: string;
  articleUrl: string;
  publishedAt: Date | null;
};

export type RadarSourceStatus = {
  id: string;
  name: string;
  category: RadarCategory;
  sourceUrl: string;
  status: "pending" | "loading" | "success" | "error";
  lastAttemptAt: Date | null;
  lastSuccessAt: Date | null;
  itemsFound: number;
  itemsAdded: number;
  error: string | null;
};

export type RadarRefreshResult = {
  startedAt: Date;
  finishedAt: Date;
  itemsFound: number;
  itemsAdded: number;
  sources: RadarSourceStatus[];
};

/**
 * This is an allow-list by design. Adding a new source should be an explicit
 * code review decision so the daily curator never follows arbitrary URLs.
 */
export const APPROVED_RADAR_SOURCES: RadarSource[] = [
  {
    id: "kementerian-pekerjaan-umum",
    name: "Kementerian Pekerjaan Umum",
    category: "kementerian",
    sourceUrl: "https://pu.go.id/berita",
    feedUrl: "https://pu.go.id/berita",
    kind: "html",
    allowedHosts: ["pu.go.id", "www.pu.go.id"],
  },
  {
    id: "lpjk",
    name: "LPJK",
    category: "lpjk-regulasi",
    sourceUrl: "https://lpjk.pu.go.id/",
    feedUrl: "https://lpjk.pu.go.id/",
    kind: "html",
    allowedHosts: ["lpjk.pu.go.id"],
  },
  {
    id: "spse-icb-lkpp",
    name: "SPSE ICB LKPP — Tender",
    category: "tender-pengadaan",
    sourceUrl: "https://spseicb.lkpp.go.id/spseicb/",
    feedUrl: "https://spseicb.lkpp.go.id/spseicb/",
    kind: "tender-html",
    allowedHosts: ["spseicb.lkpp.go.id"],
  },
  {
    id: "antara-infrastruktur",
    name: "ANTARA — Infrastruktur",
    category: "infrastruktur",
    sourceUrl: "https://www.antaranews.com/",
    feedUrl: "https://www.antaranews.com/rss/terkini.xml",
    kind: "rss",
    allowedHosts: ["antaranews.com", "www.antaranews.com"],
    keywords: [
      "konstruksi",
      "jalan",
      "jembatan",
      "bendungan",
      "tol",
      "perumahan",
      "air minum",
      "irigasi",
      "proyek infrastruktur",
    ],
  },
];

const sourceStatuses = new Map<string, RadarSourceStatus>(
  APPROVED_RADAR_SOURCES.map((source) => [
    source.id,
    {
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
    },
  ]),
);

let refreshInFlight: Promise<RadarRefreshResult> | null = null;

function stripMarkup(value: string): string {
  return decodeEntities(
    value
      .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, "$1")
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

function decodeEntities(value: string): string {
  return value
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function readTag(block: string, tag: string): string {
  const match = block.match(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match ? stripMarkup(match[1]) : "";
}

function readLink(block: string): string {
  const linkTag = block.match(/<link\b([^>]*)>([\s\S]*?)<\/link>/i);
  const href = linkTag?.[1].match(/\bhref=["']([^"']+)["']/i)?.[1];
  return href ? decodeEntities(href) : stripMarkup(linkTag?.[2] ?? "");
}

function parseDate(value: string): Date | null {
  if (!value) return null;
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? null : new Date(timestamp);
}

function normalizeArticleUrl(value: string, source: RadarSource): string | null {
  try {
    const url = new URL(decodeEntities(value), source.feedUrl);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    if (!source.allowedHosts.some((host) => url.hostname === host || url.hostname.endsWith(`.${host}`))) {
      return null;
    }
    if (url.href === source.sourceUrl || url.href === source.feedUrl) return null;
    url.pathname = url.pathname.replace(/;jsessionid=[^/]+/i, "");
    url.hash = "";
    for (const key of [...url.searchParams.keys()]) {
      if (/^(utm_|fbclid$|gclid$|mc_)/i.test(key)) url.searchParams.delete(key);
    }
    return url.href;
  } catch {
    return null;
  }
}

function parseRss(body: string, source: RadarSource): ParsedItem[] {
  const blocks = body.match(/<(item|entry)\b[^>]*>[\s\S]*?<\/\1>/gi) ?? [];
  const items: ParsedItem[] = [];

  for (const block of blocks) {
    const title = readTag(block, "title");
    const articleUrl = normalizeArticleUrl(readLink(block), source);
    const summary = readTag(block, "description") || readTag(block, "summary") || readTag(block, "content");
    const publishedAt = parseDate(
      readTag(block, "pubDate") ||
        readTag(block, "published") ||
        readTag(block, "updated") ||
        readTag(block, "date"),
    );

    if (!title || !articleUrl) continue;
    if (source.keywords && !source.keywords.some((keyword) => title.toLowerCase().includes(keyword))) {
      continue;
    }

    items.push({
      title,
      summary: summary || "Ringkasan belum tersedia pada sumber asli.",
      articleUrl,
      publishedAt,
    });
  }

  return items;
}

function parseHtmlLinks(body: string, source: RadarSource): ParsedItem[] {
  const items: ParsedItem[] = [];
  const seenUrls = new Set<string>();
  const anchorPattern = /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  const articlePath = /\/(berita|berita-utama|news|artikel|article|informasi|siaran-pers)(\/|[-_])/i;
  let match: RegExpExecArray | null;

  while ((match = anchorPattern.exec(body)) && items.length < 30) {
    const articleUrl = normalizeArticleUrl(match[1], source);
    const title = stripMarkup(match[2]);
    if (!articleUrl || !title || title.length < 15 || !articlePath.test(new URL(articleUrl).pathname)) continue;
    if (seenUrls.has(articleUrl)) continue;
    if (/^(baca selengkapnya|selengkapnya|read more|home|beranda|menu)$/i.test(title)) continue;
    seenUrls.add(articleUrl);
    items.push({
      title,
      summary: "Ringkasan belum tersedia pada sumber asli.",
      articleUrl,
      publishedAt: null,
    });
  }

  return items;
}

function parseTenderHtml(body: string, source: RadarSource): ParsedItem[] {
  const rows = body.match(/<tr\b[^>]*>[\s\S]*?<\/tr>/gi) ?? [];
  const items: ParsedItem[] = [];

  for (const row of rows) {
    const linkMatch = row.match(/href=["']([^"']*\/lelang\/view\/[^"']*)["']/i);
    const titleMatch = row.match(/<td\b[^>]*class=["'][^"']*\bpkt_nama\b[^"']*["'][^>]*>([\s\S]*?)<\/td>/i);
    const agencyMatch = row.match(/<td\b[^>]*class=["'][^"']*\binstansi\b[^"']*["'][^>]*>([\s\S]*?)<\/td>/i);
    const scheduleMatch = row.match(/<td\b[^>]*class=["'][^"']*\btgl_download_dokumen\b[^"']*["'][^>]*>([\s\S]*?)<\/td>/i);
    const title = stripMarkup(titleMatch?.[1] ?? "");
    const articleUrl = linkMatch ? normalizeArticleUrl(linkMatch[1], source) : null;
    const agency = stripMarkup(agencyMatch?.[1] ?? "");
    const schedule = stripMarkup(scheduleMatch?.[1] ?? "");

    if (!title || !articleUrl) continue;
    items.push({
      title,
      summary: `Instansi: ${agency || "Tidak disebutkan"}. Jadwal unduh dokumen: ${schedule || "Periksa halaman tender."}`,
      articleUrl,
      publishedAt: null,
    });
  }

  return items;
}

function makeSummary(summary: string, title: string): string {
  const clean = stripMarkup(summary);
  if (!clean) return `Informasi terbaru: ${title}`;
  return clean.length > 260 ? `${clean.slice(0, 257).trimEnd()}...` : clean;
}

function getImportance(title: string, summary: string): "normal" | "penting" {
  const text = `${title} ${summary}`.toLowerCase();
  return /perubahan|wajib|segera|peringatan|darurat|ditutup|batas waktu|kebijakan baru/.test(text)
    ? "penting"
    : "normal";
}

async function fetchSource(source: RadarSource): Promise<ParsedItem[]> {
  const response = await fetch(source.feedUrl, {
    headers: {
      Accept: "application/rss+xml, application/atom+xml, text/xml, text/html;q=0.9",
      "User-Agent": "KonstruksiAI-Radar/1.0 (+https://konstruksi.ai)",
    },
    signal: AbortSignal.timeout(12_000),
  });

  if (!response.ok) {
    throw new Error(`Sumber merespons HTTP ${response.status}`);
  }

  const body = await response.text();
  const items = source.kind === "rss"
    ? parseRss(body, source)
    : source.kind === "tender-html"
      ? parseTenderHtml(body, source)
      : parseHtmlLinks(body, source);
  return items.slice(0, 20);
}

function fingerprintFor(item: ParsedItem): string {
  return createHash("sha256")
    .update(`${item.articleUrl}|${item.title.toLowerCase()}`)
    .digest("hex");
}

function addNewItems(items: ParsedItem[], source: RadarSource, existingFingerprints: Set<string>): number {
  let added = 0;
  const seenThisRun = new Set<string>();

  for (const item of items) {
    const fingerprint = fingerprintFor(item);
    if (existingFingerprints.has(fingerprint) || seenThisRun.has(fingerprint)) continue;

    try {
      db.insert(radarArticles)
        .values({
          id: fingerprint.slice(0, 24),
          fingerprint,
          title: item.title,
          summary: makeSummary(item.summary, item.title),
          category: source.category,
          sourceName: source.name,
          sourceUrl: source.sourceUrl,
          articleUrl: item.articleUrl,
          publishedAt: item.publishedAt,
          fetchedAt: new Date(),
          importance: getImportance(item.title, item.summary),
          status: "published",
        })
        .run();
    } catch (error) {
      if ((error as { code?: string }).code === "SQLITE_CONSTRAINT_UNIQUE") {
        existingFingerprints.add(fingerprint);
        continue;
      }
      throw error;
    }

    existingFingerprints.add(fingerprint);
    seenThisRun.add(fingerprint);
    added += 1;
  }

  return added;
}

export function getRadarArticles(category?: string): RadarArticle[] {
  const articles = db
    .select()
    .from(radarArticles)
    .all()
    .filter((article) => article.status === "published")
    .filter((article) => !category || category === "all" || article.category === category)
    .sort((a, b) => {
      const aTime = (a.publishedAt ?? a.fetchedAt).getTime();
      const bTime = (b.publishedAt ?? b.fetchedAt).getTime();
      return bTime - aTime;
    });

  return articles.slice(0, 100);
}

export function getRadarSourceStatuses(): RadarSourceStatus[] {
  return APPROVED_RADAR_SOURCES.map((source) => sourceStatuses.get(source.id)!);
}

export async function refreshRadar(): Promise<RadarRefreshResult> {
  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = (async () => {
    const startedAt = new Date();
    const existingFingerprints = new Set(db.select({ fingerprint: radarArticles.fingerprint }).from(radarArticles).all().map((row) => row.fingerprint));
    let itemsFound = 0;
    let itemsAdded = 0;

    for (const source of APPROVED_RADAR_SOURCES) {
      const current = sourceStatuses.get(source.id)!;
      current.status = "loading";
      current.lastAttemptAt = new Date();
      current.error = null;
      current.itemsFound = 0;
      current.itemsAdded = 0;

      try {
        const items = await fetchSource(source);
        const added = addNewItems(items, source, existingFingerprints);
        current.status = "success";
        current.lastSuccessAt = new Date();
        current.itemsFound = items.length;
        current.itemsAdded = added;
        itemsFound += items.length;
        itemsAdded += added;
      } catch (error) {
        current.status = "error";
        current.error = error instanceof Error ? error.message : "Sumber tidak dapat diambil";
      }
    }

    return {
      startedAt,
      finishedAt: new Date(),
      itemsFound,
      itemsAdded,
      sources: getRadarSourceStatuses(),
    };
  })();

  try {
    return await refreshInFlight;
  } finally {
    refreshInFlight = null;
  }
}

export function startRadarScheduler(): void {
  const firstRun = setTimeout(() => {
    void refreshRadar();
  }, 8_000);
  firstRun.unref();

  const dailyRun = setInterval(() => {
    void refreshRadar();
  }, 24 * 60 * 60 * 1_000);
  dailyRun.unref();
}