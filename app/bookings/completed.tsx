import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import Header from '@/components/common/Header';
import Button from '@/components/common/Button';
import ServiceReport from '@/components/tracking/ServiceReport';

import bookings from '@/data/bookings';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export default function CompletedBookingScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const booking = bookings.find((b) => b.id === id) || bookings[1];

  const checklist = [
    { task: 'Multi-point safety & vibration check', done: true },
    { task: 'High pressure foam jet wash', done: true },
    { task: 'Cooling coil & drain line flush', done: true },
    { task: 'Post-service temperature test passed', done: true },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header title="Completed Service" />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.badgeRow}>
          <Ionicons name="checkmark-circle" size={24} color={colors.success} />
          <Text style={styles.statusText}>Service Completed & Verified</Text>
        </View>

        <ServiceReport
          summary="Full power jet cleaning performed on indoor and outdoor units. Operating at optimal efficiency."
          checklist={checklist}
          remarks="Gas pressure verified at 135 PSI. Filter pads cleared."
        />

        <Button
          title="Download Tax Invoice"
          variant="primary"
          size="large"
          onPress={() => router.push({ pathname: '/bookings/invoice' as any, params: { id: booking.id } })}
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
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successLight,
    padding: spacing.md,
    borderRadius: spacing.radiusMd,
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  statusText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.success,
  },
  btn: {
    marginTop: spacing.lg,
  },
});
