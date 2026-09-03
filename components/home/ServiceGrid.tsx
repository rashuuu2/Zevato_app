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
          <View style={styles.iconBox}>
            <Ionicons name={cat.icon as any} size={26} color={colors.primary} />
          </View>
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
