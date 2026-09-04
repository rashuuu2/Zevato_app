import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import Header from '@/components/common/Header';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import BookingStepper from '@/components/booking/BookingStepper';

import useBooking from '@/hooks/useBooking';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

const MODEL_PRESETS: Record<string, string[]> = {
  ac: ['Split AC 1 Ton', 'Split AC 1.5 Ton', 'Split AC 2 Ton', 'Window AC 1 Ton', 'Window AC 1.5 Ton', 'Cassette AC', 'Portable AC'],
  acs: ['Split AC 1 Ton', 'Split AC 1.5 Ton', 'Split AC 2 Ton', 'Window AC 1 Ton', 'Window AC 1.5 Ton', 'Cassette AC', 'Portable AC'],
  'washing-machine': ['Front Load 6 kg', 'Front Load 7 kg', 'Front Load 8 kg', 'Top Load 6.5 kg', 'Top Load 7.5 kg', 'Semi-Automatic', 'Fully Automatic'],
  'washing-machines': ['Front Load 6 kg', 'Front Load 7 kg', 'Front Load 8 kg', 'Top Load 6.5 kg', 'Top Load 7.5 kg', 'Semi-Automatic', 'Fully Automatic'],
  refrigerator: ['Single Door', 'Double Door', 'Side by Side', 'French Door', 'Mini Fridge', 'Deep Freezer'],
  refrigerators: ['Single Door', 'Double Door', 'Side by Side', 'French Door', 'Mini Fridge', 'Deep Freezer'],
  tv: ['LED 32"', 'LED 43"', 'LED 55"', 'OLED 55"', 'OLED 65"', 'QLED 55"', 'QLED 65"', 'QLED 75"'],
  'tv-video-audio': ['LED 32"', 'LED 43"', 'LED 55"', 'OLED 55"', 'OLED 65"', 'QLED 55"', 'QLED 65"', 'QLED 75"'],
  'water-purifier': ['RO + UV', 'RO + UV + UF', 'Gravity Based', 'UV Only', 'RO + UV + TDS Controller'],
  electrical: ['Ceiling Fan', 'Switchboard', 'MCB / Fuse Box', 'Wiring Repair', 'Inverter / UPS', 'Geyser'],
  electricals: ['Ceiling Fan', 'Switchboard', 'MCB / Fuse Box', 'Wiring Repair', 'Inverter / UPS', 'Geyser'],
};

export default function ModelInputScreen() {
  const router = useRouter();
  const { updateBooking, draft } = useBooking();
  const { categoryId, categoryName, brandName } = useLocalSearchParams<{
    categoryId?: string;
    categoryName?: string;
    brandName?: string;
  }>();

  const [modelNumber, setModelNumber] = useState(draft.modelNumber || '');
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const presets = MODEL_PRESETS[categoryId || ''] || MODEL_PRESETS['ac'];

  const handlePresetSelect = (preset: string) => {
    setSelectedPreset(preset);
    setModelNumber(preset);
  };

  const handleContinue = () => {
    const model = modelNumber.trim() || selectedPreset;
    if (!model) {
      Alert.alert('Model Required', 'Please enter your model number or select an appliance type.');
      return;
    }

    updateBooking({
      modelNumber: model,
      productName: model,
    });

    router.push({
      pathname: '/services/issue-select' as any,
      params: {
        categoryId: categoryId || '',
        categoryName: categoryName || '',
        brandName: brandName || '',
        modelNumber: model,
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header title="Enter Model" subtitle={`${brandName || 'Brand'} • ${categoryName || 'Appliance'}`} />
      <BookingStepper currentStep={3} />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Context Banner */}
        <View style={styles.contextBanner}>
          <Ionicons name="information-circle-outline" size={18} color={colors.primary} />
          <Text style={styles.contextText}>
            Enter the model number from your appliance's sticker, receipt, or manual. Can't find it? Select an appliance type below.
          </Text>
        </View>

        {/* Model Number Input */}
        <Input
          label="Model Number / Name"
          placeholder="e.g. AR18CYLANWK/NL or Split AC 1.5 Ton"
          value={modelNumber}
          onChangeText={(t) => {
            setModelNumber(t);
            setSelectedPreset(null);
          }}
          leftIcon={<Ionicons name="barcode-outline" size={18} color={colors.textSecondary} />}
        />

        {/* Quick Presets */}
        <Text style={styles.presetTitle}>Or select your appliance type</Text>
        <View style={styles.presetGrid}>
          {presets.map((preset) => {
            const isSelected = selectedPreset === preset || modelNumber === preset;
            return (
              <TouchableOpacity
                key={preset}
                style={[styles.presetChip, isSelected && styles.presetChipActive]}
                onPress={() => handlePresetSelect(preset)}
                activeOpacity={0.7}
              >
                <Text style={[styles.presetText, isSelected && styles.presetTextActive]}>
                  {preset}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Appliance Care Highlights */}
        <View style={styles.featureBox}>
          <View style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={18} color={colors.success} />
            <Text style={styles.featureText}>Certified multi-point diagnostic inspection</Text>
          </View>
          <View style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={18} color={colors.success} />
            <Text style={styles.featureText}>100% Genuine OEM parts compatibility</Text>
          </View>
          <View style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={18} color={colors.success} />
            <Text style={styles.featureText}>Background verified & trained technician</Text>
          </View>
        </View>

        <Button
          title="Continue to Select Issue"
          variant="primary"
          size="large"
          onPress={handleContinue}
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
  contextBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.primaryLight,
    padding: spacing.sm + 2,
    borderRadius: spacing.radiusMd,
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  contextText: {
    fontSize: typography.fontSize.xs,
    color: colors.primaryDark,
    flex: 1,
    lineHeight: 18,
  },
  presetTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  presetChip: {
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.sm + 2,
    borderRadius: spacing.radiusFull,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  presetChipActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  presetText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  presetTextActive: {
    color: colors.primary,
    fontWeight: typography.fontWeight.bold,
  },
  featureBox: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: spacing.radiusMd,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 4,
  },
  featureText: {
    fontSize: typography.fontSize.xs + 1,
    color: colors.text,
    flex: 1,
  },
  btn: {
    marginTop: spacing.xs,
  },
});
