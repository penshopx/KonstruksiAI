"use client";

import { useState, useMemo } from "react";
import {
  LICENSE_REQUIREMENTS,
  checkLicenseCompliance,
  getLicenseRequirementsForEntity,
  generateLicenseChecklist,
  calculateRenewalUrgency,
  type LegalEntity,
  type LicenseStatus,
  type LicenseRequirement
} from "@/lib/legal-licensing";
import NavbarAuth from "@/components/NavbarAuth";

const TABS = [
  { id: "overview", label: "📊 Overview", icon: "📊" },
  { id: "compliance", label: "✅ Kepatuhan", icon: "✅" },
  { id: "requirements", label: "📋 Persyaratan", icon: "📋" },
  { id: "renewal", label: "🔄 Perpanjangan", icon: "🔄" },
];

const STATUS_COLORS = {
  compliant: "bg-green-500/20 text-green-400 border-green-500/40",
  non_compliant: "bg-red-500/20 text-red-400 border-red-500/40",
  expired: "bg-red-500/20 text-red-400 border-red-500/40",
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/40",
  approved: "bg-green-500/20 text-green-400 border-green-500/40",
  rejected: "bg-red-500/20 text-red-400 border-red-500/40",
  suspended: "bg-orange-500/20 text-orange-400 border-orange-500/40",
  not_applied: "bg-gray-500/20 text-gray-400 border-gray-500/40",
};

const RISK_COLORS = {
  low: "bg-green-500/20 text-green-400 border-green-500/40",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/40",
  high: "bg-orange-500/20 text-orange-400 border-orange-500/40",
  critical: "bg-red-500/20 text-red-400 border-red-500/40",
};

export default function LegalLicensingPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [companyName, setCompanyName] = useState("PT Konstruksi Maju Jaya");
  const [sector, setSector] = useState("construction");
  const [region, setRegion] = useState("DKI Jakarta");

  // Mock entity
  const mockEntity: LegalEntity = useMemo(() => ({
    id: 'entity-001',
    name: companyName,
    type: 'PT',
    npwp: '01.234.567.8-123.000',
    nib: '1234567890123',
    sector,
    subSector: 'civil engineering',
    region,
    establishmentDate: '2020-01-15',
    status: 'active'
  }), [companyName, sector, region]);

  // Mock license statuses
  const mockLicenses: LicenseStatus[] = useMemo(() => [
    {
      id: 'license-nib',
      licenseRequirementId: 'nib',
      entityId: 'entity-001',
      status: 'approved',
      approvalDate: '2020-02-01',
      documents: [],
      renewalHistory: []
    },
    {
      id: 'license-siup',
      licenseRequirementId: 'siup',
      entityId: 'entity-001',
      status: 'approved',
      approvalDate: '2020-03-01',
      expiryDate: '2025-03-01',
      documents: [],
      renewalHistory: []
    },
    {
      id: 'license-sbu',
      licenseRequirementId: 'sbu',
      entityId: 'entity-001',
      status: 'approved',
      approvalDate: '2020-04-01',
      expiryDate: '2023-04-01', // Expired
      documents: [],
      renewalHistory: []
    },
    {
      id: 'license-smk3',
      licenseRequirementId: 'smk3',
      entityId: 'entity-001',
      status: 'not_applied',
      documents: [],
      renewalHistory: []
    }
  ], []);

  const complianceCheck = useMemo(() =>
    checkLicenseCompliance(mockEntity, mockLicenses),
    [mockEntity, mockLicenses]
  );

  const applicableLicenses = useMemo(() =>
    getLicenseRequirementsForEntity(mockEntity),
    [mockEntity]
  );

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Legal & Licensing Dashboard</h2>
        <p className="text-blue-100">Pantau kepatuhan perizinan dan status legalitas perusahaan</p>
      </div>

      {/* Company Profile */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Profil Perusahaan</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Nama Perusahaan</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Sektor</label>
            <select
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
            >
              <option value="construction">Konstruksi</option>
              <option value="mining">Pertambangan</option>
              <option value="oil_gas">Migas</option>
              <option value="manufacturing">Manufaktur</option>
              <option value="trade">Perdagangan</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Wilayah</label>
            <input
              type="text"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">NPWP</label>
            <input
              type="text"
              value={mockEntity.npwp}
              readOnly
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <div className="text-3xl font-bold text-blue-400 mb-2">{complianceCheck.overallCompliance}%</div>
          <div className="text-slate-300 font-medium">Skor Kepatuhan</div>
          <div className="text-slate-400 text-sm mt-1">Target: 100%</div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <div className="text-3xl font-bold text-green-400 mb-2">
            {complianceCheck.licenseCompliance.filter(l => l.status === 'compliant').length}
          </div>
          <div className="text-slate-300 font-medium">Izin Compliant</div>
          <div className="text-slate-400 text-sm mt-1">Dari {applicableLicenses.length} total</div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <div className="text-3xl font-bold text-red-400 mb-2">
            {complianceCheck.licenseCompliance.filter(l => l.daysUntilExpiry !== undefined && l.daysUntilExpiry < 0).length}
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
                <span className={`px-2 py-1 rounded-full text-xs ${STATUS_COLORS[license.status as keyof typeof STATUS_COLORS]}`}>
                  {license.status === 'compliant' ? '✅ OK' :
                   license.status === 'expired' ? '❌ Expired' :
                   license.status === 'pending' ? '⏳ Pending' : '⚠️ Issue'}
                </span>
                {license.daysUntilExpiry !== undefined && (
                  <span className={`px-2 py-1 rounded-full text-xs ${RISK_COLORS[license.riskLevel as keyof typeof RISK_COLORS]}`}>
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

  const renderCompliance = () => (
    <div className="space-y-6">
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Detail Status Kepatuhan</h3>
        <div className="space-y-4">
          {complianceCheck.licenseCompliance.map((license) => {
            const requirement = applicableLicenses.find(r => r.id === license.licenseId);
            const urgency = license.expiryDate && requirement ?
              calculateRenewalUrgency(mockLicenses.find(l => l.licenseRequirementId === license.licenseId)!, requirement) :
              null;

            return (
              <div key={license.licenseId} className="border border-slate-600 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-slate-100 font-medium">{license.licenseName}</h4>
                    <p className="text-slate-400 text-sm">{requirement?.authority}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${STATUS_COLORS[license.status as keyof typeof STATUS_COLORS]}`}>
                      {license.status}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${RISK_COLORS[license.riskLevel as keyof typeof RISK_COLORS]}`}>
                      {license.riskLevel}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Masa Berlaku:</span>
                    <span className="text-slate-100 ml-2">
                      {requirement?.validityPeriod ? `${requirement.validityPeriod} bulan` : 'Seumur hidup'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Biaya Perpanjangan:</span>
                    <span className="text-slate-100 ml-2">
                      Rp {requirement?.fees.renewal.toLocaleString('id-ID')}
                    </span>
                  </div>
                  {license.expiryDate && (
                    <div>
                      <span className="text-slate-400">Berlaku sampai:</span>
                      <span className="text-slate-100 ml-2">
                        {new Date(license.expiryDate).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                  )}
                  {urgency && (
                    <div>
                      <span className="text-slate-400">Status Perpanjangan:</span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                        urgency.urgency === 'critical' ? 'bg-red-500/20 text-red-400' :
                        urgency.urgency === 'urgent' ? 'bg-orange-500/20 text-orange-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {urgency.urgency.toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                {urgency && (
                  <div className="mt-3 p-3 bg-slate-700/50 rounded-lg">
                    <p className="text-slate-300 text-sm">{urgency.message}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {complianceCheck.gaps.length > 0 && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Gap Kepatuhan yang Perlu Ditangani</h3>
          <div className="space-y-3">
            {complianceCheck.gaps.map((gap) => (
              <div key={gap.id} className="border border-slate-600 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-slate-100 font-medium">{gap.gapDescription}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    gap.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                    gap.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {gap.priority.toUpperCase()}
                  </span>
                </div>
                <p className="text-slate-400 text-sm mb-2">{gap.impact}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Estimasi Biaya:</span>
                    <span className="text-slate-100 ml-2">Rp {gap.estimatedCost.toLocaleString('id-ID')}</span>
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

  const renderRequirements = () => (
    <div className="space-y-6">
      {applicableLicenses.map((license) => (
        <div key={license.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-100">{license.name}</h3>
              <p className="text-slate-400 text-sm">{license.authority} • {license.legalBasis}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded-full text-xs ${
                license.mandatory ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
              }`}>
                {license.mandatory ? 'Wajib' : 'Opsional'}
              </span>
              <span className="text-slate-400 text-sm">
                {license.category}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-slate-700/50 rounded-lg p-3">
              <div className="text-slate-400 text-sm">Masa Berlaku</div>
              <div className="text-slate-100 font-medium">
                {license.validityPeriod > 0 ? `${license.validityPeriod} bulan` : 'Seumur hidup'}
              </div>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-3">
              <div className="text-slate-400 text-sm">Biaya Awal</div>
              <div className="text-slate-100 font-medium">
                Rp {license.fees.initial.toLocaleString('id-ID')}
              </div>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-3">
              <div className="text-slate-400 text-sm">Biaya Perpanjangan</div>
              <div className="text-slate-100 font-medium">
                Rp {license.fees.renewal.toLocaleString('id-ID')}
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-slate-100 font-medium mb-2">Dokumen yang Diperlukan:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {license.requirements.map((req) => (
                <div key={req.id} className="flex items-center gap-2">
                  <span className={req.mandatory ? 'text-red-400' : 'text-green-400'}>
                    {req.mandatory ? '●' : '○'}
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

  const renderRenewal = () => (
    <div className="space-y-6">
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Jadwal Perpanjangan Izin</h3>
        <div className="space-y-4">
          {mockLicenses
            .filter(license => license.expiryDate)
            .map(license => {
              const requirement = applicableLicenses.find(r => r.id === license.licenseRequirementId);
              if (!requirement) return null;

              const urgency = calculateRenewalUrgency(license, requirement);

              return (
                <div key={license.id} className="border border-slate-600 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-slate-100 font-medium">{requirement.name}</h4>
                      <p className="text-slate-400 text-sm">
                        Expired: {new Date(license.expiryDate!).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      urgency.urgency === 'critical' ? 'bg-red-500/20 text-red-400' :
                      urgency.urgency === 'urgent' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {urgency.urgency.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-slate-300 text-sm mb-3">{urgency.message}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Biaya Perpanjangan:</span>
                      <span className="text-slate-100 ml-2 font-medium">
                        Rp {requirement.fees.renewal.toLocaleString('id-ID')}
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

  return (
    <div className="min-h-screen bg-slate-900">
      <NavbarAuth />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-100 mb-2">⚖️ Legal & Licensing</h1>
          <p className="text-slate-400">Kelola kepatuhan perizinan dan status legalitas perusahaan</p>
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

        {activeTab === "overview" && renderOverview()}
        {activeTab === "compliance" && renderCompliance()}
        {activeTab === "requirements" && renderRequirements()}
        {activeTab === "renewal" && renderRenewal()}
      </div>
    </div>
  );
}