import Link from "@/shims/next-link";

const manajemenTopics = [
  {
    title: "Manajemen Proyek",
    description: "Perencanaan, penjadwalan, dan pengendalian proyek konstruksi secara efektif",
    questions: ["Cara membuat time schedule proyek", "Metode CPM dan PERT", "Pengendalian progress proyek"],
  },
  {
    title: "Cashflow & Keuangan",
    description: "Manajemen arus kas, pembiayaan proyek, dan kesehatan keuangan perusahaan",
    questions: ["Cara membuat proyeksi cashflow", "Strategi negosiasi termin pembayaran", "Pembiayaan proyek konstruksi"],
  },
  {
    title: "RAB & Estimasi Biaya",
    description: "Penyusunan rencana anggaran biaya yang akurat dan kompetitif",
    questions: ["Cara menghitung RAB gedung", "Analisa harga satuan pekerjaan", "Software estimasi biaya konstruksi"],
  },
  {
    title: "Manajemen Subkontraktor",
    description: "Seleksi, kontrak, dan pengelolaan subkontraktor yang efektif",
    questions: ["Cara memilih subkontraktor yang baik", "Kontrak subkontraktor", "Pengendalian kualitas subkon"],
  },
  {
    title: "K3 Konstruksi",
    description: "Keselamatan dan kesehatan kerja di proyek konstruksi sesuai regulasi",
    questions: ["Persyaratan K3 proyek konstruksi", "Dokumen RK3K", "Sertifikasi K3 konstruksi"],
  },
  {
    title: "Manajemen Mutu",
    description: "Sistem manajemen mutu dan quality control di proyek konstruksi",
    questions: ["ISO 9001 untuk konstruksi", "Prosedur quality control", "Dokumen mutu proyek"],
  },
  {
    title: "Pengembangan Bisnis",
    description: "Strategi pertumbuhan dan pengembangan perusahaan konstruksi",
    questions: ["Strategi ekspansi perusahaan konstruksi", "Diversifikasi bisnis konstruksi", "Kemitraan strategis"],
  },
  {
    title: "SDM & Organisasi",
    description: "Pengelolaan sumber daya manusia dan struktur organisasi perusahaan konstruksi",
    questions: ["Struktur organisasi kontraktor", "Rekrutmen tenaga ahli konstruksi", "Pengembangan kompetensi SDM"],
  },
  {
    title: "Teknologi Konstruksi",
    description: "Penerapan teknologi modern dalam proyek dan manajemen konstruksi",
    questions: ["BIM (Building Information Modeling)", "Software manajemen proyek konstruksi", "Digitalisasi konstruksi"],
  },
];

export default function ManajemenPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold">K</div>
                <span className="text-white font-bold">KonstruksiAI</span>
              </Link>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/tender" className="text-slate-300 hover:text-white text-sm transition-colors">Tender</Link>
              <Link href="/manajemen" className="text-orange-400 font-medium text-sm">Manajemen</Link>
              <Link href="/perijinan" className="text-slate-300 hover:text-white text-sm transition-colors">Perijinan</Link>
              <Link href="/chat" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Mulai Chat
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/" className="text-slate-400 hover:text-white text-sm transition-colors">Beranda</Link>
          <span className="text-slate-600">/</span>
          <span className="text-orange-400 text-sm">Manajemen Bisnis Konstruksi</span>
        </div>

        <div className="flex items-start gap-6 mb-10">
          <div className="w-16 h-16 bg-orange-500/20 border border-orange-500/30 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
            🏗️
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Manajemen Bisnis Konstruksi
            </h1>
            <p className="text-slate-300 text-lg max-w-3xl">
              Panduan komprehensif mengelola perusahaan dan proyek konstruksi — dari manajemen cashflow, 
              RAB, subkontraktor, K3, hingga pengembangan bisnis konstruksi yang berkelanjutan.
            </p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {[
            { icon: "💰", label: "Cashflow Management", desc: "Arus kas proyek" },
            { icon: "📊", label: "RAB & Estimasi", desc: "Anggaran akurat" },
            { icon: "👷", label: "K3 Konstruksi", desc: "Keselamatan kerja" },
            { icon: "🎯", label: "Quality Control", desc: "Mutu terjaga" },
          ].map((item) => (
            <div key={item.label} className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">{item.icon}</div>
              <div className="text-white font-semibold text-sm">{item.label}</div>
              <div className="text-slate-400 text-xs mt-1">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Topics Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-2xl font-bold text-white mb-6">Topik Manajemen Konstruksi</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {manajemenTopics.map((topic) => (
            <div key={topic.title} className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-orange-500/50 transition-colors">
              <h3 className="text-white font-semibold text-lg mb-2">{topic.title}</h3>
              <p className="text-slate-400 text-sm mb-4">{topic.description}</p>
              <div className="space-y-2">
                {topic.questions.map((q) => (
                  <Link
                    key={q}
                    href={`/chat?q=${encodeURIComponent(q)}`}
                    className="flex items-center gap-2 text-orange-400 hover:text-orange-300 text-sm transition-colors"
                  >
                    <span className="text-xs">→</span>
                    {q}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 bg-orange-600/20 border border-orange-500/30 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-3">Konsultasi Manajemen Konstruksi</h3>
          <p className="text-slate-300 mb-6">Dapatkan panduan praktis untuk mengelola proyek dan bisnis konstruksi Anda</p>
          <Link
            href="/chat"
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold transition-colors inline-block"
          >
            🏗️ Konsultasi Sekarang
          </Link>
        </div>
      </section>
    </div>
  );
}
