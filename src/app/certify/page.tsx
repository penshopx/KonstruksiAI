'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  REGULATIONS,
  SBU_CLASSIFICATIONS,
  KBLI_LIST,
  SKKNI_LIST,
  getRegulationsBySector,
  getRegulationTypeLabel,
  getSectorLabel,
  getSectorColor,
  type Regulation
} from '@/lib/certify';
import { 
  Award, 
  FileText, 
  Building2, 
  Scale, 
  BookOpen,
  Search,
  ChevronRight,
  ExternalLink,
  Shield,
  Zap,
  HardHat,
  Factory,
  Briefcase,
  CheckCircle,
  AlertCircle,
  GraduationCap
} from 'lucide-react';

export default function CertifyPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'regulations' | 'sbu' | 'skkni' | 'kbli'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('all');

  const sectors = ['all', 'konstruksi', 'ketenagalistrikan', 'energi', 'mineral', 'migas', 'safety'] as const;

  const filteredRegulations = REGULATIONS.filter(reg => {
    const matchesSearch = 
      reg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSector = selectedSector === 'all' || reg.sector === selectedSector;
    return matchesSearch && matchesSector;
  });

  const stats = {
    totalRegulations: REGULATIONS.length,
    totalSBU: SBU_CLASSIFICATIONS.length,
    totalKBLI: KBLI_LIST.length,
    totalSKKNI: SKKNI_LIST.length
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 py-16 lg:py-24">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Award className="w-4 h-4 text-emerald-200" />
            <span className="text-white/90 text-sm font-medium">Portal Sertifikasi Keteknikan Indonesia</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Sertifikasi &
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-cyan-200">
              Regulasi Teknik
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-emerald-100 max-w-3xl mx-auto mb-10">
            Informasi lengkap SBU, SKTK, SKKNI, KBLI, dan regulasi nasional untuk 
            konstruksi, ketenagalistrikan, energi, migas, dan pertambangan.
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { icon: Scale, value: stats.totalRegulations, label: 'Regulasi' },
              { icon: Building2, value: stats.totalSBU, label: 'Klasifikasi SBU' },
              { icon: BookOpen, value: stats.totalKBLI, label: 'Kode KBLI' },
              { icon: GraduationCap, value: stats.totalSKKNI, label: 'SKKNI' }
            ].map((stat, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <stat.icon className="w-6 h-6 text-emerald-200 mx-auto mb-2" />
                <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-emerald-200 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: Award },
              { id: 'regulations', label: 'Regulasi', icon: Scale },
              { id: 'sbu', label: 'SBU / BUJK', icon: Building2 },
              { id: 'skkni', label: 'SKKNI', icon: GraduationCap },
              { id: 'kbli', label: 'KBLI', icon: Briefcase }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'regulations' && (
          <RegulationsTab 
            regulations={filteredRegulations}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedSector={selectedSector}
            setSelectedSector={setSelectedSector}
            sectors={sectors}
          />
        )}
        {activeTab === 'sbu' && <SBUTab />}
        {activeTab === 'skkni' && <SKKNITab />}
        {activeTab === 'kbli' && <KBLITab />}
      </section>
    </div>
  );
}

// ============ OVERVIEW TAB ============
function OverviewTab() {
  return (
    <div className="space-y-12">
      {/* Introduction */}
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Sistem Sertifikasi Indonesia</h2>
        <p className="text-lg text-slate-600">
          Sistem sertifikasi keteknikan di Indonesia mengacu pada SKKNI (Standar Kompetensi Kerja Nasional Indonesia) 
          dan regulasi yang berlaku di masing-masing sektor.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* SBU Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all">
          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
            <Building2 className="w-6 h-6 text-emerald-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">SBU / BUJK</h3>
          <p className="text-slate-600 mb-4">
            Sertifikat Badan Usaha untuk perusahaan jasa konstruksi dengan klasifikasi dan kualifikasi tertentu.
          </p>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              BG - Bangunan Gedung
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              SP - Sipil
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              EL - Elektrikal
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              ME - Mekanikal
            </li>
          </ul>
        </div>

        {/* SKTK Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
            <GraduationCap className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">SKTK / SKK</h3>
          <p className="text-slate-600 mb-4">
            Sertifikat Kompetensi Kerja untuk tenaga ahli dan teknisi konstruksi sesuai bidangnya.
          </p>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-blue-500" />
              Level Operator
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-blue-500" />
              Level Teknisi
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-blue-500" />
              Level Supervisor
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-blue-500" />
              Level Manajerial
            </li>
          </ul>
        </div>

        {/* SKKNI Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-purple-300 hover:shadow-lg transition-all">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
            <BookOpen className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">SKKNI</h3>
          <p className="text-slate-600 mb-4">
            Standar Kompetensi Kerja Nasional Indonesia yang menjadi acuan sertifikasi kompetensi.
          </p>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-purple-500" />
              Unit Kompetensi
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-purple-500" />
              Elemen Kompetensi
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-purple-500" />
              Kriteria Unjuk Kerja (KUK)
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-purple-500" />
              Level KKI 1-9
            </li>
          </ul>
        </div>
      </div>

      {/* Sector Overview */}
      <div className="bg-slate-900 rounded-2xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-6">Cakupan Sektor</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: HardHat, name: 'Konstruksi', desc: 'Bangunan gedung, sipil, mekanikal, elektrikal', regs: 5 },
            { icon: Zap, name: 'Ketenagalistrikan', desc: 'Pembangkit, transmisi, distribusi, ketenagalistrikan', regs: 3 },
            { icon: Factory, name: 'Energi & EBT', desc: 'Energi baru terbarukan, konservasi energi', regs: 3 },
            { icon: Factory, name: 'Migas', desc: 'Minyak, gas bumi, hulu dan hilir', regs: 3 },
            { icon: Factory, name: 'Mineral & Batubara', desc: 'Pertambangan, pengolahan mineral', regs: 3 },
            { icon: Shield, name: 'Keselamatan (K3)', desc: 'SMK3, keselamatan kerja, audit K3', regs: 3 }
          ].map((sector, i) => (
            <div key={i} className="bg-white/10 rounded-xl p-4">
              <sector.icon className="w-8 h-8 text-emerald-400 mb-3" />
              <h3 className="font-bold text-lg mb-1">{sector.name}</h3>
              <p className="text-slate-300 text-sm mb-2">{sector.desc}</p>
              <p className="text-emerald-400 text-sm">{sector.regs} regulasi</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============ REGULATIONS TAB ============
function RegulationsTab({ 
  regulations, 
  searchQuery, 
  setSearchQuery, 
  selectedSector, 
  setSelectedSector,
  sectors 
}: { 
  regulations: Regulation[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedSector: string;
  setSelectedSector: (s: string) => void;
  sectors: readonly string[];
}) {
  return (
    <div className="space-y-6">
      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari regulasi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <select
          value={selectedSector}
          onChange={(e) => setSelectedSector(e.target.value)}
          className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
        >
          <option value="all">Semua Sektor</option>
          {sectors.filter(s => s !== 'all').map(sector => (
            <option key={sector} value={sector}>{getSectorLabel(sector as Regulation['sector'])}</option>
          ))}
        </select>
      </div>

      {/* Regulations List */}
      <div className="grid gap-4">
        {regulations.map((reg) => (
          <div key={reg.id} className="bg-white rounded-xl p-6 border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`${getSectorColor(reg.sector)} px-3 py-1 rounded-full text-xs font-medium`}>
                    {getSectorLabel(reg.sector)}
                  </span>
                  <span className="text-slate-500 text-sm">
                    {getRegulationTypeLabel(reg.type)} No. {reg.number} Tahun {reg.year}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{reg.title}</h3>
                <p className="text-slate-600 mb-4">{reg.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {reg.keyPoints.slice(0, 3).map((point, i) => (
                    <span key={i} className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
                      {point}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <span className="text-slate-500">
                    <strong>Ruang Lingkup:</strong> {reg.scope.join(', ')}
                  </span>
                </div>
              </div>
              
              <button className="flex-shrink-0 p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors">
                <ExternalLink className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ SBU TAB ============
function SBUTab() {
  return (
    <div className="space-y-8">
      <div className="text-center max-w-3xl mx-auto mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Klasifikasi SBU (Sertifikat Badan Usaha)</h2>
        <p className="text-slate-600">
          SBU diterbitkan oleh LPJK (Lembaga Pengembangan Jasa Konstruksi) dengan klasifikasi bidang dan kualifikasi.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {SBU_CLASSIFICATIONS.map((sbu) => (
          <div key={sbu.code} className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl font-bold text-emerald-600">{sbu.code}</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">{sbu.name}</h3>
                <p className="text-slate-500 text-sm">{sbu.kblis.length} KBLI terkait</p>
              </div>
            </div>
            
            <p className="text-slate-600 mb-4">{sbu.description}</p>
            
            <div className="mb-4">
              <h4 className="font-semibold text-slate-900 mb-2 text-sm">Ruang Lingkup:</h4>
              <ul className="space-y-1">
                {sbu.scope.slice(0, 3).map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-2">
              {sbu.kblis.slice(0, 3).map((kbli, i) => (
                <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                  KBLI {kbli}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Qualification Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-xl font-bold text-slate-900">Persyaratan Kualifikasi</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Kualifikasi</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Modal Min.</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Pengalaman</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Nilai Proyek</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="px-6 py-4 font-medium text-slate-900">Kecil</td>
                <td className="px-6 py-4 text-slate-600">Rp 500 juta</td>
                <td className="px-6 py-4 text-slate-600">1 tahun</td>
                <td className="px-6 py-4 text-slate-600">Rp 200 juta</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-slate-900">Menengah</td>
                <td className="px-6 py-4 text-slate-600">Rp 2,5 miliar</td>
                <td className="px-6 py-4 text-slate-600">3 tahun</td>
                <td className="px-6 py-4 text-slate-600">Rp 1 miliar</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-slate-900">Besar</td>
                <td className="px-6 py-4 text-slate-600">Rp 10 miliar</td>
                <td className="px-6 py-4 text-slate-600">5 tahun</td>
                <td className="px-6 py-4 text-slate-600">Rp 5 miliar</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============ SKKNI TAB ============
function SKKNITab() {
  return (
    <div className="space-y-6">
      <div className="text-center max-w-3xl mx-auto mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Standar Kompetensi Kerja Nasional Indonesia (SKKNI)</h2>
        <p className="text-slate-600">
          SKKNI adalah standar kompetensi yang ditetapkan oleh pemerintah sebagai acuan sertifikasi kompetensi kerja.
        </p>
      </div>

      <div className="grid gap-6">
        {SKKNI_LIST.map((skkni) => (
          <div key={skkni.code} className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-all">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                    Level KKI {skkni.levelKKI}
                  </span>
                  <span className="text-slate-500 text-sm">{skkni.sector}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">{skkni.title}</h3>
                <p className="text-slate-500 text-sm font-mono">{skkni.code}</p>
              </div>
            </div>
            
            <p className="text-slate-600 mb-6">{skkni.description}</p>
            
            <div className="space-y-4">
              {skkni.unitCompetencies.map((unit) => (
                <div key={unit.code} className="bg-slate-50 rounded-xl p-4">
                  <h4 className="font-semibold text-slate-900 mb-2">{unit.title}</h4>
                  <p className="text-slate-500 text-sm mb-2">{unit.code}</p>
                  <div className="space-y-2">
                    {unit.elements.map((element) => (
                      <div key={element.code} className="text-sm">
                        <p className="font-medium text-slate-700">{element.description}</p>
                        <ul className="mt-1 ml-4 space-y-1">
                          {element.kuk.slice(0, 2).map((kuk, i) => (
                            <li key={i} className="text-slate-500 text-xs">• {kuk}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ KBLI TAB ============
function KBLITab() {
  return (
    <div className="space-y-6">
      <div className="text-center max-w-3xl mx-auto mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">KBLI (Klasifikasi Baku Lapangan Usaha Indonesia)</h2>
        <p className="text-slate-600">
          KBLI adalah klasifikasi bidang usaha yang digunakan untuk standarisasi pengumpulan, pengolahan, 
          dan penyajian data statistik ekonomi.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {KBLI_LIST.map((kbli) => (
          <div key={kbli.code} className="bg-white rounded-xl p-5 border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-2">
              <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg text-sm font-mono font-semibold">
                {kbli.code}
              </span>
              <span className="text-xs text-slate-400">
                {kbli.sbuMappings.length} SBU
              </span>
            </div>
            <h3 className="font-bold text-slate-900 mb-2">{kbli.name}</h3>
            <p className="text-slate-600 text-sm mb-3">{kbli.description}</p>
            
            <div className="space-y-2">
              <div className="flex flex-wrap gap-1">
                {kbli.sbuMappings.map((sbu, i) => (
                  <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                    {sbu}
                  </span>
                ))}
              </div>
              <div className="pt-2 border-t border-slate-100">
                <p className="text-xs text-slate-500">
                  <strong>Persyaratan:</strong> {kbli.requirements.join(', ')}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
