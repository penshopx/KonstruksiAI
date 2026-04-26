import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KonstruksiAI — Asisten Cerdas Bidang Konstruksi",
  description: "Asisten AI khusus bidang keteknikan & konstruksi: tender, manajemen bisnis konstruksi, perijinan, dan sertifikasi profesional.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-slate-50">
        {children}
      </body>
    </html>
  );
}
