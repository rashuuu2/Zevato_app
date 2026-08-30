import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export interface SubscriptionCardProps {
  planName?: string;
  expiryDate?: string;
  onPress?: () => void;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  planName = 'Zevota Care Annual Protection',
  expiryDate = '31 Dec 2026',
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.headerRow}>
        <View style={styles.badge}>
          <Ionicons name="shield-checkmark" size={14} color={colors.white} />
          <Text style={styles.badgeText}>ACTIVE PLAN</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.white} />
      </View>
      <Text style={styles.title}>{planName}</Text>
      <Text style={styles.subtitle}>Covers unlimited labor & free annual tune-up</Text>
      <View style={styles.footerRow}>
        <Text style={styles.validity}>Valid until: {expiryDate}</Text>
        <Text style={styles.linkText}>View Details</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.primary,
    borderRadius: spacing.radiusLg,
    padding: spacing.md + 4,
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingVertical: 3,
    paddingHorizontal: spacing.sm,
    borderRadius: spacing.radiusFull,
    gap: 4,
  },
  badgeText: {
    color: colors.white,
    fontSize: typography.fontSize.xs - 2,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
    marginTop: spacing.xs,
  },
  subtitle: {
    fontSize: typography.fontSize.xs + 1,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 2,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  validity: {
    fontSize: typography.fontSize.xs,
    color: colors.white,
  },
  linkText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
  },
});

export default SubscriptionCard;
