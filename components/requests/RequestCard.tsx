import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Booking } from '@/types/booking';
import { ServiceRequest } from '@/types/request';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { formatCurrency } from '@/utils/formatCurrency';

export interface RequestCardProps {
  booking?: Booking;
  request?: ServiceRequest;
  onPress: (item: any) => void;
}

export const RequestCard: React.FC<RequestCardProps> = ({ booking, request, onPress }) => {
  const item = booking || request;
  if (!item) return null;

  const isCompleted = item.status === 'completed';
  const isInProgress = item.status === 'in_progress' || (booking && booking.status === 'technician_assigned');
  const isCancelled = item.status === 'cancelled';
  const isScheduled = item.status === 'scheduled';
  const isQuoted = item.status === 'quoted';

  const getStatusConfig = () => {
    if (isCompleted) {
      return { label: 'Completed', bg: '#E8F8F0', text: '#0E9355' };
    }
    if (isInProgress) {
      return {
        label: booking && booking.status === 'technician_assigned' ? 'Tech Assigned' : 'In Progress',
        bg: '#EBF3FF',
        text: '#1E64E8',
      };
    }
    if (isCancelled) {
      return { label: 'Cancelled', bg: '#FEECEB', text: '#DF2C2C' };
    }
    if (isQuoted) {
      return { label: 'Quote Ready', bg: '#FEF3C7', text: '#B45309' };
    }
    return { label: 'Scheduled', bg: '#FFF4E5', text: '#D97706' };
  };

  const statusConfig = getStatusConfig();

  const getApplianceIcon = () => {
    const cat = (item.categoryName || (booking?.serviceTitle) || '').toLowerCase();
    if (cat.includes('ac') || cat.includes('air')) return 'snow-outline';
    if (cat.includes('wash')) return 'aperture-outline';
    if (cat.includes('fridge') || cat.includes('refrig')) return 'cube-outline';
    if (cat.includes('tv') || cat.includes('audio')) return 'tv-outline';
    if (cat.includes('water') || cat.includes('ro')) return 'water-outline';
    if (cat.includes('elect')) return 'flash-outline';
    return 'construct-outline';
  };

  const iconName = getApplianceIcon() as any;
  const displayTitle =
    item.productName ||
    (item.brandName ? `${item.brandName} Appliance` : (booking?.serviceTitle || `${item.categoryName} Service`));
  
  const issueText =
    request?.issueDescription ||
    booking?.selectedOption?.title ||
    booking?.serviceTitle ||
    'Appliance Diagnostic & Repair Service';

  const displayDate = booking?.scheduledDate || request?.preferredDate || 'Scheduled';
  const displayTime = booking?.scheduledTimeSlot || request?.preferredTime || '10:00 AM - 12:00 PM';
  const displayAmount = booking?.totalAmount || request?.estimatedQuote || 599;
  const bookingNumber = booking?.bookingNumber || item.id;

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(item)} activeOpacity={0.85}>
      {/* Top Section */}
      <View style={styles.topSection}>
        {/* Square Appliance Thumbnail */}
        <View style={styles.thumbnail}>
          <Ionicons name={iconName} size={28} color={colors.primary} />
        </View>

        {/* Title & Status Badge */}
        <View style={styles.mainInfo}>
          <View style={styles.headerRow}>
            <View style={styles.titleContainer}>
              <Text style={styles.title} numberOfLines={1}>
                {displayTitle}
              </Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
              <Text style={[styles.statusText, { color: statusConfig.text }]}>
                {statusConfig.label}
              </Text>
            </View>
          </View>

          {/* Issue Line */}
          <Text style={styles.issueText} numberOfLines={1}>
            <Text style={styles.issuePrefix}>Issue: </Text>
            {issueText}
          </Text>

          {/* Date & Time Row */}
          <View style={styles.dateTimeRow}>
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={13} color={colors.textSecondary} />
              <Text style={styles.metaText}>{displayDate}</Text>
            </View>
            <Text style={styles.metaDivider}>|</Text>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={13} color={colors.textSecondary} />
              <Text style={styles.metaText} numberOfLines={1}>
                {displayTime}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Bottom Divider */}
      <View style={styles.divider} />

      {/* Footer Row */}
      <View style={styles.footerRow}>
        <View style={styles.idGroup}>
          <Text style={styles.idLabel}>Booking ID:</Text>
          <Text style={styles.idValue}>{bookingNumber}</Text>
        </View>

        <View style={styles.priceGroup}>
          <View style={styles.priceColumn}>
            <Text style={styles.priceValue}>{formatCurrency(displayAmount)}</Text>
            <Text style={styles.paidBadge}>
              {booking?.paymentStatus === 'payment_paid'
                ? 'Paid'
                : booking?.paymentStatus === 'payment_failed'
                ? 'Payment Failed'
                : 'Pay on Service'}
            </Text>
          </View>
          <View style={styles.chevronBox}>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: spacing.radiusMd + 2,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm + 2,
    borderWidth: 1,
    borderColor: '#E7ECF3',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  topSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm + 2,
  },
  thumbnail: {
    width: 52,
    height: 52,
    borderRadius: spacing.radiusMd,
    backgroundColor: '#EEF4FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D8E5FE',
  },
  mainInfo: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.xs,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: typography.fontSize.sm + 1,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  statusBadge: {
    paddingVertical: 3,
    paddingHorizontal: spacing.xs + 4,
    borderRadius: spacing.radiusFull,
  },
  statusText: {
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
  },
  issueText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: 3,
  },
  issuePrefix: {
    color: colors.textMuted,
    fontWeight: typography.fontWeight.semibold,
  },
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs + 2,
    gap: spacing.xs,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  metaDivider: {
    fontSize: typography.fontSize.xs - 2,
    color: colors.border,
  },
  metaText: {
    fontSize: typography.fontSize.xs - 1,
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F4F9',
    marginTop: spacing.sm + 2,
    marginBottom: spacing.xs + 4,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  idGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  idLabel: {
    fontSize: typography.fontSize.xs - 1,
    color: colors.textMuted,
  },
  idValue: {
    fontSize: typography.fontSize.xs - 1,
    fontWeight: typography.fontWeight.bold,
    color: '#334155',
  },
  priceGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  priceColumn: {
    alignItems: 'flex-end',
  },
  priceValue: {
    fontSize: typography.fontSize.sm + 2,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  paidBadge: {
    fontSize: 9,
    color: colors.success,
    fontWeight: typography.fontWeight.bold,
    marginTop: 1,
  },
  chevronBox: {
    marginLeft: 2,
  },
});

export default RequestCard;
