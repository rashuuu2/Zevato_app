import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Header from '@/components/common/Header';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export default function CompleteProfileScreen() {
  const router = useRouter();

  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');

  const handleNext = () => {
    router.push('/(auth)/set-password' as any);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header title="Complete Profile" />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Primary Address</Text>
        <Text style={styles.subtitle}>Where should our certified technicians perform your services?</Text>

        <Input
          label="House / Flat / Street Address"
          placeholder="e.g. Flat 402, Green Valley Apartments"
          value={street}
          onChangeText={setStreet}
          leftIcon={<Ionicons name="home-outline" size={20} color={colors.textSecondary} />}
        />

        <Input
          label="City / Region"
          placeholder="e.g. Bengaluru"
          value={city}
          onChangeText={setCity}
          leftIcon={<Ionicons name="location-outline" size={20} color={colors.textSecondary} />}
        />

        <Input
          label="Postal PIN Code"
          placeholder="e.g. 560102"
          keyboardType="number-pad"
          value={zipCode}
          onChangeText={setZipCode}
          leftIcon={<Ionicons name="pin-outline" size={20} color={colors.textSecondary} />}
        />

        <Button
          title="Continue to Set Password"
          variant="primary"
          size="large"
          onPress={handleNext}
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
    padding: spacing.xl,
  },
  title: {
    fontSize: typography.fontSize.heading,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
  },
  btn: {
    marginTop: spacing.md,
  },
});
