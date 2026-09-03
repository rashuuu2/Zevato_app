import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Booking } from '@/types/booking';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export interface RecentRequestCardProps {
  booking: Booking;
  onPress: (booking: Booking) => void;
}

/** Maps category names to Ionicon names for the card thumbnail. */
const getCategoryIcon = (categoryName?: string): string => {
  const name = (categoryName || '').toLowerCase();
  if (name.includes('tv') || name.includes('television') || name.includes('electron')) return 'tv-outline';
  if (name.includes('ac') || name.includes('air') || name.includes('applian')) return 'snow-outline';
  if (name.includes('washing') || name.includes('machine')) return 'aperture-outline';
  if (name.includes('refrigerator') || name.includes('fridge')) return 'cube-outline';
  if (name.includes('water') || name.includes('purifier') || name.includes('plumb')) return 'water-outline';
  if (name.includes('electric')) return 'flash-outline';
  if (name.includes('car')) return 'car-outline';
  if (name.includes('clean')) return 'sparkles-outline';
  if (name.includes('furniture')) return 'bed-outline';
  return 'construct-outline';
};

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'completed':
      return { label: 'Completed', bgColor: '#DCFCE7', textColor: '#16A34A' };
    case 'in_progress':
      return { label: 'In Progress', bgColor: '#DBEAFE', textColor: '#2563EB' };
    case 'scheduled':
      return { label: 'Scheduled', bgColor: '#FEF3C7', textColor: '#D97706' };
    case 'technician_assigned':
      return { label: 'Assigned', bgColor: '#DBEAFE', textColor: '#2563EB' };
    case 'cancelled':
      return { label: 'Cancelled', bgColor: '#FEE2E2', textColor: '#DC2626' };
    default:
      return { label: status, bgColor: '#F3F4F6', textColor: '#6B7280' };
  }
};

const formatBookingId = (id: string): string => {
  // Show as #REQ12345 format
  const short = id.replace(/-/g, '').slice(0, 5).toUpperCase();
  return `#REQ${short}`;
};

export const RecentRequestCard: React.FC<RecentRequestCardProps> = ({ booking, onPress }) => {
  const statusConfig = getStatusConfig(booking.status);
  const categoryIcon = getCategoryIcon(booking.categoryName);

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(booking)} activeOpacity={0.8}>
      {/* Left: Category icon thumbnail */}
      <View style={styles.iconBox}>
        <Ionicons name={categoryIcon as any} size={24} color={colors.textSecondary} />
      </View>

      {/* Center: Service details */}
      <View style={styles.details}>
        <Text style={styles.deviceName} numberOfLines={1}>
          {booking.productName || booking.serviceTitle}
        </Text>
        <Text style={styles.issueText} numberOfLines={1}>
          {booking.selectedOption?.title || booking.serviceTitle}
        </Text>
        <View style={styles.metaRow}>
          <Ionicons name="calendar-outline" size={12} color={colors.textMuted} />
          <Text style={styles.metaText}>
            {booking.scheduledDate}  •  {formatBookingId(booking.id)}
          </Text>
        </View>
      </View>

      {/* Right: Status pill + chevron */}
      <View style={styles.rightSection}>
        <View style={[styles.statusPill, { backgroundColor: statusConfig.bgColor }]}>
          <Text style={[styles.statusLabel, { color: statusConfig.textColor }]}>
            {statusConfig.label}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} style={styles.chevron} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: spacing.radiusMd,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: spacing.radiusMd,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm + 4,
  },
  details: {
    flex: 1,
    marginRight: spacing.sm,
  },
  deviceName: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  issueText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  metaText: {
    fontSize: typography.fontSize.xs - 1,
    color: colors.textMuted,
  },
  rightSection: {
    alignItems: 'flex-end',
    gap: 6,
  },
  statusPill: {
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: spacing.radiusFull,
  },
  statusLabel: {
    fontSize: typography.fontSize.xs - 1,
    fontWeight: typography.fontWeight.semibold,
  },
  chevron: {
    marginTop: 2,
  },
});

export default RecentRequestCard;
