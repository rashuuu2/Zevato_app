import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import RequestTabs from '@/components/requests/RequestTabs';
import RecentRequestCard from '@/components/home/RecentRequestCard';
import EmptyState from '@/components/common/EmptyState';

import bookings from '@/data/bookings';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { Booking } from '@/types/booking';

export default function RequestsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed'>('all');

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'active') return b.status === 'in_progress' || b.status === 'scheduled';
    if (activeTab === 'completed') return b.status === 'completed';
    return true;
  });

  const handleBookingPress = (booking: Booking) => {
    if (booking.status === 'completed') {
      router.push({ pathname: '/bookings/completed' as any, params: { id: booking.id } });
    } else {
      router.push({ pathname: '/bookings/tracking' as any, params: { id: booking.id } });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <Text style={styles.pageTitle}>My Bookings & Requests</Text>

        <RequestTabs activeTab={activeTab} onChangeTab={setActiveTab} />

        <FlatList
          data={filteredBookings}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <RecentRequestCard booking={item} onPress={handleBookingPress} />
          )}
          ListEmptyComponent={() => (
            <EmptyState
              icon="clipboard-outline"
              title="No Bookings Found"
              description="You do not have any active or past service bookings in this tab."
              actionTitle="Book a Service"
              onAction={() => router.push('/(tabs)/services' as any)}
            />
          )}
          contentContainerStyle={styles.listContent}
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
  },
  pageTitle: {
    fontSize: typography.fontSize.heading,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
  },
  listContent: {
    paddingTop: spacing.xs,
    paddingBottom: spacing.xl,
  },
});
