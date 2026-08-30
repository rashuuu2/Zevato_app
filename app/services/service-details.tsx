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
  const { categoryId } = useLocalSearchParams<{ categoryId?: string }>();

  const serviceDetail = services.find((s) => s.categoryId === categoryId) || services[0];
  const [selectedOption, setSelectedOption] = useState<OptionType>(serviceDetail.options[0]);

  const handleSelectOption = (option: OptionType) => {
    setSelectedOption(option);
    updateBooking({
      serviceId: serviceDetail.id,
      serviceTitle: serviceDetail.title,
      selectedOption: option,
      categoryName: serviceDetail.title,
    });
    router.push('/services/schedule' as any);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header title={serviceDetail.title} subtitle={`★ ${serviceDetail.rating} (${serviceDetail.reviewCount} reviews)`} />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>{serviceDetail.subtitle}</Text>

        <SectionHeader title="Available Packages" />
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
  subtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
});
