import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Button from '@/components/common/Button';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export default function BookingConfirmedScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const bookingId = id || 'BK-98241';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.iconCircle}>
          <Ionicons name="checkmark-circle" size={80} color={colors.success} />
        </View>

        <Text style={styles.title}>Booking Confirmed!</Text>
        <Text style={styles.bookingId}>Booking ID: {bookingId}</Text>
        <Text style={styles.desc}>
          Our certified technician has been assigned and will arrive at your scheduled time slot. You can track live updates.
        </Text>

        <Button
          title="Track Live Order"
          variant="primary"
          size="large"
          onPress={() => router.replace({ pathname: '/bookings/tracking' as any, params: { id: bookingId } })}
          style={styles.btn}
        />

        <Button
          title="Back to Home"
          variant="ghost"
          size="medium"
          onPress={() => router.replace('/(tabs)/home' as any)}
          style={styles.homeBtn}
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
  iconCircle: {
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.fontSize.heading,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  bookingId: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    marginTop: spacing.xs,
  },
  desc: {
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
  homeBtn: {
    marginTop: spacing.sm,
  },
});
