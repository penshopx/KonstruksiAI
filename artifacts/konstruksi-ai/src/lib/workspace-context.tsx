"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import Link from "@/shims/next-link";
import { AlertCircle, ArrowLeft, FolderKanban, Loader2, X } from "lucide-react";
import {
  getProjectWorkspace,
  ProjectWorkspaceApiError,
  type ProjectWorkspace,
} from "@/lib/project-workspaces";

const WORKSPACE_QUERY_KEY = "workspace";
const WORKSPACE_ACCESS_REVOKED_STORAGE_KEY = "konstruksi_workspace_access_revoked_v1";
const WORKSPACE_ACCESS_REVOKED_CHANNEL = "konstruksi_workspace_access_revoked";
const WORKSPACE_ACCESS_REVOKED_EVENT = "konstruksi:workspace-access-revoked";

export interface WorkspaceAccessRevocation {
  workspaceId: string;
}

function parseWorkspaceAccessRevocation(value: unknown): WorkspaceAccessRevocation | null {
  if (!value || typeof value !== "object") return null;
  const workspaceId = (value as { workspaceId?: unknown }).workspaceId;
  return typeof workspaceId === "string" && workspaceId.trim()
    ? { workspaceId: workspaceId.trim() }
    : null;
}

function readWorkspaceAccessRevocation(value: string | null): WorkspaceAccessRevocation | null {
  if (!value) return null;
  try {
    return parseWorkspaceAccessRevocation(JSON.parse(value));
  } catch {
    return null;
  }
}

export function notifyWorkspaceAccessRevoked(workspaceId: string): void {
  const normalizedWorkspaceId = workspaceId.trim();
  if (!normalizedWorkspaceId || typeof window === "undefined") return;

  const message = JSON.stringify({
    workspaceId: normalizedWorkspaceId,
    nonce: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
  });

  try {
    window.localStorage.setItem(WORKSPACE_ACCESS_REVOKED_STORAGE_KEY, message);
  } catch {
    // BroadcastChannel may still work when browser storage is unavailable.
  }

  window.dispatchEvent(new CustomEvent(WORKSPACE_ACCESS_REVOKED_EVENT, {
    detail: { workspaceId: normalizedWorkspaceId },
  }));

  try {
    if ("BroadcastChannel" in window) {
      const channel = new BroadcastChannel(WORKSPACE_ACCESS_REVOKED_CHANNEL);
      channel.postMessage({ workspaceId: normalizedWorkspaceId });
      channel.close();
    }
  } catch {
    // The storage event remains available as the cross-tab fallback.
  }
}

export function subscribeToWorkspaceAccessRevoked(
  listener: (revocation: WorkspaceAccessRevocation) => void,
): () => void {
  if (typeof window === "undefined") return () => {};

  const handleStorage = (event: StorageEvent) => {
    if (event.key !== WORKSPACE_ACCESS_REVOKED_STORAGE_KEY) return;
    const revocation = readWorkspaceAccessRevocation(event.newValue);
    if (revocation) listener(revocation);
  };
  window.addEventListener("storage", handleStorage);

  const handleLocalEvent = (event: Event) => {
    const revocation = parseWorkspaceAccessRevocation((event as CustomEvent).detail);
    if (revocation) listener(revocation);
  };
  window.addEventListener(WORKSPACE_ACCESS_REVOKED_EVENT, handleLocalEvent);

  let channel: BroadcastChannel | null = null;
  try {
    if ("BroadcastChannel" in window) {
      channel = new BroadcastChannel(WORKSPACE_ACCESS_REVOKED_CHANNEL);
      channel.addEventListener("message", (event: MessageEvent) => {
        const revocation = parseWorkspaceAccessRevocation(event.data);
        if (revocation) listener(revocation);
      });
    }
  } catch {
    channel = null;
  }

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(WORKSPACE_ACCESS_REVOKED_EVENT, handleLocalEvent);
    channel?.close();
  };
}

const STAGE_LABELS: Record<string, string> = {
  tender: "Kesiapan & Tender",
  planning: "Perencanaan & RAB",
  execution: "Pelaksanaan",
  monitoring: "Monitoring & Mutu",
  handover: "Serah Terima & Knowledge Reuse",
};

export function withWorkspaceContext(href: string, workspaceId?: string | null): string {
  if (!workspaceId) return href;

  const [pathAndSearch, hash = ""] = href.split("#", 2);
  const separator = pathAndSearch.includes("?") ? "&" : "?";
  return `${pathAndSearch}${separator}${WORKSPACE_QUERY_KEY}=${encodeURIComponent(workspaceId)}${hash ? `#${hash}` : ""}`;
}

export function getWorkspaceStageLabel(stageId: string): string {
  return STAGE_LABELS[stageId] ?? "Tahap proyek";
}

function getWorkspaceId(search: string): string | null {
  const value = new URLSearchParams(search).get(WORKSPACE_QUERY_KEY);
  return value?.trim() || null;
}

export function useWorkspaceContext() {
  const [location, setLocation] = useLocation();
  const search = typeof window === "undefined" ? "" : window.location.search;
  const requestedWorkspaceId = useMemo(() => getWorkspaceId(search), [location, search]);
  const [workspaceOverrideId, setWorkspaceOverrideId] = useState<string | null | undefined>(undefined);
  const workspaceId = workspaceOverrideId !== undefined ? workspaceOverrideId : requestedWorkspaceId;
  const [workspace, setWorkspace] = useState<ProjectWorkspace | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(workspaceId));
  const [error, setError] = useState<string | null>(null);

  const setWorkspaceContext = useCallback((nextWorkspaceId: string | null) => {
    setWorkspaceOverrideId(nextWorkspaceId);
    const query = new URLSearchParams(typeof window === "undefined" ? "" : window.location.search);
    if (nextWorkspaceId) {
      query.set(WORKSPACE_QUERY_KEY, nextWorkspaceId);
    } else {
      query.delete(WORKSPACE_QUERY_KEY);
    }
    const remaining = query.toString();
    setLocation(remaining ? `${location}?${remaining}` : location);
  }, [location, setLocation]);

  const clearContext = useCallback(() => setWorkspaceContext(null), [setWorkspaceContext]);

  useEffect(() => subscribeToWorkspaceAccessRevoked(({ workspaceId: revokedWorkspaceId }) => {
    if (workspaceId !== revokedWorkspaceId) return;
    setWorkspace(null);
    setError(null);
    setIsLoading(false);
    clearContext();
  }), [clearContext, workspaceId]);

  useEffect(() => {
    let cancelled = false;

    if (!workspaceId) {
      setWorkspace(null);
      setError(null);
      setIsLoading(false);
      return () => {
        cancelled = true;
      };
    }

    setWorkspace(null);
    setError(null);
    setIsLoading(true);

    getProjectWorkspace(workspaceId)
      .then((savedWorkspace) => {
        if (!cancelled) setWorkspace(savedWorkspace);
      })
      .catch((reason: unknown) => {
        if (cancelled) return;
        if (reason instanceof ProjectWorkspaceApiError && reason.status === 404) {
          notifyWorkspaceAccessRevoked(workspaceId);
          clearContext();
          return;
        }
        if (reason instanceof ProjectWorkspaceApiError && reason.status === 401) {
          setError("Masuk untuk menggunakan konteks ruang proyek.");
        } else {
          setError("Konteks ruang proyek tidak tersedia atau bukan milik akun ini.");
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [clearContext, workspaceId]);

  useEffect(() => {
    if (workspaceOverrideId !== undefined && workspaceOverrideId === requestedWorkspaceId) {
      setWorkspaceOverrideId(undefined);
    }
  }, [requestedWorkspaceId, workspaceOverrideId]);

  return { workspaceId, workspace, isLoading, error, clearContext, setWorkspaceContext };
}

export type WorkspaceContextState = ReturnType<typeof useWorkspaceContext>;

export function WorkspaceContextBanner({ context }: { context: WorkspaceContextState }) {
  const { workspaceId, workspace, isLoading, error, clearContext } = context;

  if (!workspaceId) return null;

  if (error || !workspace) {
    if (!error && (isLoading || workspace?.id !== workspaceId)) {
      return (
        <div className="mb-5 flex items-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/[0.07] px-4 py-3 text-sm text-cyan-100">
          <Loader2 className="h-4 w-4 animate-spin text-cyan-300" />
          Memuat konteks ruang proyek…
        </div>
      );
    }

    return (
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-orange-400/20 bg-orange-400/[0.08] px-4 py-3 text-sm text-orange-100">
        <span className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 text-orange-300" />
          {error ?? "Konteks ruang proyek tidak tersedia."}
        </span>
        <button
          type="button"
          onClick={clearContext}
          className="inline-flex items-center gap-1.5 rounded-lg border border-orange-300/30 px-2.5 py-1.5 text-xs font-semibold text-orange-100 transition-colors hover:bg-orange-300/10"
        >
          <X className="h-3.5 w-3.5" />
          Lanjutkan tanpa konteks
        </button>
      </div>
    );
  }

  return (
    <aside className="mb-5 rounded-xl border border-cyan-400/25 bg-cyan-400/[0.08] px-4 py-3 text-slate-100">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-300">
            <FolderKanban className="h-3.5 w-3.5" />
            Konteks Ruang Proyek
          </p>
          <p className="mt-1 truncate text-sm font-semibold text-white">{workspace.name}</p>
          <p className="mt-0.5 text-xs text-slate-300">{getWorkspaceStageLabel(workspace.stageId)}</p>
          {workspace.notes && (
            <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-400">
              {workspace.notes}
            </p>
          )}
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Link
            href={withWorkspaceContext("/ruang-proyek", workspace.id)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-300/25 px-2.5 py-1.5 text-xs font-semibold text-cyan-100 transition-colors hover:bg-cyan-300/10"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Kembali ke ruang
          </Link>
          <button
            type="button"
            onClick={clearContext}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-500/40 px-2.5 py-1.5 text-xs font-semibold text-slate-300 transition-colors hover:bg-white/[0.06] hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
            Tanpa konteks
          </button>
        </div>
      </div>
    </aside>
  );
}