"use client";

import { useState } from "react";
import Link from "@/shims/next-link";

// ============================================================
// TOOLS PAGE — Quick Engineering Calculators
// ============================================================

type ToolId = "rab-estimator" | "beam-calculator" | "plts-calculator" | "concrete-mix" | "tender-score" | "ipal-capacity";

interface ToolResult {
  title: string;
  items: { label: string; value: string; highlight?: boolean }[];
  notes?: string[];
}

// ============================================================
// CALCULATOR LOGIC
// ============================================================

function calcRAB(type: string, area: number, location: string): ToolResult {
  const locationMultiplier: Record<string, number> = {
    jakarta: 1.15,
    surabaya: 1.05,
    bandung: 1.0,
    medan: 0.95,
    makassar: 0.90,
    kalimantan: 1.10,
    papua: 1.35,
    default: 1.0,
  };

  const loc = location.toLowerCase();
  const mult = Object.entries(locationMultiplier).find(([k]) => loc.includes(k))?.[1] || locationMultiplier.default;

  const baseCosts: Record<string, { perSqm: number; label: string }> = {
    rumah_sederhana: { perSqm: 3_500_000, label: "Rumah Sederhana" },
    rumah_menengah: { perSqm: 5_500_000, label: "Rumah Menengah" },
    rumah_mewah: { perSqm: 9_000_000, label: "Rumah Mewah" },
    ruko: { perSqm: 4_500_000, label: "Ruko/Komersial" },
    gudang: { perSqm: 2_800_000, label: "Gudang Industri" },
    kantor: { perSqm: 6_500_000, label: "Gedung Kantor" },
    pabrik: { perSqm: 3_200_000, label: "Pabrik/Industri" },
  };

  const base = baseCosts[type] || baseCosts.rumah_menengah;
  const costPerSqm = base.perSqm * mult;
  const directCost = costPerSqm * area;
  const overhead = directCost * 0.12;
  const ppn = (directCost + overhead) * 0.11;
  const total = directCost + overhead + ppn;

  const fmt = (n: number) => `Rp ${(n / 1_000_000).toFixed(1)} juta`;

  return {
    title: `Estimasi RAB — ${base.label}`,
    items: [
      { label: "Luas Bangunan", value: `${area.toLocaleString()} m²` },
      { label: "Lokasi", value: location || "Rata-rata Indonesia" },
      { label: "Harga Satuan", value: `Rp ${costPerSqm.toLocaleString()}/m²` },
      { label: "Biaya Langsung", value: fmt(directCost) },
      { label: "Overhead & Profit (12%)", value: fmt(overhead) },
      { label: "PPN (11%)", value: fmt(ppn) },
      { label: "TOTAL ESTIMASI", value: fmt(total), highlight: true },
    ],
    notes: [
      "Estimasi berdasarkan HSPK 2024 rata-rata nasional",
      "Belum termasuk biaya tanah, perijinan, dan konsultan",
      "Untuk RAB detail, diperlukan gambar teknik lengkap",
      `Faktor lokasi diterapkan: ×${mult.toFixed(2)}`,
    ],
  };
}

function calcBeam(span: number, load: number, width: number): ToolResult {
  // Simple beam calculation (simply supported, uniform load)
  // M_max = wL²/8, V_max = wL/2
  const w = load; // kN/m
  const L = span; // m
  const b = width / 1000; // mm to m

  const M_max = (w * L * L) / 8; // kN.m
  const V_max = (w * L) / 2; // kN

  // Assume fc' = 25 MPa, fy = 400 MPa
  const fc = 25;
  const fy = 400;

  // Estimate depth: d ≈ L/12 to L/15 for typical beams
  const d_est = (L * 1000) / 12; // mm
  const h_est = d_est + 60; // cover + stirrup + bar radius

  // Required As (simplified): As = M/(0.9 × fy × 0.9d)
  const d = d_est / 1000; // back to m
  const As_req = (M_max * 1e6) / (0.9 * fy * 0.9 * d * 1000); // mm²

  // Number of bars (D19 = 283 mm², D22 = 380 mm², D25 = 491 mm²)
  const barSizes = [
    { dia: 19, area: 283 },
    { dia: 22, area: 380 },
    { dia: 25, area: 491 },
  ];
  const bar = barSizes.find(b => b.area * 3 >= As_req) || barSizes[2];
  const nBars = Math.ceil(As_req / bar.area);

  return {
    title: "Analisis Balok Beton Bertulang",
    items: [
      { label: "Bentang (L)", value: `${span} m` },
      { label: "Beban Merata (w)", value: `${load} kN/m` },
      { label: "Momen Maksimum", value: `${M_max.toFixed(2)} kN.m`, highlight: true },
      { label: "Gaya Geser Maks", value: `${V_max.toFixed(2)} kN` },
      { label: "Dimensi Balok (est.)", value: `${width}×${Math.round(h_est)} mm` },
      { label: "Tulangan Tarik (est.)", value: `${nBars}D${bar.dia} (As=${(nBars * bar.area).toFixed(0)} mm²)`, highlight: true },
      { label: "Mutu Beton", value: `fc' = ${fc} MPa (K-300)` },
      { label: "Mutu Baja", value: `fy = ${fy} MPa (BJTD-40)` },
    ],
    notes: [
      "Perhitungan berdasarkan SNI 2847:2019 (LRFD)",
      "Asumsi: balok sederhana, beban merata, fc'=25 MPa, fy=400 MPa",
      "Hasil ini adalah estimasi awal — perlu verifikasi engineer",
      "Belum memperhitungkan tulangan geser (sengkang)",
    ],
  };
}

function calcPLTS(capacity: number, location: string): ToolResult {
  const pshMap: Record<string, number> = {
    jakarta: 4.5,
    surabaya: 5.0,
    bandung: 4.3,
    bali: 5.2,
    kalimantan: 4.8,
    sulawesi: 5.1,
    papua: 4.6,
    default: 4.8,
  };

  const loc = location.toLowerCase();
  const psh = Object.entries(pshMap).find(([k]) => loc.includes(k))?.[1] || pshMap.default;

  const pr = 0.78; // Performance Ratio
  const annualProduction = capacity * psh * 365 * pr; // kWh/year
  const tariff = 1500; // Rp/kWh average
  const annualSaving = annualProduction * tariff;

  const epcCost = capacity * 1000 * 8_000_000; // Rp 8 juta/kWp
  const payback = epcCost / annualSaving;
  const irr = ((annualSaving / epcCost) * 100 * 1.5).toFixed(1); // simplified

  const panelCount = Math.ceil((capacity * 1000) / 450); // 450 Wp per panel
  const roofArea = panelCount * 2.5; // ~2.5 m² per panel

  const fmt = (n: number) => `Rp ${(n / 1_000_000).toFixed(1)} juta`;

  return {
    title: `Kalkulasi PLTS ${capacity} kWp`,
    items: [
      { label: "Kapasitas Terpasang", value: `${capacity} kWp` },
      { label: "Peak Sun Hours", value: `${psh} jam/hari (${location || "rata-rata"})` },
      { label: "Jumlah Panel (450 Wp)", value: `${panelCount} panel` },
      { label: "Luas Atap Dibutuhkan", value: `~${roofArea.toFixed(0)} m²` },
      { label: "Produksi Tahunan", value: `${(annualProduction / 1000).toFixed(1)} MWh/tahun` },
      { label: "Penghematan/Tahun", value: fmt(annualSaving), highlight: true },
      { label: "Estimasi Biaya EPC", value: fmt(epcCost) },
      { label: "Payback Period", value: `${payback.toFixed(1)} tahun`, highlight: true },
      { label: "Estimasi IRR", value: `~${irr}%` },
    ],
    notes: [
      "Berdasarkan Permen ESDM No. 26/2021 (PLTS Atap)",
      `Performance Ratio: ${pr} (standar industri)`,
      "Tarif listrik: Rp 1.500/kWh (rata-rata industri)",
      "Lifetime panel: 25-30 tahun dengan degradasi 0.5%/tahun",
    ],
  };
}

function calcConcrete(grade: string, volume: number): ToolResult {
  const mixes: Record<string, { cement: number; sand: number; gravel: number; water: number; label: string }> = {
    k175: { cement: 247, sand: 869, gravel: 999, water: 215, label: "K-175 (fc' 14.5 MPa)" },
    k250: { cement: 352, sand: 731, gravel: 1031, water: 195, label: "K-250 (fc' 20.75 MPa)" },
    k300: { cement: 413, sand: 681, gravel: 1021, water: 185, label: "K-300 (fc' 24.9 MPa)" },
    k350: { cement: 448, sand: 667, gravel: 1000, water: 180, label: "K-350 (fc' 29.05 MPa)" },
    k400: { cement: 480, sand: 640, gravel: 1000, water: 175, label: "K-400 (fc' 33.2 MPa)" },
  };

  const mix = mixes[grade] || mixes.k300;
  const bags = Math.ceil((mix.cement * volume) / 50); // 50 kg/bag

  return {
    title: `Mix Design Beton ${mix.label}`,
    items: [
      { label: "Volume Beton", value: `${volume} m³` },
      { label: "Semen (50 kg/zak)", value: `${bags} zak (${(mix.cement * volume).toFixed(0)} kg)`, highlight: true },
      { label: "Pasir", value: `${(mix.sand * volume / 1000).toFixed(2)} ton` },
      { label: "Kerikil/Split", value: `${(mix.gravel * volume / 1000).toFixed(2)} ton`, highlight: true },
      { label: "Air", value: `${(mix.water * volume).toFixed(0)} liter` },
      { label: "W/C Ratio", value: `${(mix.water / mix.cement).toFixed(2)}` },
    ],
    notes: [
      "Berdasarkan SNI 03-2834-2000 (Mix Design Beton Normal)",
      "Komposisi per m³ beton segar (kg)",
      "Sesuaikan dengan hasil uji slump & kuat tekan aktual",
      "Tambahkan admixture sesuai kebutuhan (plasticizer, retarder)",
    ],
  };
}

function calcTenderScore(technical: number, price: number, hps: number): ToolResult {
  // Merit point system: 70% technical + 30% price (common for jasa konstruksi)
  const techWeight = 0.70;
  const priceWeight = 0.30;

  const priceScore = price <= hps ? (hps / price) * 100 * priceWeight : 0;
  const techScore = technical * techWeight;
  const totalScore = techScore + priceScore;

  const priceRatio = (price / hps * 100).toFixed(1);
  const margin = ((hps - price) / hps * 100).toFixed(1);

  return {
    title: "Evaluasi Skor Tender",
    items: [
      { label: "Nilai HPS", value: `Rp ${(hps / 1_000_000).toFixed(1)} juta` },
      { label: "Nilai Penawaran", value: `Rp ${(price / 1_000_000).toFixed(1)} juta` },
      { label: "Rasio Harga/HPS", value: `${priceRatio}%` },
      { label: "Margin di bawah HPS", value: `${margin}%` },
      { label: "Skor Teknis (70%)", value: `${techScore.toFixed(1)} poin` },
      { label: "Skor Harga (30%)", value: `${priceScore.toFixed(1)} poin` },
      { label: "TOTAL SKOR", value: `${totalScore.toFixed(1)} / 100`, highlight: true },
      { label: "Status", value: price > hps ? "❌ Di atas HPS — GUGUR" : totalScore >= 70 ? "✅ Kompetitif" : "⚠️ Perlu perbaikan", highlight: true },
    ],
    notes: [
      "Sistem merit point: 70% teknis + 30% harga (Perpres 16/2018)",
      "Penawaran di atas HPS otomatis gugur",
      "Skor teknis minimum biasanya 70/100",
      "Harga terlalu rendah (<80% HPS) bisa dianggap tidak wajar",
    ],
  };
}

function calcIPAL(population: number, type: string): ToolResult {
  const flowRates: Record<string, { flow: number; bod: number; label: string }> = {
    perumahan: { flow: 120, bod: 200, label: "Perumahan" },
    kantor: { flow: 50, bod: 150, label: "Perkantoran" },
    hotel: { flow: 250, bod: 300, label: "Hotel" },
    rs: { flow: 500, bod: 400, label: "Rumah Sakit" },
    industri: { flow: 30, bod: 500, label: "Industri Ringan" },
  };

  const ft = flowRates[type] || flowRates.perumahan;
  const Q = (ft.flow * population) / 1000; // m³/hari
  const BOD_in = ft.bod; // mg/L
  const BOD_out = 30; // baku mutu PermenLHK P.68/2016
  const removal = ((BOD_in - BOD_out) / BOD_in * 100).toFixed(0);

  // Aerobic treatment: HRT 6-8 jam
  const HRT = 8; // jam
  const V_aeration = (Q * HRT) / 24; // m³
  const V_settling = Q * 0.1; // 10% dari Q harian
  const V_total = V_aeration + V_settling;

  return {
    title: `Kapasitas IPAL — ${ft.label}`,
    items: [
      { label: "Populasi/Kapasitas", value: `${population.toLocaleString()} ${type === "hotel" ? "kamar" : type === "rs" ? "TT" : "orang"}` },
      { label: "Debit Air Limbah", value: `${Q.toFixed(1)} m³/hari`, highlight: true },
      { label: "BOD Influen", value: `${BOD_in} mg/L` },
      { label: "BOD Efluen (target)", value: `${BOD_out} mg/L (baku mutu)` },
      { label: "Efisiensi Removal", value: `${removal}%` },
      { label: "Volume Bak Aerasi", value: `${V_aeration.toFixed(1)} m³` },
      { label: "Volume Bak Sedimentasi", value: `${V_settling.toFixed(1)} m³` },
      { label: "Volume Total IPAL", value: `${V_total.toFixed(1)} m³`, highlight: true },
    ],
    notes: [
      "Baku mutu: PermenLHK P.68/2016 (BOD ≤30 mg/L, COD ≤100 mg/L)",
      "HRT aerasi: 8 jam (aerobik extended aeration)",
      "Perlu uji karakteristik air limbah aktual",
      "Desain detail memerlukan data laboratorium lengkap",
    ],
  };
}

// ============================================================
// TOOL DEFINITIONS
// ============================================================

const TOOLS = [
  {
    id: "rab-estimator" as ToolId,
    icon: "💰",
    name: "Estimator RAB",
    description: "Estimasi cepat Rencana Anggaran Biaya berdasarkan tipe & luas bangunan",
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30",
    badge: "Konstruksi",
  },
  {
    id: "beam-calculator" as ToolId,
    icon: "📐",
    name: "Kalkulator Balok",
    description: "Hitung momen, gaya geser, dan estimasi tulangan balok beton bertulang",
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/30",
    badge: "Struktur",
  },
  {
    id: "plts-calculator" as ToolId,
    icon: "☀️",
    name: "Kalkulator PLTS",
    description: "Hitung produksi energi, penghematan, dan payback period sistem PLTS",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/30",
    badge: "Energi",
  },
  {
    id: "concrete-mix" as ToolId,
    icon: "🏗️",
    name: "Mix Design Beton",
    description: "Hitung kebutuhan material beton (semen, pasir, kerikil, air) per m³",
    color: "text-slate-400",
    bgColor: "bg-slate-500/10",
    borderColor: "border-slate-500/30",
    badge: "Material",
  },
  {
    id: "tender-score" as ToolId,
    icon: "📊",
    name: "Skor Tender",
    description: "Hitung estimasi skor tender dengan sistem merit point 70/30",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    badge: "Tender",
  },
  {
    id: "ipal-capacity" as ToolId,
    icon: "💧",
    name: "Kapasitas IPAL",
    description: "Hitung kapasitas dan dimensi IPAL berdasarkan populasi & jenis fasilitas",
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/30",
    badge: "Lingkungan",
  },
];

// ============================================================
// TOOL FORMS
// ============================================================

function RABForm({ onResult }: { onResult: (r: ToolResult) => void }) {
  const [type, setType] = useState("rumah_menengah");
  const [area, setArea] = useState(150);
  const [location, setLocation] = useState("Jakarta");

  return (
    <div className="space-y-4">
      <div>
        <label className="text-slate-400 text-xs mb-1.5 block">Tipe Bangunan</label>
        <select
          value={type}
          onChange={e => setType(e.target.value)}
          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm outline-none"
        >
          <option value="rumah_sederhana">Rumah Sederhana (Type 36-45)</option>
          <option value="rumah_menengah">Rumah Menengah (Type 70-120)</option>
          <option value="rumah_mewah">Rumah Mewah / Premium</option>
          <option value="ruko">Ruko / Komersial</option>
          <option value="gudang">Gudang Industri</option>
          <option value="kantor">Gedung Kantor</option>
          <option value="pabrik">Pabrik / Industri</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-slate-400 text-xs mb-1.5 block">Luas Bangunan (m²)</label>
          <input
            type="number"
            value={area}
            onChange={e => setArea(Number(e.target.value))}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm outline-none"
            min={10}
          />
        </div>
        <div>
          <label className="text-slate-400 text-xs mb-1.5 block">Lokasi</label>
          <input
            type="text"
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder="Jakarta, Surabaya, dll"
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm outline-none"
          />
        </div>
      </div>
      <button
        onClick={() => onResult(calcRAB(type, area, location))}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
      >
        Hitung Estimasi RAB
      </button>
    </div>
  );
}

function BeamForm({ onResult }: { onResult: (r: ToolResult) => void }) {
  const [span, setSpan] = useState(6);
  const [load, setLoad] = useState(20);
  const [width, setWidth] = useState(300);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-slate-400 text-xs mb-1.5 block">Bentang (m)</label>
          <input type="number" value={span} onChange={e => setSpan(Number(e.target.value))}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm outline-none" min={1} />
        </div>
        <div>
          <label className="text-slate-400 text-xs mb-1.5 block">Beban (kN/m)</label>
          <input type="number" value={load} onChange={e => setLoad(Number(e.target.value))}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm outline-none" min={1} />
        </div>
        <div>
          <label className="text-slate-400 text-xs mb-1.5 block">Lebar (mm)</label>
          <input type="number" value={width} onChange={e => setWidth(Number(e.target.value))}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm outline-none" min={150} />
        </div>
      </div>
      <button
        onClick={() => onResult(calcBeam(span, load, width))}
        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
      >
        Hitung Balok
      </button>
    </div>
  );
}

function PLTSForm({ onResult }: { onResult: (r: ToolResult) => void }) {
  const [capacity, setCapacity] = useState(100);
  const [location, setLocation] = useState("Jakarta");

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-slate-400 text-xs mb-1.5 block">Kapasitas (kWp)</label>
          <input type="number" value={capacity} onChange={e => setCapacity(Number(e.target.value))}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm outline-none" min={1} />
        </div>
        <div>
          <label className="text-slate-400 text-xs mb-1.5 block">Lokasi</label>
          <input type="text" value={location} onChange={e => setLocation(e.target.value)}
            placeholder="Jakarta, Bali, dll"
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm outline-none" />
        </div>
      </div>
      <button
        onClick={() => onResult(calcPLTS(capacity, location))}
        className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
      >
        Hitung PLTS
      </button>
    </div>
  );
}

function ConcreteForm({ onResult }: { onResult: (r: ToolResult) => void }) {
  const [grade, setGrade] = useState("k300");
  const [volume, setVolume] = useState(10);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-slate-400 text-xs mb-1.5 block">Mutu Beton</label>
          <select value={grade} onChange={e => setGrade(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm outline-none">
            <option value="k175">K-175 (fc 14.5 MPa)</option>
            <option value="k250">K-250 (fc 20.75 MPa)</option>
            <option value="k300">K-300 (fc 24.9 MPa)</option>
            <option value="k350">K-350 (fc 29.05 MPa)</option>
            <option value="k400">K-400 (fc 33.2 MPa)</option>
          </select>
        </div>
        <div>
          <label className="text-slate-400 text-xs mb-1.5 block">Volume (m³)</label>
          <input type="number" value={volume} onChange={e => setVolume(Number(e.target.value))}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm outline-none" min={0.1} step={0.5} />
        </div>
      </div>
      <button
        onClick={() => onResult(calcConcrete(grade, volume))}
        className="w-full bg-slate-600 hover:bg-slate-500 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
      >
        Hitung Mix Design
      </button>
    </div>
  );
}

function TenderForm({ onResult }: { onResult: (r: ToolResult) => void }) {
  const [technical, setTechnical] = useState(80);
  const [price, setPrice] = useState(4_500_000_000);
  const [hps, setHps] = useState(5_000_000_000);

  return (
    <div className="space-y-4">
      <div>
        <label className="text-slate-400 text-xs mb-1.5 block">Skor Teknis (0-100)</label>
        <input type="number" value={technical} onChange={e => setTechnical(Number(e.target.value))}
          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm outline-none" min={0} max={100} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-slate-400 text-xs mb-1.5 block">Nilai HPS (Rp)</label>
          <input type="number" value={hps} onChange={e => setHps(Number(e.target.value))}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm outline-none" />
        </div>
        <div>
          <label className="text-slate-400 text-xs mb-1.5 block">Nilai Penawaran (Rp)</label>
          <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm outline-none" />
        </div>
      </div>
      <button
        onClick={() => onResult(calcTenderScore(technical, price, hps))}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
      >
        Hitung Skor Tender
      </button>
    </div>
  );
}

function IPALForm({ onResult }: { onResult: (r: ToolResult) => void }) {
  const [population, setPopulation] = useState(500);
  const [type, setType] = useState("perumahan");

  return (
    <div className="space-y-4">
      <div>
        <label className="text-slate-400 text-xs mb-1.5 block">Jenis Fasilitas</label>
        <select value={type} onChange={e => setType(e.target.value)}
          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm outline-none">
          <option value="perumahan">Perumahan (orang)</option>
          <option value="kantor">Perkantoran (orang)</option>
          <option value="hotel">Hotel (kamar)</option>
          <option value="rs">Rumah Sakit (tempat tidur)</option>
          <option value="industri">Industri Ringan (orang)</option>
        </select>
      </div>
      <div>
        <label className="text-slate-400 text-xs mb-1.5 block">
          Jumlah {type === "hotel" ? "Kamar" : type === "rs" ? "Tempat Tidur" : "Penghuni/Pengguna"}
        </label>
        <input type="number" value={population} onChange={e => setPopulation(Number(e.target.value))}
          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm outline-none" min={10} />
      </div>
      <button
        onClick={() => onResult(calcIPAL(population, type))}
        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
      >
        Hitung Kapasitas IPAL
      </button>
    </div>
  );
}

// ============================================================
// RESULT DISPLAY
// ============================================================

function ResultDisplay({ result }: { result: ToolResult }) {
  return (
    <div className="mt-4 bg-slate-900 border border-slate-700 rounded-xl p-4">
      <h4 className="text-white font-bold text-sm mb-3">{result.title}</h4>
      <div className="space-y-2 mb-4">
        {result.items.map((item, i) => (
          <div key={i} className={`flex justify-between items-center py-1.5 px-2 rounded-lg ${item.highlight ? "bg-orange-500/10 border border-orange-500/20" : ""}`}>
            <span className="text-slate-400 text-xs">{item.label}</span>
            <span className={`text-sm font-medium ${item.highlight ? "text-orange-300" : "text-white"}`}>{item.value}</span>
          </div>
        ))}
      </div>
      {result.notes && (
        <div className="border-t border-slate-700 pt-3">
          <p className="text-slate-500 text-xs mb-1.5">📌 Catatan:</p>
          <ul className="space-y-1">
            {result.notes.map((note, i) => (
              <li key={i} className="text-slate-500 text-xs flex items-start gap-1.5">
                <span className="text-slate-600 mt-0.5">•</span>
                {note}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ============================================================
// MAIN PAGE
// ============================================================

export default function ToolsPage() {
  const [activeTool, setActiveTool] = useState<ToolId | null>(null);
  const [results, setResults] = useState<Record<string, ToolResult>>({});

  const handleResult = (toolId: string, result: ToolResult) => {
    setResults(prev => ({ ...prev, [toolId]: result }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">K</div>
                <span className="text-white font-bold text-lg">KonstruksiAI</span>
              </Link>
              <span className="text-slate-600">/</span>
              <span className="text-orange-400 font-medium text-sm">🔧 Tools</span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/solver" className="text-slate-400 hover:text-white text-sm transition-colors">Solver</Link>
              <Link href="/chat" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">Chat</Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-full px-4 py-1.5 mb-4">
            <span className="text-orange-300 text-sm font-medium">🔧 Engineering Calculators</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Kalkulator Teknik
            <span className="text-orange-400 block">Cepat & Akurat</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Alat bantu perhitungan teknik untuk profesional konstruksi, energi, dan lingkungan. Hasil instan berdasarkan standar SNI & regulasi Indonesia.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TOOLS.map(tool => (
            <div
              key={tool.id}
              className={`bg-slate-800 border rounded-2xl p-5 transition-all ${
                activeTool === tool.id ? `${tool.borderColor} ring-1 ring-orange-500/20` : "border-slate-700 hover:border-slate-600"
              }`}
            >
              {/* Tool Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${tool.bgColor} border ${tool.borderColor} rounded-xl flex items-center justify-center text-xl`}>
                    {tool.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm">{tool.name}</h3>
                    <span className={`text-xs ${tool.color}`}>{tool.badge}</span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTool(activeTool === tool.id ? null : tool.id)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                    activeTool === tool.id
                      ? "bg-orange-500/20 border-orange-500/40 text-orange-400"
                      : "bg-slate-700 border-slate-600 text-slate-400 hover:text-white"
                  }`}
                >
                  {activeTool === tool.id ? "Tutup" : "Buka"}
                </button>
              </div>

              <p className="text-slate-400 text-xs mb-4">{tool.description}</p>

              {/* Tool Form */}
              {activeTool === tool.id && (
                <div>
                  <div className="border-t border-slate-700 pt-4 mb-4">
                    {tool.id === "rab-estimator" && <RABForm onResult={r => handleResult(tool.id, r)} />}
                    {tool.id === "beam-calculator" && <BeamForm onResult={r => handleResult(tool.id, r)} />}
                    {tool.id === "plts-calculator" && <PLTSForm onResult={r => handleResult(tool.id, r)} />}
                    {tool.id === "concrete-mix" && <ConcreteForm onResult={r => handleResult(tool.id, r)} />}
                    {tool.id === "tender-score" && <TenderForm onResult={r => handleResult(tool.id, r)} />}
                    {tool.id === "ipal-capacity" && <IPALForm onResult={r => handleResult(tool.id, r)} />}
                  </div>

                  {results[tool.id] && <ResultDisplay result={results[tool.id]} />}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-r from-orange-500/10 to-slate-800 border border-orange-500/20 rounded-2xl p-8 text-center">
          <h2 className="text-white font-bold text-2xl mb-3">Butuh Analisis Lebih Mendalam?</h2>
          <p className="text-slate-400 mb-6 max-w-xl mx-auto">
            Kalkulator ini memberikan estimasi cepat. Untuk analisis detail, gunakan Solver AI atau chat dengan agen spesialis kami.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/solver" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105">
              🔬 Buka Engineering Solver
            </Link>
            <Link href="/chat" className="border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all">
              💬 Chat dengan Agen AI
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
