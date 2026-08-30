import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { formatCurrency } from '@/utils/formatCurrency';

export interface PaymentSummaryProps {
  itemTitle: string;
  itemPrice: number;
  discount?: number;
  taxRate?: number;
}

export const PaymentSummary: React.FC<PaymentSummaryProps> = ({
  itemTitle,
  itemPrice,
  discount = 0,
  taxRate = 0.18,
}) => {
  const taxableAmount = Math.max(0, itemPrice - discount);
  const tax = Math.round(taxableAmount * taxRate);
  const total = taxableAmount + tax;

  return (
    <View style={styles.card}>
      <Text style={styles.heading}>Payment Summary</Text>
      <View style={styles.row}>
        <Text style={styles.label}>{itemTitle}</Text>
        <Text style={styles.val}>{formatCurrency(itemPrice)}</Text>
      </View>
      {discount > 0 && (
        <View style={styles.row}>
          <Text style={styles.discountLabel}>Plan Discount</Text>
          <Text style={styles.discountVal}>-{formatCurrency(discount)}</Text>
        </View>
      )}
      <View style={styles.row}>
        <Text style={styles.label}>Taxes & Fees (18% GST)</Text>
        <Text style={styles.val}>{formatCurrency(tax)}</Text>
      </View>
      <View style={[styles.row, styles.totalRow]}>
        <Text style={styles.totalLabel}>Total Payable</Text>
        <Text style={styles.totalVal}>{formatCurrency(total)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: spacing.radiusMd,
    borderWidth: 1,
    borderColor: colors.border,
    marginVertical: spacing.sm,
  },
  heading: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs + 2,
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
  discountLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.success,
  },
  discountVal: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.success,
  },
  totalRow: {
    marginTop: spacing.xs,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
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
});

export default PaymentSummary;
