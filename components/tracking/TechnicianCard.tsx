import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Technician } from '@/types/booking';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export interface TechnicianCardProps {
  technician: Technician;
  onCall?: () => void;
}

export const TechnicianCard: React.FC<TechnicianCardProps> = ({ technician, onCall }) => {
  return (
    <View style={styles.card}>
      <View style={styles.avatarCircle}>
        <Ionicons name="person" size={24} color={colors.primary} />
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{technician.name}</Text>
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={14} color="#F59E0B" />
          <Text style={styles.rating}>{technician.rating}</Text>
          <Text style={styles.jobs}>({technician.completedJobs} jobs completed)</Text>
        </View>
      </View>
      {onCall && (
        <TouchableOpacity style={styles.callBtn} onPress={onCall} activeOpacity={0.7}>
          <Ionicons name="call" size={18} color={colors.white} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: spacing.radiusMd,
    borderWidth: 1,
    borderColor: colors.border,
    marginVertical: spacing.sm,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 4,
  },
  rating: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  jobs: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  callBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TechnicianCard;
