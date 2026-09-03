import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export interface SubscriptionCardProps {
  planName?: string;
  planStatus?: string;
  walletBalance?: string;
  expiryDate?: string;
  onPress?: () => void;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  planName = 'Premium Plan',
  planStatus = 'Active',
  walletBalance = '₹1,00,000',
  expiryDate = '24 May 2025',
  onPress,
}) => {
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={styles.wrapper}>
      <LinearGradient
        colors={['#0B5CFF', '#0043C8']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        {/* Top row */}
        <View style={styles.topRow}>
          <View style={styles.labelRow}>
            <Ionicons name="briefcase-outline" size={16} color="rgba(255,255,255,0.85)" />
            <Text style={styles.labelText}>My Subscription</Text>
          </View>
          <TouchableOpacity style={styles.viewDetailsBtn} onPress={onPress} activeOpacity={0.8}>
            <Text style={styles.viewDetailsText}>View Details</Text>
            <Ionicons name="chevron-forward" size={14} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Plan name + status */}
        <View style={styles.planRow}>
          <Text style={styles.planName}>{planName}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{planStatus}</Text>
          </View>
        </View>

        {/* Wallet balance */}
        <Text style={styles.walletLabel}>Wallet Balance</Text>
        <Text style={styles.walletAmount}>{walletBalance}</Text>

        {/* Bottom row */}
        <View style={styles.bottomRow}>
          <View style={styles.validityRow}>
            <Ionicons name="calendar-outline" size={14} color="rgba(255,255,255,0.7)" />
            <Text style={styles.validityText}>Valid till {expiryDate}</Text>
          </View>
        </View>

        {/* Wallet illustration overlay on right */}
        <View style={styles.illustrationContainer}>
          <View style={styles.walletIllustration}>
            <Ionicons name="wallet-outline" size={52} color="rgba(255,255,255,0.15)" />
          </View>
          <View style={styles.coinCircle}>
            <Ionicons name="star" size={14} color="#FFD700" />
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
  },
  card: {
    borderRadius: spacing.radiusLg,
    padding: spacing.md + 2,
    position: 'relative',
    overflow: 'hidden',
    minHeight: 180,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  labelText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    color: 'rgba(255,255,255,0.85)',
  },
  viewDetailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: spacing.radiusFull,
    gap: 2,
  },
  viewDetailsText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  planRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  planName: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
  },
  statusBadge: {
    backgroundColor: '#22C55E',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: spacing.radiusFull,
  },
  statusText: {
    fontSize: typography.fontSize.xs - 2,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
  },
  walletLabel: {
    fontSize: typography.fontSize.xs,
    color: 'rgba(255,255,255,0.7)',
    marginTop: spacing.xs,
  },
  walletAmount: {
    fontSize: typography.fontSize.heading + 2,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
    letterSpacing: -0.5,
    marginTop: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm + 2,
  },
  validityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  validityText: {
    fontSize: typography.fontSize.xs,
    color: 'rgba(255,255,255,0.7)',
  },
  illustrationContainer: {
    position: 'absolute',
    right: 16,
    bottom: 40,
  },
  walletIllustration: {
    width: 72,
    height: 72,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coinCircle: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,215,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
});

export default SubscriptionCard;
