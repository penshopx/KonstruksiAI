"use client";

import Link from "next/link";
import { useState } from "react";

const businessFunctions = [
  { id: "real-estate", icon: "🏠", name: "Real Estate", desc: "Properti & Investasi" },
  { id: "engineering", icon: "🔧", name: "Engineering", desc: "Rekayasa & Teknik" },
  { id: "public-relations", icon: "📣", name: "Public Relations", desc: "Hubungan Publik" },
  { id: "finance", icon: "💰", name: "Finance", desc: "Keuangan & Akuntansi" },
  { id: "information-technology", icon: "💻", name: "Information Technology", desc: "Teknologi Informasi" },
  { id: "creative", icon: "🎨", name: "Creative", desc: "Desain & Kreatif" },
  { id: "religious-services", icon: "👼", name: "Religious Services", desc: "Layanan Keagamaan" },
  { id: "human-resources", icon: "👋", name: "Human Resources", desc: "SDM & Ketenagakerjaan" },
  { id: "sales", icon: "💸", name: "Sales", desc: "Penjualan & Pemasaran" },
  { id: "retail", icon: "🛍️", name: "Retail", desc: "Ritel & Distribusi" },
  { id: "entrepreneur", icon: "⚡", name: "Entrepreneur", desc: "Kewirausahaan" },
  { id: "education", icon: "🎓", name: "Education", desc: "Pendidikan & Pelatihan" },
  { id: "personal-development", icon: "💪", name: "Personal Development", desc: "Pengembangan Diri" },
  { id: "administrative", icon: "💁‍♀️", name: "Administrative", desc: "Administrasi & Tata Usaha" },
  { id: "legal", icon: "👨‍⚖️", name: "Legal", desc: "Hukum & Regulasi" },
  { id: "customer-success", icon: "🤝", name: "Customer Success", desc: "Kepuasan Pelanggan" },
  { id: "executive-management", icon: "💼", name: "Executive Management", desc: "Manajemen Eksekutif" },
  { id: "medical", icon: "🏥", name: "Medical", desc: "Kesehatan & K3" },
  { id: "customer-service", icon: "📞", name: "Customer Service", desc: "Layanan Pelanggan" },
  { id: "marketing", icon: "📈", name: "Marketing", desc: "Pemasaran & Branding" },
  { id: "media-communications", icon: "📡", name: "Media & Communications", desc: "Media & Komunikasi" },
];

const engineeringColumns = [
  { id: "konstruksi", name: "Teknik Konstruksi", shortName: "Konstruksi", color: "bg-orange-500/20 text-orange-300 border-orange-500/30", headerColor: "bg-orange-500/30" },
  { id: "tender", name: "Tender & Pengadaan", shortName: "Tender", color: "bg-blue-500/20 text-blue-300 border-blue-500/30", headerColor: "bg-blue-500/30" },
  { id: "manajemen", name: "Bisnis Konstruksi", shortName: "Bisnis", color: "bg-green-500/20 text-green-300 border-green-500/30", headerColor: "bg-green-500/30" },
  { id: "energi", name: "Energi & EBT", shortName: "Energi", color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30", headerColor: "bg-yellow-500/30" },
  { id: "migas", name: "Migas & Tambang", shortName: "Migas", color: "bg-purple-500/20 text-purple-300 border-purple-500/30", headerColor: "bg-purple-500/30" },
  { id: "perijinan", name: "Perijinan & Sertifikasi", shortName: "Perijinan", color: "bg-red-500/20 text-red-300 border-red-500/30", headerColor: "bg-red-500/30" },
];

// Matrix content: [businessFunctionId][engineeringColumnId] = topic description
const matrixTopics: Record<string, Record<string, string>> = {
  "real-estate": {
    "konstruksi": "Desain arsitektur, IMB/PBG, valuasi properti, green building",
    "tender": "Pengadaan material bangunan, kontraktor properti",
    "manajemen": "Investasi properti, manajemen aset, ROI proyek",
    "energi": "PLTS atap, green building, efisiensi energi gedung",
    "migas": "Properti kawasan industri migas, fasilitas tambang",
    "perijinan": "IMB, PBG, sertifikat laik fungsi, HGB/HM",
  },
  "engineering": {
    "konstruksi": "Teknik sipil, struktur, mekanikal, elektrikal, BIM",
    "tender": "Spesifikasi teknis, bill of quantity, evaluasi teknis",
    "manajemen": "Manajemen proyek, value engineering, QA/QC",
    "energi": "Rekayasa sistem energi, PLTS, PLTB, PLTA",
    "migas": "Rekayasa migas, pipeline, fasilitas produksi",
    "perijinan": "Sertifikasi insinyur (PII), SKK, SKA teknik",
  },
  "public-relations": {
    "konstruksi": "Komunikasi proyek, community engagement, CSR konstruksi",
    "tender": "Publikasi tender, pengumuman pemenang, transparansi",
    "manajemen": "Reputasi perusahaan konstruksi, stakeholder management",
    "energi": "Sosialisasi proyek EBT, komunikasi dampak lingkungan",
    "migas": "Hubungan masyarakat sekitar tambang, CSR migas",
    "perijinan": "Sosialisasi perijinan, konsultasi publik AMDAL",
  },
  "finance": {
    "konstruksi": "RAB, estimasi biaya, cost control proyek konstruksi",
    "tender": "Analisis harga satuan, HPS, jaminan penawaran",
    "manajemen": "Cash flow proyek, laporan keuangan kontraktor",
    "energi": "Pembiayaan proyek EBT, CAPEX/OPEX pembangkit",
    "migas": "Valuasi cadangan, cost recovery, bagi hasil PSC",
    "perijinan": "Biaya perijinan, jaminan reklamasi tambang",
  },
  "information-technology": {
    "konstruksi": "BIM (Building Information Modeling), software konstruksi",
    "tender": "E-procurement, SPSE, sistem informasi pengadaan",
    "manajemen": "ERP konstruksi, project management software",
    "energi": "SCADA, monitoring sistem energi, smart grid",
    "migas": "Sistem informasi migas, GIS eksplorasi, digital oilfield",
    "perijinan": "OSS (Online Single Submission), perijinan digital",
  },
  "creative": {
    "konstruksi": "Desain arsitektur, interior, lanskap, visualisasi 3D",
    "tender": "Desain dokumen tender, presentasi penawaran",
    "manajemen": "Branding perusahaan konstruksi, desain laporan",
    "energi": "Desain fasilitas EBT, visualisasi proyek energi",
    "migas": "Desain fasilitas industri, infografis migas",
    "perijinan": "Desain dokumen perijinan, peta kawasan",
  },
  "religious-services": {
    "konstruksi": "Konstruksi masjid, gereja, pura, vihara — standar & regulasi",
    "tender": "Pengadaan untuk fasilitas ibadah, wakaf produktif",
    "manajemen": "Manajemen yayasan keagamaan, pengelolaan aset wakaf",
    "energi": "PLTS untuk pesantren & rumah ibadah, efisiensi energi",
    "migas": "Regulasi pertambangan di kawasan adat/keagamaan",
    "perijinan": "IMB rumah ibadah, izin pendirian lembaga keagamaan",
  },
  "human-resources": {
    "konstruksi": "Sertifikasi tenaga kerja konstruksi, SKK, pelatihan",
    "tender": "Kualifikasi SDM dalam dokumen tender, tenaga ahli",
    "manajemen": "Manajemen SDM proyek, struktur organisasi kontraktor",
    "energi": "Sertifikasi teknisi EBT, pelatihan operator pembangkit",
    "migas": "K3 migas, sertifikasi pekerja tambang, BNSP",
    "perijinan": "SKA, SKT, sertifikasi profesi, LPJK",
  },
  "sales": {
    "konstruksi": "Penjualan jasa konstruksi, proposal teknis, portofolio",
    "tender": "Strategi pemenangan tender, negosiasi kontrak",
    "manajemen": "Business development kontraktor, pipeline proyek",
    "energi": "Penjualan listrik EBT, PPA (Power Purchase Agreement)",
    "migas": "Penjualan komoditas tambang, offtake agreement",
    "perijinan": "Konsultasi perijinan sebagai layanan bisnis",
  },
  "retail": {
    "konstruksi": "Toko material bangunan, distribusi produk konstruksi",
    "tender": "Pengadaan material retail untuk proyek konstruksi",
    "manajemen": "Manajemen rantai pasok material konstruksi",
    "energi": "Penjualan panel surya, peralatan EBT retail",
    "migas": "Distribusi BBM, SPBU, agen gas LPG",
    "perijinan": "Izin usaha perdagangan material konstruksi",
  },
  "entrepreneur": {
    "konstruksi": "Memulai usaha konstruksi, BUJK, modal awal",
    "tender": "Strategi ikut tender untuk perusahaan baru",
    "manajemen": "Manajemen startup konstruksi, scaling bisnis",
    "energi": "Peluang bisnis EBT, startup energi terbarukan",
    "migas": "Peluang bisnis di sektor migas, IUP, IUJP",
    "perijinan": "Pendirian perusahaan konstruksi, SBU, IUJK",
  },
  "education": {
    "konstruksi": "Kurikulum teknik sipil/arsitektur, sertifikasi dosen",
    "tender": "Pelatihan pengadaan barang/jasa, sertifikasi LKPP",
    "manajemen": "Pelatihan manajemen proyek, PMP, PRINCE2",
    "energi": "Kurikulum energi terbarukan, pelatihan teknisi EBT",
    "migas": "Pendidikan geologi/pertambangan, sertifikasi POU",
    "perijinan": "Pelatihan perijinan konstruksi, workshop regulasi",
  },
  "personal-development": {
    "konstruksi": "Karir insinyur konstruksi, pengembangan kompetensi teknik",
    "tender": "Skill negosiasi, manajemen kontrak, sertifikasi pengadaan",
    "manajemen": "Leadership proyek, manajemen waktu, soft skills PM",
    "energi": "Karir di sektor EBT, sertifikasi energi terbarukan",
    "migas": "Karir di industri migas, sertifikasi profesional tambang",
    "perijinan": "Memahami regulasi konstruksi, update peraturan terbaru",
  },
  "administrative": {
    "konstruksi": "Administrasi proyek konstruksi, dokumen kontrak, arsip",
    "tender": "Administrasi pengadaan, dokumen lelang, BAST",
    "manajemen": "Tata kelola perusahaan konstruksi, SOP, prosedur",
    "energi": "Administrasi perijinan EBT, laporan operasional",
    "migas": "Administrasi IUP, laporan produksi, dokumen K3",
    "perijinan": "Pengurusan dokumen perijinan, OSS, PTSP",
  },
  "legal": {
    "konstruksi": "Kontrak konstruksi (FIDIC, UUJK), sengketa proyek",
    "tender": "Hukum pengadaan, Perpres 16/2018, sanksi blacklist",
    "manajemen": "Hukum perusahaan konstruksi, tanggung jawab hukum",
    "energi": "Regulasi EBT, Perpres 112/2022, PPA hukum",
    "migas": "UU Minerba, UU Migas, PSC, kontrak karya",
    "perijinan": "Hukum perijinan, OSS, sanksi pelanggaran izin",
  },
  "customer-success": {
    "konstruksi": "Kepuasan klien proyek konstruksi, after-sales service",
    "tender": "Manajemen hubungan dengan pemberi kerja, evaluasi kinerja",
    "manajemen": "Customer relationship management kontraktor",
    "energi": "Layanan purna jual sistem EBT, maintenance SLA",
    "migas": "Hubungan dengan mitra bisnis migas, offtaker management",
    "perijinan": "Layanan konsultasi perijinan, pendampingan klien",
  },
  "executive-management": {
    "konstruksi": "Strategi perusahaan konstruksi, governance, board",
    "tender": "Kebijakan pengadaan korporat, strategi tender besar",
    "manajemen": "Manajemen portofolio proyek, corporate strategy",
    "energi": "Kebijakan energi perusahaan, transisi energi",
    "migas": "Strategi ekspansi migas, manajemen risiko korporat",
    "perijinan": "Compliance perusahaan, manajemen risiko regulasi",
  },
  "medical": {
    "konstruksi": "Konstruksi rumah sakit, fasilitas kesehatan, standar K3",
    "tender": "Pengadaan alat kesehatan, konstruksi fasilitas medis",
    "manajemen": "Manajemen proyek fasilitas kesehatan",
    "energi": "Sistem energi rumah sakit, backup power, PLTS RS",
    "migas": "K3 industri migas, kesehatan kerja tambang, HIPERKES",
    "perijinan": "Izin mendirikan RS, sertifikasi fasilitas kesehatan",
  },
  "customer-service": {
    "konstruksi": "Layanan informasi proyek, complaint handling konstruksi",
    "tender": "Layanan informasi pengadaan, aanwijzing, sanggahan",
    "manajemen": "Layanan pelanggan perusahaan konstruksi",
    "energi": "Layanan pelanggan PLN, pengaduan gangguan listrik",
    "migas": "Layanan informasi migas, pengaduan masyarakat",
    "perijinan": "Layanan informasi perijinan, PTSP, call center OSS",
  },
  "marketing": {
    "konstruksi": "Pemasaran jasa konstruksi, portofolio proyek, branding",
    "tender": "Strategi pemasaran untuk memenangkan tender",
    "manajemen": "Marketing plan perusahaan konstruksi, digital marketing",
    "energi": "Pemasaran produk EBT, edukasi pasar energi hijau",
    "migas": "Pemasaran komoditas tambang, market intelligence",
    "perijinan": "Pemasaran jasa konsultasi perijinan",
  },
  "media-communications": {
    "konstruksi": "Liputan proyek konstruksi, jurnalisme teknik, dokumentasi",
    "tender": "Publikasi pengumuman tender, transparansi pengadaan",
    "manajemen": "Komunikasi korporat kontraktor, laporan tahunan",
    "energi": "Komunikasi transisi energi, edukasi publik EBT",
    "migas": "Komunikasi industri migas, laporan keberlanjutan",
    "perijinan": "Sosialisasi regulasi, publikasi kebijakan perijinan",
  },
};

export default function MatrixPage() {
  const [hoveredCell, setHoveredCell] = useState<{ row: string; col: string } | null>(null);
  const [selectedCell, setSelectedCell] = useState<{ row: string; col: string } | null>(null);

  const getCellTopic = (businessId: string, colId: string) => {
    return matrixTopics[businessId]?.[colId] || "Konsultasi lintas bidang";
  };

  const getSelectedBusiness = () => businessFunctions.find(b => b.id === selectedCell?.row);
  const getSelectedColumn = () => engineeringColumns.find(c => c.id === selectedCell?.col);

  const buildChatUrl = (businessId: string, colId: string) => {
    const business = businessFunctions.find(b => b.id === businessId);
    const col = engineeringColumns.find(c => c.id === colId);
    const topic = getCellTopic(businessId, colId);
    const question = `Saya bekerja di bidang ${business?.name}. Tolong jelaskan tentang ${topic} dalam konteks ${col?.name}.`;
    return `/chat?q=${encodeURIComponent(question)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                  K
                </div>
                <div>
                  <span className="text-white font-bold text-lg">KonstruksiAI</span>
                  <span className="text-slate-400 text-xs block leading-none">Asisten Cerdas Keteknikan Indonesia</span>
                </div>
              </Link>
            </div>
            <nav className="hidden md:flex items-center gap-4">
              <Link href="/konstruksi" className="text-slate-300 hover:text-white text-sm transition-colors">Konstruksi</Link>
              <Link href="/energi" className="text-slate-300 hover:text-white text-sm transition-colors">Energi</Link>
              <Link href="/migas" className="text-slate-300 hover:text-white text-sm transition-colors">Migas</Link>
              <Link href="/matrix" className="text-orange-400 hover:text-orange-300 text-sm transition-colors font-medium">Matriks</Link>
              <Link href="/chat" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Mulai Chat
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Page Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-full px-4 py-1.5 mb-4">
            <span className="text-orange-300 text-sm font-medium">📊 Matriks Ruang Lingkup</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Keteknikan × Fungsi Bisnis
          </h1>
          <p className="text-slate-400 text-lg max-w-3xl mx-auto">
            Eksplorasi keterhubungan antara <strong className="text-white">bidang keteknikan konstruksi</strong> dengan{" "}
            <strong className="text-white">21 fungsi bisnis & profesional</strong>. Klik sel matriks untuk langsung konsultasi AI.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {engineeringColumns.map((col) => (
            <div key={col.id} className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${col.color}`}>
              <span>{col.shortName}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Matrix Table */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left p-4 text-slate-400 text-sm font-medium w-48 bg-slate-900/50">
                    Fungsi Bisnis / Bidang
                  </th>
                  {engineeringColumns.map((col) => (
                    <th key={col.id} className={`p-3 text-center text-xs font-semibold ${col.headerColor} border-l border-slate-700`}>
                      <div className="text-white">{col.shortName}</div>
                      <div className="text-slate-400 font-normal text-xs mt-0.5 hidden lg:block">{col.name}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {businessFunctions.map((business, rowIdx) => (
                  <tr
                    key={business.id}
                    className={`border-b border-slate-700/50 ${rowIdx % 2 === 0 ? "bg-slate-800/20" : "bg-slate-800/40"}`}
                  >
                    <td className="p-3 bg-slate-900/30 border-r border-slate-700">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{business.icon}</span>
                        <div>
                          <div className="text-white text-sm font-medium">{business.name}</div>
                          <div className="text-slate-500 text-xs">{business.desc}</div>
                        </div>
                      </div>
                    </td>
                    {engineeringColumns.map((col) => {
                      const topic = getCellTopic(business.id, col.id);
                      const isHovered = hoveredCell?.row === business.id && hoveredCell?.col === col.id;
                      const isSelected = selectedCell?.row === business.id && selectedCell?.col === col.id;
                      return (
                        <td
                          key={col.id}
                          className={`p-2 border-l border-slate-700/50 cursor-pointer transition-all ${
                            isSelected
                              ? "bg-orange-500/20 border-orange-500/50"
                              : isHovered
                              ? "bg-slate-700/60"
                              : "hover:bg-slate-700/40"
                          }`}
                          onMouseEnter={() => setHoveredCell({ row: business.id, col: col.id })}
                          onMouseLeave={() => setHoveredCell(null)}
                          onClick={() => setSelectedCell(isSelected ? null : { row: business.id, col: col.id })}
                        >
                          <div className="text-center">
                            <div className={`w-2 h-2 rounded-full mx-auto mb-1 ${isSelected ? "bg-orange-400" : "bg-slate-600"}`}></div>
                            <div className="text-slate-400 text-xs leading-tight hidden lg:block line-clamp-2">
                              {topic.split(",")[0]}
                            </div>
                            <div className="text-slate-500 text-xs lg:hidden">✓</div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Cell Detail Panel */}
        {selectedCell && (
          <div className="mt-6 bg-slate-800 border border-orange-500/30 rounded-2xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{getSelectedBusiness()?.icon}</span>
                  <div>
                    <div className="text-white font-bold text-lg">{getSelectedBusiness()?.name}</div>
                    <div className="text-slate-400 text-sm">× {getSelectedColumn()?.name}</div>
                  </div>
                </div>
                <p className="text-slate-300 text-base mb-4">
                  {getCellTopic(selectedCell.row, selectedCell.col)}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={buildChatUrl(selectedCell.row, selectedCell.col)}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    💬 Konsultasi AI Sekarang
                  </Link>
                  <button
                    onClick={() => setSelectedCell(null)}
                    className="border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
                  >
                    Tutup
                  </button>
                </div>
              </div>
              <div className="hidden md:block text-right">
                <div className="text-slate-500 text-xs mb-1">Topik Terkait</div>
                <div className="text-slate-400 text-sm max-w-xs text-right">
                  {getCellTopic(selectedCell.row, selectedCell.col)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Info Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
            <div className="text-2xl mb-2">📊</div>
            <h3 className="text-white font-semibold mb-1">126 Titik Koneksi</h3>
            <p className="text-slate-400 text-sm">21 fungsi bisnis × 6 bidang keteknikan = 126 kombinasi topik konsultasi</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
            <div className="text-2xl mb-2">🎯</div>
            <h3 className="text-white font-semibold mb-1">Konsultasi Kontekstual</h3>
            <p className="text-slate-400 text-sm">Klik sel matriks untuk langsung ke chat dengan konteks bidang yang spesifik</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
            <div className="text-2xl mb-2">🔗</div>
            <h3 className="text-white font-semibold mb-1">Lintas Disiplin</h3>
            <p className="text-slate-400 text-sm">Teknik konstruksi terhubung dengan semua aspek bisnis dan profesional</p>
          </div>
        </div>
      </section>
    </div>
  );
}
