"use client";

import Link from "@/shims/next-link";
import { useState } from "react";

const businessFunctions = [
  { id: "perencanaan", icon: "📅", name: "Perencanaan Proyek", desc: "Perencanaan & Jadwal" },
  { id: "desain", icon: "📐", name: "Desain & Engineering", desc: "Rekayasa & Teknik" },
  { id: "estimasi", icon: "💰", name: "Estimasi & RAB", desc: "Biaya & Anggaran" },
  { id: "pengadaan", icon: "📋", name: "Pengadaan & Tender", desc: "Procurement" },
  { id: "pelaksanaan", icon: "🏗️", name: "Pelaksanaan Konstruksi", desc: "Eksekusi Lapangan" },
  { id: "pengawasan", icon: "🔍", name: "Pengawasan & QC", desc: "Quality Control" },
  { id: "k3", icon: "⛑️", name: "K3 & Keselamatan", desc: "Health, Safety, Environment" },
  { id: "lingkungan", icon: "🌿", name: "Lingkungan & AMDAL", desc: "Analisis Dampak" },
  { id: "perijinan", icon: "📜", name: "Perijinan & Regulasi", desc: "Izin & Sertifikasi" },
  { id: "kontrak", icon: "🤝", name: "Kontrak & Hukum", desc: "Legal & Kontrak" },
  { id: "keuangan", icon: "💹", name: "Keuangan & Akuntansi", desc: "Finance & Accounting" },
  { id: "sdm", icon: "👥", name: "SDM & Organisasi", desc: "Human Resources" },
  { id: "teknologi", icon: "💻", name: "Teknologi & Inovasi", desc: "BIM & Digitalisasi" },
  { id: "logistik", icon: "🚛", name: "Logistik & Material", desc: "Supply Chain" },
  { id: "komisioning", icon: "✅", name: "Komisioning & Serah Terima", desc: "Testing & Handover" },
  { id: "operasi", icon: "⚙️", name: "Operasi & Pemeliharaan", desc: "O&M" },
  { id: "audit", icon: "🔎", name: "Audit & Compliance", desc: "Pemeriksaan" },
  { id: "risiko", icon: "⚠️", name: "Manajemen Risiko", desc: "Risk Management" },
  { id: "komunikasi", icon: "📣", name: "Komunikasi & Stakeholder", desc: "Hubungan Pemangku" },
  { id: "laporan", icon: "📊", name: "Pelaporan & Dokumentasi", desc: "Reporting" },
  { id: "strategi", icon: "🎯", name: "Strategi & Pengembangan Bisnis", desc: "Business Development" },
];

const engineeringColumns = [
  { id: "konstruksi_gedung", name: "Konstruksi Gedung", shortName: "Gedung", color: "bg-orange-500/20 text-orange-300 border-orange-500/30", headerColor: "bg-orange-500/30" },
  { id: "konstruksi_jalan", name: "Konstruksi Jalan & Jembatan", shortName: "Jalan", color: "bg-blue-500/20 text-blue-300 border-blue-500/30", headerColor: "bg-blue-500/30" },
  { id: "mekanikal", name: "Teknik Mekanikal", shortName: "Mekanikal", color: "bg-purple-500/20 text-purple-300 border-purple-500/30", headerColor: "bg-purple-500/30" },
  { id: "elektrikal", name: "Teknik Elektrikal", shortName: "Elektrikal", color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30", headerColor: "bg-yellow-500/30" },
  { id: "tatalingkungan", name: "Teknik Tata Lingkungan", shortName: "Lingkungan", color: "bg-green-500/20 text-green-300 border-green-500/30", headerColor: "bg-green-500/30" },
  { id: "manajemen", name: "Manajemen Konstruksi", shortName: "Manajemen", color: "bg-red-500/20 text-red-300 border-red-500/30", headerColor: "bg-red-500/30" },
  // Domain baru: Ketenagalistrikan, EBT, Pertambangan, Migas
  { id: "ketenagalistrikan", name: "Ketenagalistrikan", shortName: "Listrik", color: "bg-amber-500/20 text-amber-300 border-amber-500/30", headerColor: "bg-amber-500/30" },
  { id: "ebt", name: "Energi Baru Terbarukan", shortName: "EBT", color: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30", headerColor: "bg-cyan-500/30" },
  { id: "pertambangan_mineral", name: "Pertambangan Mineral", shortName: "Minerba", color: "bg-slate-500/20 text-slate-300 border-slate-500/30", headerColor: "bg-slate-500/30" },
  { id: "migas_energi", name: "Migas & Energi Fosil", shortName: "Migas", color: "bg-rose-500/20 text-rose-300 border-rose-500/30", headerColor: "bg-rose-500/30" },
];

// Matrix content: [KBLIbusinessFunctionId][SKKNIengineeringColumnId] = topic description
const matrixTopics: Record<string, Record<string, string>> = {
  // KBLI 41011/41012 - Konstruksi Gedung
  "gedung": {
    "konstruksi_gedung": "Desain struktur gedung, fondasi, kolom, balok, plat, BIM",
    "konstruksi_jalan": "Parkir gedung, akses jalan internal, drainase kawasan",
    "mekanikal": "HVAC, AC, sistem plumbing, fire protection mekanikal",
    "elektrikal": "Distribusi listrik, genset, panel, lighting, CCTV, PV system",
    "tatalingkungan": "Landscape, taman rooftop, pengolahan air limbah gedung",
    "manajemen": "Manajemen proyek gedung, scheduling, cost control, QC",
  },
  // KBLI 42101 - Konstruksi Jalan & Rel Kereta
  "jalan": {
    "konstruksi_gedung": "Ruang operasi jalan tol, gedung kontrol, gerbang tol",
    "konstruksi_jalan": "Perkerasan jalan, aspal, beton, drainase, jembatan",
    "mekanikal": "Sistem penerangan jalan, traffic light, VMS",
    "elektrikal": "Listrik jalur, signal铁路, komunikasi kereta",
    "tatalingkungan": "Tree planting jalan,批処理, lingkungan sekitar jalan",
    "manajemen": "Manajemen proyek jalan, kontraktor, progres, quality",
  },
  // KBLI 42103 - Konstruksi Jembatan & Terowongan
  "jembatan": {
    "konstruksi_gedung": "Pier, abutment, fondasi jembatan, struktur penahan",
    "konstruksi_jalan": "Konstruksi gelagar, box girder, cable stayed, suspensi",
    "mekanikal": "Expansion joint, bearing, sistem drainase jembatan",
    "elektrikal": "Lighting jembatan, sistem keamanan, monitoring",
    "tatalingkungan": "Dampak lingkungan jembatan,批处理生态",
    "manajemen": "Manajemen konstruksi jembatan, metodestring, keselamatan",
  },
  // KBLI 42201-42204 - Konstruksi Jaringan Utilitas
  "utilitas": {
    "konstruksi_gedung": "Utility building, pompa, kompartemen utilitas",
    "konstruksi_jalan": "Pemasangan pipa, kabel, ducting bawah tanah",
    "mekanikal": "Sistem pompa, kompresor, katup kontrol",
    "elektrikal": "Jaringan distribusi listrik, trafo, jaringan fiber optik",
    "tatalingkungan": "Pengelolaan air bersih, limbah, sanitasi",
    "manajemen": "Manajemen jaringan utilitas, pemeliharaan, operasi",
  },
  // KBLI 42911-42913 - Konstruksi Bangunan Air & Pelabuhan
  "bangunan_air": {
    "konstruksi_gedung": "Gedung pelabuhan, dermaga, warehouse pelabuhan",
    "konstruksi_jalan": "Pantai, breakwater, quay wall, trestle",
    "mekanikal": "Cargo handling equipment, crane, conveyor, sistem消火",
    "elektrikal": "Listrik pelabuhan, shore connection, lighting",
    "tatalingkungan": "Dredging, pengelolaan sediment,批处理海岸",
    "manajemen": "Manajemen proyek pelabuhan, scheduling, kontraktor",
  },
  // KBLI 41013 - Konstruksi Pabrik & Industri
  "pabrik": {
    "konstruksi_gedung": "Struktur pabrik, warehouse, office building pabrik",
    "konstruksi_jalan": "Jalan akses pabrik, parking, drainase kawasan",
    "mekanikal": "Mesin produksi, pipeline, sistem udara terkompresi",
    "elektrikal": "Power plant internal, distribusi listrik pabrik",
    "tatalingkungan": "IPAL, pengelolaan limbah industri,批处理废气",
    "manajemen": "Manajemen proyek industri, EPC, commissioning",
  },
  // KBLI 43211 - Instalasi Kelistrikan
  "listrik": {
    "konstruksi_gedung": "Instalasi listrik gedung, wiring, panel, DB",
    "konstruksi_jalan": "Instalasi listrik jalan toll, lampu jalan",
    "mekanikal": "Motor control, pompa listrik, sistem pendingin",
    "elektrikal": "Instalasi Listrik, genset, UPS, PV system, grounding",
    "tatalingkungan": "Energi terbarukan gedung, efisiensi energi",
    "manajemen": "Manajemen proyek elektrikal, safety, compliance",
  },
  // KBLI 43212 - Instalasi Mekanikal
  "mekanikal": {
    "konstruksi_gedung": "Instalasi AC, ventilasi, sistem fire protection",
    "konstruksi_jalan": "Instalasi mekanikal jembatan, expansion joint",
    "mekanikal": "Piping, ducting, sprinkler, fire alarm, lift/escalator",
    "elektrikal": "Kontrol mekanikal, sensor, building automation",
    "tatalingkungan": "HVAC, ventilasi, kualitas udara dalam ruangan",
    "manajemen": "Manajemen proyek MEP, commissioning, O&M",
  },
  // KBLI 43301-43309 - Finishing Bangunan
  "finishing": {
    "konstruksi_gedung": "Finishing dinding, lantai, plafon,江西, cat",
    "konstruksi_jalan": "Finishing jalan, marking, guardrail",
    "mekanikal": "Finishing mechanical room, installation perangkat mekanikal",
    "elektrikal": "Finishing panel room, instalasi devices elektrikal",
    "tatalingkungan": "Taman, landscape,批处理 dalam gedung",
    "manajemen": "Manajemen finishing, quality control, progress",
  },
  // KBLI 77302 - Sewa Alat Konstruksi
  "persewaan": {
    "konstruksi_gedung": "Sewa tower crane, scaffolding, formwork gedung",
    "konstruksi_jalan": "Sewa excavator, bulldozer, asphalt finisher jalan",
    "mekanikal": "Sewa genset, kompresor, alat berat mekanikal",
    "elektrikal": "Sewa genset mobile, lighting tower",
    "tatalingkungan": "Sewa alat pengolahan air,批处理 waste",
    "manajemen": "Manajemen rental alat, maintenance, availability",
  },
  // KBLI 71101/71102 - Jasa Desain & Arsitektur
  "desain": {
    "konstruksi_gedung": "Desain arsitektur gedung, denah, tampak, 3D render",
    "konstruksi_jalan": "Desain geometrik jalan, interchange, roundabout",
    "mekanikal": "Desain MEP, HVAC layout, plumbing design",
    "elektrikal": "Desain distribusi listrik, lighting design, PFFA",
    "tatalingkungan": "Desain landscape, taman,批处理 lingkungan",
    "manajemen": "Desain manajemen proyek, construction methodology",
  },
  // KBLI 71102 - Jasa Konsultansi Konstruksi
  "konsultansi": {
    "konstruksi_gedung": "Konsultansi sipil gedung, struktur, fondasi",
    "konstruksi_jalan": "Konsultansi jalan, jembatan, drainase",
    "mekanikal": "Konsultansi MEP, fire protection, HVAC",
    "elektrikal": "Konsultansi elektrikal, power system, coordination",
    "tatalingkungan": "Konsultansi AMDAL, UKL-UPL,批处理环境",
    "manajemen": "Konsultansi manajemen proyek, peer review, supervision",
  },
  // KBLI 4111 - Jasa Pengadaan Konstruksi
  "pengadaan": {
    "konstruksi_gedung": "Pengadaan material gedung, steel, beton, formwork",
    "konstruksi_jalan": "Pengadaan aspal, beton, material jalan",
    "mekanikal": "Pengadaan AC, lift, fire equipment",
    "elektrikal": "Pengadaan panel, kabel, transformator",
    "tatalingkungan": "Pengadaan tanaman, material landscape",
    "manajemen": "Procurement management, tender, vendor evaluation",
  },
  // KBLI 71102 - Manajemen Proyek Konstruksi
  "manajemen": {
    "konstruksi_gedung": "Project management gedung, PMO, reporting",
    "konstruksi_jalan": "Manajemen proyek jalan, koordinasi lapangan",
    "mekanikal": "Manajemen MEP, coordination, clash detection",
    "elektrikal": "Manajemen Elektrikal, scheduling, commissioning",
    "tatalingkungan": "Manajemen lingkungan proyek, monitoring, compliance",
    "manajemen": "Project management overall, cost, time, quality",
  },
  // KBLI 71201 - Jasa Inspeksi & Pengujian
  "inpeksi": {
    "konstruksi_gedung": "Inspeksi struktur gedung, QC, pengujian beton",
    "konstruksi_jalan": "Inspeksi kualitas jalan, thickness, density",
    "mekanikal": "Inspeksi AC, fire system, pressure testing",
    "elektrikal": "Inspeksi instalasi listrik, grounding, relay test",
    "tatalingkungan": "Pengujian kualitas air, udara,批处理",
    "manajemen": "QA/QC management, audit, compliance check",
  },
  // KBLI 43110 - Pembongkaran & Persiapan Lahan
  "demolisi": {
    "konstruksi_gedung": "Demolisi gedung, dekonstruksi, selective dismantling",
    "konstruksi_jalan": "Demolisi jalan lama, pembongkaran jembatan",
    "mekanikal": "Pembongkaran sistem mekanikal, dem歧途",
    "elektrikal": "Pembongkaran instalasi listrik lama",
    "tatalingkungan": "Rehabilitasi lahan,批处理 contaminated land",
    "manajemen": "Manajemen demolisi, waste management, safety",
  },
  // KBLI 05-08 - Pertambangan & Penggalian
  "pertambangan": {
    "konstruksi_gedung": "Fasilitas pendukung tambang, crusher, stockpile",
    "konstruksi_jalan": "Jalan tambang, haul road, bridge crusher",
    "mekanikal": "Mesin tambang, conveyor, sistem crushing",
    "elektrikal": "Listrik tambang, distribution, crusher elektrikal",
    "tatalingkungan": "Reklamasi tambang,批处理 tailing, AMDAL tambang",
    "manajemen": "Manajemen operasi tambang, production, safety",
  },
  // KBLI 42202/42203 - Konstruksi Pembangkit Energi
  "energi": {
    "konstruksi_gedung": "Gedung kontrol pembangkit, turbine hall",
    "konstruksi_jalan": "Konstruksi PLTS ground mount, PLTB foundation",
    "mekanikal": "Turbin, generator, boiler, cooling system",
    "elektrikal": "Generator, transformator, switchyard, grid connection",
    "tatalingkungan": "Dampak lingkungan pembangkit,批处理,鸟类保护",
    "manajemen": "Manajemen proyek pembangkit, EPC, COD, O&M",
  },
  // KBLI 42204 - Jaringan Telekomunikasi
  "telekomunikasi": {
    "konstruksi_gedung": "Gedung BTS, data center, server room",
    "konstruksi_jalan": "Jaringan fiber optik, ducting jalan",
    "mekanikal": "Sistem pendingin data center, HVAC tower",
    "elektrikal": "Power system telekomunikasi, backup power",
    "tatal环境污染": "批处理 radiasi,电场,磁场",
    "manajemen": "Manajemen jaringan telekomunikasi, maintenance",
  },
  // KBLI 38110-38220 - Pengelolaan Limbah & Sampah
  "limbah": {
    "konstruksi_gedung": "Fasilitas pengelolaan limbah,批处理 plant",
    "konstruksi_jalan": "Landfill construction,批处理 cell",
    "mekanikal": "Incinerator, shredder,批处理 equipment",
    "elektrikal": "Power generation from waste, biogas system",
    "tatalingkungan": "Pengelolaan limbah B3,批处理, recycling",
    "manajemen": "Manajemen sampah,批处理 operations, compliance",
  },
  // KBLI 43213/43214 - Sistem Keamanan & Proteksi Kebakaran
  "keamanan": {
    "konstruksi_gedung": "Ruang server security, control room",
    "konstruksi_jalan": "Sistem keamanan jalan toll, CCTV, barrier",
    "mekanikal": "Fire pump, sprinkler, fire alarm, smoke control",
    "elektrikal": "CCTV, access control, intrusion detection, alarm",
    "tatalingkungan": "Monitoring lingkungan,批处理 safety",
    "manajemen": "Sistem keamanan terintegrasi, O&M, monitoring",
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
                    href={`/agent/${selectedCell.row}/${selectedCell.col}`}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    🤖 Buka AI Agent
                  </Link>
                  <Link
                    href={buildChatUrl(selectedCell.row, selectedCell.col)}
                    className="border border-orange-500/50 hover:border-orange-400 text-orange-300 hover:text-orange-200 px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    💬 Chat Cepat
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
            <div className="text-2xl mb-2">🤖</div>
            <h3 className="text-white font-semibold mb-1">126 AI Agent Spesialis</h3>
            <p className="text-slate-400 text-sm">21 fungsi bisnis × 6 bidang keteknikan = 126 AI Agent dengan keahlian unik masing-masing</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
            <div className="text-2xl mb-2">🎯</div>
            <h3 className="text-white font-semibold mb-1">Berikan Tugas Nyata</h3>
            <p className="text-slate-400 text-sm">Setiap agent bisa diberi tugas: buat RAB, analisis kontrak, susun jadwal, dan lainnya</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
            <div className="text-2xl mb-2">📄</div>
            <h3 className="text-white font-semibold mb-1">Output Siap Pakai</h3>
            <p className="text-slate-400 text-sm">Agent menghasilkan dokumen, laporan, checklist, dan analisis yang bisa langsung digunakan</p>
          </div>
        </div>
      </section>
    </div>
  );
}
