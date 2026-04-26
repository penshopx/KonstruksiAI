"use client";

import { useState, useMemo } from "react";
import Link from "@/shims/next-link";
import { 
  KNOWLEDGE_CATEGORIES, 
  ARTICLES, 
  VIDEO_TUTORIALS, 
  DOCUMENT_TEMPLATES,
  searchArticles,
  type Article,
  type VideoTutorial,
  type DocumentTemplate 
} from "@/lib/knowledge";
import NavbarAuth from "@/components/NavbarAuth";

const TABS = [
  { id: "articles", label: "📚 Artikel", icon: "📚" },
  { id: "videos", label: "🎥 Video", icon: "🎥" },
  { id: "templates", label: "📋 Template", icon: "📋" },
];

const DIFFICULTY_COLORS = {
  "Pemula": "bg-green-500/20 text-green-400 border-green-500/40",
  "Menengah": "bg-yellow-500/20 text-yellow-400 border-yellow-500/40",
  "Ahli": "bg-red-500/20 text-red-400 border-red-500/40",
};

function ArticleCard({ article }: { article: Article }) {
  const category = KNOWLEDGE_CATEGORIES.find(c => c.id === article.category);
  
  return (
    <Link
      href={`/knowledge/article/${article.slug}`}
      className="group block bg-slate-800/50 border border-slate-700 rounded-xl p-5 hover:bg-slate-800 hover:border-slate-600 transition-all"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className={`text-xs px-2 py-1 rounded-full border ${DIFFICULTY_COLORS[article.difficulty]}`}>
          {article.difficulty}
        </span>
        <span className="text-slate-400 text-sm flex items-center gap-1">
          ⏱️ {article.readTime} menit
        </span>
      </div>
      
      <h3 className="text-lg font-semibold text-slate-100 mb-2 group-hover:text-orange-400 transition-colors line-clamp-2">
        {article.title}
      </h3>
      
      <p className="text-slate-400 text-sm mb-4 line-clamp-2">
        {article.excerpt}
      </p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{category?.icon}</span>
          <span className="text-slate-500 text-xs">{category?.name}</span>
        </div>
        <span className="text-orange-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
          Baca selengkapnya →
        </span>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-700/50">
        {article.tags.slice(0, 3).map(tag => (
          <span key={tag} className="text-xs text-slate-500 bg-slate-700/50 px-2 py-1 rounded">
            #{tag}
          </span>
        ))}
      </div>
    </Link>
  );
}

function VideoCard({ video }: { video: VideoTutorial }) {
  const category = KNOWLEDGE_CATEGORIES.find(c => c.id === video.category);
  
  return (
    <div className="group bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden hover:bg-slate-800 hover:border-slate-600 transition-all">
      <div className="relative aspect-video bg-slate-700">
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800/50 group-hover:bg-slate-800/30 transition-colors">
          <div className="w-16 h-16 bg-orange-500/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <span className="text-2xl">▶️</span>
          </div>
        </div>
        <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-xs text-white">
          {video.duration}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-slate-100 mb-2 line-clamp-2 group-hover:text-orange-400 transition-colors">
          {video.title}
        </h3>
        <p className="text-slate-400 text-sm mb-3 line-clamp-2">
          {video.description}
        </p>
        
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="text-base">{category?.icon}</span>
            <span>{category?.name}</span>
          </div>
          <span>👁️ {video.views.toLocaleString()}x ditonton</span>
        </div>
      </div>
    </div>
  );
}

function TemplateCard({ template }: { template: DocumentTemplate }) {
  const category = KNOWLEDGE_CATEGORIES.find(c => c.id === template.category);
  const formatColors: Record<string, string> = {
    "PDF": "bg-red-500/20 text-red-400",
    "DOCX": "bg-blue-500/20 text-blue-400",
    "XLSX": "bg-green-500/20 text-green-400",
    "ZIP": "bg-purple-500/20 text-purple-400",
  };
  
  return (
    <div className="group bg-slate-800/50 border border-slate-700 rounded-xl p-5 hover:bg-slate-800 hover:border-slate-600 transition-all">
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className={`text-xs px-2 py-1 rounded font-medium ${formatColors[template.format]}`}>
          {template.format}
        </span>
        <span className="text-slate-400 text-sm">{template.size}</span>
      </div>
      
      <h3 className="font-semibold text-slate-100 mb-2 group-hover:text-orange-400 transition-colors">
        {template.name}
      </h3>
      
      <p className="text-slate-400 text-sm mb-4">
        {template.description}
      </p>
      
      <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="text-base">{category?.icon}</span>
          <span>{category?.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500">
            ⬇️ {template.downloads.toLocaleString()}
          </span>
          <button className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-4 py-1.5 rounded-lg transition-colors">
            Download
          </button>
        </div>
      </div>
    </div>
  );
}

export default function KnowledgePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("articles");

  const filteredArticles = useMemo(() => {
    let articles = ARTICLES;
    
    if (searchQuery) {
      articles = searchArticles(searchQuery);
    }
    
    if (selectedCategory) {
      articles = articles.filter(a => a.category === selectedCategory);
    }
    
    return articles;
  }, [searchQuery, selectedCategory]);

  const filteredVideos = useMemo(() => {
    let videos = VIDEO_TUTORIALS;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      videos = videos.filter(v => 
        v.title.toLowerCase().includes(query) ||
        v.description.toLowerCase().includes(query)
      );
    }
    
    if (selectedCategory) {
      videos = videos.filter(v => v.category === selectedCategory);
    }
    
    return videos;
  }, [searchQuery, selectedCategory]);

  const filteredTemplates = useMemo(() => {
    let templates = DOCUMENT_TEMPLATES;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      templates = templates.filter(t => 
        t.name.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query)
      );
    }
    
    if (selectedCategory) {
      templates = templates.filter(t => t.category === selectedCategory);
    }
    
    return templates;
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Navbar */}
      <nav className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2">
                <span className="text-2xl">🏗️</span>
                <span className="font-bold text-slate-100">KonstruksiAI</span>
              </Link>
              <div className="hidden md:flex items-center gap-1">
                <Link href="/konstruksi" className="text-slate-400 hover:text-white px-3 py-2 text-sm transition-colors">Konstruksi</Link>
                <Link href="/energi" className="text-slate-400 hover:text-white px-3 py-2 text-sm transition-colors">Energi</Link>
                <Link href="/migas" className="text-slate-400 hover:text-white px-3 py-2 text-sm transition-colors">Migas</Link>
                <Link href="/tender" className="text-slate-400 hover:text-white px-3 py-2 text-sm transition-colors">Tender</Link>
                <Link href="/manajemen" className="text-slate-400 hover:text-white px-3 py-2 text-sm transition-colors">Manajemen</Link>
                <Link href="/perijinan" className="text-slate-400 hover:text-white px-3 py-2 text-sm transition-colors">Perijinan</Link>
                <Link href="/solver" className="text-slate-400 hover:text-white px-3 py-2 text-sm transition-colors">Solver</Link>
                <Link href="/tools" className="text-slate-400 hover:text-white px-3 py-2 text-sm transition-colors">Tools</Link>
                <Link href="/matrix" className="text-slate-400 hover:text-white px-3 py-2 text-sm transition-colors">Matriks</Link>
                <Link href="/pricing" className="text-slate-400 hover:text-white px-3 py-2 text-sm transition-colors">Harga</Link>
              </div>
            </div>
            <NavbarAuth />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              📚 Knowledge Base
            </h1>
            <p className="text-xl text-slate-400 mb-8">
              Pusat pengetahuan lengkap bidang keteknikan Indonesia. Artikel, video tutorial, dan template dokumen untuk profesional konstruksi, energi, dan migas.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Cari artikel, video, atau template..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl">
                🔍
              </span>
            </div>
            
            {/* Stats */}
            <div className="flex items-center justify-center gap-8 mt-8 text-sm">
              <div className="flex items-center gap-2 text-slate-400">
                <span className="text-orange-400 font-bold">{ARTICLES.length}+</span>
                <span>Artikel</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <span className="text-orange-400 font-bold">{VIDEO_TUTORIALS.length}+</span>
                <span>Video</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <span className="text-orange-400 font-bold">{DOCUMENT_TEMPLATES.length}+</span>
                <span>Template</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <span className="text-orange-400 font-bold">{KNOWLEDGE_CATEGORIES.length}</span>
                <span>Kategori</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="border-b border-slate-800 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === null
                  ? "bg-orange-500 text-white"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              Semua
            </button>
            {KNOWLEDGE_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  selectedCategory === cat.id
                    ? "bg-orange-500 text-white"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                }`}
              >
                <span>{cat.icon}</span>
                <span className="hidden sm:inline">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex items-center gap-1 mb-8 border-b border-slate-800">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-sm font-medium transition-colors relative ${
                activeTab === tab.id
                  ? "text-orange-400"
                  : "text-slate-400 hover:text-slate-300"
              }`}
            >
              <span className="flex items-center gap-2">
                <span>{tab.icon}</span>
                {tab.label}
              </span>
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === "articles" && (
          <div>
            {filteredArticles.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map(article => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <span className="text-6xl mb-4 block">🔍</span>
                <h3 className="text-xl font-semibold text-slate-300 mb-2">
                  Tidak ada artikel ditemukan
                </h3>
                <p className="text-slate-500">
                  Coba kata kunci pencarian yang berbeda
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "videos" && (
          <div>
            {filteredVideos.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVideos.map(video => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <span className="text-6xl mb-4 block">🎬</span>
                <h3 className="text-xl font-semibold text-slate-300 mb-2">
                  Tidak ada video ditemukan
                </h3>
                <p className="text-slate-500">
                  Coba kata kunci pencarian yang berbeda
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "templates" && (
          <div>
            {filteredTemplates.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map(template => (
                  <TemplateCard key={template.id} template={template} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <span className="text-6xl mb-4 block">📄</span>
                <h3 className="text-xl font-semibold text-slate-300 mb-2">
                  Tidak ada template ditemukan
                </h3>
                <p className="text-slate-500">
                  Coba kata kunci pencarian yang berbeda
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Featured Categories */}
      {!searchQuery && !selectedCategory && (
        <div className="bg-slate-900/30 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">
              Jelajahi Berdasarkan Kategori
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {KNOWLEDGE_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="group text-left bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:bg-slate-800 hover:border-slate-600 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-4xl">{cat.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-100 mb-1 group-hover:text-orange-400 transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-slate-400 text-sm mb-3">
                        {cat.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>{cat.subcategories.length} subkategori</span>
                        <span>
                          {ARTICLES.filter(a => a.category === cat.id).length} artikel
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">🏗️</span>
              <span className="font-semibold text-slate-300">KonstruksiAI</span>
            </div>
            <p className="text-slate-500 text-sm">
              © 2024 KonstruksiAI. Knowledge Base untuk profesional keteknikan Indonesia.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/knowledge" className="text-slate-400 hover:text-white text-sm">
                Knowledge Base
              </Link>
              <Link href="/chat" className="text-slate-400 hover:text-white text-sm">
                Chat AI
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
