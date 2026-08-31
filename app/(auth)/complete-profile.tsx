import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Header from '@/components/common/Header';
import { userStore } from '@/store/userStore';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export default function CompleteProfileScreen() {
  const router = useRouter();

  const [phone, setPhone] = useState('+91 ');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [zipCode, setZipCode] = useState('');

  const handleNext = () => {
    if (phone.trim()) {
      userStore.updateProfile({ phone: phone.trim() });
    }
    if (street.trim()) {
      userStore.addAddress({
        id: `addr-${Date.now()}`,
        title: 'Home',
        street: street.trim(),
        city: city.trim() || 'Bengaluru',
        state: 'Karnataka',
        zipCode: zipCode.trim() || '560102',
        isDefault: true,
        type: 'home',
      });
    }

    router.replace('/(auth)/account-created' as any);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header title="Complete Profile" />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Primary Service Address</Text>
        <Text style={styles.subtitle}>Where should our certified technicians perform your appliance services?</Text>

        <Input
          label="Phone Number"
          placeholder="e.g. +91 98765 43210"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          leftIcon={<Ionicons name="call-outline" size={20} color={colors.textSecondary} />}
        />

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
          title="Save Address & Continue"
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
