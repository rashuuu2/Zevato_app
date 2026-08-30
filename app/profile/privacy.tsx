import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '@/components/common/Header';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export default function PrivacyScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header title="Privacy Policy" />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Privacy & Data Protection</Text>
        <Text style={styles.paragraph}>
          At Zevota Care, we value your privacy. We collect personal information such as your name, phone number, and service address solely for fulfilling appliance maintenance services and dispatching verified technicians.
        </Text>
        <Text style={styles.subheading}>Data Security</Text>
        <Text style={styles.paragraph}>
          All data transmitted through our application is encrypted end-to-end using standard 256-bit TLS protocols. We never sell your personal details to third parties.
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
