import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '@/components/common/Header';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';

import useAuth from '@/hooks/useAuth';
import { userStore } from '@/store/userStore';
import { userService } from '@/services/users';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';

export default function PersonalInfoScreen() {
  const { user } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      const updated = await userService.updateProfile({ name, email, phone });
      userStore.updateProfile(updated);
      setLoading(false);
      Alert.alert('Profile Updated', 'Your personal details have been updated successfully.');
    } catch (e) {
      setLoading(false);
      Alert.alert('Error', 'Failed to update profile.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header title="Personal Information" />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Input label="Full Name" value={name} onChangeText={setName} />
        <Input label="Email Address" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <Input label="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

        <Button
          title="Save Changes"
          variant="primary"
          size="large"
          loading={loading}
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
