import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import Header from '@/components/common/Header';
import Button from '@/components/common/Button';
import BookingStepper from '@/components/booking/BookingStepper';
import PaymentSummary from '@/components/booking/PaymentSummary';
import SectionHeader from '@/components/common/SectionHeader';

import useBooking from '@/hooks/useBooking';
import useAuth from '@/hooks/useAuth';
import { bookingService } from '@/services/bookings';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { PaymentMethod } from '@/types/user';

export default function PaymentScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { draft, resetBooking } = useBooking();
  const [loading, setLoading] = useState(false);
  const [simulateFailure, setSimulateFailure] = useState(false);

  const paymentOptions: PaymentMethod[] = [
    { id: 'p-1', type: 'upi', title: 'Google Pay / PhonePe (UPI)', details: 'Instant confirmation & 100% money back guarantee', isDefault: true },
    { id: 'p-2', type: 'card', title: 'Credit / Debit Card', details: 'Visa, MasterCard, RuPay accepted' },
    { id: 'p-3', type: 'cash', title: 'Pay After Service', details: 'Pay technician via Cash or UPI upon job completion' },
  ];

  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(
    draft.paymentMethod || paymentOptions[0]
  );

  const handleConfirm = async () => {
    if (!draft.selectedOption && !draft.serviceTitle) {
      Alert.alert('Incomplete Booking', 'Please select a service package first.');
      return;
    }

    if (!draft.scheduledDate || !draft.scheduledTimeSlot) {
      Alert.alert('Incomplete Schedule', 'Please select a service date and time slot.');
      return;
    }

    if (!draft.address) {
      Alert.alert('Missing Address', 'Please select a service location address.');
      return;
    }

    try {
      setLoading(true);

      const optionPrice = draft.selectedOption?.price || 599;
      const discount = 100;
      const taxable = Math.max(0, optionPrice - discount);
      const tax = Math.round(taxable * 0.18);
      const finalTotal = taxable + tax;

      // 1. Create booking on backend
      const created = await bookingService.createBooking({
        serviceId: draft.serviceId || 'ac-jet-service',
        serviceTitle: draft.serviceTitle || 'Appliance Care Service',
        selectedOption: draft.selectedOption || {
          id: 'opt-gen-1',
          title: draft.serviceTitle || 'Standard Care Package',
          description: 'Deep service and diagnostic tune-up',
          price: optionPrice,
          durationMinutes: 45,
          features: ['Certified technician inspection', '30-day warranty'],
        },
        categoryName: draft.categoryName || 'Appliance Care',
        brandName: draft.brandName,
        productName: draft.productName,
        scheduledDate: draft.scheduledDate,
        scheduledTimeSlot: draft.scheduledTimeSlot,
        address: draft.address,
        paymentMethod: selectedPayment,
        totalAmount: finalTotal,
      });

      // 2. Authoritative Simulated Payment Engine Processing
      const outcome = simulateFailure ? 'failed' : 'success';
      const paymentResult = await bookingService.processFakePayment(
        created.id,
        outcome,
        selectedPayment.type
      );

      setLoading(false);

      if (simulateFailure || !paymentResult.success) {
        Alert.alert(
          'Simulated Payment Failed',
          'Payment processing failed (Development Test Mode). You can switch the failure toggle off to test successful payment.',
          [{ text: 'OK' }]
        );
        return;
      }

      resetBooking();

      router.replace({
        pathname: '/services/booking-confirmed' as any,
        params: { id: created.id },
      });
    } catch (error: any) {
      setLoading(false);
      Alert.alert('Booking Error', error.message || 'Failed to process your booking.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header title="Payment & Review" />
      <BookingStepper currentStep={3} />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Simulated Dev Payment Notice */}
        <View style={styles.devNoticeCard}>
          <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
          <Text style={styles.devNoticeText}>
            Development Demo Mode: Payments are simulated. No real financial transaction will occur.
          </Text>
        </View>

        {/* Booking Summary Context Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Booking Summary</Text>

          <View style={styles.summaryRow}>
            <Ionicons name="construct-outline" size={18} color={colors.primary} />
            <View style={styles.summaryTextGroup}>
              <Text style={styles.summaryLabel}>Service & Model</Text>
              <Text style={styles.summaryValue}>
                {draft.serviceTitle || 'Appliance Service'}{' '}
                {draft.productName ? `(${draft.productName})` : ''}
              </Text>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <Ionicons name="calendar-outline" size={18} color={colors.primary} />
            <View style={styles.summaryTextGroup}>
              <Text style={styles.summaryLabel}>Schedule</Text>
              <Text style={styles.summaryValue}>
                {draft.scheduledDate || 'Today'}, {draft.scheduledTimeSlot || '10:00 AM'}
              </Text>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <Ionicons name="location-outline" size={18} color={colors.primary} />
            <View style={styles.summaryTextGroup}>
              <Text style={styles.summaryLabel}>Service Location</Text>
              <Text style={styles.summaryValue} numberOfLines={1}>
                {draft.address?.title ? `${draft.address.title}: ` : ''}
                {draft.address?.street || (user?.address ? `${user.address.street}, ${user.address.city}` : 'Add service address')}
              </Text>
            </View>
          </View>
        </View>

        {/* Pricing Summary */}
        <PaymentSummary
          itemTitle={draft.selectedOption?.title || draft.serviceTitle || 'Service Package'}
          itemPrice={draft.selectedOption?.price || 599}
          discount={100}
        />

        {/* Payment Methods */}
        <SectionHeader title="Select Payment Method" />
        {paymentOptions.map((pay) => {
          const isSelected = selectedPayment.id === pay.id;
          return (
            <TouchableOpacity
              key={pay.id}
              style={[styles.payCard, isSelected && styles.selectedPayCard]}
              onPress={() => setSelectedPayment(pay)}
              activeOpacity={0.8}
            >
              <View style={styles.payIconCircle}>
                <Ionicons
                  name={
                    pay.type === 'upi'
                      ? 'qr-code-outline'
                      : pay.type === 'card'
                      ? 'card-outline'
                      : 'cash-outline'
                  }
                  size={22}
                  color={colors.primary}
                />
              </View>
              <View style={styles.payDetails}>
                <Text style={styles.payTitle}>{pay.title}</Text>
                <Text style={styles.paySubtitle}>{pay.details}</Text>
              </View>
              <Ionicons
                name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                size={22}
                color={isSelected ? colors.primary : colors.textMuted}
              />
            </TouchableOpacity>
          );
        })}

        {/* Dev Payment Failure Simulation Toggle */}
        <View style={styles.testControlCard}>
          <View style={styles.testTextGroup}>
            <Text style={styles.testTitle}>Simulate Payment Failure (Dev Test)</Text>
            <Text style={styles.testSub}>Toggle to test payment failure response</Text>
          </View>
          <Switch
            value={simulateFailure}
            onValueChange={setSimulateFailure}
            trackColor={{ false: colors.border, true: colors.dangerLight }}
            thumbColor={simulateFailure ? colors.danger : '#f4f3f4'}
          />
        </View>

        <Button
          title={loading ? 'Processing Payment...' : 'Pay & Confirm Booking'}
          variant="primary"
          size="large"
          loading={loading}
          onPress={handleConfirm}
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
  devNoticeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    padding: spacing.sm,
    borderRadius: spacing.radiusMd,
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  devNoticeText: {
    fontSize: typography.fontSize.xs,
    color: colors.primary,
    fontWeight: typography.fontWeight.semibold,
    flex: 1,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: spacing.radiusMd,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xs,
    gap: spacing.sm,
  },
  summaryTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs - 2,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  summaryTextGroup: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: typography.fontSize.xs + 1,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginTop: 1,
  },
  payCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: spacing.radiusMd,
    marginBottom: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  selectedPayCard: {
    borderColor: colors.primary,
    backgroundColor: '#F4F8FF',
  },
  payIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  payDetails: {
    flex: 1,
  },
  payTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  paySubtitle: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  testControlCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    padding: spacing.sm + 2,
    borderRadius: spacing.radiusMd,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  testTextGroup: {
    flex: 1,
    marginRight: spacing.sm,
  },
  testTitle: {
    fontSize: typography.fontSize.xs + 1,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  testSub: {
    fontSize: typography.fontSize.xs - 1,
    color: colors.textSecondary,
    marginTop: 1,
  },
  btn: {
    marginTop: spacing.md,
  },
});
