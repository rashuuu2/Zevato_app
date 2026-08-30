import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '@/components/common/Header';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import ProfileMenuItem from '@/components/profile/ProfileMenuItem';

import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export default function CancelRequestScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [selectedReason, setSelectedReason] = useState('Changed my mind');
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(false);

  const reasons = [
    'Changed my mind',
    'Booked another service provider',
    'Technician taking too long',
    'Price higher than expected',
    'Other reason',
  ];

  const handleConfirmCancel = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Booking Cancelled', `Booking ${id || 'BK-98241'} has been cancelled. If any payment was made, full refund will be credited in 24 hours.`, [
        {
          text: 'OK',
          onPress: () => router.replace('/(tabs)/home' as any),
        },
      ]);
    }, 500);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header title="Cancel Booking" />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Please select a reason for cancellation</Text>

        {reasons.map((r) => (
          <ProfileMenuItem
            key={r}
            icon={selectedReason === r ? 'radio-button-on' : 'radio-button-off'}
            title={r}
            onPress={() => setSelectedReason(r)}
          />
        ))}

        <Input
          label="Additional Comments (Optional)"
          placeholder="Tell us how we can improve..."
          multiline
          numberOfLines={3}
          value={comments}
          onChangeText={setComments}
          style={styles.textArea}
        />

        <Button
          title="Confirm Cancellation"
          variant="danger"
          size="large"
          loading={loading}
          onPress={handleConfirmCancel}
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
  },
  title: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  textArea: {
    height: 80,
    marginTop: spacing.md,
  },
  btn: {
    marginTop: spacing.xl,
  },
});
