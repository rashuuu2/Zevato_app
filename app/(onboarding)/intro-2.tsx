import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Button from '@/components/common/Button';
import BackButton from '@/components/common/BackButton';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export default function Intro2Screen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <BackButton />
        <Text style={styles.stepText}>Step 2 of 3</Text>
      </View>

      <View style={styles.illustrationArea}>
        <View style={styles.graphicCircle}>
          <Ionicons name="calendar-outline" size={72} color={colors.primary} />
        </View>
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.heading}>Flexible Scheduling & Real-Time Tracking</Text>
        <Text style={styles.description}>
          Choose your preferred date and time slot. Track your technician's live location as they head to your home.
        </Text>

        <View style={styles.progressContainer}>
          <View style={styles.dot} />
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          title="Continue"
          variant="primary"
          size="large"
          onPress={() => router.push('/(onboarding)/intro-3' as any)}
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
