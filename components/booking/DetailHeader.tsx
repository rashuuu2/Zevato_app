import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import useAuth from '@/hooks/useAuth';

export interface DetailHeaderProps {
  title: string;
  subtitle?: string;
  statusLabel?: string;
  statusType?: 'in_progress' | 'completed' | 'paid' | 'scheduled' | 'cancelled';
  bookingId?: string;
  onBack?: () => void;
}

export const DetailHeader: React.FC<DetailHeaderProps> = ({
  title,
  subtitle,
  statusLabel = 'In Progress',
  statusType = 'in_progress',
  bookingId,
  onBack,
}) => {
  const router = useRouter();
  const { user } = useAuth();

  const handleCopyId = () => {
    if (bookingId) {
      Alert.alert('Booking ID Copied', `${bookingId} has been copied to your clipboard.`);
    }
  };

  const getStatusBadgeColors = () => {
    switch (statusType) {
      case 'completed':
      case 'paid':
        return { bg: '#E8F8F0', text: '#0E9355' };
      case 'in_progress':
        return { bg: '#EBF3FF', text: '#1E64E8' };
      case 'cancelled':
        return { bg: '#FEECEB', text: '#DF2C2C' };
      default:
        return { bg: '#FFF4E5', text: '#D97706' };
    }
  };

  const badgeColors = getStatusBadgeColors();

  return (
    <View style={styles.container}>
      {/* Top Branding & Action Bar */}
      <View style={styles.topRow}>
        <View style={styles.leftGroup}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={onBack || (() => router.back())}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.brandGroup}>
            <Text style={styles.brandLogo}>Zevota</Text>
            <Text style={styles.brandSub}>CARE</Text>
          </View>
        </View>

        <View style={styles.rightGroup}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => router.push('/profile/notifications' as any)}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={20} color={colors.text} />
            <View style={styles.badgeDot}>
              <Text style={styles.badgeDotText}>3</Text>
            </View>
          </TouchableOpacity>

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

      {/* Title & Status Pill Row */}
      <View style={styles.titleRow}>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        <View style={[styles.statusPill, { backgroundColor: badgeColors.bg }]}>
          <Text style={[styles.statusPillText, { color: badgeColors.text }]}>
            {statusLabel}
          </Text>
        </View>
      </View>

      {/* Booking ID with Copy Icon */}
      {bookingId ? (
        <TouchableOpacity style={styles.bookingIdRow} onPress={handleCopyId} activeOpacity={0.7}>
          <Text style={styles.bookingIdLabel}>Booking ID:</Text>
          <Text style={styles.bookingIdValue}>{bookingId}</Text>
          <Ionicons name="copy-outline" size={14} color={colors.primary} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F4F9',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs + 2,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandGroup: {
    justifyContent: 'center',
  },
  brandLogo: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    letterSpacing: -0.5,
  },
  brandSub: {
    fontSize: 8,
    fontWeight: typography.fontWeight.bold,
    color: colors.textMuted,
    letterSpacing: 2,
    marginTop: -2,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badgeDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeDotText: {
    color: colors.white,
    fontSize: 8,
    fontWeight: typography.fontWeight.bold,
  },
  avatarWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
    fontSize: typography.fontSize.xs + 1,
    fontWeight: typography.fontWeight.bold,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: spacing.xs,
    gap: spacing.sm,
  },
  titleBlock: {
    flex: 1,
  },
  title: {
    fontSize: typography.fontSize.heading,
    fontWeight: typography.fontWeight.bold,
    color: '#0F172A',
  },
  subtitle: {
    fontSize: typography.fontSize.xs,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 16,
  },
  statusPill: {
    paddingVertical: 4,
    paddingHorizontal: spacing.sm + 2,
    borderRadius: spacing.radiusFull,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: typography.fontWeight.bold,
  },
  bookingIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.xs + 2,
    alignSelf: 'flex-start',
  },
  bookingIdLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
  },
  bookingIdValue: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: '#334155',
  },
});

export default DetailHeader;
