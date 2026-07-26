import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { useAuth } from '@/context/AuthContext';

function MenuItem({
  icon,
  label,
  sublabel,
  onPress,
  danger,
  colors,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  sublabel?: string;
  onPress?: () => void;
  danger?: boolean;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <TouchableOpacity
      style={[menuStyles.item, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.75}
      disabled={!onPress}
    >
      <View style={[menuStyles.iconBox, { backgroundColor: danger ? `${colors.destructive}18` : `${'#f97316'}18` }]}>
        <Ionicons name={icon} size={20} color={danger ? colors.destructive : '#f97316'} />
      </View>
      <View style={menuStyles.labelCol}>
        <Text style={[menuStyles.label, { color: danger ? colors.destructive : colors.foreground }]}>
          {label}
        </Text>
        {sublabel ? (
          <Text style={[menuStyles.sublabel, { color: colors.mutedForeground }]}>{sublabel}</Text>
        ) : null}
      </View>
      {onPress && (
        <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} />
      )}
    </TouchableOpacity>
  );
}

const menuStyles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 8,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelCol: { flex: 1 },
  label: { fontSize: 15, fontWeight: '500', fontFamily: 'Inter_500Medium' },
  sublabel: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
});

const FEATURES = [
  { icon: '🏗️', label: 'Teknik Konstruksi', count: '10 sub-bidang' },
  { icon: '⚡', label: 'Ketenagalistrikan & EBT', count: '6 sub-bidang' },
  { icon: '⛏️', label: 'Migas & Pertambangan', count: '6 sub-bidang' },
];

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();

  const initials = (user?.name ?? 'U')
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const handleLogout = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert(
      'Keluar',
      'Apakah Anda yakin ingin keluar?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Keluar',
          style: 'destructive',
          onPress: async () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            await logout();
          },
        },
      ],
    );
  };

  const s = styles(colors, insets);

  return (
    <ScrollView
      style={s.scroll}
      contentContainerStyle={s.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile card */}
      <View style={s.profileCard}>
        <View style={s.avatar}>
          <Text style={s.avatarText}>{initials}</Text>
        </View>
        <Text style={s.userName}>{user?.name ?? '—'}</Text>
        <Text style={s.userEmail}>{user?.email ?? '—'}</Text>
        <View style={s.roleBadge}>
          <Text style={s.roleText}>{user?.role === 'admin' ? 'Administrator' : 'Pengguna'}</Text>
        </View>
      </View>

      {/* Coverage chips */}
      <Text style={s.sectionLabel}>Cakupan Keahlian</Text>
      {FEATURES.map(f => (
        <View key={f.label} style={[s.featureRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={s.featureEmoji}>{f.icon}</Text>
          <View style={{ flex: 1 }}>
            <Text style={[s.featureName, { color: colors.foreground }]}>{f.label}</Text>
            <Text style={[s.featureCount, { color: colors.mutedForeground }]}>{f.count}</Text>
          </View>
        </View>
      ))}

      {/* Menu */}
      <Text style={s.sectionLabel}>Tentang</Text>
      <MenuItem
        icon="information-circle-outline"
        label="Tentang KonstruksiAI"
        sublabel="Asisten AI untuk industri keteknikan Indonesia"
        colors={colors}
      />
      <MenuItem
        icon="shield-checkmark-outline"
        label="Privasi & Keamanan"
        sublabel="Data percakapan Anda terlindungi"
        colors={colors}
      />
      <MenuItem
        icon="help-circle-outline"
        label="Bantuan & Dukungan"
        sublabel="Panduan penggunaan dan FAQ"
        colors={colors}
      />

      <Text style={s.sectionLabel}>Akun</Text>
      <MenuItem
        icon="log-out-outline"
        label="Keluar"
        onPress={handleLogout}
        danger
        colors={colors}
      />

      <Text style={s.version}>KonstruksiAI v1.0 · Made with 🧡 for Indonesia</Text>
    </ScrollView>
  );
}

const styles = (colors: ReturnType<typeof useColors>, insets: ReturnType<typeof useSafeAreaInsets>) =>
  StyleSheet.create({
    scroll: { flex: 1, backgroundColor: colors.background },
    content: {
      paddingTop: Platform.OS === 'web' ? 67 : insets.top + 16,
      paddingBottom: insets.bottom + 90,
      paddingHorizontal: 16,
    },
    profileCard: {
      alignItems: 'center',
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 20,
      padding: 24,
      marginBottom: 24,
    },
    avatar: {
      width: 72,
      height: 72,
      backgroundColor: '#f97316',
      borderRadius: 36,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },
    avatarText: {
      color: '#fff',
      fontSize: 28,
      fontWeight: '700',
      fontFamily: 'Inter_700Bold',
    },
    userName: {
      color: colors.foreground,
      fontSize: 20,
      fontWeight: '700',
      fontFamily: 'Inter_700Bold',
      marginBottom: 4,
    },
    userEmail: {
      color: colors.mutedForeground,
      fontSize: 13,
      fontFamily: 'Inter_400Regular',
      marginBottom: 12,
    },
    roleBadge: {
      backgroundColor: '#f9731620',
      borderWidth: 1,
      borderColor: '#f9731640',
      borderRadius: 20,
      paddingHorizontal: 14,
      paddingVertical: 4,
    },
    roleText: {
      color: '#f97316',
      fontSize: 12,
      fontWeight: '500',
      fontFamily: 'Inter_500Medium',
    },
    sectionLabel: {
      color: colors.mutedForeground,
      fontSize: 11,
      fontWeight: '600',
      fontFamily: 'Inter_600SemiBold',
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 10,
      marginTop: 4,
    },
    featureRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 14,
      borderRadius: 14,
      borderWidth: 1,
      marginBottom: 8,
    },
    featureEmoji: { fontSize: 22 },
    featureName: { fontSize: 14, fontWeight: '500', fontFamily: 'Inter_500Medium' },
    featureCount: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
    version: {
      color: colors.mutedForeground,
      fontSize: 12,
      fontFamily: 'Inter_400Regular',
      textAlign: 'center',
      marginTop: 24,
    },
  });
