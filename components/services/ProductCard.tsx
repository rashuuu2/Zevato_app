import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '@/types/service';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { formatCurrency } from '@/utils/formatCurrency';

export interface ProductCardProps {
  product: Product;
  selected?: boolean;
  onPress: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, selected, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.selectedCard]}
      onPress={() => onPress(product)}
      activeOpacity={0.8}
    >
      <View style={[styles.iconContainer, selected && styles.selectedIconContainer]}>
        <Ionicons name={(product.image as any) || 'hardware-chip-outline'} size={30} color={selected ? colors.white : colors.primary} />
      </View>
      <View style={styles.details}>
        <Text style={[styles.name, selected && styles.selectedName]}>{product.name}</Text>
        <Text style={styles.priceText}>Starts at {formatCurrency(product.startingPrice)}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={selected ? colors.primary : colors.textMuted} />
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
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: spacing.radiusSm,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  selectedIconContainer: {
    backgroundColor: colors.primary,
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: typography.fontSize.sm + 1,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  selectedName: {
    color: colors.primary,
  },
  priceText: {
    fontSize: typography.fontSize.xs,
    color: colors.primary,
    fontWeight: typography.fontWeight.medium,
    marginTop: 2,
  },
});

export default ProductCard;
