import { useEffect, useState } from "react";
import type { TenderProviderAuditEvent } from "@workspace/api-client-react";

const outcomes: Record<TenderProviderAuditEvent["code"], string> = {
  AI_PROVIDER_READY: "Provider siap",
  AI_PROVIDER_NOT_CONFIGURED: "Belum dikonfigurasi",
  AI_PROVIDER_AUTHENTICATION_FAILED: "Autentikasi ditolak",
  AI_PROVIDER_CREDITS_EXHAUSTED: "Kredit atau kuota habis",
  AI_PROVIDER_RATE_LIMITED: "Dibatasi provider",
  AI_INVALID_MODEL_RESPONSE: "Respons tidak valid",
  AI_PROVIDER_REQUEST_REJECTED: "Konfigurasi ditolak",
  AI_PROVIDER_UNAVAILABLE: "Provider tidak tersedia",
  AI_INTERNAL_ERROR: "Kesalahan internal",
  AI_SETUP_RATE_LIMITED: "Batas pemeriksaan aplikasi tercapai",
};

export default function TenderProviderAuditHistory({ refreshVersion }: { refreshVersion: number }) {
  const [items, setItems] = useState<TenderProviderAuditEvent[] | null>(null);
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const onFocus = () => setRefresh(value => value + 1);
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setItems(null);
    setError("");
    fetch("/api/tender-intelligence/provider-setup/history", {
      credentials: "include", signal: controller.signal,
    }).then(async response => {
      if (!response.ok) {
        throw new Error(response.status === 401 || response.status === 403
          ? "Riwayat hanya tersedia bagi administrator aktif."
          : "Riwayat pemeriksaan gagal dimuat. Coba muat ulang.");
      }
      const data = await response.json();
      if (!controller.signal.aborted) setItems(data.items);
    }).catch(error => {
      if (!controller.signal.aborted) {
        setError(error instanceof Error ? error.message : "Riwayat pemeriksaan gagal dimuat.");
      }
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false);
    });
    return () => controller.abort();
  }, [refreshVersion, refresh]);

  return (
    <div className="mt-5 border-t border-slate-700 pt-4">
      <h3 className="font-medium text-slate-100">Riwayat pemeriksaan konfigurasi AI</h3>
      <p className="mt-1 text-sm text-slate-300">
        Maksimal 50 pemeriksaan terbaru, urutan terbaru dahulu. Khusus administrator dan terpisah dari riwayat analisis Tender.
        Identitas menggunakan ID akun internal, tanpa kredensial atau data proyek.
      </p>
      <button type="button" disabled={loading} onClick={() => setRefresh(value => value + 1)}
        className="my-3 rounded-lg border border-slate-600 px-3 py-2 text-sm text-slate-100 hover:bg-slate-800 disabled:opacity-60">
        Muat ulang riwayat
      </button>
      {loading && <p className="text-sm text-slate-300">Memuat riwayat pemeriksaan...</p>}
      {error && <p role="alert" className="text-sm text-amber-300">{error}</p>}
      {items?.length === 0 && <p className="text-sm text-slate-300">Belum ada pemeriksaan konfigurasi AI.</p>}
      {!!items?.length && <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-200">
          <caption className="sr-only">Pemeriksaan konfigurasi AI terbaru</caption>
          <thead><tr className="border-b border-slate-700">
            <th scope="col" className="p-2">Waktu</th>
            <th scope="col" className="p-2">Akun internal</th>
            <th scope="col" className="p-2">Hasil</th>
          </tr></thead>
          <tbody>{items.map(item => <tr key={item.id} className="border-b border-slate-800">
            <td className="whitespace-nowrap p-2">{new Date(item.checkedAt).toLocaleString("id-ID")}</td>
            <td className="p-2">Akun #{item.accountId}</td>
            <td className="p-2">
              <span>{outcomes[item.code]}</span>
              <code className="mt-1 block text-xs text-slate-400">{item.code}</code>
            </td>
          </tr>)}</tbody>
        </table>
      </div>}
    </div>
  );
}
