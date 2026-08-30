import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Brand } from '@/types/service';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export interface BrandCardProps {
  brand: Brand;
  selected?: boolean;
  onPress: (brand: Brand) => void;
}

export const BrandCard: React.FC<BrandCardProps> = ({ brand, selected, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.selectedCard]}
      onPress={() => onPress(brand)}
      activeOpacity={0.7}
    >
      <Ionicons name={brand.logo as any} size={24} color={selected ? colors.primary : colors.textSecondary} />
      <Text style={[styles.name, selected && styles.selectedText]}>{brand.name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: spacing.radiusMd,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs + 2,
  },
  selectedCard: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  name: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
  },
  selectedText: {
    color: colors.primary,
    fontWeight: typography.fontWeight.bold,
  },
});

export default BrandCard;
