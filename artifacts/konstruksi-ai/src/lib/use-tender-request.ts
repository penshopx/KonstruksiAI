import { useCallback, useEffect, useRef, useState } from "react";
import { getSessionLookup } from "./auth";
import type { TenderAnalysisResult } from "./tender-history";

interface RequestIdentity { id: string; fingerprint: string | null; recoveryOnly?: boolean }

// Persist only identity + digest, never project text, documents, or results.
export function useTenderRequest(workspaceId: string | null, onResult: (result: TenderAnalysisResult) => void, onScopeChange: () => void) {
  const [identity, setIdentity] = useState<RequestIdentity | null>(null);
  const [state, setState] = useState<"loading" | "empty" | "unknown" | "running" | "failed" | "succeeded">("loading");
  const [message, setMessage] = useState("");
  const [executionId, setExecutionId] = useState<string | null>(null);
  const storageKey = useRef<string | null>(null);
  const generation = useRef(0);
  const onResultRef = useRef(onResult);
  const onScopeChangeRef = useRef(onScopeChange);
  onResultRef.current = onResult;
  onScopeChangeRef.current = onScopeChange;
  const lookup = useRef(0);

  const recover = useCallback(async () => {
    const lookupId = ++lookup.current;
    const version = generation.current;
    const session = await getSessionLookup();
    if (version !== generation.current || lookupId !== lookup.current) return;
    if (session.status === "error") {
      setState("unknown");
      setMessage("Status akun belum dapat diperiksa. Data dan ID permintaan tetap tersedia.");
      return;
    }
    if (session.status === "anonymous") {
      if (storageKey.current) onScopeChangeRef.current();
      generation.current++;
      storageKey.current = null;
      setIdentity(null);
      setState("unknown");
      setMessage("Masuk kembali atau periksa koneksi untuk memulihkan permintaan.");
      return;
    }
    const key = `tender-request:${session.user.userId}:${workspaceId ?? "personal"}`;
    if (storageKey.current && storageKey.current !== key) {
      generation.current++;
      onScopeChangeRef.current();
    }
    const scopeVersion = generation.current;
    storageKey.current = key;
    setExecutionId(null);
    let saved: RequestIdentity | null = null;
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (typeof parsed.id === "string" && (typeof parsed.fingerprint === "string"
          || (parsed.recoveryOnly === true && parsed.fingerprint === null))) saved = parsed;
        else throw new Error("Invalid identity");
      }
    } catch {
      setState("unknown");
      setMessage("Identitas pemulihan tidak dapat dibaca. Aktifkan penyimpanan browser sebelum melanjutkan.");
      return;
    }
    setIdentity(saved);
    try {
      const query = workspaceId ? `?workspaceId=${encodeURIComponent(workspaceId)}` : "";
      // Check the server even when a different, terminal local identity exists.
      // Discovery is active-only, never a replacement for completed history.
      const discovery = await fetch(`/api/tender-intelligence/requests/active${query}`,
        { credentials: "include", cache: "no-store" });
      const discovered = await discovery.json();
      if (scopeVersion !== generation.current || lookupId !== lookup.current || storageKey.current !== key) return;
      if (!discovery.ok) {
        if (discovery.status === 401 || discovery.status === 403 || discovery.status === 404) {
          onScopeChangeRef.current();
          setIdentity(null);
        }
        setState("unknown");
        setMessage(discovered.error || "Permintaan aktif belum dapat diperiksa. Periksa status sebelum memulai analisis baru.");
        return;
      }
      if (!Object.hasOwn(discovered, "activeRequest")
        || (discovered.activeRequest !== null && typeof discovered.activeRequest?.executionId !== "string")) {
        throw new Error("Invalid discovery response");
      }
      if (discovered.activeRequest) {
        // Persist a read-only server reference, never a reusable POST identity.
        saved = { id: discovered.activeRequest.executionId, fingerprint: null, recoveryOnly: true };
        localStorage.setItem(key, JSON.stringify(saved));
        setIdentity(saved);
      }
      if (!saved) { setState("empty"); setMessage(""); return; }
      const reference = saved.recoveryOnly ? "executions/" : "";
      const response = await fetch(`/api/tender-intelligence/requests/${reference}${encodeURIComponent(saved.id)}${query}`,
        { credentials: "include", cache: "no-store" });
      const body = await response.json();
      if (scopeVersion !== generation.current || lookupId !== lookup.current || storageKey.current !== key) return;
      if (typeof body.executionId === "string") setExecutionId(body.executionId);
      if (response.status === 202) {
        setState("running");
        setMessage("Analisis masih berjalan. Status dipulihkan tanpa mengirim ulang ke AI.");
      } else if (response.ok && body.result) {
        setState("succeeded");
        setMessage("Hasil tersimpan berhasil dipulihkan tanpa analisis ulang.");
        onResultRef.current(body.result);
      } else if (body.status === "failed") {
        setState("failed");
        setMessage(`${body.error} Pilih Analisis baru untuk memulai percobaan terpisah.`);
      } else {
        if (response.status === 401 || response.status === 403 || response.status === 404) {
          onScopeChangeRef.current();
          setIdentity(null);
        }
        setState("unknown");
        setMessage(body.error || "Status belum dapat dipastikan. Periksa status sebelum memulai analisis baru.");
      }
    } catch {
      if (scopeVersion !== generation.current || lookupId !== lookup.current) return;
      setState("unknown");
      setMessage("Koneksi terputus. ID permintaan tetap disimpan; periksa status tanpa menjalankan AI lagi.");
    }
  }, [workspaceId]);

  useEffect(() => {
    generation.current++;
    storageKey.current = null;
    onScopeChangeRef.current();
    setIdentity(null);
    setExecutionId(null);
    setState("loading");
    void recover();
    const onFocus = () => { void recover(); };
    window.addEventListener("focus", onFocus);
    window.addEventListener("storage", onFocus);
    window.addEventListener("online", onFocus);
    return () => {
      generation.current++;
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("storage", onFocus);
      window.removeEventListener("online", onFocus);
    };
  }, [recover]);

  useEffect(() => {
    if (state !== "running") return;
    const timer = setInterval(() => { void recover(); }, 3000);
    return () => clearInterval(timer);
  }, [state, recover]);

  async function begin(input: unknown): Promise<{ id: string; version: number }> {
    if (state !== "empty") throw new Error("Periksa status permintaan aktif sebelum memulai analisis baru.");
    const version = generation.current;
    // Recheck account on every send; an old tab must not send with another
    // account's local request ID after logout/login elsewhere.
    const session = await getSessionLookup();
    if (version !== generation.current) throw new Error("Konteks berubah. Periksa akun dan ruang proyek sebelum melanjutkan.");
    if (session.status !== "authenticated") throw new Error("Masuk kembali sebelum menjalankan analisis.");
    const key = `tender-request:${session.user.userId}:${workspaceId ?? "personal"}`;
    if (storageKey.current && storageKey.current !== key) {
      generation.current++;
      onScopeChangeRef.current();
      throw new Error("Akun berubah. Muat ulang halaman sebelum menjalankan analisis.");
    }
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(JSON.stringify(input)));
    if (version !== generation.current) throw new Error("Konteks berubah. Periksa akun dan ruang proyek sebelum melanjutkan.");
    const fingerprint = Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, "0")).join("");
    const raw = localStorage.getItem(key);
    const saved = raw ? JSON.parse(raw) as RequestIdentity : null;
    if (saved?.recoveryOnly) {
      throw new Error("Permintaan dari perangkat lain hanya dapat dipulihkan. Pilih Analisis baru setelah proses selesai.");
    }
    if (saved && saved.fingerprint !== fingerprint) {
      throw new Error("Input berubah. Pulihkan permintaan sebelumnya atau pilih Analisis baru secara eksplisit.");
    }
    const next = saved ?? { id: crypto.randomUUID(), fingerprint };
    // Fail before POST when durable browser identity cannot be saved.
    localStorage.setItem(key, JSON.stringify(next));
    storageKey.current = key;
    setIdentity(next);
    setState("running");
    setMessage("Permintaan tersimpan. Refresh akan memulihkan status, bukan mengirim analisis baru.");
    return { id: next.id, version };
  }

  function reset() {
    if (state === "running" || state === "loading" || !storageKey.current) return false;
    if (!window.confirm("Mulai analisis baru? Ini dapat menggunakan kuota AI lagi. Pastikan permintaan sebelumnya sudah selesai di riwayat.")) return false;
    localStorage.removeItem(storageKey.current);
    generation.current++;
    setIdentity(null);
    setState("empty");
    setMessage("");
    return true;
  }

  return { identity, state, message, executionId, begin, recover, reset,
    isCurrent: (version: number) => version === generation.current };
}
