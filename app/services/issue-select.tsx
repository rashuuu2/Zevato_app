import React, { useState, useEffect } from 'react';
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

interface IssueCard {
  id: string;
  icon: string;
  label: string;
}

const ISSUES_BY_CATEGORY: Record<string, IssueCard[]> = {
  // ACs
  ac: [
    { id: 'not-cooling', icon: '❄️', label: 'Not Cooling Properly' },
    { id: 'water-leak', icon: '💧', label: 'Water Leaking' },
    { id: 'noise', icon: '🔊', label: 'Making Noise' },
    { id: 'not-turning-on', icon: '⚡', label: 'Not Turning On' },
    { id: 'bad-smell', icon: '🌫️', label: 'Bad Smell' },
    { id: 'gas-refill', icon: '🔧', label: 'Gas Refill Needed' },
    { id: 'deep-clean', icon: '🧹', label: 'Deep Cleaning / Jet Service' },
    { id: 'installation', icon: '🏠', label: 'Installation / Uninstallation' },
    { id: 'other', icon: '❓', label: 'Other Issue' },
  ],
  acs: [
    { id: 'not-cooling', icon: '❄️', label: 'Not Cooling Properly' },
    { id: 'water-leak', icon: '💧', label: 'Water Leaking' },
    { id: 'noise', icon: '🔊', label: 'Making Noise' },
    { id: 'not-turning-on', icon: '⚡', label: 'Not Turning On' },
    { id: 'bad-smell', icon: '🌫️', label: 'Bad Smell' },
    { id: 'gas-refill', icon: '🔧', label: 'Gas Refill Needed' },
    { id: 'deep-clean', icon: '🧹', label: 'Deep Cleaning / Jet Service' },
    { id: 'installation', icon: '🏠', label: 'Installation / Uninstallation' },
    { id: 'other', icon: '❓', label: 'Other Issue' },
  ],

  // Washing Machines
  'washing-machine': [
    { id: 'not-spinning', icon: '🔄', label: 'Not Spinning' },
    { id: 'not-draining', icon: '💧', label: 'Water Not Draining' },
    { id: 'noise', icon: '🔊', label: 'Making Noise' },
    { id: 'not-turning-on', icon: '⚡', label: 'Not Turning On' },
    { id: 'not-cleaning', icon: '🧼', label: 'Not Cleaning Properly' },
    { id: 'water-leak', icon: '🚿', label: 'Water Leaking' },
    { id: 'drum-clean', icon: '🧹', label: 'Drum Descaling Service' },
    { id: 'other', icon: '❓', label: 'Other Issue' },
  ],
  'washing-machines': [
    { id: 'not-spinning', icon: '🔄', label: 'Not Spinning' },
    { id: 'not-draining', icon: '💧', label: 'Water Not Draining' },
    { id: 'noise', icon: '🔊', label: 'Making Noise' },
    { id: 'not-turning-on', icon: '⚡', label: 'Not Turning On' },
    { id: 'not-cleaning', icon: '🧼', label: 'Not Cleaning Properly' },
    { id: 'water-leak', icon: '🚿', label: 'Water Leaking' },
    { id: 'drum-clean', icon: '🧹', label: 'Drum Descaling Service' },
    { id: 'other', icon: '❓', label: 'Other Issue' },
  ],

  // Refrigerators
  refrigerator: [
    { id: 'not-cooling', icon: '❄️', label: 'Not Cooling' },
    { id: 'overcooling', icon: '🧊', label: 'Over-Cooling / Freezing' },
    { id: 'noise', icon: '🔊', label: 'Making Noise' },
    { id: 'not-turning-on', icon: '⚡', label: 'Not Turning On' },
    { id: 'water-leak', icon: '💧', label: 'Water Leaking' },
    { id: 'gas-refill', icon: '🔧', label: 'Gas Charging' },
    { id: 'bad-smell', icon: '🌫️', label: 'Bad Smell' },
    { id: 'other', icon: '❓', label: 'Other Issue' },
  ],
  refrigerators: [
    { id: 'not-cooling', icon: '❄️', label: 'Not Cooling' },
    { id: 'overcooling', icon: '🧊', label: 'Over-Cooling / Freezing' },
    { id: 'noise', icon: '🔊', label: 'Making Noise' },
    { id: 'not-turning-on', icon: '⚡', label: 'Not Turning On' },
    { id: 'water-leak', icon: '💧', label: 'Water Leaking' },
    { id: 'gas-refill', icon: '🔧', label: 'Gas Charging' },
    { id: 'bad-smell', icon: '🌫️', label: 'Bad Smell' },
    { id: 'other', icon: '❓', label: 'Other Issue' },
  ],

  // TV, Video & Audio
  tv: [
    { id: 'not-turning-on', icon: '⚡', label: 'TV Not Turning On' },
    { id: 'no-picture', icon: '📺', label: 'No Picture / Black Screen' },
    { id: 'no-sound', icon: '🔇', label: 'No Sound / Audio Issue' },
    { id: 'wifi', icon: '📶', label: 'Wi-Fi / Connectivity' },
    { id: 'remote', icon: '🎮', label: 'Remote Not Working' },
    { id: 'display-lines', icon: '🖼️', label: 'Display Lines / Spots' },
    { id: 'wall-mount', icon: '🔩', label: 'Wall Mount Installation' },
    { id: 'other', icon: '❓', label: 'Other Issue' },
  ],
  'tv-video-audio': [
    { id: 'not-turning-on', icon: '⚡', label: 'TV Not Turning On' },
    { id: 'no-picture', icon: '📺', label: 'No Picture / Black Screen' },
    { id: 'no-sound', icon: '🔇', label: 'No Sound / Audio Issue' },
    { id: 'wifi', icon: '📶', label: 'Wi-Fi / Connectivity' },
    { id: 'remote', icon: '🎮', label: 'Remote Not Working' },
    { id: 'display-lines', icon: '🖼️', label: 'Display Lines / Spots' },
    { id: 'wall-mount', icon: '🔩', label: 'Wall Mount Installation' },
    { id: 'other', icon: '❓', label: 'Other Issue' },
  ],

  // Water Purifier
  'water-purifier': [
    { id: 'no-water', icon: '🚱', label: 'No Water Output' },
    { id: 'bad-taste', icon: '💧', label: 'Bad Taste / Smell' },
    { id: 'slow-flow', icon: '🐢', label: 'Slow Water Flow' },
    { id: 'leaking', icon: '🚿', label: 'Water Leaking' },
    { id: 'filter-change', icon: '🔄', label: 'Filter Replacement' },
    { id: 'annual-service', icon: '🧹', label: 'Annual Maintenance' },
    { id: 'other', icon: '❓', label: 'Other Issue' },
  ],

  // Electricals
  electrical: [
    { id: 'short-circuit', icon: '⚡', label: 'Short Circuit' },
    { id: 'switchboard', icon: '🔌', label: 'Switchboard Repair' },
    { id: 'fan-install', icon: '🌀', label: 'Fan Installation' },
    { id: 'wiring', icon: '🔗', label: 'Wiring Issue' },
    { id: 'mcb-trip', icon: '🔧', label: 'MCB / Fuse Tripping' },
    { id: 'light-install', icon: '💡', label: 'Light Installation' },
    { id: 'other', icon: '❓', label: 'Other Issue' },
  ],
  electricals: [
    { id: 'short-circuit', icon: '⚡', label: 'Short Circuit' },
    { id: 'switchboard', icon: '🔌', label: 'Switchboard Repair' },
    { id: 'fan-install', icon: '🌀', label: 'Fan Installation' },
    { id: 'wiring', icon: '🔗', label: 'Wiring Issue' },
    { id: 'mcb-trip', icon: '🔧', label: 'MCB / Fuse Tripping' },
    { id: 'light-install', icon: '💡', label: 'Light Installation' },
    { id: 'other', icon: '❓', label: 'Other Issue' },
  ],

  // Plumbing
  plumbing: [
    { id: 'pipe-leak', icon: '💧', label: 'Pipe Leakage' },
    { id: 'blockage', icon: '🚽', label: 'Drain Blockage' },
    { id: 'tap-repair', icon: '🚿', label: 'Tap / Faucet Repair' },
    { id: 'toilet-repair', icon: '🚽', label: 'Toilet Repair' },
    { id: 'motor-pump', icon: '⚡', label: 'Water Motor Pump Issue' },
    { id: 'other', icon: '❓', label: 'Other Issue' },
  ],
};

export default function IssueSelectScreen() {
  const router = useRouter();
  const { updateBooking, draft } = useBooking();
  const { categoryId, categoryName, brandName, modelNumber, productVariantId, productId } = useLocalSearchParams<{
    categoryId?: string;
    categoryName?: string;
    brandName?: string;
    modelNumber?: string;
    productVariantId?: string;
    productId?: string;
  }>();

  useEffect(() => {
    console.log(
      '[BOOKING DRAFT AT ISSUE SELECT SCREEN]',
      JSON.stringify({
        productVariantId: draft.productVariantId || productVariantId,
        productId: draft.productId || productId,
        productName: draft.productName || `${brandName} ${categoryName} ${modelNumber}`,
        modelNumber: draft.modelNumber || modelNumber,
        brandName: draft.brandName || brandName,
        categoryId: draft.categoryId || categoryId,
      })
    );
  }, [draft.productVariantId, productVariantId]);

  const [selectedIssue, setSelectedIssue] = useState<string | null>(draft.selectedIssue || null);
  const [description, setDescription] = useState(draft.issueDescription || '');

  const issues = ISSUES_BY_CATEGORY[categoryId || ''] || ISSUES_BY_CATEGORY['ac'];

  const handleContinue = () => {
    if (!selectedIssue) {
      Alert.alert('Select Issue', 'Please select the problem you are facing with your appliance.');
      return;
    }

    const issueLabel = issues.find((i) => i.id === selectedIssue)?.label || selectedIssue;

    updateBooking({
      selectedIssue: issueLabel,
      issueDescription: description.trim() || undefined,
      serviceTitle: `${categoryName || 'Appliance'} - ${issueLabel}`,
      serviceId: `svc-${categoryId}-${selectedIssue}`,
    });

    router.push({
      pathname: '/services/schedule' as any,
      params: {
        categoryId: categoryId || '',
        categoryName: categoryName || '',
        brandName: brandName || '',
        modelNumber: modelNumber || '',
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header title="What's the Problem?" />
      <BookingStepper currentStep={4} />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Context Banner */}
        <View style={styles.contextBanner}>
          <View style={styles.contextRow}>
            <Ionicons name="construct-outline" size={16} color={colors.primary} />
            <Text style={styles.contextLabel}>
              {brandName || draft.brandName} {categoryName || draft.categoryName} • {modelNumber || draft.modelNumber}
            </Text>
          </View>
          {(draft.productVariantId || productVariantId) && (
            <View style={{ marginTop: 4, flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="pricetag-outline" size={12} color={colors.textMuted} style={{ marginRight: 4 }} />
              <Text style={{ fontSize: 11, color: colors.textMuted }}>
                Variant ID: {draft.productVariantId || productVariantId}
              </Text>
            </View>
          )}
        </View>

        {/* Issue Cards Grid */}
        <Text style={styles.sectionTitle}>Select the issue you're facing</Text>
        <View style={styles.issueGrid}>
          {issues.map((issue) => {
            const isSelected = selectedIssue === issue.id;
            return (
              <TouchableOpacity
                key={issue.id}
                style={[styles.issueCard, isSelected && styles.issueCardActive]}
                onPress={() => setSelectedIssue(issue.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.issueIcon}>{issue.icon}</Text>
                <Text style={[styles.issueLabel, isSelected && styles.issueLabelActive]} numberOfLines={2}>
                  {issue.label}
                </Text>
                {isSelected && (
                  <View style={styles.checkBadge}>
                    <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Additional Description */}
        <Input
          label="Additional Details (Optional)"
          placeholder="Describe the issue in more detail..."
          multiline
          numberOfLines={3}
          value={description}
          onChangeText={setDescription}
          style={styles.textArea}
        />

        {/* Resolution Info */}
        <View style={styles.infoRow}>
          <View style={styles.infoBadge}>
            <Ionicons name="time-outline" size={16} color={colors.primary} />
            <Text style={styles.infoText}>Avg. Resolution: 24–48 hrs</Text>
          </View>
          <View style={styles.infoBadge}>
            <Ionicons name="shield-checkmark-outline" size={16} color={colors.success} />
            <Text style={styles.infoText}>90-Day Warranty</Text>
          </View>
        </View>

        {/* Continue Button */}
        <Button
          title="Continue to Schedule"
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
    backgroundColor: colors.primaryLight,
    padding: spacing.sm + 2,
    borderRadius: spacing.radiusMd,
    marginBottom: spacing.md,
  },
  contextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  contextLabel: {
    fontSize: typography.fontSize.xs + 1,
    fontWeight: typography.fontWeight.bold,
    color: colors.primaryDark,
  },
  sectionTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  issueGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  issueCard: {
    width: '47%',
    backgroundColor: colors.surface,
    borderRadius: spacing.radiusMd,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: spacing.sm + 2,
    alignItems: 'center',
    position: 'relative',
    minHeight: 80,
    justifyContent: 'center',
  },
  issueCardActive: {
    borderColor: colors.primary,
    backgroundColor: '#F0F5FF',
  },
  issueIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  issueLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 16,
  },
  issueLabelActive: {
    color: colors.primary,
    fontWeight: typography.fontWeight.bold,
  },
  checkBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  textArea: {
    minHeight: 70,
  },
  infoRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  infoBadge: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.xs + 4,
    borderRadius: spacing.radiusSm,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  infoText: {
    fontSize: typography.fontSize.xs - 1,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.semibold,
    flex: 1,
  },
  btn: {
    marginTop: spacing.xs,
  },
});
