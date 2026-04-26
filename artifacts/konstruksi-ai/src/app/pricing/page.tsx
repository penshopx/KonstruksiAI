"use client";

import { useState } from "react";
import Link from "@/shims/next-link";

// ============================================================
// PRICING PAGE — Tiered Business Model
// ============================================================

const PLANS = [
  {
    id: "free",
    name: "Gratis",
    price: 0,
    period: "selamanya",
    description: "Untuk profesional yang baru memulai",
    color: "border-slate-700",
    headerColor: "bg-slate-800",
    badge: null,
    cta: "Mulai Gratis",
    ctaStyle: "bg-slate-700 hover:bg-slate-600 text-white",
    features: [
      { text: "Chat AI tanpa batas (simulated)", included: true },
      { text: "8 Agen Spesialis Keteknikan", included: true },
      { text: "6 Kalkulator Teknik", included: true },
      { text: "Engineering Solver (3 domain)", included: true },
      { text: "Matriks 21×10 Agen AI", included: true },
      { text: "Riwayat percakapan lokal", included: true },
      { text: "Export percakapan (.md)", included: true },
      { text: "Koneksi LLM real-time (GPT-4/Claude)", included: false },
      { text: "Riwayat cloud & sinkronisasi", included: false },
      { text: "Template dokumen premium (50+)", included: false },
      { text: "Analisis dokumen PDF/Word", included: false },
      { text: "API akses untuk integrasi", included: false },
      { text: "Dukungan prioritas", included: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 299_000,
    period: "per bulan",
    description: "Untuk profesional & konsultan aktif",
    color: "border-orange-500/60",
    headerColor: "bg-orange-500/10",
    badge: "Paling Populer",
    cta: "Mulai Pro — 7 Hari Gratis",
    ctaStyle: "bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25",
    features: [
      { text: "Chat AI tanpa batas (simulated)", included: true },
      { text: "8 Agen Spesialis Keteknikan", included: true },
      { text: "6 Kalkulator Teknik", included: true },
      { text: "Engineering Solver (semua domain)", included: true },
      { text: "Matriks 21×10 Agen AI", included: true },
      { text: "Riwayat percakapan lokal", included: true },
      { text: "Export percakapan (.md)", included: true },
      { text: "Koneksi LLM real-time (GPT-4/Claude)", included: true },
      { text: "Riwayat cloud & sinkronisasi", included: true },
      { text: "Template dokumen premium (50+)", included: true },
      { text: "Analisis dokumen PDF/Word", included: false },
      { text: "API akses untuk integrasi", included: false },
      { text: "Dukungan prioritas", included: true },
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: null,
    period: "custom",
    description: "Untuk perusahaan & tim besar",
    color: "border-blue-500/40",
    headerColor: "bg-blue-500/5",
    badge: "Hubungi Kami",
    cta: "Hubungi Sales",
    ctaStyle: "bg-blue-600 hover:bg-blue-700 text-white",
    features: [
      { text: "Semua fitur Pro", included: true },
      { text: "Analisis dokumen PDF/Word", included: true },
      { text: "API akses untuk integrasi", included: true },
      { text: "Custom AI agent untuk perusahaan", included: true },
      { text: "White-label & branding custom", included: true },
      { text: "SSO & manajemen tim", included: true },
      { text: "SLA 99.9% uptime", included: true },
      { text: "Dedicated account manager", included: true },
      { text: "Pelatihan & onboarding tim", included: true },
      { text: "Integrasi ERP/sistem internal", included: true },
      { text: "Laporan penggunaan & analytics", included: true },
      { text: "Dukungan 24/7", included: true },
      { text: "Kontrak tahunan dengan diskon", included: true },
    ],
  },
];

const COMPARISON_FEATURES = [
  { category: "Chat & AI", features: [
    { name: "Chat AI tanpa batas", free: true, pro: true, enterprise: true },
    { name: "Koneksi LLM real-time (GPT-4/Claude)", free: false, pro: true, enterprise: true },
    { name: "Streaming response", free: false, pro: true, enterprise: true },
    { name: "Konteks percakapan panjang", free: "5 pesan", pro: "50 pesan", enterprise: "Unlimited" },
  ]},
  { category: "Agen & Solver", features: [
    { name: "Agen Spesialis", free: "8 agen", pro: "8 agen", enterprise: "Custom" },
    { name: "Engineering Solver", free: "3 domain", pro: "6 domain", enterprise: "Custom" },
    { name: "Matriks Agen AI", free: true, pro: true, enterprise: true },
    { name: "Custom AI Agent", free: false, pro: false, enterprise: true },
  ]},
  { category: "Dokumen & Template", features: [
    { name: "Template dokumen", free: "5 template", pro: "50+ template", enterprise: "Unlimited" },
    { name: "Analisis PDF/Word", free: false, pro: false, enterprise: true },
    { name: "Export percakapan", free: ".md", pro: ".md, .pdf, .docx", enterprise: "Semua format" },
    { name: "Riwayat cloud", free: false, pro: "1 tahun", enterprise: "Unlimited" },
  ]},
  { category: "Integrasi & API", features: [
    { name: "API akses", free: false, pro: false, enterprise: true },
    { name: "Webhook", free: false, pro: false, enterprise: true },
    { name: "Integrasi ERP", free: false, pro: false, enterprise: true },
    { name: "SSO (Single Sign-On)", free: false, pro: false, enterprise: true },
  ]},
  { category: "Dukungan", features: [
    { name: "Dukungan email", free: "Komunitas", pro: "Prioritas", enterprise: "Dedicated" },
    { name: "Response time", free: "3-5 hari", pro: "24 jam", enterprise: "4 jam" },
    { name: "Onboarding", free: false, pro: "Self-service", enterprise: "Guided" },
    { name: "SLA", free: false, pro: "99.5%", enterprise: "99.9%" },
  ]},
];

const FAQS = [
  {
    q: "Apakah ada uji coba gratis untuk paket Pro?",
    a: "Ya! Paket Pro tersedia dengan uji coba 7 hari gratis tanpa perlu kartu kredit. Anda bisa mengakses semua fitur Pro selama periode uji coba.",
  },
  {
    q: "Bagaimana cara pembayaran?",
    a: "Kami menerima transfer bank, kartu kredit/debit, dan dompet digital (GoPay, OVO, Dana). Untuk Enterprise, tersedia opsi invoice bulanan/tahunan.",
  },
  {
    q: "Apakah bisa upgrade/downgrade paket kapan saja?",
    a: "Ya, Anda bisa upgrade atau downgrade paket kapan saja. Perubahan akan berlaku di siklus billing berikutnya.",
  },
  {
    q: "Apa yang dimaksud dengan 'Koneksi LLM real-time'?",
    a: "Fitur ini menghubungkan KonstruksiAI dengan model AI terkini seperti GPT-4 atau Claude untuk respons yang lebih akurat, kontekstual, dan up-to-date dibanding mode simulasi.",
  },
  {
    q: "Apakah data percakapan saya aman?",
    a: "Ya. Data Anda dienkripsi end-to-end dan tidak digunakan untuk melatih model AI. Untuk Enterprise, tersedia opsi data residency di Indonesia.",
  },
  {
    q: "Berapa pengguna yang bisa menggunakan satu akun Enterprise?",
    a: "Paket Enterprise bisa dikonfigurasi untuk tim dari 5 hingga ribuan pengguna. Harga disesuaikan berdasarkan jumlah pengguna dan kebutuhan.",
  },
];

function CheckIcon({ included }: { included: boolean | string }) {
  if (included === false) return <span className="text-slate-600 text-lg">—</span>;
  if (included === true) return <span className="text-green-400 text-lg">✓</span>;
  return <span className="text-orange-300 text-xs font-medium">{included}</span>;
}

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const yearlyDiscount = 0.20; // 20% off

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">K</div>
              <span className="text-white font-bold text-lg">KonstruksiAI</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/solver" className="text-slate-400 hover:text-white text-sm transition-colors">Solver</Link>
              <Link href="/tools" className="text-slate-400 hover:text-white text-sm transition-colors">Tools</Link>
              <Link href="/chat" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">Mulai Gratis</Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Harga yang
            <span className="text-orange-400"> Transparan</span>
          </h1>
          <p className="text-slate-400 text-xl max-w-2xl mx-auto mb-8">
            Mulai gratis, upgrade saat Anda siap. Tidak ada biaya tersembunyi.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-3 bg-slate-800 border border-slate-700 rounded-xl p-1">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                billingPeriod === "monthly" ? "bg-orange-500 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Bulanan
            </button>
            <button
              onClick={() => setBillingPeriod("yearly")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                billingPeriod === "yearly" ? "bg-orange-500 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Tahunan
              <span className="bg-green-500/20 text-green-400 text-xs px-1.5 py-0.5 rounded-full">Hemat 20%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {PLANS.map(plan => {
            const displayPrice = plan.price === null
              ? null
              : billingPeriod === "yearly"
              ? Math.round(plan.price * (1 - yearlyDiscount))
              : plan.price;

            return (
              <div
                key={plan.id}
                className={`bg-slate-800 border-2 rounded-2xl overflow-hidden transition-all ${plan.color} ${
                  plan.id === "pro" ? "scale-[1.02] shadow-xl shadow-orange-500/10" : ""
                }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className={`text-center py-2 text-xs font-bold ${
                    plan.id === "pro" ? "bg-orange-500 text-white" : "bg-blue-600 text-white"
                  }`}>
                    {plan.badge}
                  </div>
                )}

                {/* Header */}
                <div className={`${plan.headerColor} p-6 border-b border-slate-700`}>
                  <h2 className="text-white font-bold text-2xl mb-1">{plan.name}</h2>
                  <p className="text-slate-400 text-sm mb-4">{plan.description}</p>

                  {displayPrice === null ? (
                    <div>
                      <span className="text-white font-bold text-3xl">Custom</span>
                      <span className="text-slate-400 text-sm ml-2">sesuai kebutuhan</span>
                    </div>
                  ) : displayPrice === 0 ? (
                    <div>
                      <span className="text-white font-bold text-3xl">Gratis</span>
                      <span className="text-slate-400 text-sm ml-2">selamanya</span>
                    </div>
                  ) : (
                    <div>
                      <span className="text-white font-bold text-3xl">
                        Rp {displayPrice.toLocaleString("id-ID")}
                      </span>
                      <span className="text-slate-400 text-sm ml-2">/{billingPeriod === "yearly" ? "bulan (tagihan tahunan)" : "bulan"}</span>
                      {billingPeriod === "yearly" && (
                        <div className="text-green-400 text-xs mt-1">
                          Hemat Rp {((plan.price! - displayPrice) * 12).toLocaleString("id-ID")}/tahun
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Features */}
                <div className="p-6">
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className={`flex-shrink-0 mt-0.5 ${feature.included ? "text-green-400" : "text-slate-600"}`}>
                          {feature.included ? "✓" : "—"}
                        </span>
                        <span className={`text-sm ${feature.included ? "text-slate-300" : "text-slate-600"}`}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={plan.id === "enterprise" ? "mailto:enterprise@konstruksi.ai" : "/register"}
                    className={`block w-full text-center py-3 rounded-xl font-semibold text-sm transition-all ${plan.ctaStyle}`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Comparison Table */}
        <div className="mb-16">
          <h2 className="text-white font-bold text-2xl text-center mb-8">Perbandingan Fitur Lengkap</h2>
          <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-4 border-b border-slate-700">
              <div className="px-6 py-4 text-slate-400 text-sm font-medium">Fitur</div>
              <div className="px-4 py-4 text-center border-l border-slate-700">
                <div className="text-white font-bold text-sm">Gratis</div>
              </div>
              <div className="px-4 py-4 text-center border-l border-slate-700 bg-orange-500/5">
                <div className="text-orange-400 font-bold text-sm">Pro</div>
                <div className="text-slate-500 text-xs">Rp 299rb/bln</div>
              </div>
              <div className="px-4 py-4 text-center border-l border-slate-700">
                <div className="text-blue-400 font-bold text-sm">Enterprise</div>
                <div className="text-slate-500 text-xs">Custom</div>
              </div>
            </div>

            {COMPARISON_FEATURES.map(category => (
              <div key={category.category}>
                {/* Category Header */}
                <div className="grid grid-cols-4 bg-slate-700/30 border-b border-slate-700/50">
                  <div className="px-6 py-2 text-slate-400 text-xs font-bold uppercase tracking-wider col-span-4">
                    {category.category}
                  </div>
                </div>

                {category.features.map((feature, i) => (
                  <div
                    key={feature.name}
                    className={`grid grid-cols-4 border-b border-slate-700/30 ${i % 2 === 0 ? "" : "bg-slate-800/50"}`}
                  >
                    <div className="px-6 py-3 text-slate-300 text-sm">{feature.name}</div>
                    <div className="px-4 py-3 text-center border-l border-slate-700/30 flex items-center justify-center">
                      <CheckIcon included={feature.free} />
                    </div>
                    <div className="px-4 py-3 text-center border-l border-slate-700/30 bg-orange-500/5 flex items-center justify-center">
                      <CheckIcon included={feature.pro} />
                    </div>
                    <div className="px-4 py-3 text-center border-l border-slate-700/30 flex items-center justify-center">
                      <CheckIcon included={feature.enterprise} />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-16">
          <h2 className="text-white font-bold text-2xl text-center mb-8">Pertanyaan Umum</h2>
          <div className="max-w-3xl mx-auto space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-700/50 transition-colors"
                >
                  <span className="text-white font-medium text-sm pr-4">{faq.q}</span>
                  <svg
                    className={`w-5 h-5 text-orange-400 flex-shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-slate-400 text-sm leading-relaxed border-t border-slate-700/50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Enterprise CTA */}
        <div className="bg-gradient-to-r from-blue-500/10 via-slate-800 to-orange-500/10 border border-slate-700 rounded-2xl p-10 text-center">
          <h2 className="text-white font-bold text-3xl mb-3">Butuh Solusi Enterprise?</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-6">
            Kami menyediakan solusi custom untuk perusahaan konstruksi, konsultan, dan BUMN. Termasuk integrasi sistem, white-label, dan pelatihan tim.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="mailto:enterprise@konstruksi.ai"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-all hover:scale-105"
            >
              📧 Hubungi Tim Enterprise
            </a>
            <Link
              href="/chat"
              className="border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white px-8 py-3 rounded-xl font-semibold transition-all"
            >
              💬 Demo Langsung
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
