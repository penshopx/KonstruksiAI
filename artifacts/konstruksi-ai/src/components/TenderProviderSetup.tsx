import { useEffect, useRef, useState } from "react";
import type { CheckTenderProviderSetup200 } from "@workspace/api-client-react";
import TenderProviderAuditHistory from "./TenderProviderAuditHistory";

export default function TenderProviderSetup() {
  const [canCheck, setCanCheck] = useState(false);
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<CheckTenderProviderSetup200 | null>(null);
  const [error, setError] = useState("");
  const inFlight = useRef(false);
  const [auditRefresh, setAuditRefresh] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/tender-intelligence/provider-setup", {
      credentials: "include", signal: controller.signal,
    }).then(async response => {
      if (response.ok) {
        const data = await response.json();
        if (!controller.signal.aborted) setCanCheck(data.canCheck === true);
      }
    }).catch(() => { /* Fail closed: do not show admin controls without authorization. */ });
    return () => controller.abort();
  }, []);

  const check = async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    setChecking(true);
    setResult(null);
    setError("");
    try {
      const response = await fetch("/api/tender-intelligence/provider-setup", {
        method: "POST", credentials: "include",
      });
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          setError("Akses administrator tidak lagi tersedia. Muat ulang halaman atau masuk kembali.");
        } else if (response.status === 429) {
          setError("Batas pemeriksaan tercapai. Tunggu satu menit lalu coba kembali.");
        } else {
          setError("Pemeriksaan tidak berhasil. Coba kembali nanti.");
        }
        return;
      }
      setResult(await response.json());
    } catch {
      setError("Tidak dapat menghubungi server. Periksa koneksi lalu coba kembali.");
    } finally {
      setAuditRefresh(value => value + 1);
      inFlight.current = false;
      setChecking(false);
    }
  };

  if (!canCheck) return null;
  return (
    <section className="mb-6 rounded-xl border border-slate-700 bg-slate-900 p-5" aria-label="Konfigurasi AI administrator">
      <h2 className="font-semibold text-slate-100">Pemeriksaan AI — Administrator</h2>
      <p className="mt-1 text-sm text-slate-300">
        Periksa koneksi dan akses provider sebelum tim menjalankan analisis. Permintaan uji singkat menggunakan sedikit kuota AI, tanpa mengirim dokumen proyek.
      </p>
      <button type="button" onClick={check} disabled={checking}
        className="mt-3 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60">
        {checking ? "Memeriksa provider AI..." : "Periksa konfigurasi AI"}
      </button>
      <div role="status" aria-live="polite" className="mt-3 text-sm">
        {result && <>
          <p className={result.ready ? "font-medium text-green-300" : "font-medium text-amber-300"}>{result.message}</p>
          <p className="mt-1 text-slate-200">{result.action}</p>
          <p className="mt-1 text-slate-400">Diperiksa: {new Date(result.checkedAt).toLocaleString("id-ID")}. Status dapat berubah.</p>
        </>}
        {error && <p className="text-amber-300">{error}</p>}
      </div>
      <TenderProviderAuditHistory refreshVersion={auditRefresh} />
    </section>
  );
}
