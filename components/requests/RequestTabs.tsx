import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export type RequestTabKey = 'all' | 'in_progress' | 'completed' | 'cancelled';

export interface RequestTabsProps {
  activeTab: RequestTabKey;
  onChangeTab: (tab: RequestTabKey) => void;
  counts?: {
    all: number;
    in_progress: number;
    completed: number;
    cancelled: number;
  };
}

export const RequestTabs: React.FC<RequestTabsProps> = ({
  activeTab,
  onChangeTab,
  counts = { all: 0, in_progress: 0, completed: 0, cancelled: 0 },
}) => {
  const tabs: { key: RequestTabKey; label: string; count: number }[] = [
    { key: 'all', label: 'All Requests', count: counts.all },
    { key: 'in_progress', label: 'In Progress', count: counts.in_progress },
    { key: 'completed', label: 'Completed', count: counts.completed },
    { key: 'cancelled', label: 'Cancelled', count: counts.cancelled },
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[styles.pill, isActive && styles.activePill]}
            onPress={() => onChangeTab(tab.key)}
            activeOpacity={0.75}
          >
            <Text style={[styles.pillText, isActive && styles.activePillText]}>
              {tab.label} ({tab.count})
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    gap: spacing.xs + 2,
  },
  pill: {
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.radiusFull,
    backgroundColor: '#EEF2F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activePill: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  pillText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: '#4B5565',
  },
  activePillText: {
    color: colors.white,
    fontWeight: typography.fontWeight.bold,
  },
});

export default RequestTabs;
