import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Address } from '@/types/user';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export interface AddressCardProps {
  address: Address;
  selected?: boolean;
  onSelect?: (address: Address) => void;
}

export const AddressCard: React.FC<AddressCardProps> = ({ address, selected, onSelect }) => {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.selectedCard]}
      onPress={() => onSelect?.(address)}
      activeOpacity={0.7}
      disabled={!onSelect}
    >
      <View style={styles.iconCircle}>
        <Ionicons
          name={address.type === 'work' ? 'briefcase-outline' : 'home-outline'}
          size={20}
          color={colors.primary}
        />
      </View>
      <View style={styles.details}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{address.title}</Text>
          {address.isDefault && <Text style={styles.defaultBadge}>Default</Text>}
        </View>
        <Text style={styles.street}>{address.street}</Text>
        <Text style={styles.city}>
          {address.city}, {address.state} - {address.zipCode}
        </Text>
      </View>
      {selected && <Ionicons name="checkmark-circle" size={24} color={colors.primary} />}
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
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  selectedCard: {
    borderColor: colors.primary,
    backgroundColor: '#F4F8FF',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  details: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  title: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  defaultBadge: {
    fontSize: typography.fontSize.xs - 2,
    fontWeight: typography.fontWeight.bold,
    color: colors.success,
    backgroundColor: colors.successLight,
    paddingVertical: 1,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  street: {
    fontSize: typography.fontSize.xs + 1,
    color: colors.textSecondary,
    marginTop: 2,
  },
  city: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
});

export default AddressCard;
