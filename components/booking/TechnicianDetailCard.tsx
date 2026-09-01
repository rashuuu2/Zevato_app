import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Technician } from '@/types/booking';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export interface TechnicianDetailCardProps {
  technician?: Technician;
  showId?: boolean;
}

export const TechnicianDetailCard: React.FC<TechnicianDetailCardProps> = ({
  technician,
  showId = false,
}) => {
  const techName = technician?.name || 'Ramesh Kumar';
  const techPhone = technician?.phone || '+91 98765 43210';
  const techRating = technician?.rating || 4.9;
  const techJobs = technician?.completedJobs || 428;
  const techAvatar = technician?.avatarUrl || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150';
  const techId = technician?.id || 'TECH-8492';

  const handleCall = () => {
    Alert.alert('Call Technician', `Would you like to call ${techName}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Call', onPress: () => Linking.openURL(`tel:${techPhone.replace(/[^0-9+]/g, '')}`).catch(() => Alert.alert('Dialer Error', `Please call ${techPhone}`)) },
    ]);
  };

  const handleChat = () => {
    Alert.alert('Live Chat with Technician', `Opening live chat session with ${techName}...`);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.sectionHeading}>Your Technician</Text>

      <View style={styles.mainRow}>
        {/* Avatar */}
        <View style={styles.avatarBox}>
          <Image source={{ uri: techAvatar }} style={styles.avatar} />
          <View style={styles.onlineDot} />
        </View>

        {/* Info */}
        <View style={styles.infoCol}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{techName}</Text>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={11} color="#F59E0B" />
              <Text style={styles.ratingText}>{techRating.toFixed(1)}</Text>
            </View>
          </View>

          <Text style={styles.role}>Senior Certified Technician</Text>

          {showId ? (
            <Text style={styles.techId}>ID: {techId}</Text>
          ) : null}

          {/* Experience / Jobs stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="ribbon-outline" size={12} color={colors.textSecondary} />
              <Text style={styles.statText}>5+ Yrs Exp</Text>
            </View>
            <Text style={styles.dotSeparator}>•</Text>
            <View style={styles.statItem}>
              <Ionicons name="checkmark-done" size={12} color={colors.success} />
              <Text style={styles.statText}>{techJobs}+ jobs completed</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsCol}>
          <TouchableOpacity style={styles.circleBtn} onPress={handleCall} activeOpacity={0.75}>
            <Ionicons name="call" size={16} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.circleBtn, styles.chatBtn]} onPress={handleChat} activeOpacity={0.75}>
            <Ionicons name="chatbubble-ellipses" size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: spacing.radiusMd + 2,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs + 2,
    borderWidth: 1,
    borderColor: '#E7ECF3',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeading: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs + 2,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
  },
  avatarBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    position: 'relative',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E2E8F0',
  },
  onlineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.success,
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: colors.white,
  },
  infoCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    fontSize: typography.fontSize.sm + 1,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#FEF3C7',
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: 4,
  },
  ratingText: {
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
    color: '#B45309',
  },
  role: {
    fontSize: typography.fontSize.xs - 1,
    color: colors.textSecondary,
    marginTop: 1,
  },
  techId: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: typography.fontWeight.semibold,
    marginTop: 1,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  statText: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  dotSeparator: {
    color: colors.border,
    fontSize: 10,
  },
  actionsCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  circleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEF4FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D8E5FE',
  },
  chatBtn: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
});

export default TechnicianDetailCard;
