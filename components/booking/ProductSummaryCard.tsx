import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Booking } from '@/types/booking';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { formatCurrency } from '@/utils/formatCurrency';

export interface ProductSummaryCardProps {
  booking: Booking;
  isCompleted?: boolean;
  onViewDetails?: () => void;
  onViewInvoice?: () => void;
  showAddress?: boolean;
}

export const ProductSummaryCard: React.FC<ProductSummaryCardProps> = ({
  booking,
  isCompleted = false,
  onViewDetails,
  onViewInvoice,
  showAddress = true,
}) => {
  const getApplianceIcon = () => {
    const cat = (booking.categoryName || booking.serviceTitle || '').toLowerCase();
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
    booking.productName ||
    (booking.brandName ? `${booking.brandName} Appliance` : booking.serviceTitle);
  const issueText =
    booking.selectedOption?.title ||
    booking.serviceTitle ||
    'Standard Appliance Diagnostic & Repair';
  const price = booking.totalAmount || 499;

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        {/* Square Thumbnail */}
        <View style={styles.thumbnail}>
          <Ionicons name={iconName} size={28} color={colors.primary} />
        </View>

        {/* Title and Issue Details */}
        <View style={styles.titleCol}>
          <Text style={styles.productName} numberOfLines={2}>
            {displayTitle}
          </Text>
          <View style={styles.issueRow}>
            <Ionicons name="alert-circle-outline" size={13} color={colors.warning} />
            <Text style={styles.issueText} numberOfLines={1}>
              Issue: {issueText}
            </Text>
          </View>
        </View>

        {/* Price & Link */}
        <View style={styles.priceCol}>
          <Text style={styles.priceLabel}>
            {isCompleted ? 'Total Paid' : 'Estimated Charges'}
          </Text>
          <Text style={styles.priceValue}>{formatCurrency(price)}</Text>
          {isCompleted && onViewInvoice ? (
            <TouchableOpacity style={styles.linkRow} onPress={onViewInvoice} activeOpacity={0.7}>
              <Text style={styles.linkText}>View Invoice</Text>
              <Ionicons name="chevron-forward" size={12} color={colors.primary} />
            </TouchableOpacity>
          ) : onViewDetails ? (
            <TouchableOpacity style={styles.linkRow} onPress={onViewDetails} activeOpacity={0.7}>
              <Text style={styles.linkText}>View Details</Text>
              <Ionicons name="chevron-forward" size={12} color={colors.primary} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <View style={styles.divider} />

      {/* Date & Time Row */}
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.metaText}>{booking.scheduledDate || 'Tomorrow'}</Text>
        </View>
        <Text style={styles.metaDivider}>•</Text>
        <View style={styles.metaItem}>
          <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.metaText}>{booking.scheduledTimeSlot || '10:00 AM - 12:00 PM'}</Text>
        </View>
      </View>

      {/* Address Row (if shown) */}
      {showAddress && booking.address ? (
        <View style={styles.addressRow}>
          <Ionicons name="home-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.addressText} numberOfLines={1}>
            {booking.address.title}: {booking.address.street}, {booking.address.city}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: spacing.radiusMd + 2,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: '#E7ECF3',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  thumbnail: {
    width: 48,
    height: 48,
    borderRadius: spacing.radiusMd,
    backgroundColor: '#EEF4FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D8E5FE',
  },
  titleCol: {
    flex: 1,
  },
  productName: {
    fontSize: typography.fontSize.sm + 1,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  issueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  issueText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    flex: 1,
  },
  priceCol: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: 10,
    color: colors.textMuted,
  },
  priceValue: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginTop: 1,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 2,
  },
  linkText: {
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F4F9',
    marginVertical: spacing.xs + 3,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaDivider: {
    color: colors.border,
    fontSize: typography.fontSize.xs,
  },
  metaText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 6,
  },
  addressText: {
    fontSize: typography.fontSize.xs - 1,
    color: colors.textSecondary,
    flex: 1,
  },
});

export default ProductSummaryCard;
