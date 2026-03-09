import { NextRequest, NextResponse } from "next/server";

// Maximum file size: 20MB
const MAX_FILE_SIZE = 20 * 1024 * 1024;

// Allowed file types
const ALLOWED_TYPES = [
  "application/pdf",
  "text/plain",
  "text/markdown",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/msword", // .doc (legacy)
  "text/csv",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
];

interface UploadResult {
  filename: string;
  content: string;
  type: string;
  size: number;
  pageCount?: number;
  needsClientProcessing?: boolean;
  base64Data?: string;
}

/**
 * Extract text from DOCX using mammoth
 */
async function extractTextFromDocx(buffer: Buffer): Promise<string> {
  try {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ buffer });
    return result.value || "[Dokumen Word kosong atau tidak dapat dibaca]";
  } catch (err) {
    console.error("DOCX extraction error:", err);
    return "[Gagal membaca dokumen Word. Pastikan file tidak terproteksi password.]";
  }
}

/**
 * Simple PDF text extractor that works in edge/serverless environments.
 * For better results, PDF is returned as base64 for client-side processing with pdfjs-dist.
 */
function extractTextFromPDF(buffer: Buffer): { text: string; pageCount: number } {
  try {
    const pdfString = buffer.toString("latin1");
    
    // Count pages
    const pageMatches = pdfString.match(/\/Type\s*\/Page[^s]/g);
    const pageCount = pageMatches ? pageMatches.length : 1;
    
    // Extract text from stream objects
    const textParts: string[] = [];
    
    // Method 1: Extract from BT...ET blocks (text blocks in PDF)
    const btEtRegex = /BT\s*([\s\S]*?)\s*ET/g;
    let match;
    while ((match = btEtRegex.exec(pdfString)) !== null) {
      const block = match[1];
      // Extract text from Tj, TJ, ' and " operators
      const tjRegex = /\(((?:[^()\\]|\\[\s\S])*)\)\s*(?:Tj|'|")/g;
      let tjMatch;
      while ((tjMatch = tjRegex.exec(block)) !== null) {
        const text = tjMatch[1]
          .replace(/\\n/g, "\n")
          .replace(/\\r/g, "\r")
          .replace(/\\t/g, "\t")
          .replace(/\\\(/g, "(")
          .replace(/\\\)/g, ")")
          .replace(/\\\\/g, "\\")
          .replace(/\\(\d{3})/g, (_, oct) => String.fromCharCode(parseInt(oct, 8)));
        if (text.trim()) textParts.push(text);
      }
      
      // Extract from TJ arrays
      const tjArrayRegex = /\[((?:[^\[\]]|\[[\s\S]*?\])*)\]\s*TJ/g;
      let tjArrayMatch;
      while ((tjArrayMatch = tjArrayRegex.exec(block)) !== null) {
        const arrayContent = tjArrayMatch[1];
        const stringRegex = /\(((?:[^()\\]|\\[\s\S])*)\)/g;
        let strMatch;
        while ((strMatch = stringRegex.exec(arrayContent)) !== null) {
          const text = strMatch[1]
            .replace(/\\n/g, "\n")
            .replace(/\\r/g, "\r")
            .replace(/\\t/g, "\t")
            .replace(/\\\(/g, "(")
            .replace(/\\\)/g, ")")
            .replace(/\\\\/g, "\\");
          if (text.trim()) textParts.push(text);
        }
      }
    }
    
    // Method 2: Extract from decoded streams (for compressed PDFs)
    if (textParts.length === 0) {
      const asciiRegex = /[\x20-\x7E]{4,}/g;
      let asciiMatch;
      while ((asciiMatch = asciiRegex.exec(pdfString)) !== null) {
        const text = asciiMatch[0];
        if (!text.match(/^(obj|endobj|stream|endstream|xref|trailer|startxref|\/\w+|<<|>>|\d+ \d+ R)/) &&
            text.match(/[a-zA-Z]{2,}/)) {
          textParts.push(text);
        }
      }
    }
    
    let text = textParts.join(" ")
      .replace(/\s+/g, " ")
      .trim();
    
    if (!text || text.length < 50) {
      text = "";
    }
    
    return { text, pageCount };
  } catch {
    return { text: "", pageCount: 0 };
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Tidak ada file yang diupload" },
        { status: 400 }
      );
    }

    // Validate file type - also check by extension for files with wrong MIME
    const fileExt = file.name.split(".").pop()?.toLowerCase();
    const isDocx = fileExt === "docx" || file.type.includes("wordprocessingml");
    const isDoc = fileExt === "doc" || file.type === "application/msword";
    const isPdf = fileExt === "pdf" || file.type === "application/pdf";
    const isText = fileExt === "txt" || fileExt === "md" || fileExt === "csv" || 
                   file.type.startsWith("text/");
    const isXlsx = fileExt === "xlsx" || file.type.includes("spreadsheetml");

    if (!isDocx && !isDoc && !isPdf && !isText && !isXlsx && !ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Format file tidak didukung: .${fileExt}. Format yang didukung: PDF, DOCX, TXT, MD, CSV, XLSX` },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File terlalu besar. Maksimum ${MAX_FILE_SIZE / (1024 * 1024)}MB.` },
        { status: 400 }
      );
    }

    // Read file content
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let content: string = "";
    let pageCount: number | undefined;
    let needsClientProcessing = false;
    let base64Data: string | undefined;

    if (isPdf) {
      // Try server-side extraction first
      const result = extractTextFromPDF(buffer);
      
      if (result.text && result.text.length > 100) {
        // Server-side extraction worked
        content = result.text;
        pageCount = result.pageCount;
      } else {
        // Return base64 for client-side pdfjs processing
        needsClientProcessing = true;
        base64Data = buffer.toString("base64");
        pageCount = result.pageCount;
        content = "";
      }
    } else if (isDocx) {
      content = await extractTextFromDocx(buffer);
    } else if (isDoc) {
      // Legacy .doc format - limited support
      content = "[Format .doc (Word lama) memiliki dukungan terbatas. Disarankan simpan ulang sebagai .docx untuk hasil terbaik.]\n\n";
      // Try to extract some text
      const textContent = buffer.toString("utf-8", 0, Math.min(buffer.length, 100000));
      const readable = textContent.replace(/[^\x20-\x7E\n\r\t]/g, " ").replace(/\s+/g, " ").trim();
      if (readable.length > 50) content += readable;
    } else if (isXlsx) {
      // Return base64 for client-side processing
      needsClientProcessing = true;
      base64Data = buffer.toString("base64");
      content = "";
    } else {
      // For text/markdown/csv files
      content = buffer.toString("utf-8");
    }

    if (!needsClientProcessing) {
      // Clean up the text
      content = content
        .replace(/\s+/g, " ")
        .replace(/\n{3,}/g, "\n\n")
        .trim();

      // Limit content length for API
      const MAX_CONTENT_LENGTH = 50000;
      const isTruncated = content.length > MAX_CONTENT_LENGTH;
      if (isTruncated) {
        content = content.substring(0, MAX_CONTENT_LENGTH) + "\n\n[... Konten dipotong karena terlalu panjang ...]";
      }
    }

    const result: UploadResult = {
      filename: file.name,
      content,
      type: file.type || `application/${fileExt}`,
      size: file.size,
      pageCount,
      needsClientProcessing,
      base64Data,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Gagal memproses file. Silakan coba lagi." },
      { status: 500 }
    );
  }
}
