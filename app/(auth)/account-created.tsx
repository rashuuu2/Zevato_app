import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Button from '@/components/common/Button';
import useAuth from '@/hooks/useAuth';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export default function AccountCreatedScreen() {
  const router = useRouter();
  const { setAuth } = useAuth();

  const handleGoHome = () => {
    setAuth({
      isAuthenticated: true,
      user: {
        id: `user-${Date.now()}`,
        name: 'New Member',
        email: 'member@zevotacare.com',
        phone: '+91 98765 00000',
        addresses: [],
        paymentMethods: [],
      },
      token: 'new-account-token',
    });
    router.replace('/(tabs)/home' as any);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.circle}>
          <Ionicons name="checkmark-circle" size={80} color={colors.success} />
        </View>
        <Text style={styles.title}>Account Created!</Text>
        <Text style={styles.subtitle}>
          Welcome to Zevota Care. Your account is active and ready for your first appliance booking.
        </Text>

        <Button
          title="Go to Home Dashboard"
          variant="primary"
          size="large"
          onPress={handleGoHome}
          style={styles.btn}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    padding: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    marginBottom: spacing.md,
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
    marginTop: spacing.sm,
    marginBottom: spacing.xxl,
    lineHeight: 22,
  },
  btn: {
    width: '100%',
  },
});
