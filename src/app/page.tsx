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

        {/* Stats hero */}
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
