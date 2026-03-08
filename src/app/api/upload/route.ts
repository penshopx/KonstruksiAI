import { NextRequest, NextResponse } from "next/server";

const pdfParse = require("pdf-parse");

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
      try {
        const pdfData = await pdfParse(buffer);
        content = pdfData.text;
        pageCount = pdfData.numpages;
      } catch (pdfError) {
        console.error("PDF parsing error:", pdfError);
        return NextResponse.json(
          { error: "Gagal membaca PDF. Pastikan file tidak corrupted atau password-protected." },
          { status: 400 }
        );
      }
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
