import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '@/components/common/Header';
import TrackingMap from '@/components/tracking/TrackingMap';
import TechnicianCard from '@/components/tracking/TechnicianCard';
import BookingProgress from '@/components/tracking/BookingProgress';
import Button from '@/components/common/Button';

import bookings from '@/data/bookings';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export default function TrackingScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const booking = bookings.find((b) => b.id === id) || bookings[0];

  const handleCall = () => {
    Alert.alert('Calling Technician', `Dialing ${booking.technician?.name || 'Technician'} at ${booking.technician?.phone}...`);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header title={`Live Tracking ${booking.id}`} />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <TrackingMap eta="14 mins" distance="2.8 km away" />

        {booking.technician && (
          <TechnicianCard technician={booking.technician} onCall={handleCall} />
        )}

        <View style={styles.timelineBox}>
          <Text style={styles.sectionTitle}>Service Timeline</Text>
          {booking.steps && <BookingProgress steps={booking.steps} />}
        </View>

        <Button
          title="Cancel Booking"
          variant="outline"
          size="medium"
          onPress={() => router.push({ pathname: '/requests/cancel' as any, params: { id: booking.id } })}
          style={styles.cancelBtn}
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
  cancelBtn: {
    marginTop: spacing.md,
    borderColor: colors.danger,
  },
});
