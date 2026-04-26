import Link from "next/link";

const subFields = [
  {
    icon: "☀️",
    title: "Energi Surya (Solar)",
    description: "Pembangkit listrik tenaga surya (PLTS) — rooftop, ground-mounted, dan off-grid.",
    topics: [
      "Desain sistem PLTS rooftop",
      "Regulasi PLTS & net metering",
      "Perizinan PLTS (IUPTL)",
      "Sertifikasi teknisi surya",
    ],
    questions: [
      "Bagaimana cara mendapatkan izin PLTS rooftop?",
      "Apa itu net metering dan bagaimana cara kerjanya?",
      "Berapa biaya investasi PLTS per kWp di Indonesia?",
    ],
  },
  {
    icon: "💨",
    title: "Energi Angin",
    description: "Pembangkit listrik tenaga bayu (PLTB) — onshore dan offshore.",
    topics: [
      "Studi kelayakan PLTB",
      "Regulasi & perizinan PLTB",
      "Analisis potensi angin",
      "Konstruksi turbin angin",
    ],
    questions: [
      "Bagaimana potensi energi angin di Indonesia?",
      "Apa persyaratan izin pembangunan PLTB?",
      "Jelaskan proses studi kelayakan PLTB",
    ],
  },
  {
    icon: "💧",
    title: "Energi Air (Hidro)",
    description: "Pembangkit listrik tenaga air (PLTA/PLTMH) — skala besar dan mikro hidro.",
    topics: [
      "Desain PLTA & PLTMH",
      "Studi hidrologi & potensi air",
      "Perizinan penggunaan air (SIPA)",
      "Konstruksi bendungan & turbin",
    ],
    questions: [
      "Apa perbedaan PLTA dan PLTMH?",
      "Bagaimana cara mendapatkan izin penggunaan air untuk PLTMH?",
      "Jelaskan komponen utama pembangkit mikro hidro",
    ],
  },
  {
    icon: "🌋",
    title: "Energi Panas Bumi (Geothermal)",
    description: "Pembangkit listrik tenaga panas bumi (PLTP) — eksplorasi dan eksploitasi.",
    topics: [
      "Eksplorasi panas bumi",
      "Regulasi WKP (Wilayah Kerja Panas Bumi)",
      "Konstruksi PLTP",
      "Sertifikasi ahli panas bumi",
    ],
    questions: [
      "Bagaimana proses perizinan Wilayah Kerja Panas Bumi (WKP)?",
      "Apa potensi panas bumi Indonesia?",
      "Jelaskan tahapan eksplorasi panas bumi",
    ],
  },
  {
    icon: "🔋",
    title: "Penyimpanan Energi (BESS)",
    description: "Battery Energy Storage System — teknologi penyimpanan energi listrik.",
    topics: [
      "Teknologi baterai lithium-ion",
      "Regulasi BESS di Indonesia",
      "Integrasi BESS dengan PLTS",
      "Keselamatan sistem baterai",
    ],
    questions: [
      "Apa regulasi sistem penyimpanan energi (BESS) di Indonesia?",
      "Bagaimana cara mengintegrasikan BESS dengan PLTS?",
      "Apa standar keselamatan instalasi baterai?",
    ],
  },
  {
    icon: "🏭",
    title: "Pembangkit Listrik",
    description: "Perencanaan, konstruksi, dan operasi pembangkit listrik berbagai jenis.",
    topics: [
      "Perizinan pembangkit (IUPTL)",
      "Konstruksi pembangkit listrik",
      "Operasi & pemeliharaan",
      "Standar keselamatan pembangkit",
    ],
    questions: [
      "Apa itu IUPTL dan bagaimana cara mendapatkannya?",
      "Bagaimana standar konstruksi pembangkit listrik?",
      "Apa persyaratan K3 di pembangkit listrik?",
    ],
  },
  {
    icon: "🔌",
    title: "Transmisi & Distribusi",
    description: "Jaringan transmisi tegangan tinggi dan distribusi listrik ke konsumen.",
    topics: [
      "Perencanaan jaringan transmisi",
      "Standar SUTM & SUTT",
      "Perizinan jaringan listrik",
      "Pemeliharaan jaringan distribusi",
    ],
    questions: [
      "Apa standar teknis jaringan transmisi tegangan tinggi?",
      "Bagaimana perizinan pembangunan jaringan distribusi?",
      "Jelaskan perbedaan SUTM dan SUTT",
    ],
  },
  {
    icon: "🌿",
    title: "Biomassa & Biogas",
    description: "Energi dari biomassa pertanian, kehutanan, dan limbah organik.",
    topics: [
      "Teknologi pembangkit biomassa",
      "Regulasi biogas & biomassa",
      "Potensi biomassa Indonesia",
      "Perizinan PLTBm",
    ],
    questions: [
      "Bagaimana potensi energi biomassa di Indonesia?",
      "Apa persyaratan izin pembangkit biomassa (PLTBm)?",
      "Jelaskan teknologi gasifikasi biomassa",
    ],
  },
];

const regulations = [
  { title: "UU No. 30/2007", desc: "Undang-Undang Energi" },
  { title: "UU No. 30/2009", desc: "Ketenagalistrikan" },
  { title: "PP No. 25/2021", desc: "Penyelenggaraan Bidang ESDM" },
  { title: "Permen ESDM No. 26/2021", desc: "PLTS Atap" },
  { title: "Perpres No. 112/2022", desc: "Percepatan Pengembangan EBT" },
  { title: "Permen ESDM No. 4/2020", desc: "Pengawasan Usaha Ketenagalistrikan" },
];

export default function EnergiPage() {
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
              <Link href="/migas" className="text-slate-300 hover:text-white text-sm transition-colors">Migas</Link>
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
          <span className="text-white">Ketenagalistrikan & Energi Baru Terbarukan</span>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-yellow-500/20 rounded-2xl flex items-center justify-center text-4xl">
            ⚡
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">Ketenagalistrikan & EBT</h1>
            <p className="text-yellow-400 font-medium mt-1">Energi Baru Terbarukan Indonesia</p>
          </div>
        </div>

        <p className="text-slate-300 text-lg max-w-3xl leading-relaxed">
          Panduan lengkap bidang ketenagalistrikan dan energi baru terbarukan (EBT) Indonesia —
          dari PLTS, PLTB, PLTA, panas bumi, hingga regulasi dan perizinan energi.
        </p>

        {/* Key Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
          {[
            { value: "23%", label: "Target EBT 2025" },
            { value: "3.600+", label: "MW PLTS Terpasang" },
            { value: "29.000+", label: "MW Potensi Panas Bumi" },
            { value: "75.000+", label: "MW Potensi Hidro" },
          ].map((stat) => (
            <div key={stat.label} className="bg-slate-800 border border-yellow-500/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">{stat.value}</div>
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
            <div key={field.title} className="bg-slate-800 border border-slate-700 hover:border-yellow-500/40 rounded-2xl p-6 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center text-2xl">
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
                      <span className="text-yellow-400">●</span>
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
                      className="block bg-slate-700 hover:bg-slate-600 border border-slate-600 hover:border-yellow-500/50 rounded-lg px-3 py-2 text-slate-300 hover:text-white text-xs transition-all"
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
          <h2 className="text-xl font-bold text-white mb-4">⚖️ Regulasi Utama Ketenagalistrikan & EBT</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {regulations.map((reg) => (
              <div key={reg.title} className="bg-slate-700 rounded-xl p-3">
                <div className="text-yellow-400 font-semibold text-sm">{reg.title}</div>
                <div className="text-slate-400 text-xs mt-0.5">{reg.desc}</div>
              </div>
            ))}
          </div>
          <p className="text-slate-500 text-xs mt-4">
            ⚠️ Regulasi energi terus berkembang. Selalu verifikasi dengan sumber resmi ESDM dan PLN.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-gradient-to-r from-yellow-600 to-orange-500 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">
            Ada Pertanyaan Seputar Energi Terbarukan?
          </h2>
          <p className="text-yellow-100 mb-6">
            Tanyakan langsung ke KonstruksiAI — dari perizinan PLTS hingga regulasi EBT terbaru
          </p>
          <Link
            href="/chat"
            className="bg-white text-yellow-700 hover:bg-yellow-50 px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 inline-block"
          >
            ⚡ Mulai Chat Sekarang
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
