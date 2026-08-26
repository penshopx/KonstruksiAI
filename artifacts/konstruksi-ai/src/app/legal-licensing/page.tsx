"use client";

import { useEffect, useState, useCallback } from "react";
import {
  calculateRenewalUrgency,
  type LegalEntity,
  type LicenseStatus,
  type LicenseRequirement,
  type LegalComplianceCheck,
} from "@/lib/legal-licensing";
import NavbarAuth from "@/components/NavbarAuth";

const TABS = [
  { id: "overview", label: "📊 Overview", icon: "📊" },
  { id: "compliance", label: "✅ Kepatuhan", icon: "✅" },
  { id: "requirements", label: "📋 Persyaratan", icon: "📋" },
  { id: "renewal", label: "🔄 Perpanjangan", icon: "🔄" },
];

const STATUS_COLORS: Record<string, string> = {
  compliant: "bg-green-500/20 text-green-400 border-green-500/40",
  non_compliant: "bg-red-500/20 text-red-400 border-red-500/40",
  expired: "bg-red-500/20 text-red-400 border-red-500/40",
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/40",
  approved: "bg-green-500/20 text-green-400 border-green-500/40",
  rejected: "bg-red-500/20 text-red-400 border-red-500/40",
  suspended: "bg-orange-500/20 text-orange-400 border-orange-500/40",
  not_applied: "bg-gray-500/20 text-gray-400 border-gray-500/40",
  applied: "bg-blue-500/20 text-blue-400 border-blue-500/40",
};

const RISK_COLORS: Record<string, string> = {
  low: "bg-green-500/20 text-green-400 border-green-500/40",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/40",
  high: "bg-orange-500/20 text-orange-400 border-orange-500/40",
  critical: "bg-red-500/20 text-red-400 border-red-500/40",
};

const LICENSE_STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "not_applied", label: "Belum Diajukan" },
  { value: "applied", label: "Sedang Diajukan" },
  { value: "approved", label: "Disetujui" },
  { value: "rejected", label: "Ditolak" },
  { value: "expired", label: "Kedaluwarsa" },
  { value: "suspended", label: "Ditangguhkan" },
];

interface EntityDraft {
  name: string;
  type: string;
  npwp: string;
  nib: string;
  sector: string;
  subSector: string;
  region: string;
  establishmentDate: string;
  status: string;
}

const DEFAULT_DRAFT: EntityDraft = {
  name: "",
  type: "PT",
  npwp: "",
  nib: "",
  sector: "construction",
  subSector: "",
  region: "",
  establishmentDate: "",
  status: "active",
};

function entityToDraft(entity: LegalEntity): EntityDraft {
  return {
    name: entity.name,
    type: entity.type,
    npwp: entity.npwp,
    nib: entity.nib ?? "",
    sector: entity.sector,
    subSector: entity.subSector,
    region: entity.region,
    establishmentDate: entity.establishmentDate,
    status: entity.status,
  };
}

interface LicenseDraft {
  status: string;
  expiryDate: string;
  licenseNumber: string;
  notes: string;
}

function licenseToDraft(license: LicenseStatus): LicenseDraft {
  return {
    status: license.status,
    expiryDate: license.expiryDate ?? "",
    licenseNumber: license.licenseNumber ?? "",
    notes: license.notes ?? "",
  };
}

export default function LegalLicensingPage() {
  const [activeTab, setActiveTab] = useState("overview");

  const [entity, setEntity] = useState<LegalEntity | null>(null);
  const [entityDraft, setEntityDraft] = useState<EntityDraft>(DEFAULT_DRAFT);
  const [loadingEntity, setLoadingEntity] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [savingEntity, setSavingEntity] = useState(false);
  const [entitySaveError, setEntitySaveError] = useState<string | null>(null);
  const [deletingEntity, setDeletingEntity] = useState(false);

  const [licenses, setLicenses] = useState<LicenseStatus[]>([]);
  const [requirements, setRequirements] = useState<LicenseRequirement[]>([]);
  const [complianceCheck, setComplianceCheck] = useState<LegalComplianceCheck | null>(null);
  const [loadingCompliance, setLoadingCompliance] = useState(false);

  const [licenseDrafts, setLicenseDrafts] = useState<Record<string, LicenseDraft>>({});
  const [savingLicenseId, setSavingLicenseId] = useState<string | null>(null);
  const [licenseSaveError, setLicenseSaveError] = useState<string | null>(null);

  const loadComplianceData = useCallback(async () => {
    setLoadingCompliance(true);
    try {
      const res = await fetch("/api/legal/compliance", { credentials: "include" });
      if (res.status === 404) {
        setLicenses([]);
        setRequirements([]);
        setComplianceCheck(null);
        return;
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Gagal memuat status kepatuhan");
      }
      const data = await res.json();
      setComplianceCheck(data.complianceCheck);
      setRequirements(data.requirements);
      setLicenses(data.licenses);
      setLicenseDrafts(
        Object.fromEntries(
          (data.licenses as LicenseStatus[]).map((l) => [l.licenseRequirementId, licenseToDraft(l)])
        )
      );
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Gagal memuat status kepatuhan");
    } finally {
      setLoadingCompliance(false);
    }
  }, []);

  const loadEntity = useCallback(async () => {
    setLoadingEntity(true);
    setLoadError(null);
    try {
      const res = await fetch("/api/legal/entity", { credentials: "include" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Gagal memuat data entitas");
      }
      const data = await res.json();
      if (data.entity) {
        setEntity(data.entity);
        setEntityDraft(entityToDraft(data.entity));
        await loadComplianceData();
      } else {
        setEntity(null);
        setEntityDraft(DEFAULT_DRAFT);
      }
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Gagal memuat data entitas");
    } finally {
      setLoadingEntity(false);
    }
  }, [loadComplianceData]);

  useEffect(() => {
    loadEntity();
  }, [loadEntity]);

  const handleSaveEntity = async () => {
    setSavingEntity(true);
    setEntitySaveError(null);
    try {
      const res = await fetch("/api/legal/entity", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(entityDraft),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Gagal menyimpan profil perusahaan");
      }
      setEntity(data.entity);
      setEntityDraft(entityToDraft(data.entity));
      await loadComplianceData();
    } catch (err) {
      setEntitySaveError(err instanceof Error ? err.message : "Gagal menyimpan profil perusahaan");
    } finally {
      setSavingEntity(false);
    }
  };

  const handleDeleteEntity = async () => {
    if (!entity) return;
    if (!window.confirm("Hapus profil perusahaan ini beserta seluruh data status izin yang tersimpan? Tindakan ini tidak dapat dibatalkan.")) {
      return;
    }
    setDeletingEntity(true);
    setEntitySaveError(null);
    try {
      const res = await fetch("/api/legal/entity", {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok && res.status !== 204) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Gagal menghapus profil perusahaan");
      }
      setEntity(null);
      setEntityDraft(DEFAULT_DRAFT);
      setLicenses([]);
      setRequirements([]);
      setComplianceCheck(null);
      setLicenseDrafts({});
    } catch (err) {
      setEntitySaveError(err instanceof Error ? err.message : "Gagal menghapus profil perusahaan");
    } finally {
      setDeletingEntity(false);
    }
  };

  const updateLicenseDraft = (requirementId: string, patch: Partial<LicenseDraft>) => {
    setLicenseDrafts((prev) => ({
      ...prev,
      [requirementId]: { ...(prev[requirementId] ?? { status: "not_applied", expiryDate: "", licenseNumber: "", notes: "" }), ...patch },
    }));
  };

  const handleDeleteLicense = async (requirementId: string) => {
    if (!window.confirm("Hapus data status izin ini? Statusnya akan kembali menjadi \"Belum Diajukan\".")) {
      return;
    }
    setSavingLicenseId(requirementId);
    setLicenseSaveError(null);
    try {
      const res = await fetch(`/api/legal/licenses/${encodeURIComponent(requirementId)}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok && res.status !== 204) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Gagal menghapus data izin");
      }
      await loadComplianceData();
    } catch (err) {
      setLicenseSaveError(err instanceof Error ? err.message : "Gagal menghapus data izin");
    } finally {
      setSavingLicenseId(null);
    }
  };

  const handleSaveLicense = async (requirementId: string) => {
    const draft = licenseDrafts[requirementId];
    if (!draft) return;
    setSavingLicenseId(requirementId);
    setLicenseSaveError(null);
    try {
      const res = await fetch(`/api/legal/licenses/${encodeURIComponent(requirementId)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          status: draft.status,
          expiryDate: draft.expiryDate || undefined,
          licenseNumber: draft.licenseNumber || undefined,
          notes: draft.notes || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Gagal menyimpan status izin");
      }
      await loadComplianceData();
    } catch (err) {
      setLicenseSaveError(err instanceof Error ? err.message : "Gagal menyimpan status izin");
    } finally {
      setSavingLicenseId(null);
    }
  };

  const renderEntityForm = () => (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-slate-100 mb-4">Profil Perusahaan</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Nama Perusahaan</label>
          <input
            type="text"
            value={entityDraft.name}
            onChange={(e) => setEntityDraft((d) => ({ ...d, name: e.target.value }))}
            placeholder="PT Konstruksi Maju Jaya"
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Jenis Badan Usaha</label>
          <select
            value={entityDraft.type}
            onChange={(e) => setEntityDraft((d) => ({ ...d, type: e.target.value }))}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
          >
            {["PT", "CV", "UD", "Firma", "Koperasi", "Perorangan"].map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Sektor</label>
          <select
            value={entityDraft.sector}
            onChange={(e) => setEntityDraft((d) => ({ ...d, sector: e.target.value }))}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
          >
            <option value="construction">Konstruksi</option>
            <option value="mining">Pertambangan</option>
            <option value="oil_gas">Migas</option>
            <option value="manufacturing">Manufaktur</option>
            <option value="trade">Perdagangan</option>
            <option value="services">Jasa</option>
            <option value="industry">Industri</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Sub-sektor</label>
          <input
            type="text"
            value={entityDraft.subSector}
            onChange={(e) => setEntityDraft((d) => ({ ...d, subSector: e.target.value }))}
            placeholder="civil engineering"
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Wilayah</label>
          <input
            type="text"
            value={entityDraft.region}
            onChange={(e) => setEntityDraft((d) => ({ ...d, region: e.target.value }))}
            placeholder="DKI Jakarta"
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">NPWP</label>
          <input
            type="text"
            value={entityDraft.npwp}
            onChange={(e) => setEntityDraft((d) => ({ ...d, npwp: e.target.value }))}
            placeholder="01.234.567.8-123.000"
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">NIB (opsional)</label>
          <input
            type="text"
            value={entityDraft.nib}
            onChange={(e) => setEntityDraft((d) => ({ ...d, nib: e.target.value }))}
            placeholder="1234567890123"
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Tanggal Pendirian</label>
          <input
            type="date"
            value={entityDraft.establishmentDate}
            onChange={(e) => setEntityDraft((d) => ({ ...d, establishmentDate: e.target.value }))}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Status Entitas</label>
          <select
            value={entityDraft.status}
            onChange={(e) => setEntityDraft((d) => ({ ...d, status: e.target.value }))}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
          >
            <option value="active">Aktif</option>
            <option value="inactive">Tidak Aktif</option>
            <option value="suspended">Ditangguhkan</option>
            <option value="dissolved">Dibubarkan</option>
          </select>
        </div>
      </div>

      {entitySaveError && (
        <div className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {entitySaveError}
        </div>
      )}

      <div className="mt-4 flex justify-end gap-3">
        {entity && (
          <button
            onClick={handleDeleteEntity}
            disabled={deletingEntity || savingEntity}
            className="px-5 py-2.5 rounded-lg font-semibold bg-red-600/20 border border-red-500/40 hover:bg-red-600/30 disabled:opacity-50 disabled:cursor-not-allowed text-red-300 transition-colors"
          >
            {deletingEntity ? "Menghapus..." : "Hapus Profil"}
          </button>
        )}
        <button
          onClick={handleSaveEntity}
          disabled={savingEntity || deletingEntity}
          className="px-5 py-2.5 rounded-lg font-semibold bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors"
        >
          {savingEntity ? "Menyimpan..." : entity ? "Simpan Perubahan" : "Buat Profil Perusahaan"}
        </button>
      </div>
    </div>
  );

  const renderNoEntityNotice = () => (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-10 text-center">
      <div className="text-4xl mb-3">⚖️</div>
      <h3 className="text-lg font-semibold text-slate-100 mb-2">Lengkapi profil perusahaan dahulu</h3>
      <p className="text-slate-400 text-sm">Isi dan simpan Profil Perusahaan di atas untuk melihat status kepatuhan, persyaratan, dan jadwal perpanjangan izin.</p>
    </div>
  );

  const renderOverview = () => {
    if (!entity) return renderNoEntityNotice();
    if (!complianceCheck) {
      return (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-10 text-center text-slate-400">
          {loadingCompliance ? "Memuat status kepatuhan..." : "Status kepatuhan belum tersedia."}
        </div>
      );
    }
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Legal & Licensing Dashboard</h2>
          <p className="text-blue-100">Pantau kepatuhan perizinan dan status legalitas perusahaan</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="text-3xl font-bold text-blue-400 mb-2">{complianceCheck.overallCompliance}%</div>
            <div className="text-slate-300 font-medium">Skor Kepatuhan</div>
            <div className="text-slate-400 text-sm mt-1">Target: 100%</div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {complianceCheck.licenseCompliance.filter((l) => l.status === "compliant").length}
            </div>
            <div className="text-slate-300 font-medium">Izin Compliant</div>
            <div className="text-slate-400 text-sm mt-1">Dari {requirements.length} total</div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="text-3xl font-bold text-red-400 mb-2">
              {complianceCheck.licenseCompliance.filter((l) => l.daysUntilExpiry !== undefined && l.daysUntilExpiry < 0).length}
            </div>
            <div className="text-slate-300 font-medium">Izin Expired</div>
            <div className="text-slate-400 text-sm mt-1">Perlu Perpanjangan</div>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Status Cepat Perizinan</h3>
          <div className="space-y-3">
            {complianceCheck.licenseCompliance.map((license) => (
              <div key={license.licenseId} className="flex items-center justify-between">
                <span className="text-slate-300">{license.licenseName}</span>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${STATUS_COLORS[license.status] ?? STATUS_COLORS.pending}`}>
                    {license.status === "compliant" ? "✅ OK" :
                     license.status === "expired" ? "❌ Expired" :
                     license.status === "pending" ? "⏳ Pending" : "⚠️ Issue"}
                  </span>
                  {license.daysUntilExpiry !== undefined && (
                    <span className={`px-2 py-1 rounded-full text-xs ${RISK_COLORS[license.riskLevel] ?? RISK_COLORS.medium}`}>
                      {license.daysUntilExpiry < 0 ? `${Math.abs(license.daysUntilExpiry)} hari lalu` : `${license.daysUntilExpiry} hari`}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderCompliance = () => {
    if (!entity) return renderNoEntityNotice();
    return (
      <div className="space-y-6">
        {licenseSaveError && (
          <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {licenseSaveError}
          </div>
        )}

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Kelola Status Izin</h3>
          <div className="space-y-4">
            {requirements.map((req) => {
              const draft = licenseDrafts[req.id] ?? { status: "not_applied", expiryDate: "", licenseNumber: "", notes: "" };
              return (
                <div key={req.id} className="border border-slate-600 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-slate-100 font-medium">{req.name}</h4>
                      <p className="text-slate-400 text-sm">{req.authority}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${req.mandatory ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"}`}>
                      {req.mandatory ? "Wajib" : "Opsional"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Status</label>
                      <select
                        value={draft.status}
                        onChange={(e) => updateLicenseDraft(req.id, { status: e.target.value })}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-2 py-1.5 text-sm text-slate-100 focus:border-blue-500 focus:outline-none"
                      >
                        {LICENSE_STATUS_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Berlaku sampai</label>
                      <input
                        type="date"
                        value={draft.expiryDate}
                        onChange={(e) => updateLicenseDraft(req.id, { expiryDate: e.target.value })}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-2 py-1.5 text-sm text-slate-100 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Nomor Izin</label>
                      <input
                        type="text"
                        value={draft.licenseNumber}
                        onChange={(e) => updateLicenseDraft(req.id, { licenseNumber: e.target.value })}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-2 py-1.5 text-sm text-slate-100 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      <button
                        onClick={() => handleSaveLicense(req.id)}
                        disabled={savingLicenseId === req.id}
                        className="flex-1 px-3 py-1.5 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white transition-colors"
                      >
                        {savingLicenseId === req.id ? "..." : "Simpan"}
                      </button>
                      <button
                        onClick={() => handleDeleteLicense(req.id)}
                        disabled={savingLicenseId === req.id}
                        title="Hapus data status izin ini"
                        className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-red-600/20 border border-red-500/40 hover:bg-red-600/30 disabled:opacity-50 text-red-300 transition-colors"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="block text-xs text-slate-400 mb-1">Catatan</label>
                    <input
                      type="text"
                      value={draft.notes}
                      onChange={(e) => updateLicenseDraft(req.id, { notes: e.target.value })}
                      placeholder="Catatan opsional"
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-2 py-1.5 text-sm text-slate-100 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {complianceCheck && complianceCheck.gaps.length > 0 && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Gap Kepatuhan yang Perlu Ditangani</h3>
            <div className="space-y-3">
              {complianceCheck.gaps.map((gap) => (
                <div key={gap.id} className="border border-slate-600 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-slate-100 font-medium">{gap.gapDescription}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      gap.priority === "high" ? "bg-red-500/20 text-red-400" :
                      gap.priority === "medium" ? "bg-yellow-500/20 text-yellow-400" :
                      "bg-green-500/20 text-green-400"
                    }`}>
                      {gap.priority.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm mb-2">{gap.impact}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Estimasi Biaya:</span>
                      <span className="text-slate-100 ml-2">Rp {gap.estimatedCost.toLocaleString("id-ID")}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Estimasi Waktu:</span>
                      <span className="text-slate-100 ml-2">{gap.estimatedTime} hari</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderRequirements = () => {
    if (!entity) return renderNoEntityNotice();
    return (
      <div className="space-y-6">
        {requirements.map((license) => (
          <div key={license.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-100">{license.name}</h3>
                <p className="text-slate-400 text-sm">{license.authority} • {license.legalBasis}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  license.mandatory ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"
                }`}>
                  {license.mandatory ? "Wajib" : "Opsional"}
                </span>
                <span className="text-slate-400 text-sm">{license.category}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-slate-700/50 rounded-lg p-3">
                <div className="text-slate-400 text-sm">Masa Berlaku</div>
                <div className="text-slate-100 font-medium">
                  {license.validityPeriod > 0 ? `${license.validityPeriod} bulan` : "Seumur hidup"}
                </div>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-3">
                <div className="text-slate-400 text-sm">Biaya Awal</div>
                <div className="text-slate-100 font-medium">
                  Rp {license.fees.initial.toLocaleString("id-ID")}
                </div>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-3">
                <div className="text-slate-400 text-sm">Biaya Perpanjangan</div>
                <div className="text-slate-100 font-medium">
                  Rp {license.fees.renewal.toLocaleString("id-ID")}
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-slate-100 font-medium mb-2">Dokumen yang Diperlukan:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {license.requirements.map((req) => (
                  <div key={req.id} className="flex items-center gap-2">
                    <span className={req.mandatory ? "text-red-400" : "text-green-400"}>
                      {req.mandatory ? "●" : "○"}
                    </span>
                    <span className="text-slate-300 text-sm">{req.description}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderRenewal = () => {
    if (!entity) return renderNoEntityNotice();
    const licensesWithExpiry = licenses.filter((l) => l.expiryDate);
    return (
      <div className="space-y-6">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Jadwal Perpanjangan Izin</h3>
          {licensesWithExpiry.length === 0 ? (
            <p className="text-slate-400 text-sm">Belum ada izin dengan tanggal masa berlaku yang tercatat.</p>
          ) : (
            <div className="space-y-4">
              {licensesWithExpiry.map((license) => {
                const requirement = requirements.find((r) => r.id === license.licenseRequirementId);
                if (!requirement) return null;
                const urgency = calculateRenewalUrgency(license, requirement);

                return (
                  <div key={license.id} className="border border-slate-600 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-slate-100 font-medium">{requirement.name}</h4>
                        <p className="text-slate-400 text-sm">
                          Expired: {new Date(license.expiryDate!).toLocaleDateString("id-ID")}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        urgency.urgency === "critical" ? "bg-red-500/20 text-red-400" :
                        urgency.urgency === "urgent" ? "bg-orange-500/20 text-orange-400" :
                        "bg-green-500/20 text-green-400"
                      }`}>
                        {urgency.urgency.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-slate-300 text-sm mb-3">{urgency.message}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-400">Biaya Perpanjangan:</span>
                        <span className="text-slate-100 ml-2 font-medium">
                          Rp {requirement.fees.renewal.toLocaleString("id-ID")}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400">Pengingat Selanjutnya:</span>
                        <span className="text-slate-100 ml-2">
                          {requirement.renewalNoticePeriod} bulan sebelum expired
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Strategi Perpanjangan</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-green-400 mt-1">📅</span>
              <div>
                <h4 className="text-slate-100 font-medium">Calendar Reminder</h4>
                <p className="text-slate-400 text-sm">Setup pengingat 6 bulan sebelum expired</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-400 mt-1">📁</span>
              <div>
                <h4 className="text-slate-100 font-medium">Document Management</h4>
                <p className="text-slate-400 text-sm">Simpan template dan backup semua dokumen</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-yellow-400 mt-1">💰</span>
              <div>
                <h4 className="text-slate-100 font-medium">Budget Planning</h4>
                <p className="text-slate-400 text-sm">Alokasikan budget tahunan untuk renewal</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-purple-400 mt-1">👥</span>
              <div>
                <h4 className="text-slate-100 font-medium">PIC Assignment</h4>
                <p className="text-slate-400 text-sm">Assign PIC untuk setiap jenis izin</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <NavbarAuth />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-100 mb-2">⚖️ Legal & Licensing</h1>
          <p className="text-slate-400">Kelola kepatuhan perizinan dan status legalitas perusahaan</p>
        </div>

        {loadingEntity ? (
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-10 text-center text-slate-400">
            Memuat data entitas perusahaan...
          </div>
        ) : (
          <>
            {loadError && (
              <div className="mb-6 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {loadError}
              </div>
            )}

            <div className="mb-8">{renderEntityForm()}</div>

            <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-700 pb-4">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === tab.id
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === "overview" && renderOverview()}
            {activeTab === "compliance" && renderCompliance()}
            {activeTab === "requirements" && renderRequirements()}
            {activeTab === "renewal" && renderRenewal()}
          </>
        )}
      </div>
    </div>
  );
}
