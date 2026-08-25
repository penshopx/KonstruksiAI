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
  apiDeleteConversation,
  type ConversationSummary,
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
  attachmentName?: string;
}

interface ChatContextValue {
  selectedAgent: Agent;
  setSelectedAgent: (agent: Agent) => void;
  messages: Message[];
  addUserMessage: (content: string, attachmentName?: string) => Message;
  addAssistantMessage: (content: string, replaceLoadingId?: string) => void;
  addLoadingMessage: () => string;
  clearMessages: () => void;
  isSyncing: boolean;
  conversations: ConversationSummary[];
  activeConversationId: string | null;
  selectConversation: (conversationId: string) => Promise<void>;
  deleteConversation: (conversationId: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextValue | null>(null);

/** Parse a server timestamp that may be epoch seconds, epoch milliseconds, or ISO. */
function parseServerDate(val: number | string): Date {
  if (typeof val === 'number') {
    return new Date(val < 1_000_000_000_000 ? val * 1000 : val);
  }
  return new Date(val);
}

function getServerTimestamp(val: number | string): number {
  const timestamp = parseServerDate(val).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function sortConversations(items: ConversationSummary[]): ConversationSummary[] {
  return [...items].sort(
    (a, b) => getServerTimestamp(b.updatedAt) - getServerTimestamp(a.updatedAt),
  );
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [selectedAgent, setSelectedAgentState] = useState<Agent>(AGENTS[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  // Tracks the current server-side conversation ID (null = no conversation yet)
  const conversationIdRef = useRef<string | null>(null);
  // Prevents an older conversation request from replacing a newer selection.
  const conversationRequestRef = useRef(0);
  // Tracks the in-flight conversation-creation promise so addAssistantMessage
  // can wait for it before persisting the AI reply.
  const pendingConvRef = useRef<Promise<string | null>>(Promise.resolve(null));
  // Keep a ref to selectedAgent so callbacks can read its current value.
  const selectedAgentRef = useRef<Agent>(AGENTS[0]);

  useEffect(() => {
    selectedAgentRef.current = selectedAgent;
  }, [selectedAgent]);

  // ── Clear all state on logout ───────────────────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      setMessages([]);
      setSelectedAgentState(AGENTS[0]);
      selectedAgentRef.current = AGENTS[0];
      conversationIdRef.current = null;
      conversationRequestRef.current += 1;
      setActiveConversationId(null);
      setConversations([]);
      pendingConvRef.current = Promise.resolve(null);
    }
  }, [isAuthenticated, authLoading]);

  // ── Restore most-recent conversation from server on login ───────────────────
  useEffect(() => {
    if (authLoading || !isAuthenticated) return;

    let cancelled = false;
    const requestId = conversationRequestRef.current + 1;
    conversationRequestRef.current = requestId;
    setIsSyncing(true);

    (async () => {
      try {
        const { conversations: serverConversations } = await apiGetConversations();
        const sortedConversations = sortConversations(serverConversations);
        if (cancelled || conversationRequestRef.current !== requestId) return;
        setConversations(sortedConversations);
        if (sortedConversations.length === 0) return;

        const latest = sortedConversations[0];
        const { messages: serverMsgs } = await apiGetConversationMessages(latest.id);
        if (cancelled || conversationRequestRef.current !== requestId) return;

        // Restore agent
        const agent = AGENTS.find(a => a.id === latest.agentId) ?? AGENTS[0];
        setSelectedAgentState(agent);
        selectedAgentRef.current = agent;
        conversationIdRef.current = latest.id;
        setActiveConversationId(latest.id);
        pendingConvRef.current = Promise.resolve(latest.id);

        const clientMsgs: Message[] = serverMsgs.map(m => ({
          id: m.id,
          role: m.role as 'user' | 'assistant',
          content: m.content,
          timestamp: parseServerDate(m.createdAt),
          attachmentName: m.attachmentName,
        }));
        setMessages(clientMsgs);
      } catch {
        // Ignore — start fresh if server unreachable
      } finally {
        if (!cancelled && conversationRequestRef.current === requestId) setIsSyncing(false);
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
          setActiveConversationId(id);
          const now = Math.floor(Date.now() / 1000);
          setConversations(prev =>
            sortConversations([
              ...prev.filter(conversation => conversation.id !== id),
              {
                id,
                title,
                agentId: selectedAgentRef.current.id,
                createdAt: now,
                updatedAt: now,
              },
            ]),
          );
          return id as string | null;
        })
        .catch(() => null as string | null);
      return promise;
    },
    [isAuthenticated],
  );

  const touchConversation = useCallback((conversationId: string) => {
    setConversations(prev =>
      sortConversations(
        prev.map(conversation =>
          conversation.id === conversationId
            ? { ...conversation, updatedAt: Math.floor(Date.now() / 1000) }
            : conversation,
        ),
      ),
    );
  }, []);

  // ── Agent selector ──────────────────────────────────────────────────────────
  const setSelectedAgent = useCallback((agent: Agent) => {
    setSelectedAgentState(agent);
    selectedAgentRef.current = agent;
    setMessages([]);
    conversationIdRef.current = null;
    setActiveConversationId(null);
    pendingConvRef.current = Promise.resolve(null);
  }, []);

  // ── Message helpers ─────────────────────────────────────────────────────────

  const addUserMessage = useCallback(
    (content: string, attachmentName?: string): Message => {
      const msg: Message = {
        id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
        role: 'user',
        content,
        timestamp: new Date(),
        attachmentName,
      };
      setMessages(prev => [...prev, msg]);

      // Create conversation (if needed) then persist the user message
      pendingConvRef.current = (async () => {
        const convId = await ensureConversation(content);
        if (convId) {
          await apiAddMessage(convId, 'user', content).catch(() => {});
          touchConversation(convId);
        }
        return convId;
      })();

      return msg;
    },
    [ensureConversation, touchConversation],
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
          touchConversation(convId);
        }
      })();
    },
    [touchConversation],
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    conversationIdRef.current = null;
    setActiveConversationId(null);
    pendingConvRef.current = Promise.resolve(null);
  }, []);

  const selectConversation = useCallback(async (conversationId: string) => {
    const requestId = conversationRequestRef.current + 1;
    conversationRequestRef.current = requestId;
    setIsSyncing(true);

    try {
      const { messages: serverMsgs } = await apiGetConversationMessages(conversationId);
      if (conversationRequestRef.current !== requestId) return;

      const summary = conversations.find(conversation => conversation.id === conversationId);
      const agent = AGENTS.find(a => a.id === summary?.agentId) ?? AGENTS[0];
      setSelectedAgentState(agent);
      selectedAgentRef.current = agent;
      conversationIdRef.current = conversationId;
      setActiveConversationId(conversationId);
      pendingConvRef.current = Promise.resolve(conversationId);
      setMessages(
        serverMsgs.map(m => ({
          id: m.id,
          role: m.role as 'user' | 'assistant',
          content: m.content,
          timestamp: parseServerDate(m.createdAt),
          attachmentName: m.attachmentName,
        })),
      );
    } finally {
      if (conversationRequestRef.current === requestId) {
        setIsSyncing(false);
      }
    }
  }, [conversations]);

  const deleteConversation = useCallback(async (conversationId: string) => {
    await apiDeleteConversation(conversationId);
    setConversations(prev => prev.filter(conversation => conversation.id !== conversationId));

    if (conversationIdRef.current === conversationId) {
      conversationRequestRef.current += 1;
      conversationIdRef.current = null;
      setActiveConversationId(null);
      setMessages([]);
      setSelectedAgentState(AGENTS[0]);
      selectedAgentRef.current = AGENTS[0];
      pendingConvRef.current = Promise.resolve(null);
    }
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
        conversations,
        activeConversationId,
        selectConversation,
        deleteConversation,
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
