import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '@/components/common/Header';
import ProfileMenuItem from '@/components/profile/ProfileMenuItem';

import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export default function HelpCenterScreen() {
  const faqs = [
    { q: 'How does Zevota Care guarantee 30-day warranty?', a: 'If any repaired component fails within 30 days, we dispatch a senior engineer to fix it free of cost.' },
    { q: 'What happens if I cancel my booking?', a: 'Free cancellations are allowed up to 1 hour before scheduled technician visit with 100% instant refund.' },
    { q: 'Are spare parts original OEM?', a: 'Yes, 100% of replacement parts come directly from authorized manufacturer distribution.' },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header title="Help Center & FAQs" />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Frequently Asked Questions</Text>
        {faqs.map((f, i) => (
          <View key={i} style={styles.faqCard}>
            <Text style={styles.question}>{f.q}</Text>
            <Text style={styles.answer}>{f.a}</Text>
          </View>
        ))}
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
    marginBottom: spacing.md,
  },
  faqCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: spacing.radiusMd,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  question: {
    fontSize: typography.fontSize.sm + 1,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  answer: {
    fontSize: typography.fontSize.xs + 1,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 20,
  },
});
