import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Button from '@/components/common/Button';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.badge}>
          <Ionicons name="sparkles" size={16} color={colors.primary} />
          <Text style={styles.badgeText}>WELCOME TO ZEVOTA CARE</Text>
        </View>
        <Text style={styles.title}>Hassle-Free Home & Appliance Protection</Text>
        <Text style={styles.subtitle}>
          Expert repairs, scheduled maintenance, and complete coverage for all your home appliances.
        </Text>

        <View style={styles.illustrationBox}>
          <View style={styles.iconCircleBig}>
            <Ionicons name="home" size={64} color={colors.primary} />
          </View>
          <View style={styles.floatingBadge1}>
            <Ionicons name="shield-checkmark" size={18} color={colors.success} />
            <Text style={styles.floatingText}>100% Genuine Parts</Text>
          </View>
          <View style={styles.floatingBadge2}>
            <Ionicons name="time" size={18} color={colors.primary} />
            <Text style={styles.floatingText}>60-Min On Demand</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          title="Get Started"
          variant="primary"
          size="large"
          onPress={() => router.push('/(onboarding)/intro-1' as any)}
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
    paddingTop: spacing.xxl,
    paddingBottom: spacing.lg,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.radiusFull,
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  badgeText: {
    color: colors.primary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: typography.fontSize.display - 4,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 38,
  },
  subtitle: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 22,
    paddingHorizontal: spacing.sm,
  },
  illustrationBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    width: '100%',
    marginVertical: spacing.lg,
  },
  iconCircleBig: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
  },
  floatingBadge1: {
    position: 'absolute',
    top: '20%',
    left: '5%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.sm + 2,
    borderRadius: spacing.radiusFull,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    gap: 6,
  },
  floatingBadge2: {
    position: 'absolute',
    bottom: '20%',
    right: '5%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.sm + 2,
    borderRadius: spacing.radiusFull,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    gap: 6,
  },
  floatingText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
  },
  footer: {
    width: '100%',
  },
});
