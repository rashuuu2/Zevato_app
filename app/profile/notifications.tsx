import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '@/components/common/Header';
import ProfileMenuItem from '@/components/profile/ProfileMenuItem';

import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';

export default function NotificationsScreen() {
  const notifs = [
    { id: '1', title: 'Technician Assigned', sub: 'Ramesh Kumar has been assigned for AC Jet Service', time: '10 mins ago' },
    { id: '2', title: 'Annual Service Due', sub: 'Your Washing Machine annual tune-up is due this week', time: '1 day ago' },
    { id: '3', title: 'Offer: 20% Off RO Filter', sub: 'Use code FILTER20 on your next purifier service', time: '3 days ago' },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header title="Notifications" />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {notifs.map((n) => (
          <ProfileMenuItem
            key={n.id}
            icon="notifications-outline"
            title={n.title}
            subtitle={`${n.sub} • ${n.time}`}
            onPress={() => {}}
          />
        ))}
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
});
