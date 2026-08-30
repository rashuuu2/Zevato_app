import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '@/components/common/Header';
import ProfileMenuItem from '@/components/profile/ProfileMenuItem';
import Button from '@/components/common/Button';

import useAuth from '@/hooks/useAuth';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';

export default function PaymentMethodsScreen() {
  const { user } = useAuth();
  const paymentMethods = user?.paymentMethods || [];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header title="Payment Methods" />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {paymentMethods.map((pm) => (
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
          onPress={() => Alert.alert('Add Payment', 'Payment modal opened')}
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
