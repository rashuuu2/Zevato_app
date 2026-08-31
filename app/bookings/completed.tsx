import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import Header from '@/components/common/Header';
import Button from '@/components/common/Button';
import ServiceReport from '@/components/tracking/ServiceReport';
import TechnicianCard from '@/components/tracking/TechnicianCard';

import bookings from '@/data/bookings';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { formatCurrency } from '@/utils/formatCurrency';

export default function CompletedBookingScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const booking = bookings.find((b) => b.id === id) || bookings[1] || bookings[0];

  const checklist = [
    { task: 'Multi-point safety & electrical voltage check', done: true },
    { task: 'High pressure foam jet wash & coil descaling', done: true },
    { task: 'Drain line unclogging & airflow verification', done: true },
    { task: 'Post-service temperature test & gas pressure check passed', done: true },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header title="Completed Service" />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Success Header Banner */}
        <View style={styles.badgeRow}>
          <Ionicons name="checkmark-circle" size={28} color={colors.success} />
          <View style={styles.badgeTextGroup}>
            <Text style={styles.statusText}>Service Completed & Verified</Text>
            <Text style={styles.bookingSubText}>Booking ID: {booking.id}</Text>
          </View>
        </View>

        {/* Service Summary Meta */}
        <View style={styles.card}>
          <Text style={styles.serviceTitle}>{booking.serviceTitle}</Text>
          <Text style={styles.dateText}>Completed on: {booking.scheduledDate}</Text>
          <Text style={styles.amountText}>Total Paid: {formatCurrency(booking.totalAmount)}</Text>
        </View>

        {/* Technician Info */}
        {booking.technician && (
          <TechnicianCard technician={booking.technician} />
        )}

        {/* Service Report Component */}
        <ServiceReport
          summary={`Full multi-point ${booking.serviceTitle} completed by certified technician. Operating at optimal performance levels.`}
          checklist={checklist}
          remarks="Refrigerant pressure tested at 135 PSI. Filter pads cleared and sanitized. 30-day service warranty active."
        />

        {/* Actions */}
        <Button
          title="View & Download Tax Invoice"
          variant="primary"
          size="large"
          onPress={() => router.push({ pathname: '/bookings/invoice' as any, params: { id: booking.id } })}
          style={styles.btn}
        />

        <Button
          title="Back to My Bookings"
          variant="ghost"
          size="medium"
          onPress={() => router.replace('/(tabs)/requests' as any)}
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
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successLight,
    padding: spacing.md,
    borderRadius: spacing.radiusMd,
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  badgeTextGroup: {
    flex: 1,
  },
  statusText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.success,
  },
  bookingSubText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  card: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: spacing.radiusMd,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xs,
    gap: 4,
  },
  serviceTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  dateText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  amountText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    marginTop: 2,
  },
  btn: {
    marginTop: spacing.md,
  },
  homeBtn: {
    marginTop: spacing.xs,
  },
});
