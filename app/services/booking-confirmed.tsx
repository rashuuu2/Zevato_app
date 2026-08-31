import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Button from '@/components/common/Button';
import { bookingService } from '@/services/bookings';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { formatCurrency } from '@/utils/formatCurrency';
import { Booking } from '@/types/booking';

export default function BookingConfirmedScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [booking, setBooking] = useState<Booking | undefined>(undefined);

  useEffect(() => {
    const loadBooking = async () => {
      if (id) {
        const found = await bookingService.getBookingById(id);
        setBooking(found);
      }
    };
    loadBooking();
  }, [id]);

  const bookingId = id || booking?.id || 'ZEV-2026-98241';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.iconCircle}>
          <Ionicons name="checkmark-circle" size={88} color={colors.success} />
        </View>

        <Text style={styles.title}>Booking Confirmed!</Text>
        <Text style={styles.bookingId}>Booking ID: {bookingId}</Text>
        <Text style={styles.desc}>
          Your service request has been confirmed. Our certified technician will arrive during your preferred time slot.
        </Text>

        {booking && (
          <View style={styles.detailsCard}>
            <View style={styles.cardRow}>
              <Ionicons name="construct-outline" size={18} color={colors.primary} />
              <View style={styles.cardTextGroup}>
                <Text style={styles.cardLabel}>Service</Text>
                <Text style={styles.cardValue}>{booking.serviceTitle}</Text>
              </View>
            </View>

            <View style={styles.cardRow}>
              <Ionicons name="calendar-outline" size={18} color={colors.primary} />
              <View style={styles.cardTextGroup}>
                <Text style={styles.cardLabel}>Date & Time</Text>
                <Text style={styles.cardValue}>
                  {booking.scheduledDate} ({booking.scheduledTimeSlot})
                </Text>
              </View>
            </View>

            <View style={styles.cardRow}>
              <Ionicons name="location-outline" size={18} color={colors.primary} />
              <View style={styles.cardTextGroup}>
                <Text style={styles.cardLabel}>Location</Text>
                <Text style={styles.cardValue} numberOfLines={1}>
                  {booking.address.street}, {booking.address.city}
                </Text>
              </View>
            </View>

            <View style={styles.cardRow}>
              <Ionicons name="cash-outline" size={18} color={colors.primary} />
              <View style={styles.cardTextGroup}>
                <Text style={styles.cardLabel}>Total Paid</Text>
                <Text style={styles.cardValueHighlight}>
                  {formatCurrency(booking.totalAmount)}
                </Text>
              </View>
            </View>
          </View>
        )}

        <Button
          title="View Booking Details"
          variant="primary"
          size="large"
          onPress={() => router.replace({ pathname: '/bookings/[id]' as any, params: { id: bookingId } })}
          style={styles.btn}
        />

        <Button
          title="Back to Home"
          variant="ghost"
          size="medium"
          onPress={() => router.replace('/(tabs)/home' as any)}
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
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: typography.fontSize.heading,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  bookingId: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    marginTop: spacing.xs,
  },
  desc: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  detailsCard: {
    width: '100%',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: spacing.radiusMd,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  cardTextGroup: {
    flex: 1,
  },
  cardLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  cardValue: {
    fontSize: typography.fontSize.xs + 1,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginTop: 1,
  },
  cardValueHighlight: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    marginTop: 1,
  },
  btn: {
    width: '100%',
  },
  homeBtn: {
    marginTop: spacing.xs,
    width: '100%',
  },
});
