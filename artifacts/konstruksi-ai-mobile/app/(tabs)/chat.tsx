import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
  Alert,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { useColors } from '@/hooks/useColors';
import { useChat, AGENTS, type Message } from '@/context/ChatContext';
import { apiChat, type ChatAttachment } from '@/lib/api';

// ─── Agent selector chip ─────────────────────────────────────────────────────

function AgentChip({
  agent,
  selected,
  onPress,
}: {
  agent: (typeof AGENTS)[0];
  selected: boolean;
  onPress: () => void;
}) {
  const colors = useColors();
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[
        chipStyles.chip,
        {
          backgroundColor: selected ? agent.color : colors.card,
          borderColor: selected ? agent.color : colors.border,
        },
      ]}
    >
      <Ionicons
        name={agent.icon as keyof typeof Ionicons.glyphMap}
        size={14}
        color={selected ? '#fff' : colors.mutedForeground}
      />
      <Text
        style={[
          chipStyles.label,
          { color: selected ? '#fff' : colors.mutedForeground },
        ]}
      >
        {agent.name}
      </Text>
    </TouchableOpacity>
  );
}

const chipStyles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  label: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    fontWeight: '500',
  },
});

// ─── Message bubble ───────────────────────────────────────────────────────────

function MessageBubble({ msg }: { msg: Message }) {
  const colors = useColors();
  const isUser = msg.role === 'user';
  return (
    <View
      style={[
        bubbleStyles.row,
        isUser ? bubbleStyles.rowUser : bubbleStyles.rowAI,
      ]}
    >
      {!isUser && (
        <View style={[bubbleStyles.avatar, { backgroundColor: '#f97316' }]}>
          <Ionicons name="construct" size={14} color="#fff" />
        </View>
      )}
      <View style={{ maxWidth: '82%' }}>
        {/* Attachment indicator */}
        {msg.attachmentName && (
          <View
            style={[
              bubbleStyles.attachmentChip,
              {
                backgroundColor: isUser ? 'rgba(255,255,255,0.2)' : colors.card,
                borderColor: isUser ? 'rgba(255,255,255,0.3)' : colors.border,
                alignSelf: isUser ? 'flex-end' : 'flex-start',
              },
            ]}
          >
            <Ionicons
              name="document-attach"
              size={12}
              color={isUser ? '#fff' : colors.mutedForeground}
            />
            <Text
              numberOfLines={1}
              style={[
                bubbleStyles.attachmentName,
                { color: isUser ? '#fff' : colors.mutedForeground },
              ]}
            >
              {msg.attachmentName}
            </Text>
          </View>
        )}
        <View
          style={[
            bubbleStyles.bubble,
            {
              backgroundColor: isUser ? '#f97316' : colors.card,
              borderColor: isUser ? '#f97316' : colors.border,
            },
          ]}
        >
          {msg.isLoading ? (
            <View style={bubbleStyles.loadingRow}>
              <ActivityIndicator size="small" color={colors.mutedForeground} />
              <Text style={[bubbleStyles.loadingText, { color: colors.mutedForeground }]}>
                Memproses...
              </Text>
            </View>
          ) : (
            <Text
              style={[
                bubbleStyles.text,
                { color: isUser ? '#fff' : colors.foreground },
              ]}
            >
              {msg.content}
            </Text>
          )}
          <Text
            style={[
              bubbleStyles.time,
              { color: isUser ? 'rgba(255,255,255,0.6)' : colors.mutedForeground },
            ]}
          >
            {msg.timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    </View>
  );
}

const bubbleStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 10,
    gap: 8,
    paddingHorizontal: 16,
  },
  rowUser: { justifyContent: 'flex-end' },
  rowAI: { justifyContent: 'flex-start' },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  bubble: {
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  attachmentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 4,
    maxWidth: '100%',
  },
  attachmentName: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    flexShrink: 1,
  },
  text: { fontSize: 14, fontFamily: 'Inter_400Regular', lineHeight: 21 },
  time: { fontSize: 10, fontFamily: 'Inter_400Regular', marginTop: 4 },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  loadingText: { fontSize: 13, fontFamily: 'Inter_400Regular' },
});

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyChat({ agent }: { agent: (typeof AGENTS)[0] }) {
  const colors = useColors();
  return (
    <View style={emptyStyles.container}>
      <View style={[emptyStyles.iconBox, { backgroundColor: `${agent.color}20` }]}>
        <Ionicons name={agent.icon as keyof typeof Ionicons.glyphMap} size={36} color={agent.color} />
      </View>
      <Text style={[emptyStyles.title, { color: colors.foreground }]}>{agent.name}</Text>
      <Text style={[emptyStyles.desc, { color: colors.mutedForeground }]}>{agent.description}</Text>
      <Text style={[emptyStyles.hint, { color: colors.mutedForeground }]}>
        Ketik pertanyaan di bawah untuk memulai
      </Text>
    </View>
  );
}

const emptyStyles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  iconBox: { width: 72, height: 72, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  title: { fontSize: 20, fontWeight: '600', fontFamily: 'Inter_600SemiBold', marginBottom: 8 },
  desc: { fontSize: 14, fontFamily: 'Inter_400Regular', textAlign: 'center', marginBottom: 16 },
  hint: { fontSize: 12, fontFamily: 'Inter_400Regular', textAlign: 'center' },
});

// ─── Pending attachment preview ───────────────────────────────────────────────

function AttachmentPreview({
  name,
  onRemove,
}: {
  name: string;
  onRemove: () => void;
}) {
  const colors = useColors();
  return (
    <View style={[attachStyles.row, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Ionicons name="document-attach" size={16} color="#f97316" />
      <Text numberOfLines={1} style={[attachStyles.name, { color: colors.foreground }]}>
        {name}
      </Text>
      <TouchableOpacity onPress={onRemove} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Ionicons name="close-circle" size={18} color={colors.mutedForeground} />
      </TouchableOpacity>
    </View>
  );
}

const attachStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  name: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
  },
});

// ─── Main screen ──────────────────────────────────────────────────────────────

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'text/plain',
  'text/markdown',
  'text/csv',
];

export default function ChatScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ initialPrompt?: string }>();
  const { selectedAgent, setSelectedAgent, messages, addUserMessage, addLoadingMessage, addAssistantMessage, clearMessages, isSyncing } = useChat();

  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [pendingAttachment, setPendingAttachment] = useState<ChatAttachment | null>(null);
  const [pickingDoc, setPickingDoc] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const flatListRef = useRef<FlatList>(null);

  // Handle initialPrompt from navigation
  useEffect(() => {
    if (params.initialPrompt && !sending) {
      sendMessage(params.initialPrompt);
    }
  }, [params.initialPrompt]);

  const pickDocument = useCallback(async () => {
    if (pickingDoc) return;
    setPickingDoc(true);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ALLOWED_MIME_TYPES,
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.canceled || !result.assets?.[0]) return;

      const asset = result.assets[0];
      const { uri, name, mimeType } = asset;

      // Read file as base64 ('base64' string accepted by legacy API)
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: 'base64' as FileSystem.EncodingType,
      });

      const type = mimeType ?? 'application/octet-stream';
      setPendingAttachment({ name: name ?? 'document', type, base64 });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      Alert.alert('Gagal', 'Tidak dapat membaca dokumen. Coba lagi.');
    } finally {
      setPickingDoc(false);
    }
  }, [pickingDoc]);

  const sendMessage = useCallback(async (text: string, attachment?: ChatAttachment | null) => {
    const attachToSend = attachment ?? pendingAttachment;
    const typedText = text.trim();
    // Require either typed text or a pending attachment
    if (!typedText && !attachToSend) return;
    if (sending || isSyncing) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setInput('');
    setPendingAttachment(null);
    setSending(true);

    // API message: use typed text, or a default prompt when attachment-only
    const apiText = typedText || 'Tolong analisis dokumen ini.';
    // Display shows typed text (attachment chip shows regardless via attachmentName)
    addUserMessage(typedText, attachToSend?.name);
    const loadingId = addLoadingMessage();

    // Build history for API
    const history = messages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }));
    history.push({ role: 'user', content: apiText });

    try {
      const { message } = await apiChat(history, selectedAgent.id, attachToSend ?? undefined);
      addAssistantMessage(message, loadingId);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Gagal menghubungi server';
      addAssistantMessage(`⚠️ ${errorMsg}`, loadingId);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  }, [sending, messages, selectedAgent, pendingAttachment, addUserMessage, addLoadingMessage, addAssistantMessage]);

  const handleSend = () => sendMessage(input);

  const s = styles(colors, insets);

  // Inverted list — messages are shown newest at bottom
  const reversed = [...messages].reverse();

  return (
    <View style={s.root}>
      {/* Agent selector */}
      <View style={[s.agentBar, { paddingTop: Platform.OS === 'web' ? 67 : insets.top }]}>
        <FlatList
          horizontal
          data={AGENTS}
          keyExtractor={a => a.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.agentBarInner}
          renderItem={({ item }) => (
            <AgentChip
              agent={item}
              selected={item.id === selectedAgent.id}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSelectedAgent(item);
                clearMessages();
                setPendingAttachment(null);
              }}
            />
          )}
        />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={0}>
        {messages.length === 0 ? (
          isSyncing ? (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <ActivityIndicator size="large" color="#f97316" />
              <Text style={{ color: colors.mutedForeground, marginTop: 12, fontSize: 13, fontFamily: 'Inter_400Regular' }}>
                Memuat riwayat percakapan...
              </Text>
            </View>
          ) : (
            <EmptyChat agent={selectedAgent} />
          )
        ) : (
          <FlatList
            ref={flatListRef}
            data={reversed}
            keyExtractor={m => m.id}
            renderItem={({ item }) => <MessageBubble msg={item} />}
            inverted
            keyboardDismissMode="interactive"
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={s.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* Pending attachment preview */}
        {pendingAttachment && (
          <AttachmentPreview
            name={pendingAttachment.name}
            onRemove={() => setPendingAttachment(null)}
          />
        )}

        {/* Input bar */}
        <View style={[s.inputBar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
          {/* Attach button */}
          <TouchableOpacity
            style={[s.attachBtn, { opacity: (sending || isSyncing || pickingDoc) ? 0.4 : 1 }]}
            onPress={pickDocument}
            disabled={sending || isSyncing || pickingDoc}
            activeOpacity={0.75}
          >
            {pickingDoc ? (
              <ActivityIndicator size="small" color="#f97316" />
            ) : (
              <Ionicons
                name={pendingAttachment ? 'document-attach' : 'attach'}
                size={22}
                color={pendingAttachment ? '#f97316' : colors.mutedForeground}
              />
            )}
          </TouchableOpacity>

          <TextInput
            ref={inputRef}
            style={s.textInput}
            value={input}
            onChangeText={setInput}
            placeholder={`Tanya ${selectedAgent.name}...`}
            placeholderTextColor={colors.mutedForeground}
            multiline
            returnKeyType="send"
            blurOnSubmit={false}
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity
            style={[s.sendBtn, { opacity: ((!input.trim() && !pendingAttachment) || sending || isSyncing) ? 0.4 : 1 }]}
            onPress={handleSend}
            disabled={(!input.trim() && !pendingAttachment) || sending || isSyncing}
            activeOpacity={0.75}
          >
            {sending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="send" size={18} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = (colors: ReturnType<typeof useColors>, insets: ReturnType<typeof useSafeAreaInsets>) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.background },
    agentBar: {
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    agentBarInner: {
      paddingHorizontal: 16,
      paddingVertical: 10,
    },
    listContent: { paddingTop: 12 },
    inputBar: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: 8,
      paddingHorizontal: 12,
      paddingTop: 10,
      backgroundColor: colors.background,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    attachBtn: {
      width: 36,
      height: 42,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    textInput: {
      flex: 1,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 10,
      color: colors.foreground,
      fontSize: 15,
      fontFamily: 'Inter_400Regular',
      maxHeight: 120,
    },
    sendBtn: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: '#f97316',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
  });
