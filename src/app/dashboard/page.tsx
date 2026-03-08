import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import Link from "next/link";
import LogoutButton from "./LogoutButton";

const quickLinks = [
  { icon: "🏗️", title: "Teknik Konstruksi", desc: "10 sub-bidang keteknikan", href: "/konstruksi", color: "border-orange-500/30 hover:border-orange-500" },
  { icon: "⚡", title: "Ketenagalistrikan & EBT", desc: "8 sub-bidang energi", href: "/energi", color: "border-yellow-500/30 hover:border-yellow-500" },
  { icon: "⛏️", title: "Migas & Pertambangan", desc: "8 sub-bidang migas", href: "/migas", color: "border-blue-500/30 hover:border-blue-500" },
  { icon: "📋", title: "Tender & Pengadaan", desc: "Analisis & strategi tender", href: "/tender", color: "border-green-500/30 hover:border-green-500" },
  { icon: "🏢", title: "Manajemen Bisnis", desc: "Operasional perusahaan", href: "/manajemen", color: "border-purple-500/30 hover:border-purple-500" },
  { icon: "📜", title: "Perijinan & Sertifikasi", desc: "SBU, SKK, IUJK, IMB", href: "/perijinan", color: "border-pink-500/30 hover:border-pink-500" },
];

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const initials = session.name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

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
                <span className="text-slate-400 text-xs block leading-none">Dashboard</span>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/chat" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                💬 Mulai Chat
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-500/20 border border-orange-500/40 rounded-full flex items-center justify-center text-orange-300 text-sm font-bold">
                  {initials}
                </div>
                <span className="text-slate-300 text-sm hidden sm:block">{session.name}</span>
              </div>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-orange-600/20 to-orange-500/10 border border-orange-500/30 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-orange-500/20 border border-orange-500/40 rounded-2xl flex items-center justify-center text-orange-300 text-2xl font-bold">
              {initials}
            </div>
            <div>
              <h1 className="text-white text-xl font-bold">Selamat datang, {session.name}! 👋</h1>
              <p className="text-slate-400 text-sm mt-0.5">{session.email}</p>
              <span className="inline-flex items-center gap-1 mt-1 text-xs bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded-full">
                ✅ Akun Aktif
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { value: "3", label: "Sektor Industri", icon: "🏭" },
            { value: "126", label: "Topik Konsultasi", icon: "💬" },
            { value: "24/7", label: "Siap Membantu", icon: "⏰" },
            { value: "∞", label: "Pertanyaan Gratis", icon: "🚀" },
          ].map((stat) => (
            <div key={stat.label} className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-center">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-xl font-bold text-orange-400">{stat.value}</div>
              <div className="text-slate-400 text-xs mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Action */}
        <div className="bg-slate-800 border border-orange-500/30 rounded-2xl p-6 mb-8">
          <h2 className="text-white font-bold text-lg mb-3">🚀 Mulai Konsultasi</h2>
          <p className="text-slate-400 text-sm mb-4">
            Tanyakan apa saja seputar konstruksi, energi, migas, tender, manajemen, atau perijinan.
          </p>
          <Link
            href="/chat"
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 inline-flex items-center gap-2"
          >
            💬 Buka Chat AI
          </Link>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-white font-bold text-lg mb-4">📚 Bidang Keahlian</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <div className={`bg-slate-800 border ${link.color} rounded-xl p-4 transition-all hover:-translate-y-0.5 cursor-pointer`}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{link.icon}</span>
                    <div>
                      <div className="text-white font-medium text-sm">{link.title}</div>
                      <div className="text-slate-400 text-xs mt-0.5">{link.desc}</div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Matrix Link */}
        <div className="mt-8 bg-slate-800 border border-slate-700 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white font-bold text-lg">📊 Matriks Ruang Lingkup</h2>
              <p className="text-slate-400 text-sm mt-1">126 titik koneksi antara bidang keteknikan dan fungsi bisnis</p>
            </div>
            <Link
              href="/matrix"
              className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
            >
              Buka Matriks →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
