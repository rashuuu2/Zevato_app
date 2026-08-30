import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import Header from '@/components/common/Header';
import Button from '@/components/common/Button';

import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export default function ProtectionScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header title="Zevota Protection Plan" />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.badge}>
            <Ionicons name="shield-checkmark" size={16} color={colors.white} />
            <Text style={styles.badgeText}>ACTIVE PLAN</Text>
          </View>
          <Text style={styles.title}>Annual Appliance Care Subscription</Text>
          <Text style={styles.validity}>Expires 31 Dec 2026</Text>
        </View>

        <Text style={styles.heading}>Plan Coverage Summary</Text>
        <View style={styles.featureRow}>
          <Ionicons name="checkmark-circle" size={20} color={colors.success} />
          <Text style={styles.featureText}>Unlimited Free Service Visits ($0 Labor fee)</Text>
        </View>
        <View style={styles.featureRow}>
          <Ionicons name="checkmark-circle" size={20} color={colors.success} />
          <Text style={styles.featureText}>2 Complimentary Jet Wash Tune-ups per year</Text>
        </View>
        <View style={styles.featureRow}>
          <Ionicons name="checkmark-circle" size={20} color={colors.success} />
          <Text style={styles.featureText}>100% Genuine Spare Parts discount (Up to 25% off)</Text>
        </View>
        <View style={styles.featureRow}>
          <Ionicons name="checkmark-circle" size={20} color={colors.success} />
          <Text style={styles.featureText}>Priority 60-Minute technician assignment</Text>
        </View>

        <Button title="Extend Protection Plan" variant="primary" size="large" onPress={() => {}} style={styles.btn} />
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
    padding: spacing.md,
  },
  card: {
    backgroundColor: colors.primary,
    padding: spacing.lg,
    borderRadius: spacing.radiusLg,
    marginBottom: spacing.lg,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingVertical: 3,
    paddingHorizontal: spacing.sm,
    borderRadius: spacing.radiusFull,
    alignSelf: 'flex-start',
    gap: 4,
    marginBottom: spacing.sm,
  },
  badgeText: {
    color: colors.white,
    fontSize: typography.fontSize.xs - 2,
    fontWeight: typography.fontWeight.bold,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
  },
  validity: {
    fontSize: typography.fontSize.xs,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: spacing.xs,
  },
  heading: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    marginBottom: spacing.sm,
  },
  featureText: {
    fontSize: typography.fontSize.sm,
    color: colors.text,
  },
  btn: {
    marginTop: spacing.xl,
  },
});
