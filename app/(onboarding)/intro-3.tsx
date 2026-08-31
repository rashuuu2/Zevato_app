import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import Button from '@/components/common/Button';
import BackButton from '@/components/common/BackButton';
import useAuth from '@/hooks/useAuth';
import { colors } from '@/constants/colors';
import { config } from '@/constants/config';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export default function Intro3Screen() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleFinishOnboarding = async () => {
    try {
      setLoading(true);
      await AsyncStorage.setItem(config.storageKeys.onboardingCompleted, 'true');
      if (isSignedIn) {
        router.replace('/(tabs)/home' as any);
      } else {
        router.replace('/(auth)/login' as any);
      }
    } catch (error) {
      console.error('Failed to set onboarding completion state:', error);
      router.replace('/(auth)/login' as any);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <BackButton />
        <Text style={styles.stepText}>Step 3 of 3</Text>
      </View>

      <View style={styles.illustrationArea}>
        <View style={styles.graphicCircle}>
          <Ionicons name="shield-checkmark-outline" size={72} color={colors.primary} />
        </View>
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.heading}>Comprehensive Care & Warranty</Text>
        <Text style={styles.description}>
          Enjoy peace of mind with our 30-day service warranty, complimentary maintenance checks, and 24/7 priority support.
        </Text>

        <View style={styles.progressContainer}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={[styles.dot, styles.activeDot]} />
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          title="Get Started / Sign In"
          variant="primary"
          size="large"
          loading={loading}
          onPress={handleFinishOnboarding}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  illustrationArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  graphicCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  heading: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    textAlign: 'center',
  },
  description: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 22,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.divider,
  },
  activeDot: {
    width: 24,
    backgroundColor: colors.primary,
  },
  footer: {
    width: '100%',
  },
});
