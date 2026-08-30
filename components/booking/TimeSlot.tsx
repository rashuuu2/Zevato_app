import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export interface TimeSlotProps {
  slots: string[];
  selectedSlot: string;
  onSelectSlot: (slot: string) => void;
}

export const TimeSlot: React.FC<TimeSlotProps> = ({ slots, selectedSlot, onSelectSlot }) => {
  return (
    <View style={styles.grid}>
      {slots.map((slot) => {
        const isSelected = slot === selectedSlot;
        return (
          <TouchableOpacity
            key={slot}
            style={[styles.slot, isSelected && styles.selectedSlot]}
            onPress={() => onSelectSlot(slot)}
            activeOpacity={0.7}
          >
            <Text style={[styles.slotText, isSelected && styles.selectedText]}>{slot}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  slot: {
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.radiusSm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: '47%',
    alignItems: 'center',
  },
  selectedSlot: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  slotText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
  },
  selectedText: {
    color: colors.primary,
    fontWeight: typography.fontWeight.bold,
  },
});

export default TimeSlot;
