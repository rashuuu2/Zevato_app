import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ServiceRequest } from '@/types/request';
import RequestStatus from './RequestStatus';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { formatCurrency } from '@/utils/formatCurrency';

export interface RequestCardProps {
  request: ServiceRequest;
  onPress: (req: ServiceRequest) => void;
}

export const RequestCard: React.FC<RequestCardProps> = ({ request, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(request)} activeOpacity={0.8}>
      <View style={styles.header}>
        <Text style={styles.id}>{request.id}</Text>
        <RequestStatus status={request.status} />
      </View>
      <Text style={styles.category}>{request.categoryName}</Text>
      {request.productName && <Text style={styles.product}>{request.productName}</Text>}
      <Text style={styles.desc} numberOfLines={2}>
        {request.issueDescription}
      </Text>
      <View style={styles.footer}>
        <Text style={styles.date}>Preferred: {request.preferredDate} at {request.preferredTime}</Text>
        {request.estimatedQuote && (
          <Text style={styles.quote}>Quote: {formatCurrency(request.estimatedQuote)}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: spacing.radiusMd,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  id: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    fontWeight: typography.fontWeight.medium,
  },
  category: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  product: {
    fontSize: typography.fontSize.xs,
    color: colors.primary,
    fontWeight: typography.fontWeight.medium,
    marginTop: 2,
  },
  desc: {
    fontSize: typography.fontSize.xs + 1,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  date: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  quote: {
    fontSize: typography.fontSize.xs + 1,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
});

export default RequestCard;
