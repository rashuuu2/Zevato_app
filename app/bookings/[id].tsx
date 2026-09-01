import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import Header from '@/components/common/Header';
import Button from '@/components/common/Button';
import BookingProgress from '@/components/tracking/BookingProgress';
import TechnicianCard from '@/components/tracking/TechnicianCard';
import PaymentSummary from '@/components/booking/PaymentSummary';
import EmptyState from '@/components/common/EmptyState';

import { bookingService } from '@/services/bookings';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { formatCurrency } from '@/utils/formatCurrency';
import { Booking } from '@/types/booking';

export default function BookingDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [booking, setBooking] = useState<Booking | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      if (id) {
        const found = await bookingService.getBookingById(id);
        setBooking(found);
      }
      setLoading(false);
    };
    fetchBooking();
  }, [id]);

  if (!loading && !booking) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <Header title="Booking Details" />
        <EmptyState
          icon="alert-circle-outline"
          title="Booking Not Found"
          description={`We couldn't find a booking record for ID "${id}".`}
          actionTitle="Back to My Bookings"
          onAction={() => router.replace('/requests' as any)}
        />
      </SafeAreaView>
    );
  }

  const isCompleted = booking?.status === 'completed';
  const isCancelled = booking?.status === 'cancelled';
  const isActive = !isCompleted && !isCancelled;

  const handleCallTechnician = () => {
    Alert.alert('Calling Technician', `Dialing ${booking?.technician?.name || 'Technician'} at ${booking?.technician?.phone}...`);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header title={`Booking ${booking?.id || ''}`} />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Status Badge Banner */}
        <View style={styles.statusHeaderRow}>
          <View
            style={[
              styles.statusBadge,
              isCompleted && styles.completedBadge,
              isCancelled && styles.cancelledBadge,
            ]}
          >
            <Ionicons
              name={
                isCompleted
                  ? 'checkmark-circle'
                  : isCancelled
                  ? 'close-circle'
                  : 'time'
              }
              size={18}
              color={
                isCompleted
                  ? colors.success
                  : isCancelled
                  ? colors.danger
                  : colors.primary
              }
            />
            <Text
              style={[
                styles.statusText,
                isCompleted && styles.completedText,
                isCancelled && styles.cancelledText,
              ]}
            >
              {isCompleted
                ? 'SERVICE COMPLETED'
                : isCancelled
                ? 'BOOKING CANCELLED'
                : 'SERVICE SCHEDULED & ACTIVE'}
            </Text>
          </View>
        </View>

        {/* Service Summary Card */}
        <View style={styles.card}>
          <Text style={styles.serviceTitle}>{booking?.serviceTitle}</Text>
          {booking?.selectedOption && (
            <Text style={styles.optionTitle}>{booking.selectedOption.title}</Text>
          )}

          <View style={styles.metaRow}>
            <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.metaText}>
              {booking?.scheduledDate} ({booking?.scheduledTimeSlot})
            </Text>
          </View>

          <View style={styles.metaRow}>
            <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.metaText} numberOfLines={2}>
              {booking?.address?.street}, {booking?.address?.city}
            </Text>
          </View>
        </View>

        {/* Technician Card */}
        {booking?.technician && !isCancelled && (
          <TechnicianCard technician={booking.technician} onCall={handleCallTechnician} />
        )}

        {/* Progress Timeline */}
        {booking?.steps && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Status Timeline</Text>
            <BookingProgress steps={booking.steps} />
          </View>
        )}

        {/* Payment Summary */}
        {booking?.selectedOption && (
          <PaymentSummary
            itemTitle={booking.selectedOption.title}
            itemPrice={booking.selectedOption.price}
            discount={100}
          />
        )}

        {/* Dynamic Action Buttons */}
        {isActive && (
          <View style={styles.actionsGroup}>
            <Button
              title="Track Live Technician & Status"
              variant="primary"
              size="large"
              onPress={() => router.push({ pathname: '/bookings/tracking' as any, params: { id: booking?.id } })}
              style={styles.btn}
            />
            <Button
              title="Cancel Booking"
              variant="outline"
              size="medium"
              onPress={() => router.push({ pathname: '/requests/cancel' as any, params: { id: booking?.id } })}
              style={styles.cancelBtn}
            />
          </View>
        )}

        {isCompleted && (
          <View style={styles.actionsGroup}>
            <Button
              title="View Service Report"
              variant="primary"
              size="large"
              onPress={() => router.push({ pathname: '/bookings/completed' as any, params: { id: booking?.id } })}
              style={styles.btn}
            />
            <Button
              title="Download Tax Invoice"
              variant="outline"
              size="medium"
              onPress={() => router.push({ pathname: '/bookings/invoice' as any, params: { id: booking?.id } })}
              style={styles.invoiceBtn}
            />
          </View>
        )}

        {isCancelled && (
          <View style={styles.cancelledBox}>
            <Text style={styles.cancelledTitle}>This booking was cancelled</Text>
            <Text style={styles.cancelledSub}>
              If any payment was debited, a full refund will be processed within 24 hours.
            </Text>
          </View>
        )}
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
  },
  statusHeaderRow: {
    marginBottom: spacing.sm,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.radiusMd,
    gap: spacing.xs,
  },
  completedBadge: {
    backgroundColor: colors.successLight,
  },
  cancelledBadge: {
    backgroundColor: colors.dangerLight,
  },
  statusText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    letterSpacing: 0.5,
  },
  completedText: {
    color: colors.success,
  },
  cancelledText: {
    color: colors.danger,
  },
  card: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: spacing.radiusMd,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
    gap: 4,
  },
  serviceTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  optionTitle: {
    fontSize: typography.fontSize.xs + 1,
    color: colors.primary,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: 2,
  },
  metaText: {
    fontSize: typography.fontSize.xs + 1,
    color: colors.textSecondary,
    flex: 1,
  },
  section: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: spacing.radiusMd,
    borderWidth: 1,
    borderColor: colors.border,
    marginVertical: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  actionsGroup: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  btn: {
    width: '100%',
  },
  cancelBtn: {
    borderColor: colors.danger,
  },
  invoiceBtn: {
    borderColor: colors.primary,
  },
  cancelledBox: {
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: spacing.radiusMd,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  cancelledTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.danger,
  },
  cancelledSub: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
});
