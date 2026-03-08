import Link from "next/link";

const tenderTopics = [
  {
    title: "Registrasi LPSE & SPSE",
    description: "Cara mendaftar sebagai penyedia jasa di sistem pengadaan elektronik pemerintah",
    questions: ["Cara daftar di LPSE", "Dokumen untuk registrasi SPSE", "Verifikasi penyedia jasa"],
  },
  {
    title: "Strategi Penawaran",
    description: "Tips dan strategi menyusun penawaran yang kompetitif dan memenangkan tender",
    questions: ["Cara menentukan harga penawaran", "Strategi penawaran teknis", "Analisis HPS"],
  },
  {
    title: "Dokumen Tender",
    description: "Panduan menyiapkan dokumen penawaran yang lengkap dan sesuai persyaratan",
    questions: ["Dokumen administrasi tender", "Dokumen teknis yang dibutuhkan", "Jaminan penawaran"],
  },
  {
    title: "Evaluasi & Sanggah",
    description: "Memahami proses evaluasi penawaran dan hak sanggah penyedia jasa",
    questions: ["Proses evaluasi penawaran", "Cara mengajukan sanggah", "Sistem gugur vs merit point"],
  },
  {
    title: "Kontrak & Pelaksanaan",
    description: "Dari penandatanganan kontrak hingga serah terima pekerjaan",
    questions: ["Jaminan pelaksanaan", "Addendum kontrak", "Proses PHO dan FHO"],
  },
  {
    title: "Regulasi Pengadaan",
    description: "Peraturan terbaru tentang pengadaan barang/jasa pemerintah",
    questions: ["Perpres 16/2018", "Perubahan Perpres 12/2021", "Pengadaan langsung vs tender"],
  },
];

const tenderStats = [
  { value: "Rp 1.000 T+", label: "Nilai Tender Pemerintah/Tahun" },
  { value: "500.000+", label: "Paket Tender per Tahun" },
  { value: "34", label: "Provinsi dengan LPSE" },
];

export default function TenderPage() {
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
              <Link href="/tender" className="text-orange-400 font-medium text-sm">Tender</Link>
              <Link href="/manajemen" className="text-slate-300 hover:text-white text-sm transition-colors">Manajemen</Link>
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
          <span className="text-orange-400 text-sm">Tender & Pengadaan</span>
        </div>

        <div className="flex items-start gap-6 mb-10">
          <div className="w-16 h-16 bg-blue-500/20 border border-blue-500/30 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
            📋
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Tender & Pengadaan Konstruksi
            </h1>
            <p className="text-slate-300 text-lg max-w-3xl">
              Panduan lengkap mengikuti tender pemerintah dan swasta — dari registrasi LPSE, 
              penyusunan dokumen penawaran, hingga strategi memenangkan tender konstruksi.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {tenderStats.map((stat) => (
            <div key={stat.label} className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{stat.value}</div>
              <div className="text-slate-400 text-xs mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Topics Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-2xl font-bold text-white mb-6">Topik Tender</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tenderTopics.map((topic) => (
            <div key={topic.title} className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-blue-500/50 transition-colors">
              <h3 className="text-white font-semibold text-lg mb-2">{topic.title}</h3>
              <p className="text-slate-400 text-sm mb-4">{topic.description}</p>
              <div className="space-y-2">
                {topic.questions.map((q) => (
                  <Link
                    key={q}
                    href={`/chat?q=${encodeURIComponent(q)}`}
                    className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm transition-colors"
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
        <div className="mt-10 bg-blue-600/20 border border-blue-500/30 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-3">Ada Pertanyaan Spesifik tentang Tender?</h3>
          <p className="text-slate-300 mb-6">Tanyakan langsung ke KonstruksiAI dan dapatkan jawaban detail dalam hitungan detik</p>
          <Link
            href="/chat"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors inline-block"
          >
            💬 Tanya Sekarang
          </Link>
        </div>
      </section>
    </div>
  );
}
