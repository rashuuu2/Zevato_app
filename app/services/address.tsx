import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '@/components/common/Header';
import Button from '@/components/common/Button';
import BookingStepper from '@/components/booking/BookingStepper';
import AddressCard from '@/components/booking/AddressCard';
import SectionHeader from '@/components/common/SectionHeader';

import useAuth from '@/hooks/useAuth';
import useBooking from '@/hooks/useBooking';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { Address } from '@/types/user';

export default function AddressScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { updateBooking } = useBooking();

  const userAddresses = user?.addresses || [
    {
      id: 'addr-1',
      title: 'Home',
      street: 'Flat 402, Green Valley Apartments, HSR Layout',
      city: 'Bengaluru',
      state: 'Karnataka',
      zipCode: '560102',
      isDefault: true,
    },
  ];

  const [selectedAddr, setSelectedAddr] = useState<Address>(userAddresses[0]);

  const handleNext = () => {
    updateBooking({ address: selectedAddr });
    router.push('/services/payment' as any);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header title="Select Address" />
      <BookingStepper currentStep={2} />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <SectionHeader
          title="Service Location"
          actionTitle="+ Add New"
          onAction={() => router.push('/profile/addresses' as any)}
        />
        {userAddresses.map((addr) => (
          <AddressCard
            key={addr.id}
            address={addr}
            selected={selectedAddr.id === addr.id}
            onSelect={setSelectedAddr}
          />
        ))}

        <Button
          title="Proceed to Payment"
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
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  btn: {
    marginTop: spacing.xl,
  },
});
