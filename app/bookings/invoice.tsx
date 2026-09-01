import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '@/components/common/Header';
import Button from '@/components/common/Button';

import { bookingService } from '@/services/bookings';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { formatCurrency } from '@/utils/formatCurrency';
import { Booking } from '@/types/booking';

export default function InvoiceScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [booking, setBooking] = useState<Booking | undefined>(undefined);
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInvoice = async () => {
      if (id) {
        const foundBooking = await bookingService.getBookingById(id);
        setBooking(foundBooking);
        const inv = await bookingService.getBookingInvoice(id);
        setInvoiceData(inv);
      }
      setLoading(false);
    };
    loadInvoice();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <Header title="Tax Invoice" />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const basePrice = booking?.selectedOption?.price || invoiceData?.subtotal || 599;
  const discount = invoiceData?.discount !== undefined ? invoiceData.discount : 100;
  const tax = invoiceData?.tax !== undefined ? invoiceData.tax : Math.round((basePrice - discount) * 0.18);
  const total = invoiceData?.total !== undefined ? invoiceData.total : (booking?.totalAmount || basePrice - discount + tax);

  const invoiceId = invoiceData?.invoiceNumber || invoiceData?.id || `INV-${booking?.id?.replace(/[^0-9]/g, '') || '87120'}`;
  const invoiceDate = invoiceData?.date || booking?.scheduledDate || 'Today';

  const handleDownload = () => {
    Alert.alert('Invoice Downloaded', `Tax invoice ${invoiceId} has been saved to your device downloads.`);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header title={`Tax Invoice ${invoiceId}`} />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.invoiceCard}>
          {/* Header & GSTIN */}
          <Text style={styles.companyTitle}>Zevota Care Services Pvt Ltd</Text>
          <Text style={styles.companySub}>GSTIN: 29AAAAA0000A1Z5 • FSSAI/ISO 9001:2015</Text>
          <Text style={styles.companyAddress}>HSR Layout Sector 1, Bengaluru, KA - 560102</Text>

          <View style={styles.divider} />

          {/* Reference Meta */}
          <View style={styles.row}>
            <Text style={styles.label}>Invoice Number:</Text>
            <Text style={styles.valBold}>{invoiceId}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Invoice Date:</Text>
            <Text style={styles.val}>{invoiceDate}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Booking Reference:</Text>
            <Text style={styles.valBold}>{booking?.id || id}</Text>
          </View>
          {booking?.address && (
            <View style={styles.row}>
              <Text style={styles.label}>Service Address:</Text>
              <Text style={styles.val} numberOfLines={1}>
                {booking.address.street}, {booking.address.city}
              </Text>
            </View>
          )}

          <View style={styles.divider} />

          {/* Itemized Table */}
          <Text style={styles.tableHeading}>Itemized Service Breakdown</Text>

          <View style={styles.row}>
            <Text style={styles.label}>
              {booking?.serviceTitle || 'Service Charge'} ({booking?.selectedOption?.title || 'Care Package'})
            </Text>
            <Text style={styles.val}>{formatCurrency(basePrice)}</Text>
          </View>

          {discount > 0 && (
            <View style={styles.row}>
              <Text style={styles.discountLabel}>Special Plan Discount</Text>
              <Text style={styles.discountVal}>-{formatCurrency(discount)}</Text>
            </View>
          )}

          <View style={styles.row}>
            <Text style={styles.label}>Taxes & Fees (18% GST)</Text>
            <Text style={styles.val}>{formatCurrency(tax)}</Text>
          </View>

          <View style={styles.divider} />

          <View style={[styles.row, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Amount Paid:</Text>
            <Text style={styles.totalVal}>{formatCurrency(total)}</Text>
          </View>
        </View>

        <Button
          title="Download PDF Receipt"
          variant="primary"
          size="large"
          onPress={handleDownload}
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  invoiceCard: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: spacing.radiusLg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  companyTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  companySub: {
    fontSize: typography.fontSize.xs - 1,
    color: colors.textMuted,
    marginTop: 2,
  },
  companyAddress: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs + 2,
  },
  label: {
    fontSize: typography.fontSize.xs + 1,
    color: colors.textSecondary,
    flex: 1,
  },
  val: {
    fontSize: typography.fontSize.xs + 1,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
  },
  valBold: {
    fontSize: typography.fontSize.xs + 1,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  discountLabel: {
    fontSize: typography.fontSize.xs + 1,
    color: colors.success,
  },
  discountVal: {
    fontSize: typography.fontSize.xs + 1,
    fontWeight: typography.fontWeight.bold,
    color: colors.success,
  },
  tableHeading: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs + 2,
  },
  totalRow: {
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  totalVal: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  btn: {
    marginTop: spacing.lg,
  },
});
