"use client";

import { useCallback, useEffect, useState } from "react";
import {
  BookOpen,
  ChevronRight,
  Clock,
  FileText,
  Loader2,
  RefreshCw,
  Search,
  AlertCircle,
  FolderOpen
} from "lucide-react";
import {
  getSolverAnalysisResult,
  listSolverAnalysisHistory,
  SolverHistoryApiError,
  type SolverAnalysisHistorySummary,
  type SolverAnalysisResult,
} from "@/lib/solver-history";

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Waktu tidak tersedia";
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function SolverHistoryPanel({
  workspaceId,
  refreshKey = 0,
  onOpen,
}: {
  workspaceId?: string | null;
  refreshKey?: number;
  onOpen: (result: SolverAnalysisResult) => void;
}) {
  const [results, setResults] = useState<SolverAnalysisHistorySummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [openingId, setOpeningId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadResults = useCallback(async (manual = false) => {
    if (manual) setIsRefreshing(true);
    else setIsLoading(true);
    setError(null);
    try {
      setResults(await listSolverAnalysisHistory({ workspaceId }));
    } catch (reason) {
      if (reason instanceof SolverHistoryApiError && reason.status === 401) {
        setError("Masuk untuk melihat hasil Solver tersimpan.");
      } else {
        setError(reason instanceof Error ? reason.message : "Hasil Solver tidak dapat dimuat.");
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    void loadResults();
  }, [loadResults, refreshKey]);

  const handleOpen = async (id: string) => {
    setOpeningId(id);
    setError(null);
    try {
      onOpen(await getSolverAnalysisResult(id));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Hasil Solver tidak dapat dibuka.");
    } finally {
      setOpeningId(null);
    }
  };

  return (
    <section className="mt-10 rounded-xl border border-blue-900/50 bg-[#0a0f1a] p-5 shadow-2xl backdrop-blur-md sm:p-7">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-blue-900/50 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-blue-500" />
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-500">Hasil Tersimpan</p>
          </div>
          <h2 className="mt-2 text-xl font-bold tracking-tight text-white">Riwayat Analisis Solver</h2>
          <p className="mt-1 text-sm text-blue-200/60">
            Buka kembali analisis lengkap yang pernah Anda simpan.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void loadResults(true)}
          disabled={isLoading || isRefreshing}
          className="group flex items-center gap-2 rounded-md border border-blue-800/60 bg-blue-950/30 px-3 py-1.5 text-xs font-semibold text-blue-300 transition-all hover:border-blue-500 hover:bg-blue-900/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : "transition-transform duration-500 group-hover:rotate-180"}`} />
          {isRefreshing ? "Memuat..." : "Segarkan"}
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-blue-900/20 bg-blue-950/10 py-12">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          <p className="text-sm font-medium text-blue-300/60">Mengambil hasil tersimpan...</p>
        </div>
      ) : error ? (
        <div className="flex items-center gap-3 rounded-lg border border-red-900/50 bg-red-950/20 p-4">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
          <p className="text-sm font-medium text-red-200">{error}</p>
        </div>
      ) : results.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-blue-800/40 bg-blue-950/10 py-12 text-center">
          <Search className="h-6 w-6 text-blue-500/50" />
          <div>
            <p className="text-sm font-medium text-blue-300">Belum ada hasil tersimpan</p>
            <p className="mt-1 text-xs text-blue-300/60">Jalankan analisis Solver untuk menyimpannya di sini.</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-3">
          {results.map((result) => (
            <article
              key={result.id}
              className="group relative flex flex-col gap-3 rounded-lg border border-blue-900/40 bg-[#0d1424] p-4 transition-all hover:border-blue-500/40 hover:bg-[#121c32] sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-blue-200">
                    <FolderOpen className="h-3.5 w-3.5" />
                    <span>{result.domain}</span>
                  </div>
                  <span className="text-blue-800/80">•</span>
                  <div className="flex items-center gap-1 text-[11px] text-blue-400/80 bg-blue-950/50 px-2 py-0.5 rounded-full border border-blue-900/50">
                    <FileText className="h-3 w-3" />
                    <span>{result.outputFormat}</span>
                  </div>
                </div>

                <h3 className="text-sm font-semibold tracking-tight text-white line-clamp-2 leading-relaxed">
                  {result.problem}
                </h3>

                <div className="flex items-center gap-1.5 text-[11px] text-blue-300/60 mt-1">
                  <Clock className="h-3 w-3" />
                  <time dateTime={result.createdAt}>{formatDate(result.createdAt)}</time>
                </div>
              </div>

              <button
                type="button"
                onClick={() => void handleOpen(result.id)}
                disabled={openingId !== null}
                className="mt-2 sm:mt-0 shrink-0 inline-flex items-center justify-center gap-2 rounded-md border border-blue-700/60 bg-blue-900/20 px-4 py-2 text-xs font-semibold text-blue-200 transition-colors hover:border-blue-400 hover:bg-blue-800/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {openingId === result.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ChevronRight className="h-3.5 w-3.5" />}
                {openingId === result.id ? "Membuka..." : "Buka Hasil"}
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}