import Link from "next/link";
import NavbarAuth from "@/components/NavbarAuth";

const engineeringFields = [
  {
    category: "Teknik Konstruksi",
    icon: "🏗️",
    color: "border-orange-500/40 hover:border-orange-500",
    iconBg: "bg-orange-500/20",
    badgeColor: "text-orange-400 bg-orange-400/10",
    href: "/konstruksi",
    subFields: [
      { icon: "🏛️", name: "Arsitektur" },
      { icon: "🌉", name: "Teknik Sipil" },
      { icon: "⚙️", name: "Mekanikal" },
      { icon: "⚡", name: "Elektrikal" },
      { icon: "🌿", name: "Tata Lingkungan" },
      { icon: "🔧", name: "Rekayasa Teknik" },
      { icon: "🌳", name: "Lanskap" },
      { icon: "🛋️", name: "Desain Interior" },
      { icon: "💡", name: "Iluminasi" },
      { icon: "🗺️", name: "Perencanaan Wilayah & Kota" },
    ],
  },
  {
    category: "Ketenagalistrikan & Energi Baru Terbarukan",
    icon: "⚡",
    color: "border-yellow-500/40 hover:border-yellow-500",
    iconBg: "bg-yellow-500/20",
    badgeColor: "text-yellow-400 bg-yellow-400/10",
    href: "/energi",
    subFields: [
      { icon: "☀️", name: "Energi Surya (Solar)" },
      { icon: "💨", name: "Energi Angin" },
      { icon: "💧", name: "Energi Air (Hidro)" },
      { icon: "🔋", name: "Penyimpanan Energi" },
      { icon: "🏭", name: "Pembangkit Listrik" },
      { icon: "🔌", name: "Transmisi & Distribusi" },
    ],
  },
  {
    category: "Migas & Pertambangan",
    icon: "⛏️",
    color: "border-blue-500/40 hover:border-blue-500",
    iconBg: "bg-blue-500/20",
    badgeColor: "text-blue-400 bg-blue-400/10",
    href: "/migas",
    subFields: [
      { icon: "🛢️", name: "Minyak & Gas Bumi" },
      { icon: "⛏️", name: "Pertambangan Mineral" },
      { icon: "🏗️", name: "Konstruksi Migas" },
      { icon: "🔬", name: "Geologi & Eksplorasi" },
      { icon: "🚰", name: "Pipeline & Fasilitas" },
      { icon: "📋", name: "K3 Migas & Tambang" },
    ],
  },
];

const mainFeatures = [
  {
    icon: "📋",
    title: "Tender & Pengadaan",
    description: "Analisis dokumen tender, estimasi biaya, penyusunan penawaran, dan strategi pemenangan tender.",
    href: "/tender",
    badge: "Tender",
  },
  {
    icon: "🏢",
    title: "Manajemen Bisnis",
    description: "Panduan manajemen proyek, cashflow, kontrak, subkontraktor, dan operasional perusahaan.",
    href: "/manajemen",
    badge: "Manajemen",
  },
  {
    icon: "📜",
    title: "Perijinan & Sertifikasi",
    description: "Informasi SBU, SKK, IUJK, IMB/PBG, sertifikasi profesi, dan regulasi terkini.",
    href: "/perijinan",
    badge: "Perijinan",
  },
];

const quickQuestions = [
  "Apa syarat mendapatkan SBU Konstruksi?",
  "Bagaimana cara menghitung RAB proyek gedung?",
  "Apa itu SKK dan bagaimana cara mendapatkannya?",
  "Jelaskan proses tender pemerintah (LPSE)",
  "Apa persyaratan izin usaha pertambangan mineral?",
  "Bagaimana prosedur sertifikasi energi surya di Indonesia?",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header / Navbar */}
      <header className="border-b border-slate-700 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                K
              </div>
              <div>
                <span className="text-white font-bold text-lg">KonstruksiAI</span>
                <span className="text-slate-400 text-xs block leading-none">Asisten Cerdas Keteknikan Indonesia</span>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-4">
              <Link href="/konstruksi" className="text-slate-300 hover:text-white text-sm transition-colors">Konstruksi</Link>
              <Link href="/energi" className="text-slate-300 hover:text-white text-sm transition-colors">Energi</Link>
              <Link href="/migas" className="text-slate-300 hover:text-white text-sm transition-colors">Migas</Link>
              <Link href="/tender" className="text-slate-300 hover:text-white text-sm transition-colors">Tender</Link>
              <Link href="/perijinan" className="text-slate-300 hover:text-white text-sm transition-colors">Perijinan</Link>
              <Link href="/matrix" className="text-orange-400 hover:text-orange-300 text-sm transition-colors font-medium">📊 Matriks</Link>
              <Link href="/chat" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Mulai Chat
              </Link>
              <NavbarAuth />
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-full px-4 py-1.5 mb-6">
          <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></span>
          <span className="text-orange-300 text-sm font-medium">AI Khusus Bidang Keteknikan Indonesia</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          Asisten AI untuk
          <span className="text-orange-400 block">Profesional Keteknikan</span>
        </h1>

        <p className="text-slate-300 text-lg sm:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
          Dapatkan jawaban cepat dan akurat seputar <strong className="text-white">teknik konstruksi</strong>,{" "}
          <strong className="text-white">ketenagalistrikan & energi terbarukan</strong>, serta{" "}
          <strong className="text-white">migas & pertambangan</strong> — semua dalam satu platform.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link
            href="/chat"
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-orange-500/25"
          >
            🚀 Mulai Tanya Sekarang
          </Link>
          <Link
            href="#bidang"
            className="border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all"
          >
            Lihat Bidang Keahlian
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
          {[
            { value: "3", label: "Sektor Industri" },
            { value: "126", label: "Topik Konsultasi" },
            { value: "24/7", label: "Siap Membantu" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-orange-400">{stat.value}</div>
              <div className="text-slate-400 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Engineering Fields Section */}
      <section id="bidang" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Bidang Keteknikan</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Cakupan lengkap tiga sektor utama keteknikan Indonesia
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {engineeringFields.map((field) => (
            <Link key={field.category} href={field.href}>
              <div className={`bg-slate-800 border ${field.color} rounded-2xl p-6 h-full transition-all hover:-translate-y-1 cursor-pointer group`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 ${field.iconBg} rounded-xl flex items-center justify-center text-2xl`}>
                    {field.icon}
                  </div>
                  <div>
                    <span className={`text-xs font-medium ${field.badgeColor} px-2 py-0.5 rounded-full`}>
                      {field.subFields.length} Sub-Bidang
                    </span>
                  </div>
                </div>
                <h3 className="text-white font-bold text-lg mb-4">{field.category}</h3>
                <div className="grid grid-cols-2 gap-2">
                  {field.subFields.map((sub) => (
                    <div key={sub.name} className="flex items-center gap-1.5 text-slate-400 text-xs">
                      <span>{sub.icon}</span>
                      <span>{sub.name}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-orange-400 text-sm font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  Eksplorasi bidang ini →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Main Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Layanan Utama</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Tiga pilar layanan untuk mendukung profesional dan perusahaan keteknikan Indonesia
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mainFeatures.map((feature) => (
            <Link key={feature.title} href={feature.href}>
              <div className="bg-slate-800 border border-slate-700 hover:border-orange-500/50 rounded-2xl p-6 h-full transition-all hover:-translate-y-1 cursor-pointer group">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-slate-700 group-hover:bg-orange-500/20 rounded-xl flex items-center justify-center text-2xl transition-colors">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-medium text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded-full">
                      {feature.badge}
                    </span>
                  </div>
                </div>
                <h3 className="text-white font-bold text-xl mb-3">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                <div className="mt-4 text-orange-400 text-sm font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  Pelajari lebih lanjut →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick Questions Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Pertanyaan Populer</h2>
            <p className="text-slate-400">Klik untuk langsung bertanya ke AI</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {quickQuestions.map((q) => (
              <Link
                key={q}
                href={`/chat?q=${encodeURIComponent(q)}`}
                className="bg-slate-700 hover:bg-slate-600 border border-slate-600 hover:border-orange-500/50 rounded-xl px-4 py-3 text-slate-300 hover:text-white text-sm transition-all text-left"
              >
                💬 {q}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Matrix Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700 rounded-2xl p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-full px-3 py-1 mb-4">
                <span className="text-orange-300 text-xs font-medium">📊 Fitur Baru</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Matriks Ruang Lingkup</h2>
              <p className="text-slate-400 mb-4 leading-relaxed">
                Eksplorasi <strong className="text-white">126 titik koneksi</strong> antara bidang keteknikan konstruksi dengan 21 fungsi bisnis & profesional — dari Real Estate, Finance, Legal, HR, Marketing, hingga Medical dan IT.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {["🏠 Real Estate", "💰 Finance", "👨‍⚖️ Legal", "👋 HR", "💻 IT", "📈 Marketing", "🏥 Medical", "+14 lainnya"].map((tag) => (
                  <span key={tag} className="text-xs bg-slate-700 text-slate-300 px-2.5 py-1 rounded-full">{tag}</span>
                ))}
              </div>
              <Link
                href="/matrix"
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 inline-flex items-center gap-2"
              >
                📊 Buka Matriks Interaktif
              </Link>
            </div>
            <div className="hidden md:block flex-shrink-0">
              <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-4 w-64">
                <div className="text-slate-500 text-xs mb-2 font-medium">Preview Matriks</div>
                <div className="grid grid-cols-4 gap-1">
                  {["Konstruksi", "Tender", "Bisnis", "Energi"].map((col) => (
                    <div key={col} className="bg-orange-500/20 text-orange-300 text-xs text-center py-1 rounded font-medium">{col}</div>
                  ))}
                  {["🏠", "💰", "👨‍⚖️", "💼", "🎓", "📈", "🏥", "💻"].map((icon, i) => (
                    <div key={i} className="bg-slate-700/50 text-center py-1.5 rounded text-sm">{icon}</div>
                  ))}
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} className="bg-slate-800 border border-slate-700/50 rounded h-5 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-slate-600 rounded-full"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-orange-600 to-orange-500 rounded-2xl p-10 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Siap Meningkatkan Produktivitas Keteknikan Anda?
          </h2>
          <p className="text-orange-100 text-lg mb-8 max-w-2xl mx-auto">
            Mulai percakapan dengan KonstruksiAI sekarang dan dapatkan jawaban ahli dalam hitungan detik.
          </p>
          <Link
            href="/chat"
            className="bg-white text-orange-600 hover:bg-orange-50 px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 inline-block shadow-lg"
          >
            🏗️ Mulai Gratis Sekarang
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-7 h-7 bg-orange-500 rounded-md flex items-center justify-center text-white font-bold text-sm">K</div>
            <span className="text-white font-semibold">KonstruksiAI</span>
          </div>
          <p className="text-slate-500 text-sm">
            Asisten AI khusus bidang keteknikan Indonesia — Konstruksi · Energi · Migas & Pertambangan
          </p>
        </div>
      </footer>
    </div>
  );
}
