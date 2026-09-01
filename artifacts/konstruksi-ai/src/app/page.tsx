"use client";

import { useEffect, useState } from "react";
import Link from "@/shims/next-link";
import NavbarAuth from "@/components/NavbarAuth";
import {
  Award,
  BarChart3,
  BadgeCheck,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  ClipboardCheck,
  FlaskConical,
  GraduationCap,
  Link2,
  MessageCircle,
  Radar,
  RefreshCw,
  Scale,
  Settings2,
  ShieldCheck,
  Target,
  TrendingUp,
  UsersRound,
  Wrench,
} from "lucide-react";

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
    icon: "🧭",
    title: "Ruang Proyek",
    description: "Satu alur kerja dari kesiapan tender, perencanaan, pelaksanaan, monitoring, hingga serah terima.",
    href: "/ruang-proyek",
    badge: "Workspace",
  },
  {
    icon: "📋",
    title: "Tender & Pengadaan",
    description: "Panduan untuk meninjau dokumen tender, estimasi biaya, penawaran, dan kelengkapan kualifikasi.",
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
    description: "Rujukan awal untuk SBU, SKK, IUJK, IMB/PBG, sertifikasi profesi, dan regulasi terkait.",
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
  { value: "Terarah", label: "Panduan berdasarkan kebutuhan kerja", detail: "Mulai dari tender hingga kepatuhan." },
  { value: "Terhubung", label: "Ruang kerja lintas fungsi", detail: "Fitur disusun untuk alur proyek." },
  { value: "Telusuri", label: "Referensi dan update industri", detail: "Selalu cek sumber asli sebelum mengambil keputusan." },
  { value: "Praktis", label: "Bantuan untuk pekerjaan harian", detail: "Dibuat agar langkah berikutnya lebih jelas." },
];

const FAQ_ITEMS = [
  {
    q: "Apakah KonstruksiAI bisa membantu menyusun RAB proyek?",
    a: "KonstruksiAI menyediakan kalkulator estimasi awal dan bantuan AI untuk meninjau asumsi RAB. Hasilnya perlu diperiksa kembali terhadap gambar, volume, harga satuan, lokasi, dan ketentuan proyek oleh tenaga profesional.",
  },
  {
    q: "Apakah informasi regulasi yang diberikan selalu terbaru?",
    a: "Tidak selalu. Radar dan jawaban AI membantu menemukan rujukan yang tersedia, tetapi tanggal, status berlaku, dan isi regulasi harus tetap diperiksa pada sumber resmi sebelum digunakan untuk keputusan penting.",
  },
  {
    q: "Bisakah KonstruksiAI membantu proses tender LPSE?",
    a: "KonstruksiAI dapat membantu meninjau dokumen, menyusun pertanyaan, membuat checklist, dan merapikan analisis tender. Keputusan penawaran dan kepatuhan tetap harus mengacu pada dokumen pemilihan serta evaluasi tim Anda.",
  },
  {
    q: "Apakah ada batasan jumlah pertanyaan yang bisa diajukan?",
    a: "Aplikasi tidak menampilkan kuota pertanyaan tetap. Ketersediaan jawaban AI tetap bergantung pada layanan yang sedang aktif. Pada paket Gratis, riwayat percakapan disimpan secara lokal di browser yang digunakan.",
  },
  {
    q: "Apakah KonstruksiAI bisa membuat dokumen K3 seperti JSA dan HIRARC?",
    a: "KonstruksiAI dapat membantu menyusun draf dan checklist K3 seperti JSA atau HIRARC. Dokumen akhir harus disesuaikan dengan bahaya, metode kerja, kondisi lapangan, dan persetujuan personel K3 yang berwenang.",
  },
  {
    q: "Bagaimana cara menggunakan fitur Matriks Ruang Lingkup?",
    a: "Buka halaman Matriks dari menu navigasi. Grid interaktifnya menghubungkan 21 fungsi bisnis dengan 10 bidang keteknikan. Pilih sel untuk menyiapkan pertanyaan lintas bidang lalu lanjutkan ke Chat AI.",
  },
];

const PLAN_FEATURES = [
  { feature: "Chat dengan 9 agen AI", free: true, pro: true },
  { feature: "6 kalkulator teknik", free: true, pro: true },
  { feature: "Solver dengan 6 domain", free: true, pro: true },
  { feature: "Riwayat percakapan lokal", free: true, pro: true },
  { feature: "Export percakapan (.md, .pdf, .docx)", free: true, pro: true },
  { feature: "Lampiran PDF/Word di chat", free: true, pro: true },
  { feature: "Matriks 21×10", free: true, pro: true },
  { feature: "Respons AI streaming", free: true, pro: true },
  { feature: "Riwayat cloud (sync)", free: false, pro: true },
  { feature: "Template dokumen premium", free: false, pro: true },
];

// ============================================================
// ANIMATED COUNTER HOOK
// ============================================================

function StatsSection() {
  return (
    <section className="bg-slate-950 border-y border-slate-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-xl font-bold text-orange-400">{stat.value}</div>
              <div className="text-slate-400 text-sm mt-1 font-medium">{stat.label}</div>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">{stat.detail}</p>
            </div>
          ))}
        </div>
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

function PlanComparisonSection({ billingConfigured }: { billingConfigured: boolean }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">Paket Layanan</h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          {billingConfigured
            ? "Paket Gratis dan Pro tersedia sekarang; upgrade Pro diproses melalui checkout."
            : "Paket Gratis aktif sekarang; checkout Pro belum tersedia."}
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-3 border-b border-slate-700">
            <div className="px-6 py-4 text-slate-400 text-sm font-medium">Fitur</div>
            <div className="px-6 py-4 text-center border-l border-slate-700">
              <div className="text-white font-bold">Gratis</div>
              <div className="text-slate-500 text-xs mt-0.5">Aktif sekarang</div>
            </div>
            <div className="px-6 py-4 text-center border-l border-slate-700 bg-orange-500/5">
              <div className="text-orange-400 font-bold">Pro</div>
              <div className="text-slate-500 text-xs mt-0.5">
                {billingConfigured ? "Checkout aktif" : "Belum tersedia"}
              </div>
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
              <Link
                href="/pricing"
                className="inline-block bg-orange-500/20 border border-orange-500/40 text-orange-400 text-xs px-4 py-1.5 rounded-lg hover:bg-orange-500/30 transition-colors"
              >
                Lihat Detail Paket
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// EXPANDABLE ACCORDION SECTION
// ============================================================

function ExpandableSection({
  id,
  icon,
  title,
  subtitle,
  children,
}: {
  id?: string;
  icon: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div id={id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-2xl px-6 py-4 transition-all text-left group"
      >
        <div className="flex items-center gap-4">
          <span className="text-xl">{icon}</span>
          <div>
            <span className="text-white font-semibold">{title}</span>
            {subtitle && (
              <p className="text-slate-500 text-sm mt-0.5 hidden sm:block">{subtitle}</p>
            )}
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-slate-400 group-hover:text-white flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="mt-4 pb-2">{children}</div>}
    </div>
  );
}

// ============================================================
// MAIN PAGE
// ============================================================

const learningNav = [
  { href: "/knowledge", label: "Knowledge", icon: BookOpen, tone: "text-violet-300" },
  { href: "/bimtek", label: "Bimtek", icon: GraduationCap, tone: "text-blue-300" },
  { href: "/simulasi", label: "Simulasi", icon: Target, tone: "text-fuchsia-300" },
];

const dailyInfoNav = [
  { href: "/ruang-proyek", label: "Ruang Proyek", icon: BriefcaseBusiness, tone: "text-orange-300" },
  { href: "/radar-konstruksi", label: "Update Terbaru", icon: Radar, tone: "text-cyan-300" },
  { href: "/tender", label: "Tender & Pengadaan", icon: ClipboardCheck, tone: "text-orange-300" },
  { href: "/tender-intelligence", label: "Tender Intelligence", icon: Radar, tone: "text-emerald-300" },
  { href: "/tender-eligibility", label: "Tender Eligibility", icon: ClipboardCheck, tone: "text-cyan-300" },
  { href: "/evidence-mapping", label: "Evidence Mapping", icon: Link2, tone: "text-purple-300" },
];

const bujkNav = [
  { href: "/solver", label: "Solver", icon: FlaskConical, tone: "text-orange-300" },
  { href: "/tools", label: "Tools", icon: Wrench, tone: "text-slate-300" },
  { href: "/matrix", label: "Matriks", icon: BarChart3, tone: "text-slate-300" },
  { href: "/workforce-assignment", label: "Workforce", icon: UsersRound, tone: "text-pink-300" },
  { href: "/certify", label: "Sertifikasi", icon: Award, tone: "text-emerald-300" },
  { href: "/legal-licensing", label: "Legal & Licensing", icon: Scale, tone: "text-blue-300" },
  { href: "/sbu-readiness", label: "SBU Readiness", icon: Building2, tone: "text-orange-300" },
  { href: "/skk-readiness", label: "SKK Readiness", icon: BadgeCheck, tone: "text-green-300" },
];

function HeaderNavItem({
  item,
}: {
  item: { href: string; label: string; icon: React.ElementType; tone: string };
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className="group inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-400 transition-all hover:bg-white/[0.06] hover:text-white"
    >
      <Icon className={`h-3.5 w-3.5 ${item.tone} transition-transform group-hover:-translate-y-0.5`} strokeWidth={2} />
      <span>{item.label}</span>
    </Link>
  );
}

export default function Home() {
  const [billingConfigured, setBillingConfigured] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/billing/config", { credentials: "include" })
      .then(async (response) => {
        if (!response.ok) throw new Error("billing config unavailable");
        return response.json() as Promise<{ configured?: boolean; checkoutAvailable?: boolean }>;
      })
      .then((config) => {
        if (active) {
          setBillingConfigured(
            config.configured === true
            && config.checkoutAvailable === true,
          );
        }
      })
      .catch(() => {
        if (active) setBillingConfigured(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-slate-950/90 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-[4.5rem] items-center justify-between gap-4">
            <Link href="/" className="group flex min-w-0 items-center gap-3" aria-label="KonstruksiAI beranda">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                   <span className="truncate text-2xl font-bold leading-none tracking-[0.01em] text-white sm:text-[1.6875rem]">KONSTRUKSI<span className="text-orange-400">AI</span></span>
                  <span className="hidden rounded-full border border-orange-400/25 bg-orange-400/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-orange-300 sm:inline-flex">
                    Beta
                  </span>
                </div>
                  <span className="flex items-center gap-1 whitespace-nowrap text-[11px] leading-tight tracking-[0.01em] text-slate-500 sm:gap-1.5 sm:text-[13px]">
                    <span className="inline-flex items-center gap-1 text-slate-400">
                      <BookOpen className="h-3 w-3 text-cyan-400/80 sm:h-3.5 sm:w-3.5" strokeWidth={2} />
                      <span>Learn</span>
                    </span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className="inline-flex items-center gap-1 text-slate-400">
                      <RefreshCw className="h-3 w-3 text-blue-400/80 sm:h-3.5 sm:w-3.5" strokeWidth={2} />
                      <span>Update</span>
                    </span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className="inline-flex items-center gap-1 text-slate-400">
                      <TrendingUp className="h-3 w-3 text-orange-400/80 sm:h-3.5 sm:w-3.5" strokeWidth={2} />
                      <span>Grow</span>
                    </span>
                  </span>
              </div>
            </Link>

            <div className="flex shrink-0 items-center gap-2 sm:gap-4">
              <div className="hidden items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-3 py-1.5 text-[10px] font-medium text-emerald-300 lg:flex">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                AI siap membantu
              </div>
              <Link
                href="/chat"
                className="hidden items-center gap-2 rounded-xl bg-orange-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition-all hover:-translate-y-0.5 hover:bg-orange-400 hover:shadow-orange-500/30 sm:inline-flex sm:px-4"
              >
                <MessageCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Mulai Chat</span>
                <span className="sm:hidden">Chat</span>
              </Link>
              <NavbarAuth />
            </div>
          </div>

          <div className="border-t border-white/[0.06]">
            <nav className="nav-scrollbar flex items-center gap-1 overflow-x-auto py-2" aria-label="Navigasi platform">
              <Link
                href="/chat"
                className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-orange-500/10 px-3 py-2 text-xs font-semibold text-orange-300 transition-colors hover:bg-orange-500/20 hover:text-orange-200 sm:hidden"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                Chat AI
              </Link>
              {learningNav.map((item) => <HeaderNavItem key={item.href} item={item} />)}
              <span className="mx-2 h-5 w-px shrink-0 bg-white/[0.08]" />
              <span className="mr-1 flex shrink-0 items-center gap-1.5 px-2 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500">
                <Radar className="h-3 w-3 text-cyan-400" />
                Radar Konstruksi
              </span>
              {dailyInfoNav.map((item) => <HeaderNavItem key={item.href} item={item} />)}
              <span className="mx-2 h-5 w-px shrink-0 bg-white/[0.08]" />
              <span className="mr-1 flex shrink-0 items-center gap-1.5 px-2 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500">
                <Building2 className="h-3 w-3 text-orange-400" />
                Aplikasi BUJK
              </span>
              {bujkNav.map((item) => <HeaderNavItem key={item.href} item={item} />)}
              <Link href="/pricing" className="ml-auto inline-flex shrink-0 items-center gap-2 rounded-lg border border-white/[0.08] px-3 py-2 text-xs font-semibold text-slate-300 transition-colors hover:border-orange-400/40 hover:bg-orange-400/10 hover:text-orange-200">
                <Settings2 className="h-3.5 w-3.5" />
                Harga
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section - ATTENTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        {/* Positioning */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-cyan-400/10 border border-cyan-400/30 rounded-full px-4 py-2 mb-6">
            <span className="text-cyan-300 text-sm font-semibold tracking-wide">● ASISTEN AI KHUSUS KETEKNIAN INDONESIA</span>
          </div>
        </div>

        {/* Contractor outcomes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 max-w-5xl mx-auto">
          {[
            { value: "RAB & Estimasi", label: "Tinjau asumsi biaya", desc: "Gunakan kalkulator dan panduan yang lebih terstruktur", href: "/tools", tone: "orange" },
            { value: "Tender & Dokumen", label: "Siapkan pekerjaan", desc: "Susun analisis, checklist, dan pertanyaan yang relevan", href: "/tender", tone: "cyan" },
            { value: "Legal & K3", label: "Jaga kepatuhan", desc: "Telusuri regulasi, sertifikasi, dan pengendalian risiko", href: "/legal-licensing", tone: "blue" },
          ].map((outcome) => (
            <Link
              key={outcome.value}
              href={outcome.href}
              className={`group rounded-2xl border p-5 text-left transition-all hover:-translate-y-1 ${
                outcome.tone === "orange"
                  ? "border-orange-400/30 bg-orange-400/[0.08] hover:border-orange-300/60"
                  : outcome.tone === "cyan"
                    ? "border-cyan-400/30 bg-cyan-400/[0.07] hover:border-cyan-300/60"
                    : "border-blue-400/30 bg-blue-400/[0.07] hover:border-blue-300/60"
              }`}
            >
              <div className={`mb-1 text-base font-bold ${
                outcome.tone === "orange" ? "text-orange-300" : outcome.tone === "cyan" ? "text-cyan-300" : "text-blue-300"
              }`}>
                {outcome.value}
              </div>
              <div className="mb-1 text-sm font-semibold text-white">{outcome.label}</div>
              <div className="text-xs leading-relaxed text-slate-400 group-hover:text-slate-300">{outcome.desc}</div>
              <div className="mt-3 text-xs font-semibold text-slate-300 group-hover:text-white">Buka alatnya →</div>
            </Link>
          ))}
        </div>

        {/* Outcome statement */}
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            RAB, tender, dan dokumen proyek
            <span className="text-orange-400 block">lebih terarah dengan AI</span>
          </h1>

          <p className="text-slate-300 text-lg sm:text-xl max-w-4xl mx-auto mb-6 leading-relaxed">
            KonstruksiAI membantu kontraktor, konsultan, dan tim proyek menyusun langkah kerja,
            meninjau asumsi, serta menemukan rujukan yang relevan untuk pekerjaan konstruksi Indonesia.
          </p>

          <p className="text-slate-400 text-base max-w-3xl mx-auto">
            Mulai dari pertanyaan sederhana, dokumen tender, atau kebutuhan teknis—lalu verifikasi
            rekomendasi terhadap dokumen dan sumber resmi sebelum mengambil keputusan.
          </p>
        </div>

        {/* Solution introduction */}
        <div className="bg-gradient-to-r from-orange-600/20 to-blue-600/20 border border-orange-500/30 rounded-2xl p-6 mb-10">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-3">
              Satu tempat untuk pekerjaan teknis yang perlu ditelusuri
            </h2>
            <p className="text-slate-300 text-lg">
              Chat AI, solver, kalkulator, Radar, dan ruang proyek dalam satu alur kerja.
            </p>
          </div>
        </div>

        {/* Promo Video - autoplay preview */}
        <div className="max-w-5xl mx-auto">
          <div
            className="relative w-full overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 shadow-2xl shadow-orange-500/10"
            style={{ aspectRatio: "16 / 9" }}
          >
            <iframe
              src="/konstruksi-promo-video/"
              className="absolute inset-0 h-full w-full"
              allow="autoplay"
              loading="eager"
              title="KonstruksiAI – Demo Video"
            />
          </div>
          <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="text-center text-sm text-slate-500 sm:text-left">
              ▶ Lihat bagaimana KonstruksiAI membantu profesional konstruksi Indonesia
            </p>
            <a
              href="/konstruksi-promo-video/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-orange-500/40 bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-400 transition-colors hover:border-orange-400 hover:bg-orange-500/20 hover:text-orange-300"
            >
              Watch full video
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* CTA - Primary Action */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/register"
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-10 py-5 rounded-xl font-bold text-xl transition-all hover:scale-105 shadow-lg shadow-orange-500/25"
          >
            Mulai Gratis →
          </Link>
          <Link
            href="#problem"
            className="border-2 border-slate-600 hover:border-orange-400 text-slate-300 hover:text-white px-8 py-5 rounded-xl font-semibold text-lg transition-all"
          >
            Lihat masalah yang bisa dirapikan
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className="text-center">
          <p className="text-slate-500 text-sm mb-4">Dirancang untuk mendampingi pekerjaan profesional konstruksi Indonesia</p>
          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-slate-500 text-sm">
            <span>✓ Paket Gratis aktif sekarang</span>
            <span>✓ Mulai tanpa kartu kredit</span>
            <span>✓ Verifikasi sumber tetap diutamakan</span>
          </div>
        </div>
      </section>

      {/* Problem Deep Dive - collapsible */}
      <ExpandableSection
        id="problem"
        icon="🚨"
        title="Tantangan Industri Konstruksi Indonesia"
        subtitle="Enam area kerja yang membutuhkan persiapan dan verifikasi"
      >
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: "📜",
              title: "Birokrasi Perijinan yang Membuat Pusing",
              problem: "Alur perizinan melibatkan dokumen, instansi, dan persyaratan yang perlu ditelusuri secara teliti.",
              impact: "Dampak: jadwal proyek dapat bergeser ketika persiapan dan verifikasi belum lengkap."
            },
            {
              icon: "📊",
              title: "Tender yang Sulit Dimenangkan",
              problem: "Persaingan tender menuntut kesiapan administrasi, teknis, harga, dan strategi yang konsisten.",
              impact: "Dampak: peluang dapat terlewat saat dokumen atau evaluasi internal belum siap."
            },
            {
              icon: "👷",
              title: "Kekurangan Tenaga Ahli Bersertifikat",
              problem: "Kesiapan kompetensi dan sertifikasi perlu direncanakan seiring perubahan kebutuhan proyek.",
              impact: "Dampak: penugasan dan kepatuhan proyek membutuhkan koordinasi lebih awal."
            },
            {
              icon: "💰",
              title: "Estimasi Biaya yang Tidak Akurat",
              problem: "Perubahan harga, volume, dan spesifikasi dapat membuat estimasi awal perlu ditinjau kembali.",
              impact: "Dampak: pengendalian biaya perlu didukung asumsi yang transparan dan pembaruan berkala."
            },
            {
              icon: "⚖️",
              title: "Regulasi yang Berubah-Rubah",
              problem: "Regulasi dan ketentuan teknis dapat berkembang; dokumen rujukan perlu diperiksa langsung ke sumber resmi.",
              impact: "Dampak: tim perlu membangun kebiasaan pemantauan dan verifikasi sebelum bertindak."
            },
            {
              icon: "🦺",
              title: "K3 yang Diabaikan",
              problem: "K3 yang tidak diterapkan secara konsisten meningkatkan risiko bagi pekerja dan keberlangsungan proyek.",
              impact: "Dampak: prosedur kerja, JSA, dan pengendalian risiko perlu menjadi bagian dari rutinitas lapangan."
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

        {/* Industry priorities */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-8 mb-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">Prioritas yang Perlu Dikelola</h3>
            <p className="text-slate-400">Analisis kualitatif ini membantu memetakan fokus kerja; keputusan penting tetap perlu mengacu pada sumber resmi.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "Dokumen", label: "Kesiapan tender", source: "Periksa kelengkapan dan kesesuaian persyaratan." },
              { value: "Izin", label: "Kepatuhan proyek", source: "Telusuri tahapan dan rujukan instansi terkait." },
              { value: "Tim", label: "Kompetensi kerja", source: "Rencanakan kebutuhan keahlian dan sertifikasi." },
              { value: "Biaya", label: "Pengendalian anggaran", source: "Tinjau asumsi, volume, dan perubahan lapangan." },
              { value: "Risiko", label: "K3 dan mutu", source: "Jadikan pengendalian risiko sebagai praktik harian." },
              { value: "Kontrak", label: "Kejelasan kewajiban", source: "Pastikan ruang lingkup dan perubahan terdokumentasi." },
              { value: "Update", label: "Perubahan regulasi", source: "Gunakan Radar untuk memantau sumber yang tersedia." },
              { value: "Bukti", label: "Keputusan yang dapat diuji", source: "Simpan rujukan sebelum mengambil langkah penting." }
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-orange-400 mb-1">{stat.value}</div>
                <div className="text-white font-medium text-sm mb-1">{stat.label}</div>
                <div className="text-slate-500 text-xs">{stat.source}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </ExpandableSection>

      {/* Solution & Value Proposition - collapsible */}
      <ExpandableSection
        icon="✨"
        title="Solusi & Nilai Tambah KonstruksiAI"
        subtitle="Alat bantu AI untuk menata analisis, rujukan, dan langkah kerja"
      >
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Bantu pekerjaan konstruksi lebih mudah ditelusuri
          </h2>
          <p className="text-slate-400 text-lg max-w-3xl mx-auto">
            Pilih alat sesuai kebutuhan, tambahkan konteks proyek, lalu tinjau hasilnya bersama tim yang berwenang.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* What We Solve */}
          <div className="bg-gradient-to-br from-blue-900/20 to-slate-800 border border-blue-500/30 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">🎯 Pekerjaan yang Dapat Dibantu</h3>
            <div className="space-y-4">
              {[
                "Alur perizinan → petakan dokumen dan rujukan yang perlu diperiksa",
                "Persiapan tender → susun checklist dan pertanyaan evaluasi",
                "Kebutuhan tenaga ahli → tinjau kompetensi dan dokumen pendukung",
                "Estimasi awal → hitung dengan asumsi yang terlihat",
                "Perubahan regulasi → pantau sumber yang tersedia di Radar",
                "Persiapan K3 → susun draf JSA, HIRARC, dan kontrol risiko"
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
            <h3 className="text-2xl font-bold text-white mb-6">🚀 Fitur yang Tersedia</h3>
            <div className="space-y-4">
              {[
                "Chat AI berbahasa Indonesia dengan agen spesialis",
                "Solver untuk enam domain pekerjaan keteknikan",
                "Enam kalkulator dengan asumsi dan catatan hasil",
                "Radar untuk menelusuri update dari sumber yang tersedia",
                "Ruang Proyek untuk menyimpan konteks pekerjaan tim",
                "Knowledge Base, simulasi, dan matriks lintas bidang"
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
              title: "Jawaban Lebih Terstruktur",
              desc: "Susun pertanyaan teknis dan langkah kerja dengan konteks yang lebih jelas.",
              benefit: "Bantu tim menyiapkan langkah berikutnya"
            },
            {
              icon: "🎯",
              title: "Konteks Lokal",
              desc: "Gunakan rujukan regulasi dan praktik kerja Indonesia sebagai titik awal analisis.",
              benefit: "Tetap verifikasi pada sumber resmi"
            },
            {
              icon: "💰",
              title: "Kerja Lebih Terkelola",
              desc: "Satukan panduan tender, dokumen, dan pengetahuan teknis dalam alur yang lebih rapi.",
              benefit: "Nilai manfaat bergantung pada konteks proyek"
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
      </ExpandableSection>

      {/* How It Works - collapsible */}
      <ExpandableSection
        icon="⚙️"
        title="Cara Kerja KonstruksiAI"
        subtitle="5 langkah untuk menyiapkan konteks, meninjau hasil, dan memverifikasi keputusan"
      >
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Interactive Workflow Diagram */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              {
                step: "1",
                icon: "📥",
                title: "Pilih Kebutuhan",
                desc: "Buka chat, solver, kalkulator, atau fitur lain yang sesuai",
                color: "from-blue-500 to-blue-600"
              },
              {
                step: "2",
                icon: "🤖",
                title: "Tambah Konteks",
                desc: "Tulis pertanyaan dan lampirkan dokumen bila diperlukan",
                color: "from-purple-500 to-purple-600"
              },
              {
                step: "3",
                icon: "⚡",
                title: "Tinjau Hasil",
                desc: "Baca asumsi, langkah, dan rujukan yang diberikan",
                color: "from-orange-500 to-orange-600"
              },
              {
                step: "4",
                icon: "📊",
                title: "Bandingkan Sumber",
                desc: "Periksa kembali dokumen proyek dan sumber resmi",
                color: "from-green-500 to-green-600"
              },
              {
                step: "5",
                icon: "🎯",
                title: "Putuskan Bersama",
                desc: "Gunakan hasil sebagai bahan analisis tim profesional",
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
              title: "Analisis Berbantuan AI",
              features: ["Chat berbahasa Indonesia", "Pembacaan lampiran dokumen", "Analisis tender dan risiko", "Pencocokan persyaratan dan bukti"]
            },
            {
              icon: "⚙️",
              title: "Alat Kerja",
              features: ["Solver enam domain", "Enam kalkulator teknik", "Matriks 21×10", "Ruang Proyek"]
            },
            {
              icon: "🔒",
              title: "Kontrol Pengguna",
              features: ["Kata sandi disimpan dalam bentuk hash", "Akses ruang kerja berbasis anggota", "Riwayat lokal untuk paket Gratis", "Sinkronisasi cloud untuk akun Pro"]
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
      </ExpandableSection>

      {/* Success Stories - collapsible */}
      <ExpandableSection
        icon="📈"
        title="Manfaat untuk Alur Kerja Konstruksi"
        subtitle="Gambaran kualitatif tentang cara fitur dapat membantu pekerjaan harian"
      >
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Contractor Benefits */}
          <div className="bg-gradient-to-br from-orange-900/20 to-slate-800 border border-orange-500/30 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">🏗️ Untuk Kontraktor & Developer</h3>
            <div className="space-y-4">
              {[
                { icon: "📈", title: "Penawaran Lebih Terkelola", desc: "Gunakan panduan dan checklist untuk menyiapkan dokumen dengan lebih sistematis." },
                { icon: "⏱️", title: "Persiapan Perizinan Lebih Jelas", desc: "Telusuri kebutuhan dokumen dan langkah kerja sebelum mengajukan proses." },
                { icon: "💰", title: "Estimasi yang Lebih Transparan", desc: "Tinjau asumsi RAB dan perubahan proyek secara lebih terstruktur." },
                { icon: "👥", title: "Tim yang Lebih Siap", desc: "Identifikasi kebutuhan kompetensi dan sertifikasi sejak tahap perencanaan." },
                { icon: "📊", title: "Operasional yang Lebih Rapi", desc: "Jadikan pembelajaran dan dokumentasi sebagai bagian dari alur kerja." },
                { icon: "🌟", title: "Keputusan yang Lebih Terukur", desc: "Gunakan rujukan, asumsi, dan bukti yang dapat ditinjau kembali." }
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
                { icon: "🎓", title: "Persiapan Sertifikasi", desc: "Gunakan materi belajar dan simulasi sebagai bahan latihan sebelum proses resmi." },
                { icon: "💼", title: "Pengembangan Karier Terarah", desc: "Petakan kompetensi, dokumen, dan area belajar yang relevan dengan peran Anda." },
                { icon: "📚", title: "Rujukan yang Dapat Ditelusuri", desc: "Gunakan Knowledge Base dan Radar sebagai titik awal, lalu periksa sumber resminya." },
                { icon: "🔧", title: "Alat Bantu Produktivitas", desc: "Gunakan kalkulator, template, solver, dan chat sesuai kebutuhan pekerjaan." },
                { icon: "🤝", title: "Konteks Kerja Bersama", desc: "Simpan konteks proyek agar pembahasan tim lebih konsisten." },
                { icon: "💎", title: "Belajar Sesuai Peran", desc: "Pilih materi dan simulasi yang relevan dengan kompetensi yang ingin dilatih." }
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
            <h3 className="text-2xl font-bold text-white mb-2">Dukungan untuk Pekerjaan Sehari-hari</h3>
            <p className="text-slate-400">Manfaat akan berbeda sesuai konteks proyek, peran, dan proses kerja masing-masing tim.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "Rapi", label: "Dokumen dan checklist", icon: "🎯" },
              { value: "Jelas", label: "Tahapan perizinan", icon: "⏱️" },
              { value: "Tinjau", label: "Asumsi biaya proyek", icon: "💰" },
              { value: "Belajar", label: "Kompetensi profesional", icon: "📈" },
              { value: "Verifikasi", label: "Sumber dan rujukan", icon: "⭐" },
              { value: "Selaras", label: "Komunikasi dalam tim", icon: "💸" },
              { value: "Siap", label: "Persiapan tender", icon: "🏗️" },
              { value: "Bantu", label: "Panduan saat dibutuhkan", icon: "🛟" }
            ].map((metric) => (
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
            <div className="flex-1">
              <h4 className="text-xl font-bold text-white mb-2">Cara Menggunakan KonstruksiAI secara Bertanggung Jawab</h4>
              <p className="text-slate-400 mb-4">
                Mulai dengan mendokumentasikan kebutuhan proyek, gunakan panduan untuk menyusun pertanyaan dan checklist,
                lalu verifikasi rekomendasi terhadap dokumen kontrak, regulasi, dan sumber resmi yang berlaku.
              </p>
              <div className="text-orange-400 font-semibold">Prinsip KonstruksiAI: bantu analisis, bukan menggantikan penilaian profesional.</div>
            </div>
          </div>
        </div>
      </section>
      </ExpandableSection>

      {/* Animated Stats Bar */}
      <StatsSection />

      {/* Engineering Fields Section */}
      <section id="bidang" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Bidang Keteknikan</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Tiga kelompok bidang yang dapat dijelajahi dari landing page
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
             Empat pintu masuk untuk mendukung profesional dan perusahaan keteknikan Indonesia
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
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
                <span className="text-purple-400 text-xs font-medium">📚 Materi & Template</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Knowledge Base Keteknikan
              </h2>
              <p className="text-slate-400 text-lg mb-6 leading-relaxed">
                Jelajahi <strong className="text-purple-400">artikel</strong>,{" "}
                <strong className="text-purple-400">video</strong>, dan{" "}
                <strong className="text-purple-400">template dokumen</strong> yang tersedia untuk konstruksi, energi, dan migas.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2 text-slate-300 text-sm">
                  <span className="text-green-400">✓</span>
                  <span>Artikel teknis</span>
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
                  <p className="text-slate-500 text-xs">Persiapan dan evaluasi tender pemerintah</p>
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
                  <p className="text-slate-500 text-xs">Rujukan awal perijinan konstruksi</p>
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
              Modul belajar mandiri yang tersedia untuk konstruksi, energi, K3, dan manajemen proyek.
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
              Latihan soal SKK/SKKNI dengan pembahasan sebagai bahan persiapan. Hasil simulasi bukan sertifikat atau penilaian resmi.
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
            <span className="text-orange-300 text-sm font-medium">Alat Kerja</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Solver dan Kalkulator Keteknikan</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Pilih analisis berbantuan AI atau perhitungan cepat dengan asumsi yang dapat ditinjau.
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
              <h3 className="text-white font-bold text-xl mb-3">Susun Analisis Masalah Teknik</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Deskripsikan masalah dan konteksnya untuk mendapatkan draf analisis, rujukan, serta langkah berikutnya yang perlu diverifikasi.
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
              <h3 className="text-white font-bold text-xl mb-3">Enam Kalkulator Teknik</h3>
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
                Eksplorasi <strong className="text-white">210 kombinasi</strong> antara 21 fungsi bisnis dan 10 bidang keteknikan. Setiap sel menyiapkan pertanyaan untuk dilanjutkan ke Chat AI.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {["Perencanaan", "Estimasi & RAB", "Tender", "K3", "Perijinan", "Kontrak", "SDM", "+14 lainnya"].map((tag) => (
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

      {/* FAQ */}
      <FAQSection />

      {/* Plan Comparison */}
      <PlanComparisonSection billingConfigured={billingConfigured} />

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
              <span className="text-white text-sm font-medium">Paket Gratis aktif tanpa checkout</span>
            </div>

            <h2 className="text-4xl font-bold text-white mb-4">
              Mulai dari pekerjaan yang perlu dirapikan hari ini
            </h2>

            <p className="text-orange-100 text-xl mb-6 max-w-3xl mx-auto">
              Mulai rapikan cara tim Anda menelusuri tender, dokumen, kompetensi, dan update industri dengan KonstruksiAI.
            </p>

            {/* Urgency Elements */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-3xl mx-auto">
              {[
                { icon: "🚀", title: "Paket Gratis Aktif", desc: "Daftar tanpa proses pembayaran" },
                { icon: "⚡", title: "Mulai dengan Panduan", desc: "Pilih fitur sesuai kebutuhan kerja" },
                { icon: "🛡️", title: "Gunakan dengan Bijak", desc: "Verifikasi rujukan untuk keputusan penting" }
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
                Daftar Paket Gratis
              </Link>
              <Link
                href="/chat"
                className="border-2 border-white text-white hover:bg-white hover:text-orange-600 px-8 py-5 rounded-xl font-bold text-xl transition-all inline-block"
              >
                Buka Chat AI
              </Link>
            </div>

            {/* Who it's for */}
            <div className="text-center">
              <p className="text-orange-100 text-sm mb-4">Dibangun untuk kontraktor, konsultan, dan profesional konstruksi di Indonesia:</p>
              <div className="flex flex-wrap justify-center items-center gap-3 text-orange-200">
                <span className="bg-white/10 px-3 py-1 rounded-full text-sm">🏗️ Kontraktor</span>
                <span className="bg-white/10 px-3 py-1 rounded-full text-sm">📐 Konsultan Teknik</span>
                <span className="bg-white/10 px-3 py-1 rounded-full text-sm">🦺 Tim K3</span>
                <span className="bg-white/10 px-3 py-1 rounded-full text-sm">📋 Tim Tender</span>
              </div>
            </div>
          </div>
        </div>

        {/* How to Join Section */}
        <div className="mt-12 bg-slate-800 border border-slate-700 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">Cara Bergabung dengan KonstruksiAI</h3>
            <p className="text-slate-400">Daftar akun Gratis lalu pilih fitur yang ingin digunakan.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "1",
                icon: "📝",
                title: "Daftar Akun",
                desc: "Buat akun Gratis dengan nama, email, dan kata sandi.",
                time: "Langkah 1"
              },
              {
                step: "2",
                icon: "🎯",
                title: "Pilih Fitur",
                desc: "Mulai dari chat, solver, kalkulator, Radar, atau Ruang Proyek.",
                time: "Langkah 2"
              },
              {
                step: "3",
                icon: "🚀",
                title: "Mulai Gunakan",
                desc: "Tambahkan konteks, tinjau hasil, dan verifikasi sebelum mengambil keputusan.",
                time: "Langkah 3"
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
              Daftar Paket Gratis →
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
                Alat bantu AI untuk pekerjaan keteknikan Indonesia
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
              © {new Date().getFullYear()} KonstruksiAI — Asisten AI khusus bidang keteknikan Indonesia · Konstruksi · Energi · Migas & Pertambangan
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
