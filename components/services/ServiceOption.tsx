import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ServiceOption as OptionType } from '@/types/service';
import Button from '@/components/common/Button';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { formatCurrency } from '@/utils/formatCurrency';

export interface ServiceOptionProps {
  option: OptionType;
  selected?: boolean;
  onSelect: (option: OptionType) => void;
}

export const ServiceOption: React.FC<ServiceOptionProps> = ({ option, selected, onSelect }) => {
  return (
    <View style={[styles.card, selected && styles.selectedCard]}>
      <View style={styles.header}>
        <Text style={styles.title}>{option.title}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{formatCurrency(option.price)}</Text>
          {option.originalPrice && (
            <Text style={styles.originalPrice}>{formatCurrency(option.originalPrice)}</Text>
          )}
        </View>
      </View>
      <Text style={styles.desc}>{option.description}</Text>
      <View style={styles.featuresList}>
        {option.features.map((feat, idx) => (
          <View key={idx} style={styles.featureItem}>
            <Ionicons name="checkmark-sharp" size={14} color={colors.success} />
            <Text style={styles.featureText}>{feat}</Text>
          </View>
        ))}
      </View>
      <Button
        title={selected ? 'Selected' : 'Book Service'}
        variant={selected ? 'secondary' : 'primary'}
        size="medium"
        onPress={() => onSelect(option)}
        style={styles.btn}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: spacing.radiusLg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  selectedCard: {
    borderColor: colors.primary,
    backgroundColor: '#F4F8FF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    flex: 1,
    paddingRight: spacing.sm,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  originalPrice: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
  desc: {
    fontSize: typography.fontSize.xs + 1,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  featuresList: {
    marginTop: spacing.sm,
    gap: 4,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  featureText: {
    fontSize: typography.fontSize.xs,
    color: colors.text,
  },
  btn: {
    marginTop: spacing.md,
  },
});

export default ServiceOption;
