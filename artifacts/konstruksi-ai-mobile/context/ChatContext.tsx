import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  apiGetConversations,
  apiCreateConversation,
  apiGetConversationMessages,
  apiAddMessage,
} from '@/lib/api';

export interface Agent {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

export const AGENTS: Agent[] = [
  { id: 'general', name: 'KonstruksiAI', icon: 'construct', description: 'Asisten umum konstruksi & engineering', color: '#f97316' },
  { id: 'estimator', name: 'Estimator RAB', icon: 'calculator', description: 'Spesialis estimasi biaya & RAB', color: '#22c55e' },
  { id: 'tender', name: 'Tender Expert', icon: 'document-text', description: 'Ahli tender & pengadaan LPSE', color: '#3b82f6' },
  { id: 'k3', name: 'Ahli K3', icon: 'shield-checkmark', description: 'Keselamatan & kesehatan kerja', color: '#ef4444' },
  { id: 'perijinan', name: 'Konsultan Perijinan', icon: 'ribbon', description: 'SBU, SKK, PBG, AMDAL', color: '#a855f7' },
  { id: 'energi', name: 'EBT Specialist', icon: 'flash', description: 'Energi terbarukan & kelistrikan', color: '#eab308' },
  { id: 'migas', name: 'Migas Expert', icon: 'water', description: 'Minyak, gas, pertambangan', color: '#64748b' },
  { id: 'kontrak', name: 'Legal Konstruksi', icon: 'scale', description: 'Kontrak, klaim, sengketa', color: '#6366f1' },
  { id: 'electrical', name: 'Electrical Engineer', icon: 'power', description: 'Dokumen teknis & desain elektrikal', color: '#f59e0b' },
];

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}

interface ChatContextValue {
  selectedAgent: Agent;
  setSelectedAgent: (agent: Agent) => void;
  messages: Message[];
  addUserMessage: (content: string) => Message;
  addAssistantMessage: (content: string, replaceLoadingId?: string) => void;
  addLoadingMessage: () => string;
  clearMessages: () => void;
  isSyncing: boolean;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [selectedAgent, setSelectedAgentState] = useState<Agent>(AGENTS[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  // Tracks the current server-side conversation ID (null = no conversation yet)
  const conversationIdRef = useRef<string | null>(null);
  // Tracks the in-flight conversation-creation promise so addAssistantMessage
  // can wait for it before persisting the AI reply.
  const pendingConvRef = useRef<Promise<string | null>>(Promise.resolve(null));
  // Keep a ref to selectedAgent so callbacks can read its current value.
  const selectedAgentRef = useRef<Agent>(AGENTS[0]);

  useEffect(() => {
    selectedAgentRef.current = selectedAgent;
  }, [selectedAgent]);

  /** Parse a server timestamp that may be epoch seconds (number) or ISO string */
  function parseServerDate(val: number | string): Date {
    if (typeof val === 'number') return new Date(val * 1000);
    return new Date(val); // ISO-8601 string from JSON serialization of Date
  }

  // ── Clear all state on logout ───────────────────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      setMessages([]);
      setSelectedAgentState(AGENTS[0]);
      selectedAgentRef.current = AGENTS[0];
      conversationIdRef.current = null;
      pendingConvRef.current = Promise.resolve(null);
    }
  }, [isAuthenticated, authLoading]);

  // ── Restore most-recent conversation from server on login ───────────────────
  useEffect(() => {
    if (authLoading || !isAuthenticated) return;

    let cancelled = false;
    setIsSyncing(true);

    (async () => {
      try {
        const { conversations } = await apiGetConversations();
        if (cancelled || conversations.length === 0) return;

        const latest = conversations[0];
        const { messages: serverMsgs } = await apiGetConversationMessages(latest.id);
        if (cancelled) return;

        // Restore agent
        const agent = AGENTS.find(a => a.id === latest.agentId) ?? AGENTS[0];
        setSelectedAgentState(agent);
        selectedAgentRef.current = agent;
        conversationIdRef.current = latest.id;
        pendingConvRef.current = Promise.resolve(latest.id);

        const clientMsgs: Message[] = serverMsgs.map(m => ({
          id: m.id,
          role: m.role as 'user' | 'assistant',
          content: m.content,
          timestamp: parseServerDate(m.createdAt),
        }));
        setMessages(clientMsgs);
      } catch {
        // Ignore — start fresh if server unreachable
      } finally {
        if (!cancelled) setIsSyncing(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, authLoading]);

  // ── Ensure a server conversation exists, creating one if needed ─────────────
  const ensureConversation = useCallback(
    (firstMessage: string): Promise<string | null> => {
      if (conversationIdRef.current) {
        return Promise.resolve(conversationIdRef.current);
      }
      if (!isAuthenticated) {
        return Promise.resolve(null);
      }
      const title = firstMessage.trim().split(' ').slice(0, 6).join(' ') || 'Percakapan Baru';
      const promise = apiCreateConversation(title, selectedAgentRef.current.id)
        .then(({ id }) => {
          conversationIdRef.current = id;
          return id as string | null;
        })
        .catch(() => null as string | null);
      return promise;
    },
    [isAuthenticated],
  );

  // ── Agent selector ──────────────────────────────────────────────────────────
  const setSelectedAgent = useCallback((agent: Agent) => {
    setSelectedAgentState(agent);
    selectedAgentRef.current = agent;
    setMessages([]);
    conversationIdRef.current = null;
    pendingConvRef.current = Promise.resolve(null);
  }, []);

  // ── Message helpers ─────────────────────────────────────────────────────────

  const addUserMessage = useCallback(
    (content: string): Message => {
      const msg: Message = {
        id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
        role: 'user',
        content,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, msg]);

      // Create conversation (if needed) then persist the user message
      pendingConvRef.current = (async () => {
        const convId = await ensureConversation(content);
        if (convId) {
          await apiAddMessage(convId, 'user', content).catch(() => {});
        }
        return convId;
      })();

      return msg;
    },
    [ensureConversation],
  );

  const addLoadingMessage = useCallback((): string => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 9);
    const msg: Message = {
      id,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isLoading: true,
    };
    setMessages(prev => [...prev, msg]);
    return id;
  }, []);

  const addAssistantMessage = useCallback(
    (content: string, replaceLoadingId?: string) => {
      const msg: Message = {
        id: replaceLoadingId ?? (Date.now().toString() + Math.random().toString(36).substring(2, 9)),
        role: 'assistant',
        content,
        timestamp: new Date(),
        isLoading: false,
      };
      if (replaceLoadingId) {
        setMessages(prev => prev.map(m => (m.id === replaceLoadingId ? msg : m)));
      } else {
        setMessages(prev => [...prev, msg]);
      }

      // Persist after the conversation (and user message) are saved
      (async () => {
        const convId = await pendingConvRef.current;
        if (convId) {
          await apiAddMessage(convId, 'assistant', content).catch(() => {});
        }
      })();
    },
    [],
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    conversationIdRef.current = null;
    pendingConvRef.current = Promise.resolve(null);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        selectedAgent,
        setSelectedAgent,
        messages,
        addUserMessage,
        addAssistantMessage,
        addLoadingMessage,
        clearMessages,
        isSyncing,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat(): ChatContextValue {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within ChatProvider');
  return ctx;
}
