import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '@/components/common/Header';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';

import useAuth from '@/hooks/useAuth';
import { authService } from '@/services/auth';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';

export default function PersonalInfoScreen() {
  const { user, clerkUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone === 'Add phone number' ? '' : user?.phone || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone === 'Add phone number' ? '' : user.phone);
    }
  }, [user?.name, user?.email, user?.phone]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Full name cannot be empty.');
      return;
    }

    try {
      setLoading(true);
      if (clerkUser) {
        const nameParts = name.trim().split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        await clerkUser.update({
          firstName,
          lastName,
          unsafeMetadata: {
            ...(clerkUser.unsafeMetadata || {}),
            phone: phone.trim(),
          },
        });
      }
      setLoading(false);
      Alert.alert('Profile Updated', 'Your personal details have been updated successfully.');
    } catch (e: any) {
      setLoading(false);
      const errMsg = authService.formatAuthError(e);
      Alert.alert('Error', errMsg || 'Failed to update profile.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header title="Personal Information" />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Input label="Full Name" value={name} onChangeText={setName} />
        <Input label="Email Address (Read-only)" value={email} editable={false} keyboardType="email-address" />
        <Input label="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

        <Button
          title="Save Changes"
          variant="primary"
          size="large"
          loading={loading}
          disabled={loading}
          onPress={handleSave}
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
  btn: {
    marginTop: spacing.md,
  },
});
