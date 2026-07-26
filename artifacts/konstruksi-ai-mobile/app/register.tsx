import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { useAuth } from '@/context/AuthContext';

export default function RegisterScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { register } = useAuth();
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password || !confirm) {
      setError('Semua field harus diisi');
      return;
    }
    if (password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }
    if (password !== confirm) {
      setError('Password tidak cocok');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await register(name.trim(), email.trim().toLowerCase(), password);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/(tabs)');
    } catch (err: unknown) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setError(err instanceof Error ? err.message : 'Pendaftaran gagal');
    } finally {
      setLoading(false);
    }
  };

  const s = styles(colors, insets);

  return (
    <View style={s.root}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={s.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={s.logoRow}>
            <View style={s.logoBox}>
              <Text style={s.logoLetter}>K</Text>
            </View>
            <View>
              <Text style={s.logoTitle}>KonstruksiAI</Text>
              <Text style={s.logoSub}>Asisten Cerdas Keteknikan</Text>
            </View>
          </View>

          <Text style={s.heading}>Buat Akun Baru</Text>
          <Text style={s.subheading}>Bergabung dengan ribuan profesional konstruksi</Text>

          {!!error && (
            <View style={s.errorBox}>
              <Ionicons name="warning" size={16} color={colors.destructive} />
              <Text style={s.errorText}>{error}</Text>
            </View>
          )}

          {/* Name */}
          <View style={s.inputGroup}>
            <Text style={s.label}>Nama Lengkap</Text>
            <View style={s.inputWrap}>
              <Ionicons name="person-outline" size={18} color={colors.mutedForeground} style={s.inputIcon} />
              <TextInput
                style={s.input}
                value={name}
                onChangeText={setName}
                placeholder="Nama lengkap Anda"
                placeholderTextColor={colors.mutedForeground}
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() => emailRef.current?.focus()}
              />
            </View>
          </View>

          {/* Email */}
          <View style={s.inputGroup}>
            <Text style={s.label}>Email</Text>
            <View style={s.inputWrap}>
              <Ionicons name="mail-outline" size={18} color={colors.mutedForeground} style={s.inputIcon} />
              <TextInput
                ref={emailRef}
                style={s.input}
                value={email}
                onChangeText={setEmail}
                placeholder="nama@email.com"
                placeholderTextColor={colors.mutedForeground}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
              />
            </View>
          </View>

          {/* Password */}
          <View style={s.inputGroup}>
            <Text style={s.label}>Password</Text>
            <View style={s.inputWrap}>
              <Ionicons name="lock-closed-outline" size={18} color={colors.mutedForeground} style={s.inputIcon} />
              <TextInput
                ref={passwordRef}
                style={s.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Min. 6 karakter"
                placeholderTextColor={colors.mutedForeground}
                secureTextEntry={!showPass}
                returnKeyType="next"
                onSubmitEditing={() => confirmRef.current?.focus()}
              />
              <TouchableOpacity onPress={() => setShowPass(v => !v)} style={s.eyeBtn}>
                <Ionicons
                  name={showPass ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color={colors.mutedForeground}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm */}
          <View style={s.inputGroup}>
            <Text style={s.label}>Konfirmasi Password</Text>
            <View style={s.inputWrap}>
              <Ionicons name="lock-closed-outline" size={18} color={colors.mutedForeground} style={s.inputIcon} />
              <TextInput
                ref={confirmRef}
                style={s.input}
                value={confirm}
                onChangeText={setConfirm}
                placeholder="Ulangi password"
                placeholderTextColor={colors.mutedForeground}
                secureTextEntry={!showPass}
                returnKeyType="done"
                onSubmitEditing={handleRegister}
              />
            </View>
          </View>

          {/* Submit */}
          <TouchableOpacity
            style={[s.btn, loading && s.btnDisabled]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={s.btnText}>Daftar</Text>
            )}
          </TouchableOpacity>

          <View style={s.footer}>
            <Text style={s.footerText}>Sudah punya akun? </Text>
            <Link href="/login" asChild>
              <TouchableOpacity>
                <Text style={s.footerLink}>Masuk</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = (colors: ReturnType<typeof useColors>, insets: ReturnType<typeof useSafeAreaInsets>) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.background },
    container: {
      flexGrow: 1,
      paddingHorizontal: 24,
      paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 40),
      paddingBottom: insets.bottom + 40,
    },
    logoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 32 },
    logoBox: {
      width: 48, height: 48, backgroundColor: '#f97316', borderRadius: 14,
      alignItems: 'center', justifyContent: 'center',
    },
    logoLetter: { color: '#fff', fontSize: 24, fontWeight: '700', fontFamily: 'Inter_700Bold' },
    logoTitle: { color: colors.foreground, fontSize: 18, fontWeight: '700', fontFamily: 'Inter_700Bold' },
    logoSub: { color: colors.mutedForeground, fontSize: 11, fontFamily: 'Inter_400Regular' },
    heading: { color: colors.foreground, fontSize: 26, fontWeight: '700', fontFamily: 'Inter_700Bold', marginBottom: 6 },
    subheading: { color: colors.mutedForeground, fontSize: 13, fontFamily: 'Inter_400Regular', marginBottom: 24 },
    errorBox: {
      flexDirection: 'row', alignItems: 'center', gap: 8,
      backgroundColor: `${colors.destructive}18`, borderWidth: 1,
      borderColor: `${colors.destructive}40`, borderRadius: 10, padding: 12, marginBottom: 16,
    },
    errorText: { color: colors.destructive, fontSize: 13, fontFamily: 'Inter_400Regular', flex: 1 },
    inputGroup: { marginBottom: 14 },
    label: { color: colors.foreground, fontSize: 13, fontWeight: '500', fontFamily: 'Inter_500Medium', marginBottom: 7 },
    inputWrap: {
      flexDirection: 'row', alignItems: 'center',
      backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border,
      borderRadius: 12, paddingHorizontal: 12,
    },
    inputIcon: { marginRight: 8 },
    input: { flex: 1, height: 48, color: colors.foreground, fontSize: 15, fontFamily: 'Inter_400Regular' },
    eyeBtn: { padding: 4 },
    btn: {
      backgroundColor: '#f97316', borderRadius: 12, height: 52,
      alignItems: 'center', justifyContent: 'center', marginTop: 8,
      shadowColor: '#f97316', shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
    },
    btnDisabled: { opacity: 0.6 },
    btnText: { color: '#fff', fontSize: 16, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
    footerText: { color: colors.mutedForeground, fontSize: 14, fontFamily: 'Inter_400Regular' },
    footerLink: { color: '#f97316', fontSize: 14, fontWeight: '500', fontFamily: 'Inter_500Medium' },
  });
