import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSignIn } from '@clerk/expo/legacy';

import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Header from '@/components/common/Header';

import { authService } from '@/services/auth';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export default function SetPasswordScreen() {
  const router = useRouter();
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const { isLoaded, signIn, setActive } = useSignIn();

  const isForgotMode = mode === 'forgot';

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState<'request' | 'reset'>(isForgotMode ? 'request' : 'reset');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestReset = async () => {
    if (!authService.validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setError('');
    setLoading(true);

    try {
      if (!isLoaded || !signIn) {
        setStep('reset');
        return;
      }

      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: email.trim(),
      });
      setStep('reset');
    } catch (err: any) {
      const errMsg = authService.formatAuthError(err);
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (isForgotMode && (!code || code.length < 4)) {
      setError('Please enter the verification code sent to your email.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');
    setLoading(true);

    try {
      if (isLoaded && signIn && isForgotMode) {
        const result = await signIn.attemptFirstFactor({
          strategy: 'reset_password_email_code',
          code,
          password,
        });

        if (result.status === 'complete') {
          if (setActive) {
            await setActive({ session: result.createdSessionId });
          }
          router.replace('/(auth)/account-created' as any);
          return;
        }
      }

      router.replace('/(auth)/account-created' as any);
    } catch (err: any) {
      const errMsg = authService.formatAuthError(err);
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header title={isForgotMode ? 'Reset Password' : 'Set Password'} />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>
          {isForgotMode
            ? step === 'request'
              ? 'Forgot Password?'
              : 'Set New Password'
            : 'Secure Your Account'}
        </Text>
        <Text style={styles.subtitle}>
          {isForgotMode
            ? step === 'request'
              ? 'Enter your registered email address to receive a password reset code.'
              : 'Enter the verification code sent to your email along with your new password.'
            : 'Choose a strong password to protect your bookings and saved addresses.'}
        </Text>

        {isForgotMode && step === 'request' ? (
          <>
            <Input
              label="Email Address"
              placeholder="e.g. alex@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={(txt) => {
                setEmail(txt);
                if (error) setError('');
              }}
              leftIcon={<Ionicons name="mail-outline" size={20} color={colors.textSecondary} />}
              error={error}
            />

            <Button
              title="Send Verification Code"
              variant="primary"
              size="large"
              loading={loading}
              onPress={handleRequestReset}
              style={styles.btn}
            />
          </>
        ) : (
          <>
            {isForgotMode && (
              <Input
                label="Reset Code"
                placeholder="Enter 6-digit code"
                keyboardType="number-pad"
                value={code}
                onChangeText={(txt) => {
                  setCode(txt);
                  if (error) setError('');
                }}
                leftIcon={<Ionicons name="key-outline" size={20} color={colors.textSecondary} />}
                error={error}
              />
            )}

            <Input
              label="New Password"
              placeholder="Min 6 characters"
              secureTextEntry
              value={password}
              onChangeText={(txt) => {
                setPassword(txt);
                if (error) setError('');
              }}
              leftIcon={<Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} />}
              error={!isForgotMode ? error : undefined}
            />

            <Input
              label="Confirm New Password"
              placeholder="Re-enter password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={(txt) => {
                setConfirmPassword(txt);
                if (error) setError('');
              }}
              leftIcon={<Ionicons name="shield-outline" size={20} color={colors.textSecondary} />}
            />

            <Button
              title={isForgotMode ? 'Update Password & Sign In' : 'Save Password & Continue'}
              variant="primary"
              size="large"
              loading={loading}
              onPress={handleResetPassword}
              style={styles.btn}
            />
          </>
        )}
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
    lineHeight: 20,
  },
  btn: {
    marginTop: spacing.md,
  },
});
