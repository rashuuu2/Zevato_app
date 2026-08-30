import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '@/components/common/Header';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export default function TermsScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header title="Terms & Conditions" />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Terms of Service</Text>
        <Text style={styles.paragraph}>
          By using Zevota Care, you agree to our service terms. All appliance repair and maintenance services booked through our application are covered under our 30-day post service guarantee.
        </Text>
        <Text style={styles.subheading}>Warranty & Liability</Text>
        <Text style={styles.paragraph}>
          Replacement spare parts are covered by manufacturer warranty. Zevota Care provides free re-inspection if the same fault recurs within 30 days of service completion.
        </Text>
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
  heading: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subheading: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  paragraph: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 22,
  },
});
