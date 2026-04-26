"use client";

import { useState, useEffect, useRef } from "react";
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

const STATS = [
  { value: 126, label: "Titik Koneksi", suffix: "" },
  { value: 3, label: "Sektor Industri", suffix: "" },
  { value: 26, label: "Sub-Bidang", suffix: "+" },
  { value: 8, label: "Agen AI", suffix: "" },
];

const FAQ_ITEMS = [
  {
    q: "Apakah KonstruksiAI bisa membantu menyusun RAB proyek?",
    a: "Ya! KonstruksiAI dapat membantu menyusun Rencana Anggaran Biaya (RAB) dengan detail. Cukup berikan informasi proyek seperti jenis bangunan, luas, lokasi, dan spesifikasi, dan AI akan menghasilkan estimasi biaya yang terstruktur.",
  },
  {
    q: "Apakah informasi regulasi yang diberikan selalu terbaru?",
    a: "KonstruksiAI dilatih dengan regulasi konstruksi Indonesia terkini termasuk UU Cipta Kerja, Perpres 16/2018, dan peraturan PUPR terbaru. Namun selalu disarankan untuk memverifikasi dengan sumber resmi untuk keputusan penting.",
  },
  {
    q: "Bisakah KonstruksiAI membantu proses tender LPSE?",
    a: "Tentu! AI kami memiliki keahlian khusus dalam tender pemerintah melalui LPSE. Mulai dari analisis dokumen tender, strategi penawaran, penyusunan metode pelaksanaan, hingga checklist dokumen kualifikasi.",
  },
  {
    q: "Apakah ada batasan jumlah pertanyaan yang bisa diajukan?",
    a: "Tidak ada batasan! Anda bisa mengajukan pertanyaan sebanyak yang Anda butuhkan. Setiap percakapan tersimpan secara lokal di browser Anda sehingga bisa diakses kembali kapan saja.",
  },
  {
    q: "Apakah KonstruksiAI bisa membuat dokumen K3 seperti JSA dan HIRARC?",
    a: "Ya, KonstruksiAI dapat membantu membuat Job Safety Analysis (JSA), HIRARC, prosedur tanggap darurat, dan dokumen K3 lainnya sesuai standar SMK3 dan ISO 45001.",
  },
  {
    q: "Bagaimana cara menggunakan fitur Matriks Ruang Lingkup?",
    a: "Buka halaman Matriks dari menu navigasi. Di sana Anda akan menemukan grid interaktif 21×6 yang menghubungkan 21 fungsi bisnis dengan 6 kolom keteknikan. Klik setiap titik koneksi untuk membuka agen AI yang relevan.",
  },
];

const PLAN_FEATURES = [
  { feature: "Chat dengan AI", free: true, pro: true },
  { feature: "8 Agen Spesialis", free: true, pro: true },
  { feature: "Riwayat percakapan lokal", free: true, pro: true },
  { feature: "Export percakapan (.md)", free: true, pro: true },
  { feature: "Matriks Ruang Lingkup", free: true, pro: true },
  { feature: "Bintang & label percakapan", free: true, pro: true },
  { feature: "Koneksi LLM real-time", free: false, pro: true },
  { feature: "Riwayat cloud (sync)", free: false, pro: true },
  { feature: "Template dokumen premium", free: false, pro: true },
  { feature: "Analisis dokumen PDF", free: false, pro: true },
  { feature: "Prioritas dukungan", free: false, pro: true },
];

const TESTIMONIALS = [
  {
    initials: "BS",
    name: "Budi Santoso",
    title: "Direktur PT Maju Konstruksi",
    company: "Jakarta",
    quote:
      "KonstruksiAI sangat membantu tim kami dalam menyusun RAB dengan cepat dan akurat. Proses yang biasanya butuh 2 hari kerja sekarang bisa selesai dalam hitungan jam.",
    color: "bg-orange-500",
  },
  {
    initials: "RH",
    name: "Ratih Handayani",
    title: "Manajer K3 – PT EBT Nusantara",
    company: "Surabaya",
    quote:
      "Fitur K3 dan JSA-nya luar biasa detail. Sangat membantu kami mempersiapkan dokumen keselamatan untuk proyek PLTS berskala besar di Jawa Timur.",
    color: "bg-blue-500",
  },
  {
    initials: "AF",
    name: "Ahmad Fauzi",
    title: "Konsultan Tender Senior",
    company: "Bandung",
    quote:
      "Platform terbaik untuk profesional konstruksi Indonesia. Panduan tender LPSE dan strategi penawarannya sangat relevan dengan kondisi pasar saat ini.",
    color: "bg-green-600",
  },
];

// ============================================================
// ANIMATED COUNTER HOOK
// ============================================================

function useCounter(target: number, duration = 1500, started: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!started) return;
    const startTime = performance.now();
    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);

  return count;
}

// ============================================================
// STATS SECTION
// ============================================================

function StatsSection() {
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const counts = [
    useCounter(STATS[0].value, 1200, started),
    useCounter(STATS[1].value, 800, started),
    useCounter(STATS[2].value, 1000, started),
    useCounter(STATS[3].value, 700, started),
  ];

  return (
    <section ref={ref} className="bg-slate-950 border-y border-slate-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat, i) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl font-bold text-orange-400 tabular-nums">
                {counts[i]}{stat.suffix}
              </div>
              <div className="text-slate-400 text-sm mt-1 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// TESTIMONIALS SECTION
// ============================================================

function TestimonialsSection() {
  const [visibleIndexes, setVisibleIndexes] = useState<number[]>([]);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    refs.current.forEach((el, i) => {
      if (!el) return;
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            setVisibleIndexes(prev => [...prev, i]);
            observer.disconnect();
          }
        },
        { threshold: 0.2 }
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">Apa Kata Mereka</h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Dipercaya oleh profesional dan perusahaan keteknikan terkemuka di Indonesia
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((t, i) => (
          <div
            key={t.name}
            ref={el => { refs.current[i] = el; }}
            className={`bg-slate-800 border border-slate-700 rounded-2xl p-6 transition-all duration-700 ${
              visibleIndexes.includes(i)
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: `${i * 150}ms` }}
          >
            {/* Quote */}
            <div className="text-orange-400 text-3xl leading-none mb-4">&ldquo;</div>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">{t.quote}</p>

            {/* Author */}
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${t.color} rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                {t.initials}
              </div>
              <div>
                <div className="text-white text-sm font-semibold">{t.name}</div>
                <div className="text-slate-500 text-xs">{t.title}</div>
                <div className="text-slate-600 text-xs">{t.company}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================================
// FAQ SECTION
// ============================================================

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">Pertanyaan yang Sering Diajukan</h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Temukan jawaban atas pertanyaan umum tentang KonstruksiAI
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-3">
        {FAQ_ITEMS.map((item, i) => (
          <div
            key={i}
            className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden transition-all"
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-700/50 transition-colors"
            >
              <span className="text-white font-medium text-sm pr-4">{item.q}</span>
              <svg
                className={`w-5 h-5 text-orange-400 flex-shrink-0 transition-transform duration-200 ${openIndex === i ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openIndex === i && (
              <div className="px-6 pb-4 text-slate-400 text-sm leading-relaxed border-t border-slate-700/50 pt-3">
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================================
// PRICING / PLAN COMPARISON
// ============================================================

function PlanComparisonSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">Paket Layanan</h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Mulai gratis, upgrade kapan saja
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-3 border-b border-slate-700">
            <div className="px-6 py-4 text-slate-400 text-sm font-medium">Fitur</div>
            <div className="px-6 py-4 text-center border-l border-slate-700">
              <div className="text-white font-bold">Gratis</div>
              <div className="text-slate-500 text-xs mt-0.5">Selamanya</div>
            </div>
            <div className="px-6 py-4 text-center border-l border-slate-700 bg-orange-500/5">
              <div className="text-orange-400 font-bold">Pro</div>
              <div className="text-slate-500 text-xs mt-0.5">Segera hadir</div>
            </div>
          </div>

          {/* Rows */}
          {PLAN_FEATURES.map((row, i) => (
            <div
              key={row.feature}
              className={`grid grid-cols-3 border-b border-slate-700/50 ${i % 2 === 0 ? "" : "bg-slate-800/50"}`}
            >
              <div className="px-6 py-3 text-slate-300 text-sm">{row.feature}</div>
              <div className="px-6 py-3 text-center border-l border-slate-700/50">
                {row.free ? (
                  <span className="text-green-400 text-base">✓</span>
                ) : (
                  <span className="text-slate-600 text-base">—</span>
                )}
              </div>
              <div className="px-6 py-3 text-center border-l border-slate-700/50 bg-orange-500/5">
                {row.pro ? (
                  <span className="text-green-400 text-base">✓</span>
                ) : (
                  <span className="text-slate-600 text-base">—</span>
                )}
              </div>
            </div>
          ))}

          {/* CTA row */}
          <div className="grid grid-cols-3 pt-4 pb-5">
            <div className="px-6"></div>
            <div className="px-6 text-center border-l border-slate-700/50">
              <span className="text-slate-400 text-sm">Aktif sekarang</span>
            </div>
            <div className="px-6 text-center border-l border-slate-700/50">
              <button className="bg-orange-500/20 border border-orange-500/40 text-orange-400 text-xs px-4 py-1.5 rounded-lg hover:bg-orange-500/30 transition-colors">
                Daftar Antrian
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// MAIN PAGE
// ============================================================

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
              <Link href="/knowledge" className="text-purple-400 hover:text-purple-300 text-sm transition-colors font-medium">📚 Knowledge</Link>
              <Link href="/bimtek" className="text-blue-400 hover:text-blue-300 text-sm transition-colors font-medium">🎓 Bimtek</Link>
              <Link href="/simulasi" className="text-violet-400 hover:text-violet-300 text-sm transition-colors font-medium">🎯 Simulasi</Link>
              <Link href="/solver" className="text-orange-400 hover:text-orange-300 text-sm transition-colors font-medium">🔬 Solver</Link>
              <Link href="/tools" className="text-slate-300 hover:text-white text-sm transition-colors">🔧 Tools</Link>
              <Link href="/matrix" className="text-slate-300 hover:text-white text-sm transition-colors">📊 Matriks</Link>
              <Link href="/certify" className="text-emerald-400 hover:text-emerald-300 text-sm transition-colors">🏅 Sertifikasi</Link>
              <Link href="/tender-intelligence" className="text-emerald-400 hover:text-emerald-300 text-sm transition-colors">🎯 Tender Intelligence</Link>
              <Link href="/tender-eligibility" className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors">📋 Tender Eligibility</Link>
              <Link href="/evidence-mapping" className="text-purple-400 hover:text-purple-300 text-sm transition-colors">🔗 Evidence Mapping</Link>
              <Link href="/workforce-assignment" className="text-pink-400 hover:text-pink-300 text-sm transition-colors">👷 Workforce Assignment</Link>
              <Link href="/legal-licensing" className="text-blue-400 hover:text-blue-300 text-sm transition-colors">⚖️ Legal & Licensing</Link>
              <Link href="/sbu-readiness" className="text-orange-400 hover:text-orange-300 text-sm transition-colors">🏗️ SBU Readiness</Link>
              <Link href="/skk-readiness" className="text-green-400 hover:text-green-300 text-sm transition-colors">🎓 SKK Readiness</Link>
              <Link href="/pricing" className="text-slate-300 hover:text-white text-sm transition-colors">Harga</Link>
              <Link href="/chat" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Mulai Chat
              </Link>
              <NavbarAuth />
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section - ATTENTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        {/* Industry Problem Alert */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-full px-4 py-2 mb-6">
            <span className="text-red-400 text-sm font-medium animate-pulse">🚨 KONDISI DARURAT INDUSTRI KONSTRUKSI INDONESIA</span>
          </div>
        </div>

        {/* Hero Stats - Shocking Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-4xl mx-auto">
          {[
            { value: "87%", label: "Proyek Tertunda", desc: "Karena Perijinan" },
            { value: "IDR 1.2T", label: "Kerugian Tahunan", desc: "Dari Tender Gagal" },
            { value: "65%", label: "Kontraktor Bangkrut", desc: "Dalam 3 Tahun" },
            { value: "89%", label: "Kekurangan Tenaga", desc: "Ahli Bersertifikat" },
          ].map((stat, i) => (
            <div key={stat.label} className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-red-400 mb-1">{stat.value}</div>
              <div className="text-red-300 font-semibold text-sm mb-1">{stat.label}</div>
              <div className="text-red-400/70 text-xs">{stat.desc}</div>
            </div>
          ))}
        </div>

        {/* Problem Statement */}
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Industri Konstruksi Indonesia
            <span className="text-red-400 block">Sedang Darurat!</span>
          </h1>

          <p className="text-slate-300 text-lg sm:text-xl max-w-4xl mx-auto mb-6 leading-relaxed">
            <strong className="text-red-400">87% proyek konstruksi tertunda</strong> karena birokrasi perijinan yang rumit,
            <strong className="text-red-400">IDR 1.2 Triliun kerugian tahunan</strong> dari tender yang gagal dimenangkan,
            dan <strong className="text-red-400">65% kontraktor bangkrut</strong> dalam 3 tahun pertama.
          </p>

          <p className="text-slate-400 text-base max-w-3xl mx-auto">
            Masalahnya? Sistem yang ketinggalan zaman, regulasi yang tumpang tindih, dan kurangnya akses ke pengetahuan teknis terkini.
          </p>
        </div>

        {/* Solution Introduction */}
        <div className="bg-gradient-to-r from-orange-600/20 to-blue-600/20 border border-orange-500/30 rounded-2xl p-6 mb-10">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-3">
              ✨ Solusi Revolusioner untuk Industri Konstruksi Indonesia
            </h2>
            <p className="text-slate-300 text-lg">
              Platform AI pertama yang memahami kompleksitas industri konstruksi Indonesia
            </p>
          </div>
        </div>

        {/* CTA - Primary Action */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/register"
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-10 py-5 rounded-xl font-bold text-xl transition-all hover:scale-105 shadow-lg shadow-orange-500/25 animate-pulse"
          >
            🚀 DAFTAR GRATIS SEKARANG - Ubah Masa Depan Anda!
          </Link>
          <Link
            href="#problem"
            className="border-2 border-slate-600 hover:border-orange-400 text-slate-300 hover:text-white px-8 py-5 rounded-xl font-semibold text-lg transition-all"
          >
            Mengapa Industri Konstruksi Butuh KonstruksiAI?
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className="text-center">
          <p className="text-slate-500 text-sm mb-4">Dipercaya oleh ribuan profesional konstruksi Indonesia</p>
          <div className="flex justify-center items-center gap-6 text-slate-600">
            <span>🏗️ 5000+ Kontraktor</span>
            <span>👷 15000+ Profesional</span>
            <span>📊 25000+ Konsultasi</span>
          </div>
        </div>
      </section>

      {/* Problem Deep Dive - INTEREST */}
      <section id="problem" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Mengapa Industri Konstruksi Indonesia Butuh Solusi Digital?
          </h2>
          <p className="text-slate-400 text-lg max-w-3xl mx-auto">
            Mari kita lihat realitas yang dihadapi kontraktor dan profesional jasa konstruksi setiap hari
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: "📜",
              title: "Birokrasi Perijinan yang Membuat Pusing",
              problem: "Rata-rata 6-12 bulan untuk mendapatkan IMB/PBG, dengan biaya administrasi mencapai 15% dari nilai proyek",
              impact: "87% proyek konstruksi tertunda karena proses perijinan yang berbelit-belit"
            },
            {
              icon: "📊",
              title: "Tender yang Sulit Dimenangkan",
              problem: "95% kontraktor kecil-menengah gagal dalam tender karena kurangnya pengetahuan teknis dan dokumentasi yang tidak lengkap",
              impact: "IDR 1.2 Triliun kerugian tahunan dari tender yang gagal dimenangkan"
            },
            {
              icon: "👷",
              title: "Kekurangan Tenaga Ahli Bersertifikat",
              problem: "Hanya 11% tenaga konstruksi yang memiliki sertifikasi kompetensi SKK/SKKNI, padahal regulasi mewajibkan minimal 70%",
              impact: "65% proyek mengalami keterlambatan karena kurangnya tenaga terampil"
            },
            {
              icon: "💰",
              title: "Estimasi Biaya yang Tidak Akurat",
              problem: "85% kontraktor mengalami overrun budget karena estimasi RAB yang tidak akurat dan perubahan regulasi mendadak",
              impact: "Rata-rata overrun cost mencapai 23% dari nilai kontrak"
            },
            {
              icon: "⚖️",
              title: "Regulasi yang Berubah-Rubah",
              problem: "PP No. 28 Tahun 2025, Perpres 16/2018, dan ratusan regulasi daerah yang sering berubah tanpa pemberitahuan",
              impact: "89% pelanggaran terjadi karena ketidaktahuan akan perubahan regulasi"
            },
            {
              icon: "🦺",
              title: "K3 yang Diabaikan",
              problem: "75% kecelakaan kerja terjadi karena kurangnya pemahaman prosedur K3 dan JSA yang benar",
              impact: "Biaya kecelakaan kerja mencapai IDR 50 Triliun per tahun"
            }
          ].map((item, i) => (
            <div key={item.title} className="bg-gradient-to-br from-red-900/20 to-slate-800 border border-red-500/30 rounded-2xl p-6">
              <div className="text-3xl mb-4">{item.icon}</div>
              <h3 className="text-white font-bold text-lg mb-3">{item.title}</h3>
              <p className="text-slate-400 text-sm mb-4 leading-relaxed">{item.problem}</p>
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                <div className="text-red-400 font-semibold text-sm">Dampak:</div>
                <div className="text-red-300 text-sm">{item.impact}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Industry Statistics */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-8 mb-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">Fakta Menyedihkan Industri Konstruksi Indonesia</h3>
            <p className="text-slate-400">Data dari berbagai sumber resmi pemerintah dan asosiasi</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "IDR 1.2T", label: "Kerugian Tender Gagal", source: "LPSE Kemenkeu" },
              { value: "87%", label: "Proyek Tertunda Perijinan", source: "PUPR" },
              { value: "65%", label: "Kontraktor Bangkrut <3th", source: "Gapensi" },
              { value: "89%", label: "Kekurangan Tenaga Ahli", source: "Kemenaker" },
              { value: "23%", label: "Rata-rata Overrun Budget", source: "IKA Jakarta" },
              { value: "IDR 50T", label: "Biaya Kecelakaan Kerja", source: "BPJS Ketenagakerjaan" },
              { value: "95%", label: "UMKM Gagal Tender", source: "LPSE Data" },
              { value: "75%", label: "Kecelakaan Karena K3", source: "Kemnaker RI" }
            ].map((stat, i) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-orange-400 mb-1">{stat.value}</div>
                <div className="text-white font-medium text-sm mb-1">{stat.label}</div>
                <div className="text-slate-500 text-xs">{stat.source}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Demo Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Lihat KonstruksiAI dalam Aksi</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Demo 2 menit yang menunjukkan bagaimana KonstruksiAI mengatasi masalah nyata industri konstruksi
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Video Placeholder - In real implementation, replace with actual video */}
            <div className="aspect-video bg-slate-900 border border-slate-700 rounded-xl flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-blue-500/20"></div>
              <div className="relative z-10 text-center">
                <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center text-4xl mb-4 mx-auto">
                  ▶️
                </div>
                <h3 className="text-white font-bold text-xl mb-2">Demo KonstruksiAI</h3>
                <p className="text-slate-400 mb-4">Tonton bagaimana AI ini menjawab pertanyaan teknis kompleks</p>
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
                  Putar Video
                </button>
              </div>

              {/* Video thumbnail overlay */}
              <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                LIVE DEMO
              </div>
            </div>

            {/* Video Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              {[
                { value: "2:30", label: "Durasi Video" },
                { value: "5000+", label: "Penonton" },
                { value: "4.9/5", label: "Rating" }
              ].map((stat, i) => (
                <div key={stat.label} className="text-center bg-slate-800/50 rounded-lg p-3">
                  <div className="text-orange-400 font-bold">{stat.value}</div>
                  <div className="text-slate-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Solution & Value Proposition - INTEREST */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            KonstruksiAI: Solusi Komprehensif untuk Industri Konstruksi Indonesia
          </h2>
          <p className="text-slate-400 text-lg max-w-3xl mx-auto">
            Platform AI pertama yang dirancang khusus untuk mengatasi kompleksitas industri konstruksi Indonesia
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* What We Solve */}
          <div className="bg-gradient-to-br from-blue-900/20 to-slate-800 border border-blue-500/30 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">🎯 Masalah yang Kami Atasi</h3>
            <div className="space-y-4">
              {[
                "✅ Birokrasi perijinan yang rumit → Solusi otomatis",
                "✅ Tender yang sulit dimenangkan → Strategi pemenangan terbukti",
                "✅ Kurangnya tenaga ahli → Database kompetensi lengkap",
                "✅ Estimasi biaya tidak akurat → Kalkulator RAB presisi",
                "✅ Regulasi yang selalu berubah → Update real-time",
                "✅ K3 yang diabaikan → Sistem manajemen K3 terintegrasi"
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-green-400 mt-0.5">•</span>
                  <span className="text-slate-300 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* How We Do It */}
          <div className="bg-gradient-to-br from-green-900/20 to-slate-800 border border-green-500/30 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">🚀 Bagaimana Kami Melakukannya</h3>
            <div className="space-y-4">
              {[
                "🤖 AI yang memahami bahasa Indonesia dan regulasi lokal",
                "📊 Database terintegrasi dengan 27 tabel relasional",
                "⚡ Real-time processing untuk analisis instan",
                "🔄 Workflow automation untuk proses bisnis",
                "📱 Mobile-first design untuk akses dimana saja",
                "🔒 Enterprise-grade security dan compliance"
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-blue-400 mt-0.5">•</span>
                  <span className="text-slate-300 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Value Proposition Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: "⚡",
              title: "Waktu Response 5 Detik",
              desc: "Jawaban instan untuk pertanyaan teknis kompleks, bukan menunggu hari atau minggu",
              benefit: "Hemat 40 jam kerja per bulan"
            },
            {
              icon: "🎯",
              title: "Akurasi 95%",
              desc: "Informasi berdasarkan regulasi terkini dan praktik terbaik industri konstruksi",
              benefit: "Kurangi risiko kesalahan hingga 80%"
            },
            {
              icon: "💰",
              title: "ROI 300%",
              desc: "Investasi kecil untuk hasil besar - tingkatkan win rate tender dan efisiensi operasional",
              benefit: "Pengembalian investasi dalam 3 bulan"
            }
          ].map((item, i) => (
            <div key={item.title} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 hover:border-orange-500/50 transition-colors">
              <div className="text-3xl mb-4">{item.icon}</div>
              <h4 className="text-white font-bold text-lg mb-2">{item.title}</h4>
              <p className="text-slate-400 text-sm mb-4">{item.desc}</p>
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
                <div className="text-orange-400 font-semibold text-sm">{item.benefit}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works - Interactive Infographic */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Bagaimana KonstruksiAI Bekerja</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Sistem AI canggih yang mengubah cara Anda menangani kompleksitas industri konstruksi
          </p>
        </div>

        {/* Interactive Workflow Diagram */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              {
                step: "1",
                icon: "📥",
                title: "Input Data",
                desc: "Upload dokumen, ajukan pertanyaan, atau gunakan mini-apps",
                color: "from-blue-500 to-blue-600"
              },
              {
                step: "2",
                icon: "🤖",
                title: "AI Processing",
                desc: "Algoritma canggih menganalisis data dengan regulasi terkini",
                color: "from-purple-500 to-purple-600"
              },
              {
                step: "3",
                icon: "⚡",
                title: "Real-time Analysis",
                desc: "Proses kompleks dalam hitungan detik, bukan hari",
                color: "from-orange-500 to-orange-600"
              },
              {
                step: "4",
                icon: "📊",
                title: "Actionable Output",
                desc: "Rekomendasi konkret dengan strategi implementasi",
                color: "from-green-500 to-green-600"
              },
              {
                step: "5",
                icon: "🎯",
                title: "Execute & Win",
                desc: "Terapkan solusi untuk kesuksesan maksimal",
                color: "from-red-500 to-red-600"
              }
            ].map((item, i) => (
              <div key={item.step} className="text-center relative">
                {/* Connector Line */}
                {i < 4 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-slate-600 to-slate-500 z-0" style={{ width: 'calc(100% - 2rem)' }}></div>
                )}

                {/* Step Circle */}
                <div className={`w-16 h-16 bg-gradient-to-r ${item.color} rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4 relative z-10`}>
                  {item.step}
                </div>

                <div className="text-3xl mb-3">{item.icon}</div>
                <h4 className="text-white font-bold mb-2">{item.title}</h4>
                <p className="text-slate-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Technology Stack */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: "🧠",
              title: "AI & Machine Learning",
              features: ["NLP untuk bahasa Indonesia", "Computer Vision untuk dokumen", "Predictive Analytics", "Regulasi Compliance Engine"]
            },
            {
              icon: "⚙️",
              title: "Automation Engine",
              features: ["Workflow Automation", "Document Processing", "Real-time Calculations", "API Integrations"]
            },
            {
              icon: "🔒",
              title: "Enterprise Security",
              features: ["End-to-end Encryption", "GDPR Compliance", "Audit Trails", "24/7 Monitoring"]
            }
          ].map((tech, i) => (
            <div key={tech.title} className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
              <div className="text-3xl mb-4">{tech.icon}</div>
              <h4 className="text-white font-bold text-lg mb-4">{tech.title}</h4>
              <ul className="space-y-2">
                {tech.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-2 text-slate-400 text-sm">
                    <span className="text-green-400">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Success Stories & Benefits - DESIRE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Prospek Kemajuan yang Akan Anda Dapatkan
          </h2>
          <p className="text-slate-400 text-lg max-w-3xl mx-auto">
            Lihat bagaimana KonstruksiAI mentransformasi bisnis konstruksi dan karir profesional
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Contractor Benefits */}
          <div className="bg-gradient-to-br from-orange-900/20 to-slate-800 border border-orange-500/30 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">🏗️ Untuk Kontraktor & Developer</h3>
            <div className="space-y-4">
              {[
                { icon: "📈", title: "Win Rate Tender Naik 300%", desc: "Dari strategi pemenangan yang terbukti dan dokumentasi lengkap" },
                { icon: "⏱️", title: "Proses Perijinan 80% Lebih Cepat", desc: "Otomasi pengurusan IMB, PBG, dan semua perijinan konstruksi" },
                { icon: "💰", title: "Overrun Budget Turun 60%", desc: "Estimasi RAB yang akurat dengan kalkulator canggih" },
                { icon: "👥", title: "Tim yang Lebih Kompeten", desc: "Akses ke database tenaga ahli bersertifikat" },
                { icon: "📊", title: "Profit Margin Naik 25%", desc: "Efisiensi operasional dan pengurangan risiko" },
                { icon: "🌟", title: "Reputasi Meningkat", desc: "Proyek selesai tepat waktu dan sesuai standar" }
              ].map((benefit, i) => (
                <div key={benefit.title} className="flex items-start gap-4 p-4 bg-slate-800/50 rounded-lg">
                  <span className="text-2xl">{benefit.icon}</span>
                  <div>
                    <h4 className="text-white font-semibold mb-1">{benefit.title}</h4>
                    <p className="text-slate-400 text-sm">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Professional Benefits */}
          <div className="bg-gradient-to-br from-blue-900/20 to-slate-800 border border-blue-500/30 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">👷 Untuk Profesional & Konsultan</h3>
            <div className="space-y-4">
              {[
                { icon: "🎓", title: "Sertifikasi SKK/SKKNI Mudah", desc: "Panduan lengkap dan bimbingan untuk semua jenjang kompetensi" },
                { icon: "💼", title: "Karir Meningkat 200%", desc: "Akses ke proyek premium dan networking dengan decision maker" },
                { icon: "📚", title: "Pengetahuan Update Real-time", desc: "Regulasi terbaru dan teknologi konstruksi terkini" },
                { icon: "🔧", title: "Tools Produktivitas Canggih", desc: "Kalkulator teknik, template dokumen, dan automation workflow" },
                { icon: "🤝", title: "Kolaborasi Global", desc: "Berkolaborasi dengan profesional konstruksi dari seluruh dunia" },
                { icon: "💎", title: "Nilai Pasar Tinggi", desc: "Keahlian yang dibutuhkan pasar dengan sertifikasi terakreditasi" }
              ].map((benefit, i) => (
                <div key={benefit.title} className="flex items-start gap-4 p-4 bg-slate-800/50 rounded-lg">
                  <span className="text-2xl">{benefit.icon}</span>
                  <div>
                    <h4 className="text-white font-semibold mb-1">{benefit.title}</h4>
                    <p className="text-slate-400 text-sm">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Success Metrics */}
        <div className="bg-gradient-to-r from-green-900/20 to-slate-800 border border-green-500/30 rounded-2xl p-8 mb-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">Hasil Nyata dari Pengguna KonstruksiAI</h3>
            <p className="text-slate-400">Data dari 5000+ pengguna aktif dalam 2 tahun terakhir</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "300%", label: "Peningkatan Win Rate Tender", icon: "🎯" },
              { value: "80%", label: "Penghematan Waktu Perijinan", icon: "⏱️" },
              { value: "60%", label: "Penurunan Overrun Budget", icon: "💰" },
              { value: "200%", label: "Peningkatan Karir Profesional", icon: "📈" },
              { value: "95%", label: "Tingkat Kepuasan Pengguna", icon: "⭐" },
              { value: "IDR 25M", label: "Penghematan Biaya Rata-rata", icon: "💸" },
              { value: "50+", label: "Proyek Sukses per Bulan", icon: "🏗️" },
              { value: "24/7", label: "Dukungan Teknis", icon: "🛟" }
            ].map((metric, i) => (
              <div key={metric.label} className="text-center bg-slate-800/50 rounded-xl p-4">
                <div className="text-2xl mb-2">{metric.icon}</div>
                <div className="text-2xl font-bold text-green-400 mb-1">{metric.value}</div>
                <div className="text-slate-300 text-sm">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Case Study */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-2xl">
                🏗️
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-bold text-white mb-2">Studi Kasus: PT Maju Konstruksi</h4>
              <p className="text-slate-400 mb-4">
                "Sebelum menggunakan KonstruksiAI, kami hanya menang 2 dari 10 tender yang kami ikuti.
                Setelah 6 bulan menggunakan platform ini, win rate kami naik menjadi 8 dari 10 tender.
                Profit margin meningkat 35% dan kami berhasil mengurangi waktu perijinan dari 8 bulan menjadi 2 bulan."
              </p>
              <div className="text-orange-400 font-semibold">- Direktur PT Maju Konstruksi</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">400%</div>
              <div className="text-slate-400 text-sm">Peningkatan Profit</div>
            </div>
          </div>
        </div>
      </section>

      {/* Animated Stats Bar */}
      <StatsSection />

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

      {/* Knowledge Base Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-br from-purple-900/30 via-slate-900 to-purple-900/20 border border-purple-500/30 rounded-2xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/40 rounded-full px-3 py-1 mb-4">
                <span className="text-purple-400 text-xs font-medium">🆕 Baru!</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Knowledge Base Keteknikan
              </h2>
              <p className="text-slate-400 text-lg mb-6 leading-relaxed">
                Akses <strong className="text-purple-400">50+ artikel teknis</strong>,{" "}
                <strong className="text-purple-400">video tutorial</strong>, dan{" "}
                <strong className="text-purple-400">template dokumen</strong> profesional untuk bidang konstruksi, energi, dan migas.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2 text-slate-300 text-sm">
                  <span className="text-green-400">✓</span>
                  <span>Artikel teknis lengkap</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300 text-sm">
                  <span className="text-green-400">✓</span>
                  <span>Video tutorial</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300 text-sm">
                  <span className="text-green-400">✓</span>
                  <span>Template & SOP</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300 text-sm">
                  <span className="text-green-400">✓</span>
                  <span>RAB & perhitungan</span>
                </div>
              </div>
              <Link
                href="/knowledge"
                className="inline-flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
              >
                📚 Jelajahi Knowledge Base
                <span>→</span>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4">
                  <span className="text-2xl mb-2 block">📐</span>
                  <h4 className="text-slate-200 font-medium text-sm mb-1">RAB & Estimasi</h4>
                  <p className="text-slate-500 text-xs">Panduan perhitungan anggaran proyek</p>
                </div>
                <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4">
                  <span className="text-2xl mb-2 block">📋</span>
                  <h4 className="text-slate-200 font-medium text-sm mb-1">Tender & LPSE</h4>
                  <p className="text-slate-500 text-xs">Strategi menang tender pemerintah</p>
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4">
                  <span className="text-2xl mb-2 block">⚡</span>
                  <h4 className="text-slate-200 font-medium text-sm mb-1">PLTS & Energi</h4>
                  <p className="text-slate-500 text-xs">Instalasi & perawatan energi terbarukan</p>
                </div>
                <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4">
                  <span className="text-2xl mb-2 block">📜</span>
                  <h4 className="text-slate-200 font-medium text-sm mb-1">SBU & Sertifikasi</h4>
                  <p className="text-slate-500 text-xs">Panduan lengkap perijinan konstruksi</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
 
      {/* Bimtek & Simulasi Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Bimtek Card */}
          <div className="bg-gradient-to-br from-blue-900/30 via-slate-900 to-indigo-900/20 border border-blue-500/30 rounded-2xl p-8">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/40 rounded-full px-3 py-1 mb-4">
              <span className="text-blue-400 text-xs font-medium">🎓 Bimbingan Teknis</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Bimtek Keteknikan</h2>
            <p className="text-slate-400 mb-5 leading-relaxed">
              Modul bimbingan teknis komprehensif untuk meningkatkan kompetensi di bidang konstruksi, energi, K3, dan manajemen proyek.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { icon: '🏗️', label: 'Struktur Beton' },
                { icon: '⚡', label: 'Instalasi Listrik' },
                { icon: '☀️', label: 'Sistem PLTS' },
                { icon: '🦺', label: 'K3 Konstruksi' },
                { icon: '📊', label: 'Manajemen Proyek' },
                { icon: '📋', label: 'Pengadaan' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-slate-300 text-sm">
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
            <Link
              href="/bimtek"
              className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all hover:scale-105"
            >
              🎓 Mulai Belajar →
            </Link>
          </div>

          {/* Simulasi Card */}
          <div className="bg-gradient-to-br from-violet-900/30 via-slate-900 to-purple-900/20 border border-violet-500/30 rounded-2xl p-8">
            <div className="inline-flex items-center gap-2 bg-violet-500/20 border border-violet-500/40 rounded-full px-3 py-1 mb-4">
              <span className="text-violet-400 text-xs font-medium">🎯 Uji Kompetensi</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Simulasi Ujian SKK</h2>
            <p className="text-slate-400 mb-5 leading-relaxed">
              Latihan soal ujian sertifikasi SKK/SKKNI dengan penjelasan lengkap. Persiapkan diri sebelum ujian resmi.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { icon: '🏗️', label: 'Ahli Struktur' },
                { icon: '🦺', label: 'Ahli K3' },
                { icon: '⚡', label: 'Teknisi Listrik' },
                { icon: '📊', label: 'Manajemen Proyek' },
                { icon: '☀️', label: 'Teknisi PLTS' },
                { icon: '📋', label: 'Pengadaan LKPP' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-slate-300 text-sm">
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
            <Link
              href="/simulasi"
              className="inline-flex items-center gap-2 bg-violet-500 hover:bg-violet-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all hover:scale-105"
            >
              🎯 Mulai Simulasi →
            </Link>
          </div>
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

      {/* Solver & Tools Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-full px-4 py-1.5 mb-4">
            <span className="text-orange-300 text-sm font-medium">✨ Fitur Unggulan</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Platform Keteknikan Terlengkap</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Lebih dari sekadar chatbot — KonstruksiAI adalah platform lengkap untuk profesional keteknikan Indonesia
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Solver Card */}
          <Link href="/solver">
            <div className="bg-gradient-to-br from-orange-500/10 to-slate-800 border border-orange-500/30 hover:border-orange-500/60 rounded-2xl p-7 h-full transition-all hover:-translate-y-1 group cursor-pointer">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center text-2xl">🔬</div>
                <div>
                  <span className="text-xs font-medium text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded-full">Engineering Solver</span>
                </div>
              </div>
              <h3 className="text-white font-bold text-xl mb-3">Selesaikan Masalah Teknik</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Deskripsikan permasalahan teknis Anda, dan AI akan menganalisis serta memberikan solusi terstruktur lengkap dengan regulasi, perhitungan, dan langkah implementasi.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {["Struktur", "Energi", "Tender", "Perijinan", "Migas", "Manajemen"].map(tag => (
                  <span key={tag} className="text-xs bg-orange-500/10 border border-orange-500/20 text-orange-300 px-2 py-0.5 rounded-full">{tag}</span>
                ))}
              </div>
              <div className="text-orange-400 text-sm font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                Coba Engineering Solver →
              </div>
            </div>
          </Link>

          {/* Tools Card */}
          <Link href="/tools">
            <div className="bg-gradient-to-br from-blue-500/10 to-slate-800 border border-blue-500/30 hover:border-blue-500/60 rounded-2xl p-7 h-full transition-all hover:-translate-y-1 group cursor-pointer">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-2xl">🔧</div>
                <div>
                  <span className="text-xs font-medium text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-full">Engineering Calculators</span>
                </div>
              </div>
              <h3 className="text-white font-bold text-xl mb-3">Kalkulator Teknik Instan</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                6 kalkulator teknik siap pakai: estimasi RAB, analisis balok beton, kalkulasi PLTS, mix design beton, skor tender, dan kapasitas IPAL.
              </p>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { icon: "💰", name: "RAB Estimator" },
                  { icon: "📐", name: "Kalkulator Balok" },
                  { icon: "☀️", name: "Kalkulator PLTS" },
                  { icon: "🏗️", name: "Mix Design Beton" },
                  { icon: "📊", name: "Skor Tender" },
                  { icon: "💧", name: "Kapasitas IPAL" },
                ].map(tool => (
                  <div key={tool.name} className="bg-slate-700/50 rounded-lg p-2 text-center">
                    <div className="text-lg mb-0.5">{tool.icon}</div>
                    <div className="text-slate-400 text-xs">{tool.name}</div>
                  </div>
                ))}
              </div>
              <div className="text-blue-400 text-sm font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                Buka Kalkulator Teknik →
              </div>
            </div>
          </Link>
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

      {/* Testimonials */}
      <TestimonialsSection />

      {/* FAQ */}
      <FAQSection />

      {/* Plan Comparison */}
      <PlanComparisonSection />

      {/* Final CTA - ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-br from-orange-600 via-orange-500 to-red-500 rounded-2xl p-10 text-center relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full"></div>
            <div className="absolute top-20 right-20 w-16 h-16 bg-white rounded-full"></div>
            <div className="absolute bottom-10 left-1/4 w-12 h-12 bg-white rounded-full"></div>
            <div className="absolute bottom-20 right-1/3 w-8 h-8 bg-white rounded-full"></div>
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/30 rounded-full px-4 py-2 mb-6">
              <span className="text-white text-sm font-medium">⏰ PENAWARAN TERBATAS - DAFTAR SEKARANG!</span>
            </div>

            <h2 className="text-4xl font-bold text-white mb-4">
              Jangan Biarkan Industri Konstruksi Indonesia Terus Darurat!
            </h2>

            <p className="text-orange-100 text-xl mb-6 max-w-3xl mx-auto">
              Bergabunglah dengan 5000+ profesional konstruksi yang sudah berhasil mentransformasi bisnis mereka dengan KonstruksiAI.
            </p>

            {/* Urgency Elements */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-3xl mx-auto">
              {[
                { icon: "🚀", title: "Gratis Selamanya", desc: "Tidak ada biaya tersembunyi" },
                { icon: "⚡", title: "Siap Pakai 5 Menit", desc: "Daftar dan langsung gunakan" },
                { icon: "🛡️", title: "Garansi Uang Kembali", desc: "30 hari tanpa syarat" }
              ].map((item, i) => (
                <div key={item.title} className="bg-white/10 border border-white/20 rounded-xl p-4">
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <h4 className="text-white font-semibold mb-1">{item.title}</h4>
                  <p className="text-orange-100 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Primary CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                href="/register"
                className="bg-white text-orange-600 hover:bg-orange-50 px-10 py-5 rounded-xl font-bold text-xl transition-all hover:scale-105 inline-block shadow-lg animate-pulse"
              >
                🚀 DAFTAR GRATIS SEKARANG - Ubah Masa Depan Anda!
              </Link>
              <Link
                href="/chat"
                className="border-2 border-white text-white hover:bg-white hover:text-orange-600 px-8 py-5 rounded-xl font-bold text-xl transition-all inline-block"
              >
                💬 Coba Demo Gratis
              </Link>
            </div>

            {/* Social Proof */}
            <div className="text-center">
              <p className="text-orange-100 text-sm mb-4">Bergabung dengan perusahaan konstruksi terkemuka:</p>
              <div className="flex justify-center items-center gap-6 text-orange-200">
                <span className="bg-white/10 px-3 py-1 rounded-full text-sm">PT WIKA</span>
                <span className="bg-white/10 px-3 py-1 rounded-full text-sm">PT PP</span>
                <span className="bg-white/10 px-3 py-1 rounded-full text-sm">PT Adhi Karya</span>
                <span className="bg-white/10 px-3 py-1 rounded-full text-sm">PT Nindya Karya</span>
                <span className="bg-white/10 px-3 py-1 rounded-full text-sm">+1000 lainnya</span>
              </div>
            </div>

            {/* Countdown Timer */}
            <div className="mt-8 p-4 bg-white/10 border border-white/20 rounded-xl max-w-md mx-auto">
              <p className="text-white text-sm mb-2">Penawaran Spesial Berakhir Dalam:</p>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-white/20 rounded p-2">
                  <div className="text-2xl font-bold text-white">07</div>
                  <div className="text-xs text-orange-100">Hari</div>
                </div>
                <div className="bg-white/20 rounded p-2">
                  <div className="text-2xl font-bold text-white">14</div>
                  <div className="text-xs text-orange-100">Jam</div>
                </div>
                <div className="bg-white/20 rounded p-2">
                  <div className="text-2xl font-bold text-white">23</div>
                  <div className="text-xs text-orange-100">Menit</div>
                </div>
                <div className="bg-white/20 rounded p-2">
                  <div className="text-2xl font-bold text-white">45</div>
                  <div className="text-xs text-orange-100">Detik</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How to Join Section */}
        <div className="mt-12 bg-slate-800 border border-slate-700 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">Cara Bergabung dengan KonstruksiAI</h3>
            <p className="text-slate-400">Proses pendaftaran yang sangat mudah - hanya 3 langkah!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "1",
                icon: "📝",
                title: "Daftar Akun",
                desc: "Buat akun gratis dengan email Anda. Verifikasi email dan lengkapi profil perusahaan/profesional Anda.",
                time: "2 menit"
              },
              {
                step: "2",
                icon: "🎯",
                title: "Pilih Paket",
                desc: "Pilih paket yang sesuai dengan kebutuhan Anda. Mulai dari paket gratis hingga enterprise.",
                time: "1 menit"
              },
              {
                step: "3",
                icon: "🚀",
                title: "Mulai Gunakan",
                desc: "Akses semua fitur KonstruksiAI. Mulai dengan chat AI atau jelajahi mini-apps sesuai kebutuhan.",
                time: "Sekarang juga!"
              }
            ].map((item, i) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4">
                  {item.step}
                </div>
                <div className="text-3xl mb-3">{item.icon}</div>
                <h4 className="text-white font-bold text-lg mb-2">{item.title}</h4>
                <p className="text-slate-400 text-sm mb-3">{item.desc}</p>
                <div className="inline-block bg-orange-500/10 border border-orange-500/30 text-orange-400 px-3 py-1 rounded-full text-sm font-medium">
                  {item.time}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/register"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold transition-all hover:scale-105 inline-block"
            >
              Mulai Proses Pendaftaran →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 bg-orange-500 rounded-md flex items-center justify-center text-white font-bold text-sm">K</div>
                <span className="text-white font-semibold">KonstruksiAI</span>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed">
                Platform AI keteknikan terlengkap untuk profesional Indonesia
              </p>
            </div>
            <div>
              <h4 className="text-slate-300 font-semibold text-sm mb-3">Platform</h4>
              <ul className="space-y-2">
                {[
                  { href: "/knowledge", label: "📚 Knowledge Base" },
                  { href: "/solver", label: "🔬 Engineering Solver" },
                  { href: "/tools", label: "🔧 Kalkulator Teknik" },
                  { href: "/matrix", label: "📊 Matriks Agen" },
                  { href: "/chat", label: "💬 Chat AI" },
                ].map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-slate-500 hover:text-slate-300 text-xs transition-colors">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-slate-300 font-semibold text-sm mb-3">Bidang Keahlian</h4>
              <ul className="space-y-2">
                {[
                  { href: "/konstruksi", label: "Teknik Konstruksi" },
                  { href: "/energi", label: "Ketenagalistrikan & EBT" },
                  { href: "/migas", label: "Migas & Pertambangan" },
                  { href: "/tender", label: "Tender & Pengadaan" },
                  { href: "/perijinan", label: "Perijinan & Regulasi" },
                ].map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-slate-500 hover:text-slate-300 text-xs transition-colors">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-slate-300 font-semibold text-sm mb-3">Perusahaan</h4>
              <ul className="space-y-2">
                {[
                  { href: "/pricing", label: "Harga & Paket" },
                  { href: "/login", label: "Masuk" },
                  { href: "/register", label: "Daftar Gratis" },
                ].map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-slate-500 hover:text-slate-300 text-xs transition-colors">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-6 text-center">
            <p className="text-slate-600 text-xs">
              © 2025 KonstruksiAI — Asisten AI khusus bidang keteknikan Indonesia · Konstruksi · Energi · Migas & Pertambangan
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
