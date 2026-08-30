import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '@/components/common/Header';
import Button from '@/components/common/Button';
import BookingStepper from '@/components/booking/BookingStepper';
import PaymentSummary from '@/components/booking/PaymentSummary';
import ProfileMenuItem from '@/components/profile/ProfileMenuItem';
import SectionHeader from '@/components/common/SectionHeader';

import useBooking from '@/hooks/useBooking';
import { bookingService } from '@/services/bookings';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { PaymentMethod } from '@/types/user';

export default function PaymentScreen() {
  const router = useRouter();
  const { draft, resetBooking } = useBooking();
  const [loading, setLoading] = useState(false);

  const paymentOptions: PaymentMethod[] = [
    { id: 'p-1', type: 'upi', title: 'Google Pay / PhonePe (UPI)', details: 'Instant auto-refund guarantee' },
    { id: 'p-2', type: 'card', title: 'Credit / Debit Card', details: 'Visa, MasterCard, RuPay' },
    { id: 'p-3', type: 'cash', title: 'Pay After Service', details: 'Cash or UPI on technician completion' },
  ];

  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(paymentOptions[0]);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      const created = await bookingService.createBooking({
        serviceTitle: draft.serviceTitle || 'Foam & Power Jet Service',
        selectedOption: draft.selectedOption || {
          id: 'opt-ac-1',
          title: 'Foam & Power Jet Service (1 Unit)',
          description: 'Complete deep cleaning using specialized jet pump',
          price: 599,
          durationMinutes: 45,
          features: ['High pressure jet pump wash'],
        },
        scheduledDate: draft.scheduledDate || 'Today, 2:30 PM',
        scheduledTimeSlot: draft.scheduledTimeSlot || '02:00 PM - 04:00 PM',
        address: draft.address || {
          id: 'addr-1',
          title: 'Home',
          street: 'Flat 402, Green Valley Apartments',
          city: 'Bengaluru',
          state: 'Karnataka',
          zipCode: '560102',
        },
        paymentMethod: selectedPayment,
        totalAmount: (draft.selectedOption?.price || 599) * 1.18,
      });

      resetBooking();
      setLoading(false);

      router.replace({
        pathname: '/services/booking-confirmed' as any,
        params: { id: created.id },
      });
    } catch (error) {
      setLoading(false);
      Alert.alert('Payment Error', 'Failed to process payment. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header title="Payment & Review" />
      <BookingStepper currentStep={3} />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <PaymentSummary
          itemTitle={draft.selectedOption?.title || 'Foam & Power Jet Service'}
          itemPrice={draft.selectedOption?.price || 599}
          discount={100}
        />

        <SectionHeader title="Select Payment Method" />
        {paymentOptions.map((pay) => (
          <ProfileMenuItem
            key={pay.id}
            icon={pay.type === 'upi' ? 'qr-code-outline' : pay.type === 'card' ? 'card-outline' : 'cash-outline'}
            title={pay.title}
            subtitle={pay.details}
            badge={selectedPayment.id === pay.id ? 'SELECTED' : undefined}
            onPress={() => setSelectedPayment(pay)}
          />
        ))}

        <Button
          title="Confirm & Pay"
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
  btn: {
    marginTop: spacing.xl,
  },
});
