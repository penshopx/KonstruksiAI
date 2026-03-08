'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  PROBLEMS, 
  getDifficultyColor, 
  getDifficultyLabel,
  getCategoryLabel,
  getTotalPoints,
  type Problem
} from '@/lib/solve';
import { 
  Code2, 
  Trophy, 
  Clock, 
  Target, 
  Search,
  Filter,
  ChevronRight,
  CheckCircle,
  Circle,
  TrendingUp,
  Award,
  Zap,
  BookOpen,
  BarChart3,
  Users
} from 'lucide-react';

export default function SolvePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const categories = ['all', 'struktur', 'mekanika', 'geoteknik', 'hidroteknik', 'transportasi', 'energi', 'migas', 'manajemen'] as const;
  const difficulties = ['all', 'easy', 'medium', 'hard', 'expert'] as const;

  const filteredProblems = PROBLEMS.filter(problem => {
    const matchesSearch =
      problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      problem.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      problem.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || problem.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || problem.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const stats = {
    totalProblems: PROBLEMS.length,
    totalPoints: getTotalPoints(),
    avgAcceptance: Math.round(PROBLEMS.reduce((sum, p) => sum + p.acceptanceRate, 0) / PROBLEMS.length),
    totalSolved: PROBLEMS.reduce((sum, p) => sum + p.solvedCount, 0)
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 lg:py-24">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20" />
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-2 mb-6">
              <Code2 className="w-4 h-4 text-blue-400" />
              <span className="text-blue-300 text-sm font-medium">Problem Solving Platform</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Tantang Kemampuan
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                Teknik Anda
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-10">
              Database soal teknik dari fundamental hingga expert. Latih kemampuan problem solving 
              dengan soal-soal praktis dari industri.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                { icon: Target, value: stats.totalProblems, label: 'Problems' },
                { icon: Trophy, value: stats.totalPoints, label: 'Total Points' },
                { icon: TrendingUp, value: `${stats.avgAcceptance}%`, label: 'Avg Success' },
                { icon: CheckCircle, value: stats.totalSolved.toLocaleString(), label: 'Solved' }
              ].map((stat, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <stat.icon className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-slate-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari problem..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Semua Kategori</option>
                {categories.filter(c => c !== 'all').map(cat => (
                  <option key={cat} value={cat}>{getCategoryLabel(cat as Problem['category'])}</option>
                ))}
              </select>

              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Semua Level</option>
                {difficulties.filter(d => d !== 'all').map(diff => (
                  <option key={diff} value={diff}>{getDifficultyLabel(diff as Problem['difficulty'])}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Problems Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">
            Problem Database
            <span className="ml-2 text-slate-500 font-normal">({filteredProblems.length})</span>
          </h2>
          <div className="flex items-center gap-2 text-slate-400">
            <Filter className="w-4 h-4" />
            <span className="text-sm">Filter aktif</span>
          </div>
        </div>

        {filteredProblems.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-slate-500" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Tidak ada hasil</h3>
            <p className="text-slate-400">Coba ubah kata kunci atau filter Anda</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredProblems.map((problem) => (
              <ProblemCard key={problem.id} problem={problem} />
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-y border-white/10 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Naikkan Ranking Anda
          </h2>
          <p className="text-lg text-slate-300 mb-8">
            Selesaikan problem untuk mendapatkan poin dan naikkan posisi di leaderboard. 
            Tunjukkan keahlian teknik Anda!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/solve/leaderboard"
              className="inline-flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-slate-900 px-8 py-4 rounded-xl font-semibold transition-colors"
            >
              <BarChart3 className="w-5 h-5" />
              Lihat Leaderboard
            </Link>
            <Link
              href="/solve/submissions"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-semibold transition-colors"
            >
              <Zap className="w-5 h-5" />
              Riwayat Saya
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProblemCard({ problem }: { problem: Problem }) {
  return (
    <Link href={`/solve/${problem.slug}`}>
      <div className="group bg-slate-800/50 hover:bg-slate-800 rounded-2xl border border-white/10 overflow-hidden hover:border-blue-500/50 transition-all duration-300 h-full flex flex-col">
        <div className="p-6 flex-1">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className={`${getDifficultyColor(problem.difficulty)} px-3 py-1 rounded-full text-xs font-semibold`}>
                {getDifficultyLabel(problem.difficulty)}
              </span>
              <span className="text-slate-400 text-xs flex items-center gap-1">
                <Award className="w-3 h-3" />
                {problem.points} pts
              </span>
            </div>
            <Circle className="w-5 h-5 text-slate-600 group-hover:text-blue-400 transition-colors" />
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
            {problem.title}
          </h3>

          {/* Description */}
          <p className="text-slate-400 text-sm line-clamp-2 mb-4">
            {problem.description.slice(0, 150)}...
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {problem.tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="text-xs text-slate-500 bg-slate-700/50 px-2 py-1 rounded">
                #{tag}
              </span>
            ))}
          </div>

          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {problem.estimatedTime}
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              {problem.acceptanceRate}%
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {problem.solvedCount}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/5 bg-slate-900/50">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">
              {getCategoryLabel(problem.category)}
            </span>
            <span className="text-blue-400 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
              Kerjakan
              <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
