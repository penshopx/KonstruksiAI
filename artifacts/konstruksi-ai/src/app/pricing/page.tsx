"use client";

import { useEffect, useState } from "react";
import Link from "@/shims/next-link";

// ============================================================
// PRICING PAGE — Tiered Business Model
// ============================================================

const PLANS = [
  {
    id: "free",
    name: "Gratis",
    price: 0,
    period: "aktif saat ini",
    description: "Untuk profesional yang baru memulai",
    color: "border-slate-700",
    headerColor: "bg-slate-800",
    badge: null,
    cta: "Mulai Gratis",
    ctaStyle: "bg-slate-700 hover:bg-slate-600 text-white",
    features: [
      { text: "Chat dengan 9 agen AI", included: true },
      { text: "6 Kalkulator Teknik", included: true },
      { text: "Engineering Solver (6 domain)", included: true },
      { text: "Matriks 21×10", included: true },
      { text: "Riwayat percakapan lokal", included: true },
      { text: "Export percakapan (.md, .pdf, .docx)", included: true },
      { text: "Lampiran PDF/Word di chat", included: true },
      { text: "Respons AI streaming", included: true },
      { text: "Riwayat cloud & sinkronisasi", included: false },
      { text: "Template dokumen premium", included: false },
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
    badge: "Checkout aktif",
    cta: "Upgrade ke Pro",
    ctaStyle: "bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25",
    features: [
      { text: "Chat dengan 9 agen AI", included: true },
      { text: "6 Kalkulator Teknik", included: true },
      { text: "Engineering Solver (6 domain)", included: true },
      { text: "Matriks 21×10", included: true },
      { text: "Riwayat percakapan lokal", included: true },
      { text: "Export percakapan (.md, .pdf, .docx)", included: true },
      { text: "Lampiran PDF/Word di chat", included: true },
      { text: "Respons AI streaming", included: true },
      { text: "Riwayat cloud & sinkronisasi", included: true },
      { text: "Template dokumen premium", included: true },
    ],
  },
  {
    id: "enterprise",
    name: "Kebutuhan Tim",
    price: null,
    period: "custom",
    description: "Diskusikan kebutuhan organisasi Anda",
    color: "border-blue-500/40",
    headerColor: "bg-blue-500/5",
    badge: "Konsultasi",
    cta: "Hubungi Tim",
    ctaStyle: "bg-blue-600 hover:bg-blue-700 text-white",
    features: [
      { text: "Belum merupakan paket aktif", included: true },
      { text: "Kebutuhan akses tim dibahas bersama", included: true },
      { text: "Integrasi perlu ditinjau per kasus", included: true },
      { text: "Ruang lingkup dan dukungan disepakati sebelum aktivasi", included: true },
    ],
  },
];

const COMPARISON_FEATURES = [
  { category: "Chat & AI", features: [
    { name: "Chat dengan agen AI", free: "9 agen", pro: "9 agen", enterprise: "Dibahas" },
    { name: "Tampilan jawaban", free: "Streaming", pro: "Streaming", enterprise: "Dibahas" },
  ]},
  { category: "Agen & Solver", features: [
    { name: "Engineering Solver", free: "6 domain", pro: "6 domain", enterprise: "Dibahas" },
    { name: "Kalkulator teknik", free: "6 alat", pro: "6 alat", enterprise: "Dibahas" },
    { name: "Matriks lintas bidang", free: "21×10", pro: "21×10", enterprise: "Dibahas" },
  ]},
  { category: "Dokumen & Riwayat", features: [
    { name: "Lampiran PDF/Word di chat", free: true, pro: true, enterprise: "Dibahas" },
    { name: "Export percakapan", free: ".md, .pdf, .docx", pro: ".md, .pdf, .docx", enterprise: "Dibahas" },
    { name: "Riwayat percakapan", free: "Lokal", pro: "Cloud sync", enterprise: "Dibahas" },
    { name: "Template premium", free: false, pro: true, enterprise: "Dibahas" },
  ]},
];

const FAQS = [
  {
    q: "Apakah paket Pro sudah bisa dibeli sekarang?",
    a: "Belum jika checkout di halaman ini berstatus tidak tersedia. Paket Gratis tetap dapat digunakan untuk chat, solver, kalkulator, matriks, dan lampiran dokumen. Tombol upgrade hanya aktif ketika provider pembayaran dan verifikasi server sudah siap.",
  },
  {
    q: "Bagaimana cara pembayaran untuk paket Pro atau Enterprise?",
    a: "Jika checkout Pro aktif, pembayaran diproses oleh provider eksternal dan akses baru diberikan setelah statusnya terverifikasi di server. Kebutuhan organisasi dibahas langsung sebelum ada ruang lingkup atau biaya yang disepakati.",
  },
  {
    q: "Apakah bisa upgrade/downgrade paket kapan saja?",
    a: "Upgrade hanya tersedia saat tombol checkout aktif. Pembatalan atau pembayaran gagal akan mengembalikan akses akun ke paket Gratis setelah status provider diverifikasi oleh server.",
  },
  {
    q: "Apa yang dimaksud dengan 'Respons AI streaming'?",
    a: "Jawaban AI ditampilkan bertahap saat sedang dibuat. Fitur ini tersedia pada paket Gratis maupun Pro.",
  },
  {
    q: "Apakah data percakapan saya aman?",
    a: "Paket Gratis menyimpan riwayat chat di browser yang digunakan, sedangkan akun Pro dapat menyinkronkan riwayat ke server. Hindari memasukkan data rahasia dan tetap ikuti kebijakan data organisasi Anda.",
  },
  {
    q: "Apakah paket untuk kebutuhan tim sudah aktif?",
    a: "Belum sebagai paket mandiri di aplikasi. Hubungi tim hanya untuk membahas kebutuhan; fitur, jumlah pengguna, dukungan, dan biaya tidak dianggap tersedia sebelum disepakati secara terpisah.",
  },
];

function CheckIcon({ included }: { included: boolean | string }) {
  if (included === false) return <span className="text-slate-600 text-lg">—</span>;
  if (included === true) return <span className="text-green-400 text-lg">✓</span>;
  return <span className="text-orange-300 text-xs font-medium">{included}</span>;
}

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [billingConfigured, setBillingConfigured] = useState(false);
  const [billingLoading, setBillingLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

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
      })
      .finally(() => {
        if (active) setBillingLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const visibleFaqs = FAQS.map((faq, index) => {
    if (!billingConfigured || index > 1) return faq;
    if (index === 0) {
      return {
        ...faq,
        a: "Ya. Checkout Pro tersedia melalui provider pembayaran yang terhubung. Akses Pro diaktifkan setelah pembayaran dikonfirmasi oleh server.",
      };
    }
    return {
      ...faq,
      a: "Pembayaran diproses oleh provider eksternal. Status aktif, gagal, dan pembatalan diverifikasi di server agar akses akun mengikuti status pembayaran.",
    };
  });

  async function handleUpgrade() {
    setCheckoutError(null);
    setCheckoutLoading(true);
    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        credentials: "include",
      });
      const result = await response.json().catch(() => ({})) as {
        checkoutUrl?: string;
        error?: string;
      };
      if (response.status === 401) {
        window.location.assign("/login?redirect=/pricing");
        return;
      }
      if (!response.ok || !result.checkoutUrl) {
        throw new Error(result.error || "Checkout belum tersedia");
      }
      window.location.assign(result.checkoutUrl);
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : "Checkout belum tersedia");
    } finally {
      setCheckoutLoading(false);
    }
  }

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
            {billingConfigured
              ? "Paket Gratis dan Pro tersedia sekarang. Upgrade diproses melalui checkout dan akses Pro aktif setelah pembayaran terverifikasi."
              : "Paket Gratis aktif dan bisa dipakai sekarang. Checkout Pro belum tersedia."}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {PLANS.map(plan => {
            const displayPrice = plan.price;
            const isPro = plan.id === "pro";

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
                    isPro ? "bg-orange-500 text-white" : "bg-blue-600 text-white"
                  }`}>
                    {isPro && !billingConfigured ? "Belum tersedia" : plan.badge}
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
                      <span className="text-slate-400 text-sm ml-2">aktif saat ini</span>
                    </div>
                  ) : (
                    <div>
                      <span className="text-white font-bold text-3xl">
                        Rp {displayPrice.toLocaleString("id-ID")}
                      </span>
                      <span className="text-slate-400 text-sm ml-2">/bulan</span>
                        {isPro && (
                        <div className="text-orange-300 text-xs mt-1">
                           {billingConfigured
                             ? "Langganan bulanan · checkout terverifikasi"
                              : "Checkout belum tersedia"}
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

                  {isPro ? (
                    <button
                      type="button"
                      onClick={handleUpgrade}
                      disabled={billingLoading || !billingConfigured || checkoutLoading}
                      className={`block w-full text-center py-3 rounded-xl font-semibold text-sm transition-all disabled:cursor-not-allowed disabled:opacity-60 ${plan.ctaStyle}`}
                    >
                      {checkoutLoading ? "Membuka checkout..." : !billingConfigured ? "Checkout belum tersedia" : plan.cta}
                    </button>
                  ) : (
                    <Link
                      href={plan.id === "enterprise" ? "mailto:enterprise@konstruksi.ai" : "/register"}
                      className={`block w-full text-center py-3 rounded-xl font-semibold text-sm transition-all ${plan.ctaStyle}`}
                    >
                      {plan.cta}
                    </Link>
                  )}
                  {isPro && checkoutError && (
                    <p className="text-red-300 text-xs mt-3 text-center">{checkoutError}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Comparison Table */}
        <div className="mb-16">
          <h2 className="text-white font-bold text-2xl text-center mb-8">Perbandingan Fitur</h2>
          <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-4 border-b border-slate-700">
              <div className="px-6 py-4 text-slate-400 text-sm font-medium">Fitur</div>
              <div className="px-4 py-4 text-center border-l border-slate-700">
                <div className="text-white font-bold text-sm">Gratis</div>
              </div>
              <div className="px-4 py-4 text-center border-l border-slate-700 bg-orange-500/5">
                <div className="text-orange-400 font-bold text-sm">Pro</div>
                <div className="text-slate-500 text-xs">Rp 299rb/bln · {billingConfigured ? "checkout aktif" : "belum tersedia"}</div>
              </div>
              <div className="px-4 py-4 text-center border-l border-slate-700">
                <div className="text-blue-400 font-bold text-sm">Kebutuhan Tim</div>
                <div className="text-slate-500 text-xs">Belum aktif</div>
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
            {visibleFaqs.map((faq, i) => (
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
          <h2 className="text-white font-bold text-3xl mb-3">Ingin Membahas Kebutuhan Tim?</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-6">
            Sampaikan konteks organisasi dan kebutuhan akses Anda. Fitur, integrasi, dukungan, serta biaya baru dianggap tersedia setelah disepakati bersama.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="mailto:enterprise@konstruksi.ai"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-all hover:scale-105"
            >
              Hubungi Tim
            </a>
            <Link
              href="/chat"
              className="border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white px-8 py-3 rounded-xl font-semibold transition-all"
            >
              Buka Chat AI
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
