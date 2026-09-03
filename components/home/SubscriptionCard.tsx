import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Rect, Path, Circle, Defs, LinearGradient as SvgLinearGradient, Stop, Line } from 'react-native-svg';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';

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
  walletBalance = '₹ 1,00,000',
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
        {/* Top Row: Crown + "My Subscription" & "View Details >" Button */}
        <View style={styles.topRow}>
          <View style={styles.labelRow}>
            <MaterialCommunityIcons name="crown" size={15} color="rgba(255, 255, 255, 0.95)" />
            <Text style={styles.labelText}>My Subscription</Text>
          </View>
          <TouchableOpacity style={styles.viewDetailsBtn} onPress={onPress} activeOpacity={0.8}>
            <Text style={styles.viewDetailsText}>View Details</Text>
            <Ionicons name="chevron-forward" size={12} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Plan Name + "Active" Pill Badge */}
        <View style={styles.planRow}>
          <Text style={styles.planName}>{planName}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{planStatus}</Text>
          </View>
        </View>

        {/* Wallet Balance */}
        <Text style={styles.walletLabel}>Wallet Balance</Text>
        <Text style={styles.walletAmount}>{walletBalance}</Text>

        {/* Bottom Validity Row */}
        <View style={styles.validityRow}>
          <Ionicons name="calendar-outline" size={12} color="rgba(255, 255, 255, 0.8)" />
          <Text style={styles.validityText}>Valid till {expiryDate}</Text>
        </View>

        {/* 3D-Style Wallet Illustration with Cash & Gold Coin */}
        <View style={styles.illustrationContainer} pointerEvents="none">
          <Svg width={74} height={66} viewBox="0 0 76 68">
            <Defs>
              <SvgLinearGradient id="walletGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor="#3B82F6" />
                <Stop offset="100%" stopColor="#1D4ED8" />
              </SvgLinearGradient>
              <SvgLinearGradient id="flapGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor="#60A5FA" />
                <Stop offset="100%" stopColor="#2563EB" />
              </SvgLinearGradient>
              <SvgLinearGradient id="billGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#F8FAFC" />
                <Stop offset="100%" stopColor="#E2E8F0" />
              </SvgLinearGradient>
              <SvgLinearGradient id="coinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#FDE047" />
                <Stop offset="100%" stopColor="#EAB308" />
              </SvgLinearGradient>
            </Defs>

            {/* Back Cash Banknote */}
            <Rect
              x="14"
              y="6"
              width="34"
              height="24"
              rx="3"
              transform="rotate(-10 31 18)"
              fill="url(#billGrad)"
              opacity={0.88}
            />

            {/* Front Cash Banknote */}
            <Rect
              x="20"
              y="4"
              width="34"
              height="24"
              rx="3"
              transform="rotate(4 37 16)"
              fill="#FFFFFF"
            />
            <Line
              x1="24"
              y1="12"
              x2="38"
              y2="12"
              stroke="#CBD5E1"
              strokeWidth={1}
              transform="rotate(4 37 16)"
            />

            {/* Wallet Main Body */}
            <Rect x="6" y="16" width="58" height="42" rx="9" fill="url(#walletGrad)" />
            <Rect x="6" y="16" width="58" height="5" rx="2.5" fill="#93C5FD" opacity={0.4} />

            {/* Front Flap */}
            <Path
              d="M 6 32 C 6 26, 12 24, 20 24 L 50 24 C 58 24, 64 26, 64 32 L 64 49 C 64 54, 59 58, 54 58 L 16 58 C 10 58, 6 54, 6 49 Z"
              fill="url(#flapGrad)"
            />

            {/* Snap Button on Flap */}
            <Circle cx="54" cy="38" r="4.5" fill="#E2E8F0" />
            <Circle cx="54" cy="38" r="3" fill="#94A3B8" />

            {/* Gold Coin at Bottom-Right Corner */}
            <Circle cx="58" cy="52" r="11" fill="url(#coinGrad)" stroke="#CA8A04" strokeWidth={1.5} />
            <Circle cx="58" cy="52" r="8" fill="none" stroke="#FEF08A" strokeWidth={1} />
            <Circle cx="58" cy="52" r="2.5" fill="#CA8A04" />
          </Svg>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: spacing.md,
    marginTop: spacing.xs,
  },
  card: {
    borderRadius: spacing.radiusLg,
    paddingVertical: 12,
    paddingHorizontal: 14,
    position: 'relative',
    overflow: 'hidden',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  labelText: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.92)',
  },
  viewDetailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: spacing.radiusFull,
    gap: 2,
  },
  viewDetailsText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  planRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 2,
  },
  planName: {
    fontSize: 15.5,
    fontWeight: '700',
    color: colors.white,
  },
  statusBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: spacing.radiusFull,
  },
  statusText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: colors.white,
  },
  walletLabel: {
    fontSize: 11.5,
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 6,
  },
  walletAmount: {
    fontSize: 27,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: -0.4,
    marginTop: 1,
    marginBottom: 6,
  },
  validityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  validityText: {
    fontSize: 11.5,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  illustrationContainer: {
    position: 'absolute',
    right: 14,
    bottom: 12,
  },
});

export default SubscriptionCard;
