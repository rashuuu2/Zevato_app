import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

import ProfileHeader from '@/components/profile/ProfileHeader';
import AccountStats from '@/components/profile/AccountStats';
import ProfileMenuItem from '@/components/profile/ProfileMenuItem';
import SectionHeader from '@/components/common/SectionHeader';

import useAuth from '@/hooks/useAuth';
import { bookingService } from '@/services/bookings';
import { colors } from '@/constants/colors';
import { config } from '@/constants/config';
import { spacing } from '@/constants/spacing';
import { Booking } from '@/types/booking';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [activeCount, setActiveCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const loadStats = async () => {
      const all = await bookingService.getAllBookings();
      setTotalCount(all.length);
      const active = all.filter(
        (b) => b.status === 'scheduled' || b.status === 'in_progress' || b.status === 'technician_assigned'
      );
      setActiveCount(active.length);
    };
    loadStats();
  }, []);

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out of your Zevota account?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          try {
            if (signOut) {
              await signOut();
            }
          } catch (e) {
            console.error('Error signing out:', e);
          } finally {
            router.replace('/(auth)/login' as any);
          }
        },
      },
    ]);
  };

  const handleResetOnboarding = async () => {
    try {
      await AsyncStorage.removeItem(config.storageKeys.onboardingCompleted);
      Alert.alert('Onboarding Reset', 'Onboarding state reset. Navigating to Welcome...', [
        { text: 'OK', onPress: () => router.replace('/(onboarding)/welcome' as any) },
      ]);
    } catch (e) {
      console.error(e);
    }
  };

  if (!user) return null;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <ProfileHeader
          user={user}
          onEditPress={() => router.push('/profile/personal-info' as any)}
        />

        <AccountStats
          activeBookingsCount={activeCount}
          totalServicesCount={totalCount}
          savedAmount={1450}
        />

        <SectionHeader title="Account Settings" />
        <ProfileMenuItem
          icon="person-outline"
          title="Personal Information"
          subtitle="Name, phone number, email address"
          onPress={() => router.push('/profile/personal-info' as any)}
        />
        <ProfileMenuItem
          icon="location-outline"
          title="Saved Addresses"
          subtitle="Home, office & alternate locations"
          badge={`${user.addresses?.length || 0}`}
          onPress={() => router.push('/profile/addresses' as any)}
        />
        <ProfileMenuItem
          icon="card-outline"
          title="Payment Methods"
          subtitle="Cards, UPI & net banking"
          onPress={() => router.push('/profile/payment-methods' as any)}
        />
        <ProfileMenuItem
          icon="receipt-outline"
          title="Invoices & Downloads"
          subtitle="Tax invoices and billing receipts"
          onPress={() => router.push('/profile/invoices' as any)}
        />

        <SectionHeader title="Plans & Benefits" />
        <ProfileMenuItem
          icon="shield-checkmark-outline"
          title="Zevota Protection Plan"
          subtitle="Active annual care plan details"
          badge="ACTIVE"
          onPress={() => router.push('/profile/protection' as any)}
        />
        <ProfileMenuItem
          icon="gift-outline"
          title="Refer & Earn"
          subtitle="Invite friends and get ₹200 care credits"
          onPress={() => router.push('/profile/refer-earn' as any)}
        />

        <SectionHeader title="Support & Legal" />
        <ProfileMenuItem
          icon="notifications-outline"
          title="Notifications"
          subtitle="Booking updates and promos"
          onPress={() => router.push('/profile/notifications' as any)}
        />
        <ProfileMenuItem
          icon="help-circle-outline"
          title="Help Center & FAQs"
          subtitle="Common questions and service guides"
          onPress={() => router.push('/profile/help-center' as any)}
        />
        <ProfileMenuItem
          icon="chatbubbles-outline"
          title="Contact Customer Support"
          subtitle="24/7 priority customer support line"
          onPress={() => router.push('/profile/contact-support' as any)}
        />
        <ProfileMenuItem
          icon="information-circle-outline"
          title="About Zevota Care"
          subtitle="App version 1.0.0"
          onPress={() => router.push('/profile/about' as any)}
        />
        <ProfileMenuItem
          icon="refresh-outline"
          title="Reset Onboarding Flow (Dev)"
          subtitle="Test the initial splash & welcome experience"
          onPress={handleResetOnboarding}
        />
        <ProfileMenuItem
          icon="log-out-outline"
          title="Sign Out"
          destructive
          onPress={handleLogout}
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
  scrollContent: {
    paddingBottom: spacing.xl,
  },
});
