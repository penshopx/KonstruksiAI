import Link from "@/shims/next-link";

const subFields = [
  {
    icon: "🛢️",
    title: "Minyak & Gas Bumi (Migas)",
    description: "Eksplorasi, produksi, pengolahan, dan distribusi minyak dan gas bumi.",
    topics: [
      "Kontrak PSC (Production Sharing Contract)",
      "Perizinan usaha migas (SKK Migas)",
      "Eksplorasi & produksi migas",
      "Regulasi hulu & hilir migas",
    ],
    questions: [
      "Apa itu Production Sharing Contract (PSC) dalam migas?",
      "Bagaimana proses perizinan usaha hulu migas?",
      "Jelaskan perbedaan kegiatan hulu dan hilir migas",
    ],
  },
  {
    icon: "⛏️",
    title: "Pertambangan Mineral",
    description: "Eksplorasi, penambangan, pengolahan, dan pemurnian mineral logam dan non-logam.",
    topics: [
      "Izin Usaha Pertambangan (IUP)",
      "Eksplorasi & studi kelayakan",
      "Teknik penambangan terbuka & bawah tanah",
      "Pengolahan & pemurnian mineral",
    ],
    questions: [
      "Apa syarat mendapatkan Izin Usaha Pertambangan (IUP)?",
      "Bagaimana proses studi kelayakan tambang mineral?",
      "Apa perbedaan tambang terbuka dan tambang bawah tanah?",
    ],
  },
  {
    icon: "🔬",
    title: "Geologi & Eksplorasi",
    description: "Survei geologi, geofisika, dan eksplorasi sumber daya mineral dan energi.",
    topics: [
      "Survei geologi & pemetaan",
      "Metode geofisika eksplorasi",
      "Analisis data seismik",
      "Estimasi sumber daya & cadangan",
    ],
    questions: [
      "Apa metode geofisika yang digunakan dalam eksplorasi migas?",
      "Bagaimana cara mengestimasi cadangan mineral?",
      "Jelaskan klasifikasi sumber daya mineral (JORC/SNI)",
    ],
  },
  {
    icon: "🏗️",
    title: "Konstruksi Migas & Tambang",
    description: "Pembangunan fasilitas produksi, kilang, pipa, dan infrastruktur pertambangan.",
    topics: [
      "Konstruksi fasilitas produksi migas",
      "Pembangunan kilang & terminal",
      "Konstruksi tambang & infrastruktur",
      "Standar konstruksi ASME & API",
    ],
    questions: [
      "Apa standar konstruksi fasilitas migas (ASME/API)?",
      "Bagaimana proses konstruksi kilang minyak?",
      "Apa persyaratan kontraktor konstruksi migas?",
    ],
  },
  {
    icon: "🚰",
    title: "Pipeline & Fasilitas",
    description: "Perencanaan, konstruksi, dan operasi jaringan pipa migas.",
    topics: [
      "Desain & konstruksi pipa migas",
      "Standar pipeline (ASME B31.4/B31.8)",
      "Inspeksi & integritas pipa",
      "Perizinan jaringan pipa",
    ],
    questions: [
      "Apa standar desain pipa gas (ASME B31.8)?",
      "Bagaimana cara mendapatkan izin pembangunan pipa migas?",
      "Jelaskan metode inspeksi integritas pipa",
    ],
  },
  {
    icon: "🦺",
    title: "K3 Migas & Pertambangan",
    description: "Keselamatan dan kesehatan kerja khusus industri migas dan pertambangan.",
    topics: [
      "Regulasi K3 migas (Permen ESDM)",
      "Manajemen risiko & HAZOP",
      "Sertifikasi K3 migas & tambang",
      "Penanganan bahan berbahaya (B3)",
    ],
    questions: [
      "Apa regulasi K3 khusus industri migas di Indonesia?",
      "Bagaimana cara melakukan analisis HAZOP?",
      "Apa sertifikasi K3 yang wajib di industri pertambangan?",
    ],
  },
  {
    icon: "🌍",
    title: "Lingkungan Hidup Migas & Tambang",
    description: "AMDAL, reklamasi, dan pengelolaan lingkungan industri ekstraktif.",
    topics: [
      "AMDAL khusus migas & tambang",
      "Reklamasi & pasca tambang",
      "Pengelolaan limbah B3",
      "Pemantauan lingkungan",
    ],
    questions: [
      "Apa persyaratan AMDAL untuk kegiatan pertambangan?",
      "Bagaimana kewajiban reklamasi pasca tambang?",
      "Jelaskan pengelolaan limbah B3 di industri migas",
    ],
  },
  {
    icon: "📊",
    title: "Ekonomi & Regulasi Pertambangan",
    description: "Aspek ekonomi, fiskal, dan regulasi industri migas dan pertambangan.",
    topics: [
      "Royalti & PNBP pertambangan",
      "Divestasi saham tambang",
      "Regulasi UU Minerba terbaru",
      "Kontrak karya & PKP2B",
    ],
    questions: [
      "Bagaimana perhitungan royalti pertambangan mineral?",
      "Apa aturan divestasi saham perusahaan tambang asing?",
      "Jelaskan perubahan UU Minerba No. 3 Tahun 2020",
    ],
  },
];

const regulations = [
  { title: "UU No. 22/2001", desc: "Minyak dan Gas Bumi" },
  { title: "UU No. 3/2020", desc: "Pertambangan Mineral & Batubara" },
  { title: "PP No. 96/2021", desc: "Pelaksanaan Kegiatan Usaha Pertambangan" },
  { title: "Permen ESDM No. 7/2020", desc: "Tata Cara Pemberian WUP Mineral" },
  { title: "Perpres No. 55/2022", desc: "Pendelegasian Pemberian Perizinan Migas" },
  { title: "Permen ESDM No. 26/2018", desc: "Pelaksanaan Kaidah Pertambangan yang Baik" },
];

export default function MigasPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                K
              </div>
              <div>
                <span className="text-white font-bold text-lg">KonstruksiAI</span>
                <span className="text-slate-400 text-xs block leading-none">Asisten Cerdas Keteknikan</span>
              </div>
            </Link>
            <nav className="hidden md:flex items-center gap-4">
              <Link href="/" className="text-slate-300 hover:text-white text-sm transition-colors">Beranda</Link>
              <Link href="/konstruksi" className="text-slate-300 hover:text-white text-sm transition-colors">Konstruksi</Link>
              <Link href="/energi" className="text-slate-300 hover:text-white text-sm transition-colors">Energi</Link>
              <Link href="/tender" className="text-slate-300 hover:text-white text-sm transition-colors">Tender</Link>
              <Link href="/chat" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Mulai Chat
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Page Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="flex items-center gap-2 text-slate-400 text-sm mb-6">
          <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
          <span>›</span>
          <span className="text-white">Migas & Pertambangan</span>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center text-4xl">
            ⛏️
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">Migas & Pertambangan</h1>
            <p className="text-blue-400 font-medium mt-1">Mineral, Minyak, Gas Bumi & Pertambangan</p>
          </div>
        </div>

        <p className="text-slate-300 text-lg max-w-3xl leading-relaxed">
          Panduan lengkap industri migas dan pertambangan mineral Indonesia —
          dari perizinan IUP, PSC, eksplorasi, konstruksi fasilitas, K3, hingga regulasi terbaru.
        </p>

        {/* Key Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
          {[
            { value: "700+", label: "Perusahaan Tambang" },
            { value: "1 juta+", label: "Tenaga Kerja Tambang" },
            { value: "Rp 500T+", label: "Kontribusi PDB" },
            { value: "100+", label: "Jenis Mineral" },
          ].map((stat) => (
            <div key={stat.label} className="bg-slate-800 border border-blue-500/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{stat.value}</div>
              <div className="text-slate-400 text-xs mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Sub-Fields Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <h2 className="text-2xl font-bold text-white mb-6">Sub-Bidang Keahlian</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subFields.map((field) => (
            <div key={field.title} className="bg-slate-800 border border-slate-700 hover:border-blue-500/40 rounded-2xl p-6 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-2xl">
                  {field.icon}
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">{field.title}</h3>
                  <p className="text-slate-400 text-sm">{field.description}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-slate-500 text-xs font-medium uppercase tracking-wide mb-2">Topik Utama</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {field.topics.map((topic) => (
                    <div key={topic} className="flex items-center gap-1.5 text-slate-400 text-xs">
                      <span className="text-blue-400">●</span>
                      <span>{topic}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-slate-500 text-xs font-medium uppercase tracking-wide mb-2">Tanya AI</p>
                <div className="space-y-1.5">
                  {field.questions.map((q) => (
                    <Link
                      key={q}
                      href={`/chat?q=${encodeURIComponent(q)}`}
                      className="block bg-slate-700 hover:bg-slate-600 border border-slate-600 hover:border-blue-500/50 rounded-lg px-3 py-2 text-slate-300 hover:text-white text-xs transition-all"
                    >
                      💬 {q}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Regulations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">⚖️ Regulasi Utama Migas & Pertambangan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {regulations.map((reg) => (
              <div key={reg.title} className="bg-slate-700 rounded-xl p-3">
                <div className="text-blue-400 font-semibold text-sm">{reg.title}</div>
                <div className="text-slate-400 text-xs mt-0.5">{reg.desc}</div>
              </div>
            ))}
          </div>
          <p className="text-slate-500 text-xs mt-4">
            ⚠️ Regulasi migas dan pertambangan terus berkembang. Selalu verifikasi dengan sumber resmi ESDM, SKK Migas, dan BKPM.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-gradient-to-r from-blue-700 to-blue-500 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">
            Ada Pertanyaan Seputar Migas & Pertambangan?
          </h2>
          <p className="text-blue-100 mb-6">
            Tanyakan langsung ke KonstruksiAI — dari perizinan IUP hingga regulasi UU Minerba terbaru
          </p>
          <Link
            href="/chat"
            className="bg-white text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 inline-block"
          >
            ⛏️ Mulai Chat Sekarang
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-500 text-sm">
            KonstruksiAI — Asisten AI bidang keteknikan Indonesia
          </p>
        </div>
      </footer>
    </div>
  );
}
