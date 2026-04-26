"use client";

import { useState, useMemo } from "react";
import {
  TENDER_REQUIREMENTS,
  TENDER_CHECKLISTS,
  createTenderAnalysis,
  generateTenderSummary,
  type TenderRequirement,
  type TenderChecklist,
  type DocumentCompletenessCheck,
  type RiskAssessment
} from "@/lib/tender-intelligence";
import NavbarAuth from "@/components/NavbarAuth";

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

export default function TenderIntelligencePage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [projectName, setProjectName] = useState("Pembangunan Gedung Kantor");
  const [checklistState, setChecklistState] = useState<Record<string, boolean>>({});

  // Mock completeness data
  const mockChecks = useMemo<DocumentCompletenessCheck[]>(() => [
    { documentType: "Akta Perusahaan", required: true, present: false, completenessScore: 0, missingElements: ["Akta terbaru"], notes: "Wajib ada" },
    { documentType: "NPWP", required: true, present: false, completenessScore: 0, missingElements: ["NPWP aktif"], notes: "Wajib ada" },
    { documentType: "SIUP/TDP", required: true, present: false, completenessScore: 0, missingElements: ["SIUP sesuai bidang"], notes: "Wajib ada" },
    { documentType: "Sertifikat Badan Usaha (SBU)", required: true, present: false, completenessScore: 0, missingElements: ["SBU klasifikasi besar"], notes: "Wajib ada" },
    { documentType: "Laporan Keuangan Audited", required: true, present: false, completenessScore: 0, missingElements: ["2 tahun terakhir"], notes: "Wajib ada" },
    { documentType: "Surat Referensi Bank", required: true, present: false, completenessScore: 0, missingElements: ["Bank utama"], notes: "Wajib ada" },
    { documentType: "Sertifikat SMK3", required: true, present: false, completenessScore: 0, missingElements: ["ISO 45001 atau SMK3"], notes: "Wajib ada" },
    { documentType: "Daftar Pengalaman Proyek", required: true, present: false, completenessScore: 0, missingElements: ["Minimal 3 proyek"], notes: "Wajib ada" },
  ], []);

  const analysis = useMemo(() => createTenderAnalysis(projectName, "Construction Tender", mockChecks), [projectName, mockChecks]);

  const handleChecklistToggle = (itemId: string) => {
    setChecklistState(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Tender Intelligence Dashboard</h2>
        <p className="text-blue-100">Analisis komprehensif dokumen tender dan persiapan penawaran</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <div className="text-3xl font-bold text-red-400 mb-2">{analysis.overallCompleteness}%</div>
          <div className="text-slate-300 font-medium">Kelengkapan Dokumen</div>
          <div className="text-slate-400 text-sm mt-1">Target: 100%</div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <div className="text-3xl font-bold text-orange-400 mb-2">{analysis.complianceScore}/100</div>
          <div className="text-slate-300 font-medium">Skor Kepatuhan</div>
          <div className="text-slate-400 text-sm mt-1">Risiko: Tinggi</div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <div className="text-3xl font-bold text-blue-400 mb-2">{analysis.risks.length}</div>
          <div className="text-slate-300 font-medium">Risiko Terdeteksi</div>
          <div className="text-slate-400 text-sm mt-1">Perlu Mitigasi</div>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Status Cepat</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-300">Dokumen Administratif</span>
            <span className="text-red-400">0/6 ✓</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-300">Dokumen Teknis</span>
            <span className="text-red-400">0/5 ✓</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-300">Dokumen Finansial</span>
            <span className="text-red-400">0/4 ✓</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-300">Dokumen K3</span>
            <span className="text-red-400">0/4 ✓</span>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Rekomendasi Prioritas</h3>
        <div className="space-y-2">
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

  const renderCompleteness = () => (
    <div className="space-y-6">
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Pengecekan Kelengkapan Dokumen</h3>
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
    </div>
  );

  const renderRequirements = () => (
    <div className="space-y-6">
      {Object.entries(
        TENDER_REQUIREMENTS.reduce((acc, req) => {
          if (!acc[req.category]) acc[req.category] = [];
          acc[req.category].push(req);
          return acc;
        }, {} as Record<string, TenderRequirement[]>)
      ).map(([category, requirements]) => (
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

  const renderRisks = () => (
    <div className="space-y-6">
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Analisis Risiko Tender</h3>
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
      </div>
    </div>
  );

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-100 mb-2">🎯 Tender Intelligence</h1>
          <p className="text-slate-400">Analisis mendalam dokumen tender dan persiapan penawaran yang optimal</p>
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