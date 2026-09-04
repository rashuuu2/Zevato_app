import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ServiceCategory } from '@/types/service';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export interface ServiceGridProps {
  categories: ServiceCategory[];
  onSelectCategory: (category: ServiceCategory) => void;
}

const renderCategoryIcon = (category: ServiceCategory) => {
  const iconColor = colors.primary;
  const iconSize = 28;

  switch (category.id) {
    case 'electronics':
      return <Ionicons name="tv-outline" size={iconSize} color={iconColor} />;
    case 'appliances':
      return <Ionicons name="home-outline" size={iconSize} color={iconColor} />;
    case 'plumbing':
      return <Ionicons name="water-outline" size={iconSize} color={iconColor} />;
    case 'electricals':
      return <Ionicons name="flash-outline" size={iconSize} color={iconColor} />;
    case 'car-services':
      return <Ionicons name="car-outline" size={iconSize} color={iconColor} />;
    case 'cleaning':
      return <Ionicons name="sparkles-outline" size={iconSize} color={iconColor} />;
    case 'furniture':
      return <Ionicons name="bed-outline" size={iconSize} color={iconColor} />;
    case 'more':
      return <Ionicons name="grid-outline" size={iconSize} color={iconColor} />;
    default:
      return <Ionicons name={(category.icon as any) || 'grid-outline'} size={iconSize} color={iconColor} />;
  }
};

export const ServiceGrid: React.FC<ServiceGridProps> = ({ categories, onSelectCategory }) => {
  return (
    <View style={styles.grid}>
      {categories.map((cat) => (
        <TouchableOpacity
          key={cat.id}
          style={styles.item}
          onPress={() => onSelectCategory(cat)}
          activeOpacity={0.7}
        >
          <View style={styles.iconBox}>{renderCategoryIcon(cat)}</View>
          <Text style={styles.label} numberOfLines={2}>
            {cat.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.md,
    justifyContent: 'space-between',
  },
  item: {
    width: '23%',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.xs,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: spacing.radiusMd,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs + 2,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: {
    fontSize: typography.fontSize.xs - 1,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 14,
  },
});

export default ServiceGrid;
