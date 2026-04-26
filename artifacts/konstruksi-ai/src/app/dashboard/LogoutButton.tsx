"use client";

import { useRouter } from "@/shims/next-navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="text-slate-400 hover:text-red-400 text-sm transition-colors disabled:opacity-50"
    >
      {loading ? "..." : "Keluar"}
    </button>
  );
}
