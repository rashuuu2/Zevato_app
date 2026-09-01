import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '@/components/common/Header';
import ProfileMenuItem from '@/components/profile/ProfileMenuItem';
import EmptyState from '@/components/common/EmptyState';

import { bookingService } from '@/services/bookings';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { formatCurrency } from '@/utils/formatCurrency';
import { Booking } from '@/types/booking';

export default function InvoicesScreen() {
  const router = useRouter();
  const [bookingList, setBookingList] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInvoices = async () => {
      const data = await bookingService.getAllBookings();
      setBookingList(data);
      setLoading(false);
    };
    loadInvoices();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header title="Invoices & Receipts" />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
        ) : bookingList.length === 0 ? (
          <EmptyState
            icon="receipt-outline"
            title="No Invoices Found"
            description="Completed service invoices will appear here."
            actionTitle="Explore Services"
            onAction={() => router.push('/services' as any)}
          />
        ) : (
          bookingList.map((b) => (
            <ProfileMenuItem
              key={b.id}
              icon="document-text-outline"
              title={b.serviceTitle}
              subtitle={`Booking: ${b.bookingNumber || b.id} • ${formatCurrency(b.totalAmount)}`}
              badge="TAX INVOICE"
              onPress={() => router.push({ pathname: '/bookings/invoice' as any, params: { id: b.id } })}
            />
          ))
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
  loader: {
    marginTop: spacing.xl,
  },
});
