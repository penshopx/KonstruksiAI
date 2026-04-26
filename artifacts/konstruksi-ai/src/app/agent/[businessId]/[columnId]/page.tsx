"use client";

import { useState, useRef, useEffect } from "react";
import { useParams } from "wouter";
import Link from "@/shims/next-link";
import { getAgent, getBusinessFunction, getEngineeringDomain } from "@/lib/agents";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface PageProps {
  params?: {
    businessId: string;
    columnId: string;
  };
}

export default function AgentPage(_props: PageProps) {
  const params = useParams<{ businessId: string; columnId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "info" | "tasks">("chat");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const agent = params.businessId && params.columnId
    ? getAgent(params.businessId, params.columnId)
    : null;

  const business = params.businessId ? getBusinessFunction(params.businessId) : null;
  const domain = params.columnId ? getEngineeringDomain(params.columnId) : null;

  // Initialize with welcome message
  useEffect(() => {
    if (agent && messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: `Halo! Saya **${agent.name}**.

${agent.persona}

**Saya dapat membantu Anda dengan:**
${agent.tasks.map(t => `• **${t.title}** — ${t.description}`).join("\n")}

**Contoh tugas yang bisa Anda berikan:**
${agent.tasks.map(t => `• *"${t.examplePrompt}"*`).join("\n")}

Silakan ketik tugas atau pertanyaan Anda, dan saya akan segera mengerjakannya! 🚀`,
          timestamp: new Date(),
        },
      ]);
    }
  }, [agent, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading || !agent) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
          agentId: agent.id,
          businessId: agent.businessId,
          columnId: agent.columnId,
        }),
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message || "Maaf, terjadi kesalahan. Silakan coba lagi.",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Maaf, terjadi kesalahan koneksi. Silakan coba lagi.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  const handleTaskClick = (examplePrompt: string) => {
    setInputValue(examplePrompt);
    setActiveTab("chat");
    inputRef.current?.focus();
  };

  const formatMessage = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\n/g, "<br/>")
      .replace(/\|(.+)\|/g, (match) => {
        const cells = match.split("|").filter(c => c.trim());
        return `<div class="overflow-x-auto my-2"><table class="min-w-full text-sm border-collapse">${
          cells.map((c, i) => 
            i === 0 
              ? `<tr class="bg-slate-700">${cells.map(h => `<th class="border border-slate-600 px-2 py-1 text-left text-orange-400">${h.trim()}</th>`).join("")}</tr>`
              : ""
          ).join("")
        }</table></div>`;
      });
  };

  const getDomainColor = (colorName: string) => {
    const colors: Record<string, string> = {
      orange: "from-orange-500 to-orange-700",
      blue: "from-blue-500 to-blue-700",
      purple: "from-purple-500 to-purple-700",
      yellow: "from-yellow-500 to-yellow-700",
      red: "from-red-500 to-red-700",
      green: "from-green-500 to-green-700",
    };
    return colors[colorName] || "from-orange-500 to-orange-700";
  };

  if (!resolvedParams) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Memuat...</div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🤖</div>
          <h1 className="text-2xl font-bold text-white mb-2">Agent Tidak Ditemukan</h1>
          <p className="text-slate-400 mb-6">Agent dengan ID tersebut tidak tersedia.</p>
          <Link href="/matrix" className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors">
            Kembali ke Matrix
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/matrix" className="text-slate-400 hover:text-white transition-colors">
              ← Matrix
            </Link>
            <span className="text-slate-600">|</span>
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getDomainColor(domain?.color || "orange")} flex items-center justify-center text-xl`}>
              {domain?.icon || "🤖"}
            </div>
            <div>
              <h1 className="text-white font-bold text-sm md:text-base">{agent.name}</h1>
              <p className="text-slate-400 text-xs">
                {business?.label} × {domain?.label}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden md:flex items-center gap-1 text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
              Online
            </span>
            <Link href="/" className="text-slate-400 hover:text-white text-sm transition-colors">
              KonstruksiAI
            </Link>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-1">
            {[
              { id: "chat", label: "💬 Chat", desc: "Berikan tugas" },
              { id: "tasks", label: "📋 Tugas", desc: "Contoh tugas" },
              { id: "info", label: "ℹ️ Info", desc: "Tentang agent" },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as "chat" | "info" | "tasks")}
                className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? "border-orange-500 text-orange-400"
                    : "border-transparent text-slate-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-4 flex flex-col">

        {/* CHAT TAB */}
        {activeTab === "chat" && (
          <div className="flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 min-h-0" style={{ maxHeight: "calc(100vh - 280px)" }}>
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${
                    message.role === "user"
                      ? "bg-orange-500 text-white"
                      : `bg-gradient-to-br ${getDomainColor(domain?.color || "orange")} text-white`
                  }`}>
                    {message.role === "user" ? "U" : domain?.icon || "🤖"}
                  </div>

                  {/* Bubble */}
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-orange-500 text-white rounded-tr-sm"
                      : "bg-slate-800 text-slate-100 rounded-tl-sm border border-slate-700"
                  }`}>
                    <div
                      className="text-sm leading-relaxed prose prose-invert prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                    />
                    <div className={`text-xs mt-1 ${message.role === "user" ? "text-orange-200" : "text-slate-500"}`}>
                      {message.timestamp.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex gap-3">
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${getDomainColor(domain?.color || "orange")} flex items-center justify-center text-sm`}>
                    {domain?.icon || "🤖"}
                  </div>
                  <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1 items-center">
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                      <span className="text-slate-400 text-xs ml-2">Sedang mengerjakan...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Task Buttons */}
            <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
              {agent.tasks.slice(0, 3).map((task, i) => (
                <button
                  key={i}
                  onClick={() => handleTaskClick(task.examplePrompt)}
                  className="flex-shrink-0 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 hover:border-orange-500 px-3 py-1.5 rounded-full transition-all"
                >
                  {task.title}
                </button>
              ))}
            </div>

            {/* Input Area */}
            <div className="bg-slate-800 rounded-2xl border border-slate-700 focus-within:border-orange-500 transition-colors">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Berikan tugas kepada ${agent.name}... (Enter untuk kirim, Shift+Enter untuk baris baru)`}
                className="w-full bg-transparent text-white placeholder-slate-500 px-4 pt-3 pb-2 resize-none outline-none text-sm"
                rows={3}
                disabled={isLoading}
              />
              <div className="flex items-center justify-between px-4 pb-3">
                <span className="text-xs text-slate-500">
                  {inputValue.length > 0 ? `${inputValue.length} karakter` : "Ketik tugas Anda..."}
                </span>
                <button
                  onClick={() => sendMessage(inputValue)}
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-orange-500 hover:bg-orange-600 disabled:bg-slate-700 disabled:text-slate-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      Mengerjakan...
                    </>
                  ) : (
                    <>Kirim →</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TASKS TAB */}
        {activeTab === "tasks" && (
          <div className="space-y-4">
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <h2 className="text-white font-bold text-lg mb-1">📋 Tugas yang Bisa Dikerjakan</h2>
              <p className="text-slate-400 text-sm">Klik tombol &quot;Coba Sekarang&quot; untuk langsung menggunakan contoh tugas</p>
            </div>

            {agent.tasks.map((task, i) => (
              <div key={i} className="bg-slate-800 rounded-xl p-5 border border-slate-700 hover:border-orange-500/50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-1">{task.title}</h3>
                    <p className="text-slate-400 text-sm mb-3">{task.description}</p>
                    
                    <div className="bg-slate-900 rounded-lg p-3 mb-3">
                      <p className="text-xs text-slate-500 mb-1">Contoh prompt:</p>
                      <p className="text-orange-300 text-sm italic">&quot;{task.examplePrompt}&quot;</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">Output:</span>
                      <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded">{task.outputFormat}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleTaskClick(task.examplePrompt)}
                    className="flex-shrink-0 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Coba →
                  </button>
                </div>
              </div>
            ))}

            <div className="bg-slate-800/50 rounded-xl p-4 border border-dashed border-slate-700">
              <p className="text-slate-400 text-sm text-center">
                💡 Anda juga bisa memberikan tugas kustom sesuai kebutuhan spesifik Anda
              </p>
            </div>
          </div>
        )}

        {/* INFO TAB */}
        {activeTab === "info" && (
          <div className="space-y-4">
            {/* Agent Profile */}
            <div className={`bg-gradient-to-br ${getDomainColor(domain?.color || "orange")} rounded-xl p-5`}>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center text-3xl">
                  {domain?.icon || "🤖"}
                </div>
                <div>
                  <h2 className="text-white font-bold text-xl">{agent.name}</h2>
                  <p className="text-white/80 text-sm">{business?.label} × {domain?.label}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    <span className="text-white/70 text-xs">AI Agent Aktif</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Persona */}
            <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
              <h3 className="text-orange-400 font-semibold mb-3">👤 Persona Agent</h3>
              <p className="text-slate-300 text-sm leading-relaxed">{agent.persona}</p>
            </div>

            {/* Expertise */}
            <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
              <h3 className="text-orange-400 font-semibold mb-3">🎯 Keahlian Utama</h3>
              <div className="flex flex-wrap gap-2">
                {agent.expertise.map((exp, i) => (
                  <span key={i} className="bg-slate-700 text-slate-300 text-sm px-3 py-1 rounded-full">
                    {exp}
                  </span>
                ))}
              </div>
            </div>

            {/* Regulations */}
            <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
              <h3 className="text-orange-400 font-semibold mb-3">📜 Regulasi yang Dikuasai</h3>
              <ul className="space-y-2">
                {agent.regulations.map((reg, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="text-green-400 mt-0.5">✓</span>
                    {reg}
                  </li>
                ))}
              </ul>
            </div>

            {/* Output Types */}
            <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
              <h3 className="text-orange-400 font-semibold mb-3">📄 Jenis Output yang Dihasilkan</h3>
              <div className="grid grid-cols-2 gap-2">
                {agent.outputTypes.map((output, i) => (
                  <div key={i} className="bg-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-300 flex items-center gap-2">
                    <span className="text-orange-400">→</span>
                    {output}
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={() => setActiveTab("chat")}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold transition-colors"
            >
              💬 Mulai Berikan Tugas →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
