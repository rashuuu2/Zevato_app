import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '@/components/common/Header';
import AddressCard from '@/components/booking/AddressCard';
import Button from '@/components/common/Button';

import useAuth from '@/hooks/useAuth';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';

export default function AddressesScreen() {
  const { user } = useAuth();
  const addresses = user?.addresses || [];

  const handleAdd = () => {
    Alert.alert('Add Address', 'Address addition form would open here.');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header title="Saved Addresses" />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {addresses.map((addr) => (
          <AddressCard key={addr.id} address={addr} />
        ))}
        <Button title="+ Add New Address" variant="outline" size="large" onPress={handleAdd} style={styles.btn} />
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
