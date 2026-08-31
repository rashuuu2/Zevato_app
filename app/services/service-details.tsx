import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '@/components/common/Header';
import ServiceOption from '@/components/services/ServiceOption';
import ServiceFeature from '@/components/services/ServiceFeature';
import SectionHeader from '@/components/common/SectionHeader';

import services from '@/data/services';
import useBooking from '@/hooks/useBooking';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { ServiceOption as OptionType } from '@/types/service';

export default function ServiceDetailsScreen() {
  const router = useRouter();
  const { updateBooking } = useBooking();
  const { categoryId, productName, brandName } = useLocalSearchParams<{
    categoryId?: string;
    productName?: string;
    brandName?: string;
  }>();

  const serviceDetail =
    services.find((s) => s.categoryId === categoryId) || services[0];
  const [selectedOption, setSelectedOption] = useState<OptionType>(
    serviceDetail.options[0]
  );

  const handleSelectOption = (option: OptionType) => {
    setSelectedOption(option);
    updateBooking({
      serviceId: serviceDetail.id,
      serviceTitle: serviceDetail.title,
      selectedOption: option,
      categoryName: serviceDetail.title,
      productName: productName || serviceDetail.title,
      brandName: brandName || '',
    });
    router.push('/services/schedule' as any);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header
        title={serviceDetail.title}
        subtitle={`★ ${serviceDetail.rating} (${serviceDetail.reviewCount} reviews)`}
      />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {productName && (
          <View style={styles.contextBadge}>
            <Text style={styles.contextText}>
              Selected for: <Text style={styles.contextBold}>{brandName ? `${brandName} ${productName}` : productName}</Text>
            </Text>
          </View>
        )}

        <Text style={styles.subtitle}>{serviceDetail.subtitle}</Text>

        <SectionHeader title="Available Service Packages" />
        {serviceDetail.options.map((opt) => (
          <ServiceOption
            key={opt.id}
            option={opt}
            selected={selectedOption.id === opt.id}
            onSelect={handleSelectOption}
          />
        ))}

        <SectionHeader title="Why Choose Zevota Care?" />
        {serviceDetail.features.map((feat) => (
          <ServiceFeature key={feat.id} feature={feat} />
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
    paddingBottom: spacing.xl,
  },
  contextBadge: {
    backgroundColor: colors.primaryLight,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.sm + 2,
    borderRadius: spacing.radiusSm,
    marginBottom: spacing.xs,
  },
  contextText: {
    fontSize: typography.fontSize.xs,
    color: colors.primaryDark,
  },
  contextBold: {
    fontWeight: typography.fontWeight.bold,
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
});
