import { useState, useEffect, useRef } from "react";
import Link from "@/shims/next-link";
import { 
  Bot, 
  Radar, 
  X, 
  Newspaper, 
  ExternalLink, 
  CalendarDays, 
  ChevronRight, 
  Gavel, 
  Building2, 
  ShieldCheck, 
  Landmark,
  MessageSquare,
  AlertCircle,
  Send,
  Loader2
} from "lucide-react";

type RadarCategory = "kementerian" | "lpjk-regulasi" | "infrastruktur" | "tender-pengadaan";

type RadarArticle = {
  id: string;
  title: string;
  summary: string;
  category: RadarCategory;
  sourceName: string;
  sourceUrl: string;
  articleUrl: string;
  publishedAt: string | null;
  fetchedAt: string;
  importance: "normal" | "penting";
};

type FloatingChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type AuthState = "checking" | "authenticated" | "guest";

type FilterOption = {
  id: string;
  label: string;
  mappedCategory: "all" | RadarCategory;
  icon: React.ElementType;
  keywords?: string[];
};

const RADAR_FILTERS: FilterOption[] = [
  { id: "all", label: "Semua", mappedCategory: "all", icon: Newspaper },
  { id: "tender", label: "Tender", mappedCategory: "tender-pengadaan", icon: Gavel },
  { id: "proyek", label: "Proyek/Infrastruktur", mappedCategory: "infrastruktur", icon: Building2 },
  { id: "kompetensi", label: "Kompetensi Teknis", mappedCategory: "lpjk-regulasi", icon: ShieldCheck },
  {
    id: "manajemen",
    label: "Manajemen Bisnis",
    mappedCategory: "all",
    icon: Landmark,
    keywords: ["manajemen", "bisnis", "kontrak", "cashflow", "operasional", "keuangan", "perusahaan"],
  },
];

const GUIDED_QUESTIONS = [
  {
    id: "tender",
    q: "Bagaimana cara mencari tender yang sesuai?",
    a: "Anda dapat memantau tender terbaru atau menggunakan sistem analisis cerdas kami untuk menilai peluang memenangkan suatu tender.",
    links: [
      { label: "Panduan Tender", url: "/tender" },
      { label: "Analisis Tender", url: "/tender-intelligence" }
    ]
  },
  {
    id: "perizinan",
    q: "Apa saja aturan perizinan terbaru?",
    a: "Sistem kami menyimpan basis pengetahuan hukum, SBU, dan SKK terkini untuk memastikan kesiapan legal perusahaan Anda.",
    links: [
      { label: "Hukum & Perizinan", url: "/legal-licensing" },
      { label: "Kesiapan SBU", url: "/sbu-readiness" }
    ]
  },
  {
    id: "hitung",
    q: "Bagaimana melakukan simulasi biaya (RAB)?",
    a: "Gunakan fitur simulasi kami untuk menghitung perkiraan anggaran dan merencanakan margin proyek yang aman.",
    links: [
      { label: "Simulasi Proyek", url: "/simulasi" },
      { label: "Referensi Harga", url: "/pricing" }
    ]
  }
];

function getHelpDeskReply(question: string): string {
  const normalizedQuestion = question.toLowerCase();
  const matchedQuestion = GUIDED_QUESTIONS.find((item) => {
    const keywords = item.q.toLowerCase().split(/\s+/).filter((word) => word.length > 4);
    return keywords.some((keyword) => normalizedQuestion.includes(keyword));
  });

  if (matchedQuestion) {
    const featureLinks = matchedQuestion.links.map((link) => link.label).join(" dan ");
    return `${matchedQuestion.a}\n\nFitur yang bisa Anda buka: ${featureLinks}.`;
  }

  if (/(radar|update|berita|informasi resmi)/.test(normalizedQuestion)) {
    return "Untuk pembaruan resmi, buka Radar Harian. Anda dapat memilih kategori, membaca ringkasan, membuka sumber asli, lalu memakai tombol “Elaborasi” pada update yang ingin dipahami lebih lanjut.";
  }

  if (/(chat|ai|agen|asisten)/.test(normalizedQuestion)) {
    return "Untuk konsultasi teknis, buka Chat AI dari navigasi atau tombol Mulai Chat. Pilih agen yang paling sesuai dengan kebutuhan, misalnya Tender Expert, Estimator RAB, atau Ahli K3.";
  }

  if (/(akun|daftar|register|masuk|login|profil)/.test(normalizedQuestion)) {
    return "Anda dapat membuat akun melalui tombol Daftar, lalu masuk untuk menyimpan percakapan dan menggunakan elaborasi AI. Pengaturan nama dan profil tersedia di halaman Profil.";
  }

  return "Saya bisa membantu menjelaskan cara menggunakan KonstruksiAI. Coba tanyakan tentang Radar Harian, tender, simulasi biaya, Chat AI, akun, atau fitur aplikasi yang ingin Anda buka.";
}

function formatDate(value: string | null): string {
  if (!value) return "Tanggal tidak tersedia";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Tanggal tidak valid";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

async function streamFloatingChatReply(
  messages: Array<{ role: "user" | "assistant"; content: string }>,
  onDelta: (content: string) => void,
): Promise<void> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ messages, agentId: "general", stream: true }),
  });

  if (response.status === 401) {
    throw new Error("Silakan masuk terlebih dahulu untuk menggunakan chat AI.");
  }

  if (!response.ok) {
    const data = await response.json().catch(() => ({})) as { error?: string };
    throw new Error(data.error || "Chat AI belum dapat digunakan saat ini.");
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error("Respons chat tidak dapat dibaca.");

  const decoder = new TextDecoder();
  let buffer = "";

  const processLine = (line: string) => {
    if (!line.startsWith("data:")) return;
    const rawPayload = line.slice(5).trim();
    if (!rawPayload) return;

    const payload = JSON.parse(rawPayload) as {
      content?: string;
      error?: string;
    };
    if (payload.error) throw new Error(payload.error);
    if (payload.content) onDelta(payload.content);
  };

  while (true) {
    const { done, value } = await reader.read();
    buffer += decoder.decode(value ?? new Uint8Array(), { stream: !done });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    lines.forEach(processLine);
    if (done) break;
  }

  if (buffer.trim()) processLine(buffer.trim());
}

function ChatThread({ messages }: { messages: FloatingChatMessage[] }) {
  if (messages.length === 0) return null;

  return (
    <div className="mt-5 space-y-3 border-t border-slate-800 pt-4" aria-label="Riwayat elaborasi">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Elaborasi Anda</p>
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex gap-2.5 ${message.role === "user" ? "justify-end" : "justify-start"}`}
        >
          {message.role === "assistant" && (
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-500/10 text-orange-400">
              <Bot className="h-3.5 w-3.5" />
            </div>
          )}
          <div
            className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
              message.role === "user"
                ? "rounded-br-md bg-cyan-500/15 text-cyan-100"
                : "rounded-bl-md bg-slate-800 text-slate-200"
            }`}
          >
            {message.content || <span className="inline-block h-3 w-12 animate-pulse rounded bg-slate-600" />}
          </div>
        </div>
      ))}
    </div>
  );
}

function ChatComposer({
  authState,
  requiresAuth = true,
  chatEnabled = true,
  input,
  loading,
  error,
  context,
  onInputChange,
  onSubmit,
  onClearContext,
  onClose,
}: {
  authState: AuthState;
  requiresAuth?: boolean;
  chatEnabled?: boolean;
  input: string;
  loading: boolean;
  error: string | null;
  context?: RadarArticle | null;
  onInputChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onClearContext?: () => void;
  onClose: () => void;
}) {
  const canChat = !requiresAuth || authState === "authenticated";

  return (
    <div className="shrink-0 border-t border-slate-800 bg-slate-950/40 p-3">
      {context && (
        <div className="mb-2 flex items-start gap-2 rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-2.5 py-2 text-[11px] text-cyan-200">
          <span className="min-w-0 flex-1 line-clamp-2">
            Konteks: <strong>{context.title}</strong>
          </span>
          <button
            type="button"
            onClick={onClearContext}
            className="shrink-0 text-cyan-400 hover:text-cyan-200"
            aria-label="Hapus konteks artikel"
          >
            ×
          </button>
        </div>
      )}
      {!chatEnabled ? (
        <div className="rounded-xl border border-slate-700 bg-slate-800/50 px-3 py-2.5 text-xs leading-relaxed text-slate-400">
          Konteks Radar sudah siap. Elaborasi AI untuk artikel ini ditunda sampai sumber AI diaktifkan kembali.
        </div>
      ) : requiresAuth && authState === "checking" ? (
        <div className="rounded-xl border border-slate-700 bg-slate-800/50 px-3 py-2.5 text-xs text-slate-400">
          Memeriksa akses chat...
        </div>
      ) : requiresAuth && authState === "guest" ? (
        <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 px-3 py-2.5 text-xs leading-relaxed text-slate-300">
          Masuk untuk mengelaborasi informasi bersama AI.{" "}
          <Link href="/login" onClick={onClose} className="font-semibold text-orange-300 hover:text-orange-200">
            Masuk
          </Link>
          {" atau "}
          <Link href="/register" onClick={onClose} className="font-semibold text-orange-300 hover:text-orange-200">
            daftar gratis
          </Link>
          .
        </div>
      ) : (
        <>
          {error && (
            <div className="mb-2 rounded-lg border border-orange-500/20 bg-orange-500/5 px-3 py-2 text-xs text-orange-200" role="alert">
              {error}
            </div>
          )}
          <form onSubmit={onSubmit} className="flex items-end gap-2">
            <label htmlFor="floating-chat-input" className="sr-only">Pertanyaan elaborasi</label>
            <textarea
              id="floating-chat-input"
              value={input}
              onChange={(event) => onInputChange(event.target.value)}
              placeholder={context ? "Tanyakan dampak, konteks, atau langkah berikutnya..." : "Tanyakan untuk memperdalam pengetahuan..."}
              rows={1}
              maxLength={6000}
              disabled={loading || !canChat}
              className="max-h-24 min-h-[42px] flex-1 resize-none rounded-xl border border-slate-700 bg-slate-800 px-3 py-2.5 text-xs leading-relaxed text-white outline-none placeholder:text-slate-500 focus:border-cyan-400"
            />
            <button
              type="submit"
              disabled={loading || !canChat || !input.trim()}
              aria-label="Kirim pertanyaan"
              className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white transition-colors hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </form>
          <p className="mt-1.5 text-[10px] text-slate-600">
            {requiresAuth ? "Jawaban AI membantu elaborasi; tetap verifikasi sumber resmi." : "Tanyakan cara memakai fitur apa pun di aplikasi."}
          </p>
        </>
      )}
    </div>
  );
}

export function FloatingChatbots() {
  const [activePanel, setActivePanel] = useState<"none" | "guided" | "radar">("none");
  const panelRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement | null>(null);
  
  // Radar State
  const [radarFilter, setRadarFilter] = useState<string>("all");
  const [articles, setArticles] = useState<RadarArticle[]>([]);
  const [sources, setSources] = useState<Array<{ status: "pending" | "loading" | "success" | "error"; name: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryToken, setRetryToken] = useState(0);

  // Guided State
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [authState, setAuthState] = useState<AuthState>("checking");
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [radarMessages, setRadarMessages] = useState<FloatingChatMessage[]>([]);
  const [guidedMessages, setGuidedMessages] = useState<FloatingChatMessage[]>([]);
  const [radarContext, setRadarContext] = useState<RadarArticle | null>(null);

  const closePanel = () => {
    setActivePanel("none");
    requestAnimationFrame(() => launcherRef.current?.focus());
  };

  const openPanel = (panel: "guided" | "radar", launcher: HTMLButtonElement) => {
    launcherRef.current = launcher;
    setActivePanel(panel);
  };

  useEffect(() => {
    if (activePanel === "none") return;

    const panel = panelRef.current;
    const focusableSelector = "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])";
    const focusableElements = () => panel
      ? Array.from(panel.querySelectorAll<HTMLElement>(focusableSelector))
      : [];
    const frame = requestAnimationFrame(() => {
      (focusableElements()[0] ?? panel)?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closePanel();
        return;
      }

      if (event.key !== "Tab") return;
      const elements = focusableElements();
      if (!elements.length) {
        event.preventDefault();
        panel?.focus();
        return;
      }

      const first = elements[0]!;
      const last = elements[elements.length - 1]!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activePanel]);

  useEffect(() => {
    if (activePanel === "none") return;

    let mounted = true;
    setAuthState("checking");
    fetch("/api/auth/me", { credentials: "include" })
      .then((response) => response.ok ? response.json() : { user: null })
      .then((data: { user?: unknown }) => {
        if (mounted) setAuthState(data.user ? "authenticated" : "guest");
      })
      .catch(() => {
        if (mounted) setAuthState("guest");
      });

    return () => {
      mounted = false;
    };
  }, [activePanel]);

  const updateChatMessages = (
    panel: "radar" | "guided",
    updater: (messages: FloatingChatMessage[]) => FloatingChatMessage[],
  ) => {
    if (panel === "radar") {
      setRadarMessages(updater);
    } else {
      setGuidedMessages(updater);
    }
  };

  const sendFollowUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const panel = activePanel === "radar" ? "radar" : "guided";
    const question = chatInput.trim();
    if (!question || chatLoading || (panel === "radar" && authState !== "authenticated")) return;

    const userMessage: FloatingChatMessage = {
      id: `floating-user-${Date.now()}`,
      role: "user",
      content: question,
    };
    const assistantId = `floating-assistant-${Date.now()}`;
    const assistantMessage: FloatingChatMessage = {
      id: assistantId,
      role: "assistant",
      content: "",
    };
    const currentMessages = panel === "radar" ? radarMessages : guidedMessages;
    const contextualQuestion = panel === "radar" && radarContext
      ? [
          "Bantu pengguna mengelaborasi informasi Radar resmi berikut.",
          `Judul: ${radarContext.title}`,
          `Ringkasan: ${radarContext.summary}`,
          `Sumber: ${radarContext.sourceName}`,
          `URL sumber: ${radarContext.articleUrl}`,
          `Pertanyaan pengguna: ${question}`,
          "Jawab dengan membedakan fakta dari interpretasi dan sarankan langkah verifikasi bila relevan.",
        ].join("\n")
      : question;

    setChatInput("");
    setChatError(null);
    setChatLoading(true);
    updateChatMessages(panel, (messages) => [
      ...messages,
      userMessage,
      assistantMessage,
    ]);

    try {
      if (panel === "guided") {
        const localReply = getHelpDeskReply(question);
        updateChatMessages(panel, (messages) =>
          messages.map((message) =>
            message.id === assistantId ? { ...message, content: localReply } : message,
          ),
        );
      } else {
        await streamFloatingChatReply(
          [
            ...currentMessages.map(({ role, content }) => ({ role, content })),
            { role: "user", content: contextualQuestion },
          ],
          (content) => {
            updateChatMessages(panel, (messages) =>
              messages.map((message) =>
                message.id === assistantId
                  ? { ...message, content: message.content + content }
                  : message,
              ),
            );
          },
        );
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Chat AI gagal memproses pertanyaan.";
      setChatError(message);
      updateChatMessages(panel, (messages) =>
        messages.filter((item) => item.id !== assistantId || item.content),
      );
    } finally {
      setChatLoading(false);
    }
  };

  const loadArticles = async (filter: FilterOption, signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const query = filter.mappedCategory === "all"
        ? ""
        : `?category=${encodeURIComponent(filter.mappedCategory)}`;
      const response = await fetch(`/api/radar/articles${query}`, { signal });
      if (!response.ok) throw new Error("Gagal memuat pembaruan Radar.");
      const data = await response.json() as {
        articles?: RadarArticle[];
        sources?: Array<{ status: "pending" | "loading" | "success" | "error"; name: string }>;
      };
      setArticles(data.articles ?? []);
      setSources(data.sources ?? []);
    } catch (err: unknown) {
      if ((err as Error).name !== "AbortError") {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan jaringan.");
        setArticles([]);
        setSources([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activePanel === "radar") {
      const controller = new AbortController();
      const filter = RADAR_FILTERS.find(f => f.id === radarFilter);
      loadArticles(filter ?? RADAR_FILTERS[0]!, controller.signal);
      return () => controller.abort();
    }
    return undefined;
  }, [activePanel, radarFilter, retryToken]);

  const isGuidedOpen = activePanel === "guided";
  const isRadarOpen = activePanel === "radar";
  const activeFilter = RADAR_FILTERS.find((filter) => filter.id === radarFilter) ?? RADAR_FILTERS[0]!;
  const visibleArticles = activeFilter.keywords
    ? articles.filter((article) => {
      const searchableText = `${article.title} ${article.summary}`.toLowerCase();
      return activeFilter.keywords!.some((keyword) => searchableText.includes(keyword));
    })
    : articles;
  const hasSourceIssue = sources.some((source) => source.status === "error");

  const handleArticleElaboration = (article: RadarArticle) => {
    setRadarContext(article);
    setChatError(null);
  };

  // Hide the inactive launcher on mobile when a panel is open
  const leftLauncherClass = `pointer-events-auto flex h-12 items-center gap-2 rounded-full pl-3.5 pr-4 shadow-lg shadow-cyan-950/40 transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 transition-opacity duration-300 md:opacity-100 md:pointer-events-auto ${isRadarOpen ? "bg-slate-800 text-cyan-400 border border-cyan-400/30" : "bg-cyan-500 text-slate-950 hover:bg-cyan-400"} ${isGuidedOpen ? "opacity-0 pointer-events-none" : "opacity-100"}`;

  const rightLauncherClass = `pointer-events-auto flex h-12 items-center gap-2 rounded-full pl-3.5 pr-4 shadow-lg shadow-orange-950/40 transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 md:ml-auto transition-opacity duration-300 md:opacity-100 md:pointer-events-auto ${isGuidedOpen ? "bg-slate-800 text-orange-400 border border-orange-400/30" : "bg-orange-500 text-slate-950 hover:bg-orange-400"} ${isRadarOpen ? "opacity-0 pointer-events-none" : "opacity-100"}`;

  return (
    <>
      <div className="pointer-events-none fixed bottom-6 left-6 right-6 z-50 flex justify-between gap-4 md:w-auto">
        {/* Left Launcher (Radar Harian) */}
        <button
          type="button"
          onClick={(event) => isRadarOpen ? closePanel() : openPanel("radar", event.currentTarget)}
          aria-label={isRadarOpen ? "Tutup Radar Harian" : "Buka Radar Harian"}
          title="Radar Harian"
          aria-expanded={isRadarOpen}
          className={leftLauncherClass}
        >
          {isRadarOpen ? <X className="h-5 w-5 shrink-0" /> : <Radar className="h-5 w-5 shrink-0" />}
          <span className="text-sm font-semibold whitespace-nowrap">{isRadarOpen ? "Tutup" : "Radar"}</span>
        </button>

        {/* Right Launcher (Help Desk Aplikasi) */}
        <button
          type="button"
          onClick={(event) => isGuidedOpen ? closePanel() : openPanel("guided", event.currentTarget)}
           aria-label={isGuidedOpen ? "Tutup Help Desk Aplikasi" : "Buka Help Desk Aplikasi"}
           title="Help Desk Aplikasi"
          aria-expanded={isGuidedOpen}
          className={rightLauncherClass}
        >
          {isGuidedOpen ? <X className="h-5 w-5 shrink-0" /> : <MessageSquare className="h-5 w-5 shrink-0" />}
          <span className="text-sm font-semibold whitespace-nowrap">{isGuidedOpen ? "Tutup" : "Bantuan"}</span>
        </button>
      </div>

      {/* Backdrop for mobile */}
      {activePanel !== "none" && (
        <div 
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm md:hidden"
          onClick={closePanel}
          aria-hidden="true"
        />
      )}

      {/* Radar Panel */}
      {isRadarOpen && (
      <div 
        role="dialog"
        aria-label="Radar Harian"
        aria-modal="true"
        tabIndex={-1}
        ref={isRadarOpen ? panelRef : undefined}
        className={`fixed bottom-0 left-0 z-50 flex h-[85dvh] w-full flex-col rounded-t-2xl border-t border-slate-700 bg-slate-900 shadow-2xl shadow-black transition-transform duration-300 md:bottom-24 md:left-6 md:h-[600px] md:w-[400px] md:rounded-2xl md:border md:border-slate-700 ${isRadarOpen ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-8 opacity-0 md:translate-y-4"}`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-slate-800 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400">
              <Radar className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Radar Harian</h2>
              <p className="text-xs text-slate-400">Update industri terkini</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={closePanel}
            aria-label="Tutup panel"
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="shrink-0 border-b border-slate-800 p-3">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {RADAR_FILTERS.map(filter => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setRadarFilter(filter.id)}
                className={`shrink-0 whitespace-nowrap rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${radarFilter === filter.id ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-300" : "border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600 hover:bg-slate-800"}`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
          {hasSourceIssue && !error && (
            <div className="mb-4 flex items-start gap-2 rounded-xl border border-orange-500/20 bg-orange-500/5 p-3 text-xs leading-relaxed text-orange-200" role="status">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" />
              <span>Beberapa sumber resmi Radar belum berhasil dipantau. Item yang tampil tetap berasal dari sumber yang berhasil dibaca.</span>
            </div>
          )}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse space-y-3 rounded-xl border border-slate-800 bg-slate-800/30 p-4">
                  <div className="h-4 w-1/3 rounded bg-slate-700" />
                  <div className="h-4 w-full rounded bg-slate-700" />
                  <div className="h-4 w-2/3 rounded bg-slate-700" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center space-y-3 rounded-xl border border-orange-500/20 bg-orange-500/5 p-6 text-center">
              <AlertCircle className="h-8 w-8 text-orange-400" />
              <p className="text-sm font-medium text-orange-200">{error}</p>
              <button 
                type="button"
                onClick={() => setRetryToken((value) => value + 1)}
                className="mt-2 rounded-lg bg-orange-500/10 px-4 py-2 text-xs font-semibold text-orange-400 hover:bg-orange-500/20"
              >
                Coba lagi
              </button>
            </div>
          ) : visibleArticles.length === 0 ? (
            <div className="flex flex-col items-center justify-center space-y-4 py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-800/50">
                <Newspaper className="h-8 w-8 text-slate-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-300">Belum ada update</p>
                <p className="mt-1 text-xs text-slate-500">Belum ada update dari sumber Radar yang cocok dengan topik ini.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {visibleArticles.map(article => (
                <div key={article.id} className="group rounded-xl border border-slate-700/80 bg-slate-800/40 p-4 transition-colors hover:border-cyan-500/30 hover:bg-slate-800">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[10px] font-medium uppercase tracking-wider text-cyan-400">
                      {article.sourceName}
                    </span>
                    {article.importance === "penting" && (
                      <span className="rounded-full bg-orange-500/10 px-2 py-0.5 text-[10px] font-semibold text-orange-400">
                        Penting
                      </span>
                    )}
                  </div>
                  <h3 className="mb-2 text-sm font-semibold leading-tight text-white">{article.title}</h3>
                  <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-slate-400">{article.summary}</p>
                  
                  <div className="flex items-center justify-between border-t border-slate-700/50 pt-3">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {article.publishedAt
                        ? `Terbit ${formatDate(article.publishedAt)}`
                        : `Dipantau ${formatDate(article.fetchedAt)}`}
                    </div>
                    <a
                      href={article.articleUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-cyan-400 hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400"
                    >
                      Buka Sumber
                      <ExternalLink className="h-3 w-3" />
                    </a>
                     <button
                       type="button"
                       onClick={() => handleArticleElaboration(article)}
                       className="inline-flex items-center gap-1 text-[11px] font-medium text-orange-300 hover:text-orange-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-400"
                     >
                       Elaborasi
                       <MessageSquare className="h-3 w-3" />
                     </button>
                  </div>
                </div>
              ))}
            </div>
          )}
           <ChatThread messages={radarMessages} />
        </div>
         <ChatComposer
           authState={authState}
           chatEnabled={false}
           input={chatInput}
           loading={chatLoading}
           error={chatError}
           context={radarContext}
           onInputChange={setChatInput}
           onSubmit={sendFollowUp}
           onClearContext={() => setRadarContext(null)}
           onClose={closePanel}
         />
      </div>
      )}

      {/* Guided Panel */}
      {isGuidedOpen && (
      <div 
        role="dialog"
         aria-label="Help Desk Aplikasi"
        aria-modal="true"
        tabIndex={-1}
        ref={isGuidedOpen ? panelRef : undefined}
        className={`fixed bottom-0 right-0 z-50 flex h-[85dvh] w-full flex-col rounded-t-2xl border-t border-slate-700 bg-slate-900 shadow-2xl shadow-black transition-transform duration-300 md:bottom-24 md:right-6 md:h-[600px] md:w-[400px] md:rounded-2xl md:border md:border-slate-700 ${isGuidedOpen ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-8 opacity-0 md:translate-y-4"}`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-slate-800 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500/10 text-orange-400">
              <Bot className="h-5 w-5" />
            </div>
            <div>
               <h2 className="text-sm font-semibold text-white">Help Desk Aplikasi</h2>
               <p className="text-xs text-slate-400">Tanya cara menggunakan platform</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={closePanel}
            aria-label="Tutup panel"
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 scrollbar-thin">
          <div className="mb-6 flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-800">
              <Bot className="h-4 w-4 text-orange-400" />
            </div>
            <div className="rounded-2xl rounded-tl-none bg-slate-800/80 p-4 text-sm text-slate-200">
               Halo! Saya Help Desk Aplikasi. Anda bisa memilih topik atau langsung mengetik pertanyaan tentang cara menggunakan KonstruksiAI.
            </div>
          </div>

          <div className="space-y-3">
            {GUIDED_QUESTIONS.map(q => {
              const isSelected = selectedQuestionId === q.id;
              return (
                <div key={q.id} className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedQuestionId(isSelected ? null : q.id)}
                    aria-expanded={isSelected}
                    className={`flex w-full items-center justify-between rounded-xl border p-3 text-left text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 ${isSelected ? "border-orange-500/30 bg-orange-500/10 text-orange-300" : "border-slate-700 bg-slate-800/40 text-slate-300 hover:border-slate-600 hover:bg-slate-800"}`}
                  >
                    <span>{q.q}</span>
                    <ChevronRight className={`h-4 w-4 shrink-0 transition-transform ${isSelected ? "rotate-90 text-orange-400" : "text-slate-500"}`} />
                  </button>
                  
                  {isSelected && (
                    <div className="ml-4 flex gap-3 animate-in slide-in-from-top-2">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-800">
                        <Bot className="h-4 w-4 text-orange-400" />
                      </div>
                      <div className="rounded-2xl rounded-tl-none bg-slate-800/80 p-4">
                        <p className="mb-4 text-sm leading-relaxed text-slate-200">{q.a}</p>
                        <div className="flex flex-wrap gap-2">
                          {q.links.map((link, idx) => (
                            <Link 
                              key={idx} 
                              href={link.url}
                              onClick={closePanel}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-orange-500/10 px-3 py-2 text-xs font-semibold text-orange-400 transition-colors hover:bg-orange-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                            >
                              {link.label}
                              <ChevronRight className="h-3 w-3" />
                            </Link>
                          ))}
                        </div>
           <ChatThread messages={guidedMessages} />
                      </div>
         <ChatComposer
           authState={authState}
             requiresAuth={false}
           input={chatInput}
           loading={chatLoading}
           error={chatError}
           onInputChange={setChatInput}
           onSubmit={sendFollowUp}
           onClose={closePanel}
         />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      )}
    </>
  );
}
