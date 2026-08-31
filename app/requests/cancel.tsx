import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import Header from '@/components/common/Header';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';

import { bookingService } from '@/services/bookings';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export default function CancelRequestScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [selectedReason, setSelectedReason] = useState('Changed my mind');
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(false);

  const reasons = [
    'Changed my mind',
    'Booked another service provider',
    'Technician taking too long',
    'Price higher than expected',
    'Selected wrong date/time slot',
    'Other reason',
  ];

  const handleConfirmCancel = async () => {
    try {
      setLoading(true);
      const bookingId = id || 'ZEV-2026-98241';
      await bookingService.cancelBooking(bookingId, selectedReason);
      setLoading(false);

      Alert.alert(
        'Booking Cancelled',
        `Booking ${bookingId} has been cancelled. If any payment was processed, full refund will be credited to your original payment method within 24 hours.`,
        [
          {
            text: 'View My Bookings',
            onPress: () => router.replace('/(tabs)/requests' as any),
          },
        ]
      );
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Failed to cancel booking. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header title="Cancel Booking" />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Warning Banner */}
        <View style={styles.warningCard}>
          <Ionicons name="warning-outline" size={24} color={colors.danger} />
          <View style={styles.warningTextGroup}>
            <Text style={styles.warningTitle}>Cancellation Policy</Text>
            <Text style={styles.warningText}>
              Free cancellation available before technician arrival. 100% money back guarantee on pre-paid orders.
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Please select a reason for cancellation</Text>

        {reasons.map((r) => {
          const isSelected = selectedReason === r;
          return (
            <TouchableOpacity
              key={r}
              style={[styles.reasonItem, isSelected && styles.selectedReasonItem]}
              onPress={() => setSelectedReason(r)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                size={20}
                color={isSelected ? colors.primary : colors.textMuted}
              />
              <Text style={[styles.reasonText, isSelected && styles.selectedReasonText]}>{r}</Text>
            </TouchableOpacity>
          );
        })}

        <Input
          label="Additional Comments (Optional)"
          placeholder="Tell us how we can improve our service..."
          multiline
          value={comments}
          onChangeText={setComments}
          containerStyle={styles.inputBox}
        />

        <Button
          title="Confirm Cancellation"
          variant="danger"
          size="large"
          loading={loading}
          onPress={handleConfirmCancel}
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
    paddingBottom: spacing.xl,
  },
  warningCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dangerLight,
    padding: spacing.md,
    borderRadius: spacing.radiusMd,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  warningTextGroup: {
    flex: 1,
  },
  warningTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.danger,
  },
  warningText: {
    fontSize: typography.fontSize.xs,
    color: colors.danger,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: spacing.radiusMd,
    marginBottom: spacing.xs + 2,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  selectedReasonItem: {
    borderColor: colors.primary,
    backgroundColor: '#F4F8FF',
  },
  reasonText: {
    fontSize: typography.fontSize.sm,
    color: colors.text,
  },
  selectedReasonText: {
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  inputBox: {
    marginTop: spacing.sm,
  },
  btn: {
    marginTop: spacing.lg,
  },
});
