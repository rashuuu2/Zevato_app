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
          <Ionicons name="shield-half-outline" size={28} color={colors.primary} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Zevota Appliance Protection</Text>
          <Text style={styles.description}>
            Zero labor charges, free breakdown visits & 100% genuine spare parts guarantee.
          </Text>
          {onLearnMore && (
            <TouchableOpacity onPress={onLearnMore} style={styles.btn} activeOpacity={0.7}>
              <Text style={styles.btnText}>Explore Plans</Text>
            </TouchableOpacity>
          )}
        </View>
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
    marginVertical: spacing.md,
    borderWidth: 1,
    borderColor: '#C7D9FF',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  description: {
    fontSize: typography.fontSize.xs + 1,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  btn: {
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
  },
  btnText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
});

export default ProtectionCard;
