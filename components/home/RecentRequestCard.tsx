import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Booking } from '@/types/booking';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { formatCurrency } from '@/utils/formatCurrency';

export interface RecentRequestCardProps {
  booking: Booking;
  onPress: (booking: Booking) => void;
}

export const RecentRequestCard: React.FC<RecentRequestCardProps> = ({ booking, onPress }) => {
  const isCompleted = booking.status === 'completed';

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(booking)} activeOpacity={0.8}>
      <View style={styles.topRow}>
        <View style={styles.statusBadge}>
          <View
            style={[
              styles.dot,
              { backgroundColor: isCompleted ? colors.success : colors.warning },
            ]}
          />
          <Text style={styles.statusText}>
            {booking.status === 'in_progress'
              ? 'In Progress'
              : booking.status === 'scheduled'
              ? 'Scheduled'
              : 'Completed'}
          </Text>
        </View>
        <Text style={styles.idText}>{booking.id}</Text>
      </View>
      <Text style={styles.serviceTitle}>{booking.serviceTitle}</Text>
      <View style={styles.infoRow}>
        <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
        <Text style={styles.infoText}>{booking.scheduledDate}</Text>
      </View>
      <View style={styles.footerRow}>
        <Text style={styles.amount}>{formatCurrency(booking.totalAmount)}</Text>
        <View style={styles.trackLink}>
          <Text style={styles.trackText}>Track Order</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.primary} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: spacing.radiusMd,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.divider,
    paddingVertical: 3,
    paddingHorizontal: spacing.xs + 4,
    borderRadius: spacing.radiusFull,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  statusText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
  },
  idText: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
  },
  serviceTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginTop: spacing.xs,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  infoText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm + 2,
    paddingTop: spacing.xs + 4,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  amount: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  trackLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trackText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
});

export default RecentRequestCard;
