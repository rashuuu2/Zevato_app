import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '@/components/common/Header';
import ProfileMenuItem from '@/components/profile/ProfileMenuItem';
import EmptyState from '@/components/common/EmptyState';

import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';

interface NotificationItem {
  id: string;
  title: string;
  sub: string;
  time: string;
}

export default function NotificationsScreen() {
  const [notifs] = useState<NotificationItem[]>([]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header title="Notifications" />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {notifs.length === 0 ? (
          <EmptyState
            icon="notifications-outline"
            title="No Notifications"
            description="You are all caught up! Real-time service updates and booking alerts will appear here."
          />
        ) : (
          notifs.map((n) => (
            <ProfileMenuItem
              key={n.id}
              icon="notifications-outline"
              title={n.title}
              subtitle={`${n.sub} • ${n.time}`}
              onPress={() => {}}
            />
          ))
        )}
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
    paddingBottom: spacing.xl,
  },
});
