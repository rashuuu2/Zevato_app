import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/components/common/Header';
import Button from '@/components/common/Button';
import BookingStepper from '@/components/booking/BookingStepper';

import { bookingService } from '@/services/bookings';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { formatCurrency } from '@/utils/formatCurrency';
import { Booking } from '@/types/booking';

export default function BookingConfirmedScreen() {
  const router = useRouter();
  const { id: bookingId } = useLocalSearchParams<{ id?: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    if (bookingId) {
      bookingService.getBookingById(bookingId).then((b) => {
        if (b) setBooking(b);
      });
    }
  }, [bookingId]);

  const handleCopyId = () => {
    const idToCopy = booking?.bookingNumber || booking?.id || bookingId || '';
    Alert.alert('Booking ID', idToCopy);
  };

  const displayId = booking?.bookingNumber || booking?.id || bookingId || 'ZEV-PENDING';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header title="Booking Confirmed" />
      <BookingStepper currentStep={7} steps={['Category', 'Brand', 'Model', 'Issue', 'Schedule', 'Confirm']} />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Success Icon */}
        <View style={styles.successCircle}>
          <Ionicons name="checkmark-circle" size={80} color={colors.success} />
        </View>
        <Text style={styles.successTitle}>Booking Confirmed!</Text>
        <Text style={styles.successSub}>
          Your service booking has been successfully placed. A technician will be assigned shortly.
        </Text>

        {/* Booking ID Badge */}
        <TouchableOpacity style={styles.idBadge} onPress={handleCopyId} activeOpacity={0.7}>
          <Text style={styles.idLabel}>Booking ID</Text>
          <View style={styles.idRow}>
            <Text style={styles.idValue}>{displayId}</Text>
            <Ionicons name="copy-outline" size={16} color={colors.primary} />
          </View>
        </TouchableOpacity>

        {/* 4-Box Summary */}
        {booking && (
          <View style={styles.summaryGrid}>
            <View style={styles.summaryBox}>
              <Ionicons name="calendar-outline" size={20} color={colors.primary} />
              <Text style={styles.boxLabel}>Date</Text>
              <Text style={styles.boxValue}>{booking.scheduledDate}</Text>
            </View>
            <View style={styles.summaryBox}>
              <Ionicons name="time-outline" size={20} color={colors.primary} />
              <Text style={styles.boxLabel}>Time</Text>
              <Text style={styles.boxValue}>{booking.scheduledTimeSlot}</Text>
            </View>
            <View style={styles.summaryBox}>
              <Ionicons name="location-outline" size={20} color={colors.primary} />
              <Text style={styles.boxLabel}>Location</Text>
              <Text style={styles.boxValue} numberOfLines={2}>
                {booking.address?.street ? `${booking.address.street}` : 'Service Address'}
              </Text>
            </View>
            <View style={styles.summaryBox}>
              <Ionicons name="wallet-outline" size={20} color={colors.primary} />
              <Text style={styles.boxLabel}>Charges</Text>
              <Text style={styles.boxValue}>{formatCurrency(booking.totalAmount || 0)}</Text>
            </View>
          </View>
        )}

        {/* What Happens Next */}
        <View style={styles.nextCard}>
          <Text style={styles.nextTitle}>What Happens Next?</Text>
          <View style={styles.timelineItem}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.timelineTextGroup}>
              <Text style={styles.timelineLabel}>Booking Confirmed</Text>
              <Text style={styles.timelineSub}>Your request is being processed</Text>
            </View>
          </View>
          <View style={styles.timelineLine} />
          <View style={styles.timelineItem}>
            <View style={styles.dot} />
            <View style={styles.timelineTextGroup}>
              <Text style={styles.timelineLabel}>Technician Assigned</Text>
              <Text style={styles.timelineSub}>A certified expert will be assigned within 1 hour</Text>
            </View>
          </View>
          <View style={styles.timelineLine} />
          <View style={styles.timelineItem}>
            <View style={styles.dot} />
            <View style={styles.timelineTextGroup}>
              <Text style={styles.timelineLabel}>Technician En Route</Text>
              <Text style={styles.timelineSub}>Track live location on the day of service</Text>
            </View>
          </View>
          <View style={styles.timelineLine} />
          <View style={styles.timelineItem}>
            <View style={styles.dot} />
            <View style={styles.timelineTextGroup}>
              <Text style={styles.timelineLabel}>Service Completed</Text>
              <Text style={styles.timelineSub}>Receive invoice & rate the technician</Text>
            </View>
          </View>
        </View>

        {/* Membership Promo */}
        <View style={styles.promoBanner}>
          <View style={styles.promoTextGroup}>
            <Text style={styles.promoTitle}>Zevota Care Membership</Text>
            <Text style={styles.promoSub}>Unlimited labor warranty & priority scheduling for all your appliances</Text>
          </View>
          <Ionicons name="star" size={28} color={colors.warning} />
        </View>

        {/* Action Buttons */}
        <Button
          title="Track My Booking"
          variant="primary"
          size="large"
          onPress={() => router.replace({ pathname: '/bookings/[id]' as any, params: { id: booking?.id || bookingId } })}
          style={styles.btn}
        />
        <Button
          title="Back to Home"
          variant="ghost"
          size="medium"
          onPress={() => router.replace('/home' as any)}
          style={styles.homeBtn}
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
    paddingBottom: spacing.xl,
    alignItems: 'center',
  },
  successCircle: {
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  successTitle: {
    fontSize: typography.fontSize.heading,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    textAlign: 'center',
  },
  successSub: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.md,
    lineHeight: 20,
    maxWidth: 280,
  },
  idBadge: {
    backgroundColor: colors.primaryLight,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: spacing.radiusMd,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  idLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.primary,
    marginBottom: 2,
  },
  idRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  idValue: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    letterSpacing: 0.5,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    width: '100%',
    marginBottom: spacing.md,
  },
  summaryBox: {
    width: '47%',
    backgroundColor: colors.surface,
    padding: spacing.sm + 2,
    borderRadius: spacing.radiusMd,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    gap: 2,
  },
  boxLabel: {
    fontSize: typography.fontSize.xs - 1,
    color: colors.textSecondary,
  },
  boxValue: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    textAlign: 'center',
  },
  nextCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: spacing.radiusMd,
    borderWidth: 1,
    borderColor: colors.border,
    width: '100%',
    marginBottom: spacing.md,
  },
  nextTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.divider,
    marginTop: 3,
  },
  dotActive: {
    backgroundColor: colors.success,
  },
  timelineTextGroup: {
    flex: 1,
  },
  timelineLabel: {
    fontSize: typography.fontSize.xs + 1,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  timelineSub: {
    fontSize: typography.fontSize.xs - 1,
    color: colors.textSecondary,
    marginTop: 1,
  },
  timelineLine: {
    width: 2,
    height: 16,
    backgroundColor: colors.divider,
    marginLeft: 5,
  },
  promoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    padding: spacing.md,
    borderRadius: spacing.radiusMd,
    borderWidth: 1,
    borderColor: '#FFE082',
    width: '100%',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  promoTextGroup: {
    flex: 1,
  },
  promoTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  promoSub: {
    fontSize: typography.fontSize.xs - 1,
    color: colors.textSecondary,
    marginTop: 2,
  },
  btn: {
    width: '100%',
  },
  homeBtn: {
    width: '100%',
    marginTop: spacing.xs,
  },
});
