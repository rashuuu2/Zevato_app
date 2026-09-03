import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export interface ProtectionCardProps {
  onLearnMore?: () => void;
}

export const ProtectionCard: React.FC<ProtectionCardProps> = ({ onLearnMore }) => {
  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <View style={styles.iconBox}>
          <Ionicons name="shield-checkmark" size={28} color={colors.primary} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Worry Free. We've Got You!</Text>
          <Text style={styles.description}>
            Trusted experts, easy booking and transparent pricing.
          </Text>
        </View>
        {onLearnMore && (
          <TouchableOpacity onPress={onLearnMore} style={styles.btn} activeOpacity={0.7}>
            <Text style={styles.btnText}>Know More</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.primaryLight,
    borderRadius: spacing.radiusLg,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: '#C7D9FF',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm + 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: typography.fontSize.sm + 1,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  description: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  btn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: spacing.radiusFull,
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: colors.white,
  },
  btnText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
});

export default ProtectionCard;
