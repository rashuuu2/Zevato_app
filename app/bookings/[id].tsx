import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '@/components/common/Header';
import Button from '@/components/common/Button';
import BookingProgress from '@/components/tracking/BookingProgress';
import TechnicianCard from '@/components/tracking/TechnicianCard';

import bookings from '@/data/bookings';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { formatCurrency } from '@/utils/formatCurrency';

export default function BookingDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const booking = bookings.find((b) => b.id === id) || bookings[0];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header title={`Booking ${booking.id}`} />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.serviceTitle}>{booking.serviceTitle}</Text>
          <Text style={styles.date}>Scheduled: {booking.scheduledDate} ({booking.scheduledTimeSlot})</Text>
          <Text style={styles.price}>Total: {formatCurrency(booking.totalAmount)}</Text>
        </View>

        {booking.technician && (
          <TechnicianCard technician={booking.technician} onCall={() => {}} />
        )}

        {booking.steps && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Status Timeline</Text>
            <BookingProgress steps={booking.steps} />
          </View>
        )}

        <Button
          title="Track Live Technician Location"
          variant="primary"
          size="large"
          onPress={() => router.push({ pathname: '/bookings/tracking' as any, params: { id: booking.id } })}
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
  card: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: spacing.radiusMd,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  serviceTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  date: {
    fontSize: typography.fontSize.xs + 1,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  price: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    marginTop: spacing.xs,
  },
  section: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: spacing.radiusMd,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  btn: {
    marginTop: spacing.lg,
  },
});
