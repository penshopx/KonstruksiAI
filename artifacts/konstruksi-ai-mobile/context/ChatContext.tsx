import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from 'react-native';
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
  pendingSyncCount: number;
  conversations: ConversationSummary[];
  activeConversationId: string | null;
  selectConversation: (conversationId: string) => Promise<void>;
  deleteConversation: (conversationId: string) => Promise<void>;
}

const PENDING_SYNC_STORAGE_KEY = 'konstruksi_pending_chat_sync_v1';

interface PendingSyncMessage {
  id: string;
  ownerId: number;
  localConversationId: string;
  serverConversationId?: string;
  title: string;
  agentId: string;
  role: 'user' | 'assistant';
  content: string;
  attachmentName?: string;
  createdAt: number;
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
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [selectedAgent, setSelectedAgentState] = useState<Agent>(AGENTS[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  // Tracks the current server-side conversation ID (null = no conversation yet)
  const conversationIdRef = useRef<string | null>(null);
  // Prevents an older conversation request from replacing a newer selection.
  const conversationRequestRef = useRef(0);
  // Tracks the in-flight conversation-creation promise so addAssistantMessage
  // can wait for it before persisting the AI reply.
  const pendingConvRef = useRef<Promise<string | null>>(Promise.resolve(null));
  const pendingQueueRef = useRef<PendingSyncMessage[]>([]);
  const pendingQueueReadyRef = useRef<Promise<void>>(Promise.resolve());
  const pendingQueueWriteRef = useRef<Promise<void>>(Promise.resolve());
  const pendingFlushRef = useRef<Promise<void> | null>(null);
  const activeLocalConversationIdRef = useRef<string | null>(null);
  const serverConversationIdsRef = useRef(new Map<string, string>());
  // Keep a ref to selectedAgent so callbacks can read its current value.
  const selectedAgentRef = useRef<Agent>(AGENTS[0]);

  useEffect(() => {
    selectedAgentRef.current = selectedAgent;
  }, [selectedAgent]);

  // Load the durable outbox before any message can be enqueued. The queue is
  // intentionally kept separate from the displayed conversation state so a
  // failed request can never remove the user's message from local storage.
  useEffect(() => {
    pendingQueueReadyRef.current = AsyncStorage.getItem(PENDING_SYNC_STORAGE_KEY)
      .then(raw => {
        if (!raw) return;
        const parsed = JSON.parse(raw) as PendingSyncMessage[];
        if (!Array.isArray(parsed)) return;
        pendingQueueRef.current = parsed.filter(
          item =>
            item &&
            typeof item.id === 'string' &&
            typeof item.ownerId === 'number' &&
            typeof item.localConversationId === 'string' &&
            typeof item.title === 'string' &&
            typeof item.agentId === 'string' &&
            (item.role === 'user' || item.role === 'assistant') &&
            typeof item.content === 'string',
        );
        setPendingSyncCount(pendingQueueRef.current.length);
        // Recreate pending conversations in history after an app restart.
        setConversations(prev => {
          const next = [...prev];
          for (const item of pendingQueueRef.current) {
            const conversationId = item.serverConversationId ?? item.localConversationId;
            if (!next.some(conversation => conversation.id === conversationId)) {
              const now = Math.floor(item.createdAt / 1000);
              next.push({
                id: conversationId,
                title: item.title,
                agentId: item.agentId,
                createdAt: now,
                updatedAt: now,
              });
            }
          }
          return sortConversations(next);
        });
      })
      .catch(() => {
        setSyncError('Pesan tertunda belum dapat dibaca dari penyimpanan perangkat.');
      });
  }, []);

  const persistPendingQueue = useCallback((next: PendingSyncMessage[]) => {
    pendingQueueRef.current = next;
    setPendingSyncCount(next.length);
    pendingQueueWriteRef.current = pendingQueueWriteRef.current
      .catch(() => undefined)
      .then(() => AsyncStorage.setItem(PENDING_SYNC_STORAGE_KEY, JSON.stringify(next)))
      .catch(() => {
        setSyncError('Pesan tertunda belum tersimpan di perangkat.');
      });
    return pendingQueueWriteRef.current;
  }, []);

  const flushPendingSync = useCallback((): Promise<void> => {
    if (pendingFlushRef.current) return pendingFlushRef.current;

    const run = (async () => {
      await pendingQueueReadyRef.current;
      await pendingQueueWriteRef.current;
      if (!isAuthenticated || !user) return;

      try {
        while (pendingQueueRef.current.length > 0) {
          const item = pendingQueueRef.current.find(queued => queued.ownerId === user.id);
          if (!item) {
            setSyncError('Ada pesan tertunda dari akun lain.');
            return;
          }
          // A queued message belongs to the account that created it. Keep it
          // durable rather than sending it to a different account after logout.
          let serverConversationId = item.serverConversationId;
          if (!serverConversationId) {
            const created = await apiCreateConversation(
              item.title,
              item.agentId,
              item.localConversationId,
            );
            serverConversationId = created.id;
            serverConversationIdsRef.current.set(item.localConversationId, serverConversationId);
            serverConversationIdsRef.current.set(serverConversationId, serverConversationId);
            const updatedQueue = pendingQueueRef.current.map(queued =>
              queued.ownerId === user.id && queued.localConversationId === item.localConversationId
                ? { ...queued, serverConversationId }
                : queued,
            );
            await persistPendingQueue(updatedQueue);

            if (conversationIdRef.current === item.localConversationId) {
              conversationIdRef.current = serverConversationId;
              activeLocalConversationIdRef.current = serverConversationId;
              setActiveConversationId(serverConversationId);
            }
            setConversations(prev =>
              sortConversations(
                prev.map(conversation =>
                  conversation.id === item.localConversationId
                    ? { ...conversation, id: serverConversationId! }
                    : conversation,
                ),
              ),
            );
          }

          await apiAddMessage(
            serverConversationId,
            item.role,
            item.content,
            item.attachmentName,
            item.id,
          );
          await persistPendingQueue(
            pendingQueueRef.current.filter(queued => queued.id !== item.id),
          );
          setSyncError(null);
          setConversations(prev =>
            sortConversations(
              prev.map(conversation =>
                conversation.id === serverConversationId
                  ? { ...conversation, updatedAt: Math.floor(Date.now() / 1000) }
                  : conversation,
              ),
            ),
          );
        }
      } catch (error) {
        setSyncError(error instanceof Error ? error.message : 'Sinkronisasi pesan tertunda gagal.');
        // Keep the current item at the head of the outbox for the next retry.
      }
    })().finally(() => {
      pendingFlushRef.current = null;
    });

    pendingFlushRef.current = run;
    return run;
  }, [isAuthenticated, persistPendingQueue, user]);

  const enqueuePendingMessage = useCallback(
    async (item: PendingSyncMessage) => {
      await pendingQueueReadyRef.current;
      await persistPendingQueue([...pendingQueueRef.current, item]);
      void flushPendingSync();
    },
    [flushPendingSync, persistPendingQueue],
  );

  // Retry on app foreground and periodically while the app is open. The
  // foreground event covers the common "airplane mode → reconnect → return"
  // path without adding a native networking dependency.
  useEffect(() => {
    if (!isAuthenticated) return;
    void flushPendingSync();
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') void flushPendingSync();
    });
    const interval = setInterval(() => {
      if (pendingQueueRef.current.length > 0) void flushPendingSync();
    }, 15000);
    return () => {
      subscription.remove();
      clearInterval(interval);
    };
  }, [flushPendingSync, isAuthenticated]);

  // ── Clear all state on logout ───────────────────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      setMessages([]);
      setSelectedAgentState(AGENTS[0]);
      selectedAgentRef.current = AGENTS[0];
      conversationIdRef.current = null;
      activeLocalConversationIdRef.current = null;
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
        await flushPendingSync();
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
        activeLocalConversationIdRef.current = latest.id;
        serverConversationIdsRef.current.set(latest.id, latest.id);
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
    activeLocalConversationIdRef.current = null;
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

      if (isAuthenticated && user) {
        const localConversationId =
          conversationIdRef.current ??
          activeLocalConversationIdRef.current ??
          `local_${msg.id}`;
        activeLocalConversationIdRef.current = localConversationId;
        if (!conversationIdRef.current) {
          conversationIdRef.current = localConversationId;
        }
        const title = content.trim().split(' ').slice(0, 6).join(' ') || 'Percakapan Baru';
        if (!serverConversationIdsRef.current.has(localConversationId)) {
          setActiveConversationId(localConversationId);
          setConversations(prev =>
            sortConversations([
              ...prev.filter(conversation => conversation.id !== localConversationId),
              {
                id: localConversationId,
                title,
                agentId: selectedAgentRef.current.id,
                createdAt: Math.floor(msg.timestamp.getTime() / 1000),
                updatedAt: Math.floor(msg.timestamp.getTime() / 1000),
              },
            ]),
          );
        }
        void enqueuePendingMessage({
          id: `${msg.id}:user`,
          ownerId: user.id,
          localConversationId,
          serverConversationId: serverConversationIdsRef.current.get(localConversationId),
          title,
          agentId: selectedAgentRef.current.id,
          role: 'user',
          content,
          attachmentName,
          createdAt: msg.timestamp.getTime(),
        });
      }

      return msg;
    },
    [enqueuePendingMessage, isAuthenticated, user],
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

      if (isAuthenticated && user) {
        const localConversationId =
          conversationIdRef.current ?? activeLocalConversationIdRef.current;
        if (localConversationId) {
          const conversation = conversations.find(item => item.id === localConversationId);
          void enqueuePendingMessage({
            id: `${msg.id}:assistant`,
            ownerId: user.id,
            localConversationId,
            serverConversationId: serverConversationIdsRef.current.get(localConversationId),
            title: conversation?.title ?? 'Percakapan Baru',
            agentId: selectedAgentRef.current.id,
            role: 'assistant',
            content,
            createdAt: msg.timestamp.getTime(),
          });
        }
      }
    },
    [conversations, enqueuePendingMessage, isAuthenticated, user],
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    conversationIdRef.current = null;
    activeLocalConversationIdRef.current = null;
    setActiveConversationId(null);
    pendingConvRef.current = Promise.resolve(null);
  }, []);

  const selectConversation = useCallback(async (conversationId: string) => {
    const requestId = conversationRequestRef.current + 1;
    conversationRequestRef.current = requestId;
    setIsSyncing(true);

    const pendingMessages = pendingQueueRef.current.filter(
      item =>
        item.localConversationId === conversationId ||
        item.serverConversationId === conversationId,
    );
    if (pendingMessages.length > 0 && !serverConversationIdsRef.current.has(conversationId)) {
      const summary = conversations.find(conversation => conversation.id === conversationId);
      const agent = AGENTS.find(a => a.id === summary?.agentId) ?? AGENTS[0];
      setSelectedAgentState(agent);
      selectedAgentRef.current = agent;
      conversationIdRef.current = conversationId;
      activeLocalConversationIdRef.current = conversationId;
      setActiveConversationId(conversationId);
      setMessages(
        pendingMessages.map(item => ({
          id: item.id,
          role: item.role,
          content: item.content,
          timestamp: new Date(item.createdAt),
          attachmentName: item.attachmentName,
        })),
      );
      setIsSyncing(false);
      void flushPendingSync();
      return;
    }

    try {
      const { messages: serverMsgs } = await apiGetConversationMessages(conversationId);
      if (conversationRequestRef.current !== requestId) return;

      const summary = conversations.find(conversation => conversation.id === conversationId);
      const agent = AGENTS.find(a => a.id === summary?.agentId) ?? AGENTS[0];
      setSelectedAgentState(agent);
      selectedAgentRef.current = agent;
      conversationIdRef.current = conversationId;
      activeLocalConversationIdRef.current = conversationId;
      serverConversationIdsRef.current.set(conversationId, conversationId);
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
  }, [conversations, flushPendingSync]);

  const deleteConversation = useCallback(async (conversationId: string) => {
    await apiDeleteConversation(conversationId);
    setConversations(prev => prev.filter(conversation => conversation.id !== conversationId));

    if (conversationIdRef.current === conversationId) {
      conversationRequestRef.current += 1;
      conversationIdRef.current = null;
      activeLocalConversationIdRef.current = null;
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
        pendingSyncCount,
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
