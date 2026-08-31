import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import useAuth from '@/hooks/useAuth';
import { colors } from '@/constants/colors';
import { config } from '@/constants/config';
import { typography } from '@/constants/typography';
import { spacing } from '@/constants/spacing';

export default function SplashScreen() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const checkAppInitialRoute = async () => {
      // Wait until Clerk auth state is initialized
      if (!isLoaded) return;

      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const hasCompletedOnboarding = await AsyncStorage.getItem(
          config.storageKeys.onboardingCompleted
        );

        if (!isMounted) return;

        if (hasCompletedOnboarding !== 'true') {
          // First launch: Intro Onboarding flow
          router.replace('/(onboarding)/welcome' as any);
        } else if (isSignedIn) {
          // Returning authenticated user: Home dashboard
          router.replace('/(tabs)/home' as any);
        } else {
          // Returning unauthenticated user: Sign In screen
          router.replace('/(auth)/login' as any);
        }
      } catch (error) {
        console.error('Error during initial routing check:', error);
        if (isMounted) {
          router.replace('/(onboarding)/welcome' as any);
        }
      }
    };

    checkAppInitialRoute();

    return () => {
      isMounted = false;
    };
  }, [isLoaded, isSignedIn]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.iconCircle}>
          <Ionicons name="shield-checkmark" size={48} color={colors.white} />
        </View>
        <Text style={styles.brandTitle}>Zevota Care</Text>
        <Text style={styles.brandTagline}>Premium Appliance Protection & Care</Text>
      </View>
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  logoContainer: {
    alignItems: 'center',
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: spacing.md,
  },
  brandTitle: {
    fontSize: typography.fontSize.heading + 4,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    letterSpacing: -0.5,
  },
  brandTagline: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: spacing.xxl,
  },
});
