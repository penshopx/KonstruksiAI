"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  userId: number;
  name: string;
  email: string;
  role: string;
}

export default function NavbarAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        setUser(data.user);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
    router.refresh();
  };

  if (loading) {
    return <div className="w-24 h-8 bg-slate-700 rounded-lg animate-pulse" />;
  }

  if (user) {
    const initials = user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    return (
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
        >
          <div className="w-8 h-8 bg-orange-500/20 border border-orange-500/40 rounded-full flex items-center justify-center text-orange-300 text-xs font-bold">
            {initials}
          </div>
          <span className="text-sm hidden sm:block">{user.name}</span>
        </Link>
        <Link
          href="/profile"
          className="text-slate-400 hover:text-orange-300 text-sm transition-colors hidden sm:block"
          title="Profil Saya"
        >
          ⚙️
        </Link>
        <button
          onClick={handleLogout}
          className="text-slate-400 hover:text-red-400 text-sm transition-colors"
        >
          Keluar
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/login"
        className="text-slate-300 hover:text-white text-sm transition-colors px-3 py-1.5"
      >
        Masuk
      </Link>
      <Link
        href="/register"
        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
      >
        Daftar
      </Link>
    </div>
  );
}
