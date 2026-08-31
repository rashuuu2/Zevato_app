import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import SubscriptionCard from '@/components/home/SubscriptionCard';
import ServiceGrid from '@/components/home/ServiceGrid';
import RecentRequestCard from '@/components/home/RecentRequestCard';
import ProtectionCard from '@/components/home/ProtectionCard';
import SectionHeader from '@/components/common/SectionHeader';

import categories from '@/data/categories';
import bookings from '@/data/bookings';
import useAuth from '@/hooks/useAuth';
import { colors } from '@/constants/colors';
import { config } from '@/constants/config';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { ServiceCategory } from '@/types/service';
import { Booking } from '@/types/booking';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const handleCategorySelect = (category: ServiceCategory) => {
    router.push({
      pathname: '/services/categories' as any,
      params: { categoryId: category.id, categoryName: category.name },
    });
  };

  const handleBookingSelect = (booking: Booking) => {
    router.push({
      pathname: '/bookings/tracking' as any,
      params: { id: booking.id },
    });
  };

  const handleResetOnboarding = async () => {
    try {
      await AsyncStorage.removeItem(config.storageKeys.onboardingCompleted);
      Alert.alert('Reset Successful', 'Onboarding state reset. Launching Welcome screen...', [
        {
          text: 'OK',
          onPress: () => router.replace('/(onboarding)/welcome' as any),
        },
      ]);
    } catch (error) {
      console.error('Failed to reset onboarding state', error);
    }
  };

  const activeBooking = bookings.find((b) => b.status === 'in_progress' || b.status === 'scheduled');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Custom Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greetingText}>Hello, {user?.name.split(' ')[0] || 'User'} 👋</Text>
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={14} color={colors.primary} />
              <Text style={styles.locationText} numberOfLines={1}>
                {user?.addresses[0]?.street || 'HSR Layout, Bengaluru'}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.notificationBtn}
            onPress={() => router.push('/profile/notifications' as any)}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={22} color={colors.text} />
            <View style={styles.badgeDot} />
          </TouchableOpacity>
        </View>

        {/* Subscription Plan Card */}
        <SubscriptionCard
          planName="Zevota Care Protection Plan"
          expiryDate={user?.protectionPlanExpiry || '31 Dec 2026'}
          onPress={() => router.push('/profile/protection' as any)}
        />

        {/* Explore Services Grid */}
        <SectionHeader
          title="Explore Services"
          actionTitle="See All"
          onAction={() => router.push('/(tabs)/services' as any)}
        />
        <ServiceGrid categories={categories.slice(0, 6)} onSelectCategory={handleCategorySelect} />

        {/* Recent Request / Active Order */}
        {activeBooking && (
          <>
            <SectionHeader
              title="Recent Request"
              actionTitle="View All"
              onAction={() => router.push('/(tabs)/requests' as any)}
            />
            <RecentRequestCard booking={activeBooking} onPress={handleBookingSelect} />
          </>
        )}

        {/* Protection Plan Banner */}
        <ProtectionCard onLearnMore={() => router.push('/profile/protection' as any)} />

        {/* Dev Quick Test Reset Banner */}
        <View style={styles.devBox}>
          <Text style={styles.devTitle}>Development Controls</Text>
          <TouchableOpacity style={styles.resetBtn} onPress={handleResetOnboarding} activeOpacity={0.8}>
            <Ionicons name="refresh-circle-outline" size={18} color={colors.primary} />
            <Text style={styles.resetBtnText}>Reset Onboarding Flow</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  greetingText: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 4,
  },
  locationText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    maxWidth: 220,
  },
  notificationBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
  },
  badgeDot: {
    position: 'absolute',
    top: 8,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.danger,
  },
  devBox: {
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: spacing.radiusMd,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  devTitle: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  resetBtnText: {
    fontSize: typography.fontSize.xs + 1,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
});
