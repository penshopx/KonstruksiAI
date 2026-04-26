'use client';

import { useState } from 'react';
import Link from '@/shims/next-link';
import {
  BIMTEK_MODULES,
  getBimtekByCategory,
  getCategoryLabel,
  getCategoryColor,
  getLevelLabel,
  getLevelColor,
  formatDuration,
  type BimtekModule,
  type BimtekCategory,
} from '@/lib/bimtek';
import {
  BookOpen,
  Clock,
  Award,
  ChevronRight,
  Search,
  Filter,
  Play,
  CheckCircle,
  Users,
  Star,
  GraduationCap,
  HardHat,
  Zap,
  Wrench,
  Shield,
  Briefcase,
  FileText,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const CATEGORIES: { id: BimtekCategory | 'all'; label: string; icon: React.ElementType }[] = [
  { id: 'all', label: 'Semua', icon: BookOpen },
  { id: 'konstruksi', label: 'Konstruksi', icon: HardHat },
  { id: 'elektrikal', label: 'Elektrikal', icon: Zap },
  { id: 'mekanikal', label: 'Mekanikal', icon: Wrench },
  { id: 'energi', label: 'Energi & EBT', icon: Star },
  { id: 'k3', label: 'K3', icon: Shield },
  { id: 'manajemen', label: 'Manajemen', icon: Briefcase },
  { id: 'perijinan', label: 'Perijinan', icon: FileText },
];

export default function BimtekPage() {
  const [activeCategory, setActiveCategory] = useState<BimtekCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState<BimtekModule | null>(null);
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);

  const filteredModules = BIMTEK_MODULES.filter(m => {
    const matchesCategory = activeCategory === 'all' || m.category === activeCategory;
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalDuration = BIMTEK_MODULES.reduce((sum, m) => sum + m.duration, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800 py-16 lg:py-24">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <GraduationCap className="w-4 h-4 text-blue-200" />
            <span className="text-white/90 text-sm font-medium">Bimbingan Teknis Keteknikan Indonesia</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Bimtek
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200">
              Teknik & Konstruksi
            </span>
          </h1>

          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto mb-10">
            Modul bimbingan teknis komprehensif untuk meningkatkan kompetensi tenaga teknik
            di bidang konstruksi, energi, K3, dan manajemen proyek.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { icon: BookOpen, value: BIMTEK_MODULES.length, label: 'Modul Bimtek', suffix: '' },
              { icon: Clock, value: Math.round(totalDuration / 60), label: 'Total Jam', suffix: ' jam' },
              { icon: Award, value: BIMTEK_MODULES.filter(m => m.certification).length, label: 'Sertifikasi', suffix: '' },
              { icon: Users, value: '500+', label: 'Peserta', suffix: '' },
            ].map((stat, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <stat.icon className="w-6 h-6 text-blue-200 mx-auto mb-2" />
                <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}{stat.suffix}</div>
                <div className="text-blue-200 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {selectedModule ? (
          <ModuleDetail
            module={selectedModule}
            expandedTopic={expandedTopic}
            setExpandedTopic={setExpandedTopic}
            onBack={() => setSelectedModule(null)}
          />
        ) : (
          <>
            {/* Search & Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari modul bimtek..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                />
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <Filter className="w-5 h-5" />
                <span className="text-sm">{filteredModules.length} modul</span>
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    activeCategory === cat.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <cat.icon className="w-4 h-4" />
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Module Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModules.map((module) => (
                <ModuleCard
                  key={module.id}
                  module={module}
                  onClick={() => setSelectedModule(module)}
                />
              ))}
            </div>

            {filteredModules.length === 0 && (
              <div className="text-center py-16">
                <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-600 mb-2">Modul tidak ditemukan</h3>
                <p className="text-slate-500">Coba kata kunci lain atau pilih kategori berbeda</p>
              </div>
            )}

            {/* CTA Section */}
            <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white text-center">
              <GraduationCap className="w-12 h-12 mx-auto mb-4 text-blue-200" />
              <h2 className="text-2xl font-bold mb-3">Siap Uji Kompetensi?</h2>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Setelah mempelajari modul bimtek, uji kemampuan Anda dengan simulasi ujian sertifikasi SKK/SKKNI.
              </p>
              <Link
                href="/simulasi"
                className="inline-flex items-center gap-2 bg-white text-blue-700 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
              >
                <Play className="w-5 h-5" />
                Mulai Simulasi Ujian
              </Link>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

// ============ MODULE CARD ============
function ModuleCard({ module, onClick }: { module: BimtekModule; onClick: () => void }) {
  const colorMap: Record<string, string> = {
    orange: 'bg-orange-500',
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500',
    amber: 'bg-amber-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
    teal: 'bg-teal-500',
    cyan: 'bg-cyan-500',
  };

  const bgColor = colorMap[module.color] || 'bg-slate-500';

  return (
    <div
      className="bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer group"
      onClick={onClick}
    >
      {/* Header */}
      <div className={`${bgColor} rounded-t-2xl p-6 text-white`}>
        <div className="text-4xl mb-3">{module.icon}</div>
        <h3 className="text-lg font-bold leading-tight">{module.title}</h3>
      </div>

      {/* Body */}
      <div className="p-6">
        <p className="text-slate-600 text-sm mb-4 line-clamp-2">{module.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getCategoryColor(module.category)}`}>
            {getCategoryLabel(module.category)}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getLevelColor(module.level)}`}>
            {getLevelLabel(module.level)}
          </span>
        </div>

        {/* Meta */}
        <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{formatDuration(module.duration)}</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            <span>{module.topics.length} topik</span>
          </div>
        </div>

        {/* Certification */}
        {module.certification && (
          <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2 mb-4">
            <Award className="w-4 h-4 flex-shrink-0" />
            <span>{module.certification}</span>
          </div>
        )}

        {/* CTA */}
        <button className="w-full flex items-center justify-center gap-2 bg-blue-50 text-blue-700 py-2.5 rounded-xl font-medium text-sm hover:bg-blue-100 transition-colors group-hover:bg-blue-600 group-hover:text-white">
          <Play className="w-4 h-4" />
          Mulai Belajar
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ============ MODULE DETAIL ============
function ModuleDetail({
  module,
  expandedTopic,
  setExpandedTopic,
  onBack,
}: {
  module: BimtekModule;
  expandedTopic: string | null;
  setExpandedTopic: (id: string | null) => void;
  onBack: () => void;
}) {
  const colorMap: Record<string, string> = {
    orange: 'from-orange-600 to-orange-700',
    blue: 'from-blue-600 to-blue-700',
    yellow: 'from-yellow-500 to-yellow-600',
    amber: 'from-amber-500 to-amber-600',
    red: 'from-red-600 to-red-700',
    purple: 'from-purple-600 to-purple-700',
    teal: 'from-teal-600 to-teal-700',
    cyan: 'from-cyan-600 to-cyan-700',
  };

  const gradient = colorMap[module.color] || 'from-slate-600 to-slate-700';

  return (
    <div>
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
      >
        <ChevronRight className="w-5 h-5 rotate-180" />
        Kembali ke Daftar Modul
      </button>

      {/* Module Header */}
      <div className={`bg-gradient-to-r ${gradient} rounded-2xl p-8 text-white mb-8`}>
        <div className="text-5xl mb-4">{module.icon}</div>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">
            {getCategoryLabel(module.category)}
          </span>
          <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">
            {getLevelLabel(module.level)}
          </span>
        </div>
        <h1 className="text-3xl font-bold mb-3">{module.title}</h1>
        <p className="text-white/80 text-lg mb-6">{module.description}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <Clock className="w-5 h-5 mx-auto mb-1 text-white/70" />
            <div className="font-bold">{formatDuration(module.duration)}</div>
            <div className="text-white/70 text-xs">Durasi</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <BookOpen className="w-5 h-5 mx-auto mb-1 text-white/70" />
            <div className="font-bold">{module.topics.length}</div>
            <div className="text-white/70 text-xs">Topik</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <GraduationCap className="w-5 h-5 mx-auto mb-1 text-white/70" />
            <div className="font-bold">{getLevelLabel(module.level)}</div>
            <div className="text-white/70 text-xs">Level</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <Award className="w-5 h-5 mx-auto mb-1 text-white/70" />
            <div className="font-bold text-sm">{module.certification ? 'Ada' : 'Tidak'}</div>
            <div className="text-white/70 text-xs">Sertifikasi</div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Topics List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Materi Pembelajaran</h2>

          {module.topics.map((topic, index) => (
            <div key={topic.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
                onClick={() => setExpandedTopic(expandedTopic === topic.id ? null : topic.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{topic.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{formatDuration(topic.duration)}</span>
                      <span>•</span>
                      <span>{topic.keyPoints.length} poin kunci</span>
                    </div>
                  </div>
                </div>
                {expandedTopic === topic.id ? (
                  <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                )}
              </button>

              {expandedTopic === topic.id && (
                <div className="px-5 pb-5 border-t border-slate-100">
                  {/* Content */}
                  <div className="mt-4 mb-4">
                    <p className="text-slate-700 leading-relaxed">{topic.content}</p>
                  </div>

                  {/* Key Points */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500" />
                      Poin Kunci
                    </h4>
                    <ul className="space-y-2">
                      {topic.keyPoints.map((point, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                          <span className="w-5 h-5 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Examples */}
                  {topic.examples && topic.examples.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                        <Play className="w-4 h-4 text-green-500" />
                        Contoh Penerapan
                      </h4>
                      <ul className="space-y-2">
                        {topic.examples.map((example, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-slate-700 bg-green-50 rounded-lg px-3 py-2">
                            <span className="text-green-600 font-bold">→</span>
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* References */}
                  {topic.references && topic.references.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-500" />
                        Referensi
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {topic.references.map((ref, i) => (
                          <span key={i} className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
                            {ref}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Prerequisites */}
          {module.prerequisites && module.prerequisites.length > 0 && (
            <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
              <h3 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Prasyarat
              </h3>
              <ul className="space-y-2">
                {module.prerequisites.map((prereq, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-amber-800">
                    <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    {prereq}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Certification */}
          {module.certification && (
            <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200">
              <h3 className="font-bold text-emerald-900 mb-3 flex items-center gap-2">
                <Award className="w-5 h-5" />
                Sertifikasi Terkait
              </h3>
              <p className="text-sm text-emerald-800 mb-3">{module.certification}</p>
              <Link
                href="/simulasi"
                className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
              >
                <Play className="w-4 h-4" />
                Simulasi Ujian
              </Link>
            </div>
          )}

          {/* Ask AI */}
          <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
            <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
              <Star className="w-5 h-5" />
              Tanya AI
            </h3>
            <p className="text-sm text-blue-800 mb-3">
              Punya pertanyaan tentang materi ini? Tanya langsung ke AI KonstruksiAI.
            </p>
            <Link
              href={`/chat?topic=${encodeURIComponent(module.title)}`}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
              Buka Chat AI
            </Link>
          </div>

          {/* Topic Summary */}
          <div className="bg-white rounded-xl p-5 border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-3">Ringkasan Topik</h3>
            <div className="space-y-2">
              {module.topics.map((topic, i) => (
                <button
                  key={topic.id}
                  onClick={() => setExpandedTopic(expandedTopic === topic.id ? null : topic.id)}
                  className="w-full flex items-center gap-3 text-left text-sm text-slate-700 hover:text-blue-600 transition-colors"
                >
                  <span className="w-6 h-6 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="line-clamp-1">{topic.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
