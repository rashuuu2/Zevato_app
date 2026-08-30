import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export interface AccountStatsProps {
  activeBookingsCount?: number;
  totalServicesCount?: number;
  savedAmount?: number;
}

export const AccountStats: React.FC<AccountStatsProps> = ({
  activeBookingsCount = 1,
  totalServicesCount = 12,
  savedAmount = 1450,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.statBox}>
        <Text style={styles.statNumber}>{activeBookingsCount}</Text>
        <Text style={styles.statLabel}>Active Orders</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.statBox}>
        <Text style={styles.statNumber}>{totalServicesCount}</Text>
        <Text style={styles.statLabel}>Services Done</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.statBox}>
        <Text style={styles.statNumber}>₹{savedAmount}</Text>
        <Text style={styles.statLabel}>Plan Savings</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    paddingVertical: spacing.md,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    borderRadius: spacing.radiusMd,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  statLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    width: 1,
    backgroundColor: colors.border,
  },
});

export default AccountStats;
