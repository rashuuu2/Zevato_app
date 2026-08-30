import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '@/components/common/Header';
import RequestStatus from '@/components/requests/RequestStatus';
import Button from '@/components/common/Button';

import requests from '@/data/requests';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { formatCurrency } from '@/utils/formatCurrency';

export default function RequestDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const request = requests.find((r) => r.id === id) || requests[0];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header title={`Request ${request.id}`} />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.statusRow}>
            <Text style={styles.category}>{request.categoryName}</Text>
            <RequestStatus status={request.status} />
          </View>
          {request.productName && <Text style={styles.product}>{request.productName}</Text>}
          <Text style={styles.sectionTitle}>Issue Description:</Text>
          <Text style={styles.desc}>{request.issueDescription}</Text>
          {request.estimatedQuote && (
            <View style={styles.quoteBox}>
              <Text style={styles.quoteTitle}>Estimated Service Quote:</Text>
              <Text style={styles.quoteVal}>{formatCurrency(request.estimatedQuote)}</Text>
            </View>
          )}
        </View>

        {request.status === 'quoted' && (
          <Button
            title="Approve & Book Technician"
            variant="primary"
            size="large"
            onPress={() => router.push('/services/schedule' as any)}
            style={styles.btn}
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
  container: {
    padding: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: spacing.radiusMd,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  category: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  product: {
    fontSize: typography.fontSize.xs + 1,
    color: colors.primary,
    fontWeight: typography.fontWeight.medium,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginTop: spacing.md,
  },
  desc: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 20,
  },
  quoteBox: {
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.primaryLight,
    borderRadius: spacing.radiusSm,
  },
  quoteTitle: {
    fontSize: typography.fontSize.xs,
    color: colors.primaryDark,
  },
  quoteVal: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    marginTop: 2,
  },
  btn: {
    marginTop: spacing.lg,
  },
});
