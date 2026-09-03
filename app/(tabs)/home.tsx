import React, { useState, useCallback } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import SubscriptionCard from '@/components/home/SubscriptionCard';
import QuickActions from '@/components/home/QuickActions';
import ServiceGrid from '@/components/home/ServiceGrid';
import ProtectionCard from '@/components/home/ProtectionCard';
import RecentRequestCard from '@/components/home/RecentRequestCard';
import SectionHeader from '@/components/common/SectionHeader';

import categories from '@/data/categories';
import { bookingService } from '@/services/bookings';
import useAuth from '@/hooks/useAuth';
import useBooking from '@/hooks/useBooking';
import { colors } from '@/constants/colors';
import { config } from '@/constants/config';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { ServiceCategory } from '@/types/service';
import { Booking } from '@/types/booking';

export default function HomeScreen() {
  const router = useRouter();
  const authState = useAuth();
  const { user } = authState;

  console.log('>>> [HOME SCREEN RENDER]', {
    isLoaded: authState.isLoaded,
    isSignedIn: authState.isSignedIn,
    userId: authState.userId,
    userName: user?.name,
    userEmail: user?.email,
    profileCompleted: user?.profileCompleted,
  });

  const { updateBooking, resetBooking } = useBooking();
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);

  const loadRecentBookings = useCallback(async () => {
    try {
      const allBookings = await bookingService.getAllBookings();
      // Show up to 3 most recent bookings
      setRecentBookings(allBookings.slice(0, 3));
    } catch (e) {
      console.warn('Failed to load bookings on Home:', e);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadRecentBookings();
    }, [loadRecentBookings])
  );

  const handleCategorySelect = (category: ServiceCategory) => {
    if (category.id === 'more') {
      router.push('/services' as any);
      return;
    }
    resetBooking();
    updateBooking({
      category,
      categoryId: category.id,
      categoryName: category.name,
    });
    router.push({
      pathname: '/services/brands' as any,
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

  // Build initials for avatar fallback
  const initials = (user?.name || 'U')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* ========== HEADER ========== */}
        <View style={styles.header}>
          {/* Left: Hamburger + Brand logo */}
          <View style={styles.headerLeft}>
            {/* TODO: implement drawer navigation */}
            <TouchableOpacity activeOpacity={0.7} style={styles.hamburgerBtn}>
              <Ionicons name="menu-outline" size={26} color={colors.text} />
            </TouchableOpacity>
            <View style={styles.brandLockup}>
              <Text style={styles.brandName}>Zevota</Text>
              <Text style={styles.brandSub}>CARE</Text>
            </View>
          </View>

          {/* Right: Notification bell + Avatar */}
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.notificationBtn}
              onPress={() => router.push('/profile/notifications' as any)}
              activeOpacity={0.7}
            >
              <Ionicons name="notifications-outline" size={22} color={colors.text} />
              <View style={styles.badgeDot} />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push('/(tabs)/profile' as any)}
            >
              {user?.avatarUrl ? (
                <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarFallback}>
                  <Text style={styles.avatarInitials}>{initials}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* ========== SUBSCRIPTION CARD ========== */}
        <SubscriptionCard
          planName="Premium Plan"
          planStatus="Active"
          walletBalance="₹1,00,000"
          expiryDate={user?.protectionPlanExpiry || '24 May 2025'}
          onPress={() => router.push('/profile/protection' as any)}
        />

        {/* ========== QUICK ACTIONS ========== */}
        <QuickActions
          onRequestService={() => router.push('/services' as any)}
          onMyServices={() => router.push('/requests' as any)}
        />

        {/* ========== EXPLORE SERVICES ========== */}
        <SectionHeader
          title="Explore Services"
          actionTitle="View All"
          onAction={() => router.push('/services' as any)}
        />
        <ServiceGrid categories={categories.slice(0, 8)} onSelectCategory={handleCategorySelect} />

        {/* ========== PROTECTION CARD ========== */}
        <ProtectionCard onLearnMore={() => router.push('/profile/protection' as any)} />

        {/* ========== RECENT REQUESTS ========== */}
        {recentBookings.length > 0 && (
          <>
            <SectionHeader
              title="Recent Requests"
              actionTitle="View All"
              onAction={() => router.push('/requests' as any)}
            />
            {recentBookings.map((booking) => (
              <RecentRequestCard
                key={booking.id}
                booking={booking}
                onPress={handleBookingSelect}
              />
            ))}
          </>
        )}

        {/* ========== DEV CONTROLS ========== */}
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

  /* ---- Header ---- */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  hamburgerBtn: {
    padding: 2,
  },
  brandLockup: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  brandName: {
    fontSize: typography.fontSize.xl + 2,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    letterSpacing: -0.5,
  },
  brandSub: {
    fontSize: typography.fontSize.xs - 2,
    fontWeight: typography.fontWeight.bold,
    color: colors.textMuted,
    letterSpacing: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  avatarFallback: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E8F0FF',
  },
  avatarInitials: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
  },

  /* ---- Dev Controls ---- */
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
