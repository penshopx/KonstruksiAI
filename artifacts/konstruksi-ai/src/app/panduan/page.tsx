import Link from "@/shims/next-link";
import NavbarAuth from "@/components/NavbarAuth";

const userModules = [
  {
    title: "Tanya AI dan gunakan solver",
    description:
      "Mulai dari Chat AI untuk bertanya dengan konteks pekerjaan. Gunakan Solver, Tools, atau Matriks untuk kebutuhan analisis dan alat kerja yang tersedia.",
    links: [
      { label: "Chat AI", href: "/chat" },
      { label: "Solver", href: "/solver" },
      { label: "Tools", href: "/tools" },
      { label: "Matriks", href: "/matrix" },
    ],
  },
  {
    title: "Siapkan dan telaah tender",
    description:
      "Gunakan Tender & Pengadaan untuk panduan tender, Tender Eligibility untuk meninjau kelayakan, dan Tender Intelligence untuk analisis berdasarkan informasi serta status dokumen yang Anda masukkan.",
    links: [
      { label: "Tender & Pengadaan", href: "/tender" },
      { label: "Tender Eligibility", href: "/tender-eligibility" },
      { label: "Tender Intelligence", href: "/tender-intelligence" },
    ],
  },
  {
    title: "Kelola legalitas dan bukti",
    description:
      "Tinjau informasi legalitas dan kesiapan SBU/SKK, lalu gunakan Evidence Mapping untuk menghubungkan bukti yang relevan dengan kebutuhan.",
    links: [
      { label: "Legal & Licensing", href: "/legal-licensing" },
      { label: "SBU Readiness", href: "/sbu-readiness" },
      { label: "SKK Readiness", href: "/skk-readiness" },
      { label: "Evidence Mapping", href: "/evidence-mapping" },
    ],
  },
  {
    title: "Belajar dan mengikuti perkembangan",
    description:
      "Gunakan materi Knowledge, Bimtek, Simulasi, dan Sertifikasi untuk belajar. Baca Radar Konstruksi sebagai ringkasan perkembangan dan buka sumber yang dirujuk untuk verifikasi.",
    links: [
      { label: "Knowledge", href: "/knowledge" },
      { label: "Bimtek", href: "/bimtek" },
      { label: "Simulasi", href: "/simulasi" },
      { label: "Sertifikasi", href: "/certify" },
      { label: "Radar Konstruksi", href: "/radar-konstruksi" },
    ],
  },
  {
    title: "Atur konteks kerja tim",
    description:
      "Buat atau buka Ruang Proyek untuk mengelompokkan konteks pekerjaan. Pemilik dapat mengundang anggota sebagai editor atau viewer; viewer hanya membaca, sedangkan editor dapat memperbarui catatan dan tahap.",
    links: [
      { label: "Ruang Proyek", href: "/ruang-proyek" },
      { label: "Workforce", href: "/workforce-assignment" },
    ],
  },
];

function ModuleCard({
  title,
  description,
  links,
}: (typeof userModules)[number]) {
  return (
    <article className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-300">{description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-cyan-200 transition-colors hover:border-cyan-400/50 hover:bg-slate-700"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </article>
  );
}

export default function UserGuidePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-white/10 bg-slate-950/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-lg font-bold tracking-tight text-white">
            KONSTRUKSI<span className="text-orange-400">AI</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="hidden text-sm text-slate-400 hover:text-white sm:block">
              Beranda
            </Link>
            <NavbarAuth />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 pb-28 sm:px-6 sm:py-12 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-slate-500">
          <Link href="/" className="hover:text-white">Beranda</Link>
          <span aria-hidden="true" className="mx-2">/</span>
          <span className="text-slate-300">Panduan Penggunaan</span>
        </nav>

        <section className="rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/50 p-6 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
            KonstruksiAI
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Panduan Penggunaan Aplikasi
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-base">
            Panduan ringkas untuk menemukan fitur, mengelola konteks pekerjaan,
            dan memahami batas akses pengguna maupun administrator.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#untuk-pengguna"
              className="rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-400"
            >
              Panduan Pengguna
            </a>
            <a
              href="#untuk-admin"
              className="rounded-xl border border-slate-600 bg-slate-800/70 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:border-slate-400"
            >
              Panduan Admin
            </a>
          </div>
        </section>

        <section id="untuk-pengguna" className="scroll-mt-8 pt-12">
          <div className="mb-6 max-w-3xl">
            <p className="text-sm font-semibold text-cyan-300">01 · PENGGUNA</p>
            <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
              Panduan untuk Pengguna
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400 sm:text-base">
              Ikuti langkah berikut untuk memulai dan memilih fitur sesuai pekerjaan Anda.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <span className="text-xs font-bold text-orange-300">LANGKAH 1</span>
              <h3 className="mt-2 text-lg font-semibold text-white">Masuk dan periksa profil</h3>
              <div className="mt-4 flex flex-wrap gap-3 text-sm">
                <Link href="/register" className="text-cyan-300 hover:text-cyan-200">Daftar</Link>
                <Link href="/login" className="text-cyan-300 hover:text-cyan-200">Masuk</Link>
                <Link href="/profile" className="text-cyan-300 hover:text-cyan-200">Profil</Link>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                Buat akun atau masuk, lalu buka Dashboard dan Profil untuk melihat
                informasi akun serta percakapan terbaru.
              </p>
            </article>
            <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <span className="text-xs font-bold text-orange-300">LANGKAH 2</span>
              <h3 className="mt-2 text-lg font-semibold text-white">Pilih fitur dan beri konteks</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                Pilih modul yang paling sesuai. Jelaskan jenis proyek, tahap pekerjaan,
                lokasi, dan kebutuhan agar pertanyaan atau analisis lebih terarah.
              </p>
              <Link href="/chat" className="mt-4 inline-flex text-sm text-cyan-300 hover:text-cyan-200">
                Buka Chat AI
              </Link>
            </article>
            <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <span className="text-xs font-bold text-orange-300">LANGKAH 3</span>
              <h3 className="mt-2 text-lg font-semibold text-white">Tinjau dan simpan hasil</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                Periksa hasil dan sumbernya sebelum dipakai. Gunakan riwayat yang
                tersedia pada modul terkait untuk membuka kembali hasil tersimpan.
              </p>
            </article>
          </div>

          <h3 className="mb-4 mt-10 text-xl font-bold text-white">Pilih Modul</h3>
          <div className="grid gap-4 lg:grid-cols-2">
            {userModules.map((module) => <ModuleCard key={module.title} {...module} />)}
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <aside className="rounded-2xl border border-blue-400/20 bg-blue-400/[0.06] p-5">
              <h3 className="font-semibold text-blue-100">Kolaborasi di Ruang Proyek</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                Undangan berlaku 7 hari dan harus diterima oleh akun yang dituju.
                Viewer hanya dapat membaca; editor dapat memperbarui catatan dan tahap.
                Peran ini berlaku di ruang proyek, bukan peran administrator aplikasi.
              </p>
              <Link href="/ruang-proyek" className="mt-3 inline-flex text-sm text-cyan-300 hover:text-cyan-200">
                Buka Ruang Proyek
              </Link>
            </aside>
            <aside className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] p-5">
              <h3 className="font-semibold text-amber-100">Periksa Keluaran AI</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                Keluaran AI adalah bahan bantu, bukan keputusan teknis atau hukum.
                Cocokkan dengan dokumen proyek dan ketentuan resmi. Tender Intelligence
                menganalisis status dokumen yang Anda masukkan; fitur ini bukan
                integrasi langsung dengan data pengadaan LPSE.
              </p>
            </aside>
          </div>
        </section>

        <section id="untuk-admin" className="scroll-mt-8 pt-14">
          <div className="mb-6 max-w-3xl">
            <p className="text-sm font-semibold text-orange-300">02 · ADMINISTRATOR</p>
            <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
              Panduan untuk Admin
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400 sm:text-base">
              Admin aplikasi memiliki akses yang berbeda dari pemilik atau editor ruang proyek.
              Kontrol admin yang tersedia saat ini berfokus pada pemeriksaan provider AI Tender.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
              <span className="text-xs font-bold text-orange-300">ADMIN APLIKASI</span>
              <h3 className="mt-2 text-lg font-semibold text-white">Periksa konfigurasi provider AI</h3>
              <ol className="mt-4 list-inside list-decimal space-y-3 text-sm leading-relaxed text-slate-300">
                <li>Masuk menggunakan akun yang memiliki peran administrator aplikasi aktif.</li>
                <li>Buka <Link href="/tender-intelligence" className="text-cyan-300 hover:text-cyan-200">Tender Intelligence</Link>.</li>
                <li>Pada panel konfigurasi AI administrator, pilih <strong className="text-white">Periksa konfigurasi AI</strong>.</li>
                <li>Baca status dan tindakan yang disarankan. Hasil pemeriksaan hanya menggambarkan kondisi saat pemeriksaan dilakukan.</li>
              </ol>
              <p className="mt-4 rounded-xl border border-amber-400/20 bg-amber-400/[0.06] p-4 text-sm leading-relaxed text-amber-100">
                Pemeriksaan mengirim permintaan uji singkat, memakai sedikit kuota AI,
                tidak mengirim dokumen proyek, dan tidak mengulang otomatis.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
              <span className="text-xs font-bold text-orange-300">RIWAYAT DAN KREDENSIAL</span>
              <h3 className="mt-2 text-lg font-semibold text-white">Jaga pemeriksaan tetap aman</h3>
              <ul className="mt-4 list-inside list-disc space-y-3 text-sm leading-relaxed text-slate-300">
                <li>Riwayat menampilkan maksimal 50 pemeriksaan terbaru dan disimpan selama 180 hari.</li>
                <li>Periksa status, waktu, dan hasil audit bila troubleshooting provider diperlukan.</li>
                <li>Panel ini hanya memeriksa konektivitas dan akses provider; panel tidak menampilkan atau mengubah API key.</li>
                <li>Jangan menempelkan API key, token, atau kredensial ke Chat AI maupun dokumen proyek.</li>
              </ul>
            </article>

            <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
              <span className="text-xs font-bold text-orange-300">PEMILIK RUANG PROYEK</span>
              <h3 className="mt-2 text-lg font-semibold text-white">Kelola akses tim pada ruang</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                Pemilik ruang dapat mengundang anggota sebagai viewer atau editor dan
                mencabut akses anggota. Viewer hanya membaca; editor dapat memperbarui
                catatan dan tahap. Undangan aktif berlaku 7 hari. Kepemilikan ruang tidak
                memberikan hak administrator aplikasi atau akses pemeriksaan provider.
              </p>
              <Link href="/ruang-proyek" className="mt-4 inline-flex text-sm text-cyan-300 hover:text-cyan-200">
                Buka pengelolaan Ruang Proyek
              </Link>
            </article>

            <aside className="rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.05] p-6">
              <h3 className="text-lg font-semibold text-white">Jika panel admin tidak terlihat</h3>
              <ul className="mt-3 list-inside list-disc space-y-2 text-sm leading-relaxed text-slate-300">
                <li>Pastikan Anda masuk ke akun yang benar dan buka ulang halaman Tender Intelligence.</li>
                <li>Jika akses baru saja dicabut atau berubah, muat ulang halaman atau masuk kembali.</li>
                <li>Jika akun bukan administrator aplikasi, hubungi pengelola aplikasi untuk pemeriksaan hak akses.</li>
              </ul>
            </aside>
          </div>
        </section>

        <footer className="mt-14 border-t border-slate-800 py-6 text-sm text-slate-500">
          <Link href="/" className="text-cyan-300 hover:text-cyan-200">Kembali ke Beranda</Link>
          <span className="mx-2" aria-hidden="true">·</span>
          <span>Panduan mengikuti fitur yang tersedia pada aplikasi saat ini.</span>
        </footer>
      </main>
    </div>
  );
}
