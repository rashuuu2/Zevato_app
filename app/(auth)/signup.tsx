import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSignUp } from '@clerk/expo/legacy';
import { useSSO } from '@clerk/expo';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';

import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Header from '@/components/common/Header';

import { authService } from '@/services/auth';
import { userStore } from '@/store/userStore';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

const useWarmUpBrowser = () => {
  useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

export default function SignupScreen() {
  useWarmUpBrowser();
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();
  const { startSSOFlow } = useSSO();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSignUp = async () => {
    if (!fullName.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!authService.validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setError('');
    setLoading(true);

    try {
      if (!isLoaded || !signUp) {
        userStore.updateProfile({ name: fullName, email });
        router.push('/(auth)/complete-profile' as any);
        return;
      }

      await signUp.create({
        firstName: fullName.split(' ')[0] || fullName,
        lastName: fullName.split(' ').slice(1).join(' ') || '',
        emailAddress: email.trim(),
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (err: any) {
      const errMsg = authService.formatAuthError(err);
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setGoogleLoading(true);
      setError('');
      const { createdSessionId, setActive: setSSOActive } = await startSSOFlow({
        strategy: 'oauth_google',
      });

      if (createdSessionId && setSSOActive) {
        await setSSOActive({ session: createdSessionId });
      }
    } catch (err: any) {
      const errMsg = authService.formatAuthError(err);
      setError(errMsg);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!code || code.length < 4) {
      setError('Please enter the 6-digit verification code sent to your email.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      if (!signUp) return;

      const completeSignUp = await signUp.attemptEmailAddressVerification({ code });

      if (completeSignUp.status === 'complete') {
        if (setActive) {
          await setActive({ session: completeSignUp.createdSessionId });
        }
        userStore.updateProfile({ name: fullName, email });
        router.replace('/(auth)/complete-profile' as any);
      } else {
        setError('Verification incomplete. Please check the code and try again.');
      }
    } catch (err: any) {
      const errMsg = authService.formatAuthError(err);
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header title={pendingVerification ? 'Verify Email' : 'Create Account'} />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View nativeID="clerk-captcha" />

        {!pendingVerification ? (
          <>
            <Text style={styles.title}>Create Your Zevota Account</Text>
            <Text style={styles.subtitle}>
              Sign up to manage appliance services, warranties, and technician visits.
            </Text>

            <Input
              label="Full Name"
              placeholder="e.g. Alex Johnson"
              value={fullName}
              onChangeText={(txt) => {
                setFullName(txt);
                if (error) setError('');
              }}
              leftIcon={<Ionicons name="person-outline" size={20} color={colors.textSecondary} />}
              error={error}
            />

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
            />

            <Input
              label="Password"
              placeholder="Min 6 characters"
              secureTextEntry
              value={password}
              onChangeText={(txt) => {
                setPassword(txt);
                if (error) setError('');
              }}
              leftIcon={<Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} />}
            />

            <Button
              title="Create Account"
              variant="primary"
              size="large"
              loading={loading}
              disabled={googleLoading}
              onPress={handleSignUp}
              style={styles.submitBtn}
            />

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={styles.googleBtn}
              onPress={handleGoogleSignUp}
              disabled={googleLoading || loading}
              activeOpacity={0.8}
            >
              {googleLoading ? (
                <ActivityIndicator color={colors.text} />
              ) : (
                <>
                  <Ionicons name="logo-google" size={20} color="#EA4335" style={styles.googleIcon} />
                  <Text style={styles.googleBtnText}>Continue with Google</Text>
                </>
              )}
            </TouchableOpacity>

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Already have an account?</Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/login' as any)}>
                <Text style={styles.loginText}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <View style={styles.verifyIconBox}>
              <Ionicons name="mail-unread-outline" size={48} color={colors.primary} />
            </View>
            <Text style={styles.title}>Verify Your Email</Text>
            <Text style={styles.subtitle}>
              We sent a 6-digit verification code to <Text style={styles.emailHighlight}>{email}</Text>.
            </Text>

            <Input
              label="Verification Code"
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

            <Button
              title="Verify Email & Continue"
              variant="primary"
              size="large"
              loading={loading}
              onPress={handleVerifyCode}
              style={styles.submitBtn}
            />

            <TouchableOpacity style={styles.resendBtn} onPress={handleSignUp}>
              <Text style={styles.resendText}>Resend Code</Text>
            </TouchableOpacity>
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
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
    lineHeight: 20,
  },
  emailHighlight: {
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  verifyIconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  submitBtn: {
    marginTop: spacing.md,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    marginHorizontal: spacing.md,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: spacing.radiusMd,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  googleIcon: {
    marginRight: 2,
  },
  googleBtnText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
  },
  resendBtn: {
    marginTop: spacing.md,
    alignSelf: 'center',
  },
  resendText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
    gap: spacing.xs,
  },
  footerText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  loginText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
});
