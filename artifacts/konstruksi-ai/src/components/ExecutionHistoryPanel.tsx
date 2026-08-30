"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ExecutionHistoryApiError,
  listExecutionHistory,
  type ExecutionHistoryEntry,
} from "@/lib/execution-history";
import {
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  Link as LinkIcon,
  GitMerge,
  AlertCircle,
  Search,
  Activity,
  Cpu,
  FileText
} from "lucide-react";

const STATUS_CONFIG = {
  pending: { label: "Menunggu", icon: Clock, colorClass: "text-blue-300 bg-blue-950/40 border-blue-800/50" },
  running: { label: "Berjalan", icon: Loader2, colorClass: "text-blue-400 bg-blue-900/40 border-blue-700/50", spin: true },
  succeeded: { label: "Berhasil", icon: CheckCircle2, colorClass: "text-cyan-300 bg-cyan-950/30 border-cyan-800/50" },
  failed: { label: "Gagal", icon: XCircle, colorClass: "text-red-400 bg-red-950/40 border-red-900/50" },
} as const;

const MODULE_CONFIG = {
  solver: { label: "Solver", icon: Cpu },
  tender: { label: "Tender Intelligence", icon: FileText },
} as const;

const METADATA_LABELS: Record<string, string> = {
  outputFormat: "Format",
  hasAdditionalContext: "Konteks tambahan",
  tenderType: "Jenis tender",
  documentCount: "Jumlah dokumen",
  availableDocumentCount: "Dokumen tersedia",
};

function formatMetadataValue(value: string | number | boolean): string {
  if (typeof value === "boolean") return value ? "Ya" : "Tidak";
  return String(value);
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Waktu tidak tersedia";
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
}

export default function ExecutionHistoryPanel({
  workspaceId,
  refreshKey = 0,
}: {
  workspaceId?: string | null;
  refreshKey?: number;
}) {
  const [executions, setExecutions] = useState<ExecutionHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = useCallback(async (showRefreshState = false) => {
    if (showRefreshState) setIsRefreshing(true);
    else setIsLoading(true);
    setError(null);
    try {
      setExecutions(await listExecutionHistory({ workspaceId }));
    } catch (reason) {
      if (reason instanceof ExecutionHistoryApiError && reason.status === 401) {
        setError("Masuk untuk melihat riwayat eksekusi.");
      } else {
        setError(reason instanceof Error ? reason.message : "Riwayat eksekusi tidak dapat dimuat.");
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory, refreshKey]);

  return (
    <section className="mt-10 rounded-xl border border-blue-900/50 bg-[#0a0f1a] p-5 sm:p-7 shadow-2xl backdrop-blur-md">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-blue-900/50 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-blue-500" />
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-500">Jejak Sistem</p>
          </div>
          <h2 className="mt-2 text-xl font-bold tracking-tight text-white">Riwayat Eksekusi</h2>
          <p className="mt-1 text-sm text-blue-200/60">
            Log pemrosesan AI untuk Solver dan Tender Intelligence.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void loadHistory(true)}
          disabled={isLoading || isRefreshing}
          className="group flex items-center gap-2 rounded-md border border-blue-800/60 bg-blue-950/30 px-3 py-1.5 text-xs font-semibold text-blue-300 transition-all hover:border-blue-500 hover:bg-blue-900/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : "transition-transform duration-500 group-hover:rotate-180"}`} />
          {isRefreshing ? "Memuat..." : "Segarkan"}
        </button>
      </div>

      <div className="relative">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-blue-900/20 bg-blue-950/10 py-12">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            <p className="text-sm font-medium text-blue-300/60">Mengambil riwayat eksekusi...</p>
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 rounded-lg border border-red-900/50 bg-red-950/20 p-4">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-sm font-medium text-red-200">{error}</p>
          </div>
        ) : executions.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-blue-800/40 bg-blue-950/10 py-12 text-center">
            <Search className="h-6 w-6 text-blue-500/50" />
            <div>
              <p className="text-sm font-medium text-blue-300">Belum ada aktivitas</p>
              <p className="mt-1 text-xs text-blue-300/60">Riwayat eksekusi akan muncul di sini setelah Anda menjalankan proses AI.</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {executions.map((execution) => {
              const status = STATUS_CONFIG[execution.status];
              const module = MODULE_CONFIG[execution.module];
              const StatusIcon = status.icon;
              const ModuleIcon = module.icon;
              const metadataEntries = execution.inputSummary.metadata ? Object.entries(execution.inputSummary.metadata) : [];
              const hasMetadata = metadataEntries.length > 0;

              return (
                <article key={execution.id} className="group relative flex flex-col gap-3 rounded-lg border border-blue-900/40 bg-[#0d1424] p-4 transition-all hover:border-blue-500/40 hover:bg-[#121c32]">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-blue-200">
                          <ModuleIcon className="h-3.5 w-3.5" />
                          <span>{module.label}</span>
                        </div>
                        <span className="text-blue-800/80">•</span>
                        <div className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide ${status.colorClass}`}>
                          <StatusIcon className={`h-3 w-3 ${'spin' in status && status.spin ? "animate-spin" : ""}`} />
                          <span className="uppercase">{status.label}</span>
                        </div>
                        {execution.retryOfId && (
                          <>
                            <span className="text-blue-800/80">•</span>
                            <div className="flex items-center gap-1 text-[11px] text-blue-400/80" title={`Pengulangan dari: ${execution.retryOfId}`}>
                              <GitMerge className="h-3 w-3" />
                              <span>Retry</span>
                            </div>
                          </>
                        )}
                      </div>

                      <div className="mt-1">
                        <h3 className="text-sm font-semibold tracking-tight text-white">
                          {execution.inputSummary.label}
                        </h3>
                        {execution.inputSummary.details && (
                          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-blue-100/70 transition-colors group-hover:text-blue-100/90">
                            {execution.inputSummary.details}
                          </p>
                        )}
                      </div>
                    </div>

                    <time className="shrink-0 whitespace-nowrap text-[11px] font-medium tracking-wide text-blue-300/60" dateTime={execution.createdAt}>
                      {formatDate(execution.createdAt)}
                    </time>
                  </div>

                  {(hasMetadata || execution.resultRef || execution.errorMessage) && (
                    <div className="mt-2 flex flex-col gap-2 border-t border-blue-900/30 pt-3">
                      {(hasMetadata || execution.resultRef) && (
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px]">
                          {metadataEntries.map(([key, val]) => (
                            <div key={key} className="flex items-center gap-1.5 text-blue-300/60">
                              <span className="font-medium uppercase tracking-wider text-blue-400/50">
                                {METADATA_LABELS[key] ?? key}:
                              </span>
                              <span className="text-blue-200">{formatMetadataValue(val)}</span>
                            </div>
                          ))}
                          {execution.resultRef && (
                            <div className="flex items-center gap-1.5 text-cyan-300/80">
                              <LinkIcon className="h-3 w-3" />
                              <span className="font-medium">Ref: {execution.resultRef}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {execution.errorMessage && (
                        <div className="flex items-start gap-2 rounded bg-red-950/30 p-2 text-xs text-red-300/90 border border-red-900/30">
                          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                          <p className="leading-snug">{execution.errorMessage}</p>
                        </div>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
