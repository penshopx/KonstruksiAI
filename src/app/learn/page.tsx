'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  LEARNING_PATHS, 
  getCategoryColor, 
  getLevelBadge,
  getCategoryLabel,
  getTotalLessons,
  type LearningPath
} from '@/lib/learn';
import { 
  BookOpen, 
  Clock, 
  Users, 
  Star, 
  Search,
  Filter,
  ChevronRight,
  PlayCircle,
  Award,
  BarChart3
} from 'lucide-react';

export default function LearnPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  const categories = ['all', 'konstruksi', 'energi', 'migas', 'tender', 'manajemen', 'perijinan'] as const;
  const levels = ['all', 'beginner', 'intermediate', 'advanced', 'expert'] as const;

  const filteredPaths = LEARNING_PATHS.filter(path => {
    const matchesSearch =
      path.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      path.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || path.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || path.level === selectedLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const stats = {
    totalPaths: LEARNING_PATHS.length,
    totalModules: LEARNING_PATHS.reduce((sum, p) => sum + p.modules.length, 0),
    totalStudents: LEARNING_PATHS.reduce((sum, p) => sum + p.enrolledCount, 0),
    avgRating: (LEARNING_PATHS.reduce((sum, p) => sum + p.rating, 0) / LEARNING_PATHS.length).toFixed(1)
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 py-16 lg:py-24">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <BookOpen className="w-4 h-4 text-yellow-300" />
            <span className="text-white/90 text-sm font-medium">Platform Learning #1 untuk Engineer Indonesia</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Belajar Teknik
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
              Jadi Lebih Mudah
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto mb-10">
            Jalur pembelajaran terstruktur dari fundamental hingga expert. Sertifikasi resmi 
            untuk membangun karir engineering Anda.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-4xl mx-auto">
            {[
              { icon: BookOpen, value: stats.totalPaths, label: 'Learning Paths' },
              { icon: PlayCircle, value: stats.totalModules, label: 'Modul' },
              { icon: Users, value: `${(stats.totalStudents / 1000).toFixed(1)}K+`, label: 'Peserta' },
              { icon: Star, value: stats.avgRating, label: 'Rating' }
            ].map((stat, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <stat.icon className="w-6 h-6 text-yellow-300 mx-auto mb-2" />
                <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-blue-200 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari learning path..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat === 'all' ? 'Semua' : getCategoryLabel(cat as LearningPath['category'])}
                </button>
              ))}
            </div>

            {/* Level Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {levels.map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    selectedLevel === lvl
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {lvl === 'all' ? 'Semua Level' : getLevelBadge(lvl as LearningPath['level']).text}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Learning Paths Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-900">
            Learning Paths
            <span className="ml-2 text-slate-500 font-normal">({filteredPaths.length})</span>
          </h2>
          <div className="flex items-center gap-2 text-slate-500">
            <Filter className="w-4 h-4" />
            <span className="text-sm">Filter aktif</span>
          </div>
        </div>

        {filteredPaths.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">Tidak ada hasil</h3>
            <p className="text-slate-500">Coba ubah kata kunci atau filter Anda</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPaths.map((path) => (
              <LearningPathCard key={path.id} path={path} />
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Award className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Dapatkan Sertifikat Resmi
          </h2>
          <p className="text-lg text-slate-300 mb-8">
            Setiap learning path memberikan sertifikat digital yang dapat diverifikasi. 
            Tingkatkan kredibilitas profesional Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/learn/certificates"
              className="inline-flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-slate-900 px-8 py-4 rounded-xl font-semibold transition-colors"
            >
              <Award className="w-5 h-5" />
              Lihat Sertifikat
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-semibold transition-colors"
            >
              <Users className="w-5 h-5" />
              Daftar Gratis
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function LearningPathCard({ path }: { path: LearningPath }) {
  const levelBadge = getLevelBadge(path.level);
  const totalLessons = getTotalLessons(path);

  return (
    <Link href={`/learn/${path.slug}`}>
      <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-blue-300 transition-all duration-300 h-full flex flex-col">
        {/* Header with Gradient */}
        <div className={`h-32 bg-gradient-to-br ${getCategoryColor(path.category)} relative p-6`}>
          <div className="absolute top-4 right-4">
            <span className={`${levelBadge.color} px-3 py-1 rounded-full text-xs font-semibold`}>
              {levelBadge.text}
            </span>
          </div>
          <div className="text-4xl">{path.thumbnail}</div>
          <h3 className="text-white font-bold text-lg mt-2 line-clamp-2">{path.title}</h3>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          <p className="text-slate-600 text-sm line-clamp-2 mb-4">{path.description}</p>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-3 mb-4 text-sm text-slate-500">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{path.estimatedHours} jam</span>
            </div>
            <div className="flex items-center gap-1">
              <PlayCircle className="w-4 h-4" />
              <span>{totalLessons} pelajaran</span>
            </div>
            <div className="flex items-center gap-1">
              <BarChart3 className="w-4 h-4" />
              <span>{path.modules.length} modul</span>
            </div>
          </div>

          {/* Outcomes */}
          <div className="mb-4">
            <p className="text-xs font-medium text-slate-400 mb-2">Yang akan dipelajari:</p>
            <ul className="space-y-1">
              {path.outcomes.slice(0, 2).map((outcome, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <ChevronRight className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="line-clamp-1">{outcome}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Footer */}
          <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-600">{path.enrolledCount.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm text-slate-600">{path.rating}</span>
              </div>
            </div>
            {path.certificationAwarded && (
              <div className="flex items-center gap-1 text-blue-600">
                <Award className="w-4 h-4" />
                <span className="text-xs font-medium">Sertifikat</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
