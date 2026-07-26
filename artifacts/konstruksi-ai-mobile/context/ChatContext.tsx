import React, { createContext, useContext, useState, useCallback } from 'react';

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
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [selectedAgent, setSelectedAgentState] = useState<Agent>(AGENTS[0]);
  const [messages, setMessages] = useState<Message[]>([]);

  const setSelectedAgent = useCallback((agent: Agent) => {
    setSelectedAgentState(agent);
    setMessages([]);
  }, []);

  const addUserMessage = useCallback((content: string): Message => {
    const msg: Message = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, msg]);
    return msg;
  }, []);

  const addLoadingMessage = useCallback((): string => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
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

  const addAssistantMessage = useCallback((content: string, replaceLoadingId?: string) => {
    const msg: Message = {
      id: replaceLoadingId ?? (Date.now().toString() + Math.random().toString(36).substr(2, 9)),
      role: 'assistant',
      content,
      timestamp: new Date(),
      isLoading: false,
    };
    if (replaceLoadingId) {
      setMessages(prev => prev.map(m => m.id === replaceLoadingId ? msg : m));
    } else {
      setMessages(prev => [...prev, msg]);
    }
  }, []);

  const clearMessages = useCallback(() => setMessages([]), []);

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
