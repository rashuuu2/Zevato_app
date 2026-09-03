import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSignIn } from '@clerk/expo/legacy';
import { useSSO } from '@clerk/expo';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';

import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Header from '@/components/common/Header';

import { authService } from '@/services/auth';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

// NOTE: warmUpAsync on Android Expo Go can cause CustomTabsService connection
// to get orphaned on component re-mount, hanging subsequent openAuthSessionAsync calls.
const useWarmUpBrowser = () => {
  // disabled on Android to prevent CustomTabs hang on repeat sign-in
};

export default function LoginScreen() {
  useWarmUpBrowser();
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();
  const { startSSOFlow } = useSSO();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleLogin = async () => {
    if (!authService.validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!password) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (!isLoaded || !signIn) {
        return;
      }

      const result = await signIn.create({
        identifier: email.trim(),
        password,
      });

      if (result.status === 'complete') {
        if (setActive) {
          await setActive({ session: result.createdSessionId });
        }
      } else {
        setError('Additional sign in steps required.');
      }
    } catch (err: any) {
      const errMsg = authService.formatAuthError(err);
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    console.log('>>> [OAuth DEBUG] "Continue with Google" button pressed!');
    try {
      setGoogleLoading(true);
      setError('');

      // Dismiss any lingering Android auth session before opening a new one
      try {
        WebBrowser.dismissAuthSession();
      } catch {}

      const redirectUrl = AuthSession.makeRedirectUri({
        scheme: 'zevatoapp',
        path: 'sso-callback',
      });
      console.log('\n========================================');
      console.log('>>> [OAuth DEBUG] Generated Redirect URL:');
      console.log(redirectUrl);
      console.log('========================================\n');

      console.log('>>> [OAuth DEBUG] Calling startSSOFlow now...');
      const ssoResult = await startSSOFlow({
        strategy: 'oauth_google',
        redirectUrl,
      });

      console.log('>>> [OAuth DEBUG] startSSOFlow promise resolved! Result:', JSON.stringify(ssoResult, null, 2));

      const { createdSessionId, setActive: setSSOActive } = ssoResult;
      const targetSessionId = createdSessionId || ssoResult.signIn?.createdSessionId;

      if (targetSessionId && setSSOActive) {
        console.log('>>> [OAuth DEBUG] Activating session:', targetSessionId);
        await setSSOActive({ session: targetSessionId });
        router.replace('/(tabs)/home' as any);
      } else {
        console.log('>>> [OAuth DEBUG] No createdSessionId in result (auth may complete via sso-callback)');
      }
    } catch (err: any) {
      console.error('>>> [OAuth DEBUG] Google Sign-In Error:', err);
      const errMsg = authService.formatAuthError(err);
      setError(errMsg);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header title="Sign In" showBack={false} />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.logoCircle}>
          <Ionicons name="shield-checkmark" size={40} color={colors.primary} />
        </View>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to access your appliance protection plans & bookings</Text>

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

        <Input
          label="Password"
          placeholder="Enter your password"
          secureTextEntry
          value={password}
          onChangeText={(txt) => {
            setPassword(txt);
            if (error) setError('');
          }}
          leftIcon={<Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} />}
        />

        <TouchableOpacity
          style={styles.forgotBtn}
          onPress={() => router.push({ pathname: '/(auth)/set-password' as any, params: { mode: 'forgot' } })}
        >
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        <Button
          title="Sign In"
          variant="primary"
          size="large"
          loading={loading}
          disabled={googleLoading}
          onPress={handleLogin}
          style={styles.submitBtn}
        />

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity
          style={styles.googleBtn}
          onPress={handleGoogleSignIn}
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
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/signup' as any)}>
            <Text style={styles.signupText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
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
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: spacing.md,
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
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: spacing.md,
  },
  forgotText: {
    fontSize: typography.fontSize.xs + 1,
    color: colors.primary,
    fontWeight: typography.fontWeight.semibold,
  },
  submitBtn: {
    marginTop: spacing.sm,
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
  signupText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
});
