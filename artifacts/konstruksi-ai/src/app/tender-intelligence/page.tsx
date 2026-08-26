"use client";

import { useEffect, useMemo, useState } from "react";
import {
  TENDER_REQUIREMENTS,
  TENDER_CHECKLISTS,
  type TenderRequirement,
  type TenderChecklist,
  type TenderAnalysisResult,
} from "@/lib/tender-intelligence";
import NavbarAuth from "@/components/NavbarAuth";
import { WorkspaceContextBanner, useWorkspaceContext } from "@/lib/workspace-context";

const TABS = [
  { id: "overview", label: "📊 Overview", icon: "📊" },
  { id: "completeness", label: "✅ Kelengkapan", icon: "✅" },
  { id: "requirements", label: "📋 Persyaratan", icon: "📋" },
  { id: "risks", label: "⚠️ Risiko", icon: "⚠️" },
  { id: "checklist", label: "📝 Checklist", icon: "📝" },
];

const CATEGORY_COLORS = {
  administrative: "bg-blue-500/20 text-blue-400 border-blue-500/40",
  technical: "bg-green-500/20 text-green-400 border-green-500/40",
  financial: "bg-yellow-500/20 text-yellow-400 border-yellow-500/40",
  legal: "bg-purple-500/20 text-purple-400 border-purple-500/40",
  safety: "bg-red-500/20 text-red-400 border-red-500/40",
  environmental: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
};

const RISK_LEVEL_COLORS = {
  low: "bg-green-500/20 text-green-400 border-green-500/40",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/40",
  high: "bg-orange-500/20 text-orange-400 border-orange-500/40",
  critical: "bg-red-500/20 text-red-400 border-red-500/40",
};

interface DocumentInput {
  id: string;
  documentType: string;
  required: boolean;
  present: boolean;
  notes: string;
}

let nextDocumentId = 0;
function makeDocumentId(): string {
  nextDocumentId += 1;
  return `doc-custom-${nextDocumentId}`;
}

const DEFAULT_DOCUMENTS: DocumentInput[] = [
  { id: "doc-1", documentType: "Akta Perusahaan", required: true, present: false, notes: "" },
  { id: "doc-2", documentType: "NPWP", required: true, present: false, notes: "" },
  { id: "doc-3", documentType: "SIUP/TDP", required: true, present: false, notes: "" },
  { id: "doc-4", documentType: "Sertifikat Badan Usaha (SBU)", required: true, present: false, notes: "" },
  { id: "doc-5", documentType: "Laporan Keuangan Audited", required: true, present: false, notes: "" },
  { id: "doc-6", documentType: "Surat Referensi Bank", required: true, present: false, notes: "" },
  { id: "doc-7", documentType: "Sertifikat SMK3", required: true, present: false, notes: "" },
  { id: "doc-8", documentType: "Daftar Pengalaman Proyek", required: true, present: false, notes: "" },
];

const DEFAULT_TENDER_TYPE = "Tender Konstruksi";

export default function TenderIntelligencePage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [projectName, setProjectName] = useState("Pembangunan Gedung Kantor");
  const [checklistState, setChecklistState] = useState<Record<string, boolean>>({});
  const workspaceContext = useWorkspaceContext();

  const [documents, setDocuments] = useState<DocumentInput[]>(DEFAULT_DOCUMENTS);
  const [projectDetails, setProjectDetails] = useState("");
  const [analysis, setAnalysis] = useState<TenderAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  useEffect(() => {
    if (workspaceContext.workspace) {
      setProjectName(workspaceContext.workspace.name);
    }
  }, [workspaceContext.workspace?.id]);

  const requirementsByCategory = useMemo(
    () =>
      TENDER_REQUIREMENTS.reduce((acc, req) => {
        if (!acc[req.category]) acc[req.category] = [];
        acc[req.category].push(req);
        return acc;
      }, {} as Record<string, TenderRequirement[]>),
    [],
  );

  const handleChecklistToggle = (itemId: string) => {
    setChecklistState(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const updateDocument = (id: string, patch: Partial<Omit<DocumentInput, "id">>) => {
    setDocuments(prev => prev.map(doc => (doc.id === id ? { ...doc, ...patch } : doc)));
  };

  const addDocument = () => {
    setDocuments(prev => [...prev, { id: makeDocumentId(), documentType: "", required: true, present: false, notes: "" }]);
  };

  const removeDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const handleAnalyze = async () => {
    if (!projectName.trim() || isAnalyzing) return;
    const validDocuments = documents.filter(doc => doc.documentType.trim());
    if (validDocuments.length === 0) {
      setAnalysisError("Tambahkan minimal satu dokumen sebelum menjalankan analisis.");
      setActiveTab("completeness");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const res = await fetch("/api/tender-intelligence/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          projectName: projectName.trim(),
          tenderType: DEFAULT_TENDER_TYPE,
          projectDetails,
          documents: validDocuments.map(({ documentType, required, present, notes }) => ({
            documentType,
            required,
            present,
            notes,
          })),
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Gagal menjalankan analisis (status ${res.status})`);
      }

      const data = await res.json();
      setAnalysis({
        id: `analysis-${Date.now()}`,
        projectName: projectName.trim(),
        tenderType: DEFAULT_TENDER_TYPE,
        analysisDate: new Date().toISOString(),
        completenessChecks: data.completenessChecks,
        overallCompleteness: data.overallCompleteness,
        requirements: TENDER_REQUIREMENTS,
        risks: data.risks,
        recommendations: data.recommendations,
        complianceScore: data.complianceScore,
        summary: data.summary,
      });
      setActiveTab("overview");
    } catch (err) {
      setAnalysisError(err instanceof Error ? err.message : "Gagal menjalankan analisis tender. Silakan coba lagi.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderEmptyAnalysisState = () => (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 text-center">
      <div className="text-4xl mb-3">🎯</div>
      <h3 className="text-lg font-semibold text-slate-100 mb-2">Belum ada analisis</h3>
      <p className="text-slate-400 mb-4">
        Isi status dokumen pada tab &quot;Kelengkapan&quot; lalu jalankan analisis AI untuk melihat hasilnya di sini.
      </p>
      <button
        onClick={() => setActiveTab("completeness")}
        className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
      >
        Buka Tab Kelengkapan
      </button>
    </div>
  );

  const renderOverview = () => {
    if (!analysis) return renderEmptyAnalysisState();
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Tender Intelligence Dashboard</h2>
          <p className="text-blue-100">Analisis komprehensif dokumen tender dan persiapan penawaran</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className={`text-3xl font-bold mb-2 ${analysis.overallCompleteness >= 70 ? "text-green-400" : analysis.overallCompleteness >= 40 ? "text-orange-400" : "text-red-400"}`}>
              {analysis.overallCompleteness}%
            </div>
            <div className="text-slate-300 font-medium">Kelengkapan Dokumen</div>
            <div className="text-slate-400 text-sm mt-1">Target: 100%</div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className={`text-3xl font-bold mb-2 ${analysis.complianceScore >= 70 ? "text-green-400" : analysis.complianceScore >= 40 ? "text-orange-400" : "text-red-400"}`}>
              {analysis.complianceScore}/100
            </div>
            <div className="text-slate-300 font-medium">Skor Kepatuhan</div>
            <div className="text-slate-400 text-sm mt-1">
              Risiko: {analysis.risks.some(r => r.severity === "critical") ? "Kritis" : analysis.risks.some(r => r.severity === "high") ? "Tinggi" : "Terkendali"}
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="text-3xl font-bold text-blue-400 mb-2">{analysis.risks.length}</div>
            <div className="text-slate-300 font-medium">Risiko Terdeteksi</div>
            <div className="text-slate-400 text-sm mt-1">Perlu Mitigasi</div>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Status Dokumen</h3>
          <div className="space-y-3">
            {analysis.completenessChecks.map((check, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-slate-300">{check.documentType}</span>
                <span className={check.present ? "text-green-400" : "text-red-400"}>
                  {check.completenessScore}% {check.present ? "✓" : "✗"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Rekomendasi Prioritas</h3>
          <div className="space-y-2">
            {analysis.recommendations.length === 0 && (
              <p className="text-slate-400 text-sm">Tidak ada rekomendasi tambahan.</p>
            )}
            {analysis.recommendations.map((rec, index) => (
              <div key={index} className="flex items-start gap-3">
                <span className="text-orange-400 mt-1">⚡</span>
                <span className="text-slate-300">{rec}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderCompleteness = () => (
    <div className="space-y-6">
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-100">Status Dokumen Anda</h3>
          <button
            onClick={addDocument}
            className="px-3 py-1.5 rounded-lg bg-slate-700 text-slate-200 text-sm font-medium hover:bg-slate-600 transition-colors"
          >
            + Tambah Dokumen
          </button>
        </div>
        <p className="text-slate-400 text-sm mb-4">
          Tandai dokumen mana yang sudah Anda miliki dan tambahkan catatan (mis. masa berlaku, kesesuaian bidang) agar AI dapat menilai kesiapan tender berdasarkan kondisi nyata Anda.
        </p>
        <div className="space-y-4">
          {documents.map((doc) => (
            <div key={doc.id} className="border border-slate-600 rounded-lg p-4">
              <div className="flex items-start gap-3 mb-3">
                <input
                  type="text"
                  value={doc.documentType}
                  onChange={(e) => updateDocument(doc.id, { documentType: e.target.value })}
                  placeholder="Nama/jenis dokumen"
                  className="flex-1 bg-slate-700 border border-slate-600 rounded px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                />
                <button
                  onClick={() => removeDocument(doc.id)}
                  className="px-2 py-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-700 transition-colors"
                  aria-label={`Hapus ${doc.documentType || "dokumen"}`}
                >
                  ✕
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-4 mb-3">
                <label className="flex items-center gap-2 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={doc.required}
                    onChange={(e) => updateDocument(doc.id, { required: e.target.checked })}
                  />
                  Wajib
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={doc.present}
                    onChange={(e) => updateDocument(doc.id, { present: e.target.checked })}
                  />
                  Sudah tersedia
                </label>
              </div>
              <input
                type="text"
                value={doc.notes}
                onChange={(e) => updateDocument(doc.id, { notes: e.target.value })}
                placeholder="Catatan (opsional): mis. masa berlaku, kesesuaian bidang, kendala..."
                className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-1.5 text-sm text-slate-300 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
          ))}
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Detail Proyek Tambahan (opsional)
          </label>
          <textarea
            value={projectDetails}
            onChange={(e) => setProjectDetails(e.target.value)}
            rows={4}
            placeholder="Lingkup pekerjaan, nilai kontrak, tenggat waktu, instansi/klien, atau kendala khusus yang perlu dipertimbangkan..."
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {analysisError && (
          <div className="mt-4 bg-red-500/10 border border-red-500/40 rounded-lg p-4 text-red-300 text-sm">
            {analysisError}
          </div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || !projectName.trim()}
          className="mt-6 w-full sm:w-auto px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isAnalyzing ? "Menganalisis..." : "🚀 Jalankan Analisis AI"}
        </button>
      </div>

      {analysis && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Hasil Pengecekan Kelengkapan Dokumen</h3>
          <div className="space-y-4">
            {analysis.completenessChecks.map((check, index) => (
              <div key={index} className="border border-slate-600 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-slate-100 font-medium">{check.documentType}</h4>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${check.required ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                      {check.required ? 'Wajib' : 'Opsional'}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${check.present ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {check.present ? '✓ Ada' : '✗ Belum'}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400">
                      {check.completenessScore}%
                    </span>
                  </div>
                </div>
                {check.missingElements.length > 0 && (
                  <div className="text-slate-400 text-sm mb-2">
                    <strong>Kurang:</strong> {check.missingElements.join(', ')}
                  </div>
                )}
                <div className="text-slate-400 text-sm">{check.notes}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderRequirements = () => (
    <div className="space-y-6">
      {Object.entries(requirementsByCategory).map(([category, requirements]) => (
        <div key={category} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4 capitalize">
            {category === 'administrative' ? 'Administratif' :
             category === 'technical' ? 'Teknis' :
             category === 'financial' ? 'Finansial' :
             category === 'legal' ? 'Hukum' :
             category === 'safety' ? 'Keselamatan' : 'Lingkungan'}
          </h3>
          <div className="space-y-4">
            {requirements.map((req) => (
              <div key={req.id} className="border border-slate-600 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-slate-100 font-medium">{req.name}</h4>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${CATEGORY_COLORS[req.category as keyof typeof CATEGORY_COLORS]}`}>
                      {req.mandatory ? 'Wajib' : 'Opsional'}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${RISK_LEVEL_COLORS[req.riskLevel as keyof typeof RISK_LEVEL_COLORS]}`}>
                      {req.riskLevel.toUpperCase()}
                    </span>
                  </div>
                </div>
                <p className="text-slate-300 text-sm mb-3">{req.description}</p>
                <div className="text-slate-400 text-sm">
                  <strong>Checklist:</strong>
                  <ul className="mt-1 ml-4 list-disc">
                    {req.checklist.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderRisks = () => {
    if (!analysis) return renderEmptyAnalysisState();
    return (
      <div className="space-y-6">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Analisis Risiko Tender</h3>
          {analysis.risks.length === 0 ? (
            <p className="text-slate-400 text-sm">Tidak ada risiko signifikan yang terdeteksi dari input saat ini.</p>
          ) : (
            <div className="space-y-4">
              {analysis.risks.map((risk, index) => (
                <div key={index} className="border border-slate-600 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-slate-100 font-medium">{risk.description}</h4>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${RISK_LEVEL_COLORS[risk.severity as keyof typeof RISK_LEVEL_COLORS]}`}>
                        {risk.severity.toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${RISK_LEVEL_COLORS[risk.likelihood as keyof typeof RISK_LEVEL_COLORS]}`}>
                        {risk.likelihood} Prob
                      </span>
                    </div>
                  </div>
                  <div className="text-slate-400 text-sm mb-3">
                    <strong>Kategori:</strong> {risk.category} | <strong>Dampak:</strong> {risk.impact}
                  </div>
                  <div className="text-slate-300 text-sm">
                    <strong>Mitigasi:</strong>
                    <ul className="mt-1 ml-4 list-disc">
                      {risk.mitigation.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderChecklist = () => (
    <div className="space-y-6">
      {TENDER_CHECKLISTS.map((checklist) => (
        <div key={checklist.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">{checklist.name}</h3>
          <div className="space-y-3">
            {checklist.items.map((item) => (
              <div key={item.id} className="flex items-start gap-3 p-3 border border-slate-600 rounded-lg">
                <input
                  type="checkbox"
                  checked={checklistState[item.id] || false}
                  onChange={() => handleChecklistToggle(item.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-slate-100">{item.text}</span>
                    {item.mandatory && (
                      <span className="px-2 py-1 rounded-full text-xs bg-red-500/20 text-red-400">
                        Wajib
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Catatan..."
                    className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-1 text-sm text-slate-300 placeholder-slate-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900">
      <NavbarAuth />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <WorkspaceContextBanner context={workspaceContext} />
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-100 mb-2">🎯 Tender Intelligence</h1>
          <p className="text-slate-400">Analisis mendalam dokumen tender dan persiapan penawaran yang optimal</p>
          <p className="text-slate-500 text-sm mt-1">
            Catatan: analisis dihasilkan AI berdasarkan status dokumen yang Anda masukkan sendiri — bukan integrasi langsung dengan data pengadaan pemerintah (LPSE).
          </p>
        </div>

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

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Nama Proyek
          </label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="w-full max-w-md bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
            placeholder="Masukkan nama proyek..."
          />
        </div>

        {activeTab === "overview" && renderOverview()}
        {activeTab === "completeness" && renderCompleteness()}
        {activeTab === "requirements" && renderRequirements()}
        {activeTab === "risks" && renderRisks()}
        {activeTab === "checklist" && renderChecklist()}
      </div>
    </div>
  );
}
