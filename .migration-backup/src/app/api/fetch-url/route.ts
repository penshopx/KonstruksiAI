import { NextRequest, NextResponse } from "next/server";

const MAX_CONTENT_LENGTH = 50000;

/**
 * Convert Google Drive share URL to direct download URL
 */
function convertGoogleDriveUrl(url: string): string | null {
  // Format: https://drive.google.com/file/d/FILE_ID/view
  const fileMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) {
    return `https://drive.google.com/uc?export=download&id=${fileMatch[1]}`;
  }
  
  // Format: https://docs.google.com/document/d/DOC_ID/edit
  const docMatch = url.match(/docs\.google\.com\/document\/d\/([a-zA-Z0-9_-]+)/);
  if (docMatch) {
    return `https://docs.google.com/document/d/${docMatch[1]}/export?format=txt`;
  }
  
  // Format: https://docs.google.com/spreadsheets/d/SHEET_ID/edit
  const sheetMatch = url.match(/docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
  if (sheetMatch) {
    return `https://docs.google.com/spreadsheets/d/${sheetMatch[1]}/export?format=csv`;
  }
  
  return null;
}

/**
 * Extract text from DOCX buffer using mammoth
 */
async function extractTextFromDocx(buffer: ArrayBuffer): Promise<string> {
  try {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ arrayBuffer: buffer });
    return result.value || "[Dokumen Word kosong atau tidak dapat dibaca]";
  } catch {
    return "[Gagal membaca dokumen Word. Pastikan file tidak terproteksi.]";
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "URL tidak valid" },
        { status: 400 }
      );
    }

    // Validate URL
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Format URL tidak valid" },
        { status: 400 }
      );
    }

    // Only allow http/https
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return NextResponse.json(
        { error: "Hanya URL HTTP/HTTPS yang diperbolehkan" },
        { status: 400 }
      );
    }

    // Convert Google Drive URL if needed
    const isGoogleDrive = url.includes("drive.google.com") || url.includes("docs.google.com");
    let fetchUrl = url;
    
    if (isGoogleDrive) {
      const converted = convertGoogleDriveUrl(url);
      if (!converted) {
        return NextResponse.json(
          { error: "Format URL Google Drive tidak dikenali. Pastikan file sudah di-share dengan 'Anyone with the link'." },
          { status: 400 }
        );
      }
      fetchUrl = converted;
    }

    // Fetch the document
    const response = await fetch(fetchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; KonstruksiAI/1.0)",
      },
      signal: AbortSignal.timeout(15000), // 15 second timeout
    });

    if (!response.ok) {
      if (response.status === 403) {
        return NextResponse.json(
          { error: "Akses ditolak. Pastikan dokumen Google Drive sudah di-share dengan 'Anyone with the link can view'." },
          { status: 403 }
        );
      }
      return NextResponse.json(
        { error: `Gagal mengambil dokumen: HTTP ${response.status}` },
        { status: 400 }
      );
    }

    const contentType = response.headers.get("content-type") || "";
    const buffer = await response.arrayBuffer();
    
    let content = "";
    let filename = "dokumen";
    let fileType = "text/plain";

    // Try to get filename from URL or Content-Disposition
    const disposition = response.headers.get("content-disposition");
    if (disposition) {
      const nameMatch = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (nameMatch) {
        filename = nameMatch[1].replace(/['"]/g, "").trim();
      }
    } else {
      const urlPath = new URL(fetchUrl).pathname;
      filename = urlPath.split("/").pop() || "dokumen";
    }

    // Process based on content type
    if (contentType.includes("application/vnd.openxmlformats-officedocument.wordprocessingml") ||
        filename.endsWith(".docx")) {
      content = await extractTextFromDocx(buffer);
      fileType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    } else if (contentType.includes("text/") || contentType.includes("application/json") ||
               contentType.includes("text/csv")) {
      content = new TextDecoder("utf-8").decode(buffer);
      fileType = contentType.split(";")[0].trim();
    } else if (contentType.includes("application/pdf") || filename.endsWith(".pdf")) {
      // PDF needs to be returned as base64 for client-side processing
      const base64 = Buffer.from(buffer).toString("base64");
      return NextResponse.json({
        filename,
        type: "application/pdf",
        size: buffer.byteLength,
        needsClientProcessing: true,
        base64Data: base64,
        source: isGoogleDrive ? "google_drive" : "url",
      });
    } else {
      // Try to decode as text
      content = new TextDecoder("utf-8", { fatal: false }).decode(buffer);
      if (!content || content.length < 10) {
        return NextResponse.json(
          { error: "Format dokumen tidak didukung. Gunakan PDF, DOCX, atau TXT." },
          { status: 400 }
        );
      }
    }

    // Truncate if too long
    const isTruncated = content.length > MAX_CONTENT_LENGTH;
    if (isTruncated) {
      content = content.substring(0, MAX_CONTENT_LENGTH) + "\n\n[... Konten dipotong karena terlalu panjang ...]";
    }

    return NextResponse.json({
      filename,
      content,
      type: fileType,
      size: buffer.byteLength,
      isTruncated,
      source: isGoogleDrive ? "google_drive" : "url",
    });

  } catch (error) {
    console.error("Fetch URL error:", error);
    
    if (error instanceof Error && error.name === "TimeoutError") {
      return NextResponse.json(
        { error: "Timeout: Dokumen terlalu lama diambil. Coba lagi atau download manual." },
        { status: 408 }
      );
    }
    
    return NextResponse.json(
      { error: "Gagal mengambil dokumen dari URL. Pastikan URL dapat diakses publik." },
      { status: 500 }
    );
  }
}
