import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import RequestTabs, { RequestTabKey } from '@/components/requests/RequestTabs';
import RequestCard from '@/components/requests/RequestCard';
import EmptyState from '@/components/common/EmptyState';

import useAuth from '@/hooks/useAuth';
import { bookingService } from '@/services/bookings';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { Booking } from '@/types/booking';

export default function RequestsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<RequestTabKey>('all');
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

  // Dynamic tab counts calculation
  const counts = {
    all: bookingList.length,
    in_progress: bookingList.filter(
      (b) => b.status === 'in_progress' || b.status === 'technician_assigned' || b.status === 'scheduled'
    ).length,
    completed: bookingList.filter((b) => b.status === 'completed').length,
    cancelled: bookingList.filter((b) => b.status === 'cancelled').length,
  };

  const filteredBookings = bookingList.filter((b) => {
    if (activeTab === 'in_progress') {
      return b.status === 'in_progress' || b.status === 'scheduled' || b.status === 'technician_assigned';
    }
    if (activeTab === 'completed') {
      return b.status === 'completed';
    }
    if (activeTab === 'cancelled') {
      return b.status === 'cancelled';
    }
    return true;
  });

  const handleBookingPress = (booking: Booking) => {
    router.push({ pathname: '/bookings/[id]' as any, params: { id: booking.id } });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* 1. Header */}
      <View style={styles.headerContainer}>
        {/* Top Branding & Actions Row */}
        <View style={styles.topBrandRow}>
          <View style={styles.brandGroup}>
            <Text style={styles.brandLogo}>Zevota</Text>
            <Text style={styles.brandSub}>CARE</Text>
          </View>

          <View style={styles.headerActions}>
            {/* Notification Bell with Badge */}
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => router.push('/profile/notifications' as any)}
              activeOpacity={0.7}
            >
              <Ionicons name="notifications-outline" size={22} color={colors.text} />
              <View style={styles.bellBadge}>
                <Text style={styles.bellBadgeText}>3</Text>
              </View>
            </TouchableOpacity>

            {/* Profile Avatar */}
            <TouchableOpacity
              style={styles.avatarWrapper}
              onPress={() => router.push('/profile' as any)}
              activeOpacity={0.8}
            >
              {user?.avatarUrl ? (
                <Image source={{ uri: user.avatarUrl }} style={styles.avatarImg} />
              ) : (
                <View style={styles.avatarFallback}>
                  <Text style={styles.avatarInitial}>
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Page Title & Subtitle */}
        <View style={styles.pageTitleBlock}>
          <Text style={styles.pageTitle}>My Requests</Text>
          <Text style={styles.pageSubtitle}>Track and manage all your service requests</Text>
        </View>
      </View>

      {/* 2. Filter Tabs */}
      <View style={styles.tabsWrapper}>
        <RequestTabs activeTab={activeTab} onChangeTab={setActiveTab} counts={counts} />
      </View>

      {/* 3. Request Cards & 4. Bottom Info Sections */}
      <FlatList
        data={filteredBookings}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
        renderItem={({ item }) => <RequestCard booking={item} onPress={handleBookingPress} />}
        ListEmptyComponent={() => (
          <EmptyState
            icon="clipboard-outline"
            title="No Requests Found"
            description="You do not have any service requests in this category."
            actionTitle="Explore & Book Services"
            onAction={() => router.push('/services' as any)}
          />
        )}
        ListFooterComponent={() => (
          <View style={styles.footerContainer}>
            {/* Need Help Card (Light Blue) */}
            <View style={styles.supportCard}>
              <View style={styles.supportIconBox}>
                <Ionicons name="headset-outline" size={24} color={colors.primary} />
              </View>
              <View style={styles.supportTextGroup}>
                <Text style={styles.supportTitle}>Need help with a request?</Text>
                <Text style={styles.supportDesc}>
                  Facing any issues or have questions about your technician visit?
                </Text>
              </View>
              <TouchableOpacity
                style={styles.supportBtn}
                onPress={() => router.push('/profile/contact-support' as any)}
                activeOpacity={0.8}
              >
                <Ionicons name="chatbubbles-outline" size={16} color={colors.primary} />
                <Text style={styles.supportBtnText}>Contact Support</Text>
              </TouchableOpacity>
            </View>

            {/* Zevota Care Protection Card (Light Green) */}
            <View style={styles.protectionCard}>
              <View style={styles.protectionIconBox}>
                <Ionicons name="shield-checkmark" size={24} color="#0E9355" />
              </View>
              <View style={styles.protectionTextGroup}>
                <Text style={styles.protectionTitle}>Zevota Care Protection</Text>
                <Text style={styles.protectionDesc}>
                  Get unlimited labor warranty, priority technician dispatch & free inspections.
                </Text>
              </View>
              <TouchableOpacity
                style={styles.protectionBtn}
                onPress={() => router.push('/profile/protection' as any)}
                activeOpacity={0.8}
              >
                <Ionicons name="ribbon-outline" size={16} color="#0E9355" />
                <Text style={styles.protectionBtnText}>Explore Plans</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerContainer: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F4F9',
  },
  topBrandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  brandGroup: {
    justifyContent: 'center',
  },
  brandLogo: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    letterSpacing: -0.5,
  },
  brandSub: {
    fontSize: 9,
    fontWeight: typography.fontWeight.bold,
    color: colors.textMuted,
    letterSpacing: 2,
    marginTop: -2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  actionBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  bellBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bellBadgeText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: typography.fontWeight.bold,
  },
  avatarWrapper: {
    width: 38,
    height: 38,
    borderRadius: 19,
    overflow: 'hidden',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  avatarFallback: {
    width: '100%',
    height: '100%',
    backgroundColor: '#9333EA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    color: colors.white,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  pageTitleBlock: {
    marginTop: spacing.xs,
  },
  pageTitle: {
    fontSize: typography.fontSize.heading + 2,
    fontWeight: typography.fontWeight.bold,
    color: '#0F172A',
  },
  pageSubtitle: {
    fontSize: typography.fontSize.xs + 1,
    color: '#64748B',
    marginTop: 2,
  },
  tabsWrapper: {
    backgroundColor: colors.white,
    paddingBottom: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F4F9',
  },
  listContent: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  footerContainer: {
    marginTop: spacing.xs,
    paddingHorizontal: spacing.md,
    gap: spacing.sm + 2,
    paddingBottom: spacing.lg,
  },
  supportCard: {
    backgroundColor: '#F0F6FF',
    borderRadius: spacing.radiusMd + 2,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#D4E5FF',
    gap: spacing.sm,
  },
  supportIconBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  supportTextGroup: {
    gap: 2,
  },
  supportTitle: {
    fontSize: typography.fontSize.sm + 1,
    fontWeight: typography.fontWeight.bold,
    color: '#1E40AF',
  },
  supportDesc: {
    fontSize: typography.fontSize.xs,
    color: '#3B82F6',
    lineHeight: 18,
  },
  supportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: spacing.xs + 4,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.radiusSm,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
  },
  supportBtnText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  protectionCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: spacing.radiusMd + 2,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#DCFCE7',
    gap: spacing.sm,
  },
  protectionIconBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  protectionTextGroup: {
    gap: 2,
  },
  protectionTitle: {
    fontSize: typography.fontSize.sm + 1,
    fontWeight: typography.fontWeight.bold,
    color: '#166534',
  },
  protectionDesc: {
    fontSize: typography.fontSize.xs,
    color: '#15803D',
    lineHeight: 18,
  },
  protectionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: spacing.xs + 4,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.radiusSm,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: '#0E9355',
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
  },
  protectionBtnText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: '#0E9355',
  },
});
