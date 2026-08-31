import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Modal, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import Header from '@/components/common/Header';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import BookingStepper from '@/components/booking/BookingStepper';
import AddressCard from '@/components/booking/AddressCard';
import SectionHeader from '@/components/common/SectionHeader';

import useAuth from '@/hooks/useAuth';
import useBooking from '@/hooks/useBooking';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { Address } from '@/types/user';

export default function AddressScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { draft, updateBooking } = useBooking();

  const [addresses, setAddresses] = useState<Address[]>(user?.addresses || []);

  const [selectedAddr, setSelectedAddr] = useState<Address>(
    draft.address || (user?.addresses && user.addresses.length > 0 ? user.addresses[0] : ({} as Address))
  );

  // New Address Form Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('Bengaluru');
  const [newState, setNewState] = useState('Karnataka');
  const [newZip, setNewZip] = useState('');

  const handleAddNewAddress = () => {
    if (!newStreet.trim() || !newZip.trim()) {
      Alert.alert('Required Fields', 'Please enter street address and postal code.');
      return;
    }

    const createdAddress: Address = {
      id: `addr-${Date.now()}`,
      title: newTitle.trim() || 'Home',
      street: newStreet.trim(),
      city: newCity.trim(),
      state: newState.trim(),
      zipCode: newZip.trim(),
    };

    setAddresses((prev) => [createdAddress, ...prev]);
    setSelectedAddr(createdAddress);
    setShowAddModal(false);
    setNewTitle('');
    setNewStreet('');
    setNewZip('');
  };

  const handleNext = () => {
    if (!selectedAddr) {
      Alert.alert('Select Address', 'Please select a service location address.');
      return;
    }

    updateBooking({ address: selectedAddr });
    router.push('/services/payment' as any);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header title="Select Address" />
      <BookingStepper currentStep={2} />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <SectionHeader
          title="Service Location Address"
          actionTitle="+ Add New"
          onAction={() => setShowAddModal(true)}
        />

        {addresses.map((addr) => (
          <AddressCard
            key={addr.id}
            address={addr}
            selected={selectedAddr?.id === addr.id}
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

      {/* Add New Address Modal */}
      <Modal visible={showAddModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Address</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <Input
              label="Address Label (e.g. Home, Office)"
              placeholder="e.g. Home"
              value={newTitle}
              onChangeText={setNewTitle}
            />
            <Input
              label="Street & Apartment"
              placeholder="House/Flat No., Street Name, Area"
              value={newStreet}
              onChangeText={setNewStreet}
            />
            <Input
              label="City"
              placeholder="Bengaluru"
              value={newCity}
              onChangeText={setNewCity}
            />
            <Input
              label="Postal Code (PIN)"
              placeholder="560102"
              keyboardType="number-pad"
              value={newZip}
              onChangeText={setNewZip}
            />

            <Button
              title="Save & Select Address"
              variant="primary"
              size="large"
              onPress={handleAddNewAddress}
              style={styles.modalBtn}
            />
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: spacing.radiusLg,
    borderTopRightRadius: spacing.radiusLg,
    padding: spacing.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  modalTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  modalBtn: {
    marginTop: spacing.md,
  },
});
