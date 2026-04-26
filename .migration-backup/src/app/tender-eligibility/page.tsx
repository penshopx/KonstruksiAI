"use client";

import { useState, useMemo } from "react";
import {
  assessTenderEligibility,
  createMockTenderDocument,
  type TenderEligibilityCheck,
  type TenderDocument
} from "@/lib/tender-eligibility";
import NavbarAuth from "@/components/NavbarAuth";

const TABS = [
  { id: "input", label: "📋 Input Data", icon: "📋" },
  { id: "analysis", label: "📊 Analisis", icon: "📊" },
  { id: "gaps", label: "⚠️ Gap Analysis", icon: "⚠️" },
  { id: "actions", label: "✅ Tindakan", icon: "✅" }
];

const STATUS_CONFIG = {
  eligible: { label: "Eligible", color: "bg-green-500/20 text-green-400 border-green-500/40" },
  conditionally_eligible: { label: "Conditionally Eligible", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/40" },
  not_eligible: { label: "Not Eligible", color: "bg-red-500/20 text-red-400 border-red-500/40" }
};

const SEVERITY_CONFIG = {
  critical: { label: "Critical", color: "bg-red-500/20 text-red-400 border-red-500/40" },
  high: { label: "High", color: "bg-orange-500/20 text-orange-400 border-orange-500/40" },
  medium: { label: "Medium", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/40" },
  low: { label: "Low", color: "bg-green-500/20 text-green-400 border-green-500/40" }
};

export default function TenderEligibilityCheckerPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [businessEntityId, setBusinessEntityId] = useState("BE-001");
  const [tenderDocument, setTenderDocument] = useState<TenderDocument>(createMockTenderDocument());
  const [personnelIds, setPersonnelIds] = useState<string[]>(["P-001", "P-002", "P-003"]);
  const [evidence, setEvidence] = useState<Record<string, any>>({});
  const [eligibilityCheck, setEligibilityCheck] = useState<TenderEligibilityCheck | null>(null);

  const handleRunAnalysis = () => {
    const result = assessTenderEligibility(businessEntityId, tenderDocument, personnelIds, evidence);
    setEligibilityCheck(result);
    setCurrentStep(1);
  };

  const updateEvidence = (category: string, value: any) => {
    setEvidence(prev => ({ ...prev, [category]: value }));
  };

  const updatePersonnel = (personnel: string[]) => {
    setPersonnelIds(personnel);
  };

  const renderInputTab = () => (
    <div className="space-y-6">
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Informasi Tender</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Judul Tender *
            </label>
            <input
              type="text"
              value={tenderDocument.title}
              onChange={(e) => setTenderDocument(prev => ({ ...prev, title: e.target.value }))}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Sektor
            </label>
            <select
              value={tenderDocument.projectDetails.sector}
              onChange={(e) => setTenderDocument(prev => ({
                ...prev,
                projectDetails: { ...prev.projectDetails, sector: e.target.value }
              }))}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
            >
              <option value="konstruksi">Konstruksi</option>
              <option value="ketenagalistrikan">Ketenagalistrikan</option>
              <option value="minyak_gas">Minyak & Gas</option>
              <option value="pertambangan">Pertambangan</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Lokasi
            </label>
            <input
              type="text"
              value={tenderDocument.projectDetails.location}
              onChange={(e) => setTenderDocument(prev => ({
                ...prev,
                projectDetails: { ...prev.projectDetails, location: e.target.value }
              }))}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Nilai Proyek (Rp)
            </label>
            <input
              type="number"
              value={tenderDocument.projectDetails.value}
              onChange={(e) => setTenderDocument(prev => ({
                ...prev,
                projectDetails: { ...prev.projectDetails, value: Number(e.target.value) }
              }))}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Profil Badan Usaha</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              ID Badan Usaha *
            </label>
            <input
              type="text"
              value={businessEntityId}
              onChange={(e) => setBusinessEntityId(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Status Legal
            </label>
            <select
              value={evidence.legalStatus || 'active'}
              onChange={(e) => updateEvidence('legalStatus', e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
            >
              <option value="active">Aktif</option>
              <option value="inactive">Tidak Aktif</option>
              <option value="suspended">Ditangguhkan</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Tim Personel</h3>
        <div className="space-y-3">
          {personnelIds.map((personId, index) => (
            <div key={index} className="flex items-center gap-3">
              <input
                type="text"
                value={personId}
                onChange={(e) => {
                  const newPersonnel = [...personnelIds];
                  newPersonnel[index] = e.target.value;
                  updatePersonnel(newPersonnel);
                }}
                className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
                placeholder="ID Personel"
              />
              <button
                onClick={() => updatePersonnel(personnelIds.filter((_, i) => i !== index))}
                className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                Hapus
              </button>
            </div>
          ))}
          <button
            onClick={() => updatePersonnel([...personnelIds, `P-${personnelIds.length + 1}`])}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Tambah Personel
          </button>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Upload Dokumen & Bukti</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Akta Pendirian
            </label>
            <input
              type="file"
              multiple
              onChange={(e) => updateEvidence('Akta Pendirian', Array.from(e.target.files || []))}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
              accept=".pdf,.doc,.docx"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              NPWP
            </label>
            <input
              type="file"
              multiple
              onChange={(e) => updateEvidence('NPWP', Array.from(e.target.files || []))}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
              accept=".pdf,.jpg,.jpeg,.png"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              SIUP/TDP
            </label>
            <input
              type="file"
              multiple
              onChange={(e) => updateEvidence('SIUP', Array.from(e.target.files || []))}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
              accept=".pdf,.jpg,.jpeg,.png"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Sertifikat Badan Usaha (SBU)
            </label>
            <input
              type="file"
              multiple
              onChange={(e) => updateEvidence('SBU', Array.from(e.target.files || []))}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
              accept=".pdf,.jpg,.jpeg,.png"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Laporan Keuangan Audited
            </label>
            <input
              type="file"
              multiple
              onChange={(e) => updateEvidence('Laporan Keuangan Audited', Array.from(e.target.files || []))}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
              accept=".pdf,.xls,.xlsx"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Daftar Riwayat Proyek
            </label>
            <input
              type="file"
              multiple
              onChange={(e) => updateEvidence('Daftar Riwayat Proyek', Array.from(e.target.files || []))}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
              accept=".pdf,.doc,.docx,.xls,.xlsx"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalysisTab = () => {
    if (!eligibilityCheck) return null;

    const statusConfig = STATUS_CONFIG[eligibilityCheck.overallStatus];

    return (
      <div className="space-y-6">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Hasil Analisis Kelayakan Tender</h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="text-center">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-2 ${statusConfig.color}`}>
                {statusConfig.label}
              </div>
              <div className="text-slate-400 text-sm">Status Kelayakan</div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {eligibilityCheck.readinessScore}%
              </div>
              <div className="text-slate-400 text-sm">Readiness Score</div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">
                {eligibilityCheck.complianceScore}%
              </div>
              <div className="text-slate-400 text-sm">Compliance Score</div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {eligibilityCheck.evidenceCompletenessScore}%
              </div>
              <div className="text-slate-400 text-sm">Evidence Score</div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-slate-100 font-medium mb-3">Skor per Kategori:</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.entries(eligibilityCheck.categoryScores).map(([category, score]) => (
                <div key={category} className="text-center">
                  <div className="text-2xl font-bold text-slate-100">{score}%</div>
                  <div className="text-slate-400 text-sm capitalize">{category}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-slate-100 font-medium mb-3">Ringkasan Persyaratan:</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{eligibilityCheck.requirementsAnalysis.met}</div>
                <div className="text-slate-400 text-sm">Terpenuhi</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{eligibilityCheck.requirementsAnalysis.partial}</div>
                <div className="text-slate-400 text-sm">Sebagian</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">{eligibilityCheck.requirementsAnalysis.unmet}</div>
                <div className="text-slate-400 text-sm">Belum Terpenuhi</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">{eligibilityCheck.requirementsAnalysis.criticalGaps}</div>
                <div className="text-slate-400 text-sm">Gap Kritis</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Executive Summary</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-slate-300 font-medium mb-2">Current Status:</h4>
              <p className="text-slate-100">{eligibilityCheck.executiveSummary.currentStatus}</p>
            </div>

            <div>
              <h4 className="text-slate-300 font-medium mb-2">Key Strengths:</h4>
              <ul className="text-green-400 text-sm space-y-1">
                {eligibilityCheck.executiveSummary.keyStrengths.map((strength, index) => (
                  <li key={index}>• {strength}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-slate-300 font-medium mb-2">Critical Issues:</h4>
              <ul className="text-red-400 text-sm space-y-1">
                {eligibilityCheck.executiveSummary.criticalIssues.map((issue, index) => (
                  <li key={index}>• {issue}</li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-slate-300 font-medium mb-2">Next Steps:</h4>
                <ul className="text-blue-400 text-sm space-y-1">
                  {eligibilityCheck.executiveSummary.nextSteps.map((step, index) => (
                    <li key={index}>• {step}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-slate-300 font-medium mb-2">Estimasi:</h4>
                <div className="text-slate-100 text-sm space-y-1">
                  <div>Waktu: {eligibilityCheck.executiveSummary.estimatedTimeToEligibility} hari</div>
                  <div>Biaya: Rp {(eligibilityCheck.executiveSummary.estimatedCost / 1000000).toFixed(0)} juta</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderGapsTab = () => {
    if (!eligibilityCheck) return null;

    return (
      <div className="space-y-6">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Gap Analysis & Risiko</h3>

          <div className="space-y-4">
            {eligibilityCheck.gaps.map((gap) => {
              const severityConfig = SEVERITY_CONFIG[gap.severity];
              return (
                <div key={gap.id} className="border border-slate-600 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-slate-100 font-medium">{gap.description}</h4>
                      <p className="text-slate-400 text-sm">{gap.category} • {gap.impact}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${severityConfig.color}`}>
                      {severityConfig.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Status Saat Ini:</span>
                      <span className="text-slate-100 ml-2">{gap.currentStatus}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Status Diperlukan:</span>
                      <span className="text-slate-100 ml-2">{gap.requiredStatus}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Estimasi Waktu:</span>
                      <span className="text-slate-100 ml-2">{gap.estimatedResolutionTime} hari</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Estimasi Biaya:</span>
                      <span className="text-slate-100 ml-2">Rp {(gap.estimatedCost / 1000000).toFixed(0)} juta</span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <span className="text-slate-400 text-sm">PIC:</span>
                    <span className="text-slate-100 ml-2">{gap.responsibleParty}</span>
                  </div>

                  {gap.evidenceMissing.length > 0 && (
                    <div className="mt-3">
                      <span className="text-slate-400 text-sm">Bukti yang Kurang:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {gap.evidenceMissing.map((evidence, index) => (
                          <span key={index} className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">
                            {evidence}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Risiko Tender</h3>
          <div className="space-y-3">
            {eligibilityCheck.risks.map((risk, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border border-slate-600 rounded-lg">
                <span className="text-red-400 mt-1">⚠️</span>
                <span className="text-slate-300">{risk}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderActionsTab = () => {
    if (!eligibilityCheck) return null;

    return (
      <div className="space-y-6">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Rencana Tindakan Prioritas</h3>
          <div className="space-y-4">
            {eligibilityCheck.actions.map((action) => (
              <div key={action.id} className="border border-slate-600 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-slate-100 font-medium">{action.description}</h4>
                    <p className="text-slate-400 text-sm">{action.category} • {action.timeline}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    action.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                    action.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {action.priority.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">PIC:</span>
                    <span className="text-slate-100 ml-2">{action.responsibleParty}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Kriteria Sukses:</span>
                    <span className="text-slate-100 ml-2">{action.successCriteria}</span>
                  </div>
                </div>

                {action.dependencies.length > 0 && (
                  <div className="mt-3">
                    <span className="text-slate-400 text-sm">Dependensi:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {action.dependencies.map((dep, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                          {dep}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Status Review</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Requires Human Review</span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                eligibilityCheck.requiresHumanReview ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'
              }`}>
                {eligibilityCheck.requiresHumanReview ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Confidence Level</span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                eligibilityCheck.confidenceLevel === 'high' ? 'bg-green-500/20 text-green-400' :
                eligibilityCheck.confidenceLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {eligibilityCheck.confidenceLevel.toUpperCase()}
              </span>
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
          <h1 className="text-3xl font-bold text-slate-100 mb-2">🎯 Tender Eligibility Checker</h1>
          <p className="text-slate-400">Analisis kelayakan badan usaha untuk mengikuti tender konstruksi</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {TABS.map((tab, index) => (
            <div key={tab.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                index <= currentStep
                  ? 'border-blue-500 bg-blue-500 text-white'
                  : 'border-slate-600 text-slate-400'
              }`}>
                {tab.icon}
              </div>
              <span className={`ml-2 text-sm ${
                index <= currentStep ? 'text-slate-100' : 'text-slate-400'
              }`}>
                {tab.label}
              </span>
              {index < TABS.length - 1 && (
                <div className={`w-12 h-0.5 mx-4 ${
                  index < currentStep ? 'bg-blue-500' : 'bg-slate-600'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-700 pb-4">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentStep(TABS.findIndex(t => t.id === tab.id))}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentStep === TABS.findIndex(t => t.id === tab.id)
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {currentStep === 0 && renderInputTab()}
        {currentStep === 1 && renderAnalysisTab()}
        {currentStep === 2 && renderGapsTab()}
        {currentStep === 3 && renderActionsTab()}

        {/* Action Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="px-6 py-2 border border-slate-600 rounded-lg text-slate-300 hover:border-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="flex gap-3">
            {currentStep === 0 && (
              <button
                onClick={handleRunAnalysis}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
              >
                Run Eligibility Check
              </button>
            )}

            {currentStep > 0 && currentStep < TABS.length - 1 && (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
              >
                Next
              </button>
            )}

            {currentStep === TABS.length - 1 && (
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium"
              >
                New Check
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}