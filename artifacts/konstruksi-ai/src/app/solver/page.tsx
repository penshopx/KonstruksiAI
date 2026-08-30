"use client";

import { useState, useRef, useEffect } from "react";
import Link from "@/shims/next-link";
import ExecutionHistoryPanel from "@/components/ExecutionHistoryPanel";
import { WorkspaceContextBanner, useWorkspaceContext } from "@/lib/workspace-context";

// ============================================================
// SOLVER PAGE — Multi-step Engineering Problem Solver
// Inspired by gpai.app/solver — structured AI problem solving
// ============================================================

interface SolverStep {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface SolverDomain {
  id: string;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  problemTypes: string[];
}

interface SolverResult {
  executionId?: string;
  resultRef?: string;
  problem: string;
  domain: string;
  approach: string;
  analysis: string;
  solution: string;
  regulations: string[];
  nextSteps: string[];
  outputFormat: string;
}

const SOLVER_DOMAINS: SolverDomain[] = [
  {
    id: "konstruksi",
    name: "Teknik Konstruksi",
    icon: "🏗️",
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/40",
    description: "Struktur, arsitektur, MEP, jalan, jembatan",
    problemTypes: [
      "Perhitungan struktur & dimensi elemen",
      "Estimasi biaya & RAB proyek",
      "Metode pelaksanaan konstruksi",
      "Analisis beban & gempa",
      "Desain pondasi & tanah",
      "Spesifikasi material & mutu",
    ],
  },
  {
    id: "energi",
    name: "Ketenagalistrikan & EBT",
    icon: "⚡",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/40",
    description: "PLTS, PLTB, PLTA, transmisi, distribusi",
    problemTypes: [
      "Desain sistem PLTS rooftop & utility",
      "Perhitungan kapasitas pembangkit",
      "Analisis jaringan distribusi listrik",
      "Studi kelayakan proyek EBT",
      "Perizinan SLO & IUPTL",
      "Optimasi bauran energi",
    ],
  },
  {
    id: "migas",
    name: "Migas & Pertambangan",
    icon: "⛏️",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/40",
    description: "Eksplorasi, produksi, pipeline, K3 migas",
    problemTypes: [
      "Analisis cadangan & produksi",
      "Desain fasilitas produksi migas",
      "Perizinan IUP & IUPK",
      "Studi kelayakan tambang",
      "Manajemen K3 migas",
      "Kontrak PSC & bagi hasil",
    ],
  },
  {
    id: "tender",
    name: "Tender & Pengadaan",
    icon: "📋",
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/40",
    description: "LPSE, dokumen tender, evaluasi, kontrak",
    problemTypes: [
      "Strategi penawaran harga tender",
      "Penyusunan dokumen teknis tender",
      "Evaluasi & analisis penawaran",
      "Kualifikasi & SBU perusahaan",
      "Kontrak FIDIC & pemerintah",
      "Klaim & sengketa konstruksi",
    ],
  },
  {
    id: "perijinan",
    name: "Perijinan & Regulasi",
    icon: "📜",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/40",
    description: "PBG, SLF, AMDAL, SBU, SKK, OSS",
    problemTypes: [
      "Pengurusan PBG & SLF",
      "Sertifikasi SBU & SKK",
      "Dokumen AMDAL & UKL-UPL",
      "Perizinan OSS & DPMPTSP",
      "Regulasi UU Cipta Kerja",
      "Sertifikasi profesi keteknikan",
    ],
  },
  {
    id: "manajemen",
    name: "Manajemen Proyek",
    icon: "📊",
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/40",
    description: "Perencanaan, pengendalian, SDM, keuangan",
    problemTypes: [
      "Penyusunan WBS & jadwal proyek",
      "Pengendalian biaya & cashflow",
      "Manajemen risiko proyek",
      "Koordinasi multi-disiplin",
      "Laporan & dokumentasi proyek",
      "Manajemen subkontraktor",
    ],
  },
];

const SOLVER_STEPS: SolverStep[] = [
  { id: "domain", title: "Pilih Domain", description: "Tentukan bidang keteknikan", icon: "🎯" },
  { id: "problem", title: "Deskripsikan Masalah", description: "Jelaskan permasalahan Anda", icon: "📝" },
  { id: "context", title: "Tambah Konteks", description: "Parameter & detail teknis", icon: "⚙️" },
  { id: "solve", title: "Dapatkan Solusi", description: "Analisis & rekomendasi AI", icon: "🚀" },
];

const EXAMPLE_PROBLEMS: Record<string, string[]> = {
  konstruksi: [
    "Saya perlu menghitung dimensi kolom beton untuk gedung 8 lantai di zona gempa tinggi Jakarta",
    "Buat RAB estimasi untuk pembangunan gudang industri 2000 m² di Bekasi",
    "Bagaimana metode pelaksanaan pengecoran beton di musim hujan?",
  ],
  energi: [
    "Desain sistem PLTS rooftop 100 kWp untuk pabrik tekstil di Bandung",
    "Hitung kapasitas baterai BESS untuk PLTS off-grid 50 kWp",
    "Apa persyaratan SLO untuk PLTS rooftop yang terhubung ke PLN?",
  ],
  migas: [
    "Apa saja tahapan dan persyaratan mendapatkan IUP Operasi Produksi mineral?",
    "Bagaimana mekanisme cost recovery dalam kontrak PSC migas?",
    "Buat checklist K3 untuk pekerjaan pengeboran sumur minyak",
  ],
  tender: [
    "Strategi penawaran harga untuk tender konstruksi gedung senilai Rp 50 miliar",
    "Dokumen apa saja yang diperlukan untuk kualifikasi tender pemerintah?",
    "Bagaimana cara mengajukan klaim perpanjangan waktu akibat force majeure?",
  ],
  perijinan: [
    "Apa persyaratan dan alur pengurusan PBG untuk gedung komersial 15 lantai?",
    "Bagaimana cara mendapatkan SBU Konstruksi Gedung kualifikasi Besar?",
    "Proyek apa saja yang wajib AMDAL berdasarkan PP 22/2021?",
  ],
  manajemen: [
    "Buat WBS dan jadwal proyek untuk konstruksi jembatan bentang 100m",
    "Bagaimana mengelola cashflow proyek konstruksi agar tidak defisit?",
    "Strategi manajemen risiko untuk proyek konstruksi di daerah terpencil",
  ],
};

// ============================================================
// MARKDOWN RENDERER (simple)
// ============================================================

function renderMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, '<code class="bg-slate-700 px-1 rounded text-orange-300 text-xs">$1</code>')
    .replace(/```[\w]*\n([\s\S]*?)```/g, '<pre class="bg-slate-900 border border-slate-700 rounded-lg p-4 text-sm text-slate-300 overflow-x-auto my-3 font-mono">$1</pre>')
    .replace(/^### (.+)$/gm, '<h3 class="text-white font-bold text-base mt-4 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-white font-bold text-lg mt-5 mb-2">$2</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-white font-bold text-xl mt-5 mb-3">$1</h1>')
    .replace(/^\| (.+) \|$/gm, (match) => {
      const cells = match.split("|").filter(c => c.trim());
      return `<tr>${cells.map(c => `<td class="border border-slate-700 px-3 py-1.5 text-sm text-slate-300">${c.trim()}</td>`).join("")}</tr>`;
    })
    .replace(/^- \[ \] (.+)$/gm, '<li class="flex items-start gap-2 text-slate-300 text-sm"><span class="w-4 h-4 border border-slate-600 rounded mt-0.5 flex-shrink-0"></span><span>$1</span></li>')
    .replace(/^- \[x\] (.+)$/gm, '<li class="flex items-start gap-2 text-slate-300 text-sm"><span class="w-4 h-4 bg-green-500 rounded mt-0.5 flex-shrink-0 flex items-center justify-center text-white text-xs">✓</span><span>$1</span></li>')
    .replace(/^- (.+)$/gm, '<li class="text-slate-300 text-sm ml-4 list-disc">$1</li>')
    .replace(/\n\n/g, "</p><p class='mb-3'>")
    .replace(/\n/g, "<br/>");
}

// ============================================================
// MAIN SOLVER PAGE
// ============================================================

export default function SolverPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedDomain, setSelectedDomain] = useState<string>("");
  const [problem, setProblem] = useState("");
  const [context, setContext] = useState("");
  const [outputType, setOutputType] = useState("laporan");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<SolverResult | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [retryOfId, setRetryOfId] = useState<string | null>(null);
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);
  const resultRef = useRef<HTMLDivElement>(null);
  const workspaceContext = useWorkspaceContext();

  const selectedDomainObj = SOLVER_DOMAINS.find(d => d.id === selectedDomain);

  useEffect(() => {
    setRetryOfId(null);
  }, [workspaceContext.workspaceId]);

  const handleGenerate = async () => {
    if (!selectedDomain || !problem.trim()) return;

    setIsGenerating(true);
    setGenerationError(null);
    setResult(null);
    setGenerationProgress(8);
    setCurrentStep(3);

    // Progress reflects that a real request is in flight — it eases toward
    // (but never reaches) 100% while waiting, and only completes once the
    // backend actually responds. It is not a stand-in for real completion.
    const progressTimer = setInterval(() => {
      setGenerationProgress(prev => (prev < 90 ? prev + Math.max(1, Math.round((90 - prev) * 0.15)) : prev));
    }, 350);

    try {
      const res = await fetch("/api/solver/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain: selectedDomain,
          problem,
          context,
          outputType,
          workspaceId: workspaceContext.workspaceId,
          retryOfId,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        if (typeof body.executionId === "string") {
          setRetryOfId(body.executionId);
          setHistoryRefreshKey((current) => current + 1);
        } else if (res.status === 400 || res.status === 403 || res.status === 404) {
          setRetryOfId(null);
        }
        throw new Error(body.error || `Gagal menghasilkan solusi (status ${res.status})`);
      }

      const generatedResult: SolverResult = await res.json();
      setGenerationProgress(100);
      setResult(generatedResult);
      setRetryOfId(null);
      setHistoryRefreshKey((current) => current + 1);

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      setGenerationError(err instanceof Error ? err.message : "Gagal menghasilkan solusi. Silakan coba lagi.");
      setCurrentStep(2);
    } finally {
      clearInterval(progressTimer);
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setSelectedDomain("");
    setProblem("");
    setContext("");
    setResult(null);
    setGenerationProgress(0);
    setGenerationError(null);
    setRetryOfId(null);
  };

  const copyToClipboard = () => {
    if (!result) return;
    const text = `# Solusi: ${result.problem}\n\n## Domain: ${result.domain}\n\n## Pendekatan\n${result.approach}\n\n## Analisis\n${result.analysis}\n\n## Solusi\n${result.solution}\n\n## Regulasi\n${result.regulations.map(r => `- ${r}`).join("\n")}\n\n## Langkah Selanjutnya\n${result.nextSteps.map((s, i) => `${i + 1}. ${s}`).join("\n")}`;
    navigator.clipboard.writeText(text);
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
              <span className="text-orange-400 font-medium text-sm">🔬 Solver</span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/chat" className="text-slate-400 hover:text-white text-sm transition-colors">Chat Bebas</Link>
              <Link href="/matrix" className="text-slate-400 hover:text-white text-sm transition-colors">Matriks</Link>
              <Link href="/tools" className="text-slate-400 hover:text-white text-sm transition-colors">Tools</Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <WorkspaceContextBanner context={workspaceContext} />
        {/* Page Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-full px-4 py-1.5 mb-4">
            <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></span>
            <span className="text-orange-300 text-sm font-medium">Engineering Problem Solver</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Selesaikan Masalah Keteknikan
            <span className="text-orange-400 block">dengan Analisis AI Terstruktur</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Deskripsikan permasalahan teknis Anda, dan AI akan menganalisis serta memberikan solusi terstruktur lengkap dengan regulasi dan langkah implementasi.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-10 overflow-x-auto pb-2">
          {SOLVER_STEPS.map((step, i) => (
            <div key={step.id} className="flex items-center gap-2 flex-shrink-0">
              <div
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                  i === currentStep
                    ? "bg-orange-500/20 border border-orange-500/50 text-orange-300"
                    : i < currentStep
                    ? "bg-green-500/10 border border-green-500/30 text-green-400"
                    : "bg-slate-800 border border-slate-700 text-slate-500"
                }`}
              >
                <span>{i < currentStep ? "✓" : step.icon}</span>
                <span className="font-medium hidden sm:block">{step.title}</span>
              </div>
              {i < SOLVER_STEPS.length - 1 && (
                <div className={`w-6 h-0.5 ${i < currentStep ? "bg-green-500/50" : "bg-slate-700"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 0: Domain Selection */}
        {!result && (
          <div className="space-y-8">
            {/* Domain Selection */}
            <div>
              <h2 className="text-white font-bold text-xl mb-2">
                <span className="text-orange-400 mr-2">1.</span>Pilih Domain Keteknikan
              </h2>
              <p className="text-slate-400 text-sm mb-5">Pilih bidang yang paling relevan dengan permasalahan Anda</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {SOLVER_DOMAINS.map(domain => (
                  <button
                    key={domain.id}
                    onClick={() => {
                      setSelectedDomain(domain.id);
                      setCurrentStep(Math.max(currentStep, 1));
                    }}
                    className={`text-left p-4 rounded-xl border-2 transition-all ${
                      selectedDomain === domain.id
                        ? `${domain.bgColor} ${domain.borderColor} ring-2 ring-orange-500/30`
                        : "bg-slate-800 border-slate-700 hover:border-slate-500"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{domain.icon}</span>
                      <span className={`font-bold text-sm ${selectedDomain === domain.id ? domain.color : "text-white"}`}>
                        {domain.name}
                      </span>
                    </div>
                    <p className="text-slate-400 text-xs mb-3">{domain.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {domain.problemTypes.slice(0, 2).map(pt => (
                        <span key={pt} className="text-xs bg-slate-700 text-slate-400 px-2 py-0.5 rounded-full">
                          {pt.split(" ").slice(0, 3).join(" ")}...
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Problem Description */}
            {selectedDomain && (
              <div>
                <h2 className="text-white font-bold text-xl mb-2">
                  <span className="text-orange-400 mr-2">2.</span>Deskripsikan Permasalahan
                </h2>
                <p className="text-slate-400 text-sm mb-4">Jelaskan permasalahan teknis Anda secara spesifik</p>

                {/* Example problems */}
                <div className="mb-4">
                  <p className="text-slate-500 text-xs mb-2">💡 Contoh pertanyaan:</p>
                  <div className="flex flex-wrap gap-2">
                    {(EXAMPLE_PROBLEMS[selectedDomain] || []).map(ex => (
                      <button
                        key={ex}
                        onClick={() => {
                          setProblem(ex);
                          setCurrentStep(Math.max(currentStep, 2));
                        }}
                        className="text-xs bg-slate-800 border border-slate-700 hover:border-orange-500/50 text-slate-400 hover:text-orange-300 px-3 py-1.5 rounded-lg transition-all text-left"
                      >
                        {ex.length > 60 ? ex.slice(0, 60) + "..." : ex}
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  value={problem}
                  onChange={e => {
                    setProblem(e.target.value);
                    if (e.target.value.trim()) setCurrentStep(Math.max(currentStep, 2));
                  }}
                  placeholder={`Contoh: "Saya perlu menghitung dimensi kolom beton untuk gedung 8 lantai di zona gempa tinggi Jakarta, dengan beban hidup kantor 2.4 kN/m²..."`}
                  className="w-full bg-slate-800 border border-slate-700 focus:border-orange-500/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm resize-none outline-none transition-colors"
                  rows={4}
                />
                <div className="flex justify-between mt-1">
                  <span className="text-slate-600 text-xs">Semakin detail, semakin akurat solusinya</span>
                  <span className="text-slate-600 text-xs">{problem.length} karakter</span>
                </div>
              </div>
            )}

            {/* Context & Options */}
            {problem.trim() && (
              <div>
                <h2 className="text-white font-bold text-xl mb-2">
                  <span className="text-orange-400 mr-2">3.</span>Tambah Konteks (Opsional)
                </h2>
                <p className="text-slate-400 text-sm mb-4">Parameter tambahan untuk solusi yang lebih spesifik</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-slate-400 text-xs mb-1.5 block">Lokasi Proyek</label>
                    <input
                      type="text"
                      placeholder="Contoh: Jakarta, Surabaya, Kalimantan Timur"
                      className="w-full bg-slate-800 border border-slate-700 focus:border-orange-500/50 rounded-lg px-3 py-2 text-white placeholder-slate-500 text-sm outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 text-xs mb-1.5 block">Skala/Nilai Proyek</label>
                    <input
                      type="text"
                      placeholder="Contoh: Rp 5 miliar, 2000 m², 100 kWp"
                      className="w-full bg-slate-800 border border-slate-700 focus:border-orange-500/50 rounded-lg px-3 py-2 text-white placeholder-slate-500 text-sm outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="text-slate-400 text-xs mb-1.5 block">Konteks Tambahan</label>
                  <textarea
                    value={context}
                    onChange={e => setContext(e.target.value)}
                    placeholder="Informasi tambahan: kondisi tanah, spesifikasi khusus, batasan anggaran, timeline, dll."
                    className="w-full bg-slate-800 border border-slate-700 focus:border-orange-500/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm resize-none outline-none transition-colors"
                    rows={3}
                  />
                </div>

                <div className="mb-6">
                  <label className="text-slate-400 text-xs mb-2 block">Format Output yang Diinginkan</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: "laporan", label: "📄 Laporan Teknis" },
                      { id: "checklist", label: "✅ Checklist" },
                      { id: "tabel", label: "📊 Tabel & Data" },
                      { id: "panduan", label: "📖 Panduan Langkah" },
                    ].map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => setOutputType(opt.id)}
                        className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
                          outputType === opt.id
                            ? "bg-orange-500/20 border-orange-500/50 text-orange-300"
                            : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  onClick={handleGenerate}
                  disabled={!selectedDomain || !problem.trim() || isGenerating}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold py-4 rounded-xl text-lg transition-all hover:scale-[1.01] shadow-lg shadow-orange-500/20 disabled:shadow-none disabled:scale-100"
                >
                  {retryOfId ? "🔄 Coba Lagi & Catat Pengulangan" : "🚀 Analisis & Selesaikan Masalah"}
                </button>

                {generationError && !isGenerating && (
                  <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
                    <span className="text-red-400 text-lg flex-shrink-0">⚠️</span>
                    <div>
                      <p className="text-red-300 text-sm font-semibold mb-0.5">Gagal menghasilkan solusi</p>
                      <p className="text-red-300/80 text-sm">{generationError}</p>
                      {retryOfId && (
                        <p className="mt-1 text-xs text-red-200/70">
                          Percobaan berikutnya akan ditautkan ke eksekusi gagal ini.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Generating State */}
        {isGenerating && (
          <div className="mt-8 bg-slate-800 border border-slate-700 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <span className="text-3xl">🔬</span>
            </div>
            <h3 className="text-white font-bold text-xl mb-2">Menganalisis Permasalahan...</h3>
            <p className="text-slate-400 text-sm mb-6">AI sedang memproses dan menyusun solusi teknis untuk Anda</p>

            <div className="max-w-md mx-auto">
              <div className="flex justify-between text-xs text-slate-500 mb-2">
                <span>Memproses...</span>
                <span>{generationProgress}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${generationProgress}%` }}
                />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 max-w-sm mx-auto">
              {[
                { icon: "🔍", label: "Analisis masalah" },
                { icon: "📚", label: "Cek regulasi" },
                { icon: "✍️", label: "Susun solusi" },
              ].map((item, i) => (
                <div
                  key={item.label}
                  className={`text-center p-2 rounded-lg transition-all ${
                    generationProgress > i * 33
                      ? "bg-orange-500/10 border border-orange-500/30"
                      : "bg-slate-700/50 border border-slate-700"
                  }`}
                >
                  <div className="text-xl mb-1">{item.icon}</div>
                  <div className="text-xs text-slate-400">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Result */}
        {result && !isGenerating && (
          <div ref={resultRef} className="mt-8 space-y-6">
            {/* Result Header */}
            <div className="bg-gradient-to-r from-orange-500/10 to-slate-800 border border-orange-500/30 rounded-2xl p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-green-500/20 border border-green-500/30 text-green-400 text-xs px-2 py-0.5 rounded-full">✓ Solusi Siap</span>
                    <span className="text-slate-500 text-xs">{selectedDomainObj?.icon} {result.domain}</span>
                    {result.resultRef && (
                      <span className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs px-2 py-0.5 rounded-full">
                        ✓ Tercatat
                      </span>
                    )}
                  </div>
                  <h2 className="text-white font-bold text-xl mb-1">{result.approach}</h2>
                  <p className="text-slate-400 text-sm">{result.problem}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={copyToClipboard}
                    className="bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs px-3 py-2 rounded-lg transition-colors"
                    title="Salin ke clipboard"
                  >
                    📋 Salin
                  </button>
                  <button
                    onClick={handleReset}
                    className="bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 text-orange-400 text-xs px-3 py-2 rounded-lg transition-colors"
                  >
                    🔄 Baru
                  </button>
                </div>
              </div>
            </div>

            {/* Analysis */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <span className="w-7 h-7 bg-blue-500/20 rounded-lg flex items-center justify-center text-sm">🔍</span>
                Analisis Permasalahan
              </h3>
              <div
                className="prose-custom text-slate-300 text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(result.analysis) }}
              />
            </div>

            {/* Solution */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <span className="w-7 h-7 bg-orange-500/20 rounded-lg flex items-center justify-center text-sm">💡</span>
                Solusi & Rekomendasi
              </h3>
              <div
                className="prose-custom text-slate-300 text-sm leading-relaxed overflow-x-auto"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(result.solution) }}
              />
            </div>

            {/* Regulations */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <span className="w-7 h-7 bg-purple-500/20 rounded-lg flex items-center justify-center text-sm">📜</span>
                Regulasi & Standar yang Berlaku
              </h3>
              <div className="space-y-2">
                {result.regulations.map((reg, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-slate-700/50 rounded-lg">
                    <span className="text-purple-400 text-sm flex-shrink-0">§</span>
                    <span className="text-slate-300 text-sm">{reg}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <span className="w-7 h-7 bg-green-500/20 rounded-lg flex items-center justify-center text-sm">🎯</span>
                Langkah Selanjutnya
              </h3>
              <div className="space-y-3">
                {result.nextSteps.map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-orange-500/20 border border-orange-500/30 rounded-full flex items-center justify-center text-orange-400 text-xs font-bold flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-slate-300 text-sm">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-orange-500/10 to-slate-800 border border-orange-500/20 rounded-2xl p-6 text-center">
              <p className="text-slate-300 text-sm mb-4">
                Butuh analisis lebih mendalam atau diskusi interaktif?
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/chat"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105"
                >
                  💬 Lanjutkan di Chat
                </Link>
                <Link
                  href="/matrix"
                  className="border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all"
                >
                  📊 Buka Matriks Agen
                </Link>
              </div>
            </div>
          </div>
        )}

        <ExecutionHistoryPanel
          workspaceId={workspaceContext.workspaceId}
          refreshKey={historyRefreshKey}
        />
      </div>
    </div>
  );
}
