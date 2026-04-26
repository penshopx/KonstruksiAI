import Link from "@/shims/next-link";

const perijinanTopics = [
  {
    category: "Sertifikasi Badan Usaha",
    color: "border-green-500/50",
    badgeColor: "text-green-400 bg-green-400/10",
    items: [
      {
        title: "SBU (Sertifikat Badan Usaha)",
        description: "Sertifikat wajib untuk perusahaan jasa konstruksi beroperasi di Indonesia",
        questions: ["Syarat mendapatkan SBU", "Klasifikasi SBU konstruksi", "Perpanjangan SBU"],
      },
      {
        title: "IUJK (Izin Usaha Jasa Konstruksi)",
        description: "Izin operasional perusahaan jasa konstruksi yang terintegrasi dengan NIB",
        questions: ["Cara mendapatkan IUJK", "IUJK nasional vs daerah", "Perpanjangan IUJK"],
      },
    ],
  },
  {
    category: "Sertifikasi Tenaga Ahli",
    color: "border-purple-500/50",
    badgeColor: "text-purple-400 bg-purple-400/10",
    items: [
      {
        title: "SKK (Sertifikat Kompetensi Kerja)",
        description: "Bukti kompetensi tenaga kerja konstruksi sesuai UU No. 2 Tahun 2017",
        questions: ["Cara mendapatkan SKK", "Jenjang SKK konstruksi", "SKK untuk tenaga ahli"],
      },
      {
        title: "SKA & SKT (Lama)",
        description: "Sertifikat keahlian dan keterampilan yang kini bertransisi ke SKK",
        questions: ["Konversi SKA ke SKK", "SKA yang masih berlaku", "Transisi sertifikasi konstruksi"],
      },
    ],
  },
  {
    category: "Perijinan Bangunan",
    color: "border-yellow-500/50",
    badgeColor: "text-yellow-400 bg-yellow-400/10",
    items: [
      {
        title: "PBG (Persetujuan Bangunan Gedung)",
        description: "Pengganti IMB sesuai PP No. 16 Tahun 2021 tentang Bangunan Gedung",
        questions: ["Cara mengurus PBG", "Perbedaan PBG dan IMB", "Dokumen untuk PBG"],
      },
      {
        title: "SLF (Sertifikat Laik Fungsi)",
        description: "Sertifikat yang menyatakan bangunan layak digunakan sesuai fungsinya",
        questions: ["Cara mendapatkan SLF", "Syarat SLF bangunan", "Perpanjangan SLF"],
      },
    ],
  },
  {
    category: "Regulasi & Standar",
    color: "border-red-500/50",
    badgeColor: "text-red-400 bg-red-400/10",
    items: [
      {
        title: "UU Jasa Konstruksi",
        description: "UU No. 2 Tahun 2017 dan peraturan turunannya yang mengatur industri konstruksi",
        questions: ["Isi UU Jasa Konstruksi", "Kewajiban perusahaan konstruksi", "Sanksi pelanggaran"],
      },
      {
        title: "SNI Konstruksi",
        description: "Standar Nasional Indonesia yang berlaku untuk pekerjaan konstruksi",
        questions: ["SNI beton bertulang", "SNI baja konstruksi", "Cara menggunakan SNI"],
      },
    ],
  },
];

const certificationPath = [
  { step: "1", title: "Pilih Bidang", desc: "Tentukan bidang konstruksi yang sesuai keahlian" },
  { step: "2", title: "Siapkan Dokumen", desc: "KTP, ijazah, pengalaman kerja, portofolio" },
  { step: "3", title: "Daftar LSP", desc: "Pilih Lembaga Sertifikasi Profesi terakreditasi" },
  { step: "4", title: "Ikuti Asesmen", desc: "Uji kompetensi teori dan praktik" },
  { step: "5", title: "Terima SKK", desc: "Sertifikat berlaku 5 tahun, dapat diperpanjang" },
];

export default function PerijinanPage() {
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
              <Link href="/manajemen" className="text-slate-300 hover:text-white text-sm transition-colors">Manajemen</Link>
              <Link href="/perijinan" className="text-orange-400 font-medium text-sm">Perijinan</Link>
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
          <span className="text-orange-400 text-sm">Perijinan & Sertifikasi</span>
        </div>

        <div className="flex items-start gap-6 mb-10">
          <div className="w-16 h-16 bg-green-500/20 border border-green-500/30 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
            📜
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Perijinan & Sertifikasi Konstruksi
            </h1>
            <p className="text-slate-300 text-lg max-w-3xl">
              Panduan lengkap perijinan usaha dan sertifikasi profesional bidang konstruksi — 
              SBU, SKK, IUJK, PBG, SLF, dan regulasi konstruksi terkini di Indonesia.
            </p>
          </div>
        </div>

        {/* Certification Path */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 mb-12">
          <h2 className="text-white font-bold text-lg mb-5">Alur Mendapatkan SKK Konstruksi</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            {certificationPath.map((item, index) => (
              <div key={item.step} className="flex-1 flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {item.step}
                  </div>
                  {index < certificationPath.length - 1 && (
                    <div className="hidden sm:block w-full h-0.5 bg-slate-600 mt-4 flex-1"></div>
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div className="text-white font-semibold text-sm">{item.title}</div>
                  <div className="text-slate-400 text-xs mt-1">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Topics by Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-10">
        {perijinanTopics.map((category) => (
          <div key={category.category}>
            <div className="flex items-center gap-3 mb-5">
              <h2 className="text-xl font-bold text-white">{category.category}</h2>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${category.badgeColor}`}>
                {category.items.length} topik
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {category.items.map((item) => (
                <div
                  key={item.title}
                  className={`bg-slate-800 border border-slate-700 hover:${category.color} rounded-xl p-5 transition-colors`}
                >
                  <h3 className="text-white font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-slate-400 text-sm mb-4">{item.description}</p>
                  <div className="space-y-2">
                    {item.questions.map((q) => (
                      <Link
                        key={q}
                        href={`/chat?q=${encodeURIComponent(q)}`}
                        className="flex items-center gap-2 text-green-400 hover:text-green-300 text-sm transition-colors"
                      >
                        <span className="text-xs">→</span>
                        {q}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Important Notice */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h3 className="text-yellow-300 font-semibold mb-2">Perhatian: Regulasi Terus Berkembang</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Regulasi konstruksi di Indonesia terus diperbarui. Informasi yang diberikan KonstruksiAI 
                berdasarkan regulasi terkini, namun selalu verifikasi ke instansi terkait (LPJK, Kementerian PUPR, 
                DPMPTSP) untuk kepastian hukum. Gunakan informasi ini sebagai panduan awal.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-green-600/20 border border-green-500/30 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-3">Butuh Panduan Perijinan Spesifik?</h3>
          <p className="text-slate-300 mb-6">Tanyakan detail persyaratan, prosedur, dan biaya perijinan konstruksi</p>
          <Link
            href="/chat"
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors inline-block"
          >
            📜 Tanya Perijinan Sekarang
          </Link>
        </div>
      </section>
    </div>
  );
}
