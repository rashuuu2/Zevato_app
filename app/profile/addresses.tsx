import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Modal, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import Header from '@/components/common/Header';
import AddressCard from '@/components/booking/AddressCard';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import EmptyState from '@/components/common/EmptyState';

import useAuth from '@/hooks/useAuth';
import { userService } from '@/services/users';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { Address } from '@/types/user';

export default function AddressesScreen() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>(user?.addresses || []);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State
  const [title, setTitle] = useState('Home');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [stateName, setStateName] = useState('Karnataka');
  const [zipCode, setZipCode] = useState('560102');
  const [isDefault, setIsDefault] = useState(false);

  const loadAddresses = async () => {
    const list = await userService.getAddresses();
    setAddresses([...list]);
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const handleAddAddress = async () => {
    if (!street.trim()) {
      Alert.alert('Validation Error', 'Please enter your street address.');
      return;
    }

    try {
      setLoading(true);
      const updatedList = await userService.addAddress({
        title: title.trim() || 'Home',
        street: street.trim(),
        city: city.trim() || 'Bengaluru',
        state: stateName.trim() || 'Karnataka',
        zipCode: zipCode.trim() || '560102',
        country: 'India',
        isDefault,
        type: 'home',
      });

      setAddresses([...updatedList]);
      setModalVisible(false);
      setStreet('');
      setLoading(false);
      Alert.alert('Address Saved', 'Your new service address has been added successfully.');
    } catch (e: any) {
      setLoading(false);
      Alert.alert('Error', e.message || 'Failed to save address.');
    }
  };

  const handleDeleteAddress = async (id: string) => {
    Alert.alert('Delete Address', 'Are you sure you want to delete this address?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await userService.deleteAddress(id);
          const updated = addresses.filter((a) => a.id !== id);
          setAddresses(updated);
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header title="Saved Addresses" />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {addresses.length === 0 ? (
          <EmptyState
            icon="location-outline"
            title="No Saved Addresses"
            description="Add a service address to quickly book home care services."
          />
        ) : (
          addresses.map((addr) => (
            <View key={addr.id} style={styles.cardWrapper}>
              <AddressCard address={addr} />
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleDeleteAddress(addr.id)}
                activeOpacity={0.7}
              >
                <Ionicons name="trash-outline" size={18} color={colors.danger} />
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          ))
        )}

        <Button
          title="+ Add New Address"
          variant="outline"
          size="large"
          onPress={() => setModalVisible(true)}
          style={styles.btn}
        />
      </ScrollView>

      {/* Add Address Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Service Address</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Input label="Address Title" placeholder="e.g. Home, Office, Parents" value={title} onChangeText={setTitle} />
              <Input label="Street & Flat No." placeholder="Flat 402, Green Valley Apartments, HSR Layout" value={street} onChangeText={setStreet} multiline />
              <Input label="City" value={city} onChangeText={setCity} />
              <Input label="State" value={stateName} onChangeText={setStateName} />
              <Input label="Postal / ZIP Code" value={zipCode} onChangeText={setZipCode} keyboardType="number-pad" />

              <Button
                title="Save Address"
                variant="primary"
                size="large"
                loading={loading}
                disabled={loading}
                onPress={handleAddAddress}
                style={styles.modalSaveBtn}
              />
            </ScrollView>
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
  cardWrapper: {
    marginBottom: spacing.xs,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    marginTop: -4,
    marginBottom: spacing.sm,
    paddingRight: spacing.xs,
  },
  deleteText: {
    fontSize: typography.fontSize.xs,
    color: colors.danger,
    fontWeight: typography.fontWeight.semibold,
  },
  btn: {
    marginTop: spacing.md,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: spacing.radiusLg,
    borderTopRightRadius: spacing.radiusLg,
    padding: spacing.md,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  modalTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  modalSaveBtn: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
});
