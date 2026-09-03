import React, { useEffect, useRef } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useClerk, useAuth } from '@clerk/expo';
import { useSignIn, useSignUp } from '@clerk/expo/legacy';
import { colors } from '@/constants/colors';

/**
 * SSO Callback Screen
 *
 * Handles deep-link redirect from OAuth provider (Google/Apple) in Expo Go.
 * When Google OAuth succeeds, Clerk redirects to this route with:
 *   - created_session_id (the authenticated session ready for activation)
 *   - rotating_token_nonce (one-time verification token)
 */
export default function SSOCallbackScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    created_session_id?: string;
    rotating_token_nonce?: string;
  }>();

  const clerk = useClerk();
  const { isLoaded, isSignedIn, userId, sessionId: currentSessionId } = useAuth();
  const { setActive } = clerk;
  const { signIn, isLoaded: isSignInLoaded } = useSignIn();
  const { signUp, isLoaded: isSignUpLoaded } = useSignUp();

  const activatingRef = useRef(false);
  const navigatedRef = useRef(false);

  console.log('>>> [SSO-CALLBACK RENDER]', {
    isLoaded,
    isSignedIn,
    userId,
    currentSessionId,
    clerkSessionId: clerk.session?.id,
  });

  // 1. Pure effect-driven navigation: ONLY navigate when isSignedIn is confirmed true
  useEffect(() => {
    if (navigatedRef.current) return;

    if (isLoaded && isSignedIn) {
      navigatedRef.current = true;
      console.log('>>> [SSO-CALLBACK] isSignedIn is TRUE! Navigating to (tabs)/home...');
      router.replace('/(tabs)/home' as any);
    }
  }, [isLoaded, isSignedIn]);

  // 2. Activate session from params
  useEffect(() => {
    if (!setActive || activatingRef.current || navigatedRef.current) {
      return;
    }

    const sessionId = params.created_session_id;
    const nonce = params.rotating_token_nonce;

    console.log('>>> [SSO-CALLBACK] Route params received:', JSON.stringify(params));

    if (sessionId) {
      activatingRef.current = true;
      console.log('>>> [SSO-CALLBACK] Calling setActive({ session:', sessionId, '})');
      setActive({ session: sessionId })
        .then(() => {
          console.log('>>> [SSO-CALLBACK] setActive resolved successfully. Waiting for reactive isSignedIn update...');
        })
        .catch((err) => {
          console.error('>>> [SSO-CALLBACK] Error activating session:', err);
          router.replace('/(auth)/login' as any);
        });
    } else if (nonce && isSignInLoaded && signIn) {
      activatingRef.current = true;
      console.log('>>> [SSO-CALLBACK] Fallback: reloading sign-in with nonce:', nonce);
      signIn
        .reload({ rotatingTokenNonce: nonce })
        .then(async () => {
          if (signIn.firstFactorVerification?.status === 'transferable' && isSignUpLoaded && signUp) {
            await signUp.create({ transfer: true });
          }
          const targetSessionId = signUp?.createdSessionId || signIn.createdSessionId;
          if (targetSessionId) {
            await setActive({ session: targetSessionId });
            console.log('>>> [SSO-CALLBACK] Fallback setActive resolved. Waiting for reactive isSignedIn update...');
          } else {
            router.replace('/(auth)/login' as any);
          }
        })
        .catch((err) => {
          console.warn('>>> [SSO-CALLBACK] Nonce reload failed:', err);
          router.replace('/(auth)/login' as any);
        });
    } else if (!sessionId && !nonce && !isSignedIn) {
      const timer = setTimeout(() => {
        if (!navigatedRef.current && !isSignedIn) {
          router.replace('/(auth)/login' as any);
        }
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isSignInLoaded, isSignUpLoaded, params.created_session_id, params.rotating_token_nonce]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});
