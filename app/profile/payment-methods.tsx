import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Modal, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import Header from '@/components/common/Header';
import ProfileMenuItem from '@/components/profile/ProfileMenuItem';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';

import useAuth from '@/hooks/useAuth';
import { userService } from '@/services/users';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { PaymentMethod } from '@/types/user';

export default function PaymentMethodsScreen() {
  const { user } = useAuth();
  const [methods, setMethods] = useState<PaymentMethod[]>(user?.paymentMethods || []);
  const [modalVisible, setModalVisible] = useState(false);
  const [methodType, setMethodType] = useState<'upi' | 'card'>('upi');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddPayment = async () => {
    if (methodType === 'upi' && !upiId.trim()) {
      Alert.alert('Validation Error', 'Please enter a valid UPI ID.');
      return;
    }
    if (methodType === 'card' && !cardNumber.trim()) {
      Alert.alert('Validation Error', 'Please enter card number.');
      return;
    }

    try {
      setLoading(true);
      const newMethod: PaymentMethod = {
        id: `pay-${Date.now()}`,
        type: methodType,
        title: methodType === 'upi' ? 'Google Pay / PhonePe (UPI)' : 'Credit Card',
        details: methodType === 'upi' ? upiId.trim() : `•••• ${cardNumber.slice(-4)}`,
        isDefault: false,
      };

      const updated = await userService.addPaymentMethod(newMethod);
      setMethods([...updated]);
      setModalVisible(false);
      setUpiId('');
      setCardNumber('');
      setLoading(false);
      Alert.alert('Payment Method Added', 'Your payment option has been saved successfully.');
    } catch (e: any) {
      setLoading(false);
      Alert.alert('Error', 'Failed to add payment method.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header title="Payment Methods" />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {methods.map((pm) => (
          <ProfileMenuItem
            key={pm.id}
            icon={pm.type === 'upi' ? 'qr-code-outline' : 'card-outline'}
            title={pm.title}
            subtitle={pm.details}
            badge={pm.isDefault ? 'DEFAULT' : undefined}
            onPress={() => {}}
          />
        ))}
        <Button
          title="+ Add New Payment Method"
          variant="outline"
          size="large"
          onPress={() => setModalVisible(true)}
          style={styles.btn}
        />
      </ScrollView>

      {/* Add Payment Method Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Payment Method</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.typeSelectorRow}>
              <TouchableOpacity
                style={[styles.typePill, methodType === 'upi' && styles.typePillActive]}
                onPress={() => setMethodType('upi')}
              >
                <Text style={[styles.typeText, methodType === 'upi' && styles.typeTextActive]}>UPI</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.typePill, methodType === 'card' && styles.typePillActive]}
                onPress={() => setMethodType('card')}
              >
                <Text style={[styles.typeText, methodType === 'card' && styles.typeTextActive]}>Debit / Credit Card</Text>
              </TouchableOpacity>
            </View>

            {methodType === 'upi' ? (
              <Input
                label="UPI ID / VPA"
                placeholder="username@okaxis or 9876543210@paytm"
                value={upiId}
                onChangeText={setUpiId}
              />
            ) : (
              <Input
                label="Card Number"
                placeholder="4532 •••• •••• 8890"
                value={cardNumber}
                onChangeText={setCardNumber}
                keyboardType="number-pad"
              />
            )}

            <Button
              title="Save Payment Method"
              variant="primary"
              size="large"
              loading={loading}
              disabled={loading}
              onPress={handleAddPayment}
              style={styles.modalSaveBtn}
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
  typeSelectorRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  typePill: {
    flex: 1,
    paddingVertical: spacing.xs + 2,
    borderRadius: spacing.radiusSm,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  typePillActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  typeText: {
    fontSize: typography.fontSize.xs + 1,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  typeTextActive: {
    color: colors.primary,
    fontWeight: typography.fontWeight.bold,
  },
  modalSaveBtn: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
});
