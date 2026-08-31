import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export interface TimeSlotOption {
  time: string;
  available?: boolean;
}

export interface TimeSlotProps {
  slots: (string | TimeSlotOption)[];
  selectedSlot: string;
  onSelectSlot: (slot: string) => void;
}

export const TimeSlot: React.FC<TimeSlotProps> = ({ slots, selectedSlot, onSelectSlot }) => {
  return (
    <View style={styles.grid}>
      {slots.map((item) => {
        const slotText = typeof item === 'string' ? item : item.time;
        const isAvailable = typeof item === 'string' ? true : item.available !== false;
        const isSelected = slotText === selectedSlot;

        return (
          <TouchableOpacity
            key={slotText}
            style={[
              styles.slot,
              isSelected && styles.selectedSlot,
              !isAvailable && styles.disabledSlot,
            ]}
            onPress={() => isAvailable && onSelectSlot(slotText)}
            activeOpacity={0.7}
            disabled={!isAvailable}
          >
            <Text
              style={[
                styles.slotText,
                isSelected && styles.selectedText,
                !isAvailable && styles.disabledText,
              ]}
            >
              {slotText}
            </Text>
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
    borderRadius: spacing.radiusMd,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    minWidth: '47%',
    flex: 1,
    alignItems: 'center',
  },
  selectedSlot: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  disabledSlot: {
    backgroundColor: colors.divider,
    borderColor: colors.border,
    opacity: 0.5,
  },
  slotText: {
    fontSize: typography.fontSize.xs + 1,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
  },
  selectedText: {
    color: colors.primary,
    fontWeight: typography.fontWeight.bold,
  },
  disabledText: {
    color: colors.textMuted,
  },
});

export default TimeSlot;
