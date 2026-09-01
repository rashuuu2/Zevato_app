import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import Header from '@/components/common/Header';
import Button from '@/components/common/Button';
import BookingStepper from '@/components/booking/BookingStepper';

import useBooking from '@/hooks/useBooking';
import useAuth from '@/hooks/useAuth';
import { bookingService } from '@/services/bookings';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { formatCurrency } from '@/utils/formatCurrency';
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

  // Price calculation
  const inspectionFee = 499;
  const discount = 100;
  const taxable = Math.max(0, inspectionFee - discount);
  const tax = Math.round(taxable * 0.18);
  const finalTotal = taxable + tax;

  const handleConfirm = async () => {
    if (!draft.selectedIssue && !draft.serviceTitle) {
      Alert.alert('Incomplete Booking', 'Please select a service issue first.');
      return;
    }
    if (!draft.scheduledDate || !draft.scheduledTimeSlot) {
      Alert.alert('Incomplete Schedule', 'Please select a date and time slot.');
      return;
    }
    if (!draft.address) {
      Alert.alert('Missing Address', 'Please select a service address.');
      return;
    }

    try {
      setLoading(true);

      const created = await bookingService.createBooking({
        serviceId: draft.serviceId || `svc-${draft.categoryId}-general`,
        serviceTitle: draft.serviceTitle || `${draft.categoryName} Service`,
        selectedOption: {
          id: `opt-${Date.now()}`,
          title: draft.selectedIssue || 'General Service',
          description: draft.issueDescription || `${draft.brandName} ${draft.modelNumber} - ${draft.selectedIssue}`,
          price: inspectionFee,
          durationMinutes: 60,
          features: ['Diagnostic Inspection', '90-Day Warranty', 'Certified Technician'],
        },
        categoryName: draft.categoryName || 'Appliance Care',
        brandName: draft.brandName,
        productName: draft.modelNumber || draft.productName,
        scheduledDate: draft.scheduledDate,
        scheduledTimeSlot: draft.scheduledTimeSlot,
        address: draft.address,
        paymentMethod: selectedPayment,
        totalAmount: finalTotal,
      });

      // Simulated payment
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
          'Payment processing failed (Dev Test Mode). Toggle the failure switch off to test success.',
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

  // Summary row with Edit button
  const SummaryRow = ({ icon, label, value, editStep }: { icon: string; label: string; value: string; editStep?: string }) => (
    <View style={styles.summaryRow}>
      <Ionicons name={icon as any} size={18} color={colors.primary} />
      <View style={styles.summaryTextGroup}>
        <Text style={styles.summaryLabel}>{label}</Text>
        <Text style={styles.summaryValue} numberOfLines={2}>{value}</Text>
      </View>
      {editStep && (
        <TouchableOpacity onPress={() => router.back()} style={styles.editBtn}>
          <Text style={styles.editBtnText}>Edit</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header title="Review & Confirm" />
      <BookingStepper currentStep={6} />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Dev Notice */}
        <View style={styles.devNotice}>
          <Ionicons name="information-circle-outline" size={18} color={colors.primary} />
          <Text style={styles.devNoticeText}>
            Development Demo: Payments are simulated. No real transaction.
          </Text>
        </View>

        {/* Booking Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Booking Summary</Text>

          <SummaryRow
            icon="grid-outline"
            label="Service"
            value={`${draft.categoryName || 'Appliance'} Service`}
            editStep="category"
          />
          <SummaryRow
            icon="hardware-chip-outline"
            label="Brand & Model"
            value={`${draft.brandName || 'Brand'} — ${draft.modelNumber || draft.productName || 'Model'}`}
            editStep="model"
          />
          <SummaryRow
            icon="alert-circle-outline"
            label="Issue"
            value={draft.selectedIssue || draft.serviceTitle || 'Not specified'}
            editStep="issue"
          />
          {draft.issueDescription ? (
            <SummaryRow
              icon="document-text-outline"
              label="Details"
              value={draft.issueDescription}
            />
          ) : null}
          <SummaryRow
            icon="calendar-outline"
            label="Schedule"
            value={`${draft.scheduledDate || 'Today'}, ${draft.scheduledTimeSlot || '10:00 AM'}`}
            editStep="schedule"
          />
          <SummaryRow
            icon="location-outline"
            label="Address"
            value={
              draft.address
                ? `${draft.address.title}: ${draft.address.street}, ${draft.address.city}`
                : user?.address
                ? `${user.address.street}, ${user.address.city}`
                : 'Not selected'
            }
            editStep="address"
          />
          {draft.specialInstructions ? (
            <SummaryRow
              icon="chatbox-ellipses-outline"
              label="Instructions"
              value={draft.specialInstructions}
            />
          ) : null}
        </View>

        {/* Pricing Section */}
        <View style={styles.pricingCard}>
          <Text style={styles.summaryTitle}>Estimated Charges</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Inspection & Diagnosis Fee</Text>
            <Text style={styles.priceValue}>{formatCurrency(inspectionFee)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={[styles.priceLabel, { color: colors.success }]}>First-time Discount</Text>
            <Text style={[styles.priceValue, { color: colors.success }]}>-{formatCurrency(discount)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>GST (18%)</Text>
            <Text style={styles.priceValue}>{formatCurrency(tax)}</Text>
          </View>
          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Payable</Text>
            <Text style={styles.totalValue}>{formatCurrency(finalTotal)}</Text>
          </View>
          <Text style={styles.priceNote}>
            * Actual repair charges (if any) will be quoted by the technician on-site before work begins.
          </Text>
        </View>

        {/* Trust Badge */}
        <View style={styles.trustBanner}>
          <Ionicons name="shield-checkmark" size={20} color={colors.success} />
          <View style={styles.trustTextGroup}>
            <Text style={styles.trustTitle}>Zevota Service Guarantee</Text>
            <Text style={styles.trustSub}>90-day warranty • Genuine parts • Background verified technicians</Text>
          </View>
        </View>

        {/* Payment Methods */}
        <Text style={styles.sectionTitle}>Payment Method</Text>
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

        {/* Dev Toggle */}
        <View style={styles.testCard}>
          <View style={styles.testTextGroup}>
            <Text style={styles.testTitle}>Simulate Payment Failure (Dev)</Text>
            <Text style={styles.testSub}>Toggle to test failure response</Text>
          </View>
          <Switch
            value={simulateFailure}
            onValueChange={setSimulateFailure}
            trackColor={{ false: colors.border, true: colors.dangerLight }}
            thumbColor={simulateFailure ? colors.danger : '#f4f3f4'}
          />
        </View>

        <Button
          title={loading ? 'Processing...' : `Pay ${formatCurrency(finalTotal)} & Confirm`}
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
  devNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    padding: spacing.sm,
    borderRadius: spacing.radiusMd,
    gap: spacing.xs,
    marginBottom: spacing.sm,
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
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  summaryTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
  editBtn: {
    paddingVertical: 2,
    paddingHorizontal: spacing.xs + 2,
    backgroundColor: colors.primaryLight,
    borderRadius: spacing.radiusSm,
  },
  editBtnText: {
    fontSize: typography.fontSize.xs - 1,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  pricingCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: spacing.radiusMd,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  priceLabel: {
    fontSize: typography.fontSize.xs + 1,
    color: colors.textSecondary,
  },
  priceValue: {
    fontSize: typography.fontSize.xs + 1,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: spacing.xs,
    paddingTop: spacing.xs,
  },
  totalLabel: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  totalValue: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  priceNote: {
    fontSize: typography.fontSize.xs - 1,
    color: colors.textMuted,
    fontStyle: 'italic',
    marginTop: spacing.xs,
  },
  trustBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successLight,
    padding: spacing.sm + 2,
    borderRadius: spacing.radiusMd,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  trustTextGroup: {
    flex: 1,
  },
  trustTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.success,
  },
  trustSub: {
    fontSize: typography.fontSize.xs - 1,
    color: colors.success,
    marginTop: 1,
  },
  sectionTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
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
    backgroundColor: '#F0F5FF',
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
  testCard: {
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
