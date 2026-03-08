"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";

// ============================================================
// TYPES
// ============================================================

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  reaction?: "up" | "down" | null;
  wordCount?: number;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  agentId?: string;
}

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
  { key: "Ctrl+/", desc: "Tampilkan shortcut" },
  { key: "Esc", desc: "Tutup panel" },
];

// ============================================================
// MARKDOWN RENDERER
// ============================================================

function renderMarkdown(content: string): string {
  let html = content;

  // Code blocks (must be before inline code)
  html = html.replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) => {
    const escaped = code.replace(/</g, "<").replace(/>/g, ">");
    return `<div class="my-3 rounded-lg overflow-hidden border border-slate-600">
      ${lang ? `<div class="bg-slate-700 px-3 py-1 text-xs text-slate-400 font-mono flex items-center justify-between"><span>${lang}</span></div>` : ""}
      <pre class="bg-slate-800 p-3 overflow-x-auto text-sm text-green-300 font-mono leading-relaxed"><code>${escaped.trim()}</code></pre>
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

function exportConversation(conv: Conversation): void {
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
  isLast,
}: {
  message: Message;
  agentIcon: string;
  onReaction: (id: string, reaction: "up" | "down") => void;
  onRegenerate?: () => void;
  isLast: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (message.role === "user") {
    return (
      <div className="flex gap-3 justify-end group">
        <div className="max-w-[80%] sm:max-w-[70%]">
          <div className="bg-orange-500 text-white rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed">
            {message.content}
          </div>
          <div className="flex items-center justify-end gap-2 mt-1">
            <span className="text-slate-600 text-xs">
              {message.timestamp.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
            </span>
            <button
              onClick={handleCopy}
              className="text-slate-600 hover:text-slate-400 text-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {copied ? (
                <span className="text-green-400">✓</span>
              ) : (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
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
              className="text-sm leading-relaxed text-slate-200 prose-custom"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
            />
          )}
        </div>

        {/* Message actions */}
        <div className="flex items-center gap-3 mt-1.5 px-1">
          <span className="text-slate-600 text-xs">
            {message.timestamp.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
          </span>
          {message.wordCount && !message.isStreaming && (
            <span className="text-slate-700 text-xs">{message.wordCount} kata</span>
          )}
          {!message.isStreaming && (
            <>
              <button
                onClick={handleCopy}
                className="text-slate-600 hover:text-slate-400 text-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Salin"
              >
                {copied ? (
                  <><span className="text-green-400">✓</span> <span className="text-green-400">Disalin</span></>
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
  isOpen,
  onClose,
}: {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  onExport: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? conversations.filter(c =>
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.messages.some(m => m.content.toLowerCase().includes(search.toLowerCase()))
      )
    : conversations;

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
          <button
            onClick={onNew}
            className="w-full flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-3 py-2.5 text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Chat Baru
          </button>

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
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <div className="px-3 py-8 text-center text-slate-600 text-xs">
              {search ? "Tidak ada hasil" : "Belum ada percakapan"}
            </div>
          ) : (
            groupOrder.map(group => {
              const items = grouped[group];
              if (!items?.length) return null;
              return (
                <div key={group} className="mb-2">
                  <div className="px-3 py-1 text-xs font-medium text-slate-600 uppercase tracking-wider">{group}</div>
                  {items.map(conv => (
                    <div
                      key={conv.id}
                      className={`group flex items-center gap-2 mx-2 px-2 py-2 rounded-lg cursor-pointer transition-colors ${
                        activeId === conv.id ? "bg-slate-700" : "hover:bg-slate-800"
                      }`}
                      onClick={() => { onSelect(conv.id); onClose(); }}
                    >
                      <svg className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span className="text-xs text-slate-300 truncate flex-1">{conv.title}</span>
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0">
                        <button
                          onClick={(e) => { e.stopPropagation(); onExport(conv.id); }}
                          className="text-slate-600 hover:text-blue-400 p-0.5 transition-colors"
                          title="Export"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </button>
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
                  ))}
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
  const abortRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load from localStorage
  useEffect(() => {
    const saved = loadConversations();
    setConversations(saved);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (conversations.length > 0) {
      saveConversations(conversations);
    }
  }, [conversations]);

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
      if (e.key === "Escape") {
        setShowShortcuts(false);
        setSidebarOpen(false);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeConversation = conversations.find(c => c.id === activeConvId) || null;

  const createNewConversation = useCallback(() => {
    setActiveConvId(null);
    setInput("");
    inputRef.current?.focus();
  }, []);

  const selectConversation = useCallback((id: string) => {
    setActiveConvId(id);
  }, []);

  const deleteConversation = useCallback((id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (activeConvId === id) setActiveConvId(null);
  }, [activeConvId]);

  const handleExport = useCallback((id: string) => {
    const conv = conversations.find(c => c.id === id);
    if (conv) exportConversation(conv);
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

  const stopGeneration = useCallback(() => {
    abortRef.current?.abort();
    setIsLoading(false);
    // Finalize any streaming message
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
    if (!messageText || isLoading) return;

    setInput("");
    setIsLoading(true);
    abortRef.current = new AbortController();

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
      wordCount: countWords(messageText),
    };

    // Create or update conversation
    let convId = activeConvId;
    if (!convId) {
      convId = `conv_${Date.now()}`;
      const newConv: Conversation = {
        id: convId,
        title: generateTitle(messageText),
        messages: [userMsg],
        createdAt: new Date(),
        updatedAt: new Date(),
        agentId: selectedAgent.id,
      };
      setConversations(prev => [newConv, ...prev]);
      setActiveConvId(convId);
    } else {
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
      // Get conversation history for context
      const currentConv = conversations.find(c => c.id === convId);
      const historyMessages = currentConv
        ? currentConv.messages.filter(m => !m.isStreaming).slice(-10).map(m => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          }))
        : [];

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...historyMessages, { role: "user", content: messageText }],
          agentId: selectedAgent.id,
        }),
        signal: abortRef.current.signal,
      });

      const data = await response.json();
      const responseText = data.message || "Maaf, terjadi kesalahan. Silakan coba lagi.";
      const wc = countWords(responseText);

      // Simulate streaming effect
      let displayed = "";
      const chars = responseText.split("");
      const chunkSize = Math.max(1, Math.floor(chars.length / 40));

      for (let i = 0; i < chars.length; i += chunkSize) {
        if (abortRef.current?.signal.aborted) break;
        displayed += chars.slice(i, i + chunkSize).join("");
        const current = displayed;
        setConversations(prev => prev.map(c =>
          c.id === convId
            ? {
                ...c,
                messages: c.messages.map(m =>
                  m.id === streamingMsgId
                    ? { ...m, content: current, isStreaming: true }
                    : m
                ),
              }
            : c
        ));
        await new Promise(r => setTimeout(r, 15));
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
  }, [input, isLoading, activeConvId, conversations, selectedAgent]);

  const regenerateLastResponse = useCallback(() => {
    if (!activeConversation || isLoading) return;
    const msgs = activeConversation.messages;
    // Find last user message before last assistant message
    const lastAssistantIdx = [...msgs].reverse().findIndex(m => m.role === "assistant");
    if (lastAssistantIdx === -1) return;
    const lastUserMsg = [...msgs].reverse().find((m, i) => i > lastAssistantIdx && m.role === "user");
    if (!lastUserMsg) return;

    // Remove last assistant message and resend
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

  // Handle query param on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) {
      setTimeout(() => sendMessage(q), 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const messages = activeConversation?.messages || [];
  const lastAssistantMsgIdx = [...messages].map((m, i) => ({ m, i })).filter(x => x.m.role === "assistant").pop()?.i ?? -1;

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
            {/* Export current conversation */}
            {activeConversation && (
              <button
                onClick={() => handleExport(activeConversation.id)}
                className="text-slate-500 hover:text-slate-300 transition-colors"
                title="Export percakapan"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
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

        {/* Messages or Welcome */}
        {messages.length === 0 ? (
          <WelcomeScreen onPrompt={sendMessage} selectedAgent={selectedAgent} />
        ) : (
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((message, idx) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  agentIcon={selectedAgent.icon}
                  onReaction={handleReaction}
                  onRegenerate={idx === lastAssistantMsgIdx ? regenerateLastResponse : undefined}
                  isLast={idx === lastAssistantMsgIdx}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}

        {/* Input area */}
        <div className="flex-shrink-0 border-t border-slate-700/60 bg-slate-900/80 backdrop-blur-sm px-4 py-4">
          <div className="max-w-3xl mx-auto">
            <div className="relative bg-slate-800 border border-slate-700 focus-within:border-orange-500/60 rounded-2xl overflow-hidden transition-colors shadow-lg">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Tanya ${selectedAgent.name}... (Enter untuk kirim, Shift+Enter untuk baris baru)`}
                className="w-full bg-transparent text-white placeholder-slate-500 px-4 pt-3 pb-2 text-sm resize-none focus:outline-none min-h-[48px] max-h-[120px] pr-24"
                rows={1}
                disabled={isLoading}
              />
              <div className="absolute right-2 bottom-2 flex items-center gap-1">
                {/* Char count */}
                {charCount > 0 && (
                  <span className={`text-xs mr-1 ${charCount > 2000 ? "text-red-400" : "text-slate-600"}`}>
                    {charCount}
                  </span>
                )}
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
                    disabled={!input.trim()}
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
              <p className="text-slate-700 text-xs">
                KonstruksiAI dapat membuat kesalahan. Verifikasi informasi penting dengan sumber resmi.
              </p>
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
