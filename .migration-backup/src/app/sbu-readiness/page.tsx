"use client";

import { useState, useMemo } from "react";
import {
  assessSbuReadiness,
  getAvailableClassifications,
  validateSbuApplicationType,
  type BusinessEntityProfile,
  type SbuApplicationType,
  type SbuClassification,
  type SbuReadinessAssessment
} from "@/lib/sbu-readiness";
import NavbarAuth from "@/components/NavbarAuth";

const STEPS = [
  { id: 'entity', label: 'Profil Badan Usaha', icon: '🏢' },
  { id: 'application', label: 'Jenis Pengajuan', icon: '📋' },
  { id: 'classification', label: 'Klasifikasi Target', icon: '🎯' },
  { id: 'documents', label: 'Dokumen & Bukti', icon: '📄' },
  { id: 'assessment', label: 'Hasil Assessment', icon: '📊' }
];

export default function SbuReadinessWizardPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [entity, setEntity] = useState<Partial<BusinessEntityProfile>>({
    businessType: 'PT',
    sector: 'construction',
    address: { street: '', city: '', province: '', postalCode: '' },
    contact: { phone: '', email: '' }
  });
  const [applicationType, setApplicationType] = useState<Partial<SbuApplicationType>>({
    type: 'new'
  });
  const [selectedClassification, setSelectedClassification] = useState<string>('');
  const [documents, setDocuments] = useState<Record<string, any>>({});
  const [assessment, setAssessment] = useState<SbuReadinessAssessment | null>(null);

  const availableClassifications = useMemo(() => getAvailableClassifications(), []);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRunAssessment = () => {
    if (!entity.name || !selectedClassification) return;

    const classification = availableClassifications.find(c => c.subClassification === selectedClassification);
    if (!classification) return;

    const validation = validateSbuApplicationType(entity as BusinessEntityProfile, applicationType as SbuApplicationType);
    if (!validation.valid) {
      alert(`Validation issues: ${validation.issues.join(', ')}`);
      return;
    }

    const result = assessSbuReadiness(
      entity as BusinessEntityProfile,
      applicationType as SbuApplicationType,
      classification,
      documents
    );

    setAssessment(result);
    setCurrentStep(STEPS.length - 1);
  };

  const updateEntity = (field: string, value: any) => {
    setEntity(prev => ({ ...prev, [field]: value }));
  };

  const updateApplication = (field: string, value: any) => {
    setApplicationType(prev => ({ ...prev, [field]: value }));
  };

  const updateDocuments = (category: string, data: any) => {
    setDocuments(prev => ({ ...prev, [category]: data }));
  };

  const renderEntityStep = () => (
    <div className="space-y-6">
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Informasi Badan Usaha</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Nama Badan Usaha *
            </label>
            <input
              type="text"
              value={entity.name || ''}
              onChange={(e) => updateEntity('name', e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
              placeholder="PT Contoh Konstruksi"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Bentuk Usaha
            </label>
            <select
              value={entity.businessType || 'PT'}
              onChange={(e) => updateEntity('businessType', e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
            >
              <option value="PT">PT (Perseroan Terbatas)</option>
              <option value="CV">CV (Commanditaire Vennootschap)</option>
              <option value="UD">UD (Usaha Dagang)</option>
              <option value="Firma">Firma</option>
              <option value="Koperasi">Koperasi</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              NPWP *
            </label>
            <input
              type="text"
              value={entity.npwp || ''}
              onChange={(e) => updateEntity('npwp', e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
              placeholder="01.234.567.8-123.000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              NIB (Nomor Induk Berusaha)
            </label>
            <input
              type="text"
              value={entity.nib || ''}
              onChange={(e) => updateEntity('nib', e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
              placeholder="1234567890123"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Sektor Usaha
            </label>
            <select
              value={entity.sector || 'construction'}
              onChange={(e) => updateEntity('sector', e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
            >
              <option value="construction">Konstruksi</option>
              <option value="mining">Pertambangan</option>
              <option value="oil_gas">Migas</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Sub-Sektor
            </label>
            <input
              type="text"
              value={entity.subSector || ''}
              onChange={(e) => updateEntity('subSector', e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
              placeholder="Teknik Sipil, Gedung, Jalan, dll"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Tanggal Berdiri
            </label>
            <input
              type="date"
              value={entity.establishmentDate || ''}
              onChange={(e) => updateEntity('establishmentDate', e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderApplicationStep = () => (
    <div className="space-y-6">
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Jenis Pengajuan SBU</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Tujuan Pengajuan *
            </label>
            <select
              value={applicationType.type || 'new'}
              onChange={(e) => updateApplication('type', e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
            >
              <option value="new">Pengajuan Baru</option>
              <option value="renewal">Perpanjangan</option>
              <option value="update">Perubahan Data/Klasifikasi</option>
              <option value="remediation">Remediasi</option>
            </select>
          </div>

          {(applicationType.type === 'renewal' || applicationType.type === 'update') && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Nomor SBU Sebelumnya *
              </label>
              <input
                type="text"
                value={applicationType.previousSbuNumber || ''}
                onChange={(e) => updateApplication('previousSbuNumber', e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
                placeholder="SBU-12345-2020"
              />
            </div>
          )}

          {applicationType.type === 'update' && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Alasan Perubahan
              </label>
              <textarea
                value={applicationType.changeReason || ''}
                onChange={(e) => updateApplication('changeReason', e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
                rows={3}
                placeholder="Jelaskan alasan perubahan klasifikasi atau data..."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderClassificationStep = () => (
    <div className="space-y-6">
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Pilih Klasifikasi SBU Target</h3>
        <p className="text-slate-400 text-sm mb-6">
          Berdasarkan PP No. 28 Tahun 2025 dan SK Dirjen Bina Konstruksi No. 37 Tahun 2025
        </p>

        <div className="space-y-3">
          {availableClassifications.map((classification) => (
            <div
              key={classification.subClassification}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedClassification === classification.subClassification
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-slate-600 hover:border-slate-500'
              }`}
              onClick={() => setSelectedClassification(classification.subClassification)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-slate-100 font-medium">
                    {classification.subClassification} - {classification.description}
                  </h4>
                  <p className="text-slate-400 text-sm mt-1">
                    Kualifikasi: {classification.qualificationLevel}
                  </p>
                  <div className="mt-2 text-sm text-slate-300">
                    <div>Pengalaman: {classification.minimumExperience.years} tahun, {classification.minimumExperience.projects} proyek</div>
                    <div>Nilai Minimum: Rp {classification.minimumExperience.value.toLocaleString('id-ID')}</div>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 ${
                  selectedClassification === classification.subClassification
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-slate-500'
                }`}>
                  {selectedClassification === classification.subClassification && (
                    <div className="w-full h-full rounded-full bg-blue-500"></div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedClassification && (
          <div className="mt-6 p-4 bg-slate-700/50 rounded-lg">
            <h4 className="text-slate-100 font-medium mb-2">Ruang Lingkup Pekerjaan:</h4>
            <ul className="text-slate-300 text-sm space-y-1">
              {availableClassifications
                .find(c => c.subClassification === selectedClassification)
                ?.workScope.map((scope, index) => (
                  <li key={index}>• {scope}</li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );

  const renderDocumentsStep = () => (
    <div className="space-y-6">
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Upload Dokumen & Bukti</h3>
        <p className="text-slate-400 text-sm mb-6">
          Upload dokumen pendukung untuk assessment readiness SBU
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Dokumen Administrasi
            </label>
            <div className="space-y-2">
              <input
                type="file"
                multiple
                onChange={(e) => updateDocuments('akta_pendirian', Array.from(e.target.files || []))}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              <p className="text-slate-500 text-xs">Akta Pendirian, NPWP, SIUP/TDP</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Data Personel
            </label>
            <textarea
              value={documents.personnel ? JSON.stringify(documents.personnel, null, 2) : '[\n  {\n    "name": "Nama Personel",\n    "position": "Jabatan",\n    "experience": 5,\n    "certifications": ["Sertifikat Ahli"]\n  }\n]'}
              onChange={(e) => {
                try {
                  updateDocuments('personnel', JSON.parse(e.target.value));
                } catch (err) {
                  // Invalid JSON, keep as string for now
                }
              }}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none font-mono text-sm"
              rows={6}
              placeholder="Masukkan data personel dalam format JSON..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Data Peralatan
            </label>
            <textarea
              value={documents.equipment ? JSON.stringify(documents.equipment, null, 2) : '[\n  {\n    "type": "Excavator",\n    "quantity": 2,\n    "ownership": "owned"\n  }\n]'}
              onChange={(e) => {
                try {
                  updateDocuments('equipment', JSON.parse(e.target.value));
                } catch (err) {
                  // Invalid JSON, keep as string for now
                }
              }}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none font-mono text-sm"
              rows={4}
              placeholder="Masukkan data peralatan dalam format JSON..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Riwayat Pengalaman Proyek
            </label>
            <textarea
              value={documents.experience ? JSON.stringify(documents.experience, null, 2) : '[\n  {\n    "name": "Nama Proyek",\n    "value": 1000000000,\n    "completionDate": "2023-12-31"\n  }\n]'}
              onChange={(e) => {
                try {
                  updateDocuments('experience', JSON.parse(e.target.value));
                } catch (err) {
                  // Invalid JSON, keep as string for now
                }
              }}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none font-mono text-sm"
              rows={4}
              placeholder="Masukkan riwayat proyek dalam format JSON..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Laporan Keuangan
            </label>
            <input
              type="file"
              multiple
              onChange={(e) => updateDocuments('financial_statements', Array.from(e.target.files || []))}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
              accept=".pdf,.xls,.xlsx"
            />
            <p className="text-slate-500 text-xs">Laporan keuangan audited 2 tahun terakhir</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAssessmentStep = () => (
    <div className="space-y-6">
      {assessment ? (
        <>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Hasil Assessment SBU Readiness</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className={`text-4xl font-bold mb-2 ${
                  assessment.overallReadiness >= 80 ? 'text-green-400' :
                  assessment.overallReadiness >= 60 ? 'text-yellow-400' :
                  'text-red-400'
                }`}>
                  {assessment.overallReadiness}%
                </div>
                <div className="text-slate-300">Overall Readiness</div>
                <div className="text-slate-400 text-sm">{assessment.executiveSummary.currentStatus}</div>
              </div>

              <div className="text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">
                  {assessment.estimatedPreparationTime}
                </div>
                <div className="text-slate-300">Estimasi Waktu (hari)</div>
              </div>

              <div className="text-center">
                <div className="text-4xl font-bold text-purple-400 mb-2">
                  Rp {(assessment.estimatedCost / 1000000).toFixed(0)}M
                </div>
                <div className="text-slate-300">Estimasi Biaya</div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-slate-100 font-medium mb-3">Skor per Kategori:</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(assessment.categoryScores).map(([category, score]) => (
                  <div key={category} className="text-center">
                    <div className="text-2xl font-bold text-slate-100">{score}%</div>
                    <div className="text-slate-400 text-sm capitalize">{category}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Executive Summary</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-slate-300 font-medium mb-2">Key Strengths:</h4>
                <ul className="text-slate-400 text-sm space-y-1">
                  {assessment.executiveSummary.keyStrengths.map((strength, index) => (
                    <li key={index}>• {strength}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-slate-300 font-medium mb-2">Critical Issues:</h4>
                <ul className="text-red-400 text-sm space-y-1">
                  {assessment.executiveSummary.criticalIssues.map((issue, index) => (
                    <li key={index}>• {issue}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-slate-300 font-medium mb-2">Next Steps:</h4>
                <ul className="text-blue-400 text-sm space-y-1">
                  {assessment.executiveSummary.nextSteps.map((step, index) => (
                    <li key={index}>• {step}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 p-3 bg-slate-700/50 rounded-lg">
                <p className="text-slate-100 text-sm">{assessment.executiveSummary.recommendedTimeline}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Rekomendasi Lengkap</h3>
            <div className="space-y-2">
              {assessment.recommendedActions.map((action, index) => (
                <div key={index} className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">✓</span>
                  <span className="text-slate-300">{action}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-slate-400">Klik &quot;Analyze&quot; untuk menjalankan assessment</p>
        </div>
      )}
    </div>
  );

  const canProceed = () => {
    switch (currentStep) {
      case 0: return entity.name && entity.npwp;
      case 1: return applicationType.type;
      case 2: return selectedClassification;
      case 3: return true; // Documents are optional
      default: return true;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <NavbarAuth />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-100 mb-2">🎯 SBU Readiness Wizard</h1>
          <p className="text-slate-400">Assessment kesiapan badan usaha untuk Sertifikat Badan Usaha</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                index <= currentStep
                  ? 'border-blue-500 bg-blue-500 text-white'
                  : 'border-slate-600 text-slate-400'
              }`}>
                {step.icon}
              </div>
              <span className={`ml-2 text-sm ${
                index <= currentStep ? 'text-slate-100' : 'text-slate-400'
              }`}>
                {step.label}
              </span>
              {index < STEPS.length - 1 && (
                <div className={`w-12 h-0.5 mx-4 ${
                  index < currentStep ? 'bg-blue-500' : 'bg-slate-600'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="mb-8">
          {currentStep === 0 && renderEntityStep()}
          {currentStep === 1 && renderApplicationStep()}
          {currentStep === 2 && renderClassificationStep()}
          {currentStep === 3 && renderDocumentsStep()}
          {currentStep === 4 && renderAssessmentStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="px-6 py-2 border border-slate-600 rounded-lg text-slate-300 hover:border-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>

          <div className="flex gap-3">
            {currentStep === STEPS.length - 2 && (
              <button
                onClick={handleRunAssessment}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
              >
                Analyze Readiness
              </button>
            )}

            {currentStep < STEPS.length - 1 && (
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            )}

            {currentStep === STEPS.length - 1 && (
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium"
              >
                Start New Assessment
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}