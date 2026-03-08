"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const suggestedTopics = [
  { icon: "📋", text: "Cara mengikuti tender LPSE" },
  { icon: "📜", text: "Syarat mendapatkan SBU" },
  { icon: "🏗️", text: "Manajemen cashflow proyek" },
  { icon: "👷", text: "Sertifikasi SKK Konstruksi" },
  { icon: "📄", text: "Dokumen kontrak konstruksi" },
  { icon: "💰", text: "Cara menghitung RAB" },
];

// Simulated AI responses for construction topics
function getAIResponse(question: string): string {
  const q = question.toLowerCase();

  if (q.includes("sbu") || q.includes("sertifikat badan usaha")) {
    return `## Sertifikat Badan Usaha (SBU) Konstruksi

**SBU** adalah sertifikat yang wajib dimiliki perusahaan jasa konstruksi untuk beroperasi di Indonesia.

### Syarat Mendapatkan SBU:
1. **Akta pendirian perusahaan** yang sudah disahkan Kemenkumham
2. **NPWP perusahaan** yang aktif
3. **NIB (Nomor Induk Berusaha)** dari OSS
4. **Tenaga ahli bersertifikat** (SKK) sesuai klasifikasi
5. **Peralatan konstruksi** yang memadai
6. **Laporan keuangan** yang sudah diaudit

### Proses Pengajuan:
- Daftar melalui **LPJK (Lembaga Pengembangan Jasa Konstruksi)**
- Upload dokumen persyaratan
- Verifikasi oleh tim LPJK
- Proses 14-30 hari kerja

### Klasifikasi SBU:
- **Kecil (K)**: Modal kerja < Rp 1 Miliar
- **Menengah (M)**: Modal kerja Rp 1-10 Miliar  
- **Besar (B)**: Modal kerja > Rp 10 Miliar

Ada pertanyaan lebih lanjut tentang SBU?`;
  }

  if (q.includes("skk") || q.includes("sertifikat kompetensi")) {
    return `## SKK (Sertifikat Kompetensi Kerja) Konstruksi

**SKK** adalah bukti kompetensi tenaga kerja konstruksi yang wajib dimiliki sesuai UU No. 2 Tahun 2017.

### Jenjang SKK:
| Jenjang | Kualifikasi | Setara |
|---------|-------------|--------|
| 1-3 | Operator | SMK/Pengalaman |
| 4-6 | Teknisi/Analis | D3/S1 |
| 7-9 | Ahli | S1/S2 + Pengalaman |

### Cara Mendapatkan SKK:
1. **Pilih skema sertifikasi** sesuai bidang
2. **Daftar ke LSP** (Lembaga Sertifikasi Profesi) terakreditasi
3. **Ikuti asesmen** (uji kompetensi)
4. **Lulus → terima SKK** berlaku 5 tahun

### LSP Konstruksi Terkemuka:
- LSP Konstruksi LPJK
- LSP Gapensi
- LSP Gapeksindo

Ingin tahu lebih detail tentang bidang SKK tertentu?`;
  }

  if (q.includes("tender") || q.includes("lpse") || q.includes("pengadaan")) {
    return `## Panduan Mengikuti Tender Pemerintah (LPSE)

### Langkah-langkah Mengikuti Tender:

**1. Persiapan Awal**
- Pastikan perusahaan terdaftar di **SPSE (Sistem Pengadaan Secara Elektronik)**
- Miliki **SBU** sesuai klasifikasi pekerjaan
- Siapkan **NPWP, NIB, dan dokumen legalitas**

**2. Registrasi di LPSE**
- Kunjungi lpse.lkpp.go.id atau LPSE instansi terkait
- Daftar sebagai penyedia jasa
- Verifikasi dokumen di kantor LPSE

**3. Proses Penawaran**
- Download dokumen pengadaan
- Pelajari HPS (Harga Perkiraan Sendiri)
- Susun penawaran teknis & harga
- Upload dokumen sebelum batas waktu

**4. Tips Memenangkan Tender:**
- Harga penawaran **80-95% dari HPS**
- Dokumen teknis yang **lengkap dan rapi**
- Pengalaman pekerjaan sejenis yang relevan
- Tenaga ahli bersertifikat yang memadai

### Regulasi Terkait:
- **Perpres No. 16 Tahun 2018** tentang Pengadaan Barang/Jasa
- **Perpres No. 12 Tahun 2021** (perubahan)

Mau tahu lebih detail tentang strategi penawaran?`;
  }

  if (q.includes("rab") || q.includes("rencana anggaran") || q.includes("estimasi biaya")) {
    return `## Cara Menghitung RAB (Rencana Anggaran Biaya)

### Komponen Utama RAB:

**1. Biaya Material**
- Hitung volume setiap item pekerjaan
- Gunakan **HSPK (Harga Satuan Pokok Kegiatan)** daerah setempat
- Tambahkan waste factor 5-10%

**2. Biaya Upah Tenaga Kerja**
- Mandor, tukang, pembantu tukang
- Berdasarkan SNI atau HSPK setempat

**3. Biaya Peralatan**
- Sewa alat berat (excavator, crane, dll)
- Biaya operasional dan mobilisasi

**4. Biaya Overhead & Profit**
- Overhead: 10-15% dari biaya langsung
- Profit: 10-15%
- PPN: 11%

### Formula Dasar:
\`\`\`
RAB = Volume × Harga Satuan
Total = Σ RAB + Overhead + Profit + PPN
\`\`\`

### Tools yang Bisa Digunakan:
- Microsoft Excel dengan template RAB
- Software estimasi: **Planswift, CostX**
- Aplikasi RAB berbasis SNI

Mau contoh perhitungan untuk jenis pekerjaan tertentu?`;
  }

  if (q.includes("cashflow") || q.includes("arus kas") || q.includes("keuangan proyek")) {
    return `## Manajemen Cashflow Proyek Konstruksi

### Mengapa Cashflow Penting?
Banyak perusahaan konstruksi bangkrut bukan karena rugi, tapi karena **kehabisan kas** di tengah proyek.

### Strategi Manajemen Cashflow:

**1. Negosiasi Termin Pembayaran**
- Uang muka minimal **20-30%** dari nilai kontrak
- Termin pembayaran setiap **progress 20-25%**
- Retensi maksimal **5%** (bukan 10%)

**2. Kontrol Pengeluaran**
- Buat **S-Curve** rencana vs realisasi
- Monitor biaya mingguan
- Bayar supplier setelah terima pembayaran owner

**3. Proyeksi Cashflow**
| Bulan | Pemasukan | Pengeluaran | Saldo |
|-------|-----------|-------------|-------|
| 1 | DP 20% | Mobilisasi | + |
| 2 | - | Material+Upah | - |
| 3 | Termin 1 | Material+Upah | + |

**4. Antisipasi Masalah:**
- Siapkan **kredit modal kerja** di bank
- Jangan ambil proyek melebihi kapasitas
- Subkon dengan sistem bayar setelah terima

Mau template cashflow proyek konstruksi?`;
  }

  if (q.includes("iujk") || q.includes("ijin usaha")) {
    return `## IUJK (Izin Usaha Jasa Konstruksi)

**IUJK** adalah izin yang wajib dimiliki perusahaan jasa konstruksi untuk beroperasi.

### Jenis IUJK:
1. **IUJK Nasional** - untuk pekerjaan di seluruh Indonesia
2. **IUJK Daerah** - untuk pekerjaan di daerah tertentu

### Persyaratan IUJK:
- **NIB** dari sistem OSS (Online Single Submission)
- **Akta pendirian** perusahaan
- **NPWP** perusahaan
- **SBU** yang masih berlaku
- **Domisili perusahaan** yang jelas

### Proses Pengajuan (via OSS):
1. Login ke **oss.go.id**
2. Pilih bidang usaha konstruksi (KBLI)
3. Lengkapi data perusahaan
4. Upload dokumen persyaratan
5. IUJK terbit otomatis setelah verifikasi

### Catatan Penting:
- Sejak berlakunya **UU Cipta Kerja**, IUJK terintegrasi dengan NIB
- Perpanjangan dilakukan setiap **3 tahun**
- Wajib update jika ada perubahan data perusahaan

Ada pertanyaan lain seputar perijinan konstruksi?`;
  }

  if (q.includes("kontrak") || q.includes("perjanjian")) {
    return `## Kontrak Konstruksi: Panduan Lengkap

### Jenis-jenis Kontrak Konstruksi:

**1. Berdasarkan Cara Pembayaran:**
- **Lump Sum**: Harga tetap, risiko kontraktor
- **Unit Price**: Per satuan pekerjaan, lebih fleksibel
- **Cost Plus Fee**: Biaya aktual + fee, untuk pekerjaan tidak pasti

**2. Berdasarkan Waktu:**
- **Kontrak Tahun Tunggal**: Selesai dalam 1 tahun anggaran
- **Kontrak Tahun Jamak**: Lebih dari 1 tahun (multi-years)

### Klausul Penting yang Harus Ada:
✅ Lingkup pekerjaan yang jelas  
✅ Jadwal pelaksanaan (time schedule)  
✅ Harga dan cara pembayaran  
✅ Denda keterlambatan (biasanya 1‰/hari, maks 5%)  
✅ Jaminan pelaksanaan (5% dari nilai kontrak)  
✅ Penyelesaian sengketa (BANI/Pengadilan)  
✅ Force majeure  
✅ Perubahan pekerjaan (CCO/Addendum)  

### Dokumen Kontrak Standar:
- **FIDIC** untuk proyek internasional
- **Permen PUPR** untuk proyek pemerintah
- **ABI** untuk proyek swasta

Mau template kontrak konstruksi standar?`;
  }

  // Default response
  return `## Terima kasih atas pertanyaan Anda!

Saya adalah **KonstruksiAI**, asisten cerdas khusus bidang konstruksi Indonesia. Saya siap membantu Anda dengan:

### 📋 Tender & Pengadaan
- Proses tender LPSE/pemerintah
- Strategi penawaran
- Dokumen pengadaan

### 🏗️ Manajemen Bisnis Konstruksi  
- Manajemen proyek & cashflow
- Kontrak dan subkontraktor
- Estimasi biaya (RAB)

### 📜 Perijinan & Sertifikasi
- SBU (Sertifikat Badan Usaha)
- SKK (Sertifikat Kompetensi Kerja)
- IUJK dan perijinan lainnya

Silakan tanyakan hal yang lebih spesifik, misalnya:
- *"Apa syarat mendapatkan SBU Konstruksi?"*
- *"Bagaimana cara mengikuti tender LPSE?"*
- *"Jelaskan tentang SKK jenjang 7"*

Saya siap membantu! 🏗️`;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: `## Selamat datang di KonstruksiAI! 👋

Saya adalah asisten AI khusus bidang **keteknikan & konstruksi Indonesia**. Saya siap membantu Anda dengan:

- 📋 **Tender & Pengadaan** — LPSE, strategi penawaran, dokumen tender
- 🏗️ **Manajemen Bisnis Konstruksi** — cashflow, kontrak, RAB, manajemen proyek  
- 📜 **Perijinan & Sertifikasi** — SBU, SKK, IUJK, dan regulasi konstruksi

**Silakan ketik pertanyaan Anda atau pilih topik di bawah ini!**`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI thinking delay
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

    const aiResponse = getAIResponse(messageText);
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: aiResponse,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  useEffect(() => {
    // Check for query param
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) {
      handleSendMessage(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessage = (content: string) => {
    // Simple markdown-like formatting
    return content
      .replace(/## (.*)/g, '<h2 class="text-lg font-bold text-white mt-4 mb-2">$1</h2>')
      .replace(/### (.*)/g, '<h3 class="text-base font-semibold text-orange-300 mt-3 mb-1">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="text-slate-300 italic">$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-slate-700 text-orange-300 px-1 py-0.5 rounded text-sm font-mono">$1</code>')
      .replace(/✅ (.*)/g, '<div class="flex items-start gap-2 my-1"><span class="text-green-400 mt-0.5">✅</span><span>$1</span></div>')
      .replace(/- (.*)/g, '<div class="flex items-start gap-2 my-0.5"><span class="text-orange-400 mt-1.5 text-xs">●</span><span>$1</span></div>')
      .replace(/\n/g, "<br/>");
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900 px-4 py-3 flex items-center gap-3">
        <Link href="/" className="text-slate-400 hover:text-white transition-colors">
          ← Kembali
        </Link>
        <div className="flex items-center gap-2 flex-1">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold">
            K
          </div>
          <div>
            <div className="text-white font-semibold text-sm">KonstruksiAI</div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
              <span className="text-green-400 text-xs">Online</span>
            </div>
          </div>
        </div>
        <div className="text-slate-500 text-xs hidden sm:block">
          Spesialis Konstruksi Indonesia
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto chat-container px-4 py-6 space-y-6 max-w-4xl mx-auto w-full">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold ${
                message.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-orange-500 text-white"
              }`}
            >
              {message.role === "user" ? "U" : "K"}
            </div>

            {/* Message bubble */}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.role === "user"
                  ? "bg-blue-600 text-white rounded-tr-sm"
                  : "bg-slate-800 text-slate-200 rounded-tl-sm border border-slate-700"
              }`}
            >
              {message.role === "assistant" ? (
                <div
                  className="text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                />
              ) : (
                <p className="text-sm leading-relaxed">{message.content}</p>
              )}
              <div
                className={`text-xs mt-2 ${
                  message.role === "user" ? "text-blue-200" : "text-slate-500"
                }`}
              >
                {message.timestamp.toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              K
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="typing-indicator flex gap-1 items-center h-5">
                <span className="w-2 h-2 bg-orange-400 rounded-full inline-block"></span>
                <span className="w-2 h-2 bg-orange-400 rounded-full inline-block"></span>
                <span className="w-2 h-2 bg-orange-400 rounded-full inline-block"></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Topics (show only at start) */}
      {messages.length <= 1 && (
        <div className="px-4 pb-4 max-w-4xl mx-auto w-full">
          <p className="text-slate-500 text-xs mb-2 text-center">Topik populer:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {suggestedTopics.map((topic) => (
              <button
                key={topic.text}
                onClick={() => handleSendMessage(topic.text)}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-orange-500/50 text-slate-300 hover:text-white text-xs px-3 py-2 rounded-full transition-all"
              >
                {topic.icon} {topic.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-slate-700 bg-slate-900 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3 items-end">
            <div className="flex-1 bg-slate-800 border border-slate-700 focus-within:border-orange-500/50 rounded-xl overflow-hidden transition-colors">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Tanyakan seputar tender, SBU, SKK, RAB, kontrak konstruksi..."
                className="w-full bg-transparent text-white placeholder-slate-500 px-4 py-3 text-sm resize-none focus:outline-none min-h-[48px] max-h-[120px]"
                rows={1}
                disabled={isLoading}
              />
            </div>
            <button
              onClick={() => handleSendMessage()}
              disabled={!input.trim() || isLoading}
              className="bg-orange-500 hover:bg-orange-600 disabled:bg-slate-700 disabled:text-slate-500 text-white w-12 h-12 rounded-xl flex items-center justify-center transition-colors flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          <p className="text-slate-600 text-xs mt-2 text-center">
            Tekan Enter untuk kirim • Shift+Enter untuk baris baru
          </p>
        </div>
      </div>
    </div>
  );
}
