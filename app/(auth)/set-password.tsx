import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Header from '@/components/common/Header';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export default function SetPasswordScreen() {
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');
    router.replace('/(auth)/account-created' as any);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header title="Set Password" />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Secure Your Account</Text>
        <Text style={styles.subtitle}>Choose a strong password to protect your bookings and saved addresses.</Text>

        <Input
          label="Password"
          placeholder="Min 6 characters"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          leftIcon={<Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} />}
          error={error}
        />

        <Input
          label="Confirm Password"
          placeholder="Re-enter password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          leftIcon={<Ionicons name="shield-outline" size={20} color={colors.textSecondary} />}
        />

        <Button
          title="Create Account"
          variant="primary"
          size="large"
          onPress={handleSubmit}
          style={styles.btn}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: spacing.xl,
  },
  title: {
    fontSize: typography.fontSize.heading,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
  },
  btn: {
    marginTop: spacing.md,
  },
});
