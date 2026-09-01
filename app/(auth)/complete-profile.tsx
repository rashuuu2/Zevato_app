import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Header from '@/components/common/Header';

import useAuth from '@/hooks/useAuth';
import { authService } from '@/services/auth';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { ZevotaUserMetadata } from '@/types/user';

export default function CompleteProfileScreen() {
  const router = useRouter();
  const { isLoaded, clerkUser, user } = useAuth();

  const existingMeta = (clerkUser?.unsafeMetadata || {}) as ZevotaUserMetadata;
  const existingAddr = existingMeta.address;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (clerkUser) {
      const initialName =
        clerkUser.fullName ||
        [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') ||
        user?.name ||
        '';
      setName(initialName);
      setEmail(clerkUser.primaryEmailAddress?.emailAddress || user?.email || '');
      setPhone(existingMeta.phone || clerkUser.primaryPhoneNumber?.phoneNumber || '');
      setStreet(existingAddr?.street || '');
      setCity(existingAddr?.city || 'Bengaluru');
      setState(existingAddr?.state || 'Karnataka');
      setPostalCode(existingAddr?.postalCode || '');
      setCountry(existingAddr?.country || 'India');
    }
  }, [clerkUser]);

  const validate = (): boolean => {
    if (!name.trim()) {
      setError('Please enter your full name');
      return false;
    }
    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    if (!phone.trim() || cleanPhone.length < 10) {
      setError('Please enter a valid phone number (at least 10 digits)');
      return false;
    }
    if (!street.trim()) {
      setError('Please enter your street address');
      return false;
    }
    if (!city.trim()) {
      setError('Please enter your city');
      return false;
    }
    if (!state.trim()) {
      setError('Please enter your state');
      return false;
    }
    const cleanZip = postalCode.replace(/[^0-9]/g, '');
    if (!postalCode.trim() || cleanZip.length < 4) {
      setError('Please enter a valid postal PIN code');
      return false;
    }
    if (!country.trim()) {
      setError('Please enter your country');
      return false;
    }
    setError('');
    return true;
  };

  const handleCompleteProfile = async () => {
    if (!validate()) return;

    if (!clerkUser) {
      setError('Clerk session not loaded. Please try logging in again.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const nameParts = name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const updatedUnsafeMetadata = {
        ...(clerkUser.unsafeMetadata || {}),
        profileCompleted: true,
        phone: phone.trim(),
        address: {
          street: street.trim(),
          city: city.trim(),
          state: state.trim(),
          postalCode: postalCode.trim(),
          country: country.trim(),
        },
      };

      await clerkUser.update({
        firstName,
        lastName,
        unsafeMetadata: updatedUnsafeMetadata,
      });

      router.replace('/home' as any);
    } catch (err: any) {
      console.error('Error updating Clerk profile metadata:', err);
      const errMsg = authService.formatAuthError(err);
      setError(errMsg);
      Alert.alert('Update Failed', errMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded || !clerkUser) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header title="Complete Profile" showBack={false} />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.iconHeaderBox}>
          <Ionicons name="person-circle-outline" size={56} color={colors.primary} />
        </View>

        <Text style={styles.title}>Complete Your Profile</Text>
        <Text style={styles.subtitle}>
          Please provide your contact details and primary service address for technician visits.
        </Text>

        <Input
          label="Full Name"
          placeholder="e.g. Alex Johnson"
          value={name}
          onChangeText={(txt) => {
            setName(txt);
            if (error) setError('');
          }}
          leftIcon={<Ionicons name="person-outline" size={20} color={colors.textSecondary} />}
        />

        <Input
          label="Email Address (Read-only)"
          value={email}
          editable={false}
          leftIcon={<Ionicons name="mail-outline" size={20} color={colors.textMuted} />}
          style={styles.readOnlyInput}
        />

        <Input
          label="Phone Number"
          placeholder="e.g. +91 98765 43210"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={(txt) => {
            setPhone(txt);
            if (error) setError('');
          }}
          leftIcon={<Ionicons name="call-outline" size={20} color={colors.textSecondary} />}
        />

        <Text style={styles.sectionHeader}>Primary Service Address</Text>

        <Input
          label="Street Address / House / Flat"
          placeholder="e.g. Flat 402, Green Valley Apartments, HSR Layout"
          value={street}
          onChangeText={(txt) => {
            setStreet(txt);
            if (error) setError('');
          }}
          leftIcon={<Ionicons name="home-outline" size={20} color={colors.textSecondary} />}
        />

        <Input
          label="City / Region"
          placeholder="e.g. Bengaluru"
          value={city}
          onChangeText={(txt) => {
            setCity(txt);
            if (error) setError('');
          }}
          leftIcon={<Ionicons name="location-outline" size={20} color={colors.textSecondary} />}
        />

        <Input
          label="State / Province"
          placeholder="e.g. Karnataka"
          value={state}
          onChangeText={(txt) => {
            setState(txt);
            if (error) setError('');
          }}
          leftIcon={<Ionicons name="map-outline" size={20} color={colors.textSecondary} />}
        />

        <Input
          label="Postal PIN Code"
          placeholder="e.g. 560102"
          keyboardType="number-pad"
          value={postalCode}
          onChangeText={(txt) => {
            setPostalCode(txt);
            if (error) setError('');
          }}
          leftIcon={<Ionicons name="pin-outline" size={20} color={colors.textSecondary} />}
        />

        <Input
          label="Country"
          placeholder="e.g. India"
          value={country}
          onChangeText={(txt) => {
            setCountry(txt);
            if (error) setError('');
          }}
          leftIcon={<Ionicons name="globe-outline" size={20} color={colors.textSecondary} />}
          error={error}
        />

        <Button
          title="Complete Profile & Continue"
          variant="primary"
          size="large"
          loading={loading}
          disabled={loading}
          onPress={handleCompleteProfile}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  container: {
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  iconHeaderBox: {
    alignSelf: 'center',
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: typography.fontSize.heading,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  sectionHeader: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  readOnlyInput: {
    backgroundColor: colors.surface,
    opacity: 0.8,
  },
  submitBtn: {
    marginTop: spacing.lg,
  },
});
