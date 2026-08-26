"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import Link from "@/shims/next-link";
import NavbarAuth from "@/components/NavbarAuth";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Gavel,
  Landmark,
  MessageSquare,
  Newspaper,
  Radar,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { withWorkspaceContext, WorkspaceContextBanner, useWorkspaceContext } from "@/lib/workspace-context";
import { saveRadarArticleHandoff } from "@/lib/radar-context";

type RadarCategory = "kementerian" | "lpjk-regulasi" | "infrastruktur" | "tender-pengadaan";
type CategoryFilter = "all" | RadarCategory;

type RadarArticle = {
  id: string;
  title: string;
  summary: string;
  category: RadarCategory;
  sourceName: string;
  sourceUrl: string;
  articleUrl: string;
  publishedAt: string | null;
  fetchedAt: string;
  importance: "normal" | "penting";
};

type SourceStatus = {
  id: string;
  name: string;
  category: RadarCategory;
  sourceUrl: string;
  status: "pending" | "loading" | "success" | "error";
  lastAttemptAt: string | null;
  lastSuccessAt: string | null;
  itemsFound: number;
  itemsAdded: number;
  error: string | null;
  consecutiveFailures: number;
};

type SourceAlert = {
  sourceId: string;
  sourceName: string;
  category: RadarCategory;
  sourceUrl: string;
  reason: "repeated_failures" | "stale";
  message: string;
  error: string | null;
  consecutiveFailures: number;
  lastSuccessAt: string | null;
};

const CATEGORY_META: Record<CategoryFilter, { label: string; shortLabel: string; icon: typeof Radar; tone: string }> = {
  all: { label: "Semua update", shortLabel: "Semua", icon: Radar, tone: "text-cyan-300" },
  kementerian: { label: "Kementerian", shortLabel: "Kementerian", icon: Landmark, tone: "text-blue-300" },
  "lpjk-regulasi": { label: "LPJK & Regulasi", shortLabel: "LPJK", icon: ShieldCheck, tone: "text-violet-300" },
  infrastruktur: { label: "Infrastruktur", shortLabel: "Infrastruktur", icon: Building2, tone: "text-emerald-300" },
  "tender-pengadaan": { label: "Tender harian & pengadaan", shortLabel: "Tender Harian", icon: Gavel, tone: "text-orange-300" },
};

function formatDate(value: string | null): string {
  if (!value) return "Tanggal dari sumber belum tersedia";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Tanggal tidak tersedia";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatDateTime(value: string | null): string {
  if (!value) return "Belum pernah";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Belum tersedia";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function ArticleCard({
  article,
  onElaborate,
}: {
  article: RadarArticle;
  onElaborate: (article: RadarArticle) => void;
}) {
  const category = CATEGORY_META[article.category];
  const CategoryIcon = category.icon;

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-slate-700/80 bg-slate-900/70 p-5 transition-all hover:-translate-y-0.5 hover:border-cyan-400/40 hover:bg-slate-900">
      <div className="mb-4 flex items-start justify-between gap-3">
        <span className={`inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-semibold ${category.tone}`}>
          <CategoryIcon className="h-3.5 w-3.5" />
          {category.shortLabel}
        </span>
        {article.importance === "penting" && (
          <span className="inline-flex items-center gap-1 rounded-full border border-orange-400/30 bg-orange-400/10 px-2.5 py-1 text-[11px] font-semibold text-orange-300">
            <AlertCircle className="h-3.5 w-3.5" />
            Penting
          </span>
        )}
      </div>

      <h2 className="mb-3 line-clamp-3 text-lg font-semibold leading-snug text-white transition-colors group-hover:text-cyan-200">
        {article.title}
      </h2>
      <p className="mb-5 line-clamp-3 text-sm leading-relaxed text-slate-400">{article.summary}</p>

      <div className="mt-auto space-y-3 border-t border-slate-800 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 text-xs text-slate-500">
          <span className="flex min-w-0 items-center gap-1.5 truncate">
            <Newspaper className="h-3.5 w-3.5 shrink-0 text-slate-600" />
            <span className="truncate">{article.sourceName}</span>
          </span>
          <span className="flex shrink-0 items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" />
            {article.publishedAt ? `Terbit ${formatDate(article.publishedAt)}` : `Dipantau ${formatDate(article.fetchedAt)}`}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <a
            href={article.articleUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-300 transition-colors hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          >
            Buka sumber asli
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <button
            type="button"
            onClick={() => onElaborate(article)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-300 transition-colors hover:text-orange-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          >
            Tanya di Chat
            <MessageSquare className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
}

function SourceStatus({ source }: { source: SourceStatus }) {
  const success = source.status === "success";
  const failed = source.status === "error";
  return (
    <a
      href={source.sourceUrl}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2.5 transition-colors hover:border-slate-700"
    >
      {success ? (
        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
      ) : failed ? (
        <AlertCircle className="h-4 w-4 shrink-0 text-orange-400" />
      ) : (
        <Clock3 className="h-4 w-4 shrink-0 text-slate-500" />
      )}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-xs font-medium text-slate-300">{source.name}</span>
        <span className={`block text-[11px] ${failed && source.consecutiveFailures >= 2 ? "text-orange-300" : "text-slate-500"}`}>
          {failed
            ? source.consecutiveFailures >= 2
              ? `Gagal ${source.consecutiveFailures}x berturut-turut`
              : "Sumber belum dapat diambil"
            : success
              ? `${source.itemsFound} update ditemukan`
              : "Menunggu pembaruan"}
        </span>
        <span className="block text-[11px] text-slate-600">
          Terakhir berhasil: {formatDateTime(source.lastSuccessAt)}
        </span>
      </span>
      <ExternalLink className="h-3.5 w-3.5 shrink-0 text-slate-600" />
    </a>
  );
}

export default function RadarKonstruksiPage() {
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [articles, setArticles] = useState<RadarArticle[]>([]);
  const [sources, setSources] = useState<SourceStatus[]>([]);
  const [alerts, setAlerts] = useState<SourceAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const workspaceContext = useWorkspaceContext();
  const [, setLocation] = useLocation();

  const loadArticles = async (signal?: AbortSignal) => {
    const query = category === "all" ? "" : `?category=${encodeURIComponent(category)}`;
    const response = await fetch(`/api/radar/articles${query}`, { signal });
    if (!response.ok) throw new Error("Feed Radar belum dapat dimuat.");
    const payload = await response.json() as { articles: RadarArticle[]; sources: SourceStatus[]; alerts: SourceAlert[] };
    setArticles(payload.articles);
    setSources(payload.sources);
    setAlerts(payload.alerts ?? []);
  };

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    loadArticles(controller.signal)
      .catch((reason: unknown) => {
        if ((reason as { name?: string })?.name !== "AbortError") {
          setError(reason instanceof Error ? reason.message : "Feed Radar belum dapat dimuat.");
        }
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [category]);

  const handleRefresh = async () => {
    setRefreshing(true);
    setNotice(null);
    setError(null);
    try {
      const response = await fetch("/api/radar/refresh", { method: "POST" });
      const payload = await response.json() as {
        error?: string;
        itemsAdded?: number;
        sources?: SourceStatus[];
      };
      if (!response.ok) throw new Error(payload.error || "Sumber belum dapat diperbarui.");
      await loadArticles();

      const failedSources = (payload.sources ?? []).filter((source) => source.status === "error");
      const itemsAdded = payload.itemsAdded ?? 0;

      if (failedSources.length > 0) {
        // Never claim success for a source that actually failed: report the
        // failure explicitly instead of an "update added" message.
        setError(
          `${failedSources.length} dari ${payload.sources?.length ?? failedSources.length} sumber resmi gagal diambil (${failedSources.map((source) => source.name).join(", ")}). Lihat detail di panel "Sumber dipantau".`,
        );
        if (itemsAdded > 0) {
          setNotice(`${itemsAdded} update baru dari sumber lain berhasil ditambahkan.`);
        }
      } else if (itemsAdded > 0) {
        setNotice(`${itemsAdded} update baru berhasil ditambahkan.`);
      } else {
        setNotice("Semua sumber berhasil diperiksa, tidak ada update baru saat ini.");
      }
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Sumber belum dapat diperbarui.");
    } finally {
      setRefreshing(false);
    }
  };

  const handleArticleElaboration = (article: RadarArticle) => {
    const saved = saveRadarArticleHandoff({
      id: article.id,
      title: article.title,
      summary: article.summary,
      sourceName: article.sourceName,
      articleUrl: article.articleUrl,
      publishedAt: article.publishedAt,
    });
    if (!saved) {
      setError("Update belum dapat dibawa ke Chat. Periksa izin penyimpanan browser lalu coba lagi.");
      return;
    }
    setLocation(withWorkspaceContext("/chat?radar=1", workspaceContext.workspaceId));
  };

  const lastUpdated = useMemo(() => {
    const dates = sources.map((source) => source.lastSuccessAt).filter(Boolean).map((value) => new Date(value as string).getTime());
    if (!dates.length) return null;
    return new Date(Math.max(...dates)).toISOString();
  }, [sources]);

  const categoryLabel = CATEGORY_META[category].label;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <NavbarAuth />

      <main>
        <section className="border-b border-slate-800 bg-[radial-gradient(circle_at_top_right,_rgba(8,145,178,0.16),_transparent_42%),linear-gradient(135deg,#020617,#0f172a_55%,#172033)]">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <WorkspaceContextBanner context={workspaceContext} />

            {alerts.length > 0 && (
              <div className="mb-8 rounded-2xl border border-red-400/30 bg-red-500/10 p-5" role="alert">
                <div className="flex items-center gap-2 text-sm font-semibold text-red-200">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  {alerts.length === 1
                    ? "1 sumber resmi butuh perhatian tim"
                    : `${alerts.length} sumber resmi butuh perhatian tim`}
                </div>
                <ul className="mt-3 space-y-2">
                  {alerts.map((alert) => (
                    <li key={alert.sourceId} className="rounded-xl border border-red-400/20 bg-slate-950/40 p-3 text-xs leading-relaxed text-red-100">
                      <span className="font-semibold text-white">{alert.sourceName}</span>
                      {" — "}
                      {alert.message}
                      {alert.error ? ` Penyebab: ${alert.error}.` : ""}
                      {" "}
                      Pembaruan terakhir berhasil: {alert.lastSuccessAt ? formatDateTime(alert.lastSuccessAt) : "belum pernah berhasil"}.
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-[11px] text-red-200/70">
                  Selama sumber ini bermasalah, artikel yang ditampilkan bisa jadi tidak mencakup update terbaru dari sumber tersebut.
                </p>
              </div>
            )}

            <div className="grid gap-10 lg:grid-cols-[1fr_340px] lg:items-end">
              <div>
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">
                  <Radar className="h-4 w-4" />
                  Pusat pemantauan industri
                </div>
                <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
                  Radar <span className="text-cyan-300">Konstruksi</span>
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
                  Update terpilih dari kementerian, LPJK, regulasi, infrastruktur, dan tender—dengan sumber asli yang dapat Anda verifikasi.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link href="/tender" className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-400">
                    Panduan Tender
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/tender-intelligence" className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-200 transition-colors hover:border-cyan-400/40 hover:bg-white/[0.04]">
                    Analisis Tender
                  </Link>
                </div>
              </div>

              <div className="rounded-2xl border border-cyan-400/20 bg-slate-950/50 p-5 shadow-2xl shadow-cyan-950/20">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Agen Kurator Radar</p>
                    <p className="mt-2 text-sm font-medium text-white">
                      {lastUpdated ? `Terakhir berhasil diperbarui ${formatDateTime(lastUpdated)}` : "Menunggu pembaruan pertama"}
                    </p>
                  </div>
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                </div>
                <p className="mt-3 text-xs leading-relaxed text-slate-500">
                  Hanya sumber yang disetujui yang dipantau. Artikel selalu ditautkan ke sumber aslinya.
                </p>
                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-2.5 text-sm font-semibold text-cyan-200 transition-colors hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                  {refreshing ? "Memperbarui sumber..." : "Perbarui sumber sekarang"}
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-4 border-b border-slate-800 pb-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-400">Update terbaru</p>
              <h2 className="mt-1 text-2xl font-bold text-white">{categoryLabel}</h2>
            </div>
            <div className="flex flex-wrap gap-2" aria-label="Filter kategori Radar">
              {(Object.keys(CATEGORY_META) as CategoryFilter[]).map((item) => {
                const meta = CATEGORY_META[item];
                const Icon = meta.icon;
                const active = item === category;
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
                      active
                        ? "border-cyan-400/40 bg-cyan-400/15 text-cyan-200"
                        : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-white"
                    }`}
                  >
                    <Icon className={`h-3.5 w-3.5 ${active ? "text-cyan-300" : meta.tone}`} />
                    {meta.shortLabel}
                  </button>
                );
              })}
            </div>
          </div>

          {notice && (
            <div className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              {notice}
            </div>
          )}
          {error && (
            <div className="mb-5 flex items-center gap-2 rounded-xl border border-orange-400/20 bg-orange-400/10 px-4 py-3 text-sm text-orange-200">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {loading ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => <div key={item} className="h-64 animate-pulse rounded-2xl border border-slate-800 bg-slate-900/70" />)}
            </div>
          ) : articles.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} onElaborate={handleArticleElaboration} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 px-6 py-16 text-center">
              <Radar className="mx-auto h-10 w-10 text-slate-600" />
              <h3 className="mt-4 text-lg font-semibold text-white">Belum ada update tersimpan</h3>
              <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-slate-500">
                Agen Kurator akan menampilkan artikel setelah sumber yang disetujui berhasil dipantau. Tidak ada berita rekaan yang ditampilkan sebagai pengganti.
              </p>
            </div>
          )}

          <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_340px]">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-orange-400/10 p-2.5 text-orange-300">
                  <Gavel className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Bedakan update dan analisis</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-400">
                    Radar Konstruksi menjawab “apa yang baru?”. Gunakan Tender untuk memahami proses pengadaan, dan Tender Intelligence untuk menganalisis dokumen tender yang Anda pilih.
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-400">Sumber dipantau</h3>
                <span className="text-xs text-slate-600">{sources.length} sumber</span>
              </div>
              <div className="space-y-2">
                {sources.map((source) => <SourceStatus key={source.id} source={source} />)}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}