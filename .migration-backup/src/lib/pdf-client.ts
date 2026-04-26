/**
 * Client-side PDF text extraction using pdfjs-dist
 * This runs in the browser and handles compressed/modern PDFs properly
 */

let pdfjsLib: typeof import("pdfjs-dist") | null = null;

async function getPdfjs() {
  if (!pdfjsLib) {
    pdfjsLib = await import("pdfjs-dist");
    // Use CDN worker for pdfjs to avoid bundling issues
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
  }
  return pdfjsLib;
}

export interface PdfExtractionResult {
  text: string;
  pageCount: number;
  success: boolean;
  error?: string;
}

/**
 * Extract text from PDF using base64 data (from server response)
 */
export async function extractPdfFromBase64(base64Data: string): Promise<PdfExtractionResult> {
  try {
    const pdfjs = await getPdfjs();
    
    // Convert base64 to Uint8Array
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    return await extractPdfFromBuffer(bytes, pdfjs);
  } catch (error) {
    console.error("PDF base64 extraction error:", error);
    return {
      text: "[Gagal membaca PDF. File mungkin terproteksi atau rusak.]",
      pageCount: 0,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Extract text from PDF File object directly in browser
 */
export async function extractPdfFromFile(file: File): Promise<PdfExtractionResult> {
  try {
    const pdfjs = await getPdfjs();
    
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    
    return await extractPdfFromBuffer(bytes, pdfjs);
  } catch (error) {
    console.error("PDF file extraction error:", error);
    return {
      text: "[Gagal membaca PDF. File mungkin terproteksi atau rusak.]",
      pageCount: 0,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

async function extractPdfFromBuffer(
  bytes: Uint8Array,
  pdfjs: typeof import("pdfjs-dist")
): Promise<PdfExtractionResult> {
  const loadingTask = pdfjs.getDocument({
    data: bytes,
    useWorkerFetch: false,
    isEvalSupported: false,
    useSystemFonts: true,
  });
  
  const pdf = await loadingTask.promise;
  const pageCount = pdf.numPages;
  const textParts: string[] = [];
  
  // Extract text from each page (limit to 50 pages for performance)
  const maxPages = Math.min(pageCount, 50);
  
  for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    
    const pageText = textContent.items
      .filter((item): item is import("pdfjs-dist/types/src/display/api").TextItem => 
        "str" in item
      )
      .map(item => item.str)
      .join(" ");
    
    if (pageText.trim()) {
      textParts.push(`[Halaman ${pageNum}]\n${pageText}`);
    }
  }
  
  if (pageCount > maxPages) {
    textParts.push(`\n[... ${pageCount - maxPages} halaman lainnya tidak ditampilkan ...]`);
  }
  
  let text = textParts.join("\n\n").replace(/\s+/g, " ").trim();
  
  if (!text || text.length < 20) {
    text = "[PDF ini berisi gambar/scan tanpa teks yang dapat dibaca. Gunakan OCR untuk mengekstrak teks dari PDF scan.]";
  }
  
  // Limit to 50k characters
  if (text.length > 50000) {
    text = text.substring(0, 50000) + "\n\n[... Konten dipotong karena terlalu panjang ...]";
  }
  
  return {
    text,
    pageCount,
    success: true,
  };
}
