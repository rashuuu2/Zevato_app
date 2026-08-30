import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '@/components/common/Header';
import Button from '@/components/common/Button';

import bookings from '@/data/bookings';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { formatCurrency } from '@/utils/formatCurrency';

export default function InvoiceScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const booking = bookings.find((b) => b.id === id) || bookings[1];
  const invoice = booking.invoice || {
    id: 'INV-87120',
    bookingId: booking.id,
    date: '24 Aug 2026',
    subtotal: 422.88,
    tax: 76.12,
    discount: 0,
    total: 499,
    items: [
      { description: 'Washing Machine Drum Descaling', amount: 422.88 },
      { description: 'GST (18%)', amount: 76.12 },
    ],
  };

  const handleDownload = () => {
    Alert.alert('Invoice Downloaded', `PDF Invoice ${invoice.id} saved to your device downloads.`);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header title={`Invoice ${invoice.id}`} />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.invoiceCard}>
          <Text style={styles.companyTitle}>Zevota Care Services Pvt Ltd</Text>
          <Text style={styles.companySub}>GSTIN: 29AAAAA0000A1Z5</Text>
          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>Invoice Date:</Text>
            <Text style={styles.val}>{invoice.date}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Booking Reference:</Text>
            <Text style={styles.val}>{invoice.bookingId}</Text>
          </View>
          <View style={styles.divider} />

          <Text style={styles.tableHeading}>Item Summary</Text>
          {invoice.items.map((item, idx) => (
            <View key={idx} style={styles.row}>
              <Text style={styles.label}>{item.description}</Text>
              <Text style={styles.val}>{formatCurrency(item.amount)}</Text>
            </View>
          ))}
          <View style={styles.divider} />

          <View style={[styles.row, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Amount Paid:</Text>
            <Text style={styles.totalVal}>{formatCurrency(invoice.total)}</Text>
          </View>
        </View>

        <Button
          title="Download PDF Receipt"
          variant="primary"
          size="large"
          onPress={handleDownload}
          style={styles.btn}
        />
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
  invoiceCard: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: spacing.radiusLg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  companyTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  companySub: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  val: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
  },
  tableHeading: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  totalRow: {
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  totalVal: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  btn: {
    marginTop: spacing.lg,
  },
});
