import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = `https://${process.env.EXPO_PUBLIC_DOMAIN}/api`;

export async function getAuthToken(): Promise<string | null> {
  return AsyncStorage.getItem('auth_token');
}

export async function setAuthToken(token: string): Promise<void> {
  await AsyncStorage.setItem('auth_token', token);
}

export async function clearAuthToken(): Promise<void> {
  await AsyncStorage.removeItem('auth_token');
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  skipAuth = false,
): Promise<T> {
  const token = skipAuth ? null : await getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `Request failed: ${res.status}`);
  }
  return data as T;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  success: boolean;
  user: User;
  token: string;
}

export async function apiLogin(email: string, password: string): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }, true);
}

export async function apiRegister(name: string, email: string, password: string): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  }, true);
}

export async function apiGetMe(): Promise<{ user: User | null }> {
  return request<{ user: User | null }>('/auth/me');
}

export async function apiLogout(): Promise<void> {
  try {
    await request('/auth/logout', { method: 'POST' });
  } catch {}
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  message: string;
  agentName: string;
}

export interface ChatAttachment {
  name: string;
  type: string;
  base64: string;
}

export async function apiChat(
  messages: ChatMessage[],
  agentId: string,
  attachment?: ChatAttachment,
): Promise<ChatResponse> {
  return request<ChatResponse>('/chat', {
    method: 'POST',
    // stream: false → server returns JSON (SSE streaming not supported in React Native fetch)
    body: JSON.stringify({ messages, agentId, stream: false, attachment }),
  });
}

// ─── Conversation API ─────────────────────────────────────────────────────────

export interface ConversationSummary {
  id: string;
  title: string;
  agentId: string;
  label?: string;
  /** Epoch seconds/milliseconds or ISO-8601 strings from server JSON */
  createdAt: number | string;
  updatedAt: number | string;
}

export interface ServerMessage {
  id: string;
  conversationId: string;
  role: string;
  content: string;
  attachmentName?: string;
  attachmentType?: string;
  /** Epoch seconds (number) or ISO-8601 string — handle both */
  createdAt: number | string;
}

export async function apiGetConversations(): Promise<{ conversations: ConversationSummary[] }> {
  return request<{ conversations: ConversationSummary[] }>('/conversations');
}

export async function apiCreateConversation(
  title: string,
  agentId: string,
  clientConversationId?: string,
): Promise<{ id: string; title: string; agentId: string }> {
  return request<{ id: string; title: string; agentId: string }>('/conversations', {
    method: 'POST',
    body: JSON.stringify({ title, agentId, clientConversationId }),
  });
}

export async function apiGetConversationMessages(
  conversationId: string,
): Promise<{ messages: ServerMessage[] }> {
  return request<{ messages: ServerMessage[] }>(`/conversations/${conversationId}/messages`);
}

export async function apiAddMessage(
  conversationId: string,
  role: string,
  content: string,
  attachmentName?: string,
  clientMessageId?: string,
): Promise<{ id: string }> {
  return request<{ id: string }>(`/conversations/${conversationId}/messages`, {
    method: 'POST',
    body: JSON.stringify({
      role,
      content,
      attachmentName: attachmentName ?? null,
      clientMessageId,
    }),
  });
}

export async function apiDeleteConversation(conversationId: string): Promise<void> {
  await request(`/conversations/${conversationId}`, { method: 'DELETE' });
}
