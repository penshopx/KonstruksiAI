import Link from "next/link";

const subFields = [
  {
    icon: "🏛️",
    title: "Arsitektur",
    description: "Perancangan bangunan, estetika, fungsi, dan keselamatan struktur bangunan.",
    topics: [
      "Standar desain bangunan SNI",
      "Persyaratan IMB/PBG untuk bangunan",
      "Sertifikasi arsitek (IAI)",
      "Desain bangunan hijau (green building)",
    ],
    questions: [
      "Apa syarat mendapatkan sertifikasi arsitek IAI?",
      "Bagaimana standar desain bangunan hijau di Indonesia?",
      "Apa perbedaan IMB dan PBG?",
    ],
  },
  {
    icon: "🌉",
    title: "Teknik Sipil",
    description: "Perencanaan, desain, dan konstruksi infrastruktur: jalan, jembatan, gedung, bendungan.",
    topics: [
      "Perencanaan struktur beton & baja",
      "Analisis geoteknik & pondasi",
      "Manajemen konstruksi infrastruktur",
      "Sertifikasi insinyur sipil (PII)",
    ],
    questions: [
      "Bagaimana cara menghitung struktur beton bertulang?",
      "Apa syarat sertifikasi insinyur sipil PII?",
      "Jelaskan metode konstruksi jembatan beton prategang",
    ],
  },
  {
    icon: "⚙️",
    title: "Mekanikal",
    description: "Sistem HVAC, plumbing, fire protection, dan instalasi mekanikal bangunan.",
    topics: [
      "Sistem HVAC (pendingin udara)",
      "Instalasi plumbing & sanitasi",
      "Sistem proteksi kebakaran",
      "Sertifikasi teknisi mekanikal",
    ],
    questions: [
      "Bagaimana standar instalasi HVAC gedung bertingkat?",
      "Apa persyaratan sistem fire protection bangunan?",
      "Jelaskan standar plumbing SNI untuk gedung",
    ],
  },
  {
    icon: "⚡",
    title: "Elektrikal",
    description: "Instalasi listrik, sistem daya, pencahayaan, dan sistem kelistrikan bangunan.",
    topics: [
      "Instalasi listrik PUIL 2011",
      "Sistem panel & distribusi daya",
      "Pencahayaan & efisiensi energi",
      "Sertifikasi teknisi listrik",
    ],
    questions: [
      "Apa standar instalasi listrik PUIL 2011?",
      "Bagaimana cara menghitung kebutuhan daya listrik gedung?",
      "Apa syarat sertifikasi instalatir listrik?",
    ],
  },
  {
    icon: "🌿",
    title: "Tata Lingkungan",
    description: "Pengelolaan lingkungan, AMDAL, drainase, dan infrastruktur sanitasi.",
    topics: [
      "Analisis AMDAL proyek konstruksi",
      "Sistem drainase & pengelolaan air",
      "Pengelolaan limbah konstruksi",
      "Sertifikasi ahli lingkungan",
    ],
    questions: [
      "Kapan proyek konstruksi wajib AMDAL?",
      "Bagaimana standar pengelolaan limbah konstruksi?",
      "Apa itu UKL-UPL dan kapan digunakan?",
    ],
  },
  {
    icon: "🔧",
    title: "Rekayasa Teknik",
    description: "Rekayasa nilai, inovasi teknik, dan optimasi sistem konstruksi.",
    topics: [
      "Value engineering proyek",
      "Metode konstruksi inovatif",
      "BIM (Building Information Modeling)",
      "Manajemen risiko teknik",
    ],
    questions: [
      "Apa itu value engineering dalam konstruksi?",
      "Bagaimana implementasi BIM di proyek konstruksi?",
      "Jelaskan manajemen risiko teknik proyek",
    ],
  },
  {
    icon: "🌳",
    title: "Arsitektur Lanskap",
    description: "Perancangan ruang terbuka hijau, taman, dan lingkungan luar bangunan.",
    topics: [
      "Desain ruang terbuka hijau (RTH)",
      "Standar RTH perkotaan 30%",
      "Tanaman & material lanskap",
      "Sertifikasi arsitek lanskap",
    ],
    questions: [
      "Apa standar ruang terbuka hijau (RTH) perkotaan?",
      "Bagaimana persyaratan desain taman kota?",
      "Apa syarat sertifikasi arsitek lanskap?",
    ],
  },
  {
    icon: "🛋️",
    title: "Desain Interior",
    description: "Perancangan ruang dalam bangunan, estetika, ergonomi, dan fungsi interior.",
    topics: [
      "Standar ergonomi ruang interior",
      "Material & finishing interior",
      "Pencahayaan interior",
      "Sertifikasi desainer interior (HDII)",
    ],
    questions: [
      "Apa standar ergonomi desain interior kantor?",
      "Bagaimana persyaratan sertifikasi desainer interior HDII?",
      "Jelaskan standar pencahayaan interior SNI",
    ],
  },
  {
    icon: "💡",
    title: "Iluminasi / Pencahayaan",
    description: "Perancangan sistem pencahayaan buatan dan alami untuk bangunan dan ruang luar.",
    topics: [
      "Standar pencahayaan SNI 03-6575",
      "Efisiensi energi pencahayaan",
      "Pencahayaan jalan & ruang publik",
      "Teknologi LED & smart lighting",
    ],
    questions: [
      "Apa standar pencahayaan ruang kerja SNI?",
      "Bagaimana menghitung kebutuhan lampu gedung?",
      "Apa persyaratan pencahayaan jalan umum?",
    ],
  },
  {
    icon: "🗺️",
    title: "Perencanaan Wilayah & Kota",
    description: "Tata ruang, RTRW, zonasi, dan perencanaan pembangunan wilayah.",
    topics: [
      "Rencana Tata Ruang Wilayah (RTRW)",
      "Izin pemanfaatan ruang (KKPR)",
      "Zonasi & peruntukan lahan",
      "Sertifikasi perencana kota (IAP)",
    ],
    questions: [
      "Apa itu KKPR dan bagaimana cara mendapatkannya?",
      "Bagaimana cara membaca RTRW untuk investasi?",
      "Apa syarat sertifikasi perencana kota IAP?",
    ],
  },
];

export default function KonstruksiPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                  K
                </div>
                <div>
                  <span className="text-white font-bold text-lg">KonstruksiAI</span>
                  <span className="text-slate-400 text-xs block leading-none">Asisten Cerdas Keteknikan</span>
                </div>
              </Link>
            </div>
            <nav className="hidden md:flex items-center gap-4">
              <Link href="/" className="text-slate-300 hover:text-white text-sm transition-colors">Beranda</Link>
              <Link href="/energi" className="text-slate-300 hover:text-white text-sm transition-colors">Energi</Link>
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
          <span className="text-white">Teknik Konstruksi</span>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center text-4xl">
            🏗️
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">Teknik Konstruksi</h1>
            <p className="text-orange-400 font-medium mt-1">10 Sub-Bidang Keahlian</p>
          </div>
        </div>

        <p className="text-slate-300 text-lg max-w-3xl leading-relaxed">
          Cakupan lengkap bidang teknik konstruksi Indonesia — dari arsitektur, sipil, mekanikal, elektrikal,
          hingga perencanaan wilayah dan kota. Tanyakan apa saja kepada AI kami.
        </p>
      </section>

      {/* Sub-Fields Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subFields.map((field) => (
            <div key={field.title} className="bg-slate-800 border border-slate-700 hover:border-orange-500/40 rounded-2xl p-6 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center text-2xl">
                  {field.icon}
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">{field.title}</h3>
                  <p className="text-slate-400 text-sm">{field.description}</p>
                </div>
              </div>

              {/* Topics */}
              <div className="mb-4">
                <p className="text-slate-500 text-xs font-medium uppercase tracking-wide mb-2">Topik Utama</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {field.topics.map((topic) => (
                    <div key={topic} className="flex items-center gap-1.5 text-slate-400 text-xs">
                      <span className="text-orange-400">●</span>
                      <span>{topic}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Questions */}
              <div>
                <p className="text-slate-500 text-xs font-medium uppercase tracking-wide mb-2">Tanya AI</p>
                <div className="space-y-1.5">
                  {field.questions.map((q) => (
                    <Link
                      key={q}
                      href={`/chat?q=${encodeURIComponent(q)}`}
                      className="block bg-slate-700 hover:bg-slate-600 border border-slate-600 hover:border-orange-500/50 rounded-lg px-3 py-2 text-slate-300 hover:text-white text-xs transition-all"
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

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-gradient-to-r from-orange-600 to-orange-500 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">
            Ada Pertanyaan Teknis Konstruksi?
          </h2>
          <p className="text-orange-100 mb-6">
            Tanyakan langsung ke KonstruksiAI — jawaban ahli dalam hitungan detik
          </p>
          <Link
            href="/chat"
            className="bg-white text-orange-600 hover:bg-orange-50 px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 inline-block"
          >
            🏗️ Mulai Chat Sekarang
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
