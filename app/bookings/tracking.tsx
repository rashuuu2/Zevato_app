import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import Header from '@/components/common/Header';
import TrackingMap from '@/components/tracking/TrackingMap';
import TechnicianCard from '@/components/tracking/TechnicianCard';
import BookingProgress from '@/components/tracking/BookingProgress';
import Button from '@/components/common/Button';
import EmptyState from '@/components/common/EmptyState';

import { bookingService } from '@/services/bookings';
import bookings from '@/data/bookings';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { BookingStatus } from '@/types/booking';

export default function TrackingScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [booking, setBooking] = useState(
    bookings.find((b) => b.id === id) || bookings[0]
  );

  if (!booking) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <Header title="Live Tracking" />
        <EmptyState
          icon="navigate-outline"
          title="Tracking Unavailable"
          description="We couldn't find an active tracking session for this booking."
          actionTitle="Back to My Bookings"
          onAction={() => router.replace('/(tabs)/requests' as any)}
        />
      </SafeAreaView>
    );
  }

  const handleCall = () => {
    Alert.alert('Calling Technician', `Dialing ${booking.technician?.name || 'Technician'} at ${booking.technician?.phone}...`);
  };

  // Mock status advancement for demo testing
  const handleSimulateStatusNext = async () => {
    let nextStatus: BookingStatus = 'in_progress';
    if (booking.status === 'scheduled' || booking.status === 'technician_assigned') {
      nextStatus = 'in_progress';
    } else if (booking.status === 'in_progress') {
      nextStatus = 'completed';
    }

    const updated = await bookingService.updateBookingStatus(booking.id, nextStatus);
    if (updated) {
      setBooking({ ...updated });
      if (nextStatus === 'completed') {
        Alert.alert('Service Completed', 'Technician has completed the service! Redirecting to Service Report...', [
          {
            text: 'View Report',
            onPress: () => router.replace({ pathname: '/bookings/completed' as any, params: { id: booking.id } }),
          },
        ]);
      }
    }
  };

  const isCompleted = booking.status === 'completed';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header title={`Live Tracking ${booking.id}`} />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Tracking Map Component */}
        <TrackingMap eta="14 mins" distance="2.8 km away" />

        {/* Technician Info */}
        {booking.technician && (
          <TechnicianCard technician={booking.technician} onCall={handleCall} />
        )}

        {/* Service Progress Timeline */}
        <View style={styles.timelineBox}>
          <Text style={styles.sectionTitle}>Service Timeline</Text>
          {booking.steps && <BookingProgress steps={booking.steps} />}
        </View>

        {/* Demo Simulation Controls */}
        <View style={styles.demoControlBox}>
          <Text style={styles.demoControlTitle}>Service Progress Controls</Text>
          <TouchableOpacity
            style={styles.demoBtn}
            onPress={handleSimulateStatusNext}
            activeOpacity={0.8}
          >
            <Ionicons name="play-circle-outline" size={18} color={colors.primary} />
            <Text style={styles.demoBtnText}>
              {booking.status === 'completed'
                ? 'Service Already Completed'
                : booking.status === 'in_progress'
                ? 'Simulate Finish Service'
                : 'Simulate Start Service'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Navigation Action Buttons */}
        {isCompleted ? (
          <Button
            title="View Service Report & Invoice"
            variant="primary"
            size="large"
            onPress={() => router.push({ pathname: '/bookings/completed' as any, params: { id: booking.id } })}
            style={styles.actionBtn}
          />
        ) : (
          <Button
            title="Cancel Booking"
            variant="outline"
            size="medium"
            onPress={() => router.push({ pathname: '/requests/cancel' as any, params: { id: booking.id } })}
            style={styles.cancelBtn}
          />
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
  timelineBox: {
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
  demoControlBox: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: spacing.radiusMd,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    marginVertical: spacing.xs,
  },
  demoControlTitle: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  demoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  demoBtnText: {
    fontSize: typography.fontSize.xs + 1,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  actionBtn: {
    marginTop: spacing.md,
  },
  cancelBtn: {
    marginTop: spacing.md,
    borderColor: colors.danger,
  },
});
