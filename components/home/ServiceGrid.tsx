import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
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
  const iconSize = 26;

  switch (category.id) {
    case 'appliances':
      return <MaterialCommunityIcons name="washing-machine" size={iconSize} color={iconColor} />;
    case 'plumbing':
      return <MaterialCommunityIcons name="faucet" size={iconSize} color={iconColor} />;
    case 'furniture':
      return <MaterialCommunityIcons name="sofa" size={iconSize} color={iconColor} />;
    case 'cleaning':
      return (
        <View style={styles.cleaningIconWrapper}>
          <MaterialCommunityIcons name="broom" size={iconSize} color={iconColor} />
          <Ionicons name="sparkles" size={10} color={iconColor} style={styles.cleaningSparkle} />
        </View>
      );
    case 'more':
      return <MaterialCommunityIcons name="dots-grid" size={iconSize} color={iconColor} />;
    case 'electronics':
      return <Ionicons name="tv-outline" size={iconSize} color={iconColor} />;
    case 'electricals':
      return <Ionicons name="flash-outline" size={iconSize} color={iconColor} />;
    case 'car-services':
      return <Ionicons name="car-outline" size={iconSize} color={iconColor} />;
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
    backgroundColor: '#EAF0FB',
  },
  cleaningIconWrapper: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cleaningSparkle: {
    position: 'absolute',
    top: -2,
    right: -4,
    opacity: 0.85,
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
