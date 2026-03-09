import { NextRequest, NextResponse } from "next/server";

// Maximum file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Allowed file types
const ALLOWED_TYPES = [
  "application/pdf",
  "text/plain",
  "text/markdown",
];

interface UploadResult {
  filename: string;
  content: string;
  type: string;
  size: number;
  pageCount?: number;
}

/**
 * Simple PDF text extractor that works in edge/serverless environments.
 * Extracts readable text from PDF binary without native modules.
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
    // Look for readable ASCII text in the buffer
    if (textParts.length === 0) {
      const asciiRegex = /[\x20-\x7E]{4,}/g;
      let asciiMatch;
      while ((asciiMatch = asciiRegex.exec(pdfString)) !== null) {
        const text = asciiMatch[0];
        // Filter out PDF syntax keywords and binary-looking strings
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
      text = "[Konten PDF tidak dapat diekstrak secara otomatis. File mungkin berisi gambar atau teks terenkripsi. Silakan salin teks secara manual atau gunakan file TXT.]";
    }
    
    return { text, pageCount };
  } catch {
    return { 
      text: "[Gagal membaca konten PDF. Silakan gunakan file TXT atau salin teks secara manual.]",
      pageCount: 0
    };
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

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Tipe file tidak didukung: ${file.type}. Hanya PDF, TXT, dan MD yang diperbolehkan.` },
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

    let content: string;
    let pageCount: number | undefined;

    if (file.type === "application/pdf") {
      const result = extractTextFromPDF(buffer);
      content = result.text;
      pageCount = result.pageCount;
    } else {
      // For text/markdown files
      content = buffer.toString("utf-8");
    }

    // Clean up the text
    content = content
      .replace(/\s+/g, " ")  // Normalize whitespace
      .replace(/\n{3,}/g, "\n\n")  // Limit consecutive newlines
      .trim();

    // Limit content length for API
    const MAX_CONTENT_LENGTH = 50000; // 50k characters
    const isTruncated = content.length > MAX_CONTENT_LENGTH;
    if (isTruncated) {
      content = content.substring(0, MAX_CONTENT_LENGTH) + "\n\n[... Konten dipotong karena terlalu panjang ...]";
    }

    const result: UploadResult = {
      filename: file.name,
      content,
      type: file.type,
      size: file.size,
      pageCount,
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
