import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ServiceCategory } from '@/types/service';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export interface CategoryCardProps {
  category: ServiceCategory;
  selected?: boolean;
  onPress: (category: ServiceCategory) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, selected, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.selectedCard]}
      onPress={() => onPress(category)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconBox, selected && styles.selectedIconBox]}>
        <Ionicons name={category.icon as any} size={28} color={selected ? colors.white : colors.primary} />
      </View>
      <View style={styles.info}>
        <Text style={[styles.name, selected && styles.selectedName]}>{category.name}</Text>
        <Text style={styles.desc} numberOfLines={1}>
          {category.description}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={selected ? colors.primary : colors.textMuted} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: spacing.radiusMd,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedCard: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  selectedIconBox: {
    backgroundColor: colors.primary,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  selectedName: {
    color: colors.primary,
  },
  desc: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
});

export default CategoryCard;
