import { Router } from "express";
import { getSessionFromRequest } from "../lib/auth";

const router = Router();

router.post("/chat", async (req, res) => {
  const session = await getSessionFromRequest(req);
  if (!session) { res.status(401).json({ error: "Unauthorized" }); return; }

  try {
    const { messages: chatMessages, agentId } = req.body;

    if (!chatMessages || !Array.isArray(chatMessages)) {
      res.status(400).json({ error: "messages array required" });
      return;
    }

    const lastMessage = chatMessages[chatMessages.length - 1];
    const userMessage = lastMessage?.content || "";

    const message = generateSimulatedResponse(userMessage, agentId || "general", chatMessages);

    res.json({ message, agentName: agentId || "KonstruksiAI" });
  } catch (err) {
    req.log.error({ err }, "POST /chat error");
    res.status(500).json({ error: "Internal server error" });
  }
});

function generateSimulatedResponse(userMessage: string, agentId: string, _history: unknown[]): string {
  const msg = userMessage.toLowerCase();

  if (msg.includes("sbu") || msg.includes("sertifikasi badan usaha")) {
    return `**Sertifikat Badan Usaha (SBU) Konstruksi**

SBU adalah sertifikat yang wajib dimiliki oleh perusahaan yang ingin mengerjakan proyek konstruksi di Indonesia.

**Persyaratan utama:**
1. Akta pendirian perusahaan (PT/CV/Koperasi)
2. NPWP perusahaan aktif
3. NIB (Nomor Induk Berusaha)
4. Tenaga ahli bersertifikat sesuai bidang
5. Peralatan pendukung

**Proses pengajuan:**
- Daftar di LPJK (Lembaga Pengembangan Jasa Konstruksi)
- Lengkapi dokumen persyaratan
- Verifikasi oleh asosiasi terkait
- Penerbitan SBU (±14 hari kerja)

Apakah Anda ingin informasi lebih detail tentang klasifikasi SBU tertentu?`;
  }

  if (msg.includes("skk") || msg.includes("sertifikat kompetensi kerja")) {
    return `**Sertifikat Kompetensi Kerja (SKK) Konstruksi**

SKK adalah bukti kompetensi bagi tenaga kerja konstruksi di Indonesia berdasarkan UU Jasa Konstruksi No. 2/2017.

**Jenjang SKK:**
- SKK Ahli Muda (S1 + 2 tahun pengalaman)
- SKK Ahli Madya (S1 + 5 tahun pengalaman)
- SKK Ahli Utama (S1 + 10 tahun pengalaman)

**Proses Sertifikasi:**
1. Daftar ke LSP (Lembaga Sertifikasi Profesi) terakreditasi
2. Asesmen kompetensi (portofolio + uji tulis)
3. Wawancara dengan asesor
4. Penerbitan SKK

Bidang apa yang ingin Anda sertifikasi?`;
  }

  if (msg.includes("tender") || msg.includes("lpse") || msg.includes("pengadaan")) {
    return `**Proses Tender Pemerintah (LPSE)**

LPSE (Layanan Pengadaan Secara Elektronik) adalah platform e-procurement pemerintah Indonesia.

**Langkah mengikuti tender:**
1. **Registrasi** di LPSE setempat dengan NPWP dan akta perusahaan
2. **Verifikasi** dokumen oleh panitia pengadaan
3. **Unduh** dokumen RKS (Rencana Kerja & Syarat)
4. **Pelajari** HPS (Harga Perkiraan Sendiri)
5. **Susun** penawaran teknis dan harga
6. **Upload** dokumen sebelum batas waktu
7. **Evaluasi** oleh panitia (administrasi, teknis, harga)
8. **Negosiasi** jika diperlukan

Tips meningkatkan win rate:
- Pastikan SBU dan IUJK masih berlaku
- Harga kompetitif namun realistis
- Dokumen teknis lengkap dan rapi

Ada pertanyaan lebih spesifik tentang tender?`;
  }

  if (msg.includes("rab") || msg.includes("rencana anggaran") || msg.includes("biaya")) {
    return `**Rencana Anggaran Biaya (RAB) Konstruksi**

RAB adalah estimasi biaya yang diperlukan untuk menyelesaikan suatu proyek konstruksi.

**Komponen utama RAB:**
1. **Material** — harga bahan bangunan sesuai SNI
2. **Upah Kerja** — standar upah minimum regional
3. **Peralatan** — sewa alat berat dan alat kerja
4. **Overhead** — biaya manajemen, asuransi, dll (5-15%)
5. **Keuntungan** — profit kontraktor (10-15%)

**Proses penyusunan:**
- Volume pekerjaan dari gambar kerja
- Analisa harga satuan (SNI atau lokal)
- Perhitungan total biaya per item
- Rekapitulasi total anggaran

Apakah Anda perlu bantuan menghitung RAB untuk proyek tertentu?`;
  }

  const agentResponses: Record<string, string> = {
    energi: "Saya siap membantu pertanyaan seputar ketenagalistrikan dan energi baru terbarukan (EBT). Apa yang ingin Anda ketahui?",
    migas: "Saya siap membantu pertanyaan seputar minyak, gas bumi, dan pertambangan mineral. Silakan ajukan pertanyaan Anda.",
    konstruksi: "Saya siap membantu pertanyaan teknis seputar konstruksi bangunan, infrastruktur, dan teknik sipil.",
  };

  return agentResponses[agentId] || `Terima kasih atas pertanyaan Anda tentang "${userMessage}".

Sebagai asisten AI KonstruksiAI, saya siap membantu Anda dengan:
- 🏗️ **Teknik Konstruksi** — desain, perhitungan struktural, material
- ⚡ **Ketenagalistrikan & EBT** — instalasi, perizinan, regulasi
- ⛏️ **Migas & Pertambangan** — eksplorasi, K3, regulasi
- 📋 **Tender & Pengadaan** — strategi, dokumen, LPSE
- 🏢 **Manajemen Bisnis** — operasional, cashflow, kontrak
- 📜 **Perijinan & Sertifikasi** — SBU, SKK, IMB/PBG

Silakan ajukan pertanyaan yang lebih spesifik agar saya dapat memberikan jawaban yang lebih akurat dan bermanfaat.`;
}

export default router;
