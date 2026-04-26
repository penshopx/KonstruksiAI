"use client";

import { useParams } from "@/shims/next-navigation";
import Link from "@/shims/next-link";
import { 
  ARTICLES, 
  KNOWLEDGE_CATEGORIES,
  getArticleBySlug,
  getRelatedArticles,
  type Article 
} from "@/lib/knowledge";
import NavbarAuth from "@/components/NavbarAuth";

const DIFFICULTY_COLORS = {
  "Pemula": "bg-green-500/20 text-green-400 border-green-500/40",
  "Menengah": "bg-yellow-500/20 text-yellow-400 border-yellow-500/40",
  "Ahli": "bg-red-500/20 text-red-400 border-red-500/40",
};

function renderMarkdown(content: string): string {
  let html = content
    // Headers
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-slate-100 mt-8 mb-4">$1</h1>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-slate-100 mt-6 mb-3">$1</h2>')
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-slate-100 mt-5 mb-2">$1</h3>')
    // Bold and Italic
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-200">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Code blocks
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-slate-900 border border-slate-700 rounded-lg p-4 overflow-x-auto my-4"><code class="text-sm text-slate-300">$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code class="bg-slate-800 text-orange-400 px-1.5 py-0.5 rounded text-sm">$1</code>')
    // Lists
    .replace(/^\* (.*$)/gim, '<li class="ml-4 mb-1">• $1</li>')
    .replace(/^- (.*$)/gim, '<li class="ml-4 mb-1">• $1</li>')
    .replace(/^[0-9]+\. (.*$)/gim, '<li class="ml-4 mb-1"><span class="text-orange-400 font-medium">$&</span></li>')
    // Blockquotes
    .replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-orange-500 pl-4 my-4 italic text-slate-400">$1</blockquote>')
    // Tables (basic support)
    .replace(/\|(.+)\|/g, (match) => {
      const cells = match.split('|').filter(c => c.trim());
      if (cells.length === 0) return match;
      return '<td class="border border-slate-700 px-3 py-2">' + cells.join('</td><td class="border border-slate-700 px-3 py-2">') + '</td>';
    })
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-orange-400 hover:underline">$1</a>')
    // Paragraphs (must be last)
    .replace(/\n\n/g, '</p><p class="mb-4 text-slate-300 leading-relaxed">')
    .replace(/^(.+)$/gim, '<p class="mb-4 text-slate-300 leading-relaxed">$1</p>');

  // Clean up empty paragraphs and fix table rows
  html = html
    .replace(/<p class="mb-4 text-slate-300 leading-relaxed"><\/p>/g, '')
    .replace(/<p class="mb-4 text-slate-300 leading-relaxed">(<td[^>]*>.*?<\/td>)+<\/p>/g, (match) => {
      return '<tr class="bg-slate-800/50">' + match.replace(/<p class="mb-4 text-slate-300 leading-relaxed">|<\/p>/g, '') + '</tr>';
    })
    .replace(/(<tr[^>]*>.*?<\/tr>)+/g, '<table class="w-full border-collapse my-4 text-sm">$&</table>');

  return html;
}

function ArticleCard({ article }: { article: Article }) {
  const category = KNOWLEDGE_CATEGORIES.find(c => c.id === article.category);
  
  return (
    <Link
      href={`/knowledge/article/${article.slug}`}
      className="group block bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 hover:bg-slate-800/50 hover:border-slate-600 transition-all"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-base">{category?.icon}</span>
        <span className="text-xs text-slate-500">{category?.name}</span>
      </div>
      <h4 className="font-medium text-slate-200 text-sm group-hover:text-orange-400 transition-colors line-clamp-2">
        {article.title}
      </h4>
      <span className="text-xs text-slate-500 mt-2 block">⏱️ {article.readTime} menit</span>
    </Link>
  );
}

function DownloadCard({ download }: { download: { name: string; url: string; size: string; type: string } }) {
  const typeColors: Record<string, string> = {
    "PDF": "bg-red-500/20 text-red-400 border-red-500/30",
    "DOCX": "bg-blue-500/20 text-blue-400 border-blue-500/30",
    "XLSX": "bg-green-500/20 text-green-400 border-green-500/30",
    "ZIP": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  };

  return (
    <div className="flex items-center justify-between bg-slate-800/50 border border-slate-700 rounded-lg p-4">
      <div className="flex items-center gap-3">
        <span className={`px-2 py-1 rounded text-xs font-medium border ${typeColors[download.type] || "bg-slate-700 text-slate-300"}`}>
          {download.type}
        </span>
        <div>
          <p className="text-slate-200 text-sm font-medium">{download.name}</p>
          <p className="text-slate-500 text-xs">{download.size}</p>
        </div>
      </div>
      <button className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
        <span>⬇️</span>
        Download
      </button>
    </div>
  );
}

export default function ArticlePage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const article = getArticleBySlug(slug);
  
  if (!article) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl mb-4 block">📄</span>
          <h1 className="text-2xl font-bold text-slate-300 mb-2">Artikel tidak ditemukan</h1>
          <p className="text-slate-500 mb-4">Maaf, artikel yang Anda cari tidak tersedia.</p>
          <Link 
            href="/knowledge" 
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Kembali ke Knowledge Base
          </Link>
        </div>
      </div>
    );
  }

  const category = KNOWLEDGE_CATEGORIES.find(c => c.id === article.category);
  const relatedArticles = getRelatedArticles(article.id);
  const contentHtml = renderMarkdown(article.content);

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
                <Link href="/knowledge" className="text-orange-400 px-3 py-2 text-sm font-medium">Knowledge Base</Link>
                <Link href="/konstruksi" className="text-slate-400 hover:text-white px-3 py-2 text-sm transition-colors">Konstruksi</Link>
                <Link href="/energi" className="text-slate-400 hover:text-white px-3 py-2 text-sm transition-colors">Energi</Link>
                <Link href="/migas" className="text-slate-400 hover:text-white px-3 py-2 text-sm transition-colors">Migas</Link>
                <Link href="/solver" className="text-slate-400 hover:text-white px-3 py-2 text-sm transition-colors">Solver</Link>
                <Link href="/tools" className="text-slate-400 hover:text-white px-3 py-2 text-sm transition-colors">Tools</Link>
              </div>
            </div>
            <NavbarAuth />
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-slate-400 hover:text-white transition-colors">Beranda</Link>
            <span className="text-slate-600">/</span>
            <Link href="/knowledge" className="text-slate-400 hover:text-white transition-colors">Knowledge Base</Link>
            <span className="text-slate-600">/</span>
            <Link href={`/knowledge?category=${article.category}`} className="text-slate-400 hover:text-white transition-colors">
              {category?.name}
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-slate-300 truncate max-w-[200px]">{article.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Article Header */}
            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className={`text-xs px-3 py-1 rounded-full border ${DIFFICULTY_COLORS[article.difficulty]}`}>
                  {article.difficulty}
                </span>
                <span className="text-slate-400 text-sm flex items-center gap-1">
                  <span className="text-base">{category?.icon}</span>
                  {category?.name}
                </span>
                <span className="text-slate-500 text-sm">•</span>
                <span className="text-slate-400 text-sm">⏱️ {article.readTime} menit baca</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                {article.title}
              </h1>
              
              <p className="text-xl text-slate-400 leading-relaxed">
                {article.excerpt}
              </p>
              
              <div className="flex flex-wrap items-center gap-4 mt-6 pt-6 border-t border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center text-orange-400 font-bold">
                    {article.author.split(" ").map(n => n[0]).join("").toUpperCase()}
                  </div>
                  <div>
                    <p className="text-slate-200 text-sm font-medium">{article.author}</p>
                    <p className="text-slate-500 text-xs">
                      Dipublikasikan: {new Date(article.publishedAt).toLocaleDateString("id-ID", { 
                        day: "numeric", 
                        month: "long", 
                        year: "numeric" 
                      })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-auto">
                  <button className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2">
                    <span>🔖</span>
                    Simpan
                  </button>
                  <button className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2">
                    <span>🔗</span>
                    Bagikan
                  </button>
                </div>
              </div>
            </div>

            {/* Article Content */}
            <article className="prose prose-invert prose-slate max-w-none">
              <div 
                dangerouslySetInnerHTML={{ __html: contentHtml }}
                className="article-content"
              />
            </article>

            {/* Tags */}
            <div className="mt-8 pt-8 border-t border-slate-800">
              <h3 className="text-sm font-semibold text-slate-400 mb-3">Tag:</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map(tag => (
                  <Link
                    key={tag}
                    href={`/knowledge?search=${encodeURIComponent(tag)}`}
                    className="text-sm text-slate-400 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Feedback Section */}
            <div className="mt-8 bg-slate-800/30 border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-slate-100 mb-2">Apakah artikel ini membantu?</h3>
              <p className="text-slate-400 text-sm mb-4">Beri tahu kami jika ada yang perlu diperbaiki</p>
              <div className="flex items-center gap-3">
                <button className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                  <span>👍</span> Ya, membantu
                </button>
                <button className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                  <span>👎</span> Perlu perbaikan
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Downloads */}
              {article.downloads && article.downloads.length > 0 && (
                <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-5">
                  <h3 className="font-semibold text-slate-100 mb-4 flex items-center gap-2">
                    <span>📥</span>
                    Dokumen Terkait
                  </h3>
                  <div className="space-y-3">
                    {article.downloads.map((download, idx) => (
                      <DownloadCard key={idx} download={download} />
                    ))}
                  </div>
                </div>
              )}

              {/* Related Articles */}
              {relatedArticles.length > 0 && (
                <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-5">
                  <h3 className="font-semibold text-slate-100 mb-4 flex items-center gap-2">
                    <span>📚</span>
                    Artikel Terkait
                  </h3>
                  <div className="space-y-3">
                    {relatedArticles.map(related => (
                      <ArticleCard key={related.id} article={related} />
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/30 rounded-xl p-5">
                <h3 className="font-semibold text-slate-100 mb-2">Butuh bantuan lebih lanjut?</h3>
                <p className="text-slate-400 text-sm mb-4">
                  Tanyakan langsung ke AI Assistant kami untuk jawaban spesifik sesuai kebutuhan Anda.
                </p>
                <Link 
                  href="/chat"
                  className="block w-full bg-orange-500 hover:bg-orange-600 text-white text-center px-4 py-3 rounded-lg transition-colors font-medium"
                >
                  💬 Chat dengan AI
                </Link>
              </div>

              {/* Categories Navigation */}
              <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-5">
                <h3 className="font-semibold text-slate-100 mb-4">Jelajahi Kategori</h3>
                <div className="space-y-2">
                  {KNOWLEDGE_CATEGORIES.map(cat => (
                    <Link
                      key={cat.id}
                      href={`/knowledge?category=${cat.id}`}
                      className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                        cat.id === article.category 
                          ? "bg-orange-500/20 text-orange-400" 
                          : "hover:bg-slate-700 text-slate-400"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{cat.icon}</span>
                        <span className="text-sm">{cat.name}</span>
                      </div>
                      <span className="text-xs opacity-60">
                        {ARTICLES.filter(a => a.category === cat.id).length}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 mt-16">
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
