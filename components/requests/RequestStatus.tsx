import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RequestStatus as StatusType } from '@/types/request';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export interface RequestStatusProps {
  status: StatusType;
}

export const RequestStatus: React.FC<RequestStatusProps> = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'pending':
        return { label: 'Pending Quote', bg: colors.warningLight, text: colors.warning };
      case 'quoted':
        return { label: 'Quote Ready', bg: colors.infoLight, text: colors.info };
      case 'approved':
      case 'in_progress':
        return { label: 'In Progress', bg: colors.primaryLight, text: colors.primary };
      case 'completed':
        return { label: 'Completed', bg: colors.successLight, text: colors.success };
      case 'cancelled':
        return { label: 'Cancelled', bg: colors.dangerLight, text: colors.danger };
      default:
        return { label: status, bg: colors.divider, text: colors.textSecondary };
    }
  };

  const config = getStatusConfig();

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <Text style={[styles.text, { color: config.text }]}>{config.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 2,
    paddingHorizontal: spacing.xs + 2,
    borderRadius: spacing.radiusFull,
  },
  text: {
    fontSize: typography.fontSize.xs - 1,
    fontWeight: typography.fontWeight.bold,
  },
});

export default RequestStatus;
