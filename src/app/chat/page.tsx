"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { extractPdfFromFile, extractPdfFromBase64 } from "@/lib/pdf-client";

// ============================================================
// TYPES
// ============================================================

interface FileAttachment {
  name: string;
  type: string;
  size: number;
  content: string;
  pageCount?: number;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  reaction?: "up" | "down" | null;
  wordCount?: number;
  starred?: boolean;
  attachment?: FileAttachment;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  agentId?: string;
  label?: ConversationLabel;
}

type ConversationLabel = "penting" | "proyek" | "referensi" | "arsip";

interface Agent {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

// ============================================================
// CONSTANTS
// ============================================================

const AGENTS: Agent[] = [
  { id: "general", name: "KonstruksiAI", icon: "🏗️", description: "Asisten umum konstruksi & engineering", color: "orange" },
  { id: "estimator", name: "Estimator RAB", icon: "💰", description: "Spesialis estimasi biaya & RAB", color: "green" },
  { id: "tender", name: "Tender Expert", icon: "📋", description: "Ahli tender & pengadaan LPSE", color: "blue" },
  { id: "k3", name: "Ahli K3", icon: "⛑️", description: "Keselamatan & kesehatan kerja", color: "red" },
  { id: "perijinan", name: "Konsultan Perijinan", icon: "📜", description: "SBU, SKK, PBG, AMDAL", color: "purple" },
  { id: "energi", name: "EBT Specialist", icon: "⚡", description: "Energi terbarukan & kelistrikan", color: "yellow" },
  { id: "migas", name: "Migas Expert", icon: "🛢️", description: "Minyak, gas, pertambangan", color: "slate" },
  { id: "kontrak", name: "Legal Konstruksi", icon: "⚖️", description: "Kontrak, klaim, sengketa", color: "indigo" },
];

const SUGGESTED_PROMPTS = [
  { category: "Tender", icon: "📋", prompts: [
    "Cara mengikuti tender LPSE untuk perusahaan baru",
    "Strategi penawaran harga yang kompetitif",
    "Dokumen apa saja yang diperlukan untuk tender konstruksi?",
  ]},
  { category: "Perijinan", icon: "📜", prompts: [
    "Syarat mendapatkan SBU konstruksi",
    "Cara mengurus PBG (pengganti IMB)",
    "Proses sertifikasi SKK jenjang 7",
  ]},
  { category: "Estimasi", icon: "💰", prompts: [
    "Buatkan RAB rumah 2 lantai 150 m² di Jakarta",
    "Estimasi biaya konstruksi gudang 1000 m²",
    "Analisa harga satuan pekerjaan beton K-300",
  ]},
  { category: "K3", icon: "⛑️", prompts: [
    "Buat JSA untuk pekerjaan di ketinggian",
    "Prosedur tanggap darurat kebakaran proyek",
    "HIRARC untuk pekerjaan galian tanah dalam",
  ]},
  { category: "Energi", icon: "⚡", prompts: [
    "Perizinan PLTS rooftop 100 kWp",
    "Estimasi biaya PLTS off-grid untuk pabrik",
    "Regulasi EBT terbaru di Indonesia",
  ]},
  { category: "Migas", icon: "🛢️", prompts: [
    "Syarat IUP pertambangan mineral",
    "Kontrak PSC migas: cara kerja dan pembagian",
    "K3 untuk pekerjaan pengeboran migas",
  ]},
];

const KEYBOARD_SHORTCUTS = [
  { key: "Enter", desc: "Kirim pesan" },
  { key: "Shift+Enter", desc: "Baris baru" },
  { key: "Ctrl+K", desc: "Chat baru" },
  { key: "Ctrl+F", desc: "Cari dalam percakapan" },
  { key: "Ctrl+E", desc: "Edit pesan terakhir" },
  { key: "Ctrl+/", desc: "Tampilkan shortcut" },
  { key: "Esc", desc: "Tutup panel / batalkan edit" },
];

const LABEL_CONFIG: Record<ConversationLabel, { color: string; bg: string; border: string; label: string }> = {
  penting: { color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30", label: "🔴 Penting" },
  proyek: { color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30", label: "🔵 Proyek" },
  referensi: { color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/30", label: "🟢 Referensi" },
  arsip: { color: "text-slate-400", bg: "bg-slate-500/10", border: "border-slate-500/30", label: "⚫ Arsip" },
};

type FontSize = "sm" | "base" | "lg";

// ============================================================
// HELPERS
// ============================================================

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 10) return "baru saja";
  if (diffSecs < 60) return `${diffSecs} detik lalu`;
  if (diffMins < 60) return `${diffMins} menit lalu`;
  if (diffHours < 24) return `${diffHours} jam lalu`;
  if (diffDays < 7) return `${diffDays} hari lalu`;
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

function renderMarkdown(content: string, highlight?: string): string {
  let html = content;

  // Highlight search matches in raw text before markdown processing
  if (highlight && highlight.trim()) {
    const escaped = highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escaped})`, "gi");
    // Apply highlight only to non-markdown characters (rough approach)
    html = html.replace(regex, `<mark class="bg-yellow-400/40 text-yellow-100 rounded px-0.5">$1</mark>`);
  }

  // Code blocks (must be before inline code) - with copy button
  html = html.replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) => {
    const escaped = code.replace(/</g, "<").replace(/>/g, ">");
    const codeId = `code-${Math.random().toString(36).substr(2, 9)}`;
    return `<div class="my-3 rounded-lg overflow-hidden border border-slate-600 group">
      <div class="bg-slate-700 px-3 py-1.5 text-xs text-slate-400 font-mono flex items-center justify-between">
        <span>${lang || "code"}</span>
        <button onclick="window.copyCode('${codeId}', this)" class="text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-xs" title="Salin kode">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
          </svg>
          <span class="copy-text">Salin</span>
        </button>
      </div>
      <pre id="${codeId}" class="bg-slate-800 p-3 overflow-x-auto text-sm text-green-300 font-mono leading-relaxed"><code>${escaped.trim()}</code></pre>
    </div>`;
  });

  // Tables
  html = html.replace(/(\|.+\|\n)+/g, (tableStr) => {
    const rows = tableStr.trim().split("\n");
    if (rows.length < 2) return tableStr;
    
    const headerRow = rows[0];
    const separatorRow = rows[1];
    const dataRows = rows.slice(2);
    
    if (!separatorRow.match(/^\|[\s\-:|]+\|$/)) return tableStr;
    
    const parseRow = (row: string) => row.split("|").filter((_, i, arr) => i > 0 && i < arr.length - 1).map(cell => cell.trim());
    
    const headers = parseRow(headerRow);
    const headerHtml = headers.map(h => `<th class="px-3 py-2 text-left text-xs font-semibold text-orange-300 uppercase tracking-wider border-b border-slate-600">${h}</th>`).join("");
    
    const bodyHtml = dataRows.map(row => {
      const cells = parseRow(row);
      return `<tr class="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">${cells.map(c => `<td class="px-3 py-2 text-sm text-slate-300">${c}</td>`).join("")}</tr>`;
    }).join("");
    
    return `<div class="my-3 overflow-x-auto rounded-lg border border-slate-600">
      <table class="w-full text-sm">
        <thead class="bg-slate-700/50"><tr>${headerHtml}</tr></thead>
        <tbody>${bodyHtml}</tbody>
      </table>
    </div>`;
  });

  // Headings
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-base font-bold text-white mt-4 mb-2 pb-1 border-b border-slate-700">$1</h2>');
  html = html.replace(/^### (.+)$/gm, '<h3 class="text-sm font-semibold text-orange-300 mt-3 mb-1">$1</h3>');
  html = html.replace(/^#### (.+)$/gm, '<h4 class="text-sm font-medium text-slate-200 mt-2 mb-1">$1</h4>');

  // Bold and italic
  html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong class="font-bold text-white italic">$1</strong>');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em class="text-slate-300 italic">$1</em>');

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="bg-slate-700 text-orange-300 px-1.5 py-0.5 rounded text-xs font-mono">$1</code>');

  // Checkboxes
  html = html.replace(/- \[ \] (.+)/g, '<div class="flex items-start gap-2 my-1"><span class="mt-0.5 w-4 h-4 border border-slate-500 rounded flex-shrink-0 inline-block"></span><span class="text-slate-300 text-sm">$1</span></div>');
  html = html.replace(/- \[x\] (.+)/gi, '<div class="flex items-start gap-2 my-1"><span class="mt-0.5 w-4 h-4 bg-green-500 rounded flex-shrink-0 inline-flex items-center justify-center text-white text-xs">✓</span><span class="text-slate-300 text-sm line-through opacity-60">$1</span></div>');

  // Emoji bullet points (✅ 🔴 🟡 🟢)
  html = html.replace(/^(✅|🔴|🟡|🟢|⚠️|❌|ℹ️|🎯|📌|🔑|💡|⭐) (.+)$/gm, '<div class="flex items-start gap-2 my-1.5"><span class="flex-shrink-0 text-base leading-5">$1</span><span class="text-slate-300 text-sm">$2</span></div>');

  // Numbered lists
  html = html.replace(/^(\d+)\. (.+)$/gm, '<div class="flex items-start gap-2 my-1"><span class="text-orange-400 font-semibold text-sm flex-shrink-0 w-5">$1.</span><span class="text-slate-300 text-sm">$2</span></div>');

  // Bullet lists
  html = html.replace(/^[-*] (.+)$/gm, '<div class="flex items-start gap-2 my-0.5"><span class="text-orange-400 mt-1.5 text-xs flex-shrink-0">●</span><span class="text-slate-300 text-sm">$1</span></div>');

  // Horizontal rule
  html = html.replace(/^---$/gm, '<hr class="border-slate-700 my-3"/>');

  // Blockquote
  html = html.replace(/^> (.+)$/gm, '<blockquote class="border-l-2 border-orange-500 pl-3 my-2 text-slate-400 italic text-sm">$1</blockquote>');

  // Line breaks
  html = html.replace(/\n\n/g, '</p><p class="mb-2">');
  html = html.replace(/\n/g, "<br/>");

  return `<p class="mb-2">${html}</p>`;
}

// ============================================================
// STORAGE HELPERS
// ============================================================

function saveConversations(conversations: Conversation[]) {
  try {
    const serialized = conversations.map(c => ({
      ...c,
      messages: c.messages.map(m => ({ ...m, timestamp: m.timestamp.toISOString() })),
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
    }));
    localStorage.setItem("konstruksi_conversations", JSON.stringify(serialized));
  } catch {}
}

function loadConversations(): Conversation[] {
  try {
    const raw = localStorage.getItem("konstruksi_conversations");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return parsed.map((c: Record<string, unknown>) => ({
      ...c,
      messages: (c.messages as Record<string, unknown>[]).map((m: Record<string, unknown>) => ({ ...m, timestamp: new Date(m.timestamp as string) })),
      createdAt: new Date(c.createdAt as string),
      updatedAt: new Date(c.updatedAt as string),
    }));
  } catch {
    return [];
  }
}

function generateTitle(firstMessage: string): string {
  const words = firstMessage.trim().split(" ").slice(0, 6).join(" ");
  return words.length > 40 ? words.substring(0, 40) + "..." : words;
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// Export to Markdown
function exportConversationMarkdown(conv: Conversation): void {
  const lines: string[] = [
    `# ${conv.title}`,
    `Tanggal: ${conv.createdAt.toLocaleDateString("id-ID")}`,
    `Agen: ${conv.agentId || "KonstruksiAI"}`,
    "",
    "---",
    "",
  ];
  conv.messages.forEach(m => {
    const time = m.timestamp.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    lines.push(`**${m.role === "user" ? "Anda" : "AI"}** [${time}]`);
    lines.push(m.content);
    lines.push("");
  });
  const blob = new Blob([lines.join("\n")], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${conv.title.replace(/[^a-z0-9]/gi, "_")}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

// Export to PDF using print dialog
function exportConversationPDF(conv: Conversation): void {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const messagesHtml = conv.messages.map(m => {
    const time = m.timestamp.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    const isUser = m.role === "user";
    return `
      <div style="margin-bottom: 16px; ${isUser ? 'text-align: right;' : ''}">
        <div style="font-size: 11px; color: #666; margin-bottom: 4px;">
          <strong>${isUser ? "Anda" : "AI"}</strong> [${time}]
        </div>
        <div style="
          display: inline-block;
          max-width: 80%;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 13px;
          line-height: 1.5;
          white-space: pre-wrap;
          ${isUser
            ? 'background: #f97316; color: white; border-bottom-right-radius: 4px;'
            : 'background: #f1f5f9; color: #1e293b; border-bottom-left-radius: 4px; border: 1px solid #e2e8f0;'}
        ">${escapeHtml(m.content)}</div>
      </div>
    `;
  }).join("");

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${conv.title} - KonstruksiAI</title>
      <style>
        @page { margin: 20mm; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          background: white;
        }
        .header {
          border-bottom: 2px solid #f97316;
          padding-bottom: 16px;
          margin-bottom: 24px;
        }
        .header h1 { margin: 0 0 8px 0; font-size: 20px; color: #1e293b; }
        .header p { margin: 0; font-size: 12px; color: #64748b; }
        pre {
          background: #f8fafc;
          padding: 12px;
          border-radius: 8px;
          overflow-x: auto;
          font-family: monospace;
          font-size: 12px;
          border: 1px solid #e2e8f0;
        }
        code { font-family: monospace; background: #f1f5f9; padding: 2px 4px; border-radius: 4px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${escapeHtml(conv.title)}</h1>
        <p>Tanggal: ${conv.createdAt.toLocaleDateString("id-ID")} | Agen: ${conv.agentId || "KonstruksiAI"}</p>
      </div>
      <div class="messages">
        ${messagesHtml}
      </div>
    </body>
    </html>
  `);
  printWindow.document.close();
  
  setTimeout(() => {
    printWindow.print();
  }, 250);
}

// Export to Word (.docx)
function exportConversationWord(conv: Conversation): void {
  const messagesHtml = conv.messages.map(m => {
    const time = m.timestamp.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    const isUser = m.role === "user";
    const content = escapeHtml(m.content).replace(/\n/g, "<br/>");
    return `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; vertical-align: top; width: 80px;">
          <strong>${isUser ? "Anda" : "AI"}</strong><br/>
          <span style="font-size: 10px; color: #666;">${time}</span>
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; ${isUser ? 'background: #fff7ed;' : ''}">
          ${content}
        </td>
      </tr>
    `;
  }).join("");

  const html = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'>
    <head>
      <meta charset="utf-8">
      <title>${conv.title}</title>
      <style>
        body { font-family: Calibri, sans-serif; font-size: 11pt; }
        h1 { color: #1e293b; border-bottom: 2px solid #f97316; padding-bottom: 8px; }
        table { width: 100%; border-collapse: collapse; }
        td { font-size: 11pt; line-height: 1.5; }
      </style>
    </head>
    <body>
      <h1>${escapeHtml(conv.title)}</h1>
      <p style="color: #666; font-size: 10pt; margin-bottom: 20px;">
        Tanggal: ${conv.createdAt.toLocaleDateString("id-ID")} | Agen: ${conv.agentId || "KonstruksiAI"}
      </p>
      <table>
        ${messagesHtml}
      </table>
    </body>
    </html>
  `;

  const blob = new Blob([html], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${conv.title.replace(/[^a-z0-9]/gi, "_")}.doc`;
  a.click();
  URL.revokeObjectURL(url);
}

function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function exportConversation(conv: Conversation, format: "markdown" | "pdf" | "word" = "markdown"): void {
  switch (format) {
    case "pdf":
      exportConversationPDF(conv);
      break;
    case "word":
      exportConversationWord(conv);
      break;
    default:
      exportConversationMarkdown(conv);
  }
}

// ============================================================
// WELCOME SCREEN
// ============================================================

function WelcomeScreen({ onPrompt, selectedAgent }: { onPrompt: (text: string) => void; selectedAgent: Agent }) {
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 overflow-y-auto">
      <div className="max-w-2xl w-full">
        {/* Hero */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg shadow-orange-500/20">
            {selectedAgent.icon}
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Selamat datang di <span className="text-orange-400">{selectedAgent.name}</span>
          </h1>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            {selectedAgent.description}. Tanyakan apa saja seputar konstruksi, energi, migas, tender, dan perijinan Indonesia.
          </p>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 flex-wrap justify-center mb-4">
          {SUGGESTED_PROMPTS.map((cat, i) => (
            <button
              key={cat.category}
              onClick={() => setActiveCategory(i)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeCategory === i
                  ? "bg-orange-500 text-white"
                  : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700"
              }`}
            >
              {cat.icon} {cat.category}
            </button>
          ))}
        </div>

        {/* Prompt suggestions */}
        <div className="grid gap-2">
          {SUGGESTED_PROMPTS[activeCategory].prompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => onPrompt(prompt)}
              className="text-left bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700 hover:border-orange-500/40 rounded-xl px-4 py-3 text-sm text-slate-300 hover:text-white transition-all group"
            >
              <span className="text-orange-400 mr-2 group-hover:translate-x-1 inline-block transition-transform">→</span>
              {prompt}
            </button>
          ))}
        </div>

        {/* Capabilities */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { icon: "📊", title: "RAB & Estimasi", desc: "Rencana anggaran biaya detail" },
            { icon: "📋", title: "Dokumen Tender", desc: "Template & strategi tender" },
            { icon: "📜", title: "Perijinan", desc: "SBU, SKK, PBG, AMDAL" },
            { icon: "⛑️", title: "K3 & Safety", desc: "JSA, HIRARC, prosedur" },
            { icon: "⚖️", title: "Kontrak", desc: "Review & analisis kontrak" },
            { icon: "🌿", title: "Lingkungan", desc: "AMDAL, UKL-UPL, RKL-RPL" },
          ].map((cap) => (
            <div key={cap.title} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-3">
              <div className="text-xl mb-1">{cap.icon}</div>
              <div className="text-xs font-semibold text-white">{cap.title}</div>
              <div className="text-xs text-slate-500">{cap.desc}</div>
            </div>
          ))}
        </div>

        {/* Keyboard shortcuts hint */}
        <div className="mt-6 text-center">
          <p className="text-slate-700 text-xs">
            Tekan <kbd className="bg-slate-800 border border-slate-700 rounded px-1.5 py-0.5 text-slate-500 font-mono text-xs">Ctrl+/</kbd> untuk melihat semua shortcut keyboard
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MESSAGE COMPONENT
// ============================================================

function MessageBubble({
  message,
  agentIcon,
  onReaction,
  onRegenerate,
  onStar,
  onEdit,
  isLast,
  fontSize,
  searchQuery,
}: {
  message: Message;
  agentIcon: string;
  onReaction: (id: string, reaction: "up" | "down") => void;
  onRegenerate?: () => void;
  onStar: (id: string) => void;
  onEdit?: (id: string, newContent: string) => void;
  isLast: boolean;
  fontSize: FontSize;
  searchQuery?: string;
}) {
  const [copied, setCopied] = useState(false);
  const [relativeTime, setRelativeTime] = useState(() => formatRelativeTime(message.timestamp));
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.content);
  const editRef = useRef<HTMLTextAreaElement>(null);

  // Update relative time every 30s
  useEffect(() => {
    const interval = setInterval(() => {
      setRelativeTime(formatRelativeTime(message.timestamp));
    }, 30000);
    return () => clearInterval(interval);
  }, [message.timestamp]);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const startEdit = () => {
    setEditText(message.content);
    setIsEditing(true);
    setTimeout(() => {
      editRef.current?.focus();
      editRef.current?.select();
    }, 50);
  };

  const submitEdit = () => {
    const trimmed = editText.trim();
    if (trimmed && trimmed !== message.content && onEdit) {
      onEdit(message.id, trimmed);
    }
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setEditText(message.content);
    setIsEditing(false);
  };

  const fontSizeClass = fontSize === "sm" ? "text-xs" : fontSize === "lg" ? "text-base" : "text-sm";

  if (message.role === "user") {
    return (
      <div className="flex gap-3 justify-end group">
        <div className="max-w-[80%] sm:max-w-[70%]">
          {isEditing ? (
            <div className="bg-slate-800 border border-orange-500/60 rounded-2xl rounded-tr-sm overflow-hidden">
              <textarea
                ref={editRef}
                value={editText}
                onChange={e => setEditText(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submitEdit(); }
                  if (e.key === "Escape") cancelEdit();
                }}
                className={`w-full bg-transparent text-white px-4 pt-3 pb-2 ${fontSizeClass} resize-none focus:outline-none min-h-[48px] max-h-[200px]`}
                rows={3}
              />
              <div className="flex items-center justify-end gap-2 px-3 pb-2">
                <button onClick={cancelEdit} className="text-slate-500 hover:text-slate-300 text-xs px-2 py-1 rounded transition-colors">Batal</button>
                <button onClick={submitEdit} className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-3 py-1 rounded-lg transition-colors">Simpan</button>
              </div>
            </div>
          ) : (
            <div className={`bg-orange-500 text-white rounded-2xl rounded-tr-sm px-4 py-3 ${fontSizeClass} leading-relaxed`}>
              {message.content}
              {/* Attachment indicator */}
              {message.attachment && (
                <div className="mt-2 pt-2 border-t border-white/20 flex items-center gap-2">
                  <svg className="w-4 h-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-xs opacity-90">
                    {message.attachment.name}
                    {message.attachment.pageCount && ` · ${message.attachment.pageCount} halaman`}
                  </span>
                </div>
              )}
            </div>
          )}
          <div className="flex items-center justify-end gap-2 mt-1">
            {/* Star button */}
            <button
              onClick={() => onStar(message.id)}
              className={`text-xs transition-all ${
                message.starred
                  ? "text-yellow-400 opacity-100"
                  : "text-slate-600 hover:text-yellow-400 opacity-0 group-hover:opacity-100"
              }`}
              title={message.starred ? "Hapus bintang" : "Bintangi pesan"}
            >
              {message.starred ? "★" : "☆"}
            </button>
            {/* Edit button (user messages only) */}
            {onEdit && !isEditing && (
              <button
                onClick={startEdit}
                className="text-slate-600 hover:text-orange-400 text-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Edit pesan"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
            {/* Copy button */}
            <button
              onClick={handleCopy}
              className="text-slate-600 hover:text-slate-400 text-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {copied ? (
                <span className="text-green-400 text-xs">Tersalin!</span>
              ) : (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
            <span className="text-slate-600 text-xs" title={message.timestamp.toLocaleString("id-ID")}>
              {relativeTime}
            </span>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-1">
          U
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 group">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-sm flex-shrink-0 mt-1 shadow-sm">
        {agentIcon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="bg-slate-800 border border-slate-700/60 rounded-2xl rounded-tl-sm px-4 py-3 relative">
          {message.isStreaming ? (
            <div className="flex gap-1 items-center h-5 py-1">
              <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
              <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
              <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
            </div>
          ) : (
            <div
              className={`${fontSizeClass} leading-relaxed text-slate-200 prose-custom`}
              dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content, searchQuery) }}
            />
          )}
        </div>

        {/* Message actions */}
        <div className="flex items-center gap-3 mt-1.5 px-1">
          <span className="text-slate-600 text-xs" title={message.timestamp.toLocaleString("id-ID")}>
            {relativeTime}
          </span>
          {message.wordCount && !message.isStreaming && (
            <span className="text-slate-700 text-xs">{message.wordCount} kata</span>
          )}
          {!message.isStreaming && (
            <>
              {/* Star */}
              <button
                onClick={() => onStar(message.id)}
                className={`text-sm transition-all ${
                  message.starred
                    ? "text-yellow-400 opacity-100"
                    : "text-slate-600 hover:text-yellow-400 opacity-0 group-hover:opacity-100"
                }`}
                title={message.starred ? "Hapus bintang" : "Bintangi pesan"}
              >
                {message.starred ? "★" : "☆"}
              </button>

              <button
                onClick={handleCopy}
                className="text-slate-600 hover:text-slate-400 text-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Salin"
              >
                {copied ? (
                  <><span className="text-green-400">✓</span> <span className="text-green-400">Tersalin!</span></>
                ) : (
                  <><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg> Salin</>
                )}
              </button>

              {/* Thumbs up */}
              <button
                onClick={() => onReaction(message.id, "up")}
                className={`text-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all ${
                  message.reaction === "up" ? "text-green-400 opacity-100" : "text-slate-600 hover:text-green-400"
                }`}
                title="Respons bagus"
              >
                <svg className="w-3.5 h-3.5" fill={message.reaction === "up" ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
              </button>

              {/* Thumbs down */}
              <button
                onClick={() => onReaction(message.id, "down")}
                className={`text-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all ${
                  message.reaction === "down" ? "text-red-400 opacity-100" : "text-slate-600 hover:text-red-400"
                }`}
                title="Respons kurang tepat"
              >
                <svg className="w-3.5 h-3.5" fill={message.reaction === "down" ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                </svg>
              </button>

              {/* Regenerate (only on last assistant message) */}
              {isLast && onRegenerate && (
                <button
                  onClick={onRegenerate}
                  className="text-slate-600 hover:text-orange-400 text-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all"
                  title="Buat ulang respons"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Buat ulang
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// KEYBOARD SHORTCUTS MODAL
// ============================================================

function ShortcutsModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Keyboard Shortcuts</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="space-y-2">
          {KEYBOARD_SHORTCUTS.map(s => (
            <div key={s.key} className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">{s.desc}</span>
              <kbd className="bg-slate-700 border border-slate-600 rounded px-2 py-0.5 text-slate-300 font-mono text-xs">{s.key}</kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SIDEBAR
// ============================================================

function Sidebar({
  conversations,
  activeId,
  onSelect,
  onNew,
  onDelete,
  onExport,
  onLabel,
  isOpen,
  onClose,
}: {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  onExport: (id: string, format: "markdown" | "pdf" | "word") => void;
  onLabel: (id: string, label: ConversationLabel | undefined) => void;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [search, setSearch] = useState("");
  const [starredOnly, setStarredOnly] = useState(false);

  let filtered = search.trim()
    ? conversations.filter(c =>
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.messages.some(m => m.content.toLowerCase().includes(search.toLowerCase()))
      )
    : conversations;

  if (starredOnly) {
    filtered = filtered.filter(c => c.messages.some(m => m.starred));
  }

  const grouped = filtered.reduce((acc, conv) => {
    const now = new Date();
    const diff = now.getTime() - conv.updatedAt.getTime();
    const days = diff / (1000 * 60 * 60 * 24);
    const key = days < 1 ? "Hari ini" : days < 7 ? "7 hari terakhir" : days < 30 ? "30 hari terakhir" : "Lebih lama";
    if (!acc[key]) acc[key] = [];
    acc[key].push(conv);
    return acc;
  }, {} as Record<string, Conversation[]>);

  const groupOrder = ["Hari ini", "7 hari terakhir", "30 hari terakhir", "Lebih lama"];

  const starredCount = conversations.filter(c => c.messages.some(m => m.starred)).length;

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={onClose} />
      )}

      <aside className={`
        fixed lg:relative inset-y-0 left-0 z-30 lg:z-auto
        w-64 bg-slate-900 border-r border-slate-700/60 flex flex-col
        transition-transform duration-300 lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* Header */}
        <div className="p-3 border-b border-slate-700/60 space-y-2">
          <div className="flex items-center gap-2">
            <button
              onClick={onNew}
              className="flex-1 flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-3 py-2.5 text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Chat Baru
            </button>
            {/* Starred filter toggle */}
            <button
              onClick={() => setStarredOnly(v => !v)}
              className={`p-2.5 rounded-xl border transition-colors text-sm ${
                starredOnly
                  ? "bg-yellow-500/20 border-yellow-500/50 text-yellow-400"
                  : "bg-slate-800 border-slate-700 text-slate-500 hover:text-yellow-400 hover:border-yellow-500/30"
              }`}
              title={starredOnly ? "Tampilkan semua" : "Filter pesan berbintang"}
            >
              ★
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari percakapan..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-orange-500/50 transition-colors"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {starredOnly && (
            <div className="text-xs text-yellow-400/70 px-1">
              ★ {starredCount} percakapan berbintang
            </div>
          )}
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <div className="px-3 py-8 text-center text-slate-600 text-xs">
              {starredOnly ? "Tidak ada percakapan berbintang" : search ? "Tidak ada hasil" : "Belum ada percakapan"}
            </div>
          ) : (
            groupOrder.map(group => {
              const items = grouped[group];
              if (!items?.length) return null;
              return (
                <div key={group} className="mb-2">
                  <div className="px-3 py-1 text-xs font-medium text-slate-600 uppercase tracking-wider">{group}</div>
                  {items.map(conv => {
                    const hasStarred = conv.messages.some(m => m.starred);
                    const labelCfg = conv.label ? LABEL_CONFIG[conv.label] : null;
                    return (
                      <div
                        key={conv.id}
                        className={`group flex flex-col mx-2 px-2 py-2 rounded-lg cursor-pointer transition-colors ${
                          activeId === conv.id ? "bg-slate-700" : "hover:bg-slate-800"
                        }`}
                        onClick={() => { onSelect(conv.id); onClose(); }}
                      >
                        <div className="flex items-center gap-2">
                          <svg className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          <span className="text-xs text-slate-300 truncate flex-1">{conv.title}</span>
                          {hasStarred && <span className="text-yellow-400 text-xs flex-shrink-0">★</span>}
                          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0">
                            {/* Label picker */}
                            <div className="relative" onClick={e => e.stopPropagation()}>
                              <button
                                className="text-slate-600 hover:text-purple-400 p-0.5 transition-colors"
                                title="Beri label"
                                onClick={e => {
                                  e.stopPropagation();
                                  const menu = e.currentTarget.nextElementSibling as HTMLElement;
                                  if (menu) menu.classList.toggle("hidden");
                                }}
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                              </button>
                              <div className="hidden absolute right-0 top-5 z-50 bg-slate-800 border border-slate-700 rounded-lg shadow-xl p-1 w-32">
                                {(Object.keys(LABEL_CONFIG) as ConversationLabel[]).map(lbl => (
                                  <button
                                    key={lbl}
                                    onClick={() => { onLabel(conv.id, conv.label === lbl ? undefined : lbl); }}
                                    className={`w-full text-left px-2 py-1 rounded text-xs transition-colors ${conv.label === lbl ? "bg-slate-700 text-white" : "text-slate-400 hover:bg-slate-700 hover:text-white"}`}
                                  >
                                    {LABEL_CONFIG[lbl].label}
                                  </button>
                                ))}
                              </div>
                            </div>
                            {/* Export dropdown */}
                            <div className="relative export-menu-container" onClick={e => e.stopPropagation()}>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const menu = e.currentTarget.nextElementSibling as HTMLElement;
                                  // Close other open menus first
                                  document.querySelectorAll('.export-menu').forEach((m) => {
                                    if (m !== menu) m.classList.add('hidden');
                                  });
                                  menu?.classList.toggle('hidden');
                                }}
                                className="text-slate-600 hover:text-blue-400 p-0.5 transition-colors"
                                title="Export"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                              </button>
                              <div className="export-menu hidden absolute right-0 top-5 z-50 bg-slate-800 border border-slate-700 rounded-lg shadow-xl p-1 w-32">
                                <button
                                  onClick={() => { onExport(conv.id, "markdown"); document.querySelectorAll('.export-menu').forEach(m => m.classList.add('hidden')); }}
                                  className="w-full text-left px-2 py-1.5 rounded text-xs text-slate-400 hover:bg-slate-700 hover:text-white transition-colors flex items-center gap-1.5"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                  Markdown
                                </button>
                                <button
                                  onClick={() => { onExport(conv.id, "pdf"); document.querySelectorAll('.export-menu').forEach(m => m.classList.add('hidden')); }}
                                  className="w-full text-left px-2 py-1.5 rounded text-xs text-slate-400 hover:bg-slate-700 hover:text-white transition-colors flex items-center gap-1.5"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                  </svg>
                                  PDF
                                </button>
                                <button
                                  onClick={() => { onExport(conv.id, "word"); document.querySelectorAll('.export-menu').forEach(m => m.classList.add('hidden')); }}
                                  className="w-full text-left px-2 py-1.5 rounded text-xs text-slate-400 hover:bg-slate-700 hover:text-white transition-colors flex items-center gap-1.5"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                  Word
                                </button>
                              </div>
                            </div>
                            <button
                              onClick={(e) => { e.stopPropagation(); onDelete(conv.id); }}
                              className="text-slate-600 hover:text-red-400 p-0.5 transition-colors"
                              title="Hapus"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        {labelCfg && (
                          <div className={`mt-1 ml-5 inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full ${labelCfg.bg} ${labelCfg.color} border ${labelCfg.border} w-fit`}>
                            {labelCfg.label}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-700/60 space-y-2">
          <div className="text-xs text-slate-600 text-center">
            {conversations.length} percakapan tersimpan
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-500 hover:text-slate-300 text-xs transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Kembali ke Beranda
          </Link>
        </div>
      </aside>
    </>
  );
}

// ============================================================
// AGENT SELECTOR
// ============================================================

function AgentSelector({ selected, onSelect }: { selected: Agent; onSelect: (agent: Agent) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl px-3 py-2 text-sm transition-colors"
      >
        <span>{selected.icon}</span>
        <span className="text-white font-medium hidden sm:block">{selected.name}</span>
        <svg className={`w-3.5 h-3.5 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="p-2 border-b border-slate-700">
            <p className="text-xs text-slate-500 px-2">Pilih Agen AI</p>
          </div>
          <div className="p-1 max-h-64 overflow-y-auto">
            {AGENTS.map(agent => (
              <button
                key={agent.id}
                onClick={() => { onSelect(agent); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  selected.id === agent.id ? "bg-orange-500/20 text-orange-300" : "hover:bg-slate-700 text-slate-300"
                }`}
              >
                <span className="text-lg">{agent.icon}</span>
                <div>
                  <div className="text-sm font-medium">{agent.name}</div>
                  <div className="text-xs text-slate-500">{agent.description}</div>
                </div>
                {selected.id === agent.id && (
                  <svg className="w-4 h-4 text-orange-400 ml-auto flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// FONT SIZE BUTTON
// ============================================================

function FontSizeControl({ fontSize, onChange }: { fontSize: FontSize; onChange: (s: FontSize) => void }) {
  const sizes: { value: FontSize; label: string }[] = [
    { value: "sm", label: "S" },
    { value: "base", label: "M" },
    { value: "lg", label: "L" },
  ];
  return (
    <div className="flex items-center gap-0.5 bg-slate-800 border border-slate-700 rounded-lg p-0.5">
      {sizes.map(s => (
        <button
          key={s.value}
          onClick={() => onChange(s.value)}
          className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
            fontSize === s.value
              ? "bg-orange-500 text-white"
              : "text-slate-500 hover:text-slate-300"
          }`}
          title={`Ukuran teks ${s.value === "sm" ? "kecil" : s.value === "base" ? "sedang" : "besar"}`}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}

// ============================================================
// MAIN CHAT PAGE
// ============================================================

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent>(AGENTS[0]);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [fontSize, setFontSize] = useState<FontSize>("base");
  const [showChatSearch, setShowChatSearch] = useState(false);
  const [chatSearchQuery, setChatSearchQuery] = useState("");
  const [chatSearchIndex, setChatSearchIndex] = useState(0);
  const abortRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatSearchRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // File attachment state - support multiple files
  const [pendingAttachments, setPendingAttachments] = useState<FileAttachment[]>([]);
  const [pendingAttachment, setPendingAttachment] = useState<FileAttachment | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [isLoadingUrl, setIsLoadingUrl] = useState(false);
  
  // Draft auto-save key: per conversation
  const draftKey = activeConvId ? `konstruksi_draft_${activeConvId}` : "konstruksi_draft_new";

  // Load from localStorage + setup global functions
  useEffect(() => {
    const saved = loadConversations();
    setConversations(saved);
    const savedFontSize = localStorage.getItem("konstruksi_fontsize") as FontSize | null;
    if (savedFontSize && ["sm", "base", "lg"].includes(savedFontSize)) {
      setFontSize(savedFontSize);
    }
    // Restore draft for new conversation
    const draft = localStorage.getItem("konstruksi_draft_new");
    if (draft) setInput(draft);

    // Setup copy code function for markdown code blocks
    (window as { copyCode?: (id: string, btn: HTMLElement) => void }).copyCode = (id: string, btn: HTMLElement) => {
      const pre = document.getElementById(id);
      if (pre) {
        const code = pre.textContent || "";
        navigator.clipboard.writeText(code);
        const textSpan = btn.querySelector(".copy-text");
        if (textSpan) textSpan.textContent = "Tersalin!";
        setTimeout(() => {
          if (textSpan) textSpan.textContent = "Salin";
        }, 2000);
      }
    };

    // Click outside to close export menus
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.export-menu-container') && !target.closest('.header-export-menu')) {
        document.querySelectorAll('.export-menu, .header-export-dropdown').forEach(m => m.classList.add('hidden'));
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (conversations.length > 0) {
      saveConversations(conversations);
    }
  }, [conversations]);

  // Persist font size
  useEffect(() => {
    localStorage.setItem("konstruksi_fontsize", fontSize);
  }, [fontSize]);

  // Draft auto-save: save input to localStorage whenever it changes
  useEffect(() => {
    if (input.trim()) {
      localStorage.setItem(draftKey, input);
    } else {
      localStorage.removeItem(draftKey);
    }
  }, [input, draftKey]);

  // Restore draft when switching conversations
  useEffect(() => {
    const draft = localStorage.getItem(draftKey);
    setInput(draft || "");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeConvId]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations, activeConvId]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
    setCharCount(input.length);
  }, [input]);

  // Focus search input when shown
  useEffect(() => {
    if (showChatSearch) {
      setTimeout(() => chatSearchRef.current?.focus(), 50);
    }
  }, [showChatSearch]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "k") {
        e.preventDefault();
        createNewConversation();
      }
      if (e.ctrlKey && e.key === "/") {
        e.preventDefault();
        setShowShortcuts(prev => !prev);
      }
      if (e.ctrlKey && e.key === "f") {
        e.preventDefault();
        setShowChatSearch(prev => !prev);
      }
      if (e.key === "Escape") {
        setShowShortcuts(false);
        setSidebarOpen(false);
        setShowChatSearch(false);
        setChatSearchQuery("");
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEdit = useCallback((messageId: string, newContent: string) => {
    setConversations(prev => prev.map(c =>
      c.id === activeConvId
        ? {
            ...c,
            messages: c.messages.map(m =>
              m.id === messageId
                ? { ...m, content: newContent, wordCount: countWords(newContent) }
                : m
            ),
          }
        : c
    ));
  }, [activeConvId]);

  const handleLabel = useCallback((convId: string, label: ConversationLabel | undefined) => {
    setConversations(prev => prev.map(c =>
      c.id === convId ? { ...c, label } : c
    ));
  }, []);

  const activeConversation = conversations.find(c => c.id === activeConvId) || null;

  // Compute search matches
  const messages = activeConversation?.messages || [];
  const searchMatches = chatSearchQuery.trim()
    ? messages.reduce((acc, msg, idx) => {
        if (msg.content.toLowerCase().includes(chatSearchQuery.toLowerCase())) {
          acc.push(idx);
        }
        return acc;
      }, [] as number[])
    : [];

  const createNewConversation = useCallback(() => {
    setActiveConvId(null);
    setInput("");
    inputRef.current?.focus();
  }, []);

  const selectConversation = useCallback((id: string) => {
    setActiveConvId(id);
    setChatSearchQuery("");
    setShowChatSearch(false);
  }, []);

  const deleteConversation = useCallback((id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (activeConvId === id) setActiveConvId(null);
  }, [activeConvId]);

  const handleExport = useCallback((id: string, format: "markdown" | "pdf" | "word" = "markdown") => {
    const conv = conversations.find(c => c.id === id);
    if (conv) exportConversation(conv, format);
  }, [conversations]);

  const handleReaction = useCallback((messageId: string, reaction: "up" | "down") => {
    setConversations(prev => prev.map(c =>
      c.id === activeConvId
        ? {
            ...c,
            messages: c.messages.map(m =>
              m.id === messageId
                ? { ...m, reaction: m.reaction === reaction ? null : reaction }
                : m
            ),
          }
        : c
    ));
  }, [activeConvId]);

  const handleStar = useCallback((messageId: string) => {
    setConversations(prev => prev.map(c =>
      c.id === activeConvId
        ? {
            ...c,
            messages: c.messages.map(m =>
              m.id === messageId ? { ...m, starred: !m.starred } : m
            ),
          }
        : c
    ));
  }, [activeConvId]);

  const stopGeneration = useCallback(() => {
    abortRef.current?.abort();
    setIsLoading(false);
    setConversations(prev => prev.map(c =>
      c.id === activeConvId
        ? {
            ...c,
            messages: c.messages.map(m =>
              m.isStreaming ? { ...m, isStreaming: false, content: m.content || "[Dihentikan]" } : m
            ),
          }
        : c
    ));
  }, [activeConvId]);

  const sendMessage = useCallback(async (text?: string) => {
    const messageText = (text || input).trim();
    // Use all pending attachments
    const attachments = pendingAttachment
      ? [pendingAttachment, ...pendingAttachments]
      : [...pendingAttachments];
    const attachment = attachments[0] || null; // Primary attachment for message display
    
    // Allow sending if there's either text or attachment
    if ((!messageText && attachments.length === 0) || isLoading) return;

    setInput("");
    localStorage.removeItem(draftKey);
    setIsLoading(true);
    setPendingAttachment(null); // Clear attachments after sending
    setPendingAttachments([]);
    abortRef.current = new AbortController();

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText || (attachment ? `[Dokumen: ${attachment.name}]` : ""),
      timestamp: new Date(),
      wordCount: countWords(messageText || ""),
      attachment: attachment || undefined,
    };

    // Create or update conversation
    let convId = activeConvId;
    let currentConv: Conversation | undefined;
    
    if (!convId) {
      convId = `conv_${Date.now()}`;
      currentConv = {
        id: convId,
        title: generateTitle(messageText),
        messages: [userMsg],
        createdAt: new Date(),
        updatedAt: new Date(),
        agentId: selectedAgent.id,
      };
      setConversations(prev => [currentConv!, ...prev]);
      setActiveConvId(convId);
    } else {
      const existingConv = conversations.find(c => c.id === convId);
      currentConv = existingConv
        ? { ...existingConv, messages: [...existingConv.messages, userMsg], updatedAt: new Date() }
        : undefined;
      setConversations(prev => prev.map(c =>
        c.id === convId
          ? { ...c, messages: [...c.messages, userMsg], updatedAt: new Date() }
          : c
      ));
    }

    // Add streaming placeholder
    const streamingMsgId = `stream_${Date.now()}`;
    const streamingMsg: Message = {
      id: streamingMsgId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
      isStreaming: true,
    };

    setConversations(prev => prev.map(c =>
      c.id === convId
        ? { ...c, messages: [...c.messages, streamingMsg] }
        : c
    ));

    try {
      // Build history from the updated conversation (not stale state)
      const historyMessages = currentConv
        ? currentConv.messages.filter(m => !m.isStreaming).slice(-10).map(m => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          }))
        : [];

      // Build user message content with attachments if present
      let userContent = messageText;
      if (attachments.length > 0) {
        const attachmentContexts = attachments.map((att, idx) =>
          `[File ${idx + 1}: ${att.name}${att.pageCount ? ` - ${att.pageCount} halaman` : ""}]\n\nKonten:\n---\n${att.content}\n---`
        ).join("\n\n");
        
        const prefix = attachments.length > 1
          ? `[${attachments.length} file terlampir]\n\n${attachmentContexts}`
          : `[File terlampir: ${attachments[0].name}${attachments[0].pageCount ? ` - ${attachments[0].pageCount} halaman` : ""}]\n\nKonten dokumen:\n---\n${attachments[0].content}\n---`;
        
        userContent = messageText
          ? `${messageText}\n\n${prefix}`
          : `Silakan analisa dokumen berikut:\n\n${prefix}`;
      }

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...historyMessages, { role: "user", content: userContent }],
          agentId: selectedAgent.id,
        }),
        signal: abortRef.current.signal,
      });

      const data = await response.json();
      const responseText = data.message || "Maaf, terjadi kesalahan. Silakan coba lagi.";
      const wc = countWords(responseText);

      // Enhanced streaming simulation - word by word with natural pacing
      const words = responseText.split(/(\s+)/); // Keep whitespace as separate tokens
      let displayed = "";
      let wordIndex = 0;
      
      // Variable speed for natural feel (faster for punctuation, slower for sentences)
      const getDelay = (token: string): number => {
        if (/[.!?]$/.test(token)) return 80; // Pause after sentences
        if (/[,;]$/.test(token)) return 50;  // Slight pause after commas
        if (/\s+/.test(token)) return 10;    // Fast for whitespace
        if (token.length > 8) return 40;      // Slower for long words
        return 25;                            // Normal speed
      };

      while (wordIndex < words.length) {
        if (abortRef.current?.signal.aborted) break;
        
        // Batch multiple tokens for smoother animation
        const batchSize = Math.min(2 + Math.floor(Math.random() * 2), words.length - wordIndex);
        const batch = words.slice(wordIndex, wordIndex + batchSize);
        const token = batch.join("");
        
        displayed += token;
        wordIndex += batchSize;
        
        setConversations(prev => prev.map(c =>
          c.id === convId
            ? {
                ...c,
                messages: c.messages.map(m =>
                  m.id === streamingMsgId
                    ? { ...m, content: displayed, isStreaming: true }
                    : m
                ),
              }
            : c
        ));
        
        await new Promise(r => setTimeout(r, getDelay(token)));
      }

      // Finalize
      setConversations(prev => prev.map(c =>
        c.id === convId
          ? {
              ...c,
              messages: c.messages.map(m =>
                m.id === streamingMsgId
                  ? { ...m, content: responseText, isStreaming: false, wordCount: wc }
                  : m
              ),
              updatedAt: new Date(),
            }
          : c
      ));
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setConversations(prev => prev.map(c =>
        c.id === convId
          ? {
              ...c,
              messages: c.messages.map(m =>
                m.id === streamingMsgId
                  ? { ...m, content: "Maaf, terjadi kesalahan koneksi. Silakan coba lagi.", isStreaming: false }
                  : m
              ),
            }
          : c
      ));
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, isLoading, activeConvId, conversations, selectedAgent]);

  const regenerateLastResponse = useCallback(() => {
    if (!activeConversation || isLoading) return;
    const msgs = activeConversation.messages;
    const lastAssistantIdx = [...msgs].reverse().findIndex(m => m.role === "assistant");
    if (lastAssistantIdx === -1) return;
    const lastUserMsg = [...msgs].reverse().find((m, i) => i > lastAssistantIdx && m.role === "user");
    if (!lastUserMsg) return;

    setConversations(prev => prev.map(c =>
      c.id === activeConvId
        ? { ...c, messages: msgs.slice(0, msgs.length - 1 - lastAssistantIdx) }
        : c
    ));
    setTimeout(() => sendMessage(lastUserMsg.content), 50);
  }, [activeConversation, activeConvId, isLoading, sendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // File upload handlers
  const processUploadedFile = useCallback(async (file: File): Promise<FileAttachment | null> => {
    const fileExt = file.name.split(".").pop()?.toLowerCase();
    const MAX_SIZE = 20 * 1024 * 1024; // 20MB
    
    if (file.size > MAX_SIZE) {
      alert(`File "${file.name}" terlalu besar. Maksimum 20MB.`);
      return null;
    }

    const allowedExts = ["pdf", "txt", "md", "docx", "doc", "csv", "xlsx"];
    if (!allowedExts.includes(fileExt || "")) {
      alert(`Format file ".${fileExt}" tidak didukung.\nFormat yang didukung: PDF, DOCX, TXT, MD, CSV, XLSX`);
      return null;
    }

    // For PDF: try client-side extraction first (better quality)
    if (fileExt === "pdf") {
      try {
        const result = await extractPdfFromFile(file);
        return {
          name: file.name,
          type: "application/pdf",
          size: file.size,
          content: result.text,
          pageCount: result.pageCount,
        };
      } catch {
        // Fall through to server-side
      }
    }

    // For other files: use server-side processing
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Gagal mengupload file");
    }

    // If server says needs client processing (compressed PDF/XLSX)
    if (data.needsClientProcessing && data.base64Data) {
      if (fileExt === "pdf") {
        const result = await extractPdfFromBase64(data.base64Data);
        return {
          name: data.filename,
          type: data.type,
          size: data.size,
          content: result.text,
          pageCount: result.pageCount,
        };
      }
    }

    return {
      name: data.filename,
      type: data.type,
      size: data.size,
      content: data.content,
      pageCount: data.pageCount,
    };
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Limit to 5 files total
    const currentCount = pendingAttachments.length + (pendingAttachment ? 1 : 0);
    const remaining = 5 - currentCount;
    if (remaining <= 0) {
      alert("Maksimum 5 file sekaligus.");
      return;
    }
    const filesToProcess = files.slice(0, remaining);

    setIsUploading(true);

    try {
      const results: FileAttachment[] = [];
      for (const file of filesToProcess) {
        const attachment = await processUploadedFile(file);
        if (attachment) results.push(attachment);
      }

      if (results.length > 0) {
        if (results.length === 1 && pendingAttachments.length === 0) {
          setPendingAttachment(results[0]);
        } else {
          setPendingAttachments(prev => [...prev, ...results]);
          if (pendingAttachment) {
            setPendingAttachments(prev => [pendingAttachment, ...prev]);
            setPendingAttachment(null);
          }
        }
      }

      textareaRef.current?.focus();
    } catch (error) {
      console.error("Upload error:", error);
      alert(error instanceof Error ? error.message : "Gagal mengupload file");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleLoadUrl = async () => {
    const url = urlInput.trim();
    if (!url) return;

    setIsLoadingUrl(true);
    try {
      const response = await fetch("/api/fetch-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal mengambil dokumen");
      }

      let content = data.content;
      let pageCount = data.pageCount;

      // If PDF needs client processing
      if (data.needsClientProcessing && data.base64Data) {
        const result = await extractPdfFromBase64(data.base64Data);
        content = result.text;
        pageCount = result.pageCount;
      }

      const attachment: FileAttachment = {
        name: data.filename || new URL(url).hostname,
        type: data.type || "text/plain",
        size: data.size || 0,
        content,
        pageCount,
      };

      if (pendingAttachments.length === 0 && !pendingAttachment) {
        setPendingAttachment(attachment);
      } else {
        setPendingAttachments(prev => [...prev, attachment]);
      }

      setUrlInput("");
      setShowUrlInput(false);
      textareaRef.current?.focus();
    } catch (error) {
      console.error("URL load error:", error);
      alert(error instanceof Error ? error.message : "Gagal memuat dokumen dari URL");
    } finally {
      setIsLoadingUrl(false);
    }
  };

  const handleRemoveAttachment = (index?: number) => {
    if (index === undefined) {
      // Remove single attachment
      if (pendingAttachments.length > 0) {
        setPendingAttachments(prev => prev.slice(1));
      } else {
        setPendingAttachment(null);
      }
    } else if (index === -1) {
      setPendingAttachment(null);
    } else {
      setPendingAttachments(prev => prev.filter((_, i) => i !== index));
    }
  };

  // Get all pending attachments as array
  const allPendingAttachments = pendingAttachment
    ? [pendingAttachment, ...pendingAttachments]
    : pendingAttachments;

  // Handle query param on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) {
      setTimeout(() => sendMessage(q), 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lastAssistantMsgIdx = [...messages].map((m, i) => ({ m, i })).filter(x => x.m.role === "assistant").pop()?.i ?? -1;

  const navigateSearch = (dir: 1 | -1) => {
    if (searchMatches.length === 0) return;
    setChatSearchIndex(prev => {
      const next = prev + dir;
      if (next < 0) return searchMatches.length - 1;
      if (next >= searchMatches.length) return 0;
      return next;
    });
  };

  return (
    <div className="h-screen bg-slate-950 flex overflow-hidden">
      {/* Keyboard shortcuts modal */}
      {showShortcuts && <ShortcutsModal onClose={() => setShowShortcuts(false)} />}

      {/* Sidebar */}
      <Sidebar
        conversations={conversations}
        activeId={activeConvId}
        onSelect={selectConversation}
        onNew={createNewConversation}
        onDelete={deleteConversation}
        onExport={handleExport}
        onLabel={handleLabel}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="flex items-center gap-3 px-4 py-3 border-b border-slate-700/60 bg-slate-900/80 backdrop-blur-sm flex-shrink-0">
          {/* Hamburger */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* New chat (desktop) */}
          <button
            onClick={createNewConversation}
            className="hidden lg:flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors"
            title="Chat Baru (Ctrl+K)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>

          {/* Agent selector */}
          <AgentSelector selected={selectedAgent} onSelect={setSelectedAgent} />

          {/* Title */}
          <div className="flex-1 min-w-0">
            {activeConversation && (
              <p className="text-sm text-slate-400 truncate">{activeConversation.title}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Font size control */}
            <FontSizeControl fontSize={fontSize} onChange={setFontSize} />

            {/* Search in chat */}
            <button
              onClick={() => setShowChatSearch(v => !v)}
              className={`transition-colors ${showChatSearch ? "text-orange-400" : "text-slate-500 hover:text-slate-300"}`}
              title="Cari dalam percakapan (Ctrl+F)"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Export current conversation */}
            {activeConversation && (
              <div className="relative header-export-menu">
                <button
                  onClick={() => {
                    const menu = document.querySelector('.header-export-dropdown') as HTMLElement;
                    menu?.classList.toggle('hidden');
                  }}
                  className="text-slate-500 hover:text-slate-300 transition-colors"
                  title="Export percakapan"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
                <div className="header-export-dropdown hidden absolute right-0 top-8 z-50 bg-slate-800 border border-slate-700 rounded-lg shadow-xl p-1 w-36">
                  <button
                    onClick={() => { handleExport(activeConversation.id, "markdown"); document.querySelector('.header-export-dropdown')?.classList.add('hidden'); }}
                    className="w-full text-left px-3 py-2 rounded text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Markdown
                  </button>
                  <button
                    onClick={() => { handleExport(activeConversation.id, "pdf"); document.querySelector('.header-export-dropdown')?.classList.add('hidden'); }}
                    className="w-full text-left px-3 py-2 rounded text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    PDF
                  </button>
                  <button
                    onClick={() => { handleExport(activeConversation.id, "word"); document.querySelector('.header-export-dropdown')?.classList.add('hidden'); }}
                    className="w-full text-left px-3 py-2 rounded text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Word
                  </button>
                </div>
              </div>
            )}

            {/* Shortcuts */}
            <button
              onClick={() => setShowShortcuts(true)}
              className="text-slate-500 hover:text-slate-300 transition-colors"
              title="Keyboard shortcuts (Ctrl+/)"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </button>

            {/* Status */}
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-green-400 text-xs hidden sm:block">Online</span>
            </div>
          </div>
        </header>

        {/* In-chat search bar */}
        {showChatSearch && messages.length > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/90 border-b border-slate-700/60">
            <svg className="w-4 h-4 text-slate-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={chatSearchRef}
              type="text"
              value={chatSearchQuery}
              onChange={e => { setChatSearchQuery(e.target.value); setChatSearchIndex(0); }}
              placeholder="Cari dalam percakapan..."
              className="flex-1 bg-transparent text-white text-sm placeholder-slate-500 focus:outline-none"
            />
            {chatSearchQuery && (
              <span className="text-slate-500 text-xs whitespace-nowrap">
                {searchMatches.length > 0 ? `${chatSearchIndex + 1}/${searchMatches.length}` : "0 hasil"}
              </span>
            )}
            {searchMatches.length > 1 && (
              <>
                <button onClick={() => navigateSearch(-1)} className="text-slate-500 hover:text-slate-300 p-0.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button onClick={() => navigateSearch(1)} className="text-slate-500 hover:text-slate-300 p-0.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </>
            )}
            <button
              onClick={() => { setShowChatSearch(false); setChatSearchQuery(""); }}
              className="text-slate-500 hover:text-slate-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Messages or Welcome */}
        {messages.length === 0 ? (
          <WelcomeScreen onPrompt={sendMessage} selectedAgent={selectedAgent} />
        ) : (
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((message, idx) => {
                const isSearchMatch = chatSearchQuery.trim() ? searchMatches.includes(idx) : false;
                const isCurrentMatch = chatSearchQuery.trim() && searchMatches[chatSearchIndex] === idx;
                return (
                  <div
                    key={message.id}
                    className={isCurrentMatch ? "ring-1 ring-yellow-400/50 rounded-2xl" : isSearchMatch ? "ring-1 ring-yellow-400/20 rounded-2xl" : ""}
                  >
                    <MessageBubble
                      message={message}
                      agentIcon={selectedAgent.icon}
                      onReaction={handleReaction}
                      onRegenerate={idx === lastAssistantMsgIdx ? regenerateLastResponse : undefined}
                      onStar={handleStar}
                      onEdit={message.role === "user" ? handleEdit : undefined}
                      isLast={idx === lastAssistantMsgIdx}
                      fontSize={fontSize}
                      searchQuery={isSearchMatch ? chatSearchQuery : undefined}
                    />
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}

        {/* Typing indicator */}
        {isLoading && (
          <div className="px-4 pb-1">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-2 text-slate-500 text-xs">
                <span className="flex gap-0.5">
                  <span className="w-1 h-1 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="w-1 h-1 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="w-1 h-1 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                </span>
                <span>{selectedAgent.name} sedang mengetik...</span>
              </div>
            </div>
          </div>
        )}

        {/* Input area */}
        <div className="flex-shrink-0 border-t border-slate-700/60 bg-slate-900/80 backdrop-blur-sm px-4 py-4">
          <div className="max-w-3xl mx-auto">
            {/* Google Drive / URL Input */}
            {showUrlInput && (
              <div className="mb-2 flex items-center gap-2 bg-slate-800/80 border border-blue-500/40 rounded-xl px-3 py-2">
                <svg className="w-5 h-5 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleLoadUrl(); if (e.key === "Escape") { setShowUrlInput(false); setUrlInput(""); } }}
                  placeholder="Paste URL Google Drive atau link dokumen publik..."
                  className="flex-1 bg-transparent text-white placeholder-slate-500 text-sm focus:outline-none"
                  autoFocus
                />
                <button
                  onClick={handleLoadUrl}
                  disabled={!urlInput.trim() || isLoadingUrl}
                  className="text-blue-400 hover:text-blue-300 disabled:text-slate-600 text-xs font-medium px-2 py-1 rounded transition-colors whitespace-nowrap"
                >
                  {isLoadingUrl ? "Memuat..." : "Muat Dokumen"}
                </button>
                <button
                  onClick={() => { setShowUrlInput(false); setUrlInput(""); }}
                  className="text-slate-500 hover:text-slate-300 p-1 rounded transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            {/* Attachment previews - multiple files */}
            {allPendingAttachments.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-2">
                {allPendingAttachments.map((att, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-1.5 max-w-xs">
                    <span className="text-base flex-shrink-0">
                      {att.type?.includes("pdf") || att.name.endsWith(".pdf") ? "📄" :
                       att.type?.includes("word") || att.name.endsWith(".docx") || att.name.endsWith(".doc") ? "📝" :
                       att.type?.includes("sheet") || att.name.endsWith(".xlsx") ? "📊" : "📃"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-300 truncate max-w-[140px]">{att.name}</p>
                      <p className="text-xs text-slate-500">
                        {att.pageCount ? `${att.pageCount} hal · ` : ""}
                        {att.size > 1024 * 1024 ? `${(att.size / (1024 * 1024)).toFixed(1)} MB` : `${(att.size / 1024).toFixed(0)} KB`}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        if (pendingAttachment && idx === 0) {
                          handleRemoveAttachment(-1);
                        } else {
                          handleRemoveAttachment(pendingAttachment ? idx - 1 : idx);
                        }
                      }}
                      className="text-slate-500 hover:text-red-400 p-0.5 rounded transition-colors flex-shrink-0"
                      title="Hapus lampiran"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                {allPendingAttachments.length < 5 && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1 text-xs text-slate-500 hover:text-orange-400 border border-dashed border-slate-700 hover:border-orange-500/50 rounded-lg px-3 py-1.5 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Tambah file
                  </button>
                )}
              </div>
            )}
            
            {/* Upload/loading progress */}
            {(isUploading || isLoadingUrl) && (
              <div className="mb-2 flex items-center gap-2 text-slate-400 text-sm">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{isLoadingUrl ? "Memuat dokumen dari URL..." : "Memproses file PDF/DOCX..."}</span>
              </div>
            )}
            
            <div className="relative bg-slate-800 border border-slate-700 focus-within:border-orange-500/60 rounded-2xl overflow-hidden transition-colors shadow-lg">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={allPendingAttachments.length > 0
                  ? "Tambahkan pertanyaan atau instruksi (opsional)..."
                  : `Tanya ${selectedAgent.name}... (Enter untuk kirim, Shift+Enter untuk baris baru)`}
                className="w-full bg-transparent text-white placeholder-slate-500 px-4 pt-3 pb-2 text-sm resize-none focus:outline-none min-h-[48px] max-h-[120px] pr-28"
                rows={1}
                disabled={isLoading || isUploading || isLoadingUrl}
              />
              <div className="absolute right-2 bottom-2 flex items-center gap-1">
                {/* Char count */}
                {charCount > 0 && (
                  <span className={`text-xs mr-1 ${charCount > 2000 ? "text-red-400" : "text-slate-600"}`}>
                    {charCount}
                  </span>
                )}
                
                {/* Google Drive / URL button */}
                {!isLoading && !isUploading && !isLoadingUrl && (
                  <button
                    onClick={() => setShowUrlInput(v => !v)}
                    className={`p-1.5 rounded-lg transition-colors ${showUrlInput ? "text-blue-400" : "text-slate-500 hover:text-blue-400"}`}
                    title="Muat dari URL / Google Drive"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </button>
                )}

                {/* File upload button */}
                {!isLoading && !isUploading && !isLoadingUrl && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-slate-500 hover:text-orange-400 p-1.5 rounded-lg transition-colors"
                    title="Upload file (PDF, DOCX, TXT, XLSX — maks 5 file)"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                  </button>
                )}
                
                {/* Hidden file input - multiple files */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.txt,.md,.docx,.doc,.csv,.xlsx,application/pdf,text/plain,text/markdown,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleFileSelect}
                  multiple
                  className="hidden"
                />
                
                {input.trim() && !isLoading && (
                  <button
                    onClick={() => setInput("")}
                    className="text-slate-500 hover:text-slate-300 p-1.5 rounded-lg transition-colors"
                    title="Hapus teks"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                {isLoading ? (
                  <button
                    onClick={stopGeneration}
                    className="bg-red-500 hover:bg-red-600 text-white w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
                    title="Hentikan generasi"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <rect x="6" y="6" width="12" height="12" rx="1" />
                    </svg>
                  </button>
                ) : (
                  <button
                    onClick={() => sendMessage()}
                    disabled={!input.trim() && allPendingAttachments.length === 0}
                    className="bg-orange-500 hover:bg-orange-600 disabled:bg-slate-700 disabled:text-slate-500 text-white w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
                    title="Kirim (Enter)"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between mt-2 px-1">
              <div className="flex items-center gap-2">
                <p className="text-slate-700 text-xs">
                  KonstruksiAI dapat membuat kesalahan. Verifikasi informasi penting dengan sumber resmi.
                </p>
                {input.trim() && (
                  <span className="text-slate-700 text-xs flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-orange-500/50 rounded-full"></span>
                    Draft tersimpan
                  </span>
                )}
              </div>
              <button
                onClick={() => setShowShortcuts(true)}
                className="text-slate-700 hover:text-slate-500 text-xs transition-colors flex-shrink-0"
              >
                Ctrl+/
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
