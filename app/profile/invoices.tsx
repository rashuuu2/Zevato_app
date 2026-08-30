import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '@/components/common/Header';
import ProfileMenuItem from '@/components/profile/ProfileMenuItem';

import bookings from '@/data/bookings';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';

export default function InvoicesScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header title="Invoices & Receipts" />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {bookings.map((b) => (
          <ProfileMenuItem
            key={b.id}
            icon="document-text-outline"
            title={`${b.serviceTitle}`}
            subtitle={`Invoice Date: ${b.createdAt} • ₹${b.totalAmount}`}
            badge="TAX INVOICE"
            onPress={() => router.push({ pathname: '/bookings/invoice' as any, params: { id: b.id } })}
          />
        ))}
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
});
