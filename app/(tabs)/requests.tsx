import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import RequestTabs from '@/components/requests/RequestTabs';
import RecentRequestCard from '@/components/home/RecentRequestCard';
import EmptyState from '@/components/common/EmptyState';

import { bookingService } from '@/services/bookings';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { Booking } from '@/types/booking';

export default function RequestsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed'>('all');
  const [bookingList, setBookingList] = useState<Booking[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const data = await bookingService.getAllBookings();
      setBookingList([...data]);
    } catch (e) {
      console.warn('Failed to load bookings:', e);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const filteredBookings = bookingList.filter((b) => {
    if (activeTab === 'active') {
      return b.status === 'in_progress' || b.status === 'scheduled' || b.status === 'technician_assigned';
    }
    if (activeTab === 'completed') {
      return b.status === 'completed';
    }
    return true;
  });

  const handleBookingPress = (booking: Booking) => {
    router.push({ pathname: '/bookings/[id]' as any, params: { id: booking.id } });
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
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
          renderItem={({ item }) => (
            <RecentRequestCard booking={item} onPress={handleBookingPress} />
          )}
          ListEmptyComponent={() => (
            <EmptyState
              icon="clipboard-outline"
              title="No Bookings Found"
              description="You do not have any service bookings in this category."
              actionTitle="Explore & Book Services"
              onAction={() => router.push('/services' as any)}
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
