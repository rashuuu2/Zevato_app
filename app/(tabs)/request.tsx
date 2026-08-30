import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import CategoryCard from '@/components/services/CategoryCard';
import SectionHeader from '@/components/common/SectionHeader';

import categories from '@/data/categories';
import useRequests from '@/hooks/useRequests';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { ServiceCategory } from '@/types/service';

export default function RequestScreen() {
  const router = useRouter();
  const { addRequest } = useRequests();

  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>(categories[0]);
  const [description, setDescription] = useState('');
  const [preferredDate, setPreferredDate] = useState('Tomorrow');
  const [preferredTime, setPreferredTime] = useState('10:00 AM');
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!description.trim()) {
      Alert.alert('Required Field', 'Please describe the issue with your appliance.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const created = addRequest({
        categoryName: selectedCategory.name,
        issueDescription: description,
        preferredDate,
        preferredTime,
      });
      setLoading(false);
      Alert.alert('Request Submitted', `Your service request ${created.id} has been submitted. Our team will review and send a quote shortly.`, [
        {
          text: 'View Requests',
          onPress: () => router.push('/(tabs)/requests' as any),
        },
      ]);
    }, 600);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Create Custom Request</Text>
        <Text style={styles.subtitle}>
          Have an unlisted issue or custom appliance repair? Tell us what you need.
        </Text>

        <SectionHeader title="Selected Appliance Category" />
        <View style={styles.categoryBox}>
          <CategoryCard
            category={selectedCategory}
            onPress={() => {
              // rotate category for demo
              const nextIndex = (categories.indexOf(selectedCategory) + 1) % categories.length;
              setSelectedCategory(categories[nextIndex]);
            }}
          />
          <Text style={styles.hintText}>Tap card to change category</Text>
        </View>

        <Input
          label="Describe the Issue"
          placeholder="e.g. AC cooling stops after 10 minutes, making loud buzzing noise..."
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
          style={styles.textArea}
        />

        <Input
          label="Preferred Visit Date"
          placeholder="e.g. Tomorrow or 02 Sep 2026"
          value={preferredDate}
          onChangeText={setPreferredDate}
        />

        <Input
          label="Preferred Visit Time"
          placeholder="e.g. 10:00 AM - 12:00 PM"
          value={preferredTime}
          onChangeText={setPreferredTime}
        />

        <Button
          title="Submit Custom Request"
          variant="primary"
          size="large"
          loading={loading}
          onPress={handleSubmit}
          style={styles.submitBtn}
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
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  pageTitle: {
    fontSize: typography.fontSize.heading,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  subtitle: {
    fontSize: typography.fontSize.xs + 1,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  categoryBox: {
    marginBottom: spacing.md,
  },
  hintText: {
    fontSize: typography.fontSize.xs,
    color: colors.primary,
    marginTop: -spacing.xs,
    marginBottom: spacing.xs,
    fontStyle: 'italic',
  },
  textArea: {
    height: 96,
    textAlignVertical: 'top',
    paddingTop: spacing.sm,
  },
  submitBtn: {
    marginTop: spacing.md,
  },
});
