"use client";

import { useState, useMemo } from "react";
import {
  assessSkkReadiness,
  getAvailableSkkPositions,
  validateSkkApplicationType,
  type WorkforceProfile,
  type SkkApplicationType,
  type JobPosition,
  type SkkReadinessAssessment
} from "@/lib/skk-readiness";
import NavbarAuth from "@/components/NavbarAuth";

const STEPS = [
  { id: 'workforce', label: '👤 Profil Tenaga Kerja', icon: '👤' },
  { id: 'application', label: '📋 Jenis Pengajuan', icon: '📋' },
  { id: 'position', label: '🎯 Jabatan Target', icon: '🎯' },
  { id: 'evidence', label: '📄 Bukti Kompetensi', icon: '📄' },
  { id: 'assessment', label: '📊 Hasil Assessment', icon: '📊' }
];

const STATUS_CONFIG = {
  met: { label: "Met", color: "bg-green-500/20 text-green-400 border-green-500/40" },
  partial: { label: "Partial", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/40" },
  not_met: { label: "Not Met", color: "bg-red-500/20 text-red-400 border-red-500/40" }
};

export default function SkkReadinessWizardPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [workforce, setWorkforce] = useState<Partial<WorkforceProfile>>({
    position: '',
    employer: ''
  });
  const [applicationType, setApplicationType] = useState<Partial<SkkApplicationType>>({
    type: 'new'
  });
  const [selectedPosition, setSelectedPosition] = useState<string>('');
  const [evidence, setEvidence] = useState<Record<string, any>>({});
  const [assessment, setAssessment] = useState<SkkReadinessAssessment | null>(null);

  const availablePositions = useMemo(() => getAvailableSkkPositions(), []);

  const handleRunAssessment = () => {
    if (!workforce.name || !selectedPosition) return;

    const position = availablePositions.find(p => p.code === selectedPosition);
    if (!position) return;

    const validation = validateSkkApplicationType(workforce as WorkforceProfile, applicationType as SkkApplicationType);
    if (!validation.valid) {
      alert(`Validation issues: ${validation.issues.join(', ')}`);
      return;
    }

    const result = assessSkkReadiness(
      workforce as WorkforceProfile,
      applicationType as SkkApplicationType,
      position,
      evidence
    );

    setAssessment(result);
    setCurrentStep(STEPS.length - 1);
  };

  const updateWorkforce = (field: string, value: any) => {
    setWorkforce(prev => ({ ...prev, [field]: value }));
  };

  const updateApplication = (field: string, value: any) => {
    setApplicationType(prev => ({ ...prev, [field]: value }));
  };

  const updateEvidence = (category: string, value: any) => {
    setEvidence(prev => ({ ...prev, [category]: value }));
  };

  const renderWorkforceStep = () => (
    <div className="space-y-6">
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Informasi Pribadi</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Nama Lengkap *
            </label>
            <input
              type="text"
              value={workforce.name || ''}
              onChange={(e) => updateWorkforce('name', e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
              placeholder="Nama lengkap sesuai KTP"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              NIK *
            </label>
            <input
              type="text"
              value={workforce.nik || ''}
              onChange={(e) => updateWorkforce('nik', e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
              placeholder="Nomor Induk Kependudukan"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Tanggal Lahir
            </label>
            <input
              type="date"
              value={workforce.birthDate || ''}
              onChange={(e) => updateWorkforce('birthDate', e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Pendidikan Terakhir
            </label>
            <select
              value={workforce.education || ''}
              onChange={(e) => updateWorkforce('education', e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
            >
              <option value="">Pilih Pendidikan</option>
              <option value="SMA">SMA/Sederajat</option>
              <option value="SMK">SMK</option>
              <option value="D1">D1</option>
              <option value="D2">D2</option>
              <option value="D3">D3</option>
              <option value="D4">D4</option>
              <option value="S1">S1</option>
              <option value="S2">S2</option>
              <option value="S3">S3</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Jabatan Saat Ini
            </label>
            <input
              type="text"
              value={workforce.position || ''}
              onChange={(e) => updateWorkforce('position', e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
              placeholder="Jabatan di perusahaan"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Perusahaan
            </label>
            <input
              type="text"
              value={workforce.employer || ''}
              onChange={(e) => updateWorkforce('employer', e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
              placeholder="Nama perusahaan"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Tanggal Bergabung
            </label>
            <input
              type="date"
              value={workforce.joinDate || ''}
              onChange={(e) => updateWorkforce('joinDate', e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Kontak & Alamat</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={workforce.email || ''}
              onChange={(e) => updateWorkforce('email', e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
              placeholder="email@contoh.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Telepon
            </label>
            <input
              type="tel"
              value={workforce.phone || ''}
              onChange={(e) => updateWorkforce('phone', e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
              placeholder="+628xxxxxxxxx"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Alamat Lengkap
            </label>
            <textarea
              value={workforce.address || ''}
              onChange={(e) => updateWorkforce('address', e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
              rows={3}
              placeholder="Alamat lengkap sesuai KTP"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderApplicationStep = () => (
    <div className="space-y-6">
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Jenis Pengajuan SKK</h3>
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
              <option value="update">Perubahan Jabatan/Kompetensi</option>
              <option value="remediation">Remediasi</option>
            </select>
          </div>

          {(applicationType.type === 'renewal' || applicationType.type === 'update') && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Nomor SKK Sebelumnya *
              </label>
              <input
                type="text"
                value={applicationType.previousSkkNumber || ''}
                onChange={(e) => updateApplication('previousSkkNumber', e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
                placeholder="SKK-12345-2020"
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
                placeholder="Jelaskan alasan perubahan jabatan atau kompetensi..."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderPositionStep = () => (
    <div className="space-y-6">
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Pilih Jabatan Target SKK</h3>
        <p className="text-slate-400 text-sm mb-6">
          Berdasarkan SK Dirjen Bina Konstruksi No. 114 Tahun 2024
        </p>

        <div className="space-y-3">
          {availablePositions.map((position) => (
            <div
              key={position.code}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedPosition === position.code
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-slate-600 hover:border-slate-500'
              }`}
              onClick={() => setSelectedPosition(position.code)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-slate-100 font-medium">
                    {position.code} - {position.name}
                  </h4>
                  <p className="text-slate-400 text-sm mt-1">
                    Level: {position.level} | Unit: {position.competencyUnit}
                  </p>
                  <div className="mt-2 text-sm text-slate-300">
                    <div>Pendidikan: {position.minimumRequirements.education}</div>
                    <div>Pengalaman: {position.minimumRequirements.experience} tahun</div>
                    <div>Pelatihan: {position.minimumRequirements.trainingHours} jam</div>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 ${
                  selectedPosition === position.code
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-slate-500'
                }`}>
                  {selectedPosition === position.code && (
                    <div className="w-full h-full rounded-full bg-blue-500"></div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedPosition && (
          <div className="mt-6 p-4 bg-slate-700/50 rounded-lg">
            <h4 className="text-slate-100 font-medium mb-2">Persyaratan Sertifikasi:</h4>
            <ul className="text-slate-300 text-sm space-y-1">
              {(availablePositions
                .find(p => p.code === selectedPosition)
                ?.minimumRequirements.certification || []).map((cert, index) => (
                <li key={index}>• {cert}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );

  const renderEvidenceStep = () => (
    <div className="space-y-6">
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Upload Bukti Kompetensi</h3>
        <p className="text-slate-400 text-sm mb-6">
          Upload dokumen pendukung untuk assessment readiness SKK
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Ijazah Pendidikan
            </label>
            <input
              type="file"
              multiple
              onChange={(e) => updateEvidence('education', Array.from(e.target.files || []))}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <p className="text-slate-500 text-xs">Ijazah/Surat Tanda Tamat Belajar</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Sertifikat Pelatihan
            </label>
            <input
              type="file"
              multiple
              onChange={(e) => updateEvidence('training', Array.from(e.target.files || []))}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <p className="text-slate-500 text-xs">Sertifikat kursus/pelatihan kompetensi</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Sertifikat Kompetensi
            </label>
            <input
              type="file"
              multiple
              onChange={(e) => updateEvidence('certifications', Array.from(e.target.files || []))}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <p className="text-slate-500 text-xs">Sertifikat kompetensi yang sudah dimiliki</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Bukti Pengalaman Kerja
            </label>
            <input
              type="file"
              multiple
              onChange={(e) => updateEvidence('experience', Array.from(e.target.files || []))}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
              accept=".pdf,.doc,.docx"
            />
            <p className="text-slate-500 text-xs">Daftar riwayat pekerjaan, referensi kerja</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Hasil Assessment LSP
            </label>
            <input
              type="file"
              multiple
              onChange={(e) => updateEvidence('assessment', Array.from(e.target.files || []))}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
              accept=".pdf"
            />
            <p className="text-slate-500 text-xs">Hasil assessment dari Lembaga Sertifikasi Profesi</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Portofolio Pekerjaan
            </label>
            <input
              type="file"
              multiple
              onChange={(e) => updateEvidence('portfolio', Array.from(e.target.files || []))}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
              accept=".pdf,.zip"
            />
            <p className="text-slate-500 text-xs">Dokumentasi pekerjaan, foto proyek, laporan</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Informasi Tambahan</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Total Tahun Pengalaman
            </label>
            <input
              type="number"
              value={evidence.experience_years || ''}
              onChange={(e) => updateEvidence('experience_years', Number(e.target.value))}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Total Jam Pelatihan
            </label>
            <input
              type="number"
              value={evidence.training_hours || ''}
              onChange={(e) => updateEvidence('training_hours', Number(e.target.value))}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
              placeholder="0"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderAssessmentStep = () => {
    if (!assessment) return null;

    return (
      <div className="space-y-6">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Hasil Assessment SKK Readiness</h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="text-center">
              <div className={`text-4xl font-bold mb-2 ${
                assessment.overallReadiness >= 80 ? 'text-green-400' :
                assessment.overallReadiness >= 60 ? 'text-yellow-400' :
                'text-red-400'
              }`}>
                {assessment.overallReadiness}%
              </div>
              <div className="text-slate-400 text-sm">Overall Readiness</div>
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">
                {assessment.estimatedPreparationTime}
              </div>
              <div className="text-slate-400 text-sm">Estimasi Waktu (hari)</div>
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">
                Rp {(assessment.estimatedCost / 1000000).toFixed(0)}M
              </div>
              <div className="text-slate-400 text-sm">Estimasi Biaya</div>
            </div>

            <div className="text-center">
              <div className={`text-2xl font-bold mb-2 ${
                assessment.riskLevel === 'low' ? 'text-green-400' :
                assessment.riskLevel === 'medium' ? 'text-yellow-400' :
                'text-red-400'
              }`}>
                {assessment.riskLevel.toUpperCase()}
              </div>
              <div className="text-slate-400 text-sm">Risk Level</div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-slate-100 font-medium mb-3">Skor per Kategori Kompetensi:</h4>
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
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Readiness Breakdown</h3>
          <div className="space-y-4">
            {Object.entries(assessment.readinessBreakdown).map(([key, item]) => (
              <div key={key} className="border border-slate-600 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-slate-100 font-medium">{item.requirement}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_CONFIG[item.status].color}`}>
                    {STATUS_CONFIG[item.status].label}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-slate-400">Current:</span>
                    <span className="text-slate-100 ml-2">{item.current}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Required:</span>
                    <span className="text-slate-100 ml-2">{item.required}</span>
                  </div>
                </div>
                {item.notes && (
                  <p className="text-slate-400 text-sm mt-2">{item.notes}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Executive Summary</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-slate-300 font-medium mb-2">Current Status:</h4>
              <p className="text-slate-100">{assessment.executiveSummary.currentStatus}</p>
            </div>

            <div>
              <h4 className="text-slate-300 font-medium mb-2">Key Strengths:</h4>
              <ul className="text-green-400 text-sm space-y-1">
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

        {assessment.recommendedActions.length > 0 && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Rencana Tindakan</h3>
            <div className="space-y-3">
              {assessment.recommendedActions.map((action, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border border-slate-600 rounded-lg">
                  <span className={`text-sm px-2 py-1 rounded ${
                    action.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                    action.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {action.priority.toUpperCase()}
                  </span>
                  <div className="flex-1">
                    <p className="text-slate-100 font-medium">{action.description}</p>
                    <p className="text-slate-400 text-sm">Timeline: {action.timeline} | PIC: {action.responsibleParty}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return workforce.name && workforce.nik;
      case 1: return applicationType.type;
      case 2: return selectedPosition;
      case 3: return true; // Evidence is optional
      default: return true;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <NavbarAuth />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-100 mb-2">🎓 SKK Readiness Wizard</h1>
          <p className="text-slate-400">Assessment kesiapan tenaga kerja untuk Sertifikat Keahlian Kerja</p>
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

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-700 pb-4">
          {STEPS.map((step, index) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(index)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentStep === index
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              {step.label}
            </button>
          ))}
        </div>

        {/* Step Content */}
        {currentStep === 0 && renderWorkforceStep()}
        {currentStep === 1 && renderApplicationStep()}
        {currentStep === 2 && renderPositionStep()}
        {currentStep === 3 && renderEvidenceStep()}
        {currentStep === 4 && renderAssessmentStep()}

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
            {currentStep === STEPS.length - 2 && (
              <button
                onClick={handleRunAssessment}
                disabled={!workforce.name || !selectedPosition}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Run Assessment
              </button>
            )}

            {currentStep < STEPS.length - 1 && (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
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
                New Assessment
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}