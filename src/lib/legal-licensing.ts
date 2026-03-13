/**
 * Legal & Licensing Library
 * Comprehensive legal compliance and licensing management
 * Covers business entity legality, permits, licenses, and renewal tracking
 */

export interface LegalEntity {
  id: string;
  name: string;
  type: 'PT' | 'CV' | 'UD' | 'Firma' | 'Koperasi' | 'Perorangan';
  npwp: string;
  nib?: string; // Nomor Induk Berusaha
  sector: string;
  subSector: string;
  region: string;
  establishmentDate: string;
  status: 'active' | 'inactive' | 'suspended' | 'dissolved';
}

export interface LicenseRequirement {
  id: string;
  name: string;
  category: 'business' | 'sectoral' | 'environmental' | 'safety' | 'labor' | 'regional';
  authority: string;
  legalBasis: string;
  mandatory: boolean;
  sectorApplicability: string[];
  regionApplicability: string[];
  validityPeriod: number; // in months
  renewalNoticePeriod: number; // in months
  requirements: LicenseRequirementItem[];
  fees: {
    initial: number;
    renewal: number;
    latePenalty: number;
  };
}

export interface LicenseRequirementItem {
  id: string;
  description: string;
  documentType: string;
  mandatory: boolean;
  verificationMethod: string;
  validityPeriod?: number;
}

export interface LicenseStatus {
  id: string;
  licenseRequirementId: string;
  entityId: string;
  status: 'not_applied' | 'applied' | 'approved' | 'rejected' | 'expired' | 'suspended';
  applicationDate?: string;
  approvalDate?: string;
  expiryDate?: string;
  licenseNumber?: string;
  documents: LicenseDocument[];
  renewalHistory: RenewalRecord[];
}

export interface LicenseDocument {
  id: string;
  type: string;
  name: string;
  uploadDate: string;
  expiryDate?: string;
  status: 'valid' | 'expired' | 'pending_verification';
  url: string;
}

export interface RenewalRecord {
  id: string;
  renewalDate: string;
  expiryDate: string;
  status: 'successful' | 'failed' | 'pending';
  feePaid: number;
  notes: string;
}

export interface LegalComplianceCheck {
  entityId: string;
  checkDate: string;
  overallCompliance: number;
  licenseCompliance: LicenseCompliance[];
  gaps: ComplianceGap[];
  recommendations: string[];
  nextReviewDate: string;
}

export interface LicenseCompliance {
  licenseId: string;
  licenseName: string;
  required: boolean;
  status: 'compliant' | 'non_compliant' | 'expired' | 'pending';
  expiryDate?: string;
  daysUntilExpiry?: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface ComplianceGap {
  id: string;
  licenseId: string;
  gapDescription: string;
  impact: string;
  priority: 'high' | 'medium' | 'low';
  estimatedCost: number;
  estimatedTime: number; // in days
  responsibleParty: string;
}

// Indonesian License Requirements Database
export const LICENSE_REQUIREMENTS: LicenseRequirement[] = [
  {
    id: 'nib',
    name: 'Nomor Induk Berusaha (NIB)',
    category: 'business',
    authority: 'BKPM/OSS',
    legalBasis: 'UU No. 11 Tahun 2020 tentang Cipta Kerja',
    mandatory: true,
    sectorApplicability: ['all'],
    regionApplicability: ['national'],
    validityPeriod: 0, // perpetual
    renewalNoticePeriod: 0,
    requirements: [
      { id: 'ktp_director', description: 'KTP Direktur/Penanggung Jawab', documentType: 'identity', mandatory: true, verificationMethod: 'document_upload' },
      { id: 'akta_pendirian', description: 'Akta Pendirian Perusahaan', documentType: 'legal', mandatory: true, verificationMethod: 'document_upload' },
      { id: 'npwp', description: 'NPWP Perusahaan', documentType: 'tax', mandatory: true, verificationMethod: 'api_verification' },
      { id: 'surat_domisili', description: 'Surat Keterangan Domisili', documentType: 'address', mandatory: true, verificationMethod: 'document_upload' }
    ],
    fees: { initial: 0, renewal: 0, latePenalty: 0 }
  },
  {
    id: 'siup',
    name: 'Surat Izin Usaha Perdagangan (SIUP)',
    category: 'business',
    authority: 'Kementerian Perdagangan',
    legalBasis: 'PP No. 7 Tahun 2021',
    mandatory: true,
    sectorApplicability: ['trade', 'services'],
    regionApplicability: ['provincial'],
    validityPeriod: 60, // 5 years
    renewalNoticePeriod: 3,
    requirements: [
      { id: 'nib', description: 'NIB yang masih berlaku', documentType: 'license', mandatory: true, verificationMethod: 'api_verification' },
      { id: 'akta_perusahaan', description: 'Akta Perusahaan yang masih berlaku', documentType: 'legal', mandatory: true, verificationMethod: 'document_upload' },
      { id: 'npwp', description: 'NPWP Perusahaan aktif', documentType: 'tax', mandatory: true, verificationMethod: 'api_verification' },
      { id: 'surat_domisili', description: 'Surat Keterangan Domisili', documentType: 'address', mandatory: true, verificationMethod: 'document_upload' }
    ],
    fees: { initial: 2500000, renewal: 2500000, latePenalty: 500000 }
  },
  {
    id: 'sbu',
    name: 'Sertifikat Badan Usaha (SBU)',
    category: 'sectoral',
    authority: 'LPJK',
    legalBasis: 'PP No. 28 Tahun 2015',
    mandatory: true,
    sectorApplicability: ['construction'],
    regionApplicability: ['national'],
    validityPeriod: 36, // 3 years
    renewalNoticePeriod: 3,
    requirements: [
      { id: 'siup', description: 'SIUP yang masih berlaku', documentType: 'license', mandatory: true, verificationMethod: 'api_verification' },
      { id: 'akta_perusahaan', description: 'Akta Perusahaan', documentType: 'legal', mandatory: true, verificationMethod: 'document_upload' },
      { id: 'pengalaman_proyek', description: 'Daftar Pengalaman Proyek', documentType: 'experience', mandatory: true, verificationMethod: 'document_upload' },
      { id: 'tenaga_ahli', description: 'Sertifikat Tenaga Ahli', documentType: 'certification', mandatory: true, verificationMethod: 'document_upload' },
      { id: 'peralatan', description: 'Daftar Peralatan', documentType: 'asset', mandatory: true, verificationMethod: 'document_upload' }
    ],
    fees: { initial: 5000000, renewal: 3000000, latePenalty: 1000000 }
  },
  {
    id: 'smk3',
    name: 'Sertifikat Sistem Manajemen Keselamatan Kerja (SMK3)',
    category: 'safety',
    authority: 'Kementerian Ketenagakerjaan',
    legalBasis: 'PP No. 50 Tahun 2012',
    mandatory: true,
    sectorApplicability: ['construction', 'mining', 'oil_gas', 'manufacturing'],
    regionApplicability: ['provincial'],
    validityPeriod: 36, // 3 years
    renewalNoticePeriod: 6,
    requirements: [
      { id: 'kebijakan_k3', description: 'Kebijakan Keselamatan Kerja', documentType: 'policy', mandatory: true, verificationMethod: 'document_upload' },
      { id: 'struktur_k3', description: 'Struktur Organisasi K3', documentType: 'organizational', mandatory: true, verificationMethod: 'document_upload' },
      { id: 'program_k3', description: 'Program K3', documentType: 'program', mandatory: true, verificationMethod: 'document_upload' },
      { id: 'pelatihan_k3', description: 'Daftar Pelatihan K3', documentType: 'training', mandatory: true, verificationMethod: 'document_upload' }
    ],
    fees: { initial: 1500000, renewal: 1000000, latePenalty: 500000 }
  },
  {
    id: 'amdal',
    name: 'Analisis Mengenai Dampak Lingkungan (AMDAL)',
    category: 'environmental',
    authority: 'KLHK',
    legalBasis: 'UU No. 32 Tahun 2009',
    mandatory: false, // Depends on project scale
    sectorApplicability: ['construction', 'mining', 'oil_gas', 'industry'],
    regionApplicability: ['provincial'],
    validityPeriod: 0, // Project-specific
    renewalNoticePeriod: 0,
    requirements: [
      { id: 'ukl_upl', description: 'UKL-UPL atau AMDAL', documentType: 'environmental', mandatory: true, verificationMethod: 'document_upload' },
      { id: 'rkl_rpl', description: 'RKL-RPL', documentType: 'environmental', mandatory: true, verificationMethod: 'document_upload' }
    ],
    fees: { initial: 50000000, renewal: 25000000, latePenalty: 10000000 }
  }
];

// Helper Functions
export function checkLicenseCompliance(
  entity: LegalEntity,
  licenses: LicenseStatus[]
): LegalComplianceCheck {
  const applicableLicenses = LICENSE_REQUIREMENTS.filter(req =>
    req.sectorApplicability.includes('all') ||
    req.sectorApplicability.includes(entity.sector.toLowerCase())
  );

  const licenseCompliance: LicenseCompliance[] = applicableLicenses.map(req => {
    const licenseStatus = licenses.find(l => l.licenseRequirementId === req.id);
    const compliance: LicenseCompliance = {
      licenseId: req.id,
      licenseName: req.name,
      required: req.mandatory,
      status: 'non_compliant',
      riskLevel: 'medium'
    };

    if (licenseStatus) {
      compliance.status = licenseStatus.status === 'approved' ? 'compliant' : 'non_compliant';
      compliance.expiryDate = licenseStatus.expiryDate;

      if (licenseStatus.expiryDate) {
        const daysUntilExpiry = Math.ceil(
          (new Date(licenseStatus.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        );
        compliance.daysUntilExpiry = daysUntilExpiry;

        if (daysUntilExpiry < 0) {
          compliance.status = 'expired';
          compliance.riskLevel = 'critical';
        } else if (daysUntilExpiry < 30) {
          compliance.riskLevel = 'high';
        } else if (daysUntilExpiry < 90) {
          compliance.riskLevel = 'medium';
        } else {
          compliance.riskLevel = 'low';
        }
      }
    } else if (req.mandatory) {
      compliance.status = 'non_compliant';
      compliance.riskLevel = 'high';
    }

    return compliance;
  });

  const compliantCount = licenseCompliance.filter(l => l.status === 'compliant').length;
  const overallCompliance = Math.round((compliantCount / applicableLicenses.length) * 100);

  const gaps: ComplianceGap[] = licenseCompliance
    .filter(l => l.status !== 'compliant')
    .map(l => {
      const req = applicableLicenses.find(r => r.id === l.licenseId)!;
      return {
        id: `gap-${l.licenseId}`,
        licenseId: l.licenseId,
        gapDescription: `Belum memiliki ${l.licenseName}`,
        impact: l.riskLevel === 'critical' ? 'Bisnis tidak bisa beroperasi' :
                l.riskLevel === 'high' ? 'Risiko penalti dan denda tinggi' :
                'Risiko administratif',
        priority: l.riskLevel === 'critical' ? 'high' : l.riskLevel === 'high' ? 'high' : 'medium',
        estimatedCost: req.fees.initial,
        estimatedTime: 30, // days
        responsibleParty: 'Management'
      };
    });

  const recommendations = [
    'Segera lengkapi semua izin wajib yang masih kurang',
    'Monitor masa berlaku izin dan siapkan perpanjangan',
    'Persiapkan dokumen pendukung untuk renewal',
    'Konsultasikan dengan konsultan legal untuk compliance'
  ];

  return {
    entityId: entity.id,
    checkDate: new Date().toISOString(),
    overallCompliance,
    licenseCompliance,
    gaps,
    recommendations,
    nextReviewDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
  };
}

export function getLicenseRequirementsForEntity(entity: LegalEntity): LicenseRequirement[] {
  return LICENSE_REQUIREMENTS.filter(req =>
    req.sectorApplicability.includes('all') ||
    req.sectorApplicability.includes(entity.sector.toLowerCase())
  );
}

export function generateLicenseChecklist(entity: LegalEntity): LicenseStatus[] {
  const applicableLicenses = getLicenseRequirementsForEntity(entity);

  return applicableLicenses.map(req => ({
    id: `license-${entity.id}-${req.id}`,
    licenseRequirementId: req.id,
    entityId: entity.id,
    status: 'not_applied',
    documents: [],
    renewalHistory: []
  }));
}

export function calculateRenewalUrgency(license: LicenseStatus, requirement: LicenseRequirement): {
  urgency: 'normal' | 'urgent' | 'critical';
  daysUntilRenewal: number;
  message: string;
} {
  if (!license.expiryDate) {
    return {
      urgency: 'critical',
      daysUntilRenewal: 0,
      message: 'Masa berlaku tidak diketahui - periksa segera'
    };
  }

  const expiryDate = new Date(license.expiryDate);
  const today = new Date();
  const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  const noticePeriod = requirement.renewalNoticePeriod * 30; // convert months to days

  if (daysUntilExpiry < 0) {
    return {
      urgency: 'critical',
      daysUntilRenewal: daysUntilExpiry,
      message: `Sudah expired ${Math.abs(daysUntilExpiry)} hari yang lalu`
    };
  } else if (daysUntilExpiry <= noticePeriod) {
    return {
      urgency: 'urgent',
      daysUntilRenewal: daysUntilExpiry,
      message: `Perlu diperpanjang dalam ${daysUntilExpiry} hari`
    };
  } else {
    return {
      urgency: 'normal',
      daysUntilRenewal: daysUntilExpiry,
      message: `Berlaku sampai ${daysUntilExpiry} hari lagi`
    };
  }
}