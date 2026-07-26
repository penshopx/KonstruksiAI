import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { useAuth } from '@/context/AuthContext';
import { useChat, AGENTS, type Agent } from '@/context/ChatContext';

const SUGGESTED_PROMPTS = [
  'Cara mengikuti tender LPSE untuk perusahaan baru',
  'Syarat mendapatkan SBU konstruksi',
  'Buatkan RAB rumah 2 lantai 150 m²',
  'Buat JSA untuk pekerjaan di ketinggian',
  'Perizinan PLTS rooftop 100 kWp',
];

function AgentCard({ agent, onPress }: { agent: Agent; onPress: () => void }) {
  const colors = useColors();
  const s = agentStyles(colors);
  return (
    <TouchableOpacity
      style={[s.card, { borderLeftColor: agent.color }]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={[s.iconBox, { backgroundColor: `${agent.color}20` }]}>
        <Ionicons name={agent.icon as keyof typeof Ionicons.glyphMap} size={26} color={agent.color} />
      </View>
      <View style={s.cardContent}>
        <Text style={s.cardName}>{agent.name}</Text>
        <Text style={s.cardDesc} numberOfLines={2}>{agent.description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} />
    </TouchableOpacity>
  );
}

const agentStyles = (colors: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 14,
      padding: 14,
      marginBottom: 10,
      borderLeftWidth: 3,
      gap: 12,
    },
    iconBox: {
      width: 48,
      height: 48,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cardContent: { flex: 1 },
    cardName: {
      color: colors.foreground,
      fontSize: 15,
      fontWeight: '600',
      fontFamily: 'Inter_600SemiBold',
      marginBottom: 2,
    },
    cardDesc: {
      color: colors.mutedForeground,
      fontSize: 12,
      fontFamily: 'Inter_400Regular',
      lineHeight: 16,
    },
  });

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const { setSelectedAgent } = useChat();

  const handleAgentPress = (agent: Agent) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedAgent(agent);
    router.push('/(tabs)/chat');
  };

  const handlePromptPress = (prompt: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedAgent(AGENTS[0]);
    router.push({ pathname: '/(tabs)/chat', params: { initialPrompt: prompt } });
  };

  const s = styles(colors, insets);

  return (
    <FlatList
      style={s.list}
      contentContainerStyle={s.content}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <>
          {/* Header */}
          <View style={s.header}>
            <View style={s.headerLeft}>
              <View style={s.logoBox}>
                <Text style={s.logoK}>K</Text>
              </View>
              <View>
                <Text style={s.greeting}>Halo, {user?.name?.split(' ')[0] ?? 'Profesional'} 👋</Text>
                <Text style={s.subGreeting}>Tanyakan apa saja seputar konstruksi</Text>
              </View>
            </View>
          </View>

          {/* Quick prompts */}
          <Text style={s.sectionTitle}>Pertanyaan Populer</Text>
          <FlatList
            horizontal
            data={SUGGESTED_PROMPTS}
            keyExtractor={item => item}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.promptsRow}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={s.promptChip}
                onPress={() => handlePromptPress(item)}
                activeOpacity={0.75}
              >
                <Text style={s.promptText} numberOfLines={2}>{item}</Text>
              </TouchableOpacity>
            )}
          />

          {/* Agents section */}
          <Text style={s.sectionTitle}>Pilih Agen AI</Text>
        </>
      }
      data={AGENTS}
      keyExtractor={a => a.id}
      renderItem={({ item }) => (
        <AgentCard agent={item} onPress={() => handleAgentPress(item)} />
      )}
    />
  );
}

const styles = (colors: ReturnType<typeof useColors>, insets: ReturnType<typeof useSafeAreaInsets>) =>
  StyleSheet.create({
    list: { flex: 1, backgroundColor: colors.background },
    content: {
      paddingTop: Platform.OS === 'web' ? 67 : insets.top + 12,
      paddingBottom: insets.bottom + 90,
      paddingHorizontal: 16,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 24,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    logoBox: {
      width: 44,
      height: 44,
      backgroundColor: '#f97316',
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoK: { color: '#fff', fontSize: 22, fontWeight: '700', fontFamily: 'Inter_700Bold' },
    greeting: {
      color: colors.foreground,
      fontSize: 16,
      fontWeight: '600',
      fontFamily: 'Inter_600SemiBold',
    },
    subGreeting: {
      color: colors.mutedForeground,
      fontSize: 12,
      fontFamily: 'Inter_400Regular',
    },
    sectionTitle: {
      color: colors.foreground,
      fontSize: 14,
      fontWeight: '600',
      fontFamily: 'Inter_600SemiBold',
      marginBottom: 12,
      marginTop: 4,
    },
    promptsRow: {
      paddingRight: 16,
      marginBottom: 20,
      gap: 8,
    },
    promptChip: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      paddingHorizontal: 14,
      paddingVertical: 10,
      maxWidth: 200,
    },
    promptText: {
      color: colors.foreground,
      fontSize: 12,
      fontFamily: 'Inter_400Regular',
      lineHeight: 16,
    },
  });
