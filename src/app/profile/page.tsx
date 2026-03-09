"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string | number;
}

interface ProfileStats {
  conversationCount: number;
  messageCount: number;
  mostActiveAgent: string | null;
}

interface RecentConversation {
  id: string;
  title: string;
  agentId: string;
  label: string | null;
  updatedAt: string | number;
}

interface ProfileData {
  user: UserProfile;
  stats: ProfileStats;
  recentConversations: RecentConversation[];
}

function formatDate(ts: string | number | null | undefined): string {
  if (!ts) return "—";
  const d = typeof ts === "number" ? new Date(ts * 1000) : new Date(ts);
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

function formatRelative(ts: string | number | null | undefined): string {
  if (!ts) return "—";
  const d = typeof ts === "number" ? new Date(ts * 1000) : new Date(ts);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Baru saja";
  if (mins < 60) return `${mins} menit lalu`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} hari lalu`;
  return formatDate(ts);
}

const agentLabels: Record<string, string> = {
  general: "Umum",
  konstruksi: "Teknik Konstruksi",
  energi: "Ketenagalistrikan & EBT",
  migas: "Migas & Pertambangan",
  tender: "Tender & Pengadaan",
  manajemen: "Manajemen Bisnis",
  perijinan: "Perijinan & Sertifikasi",
};

const labelColors: Record<string, string> = {
  penting: "bg-red-500/20 text-red-300 border-red-500/30",
  proyek: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  referensi: "bg-green-500/20 text-green-300 border-green-500/30",
  arsip: "bg-slate-500/20 text-slate-400 border-slate-500/30",
};

export default function ProfilePage() {
  const router = useRouter();
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "settings">("overview");

  // Settings form state
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => {
        if (r.status === 401) {
          router.push("/login");
          return null;
        }
        return r.json();
      })
      .then((d) => {
        if (d) {
          setData(d);
          setName(d.user.name);
        }
        setLoading(false);
      })
      .catch(() => {
        router.push("/login");
      });
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveMsg(null);

    if (newPassword && newPassword !== confirmPassword) {
      setSaveMsg({ type: "error", text: "Password baru tidak cocok" });
      return;
    }

    setSaving(true);
    try {
      const body: Record<string, string> = {};
      if (name.trim() && name.trim() !== data?.user.name) {
        body.name = name.trim();
      }
      if (newPassword) {
        body.currentPassword = currentPassword;
        body.newPassword = newPassword;
      }

      if (Object.keys(body).length === 0) {
        setSaveMsg({ type: "error", text: "Tidak ada perubahan yang disimpan" });
        setSaving(false);
        return;
      }

      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await res.json();
      if (!res.ok) {
        setSaveMsg({ type: "error", text: result.error || "Gagal menyimpan perubahan" });
      } else {
        setSaveMsg({ type: "success", text: "Profil berhasil diperbarui!" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        // Update local data
        if (data && result.name) {
          setData({ ...data, user: { ...data.user, name: result.name } });
        }
      }
    } catch {
      setSaveMsg({ type: "error", text: "Terjadi kesalahan. Coba lagi." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-slate-400 text-sm animate-pulse">Memuat profil...</div>
      </div>
    );
  }

  if (!data) return null;

  const { user, stats, recentConversations } = data;
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                K
              </div>
              <div>
                <span className="text-white font-bold text-lg">KonstruksiAI</span>
                <span className="text-slate-400 text-xs block leading-none">Profil Saya</span>
              </div>
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="text-slate-400 hover:text-white text-sm transition-colors"
              >
                ← Dashboard
              </Link>
              <Link
                href="/chat"
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                💬 Chat
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Profile Hero */}
        <div className="bg-gradient-to-r from-orange-600/20 to-orange-500/10 border border-orange-500/30 rounded-2xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-20 h-20 bg-orange-500/20 border-2 border-orange-500/50 rounded-2xl flex items-center justify-center text-orange-300 text-3xl font-bold flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-white text-2xl font-bold">{user.name}</h1>
              <p className="text-slate-400 text-sm mt-0.5">{user.email}</p>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1 text-xs bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded-full border border-orange-500/30">
                  ✅ Akun Aktif
                </span>
                {user.role === "admin" && (
                  <span className="inline-flex items-center gap-1 text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30">
                    👑 Admin
                  </span>
                )}
                <span className="text-slate-500 text-xs">
                  Bergabung {formatDate(user.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 text-center">
            <div className="text-3xl font-bold text-orange-400">{stats.conversationCount}</div>
            <div className="text-slate-400 text-sm mt-1">💬 Percakapan</div>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 text-center">
            <div className="text-3xl font-bold text-blue-400">{stats.messageCount}</div>
            <div className="text-slate-400 text-sm mt-1">📨 Pesan Terkirim</div>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 text-center col-span-2 sm:col-span-1">
            <div className="text-xl font-bold text-green-400 truncate">
              {stats.mostActiveAgent ? (agentLabels[stats.mostActiveAgent] ?? stats.mostActiveAgent) : "—"}
            </div>
            <div className="text-slate-400 text-sm mt-1">🏆 Topik Terfavorit</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-800/50 border border-slate-700 rounded-xl p-1 mb-6 w-fit">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "overview"
                ? "bg-orange-500 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            📊 Ringkasan
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "settings"
                ? "bg-orange-500 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            ⚙️ Pengaturan
          </button>
        </div>

        {/* Tab: Overview */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Recent Conversations */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-bold text-lg">🕐 Percakapan Terbaru</h2>
                <Link
                  href="/chat"
                  className="text-orange-400 hover:text-orange-300 text-sm transition-colors"
                >
                  Lihat semua →
                </Link>
              </div>

              {recentConversations.length === 0 ? (
                <div className="text-center py-10">
                  <div className="text-4xl mb-3">💬</div>
                  <p className="text-slate-400 text-sm">Belum ada percakapan tersimpan.</p>
                  <Link
                    href="/chat"
                    className="mt-3 inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Mulai Chat Sekarang
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentConversations.map((conv) => (
                    <Link key={conv.id} href="/chat">
                      <div className="flex items-center gap-3 p-3 bg-slate-700/50 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer group">
                        <div className="w-9 h-9 bg-slate-600 rounded-lg flex items-center justify-center text-lg flex-shrink-0">
                          💬
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-white text-sm font-medium truncate group-hover:text-orange-300 transition-colors">
                            {conv.title}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-slate-500 text-xs">
                              {agentLabels[conv.agentId] ?? conv.agentId}
                            </span>
                            {conv.label && (
                              <span className={`text-xs px-1.5 py-0.5 rounded border ${labelColors[conv.label] ?? "bg-slate-600 text-slate-300"}`}>
                                {conv.label}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-slate-500 text-xs flex-shrink-0">
                          {formatRelative(conv.updatedAt)}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Account Info */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
              <h2 className="text-white font-bold text-lg mb-4">👤 Informasi Akun</h2>
              <div className="space-y-3">
                {[
                  { label: "Nama Lengkap", value: user.name },
                  { label: "Email", value: user.email },
                  { label: "Peran", value: user.role === "admin" ? "Administrator" : "Pengguna" },
                  { label: "Tanggal Bergabung", value: formatDate(user.createdAt) },
                  { label: "ID Pengguna", value: `#${user.id}` },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-2 border-b border-slate-700/50 last:border-0">
                    <span className="text-slate-400 text-sm">{item.label}</span>
                    <span className="text-white text-sm font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setActiveTab("settings")}
                className="mt-4 text-orange-400 hover:text-orange-300 text-sm transition-colors"
              >
                ✏️ Edit Profil →
              </button>
            </div>
          </div>
        )}

        {/* Tab: Settings */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            <form onSubmit={handleSave} className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
              <h2 className="text-white font-bold text-lg mb-6">✏️ Edit Profil</h2>

              {/* Name */}
              <div className="mb-5">
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="Nama lengkap Anda"
                />
              </div>

              {/* Email (read-only) */}
              <div className="mb-6">
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Email <span className="text-slate-500 font-normal">(tidak dapat diubah)</span>
                </label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full bg-slate-700/50 border border-slate-700 text-slate-500 rounded-xl px-4 py-3 text-sm cursor-not-allowed"
                />
              </div>

              <hr className="border-slate-700 mb-6" />

              <h3 className="text-white font-semibold text-base mb-4">🔒 Ubah Password</h3>
              <p className="text-slate-400 text-xs mb-4">Kosongkan jika tidak ingin mengubah password.</p>

              {/* Current Password */}
              <div className="mb-4">
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Password Saat Ini
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>

              {/* New Password */}
              <div className="mb-4">
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Password Baru
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="Minimal 6 karakter"
                  autoComplete="new-password"
                />
              </div>

              {/* Confirm Password */}
              <div className="mb-6">
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Konfirmasi Password Baru
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full bg-slate-700 border rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors ${
                    confirmPassword && newPassword !== confirmPassword
                      ? "border-red-500 focus:border-red-500"
                      : "border-slate-600 focus:border-orange-500"
                  } text-white`}
                  placeholder="Ulangi password baru"
                  autoComplete="new-password"
                />
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-red-400 text-xs mt-1">Password tidak cocok</p>
                )}
              </div>

              {/* Save Message */}
              {saveMsg && (
                <div
                  className={`mb-4 px-4 py-3 rounded-xl text-sm ${
                    saveMsg.type === "success"
                      ? "bg-green-500/20 text-green-300 border border-green-500/30"
                      : "bg-red-500/20 text-red-300 border border-red-500/30"
                  }`}
                >
                  {saveMsg.type === "success" ? "✅ " : "❌ "}
                  {saveMsg.text}
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-white py-3 rounded-xl font-semibold transition-all text-sm"
              >
                {saving ? "Menyimpan..." : "💾 Simpan Perubahan"}
              </button>
            </form>

            {/* Danger Zone */}
            <div className="bg-slate-800 border border-red-500/20 rounded-2xl p-6">
              <h2 className="text-red-400 font-bold text-base mb-2">⚠️ Zona Berbahaya</h2>
              <p className="text-slate-400 text-sm mb-4">
                Menghapus semua percakapan akan menghapus riwayat chat secara permanen dan tidak dapat dikembalikan.
              </p>
              <button
                onClick={async () => {
                  if (!confirm("Yakin ingin menghapus SEMUA percakapan? Tindakan ini tidak dapat dibatalkan.")) return;
                  const res = await fetch("/api/conversations", { method: "DELETE" });
                  if (res.ok) {
                    setData((prev) =>
                      prev ? { ...prev, stats: { ...prev.stats, conversationCount: 0, messageCount: 0 }, recentConversations: [] } : prev
                    );
                    setSaveMsg({ type: "success", text: "Semua percakapan berhasil dihapus." });
                    setActiveTab("overview");
                  }
                }}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
              >
                🗑️ Hapus Semua Percakapan
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
