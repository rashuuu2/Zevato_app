import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import Header from '@/components/common/Header';
import TrackingMap from '@/components/tracking/TrackingMap';
import TechnicianCard from '@/components/tracking/TechnicianCard';
import BookingProgress from '@/components/tracking/BookingProgress';
import Button from '@/components/common/Button';
import EmptyState from '@/components/common/EmptyState';

import useAuth from '@/hooks/useAuth';
import { bookingService } from '@/services/bookings';
import { initSocketClient } from '@/services/socket';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { Booking, BookingStatus } from '@/types/booking';

export default function TrackingScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { userId } = useAuth();

  const [booking, setBooking] = useState<Booking | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [eta, setEta] = useState('12 mins');
  const [distance, setDistance] = useState('2.4 km away');

  useEffect(() => {
    const fetchBooking = async () => {
      if (id) {
        const found = await bookingService.getBookingById(id);
        setBooking(found);
      }
      setLoading(false);
    };

    fetchBooking();

    // Connect to WebSocket server for real-time tracking updates
    if (userId && id) {
      const activeUserId = userId;
      const bookingIdParam = id;
      const socket = initSocketClient(activeUserId);

      const handleStatusUpdate = async (data: any) => {
        if (data.bookingId === bookingIdParam) {
          const reloaded = await bookingService.getBookingById(bookingIdParam);
          if (reloaded) setBooking(reloaded);
        }
      };

      const handleLocationUpdate = (data: any) => {
        if (data.bookingId === bookingIdParam) {
          setEta('8 mins');
          setDistance('1.2 km away');
          setBooking((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              technician: prev.technician
                ? {
                    ...prev.technician,
                    latitude: data.currentLat,
                    longitude: data.currentLng,
                  }
                : undefined,
            };
          });
        }
      };

      socket.on('booking:status_updated', handleStatusUpdate);
      socket.on('technician:location_updated', handleLocationUpdate);

      return () => {
        socket.off('booking:status_updated', handleStatusUpdate);
        socket.off('technician:location_updated', handleLocationUpdate);
      };
    }
  }, [id, userId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <Header title="Live Tracking" />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!booking) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <Header title="Live Tracking" />
        <EmptyState
          icon="navigate-outline"
          title="Tracking Unavailable"
          description="We couldn't find an active tracking session for this booking."
          actionTitle="Back to My Bookings"
          onAction={() => router.replace('/requests' as any)}
        />
      </SafeAreaView>
    );
  }

  const handleCall = () => {
    Alert.alert('Calling Technician', `Dialing ${booking.technician?.name || 'Technician'} at ${booking.technician?.phone}...`);
  };

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
        Alert.alert('Service Completed 🎉', 'Technician has completed the service! View your service report & invoice now.', [
          {
            text: 'View Service Report',
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
        <TrackingMap eta={eta} distance={distance} />

        {/* Technician Info */}
        {booking.technician && (
          <TechnicianCard technician={booking.technician} onCall={handleCall} />
        )}

        {/* Service Progress Timeline */}
        <View style={styles.timelineBox}>
          <Text style={styles.sectionTitle}>Service Timeline</Text>
          {booking.steps && <BookingProgress steps={booking.steps} />}
        </View>

        {/* Development Progress Controls */}
        <View style={styles.demoControlBox}>
          <Text style={styles.demoControlTitle}>Development Service Simulation</Text>
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
                ? 'Simulate Service Completion'
                : 'Simulate Service Execution'}
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
