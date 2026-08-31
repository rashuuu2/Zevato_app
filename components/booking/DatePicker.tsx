import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export interface DateOption {
  dayName: string;
  dayNumber: string;
  fullDate: string;
  disabled?: boolean;
}

export interface DatePickerProps {
  dates: DateOption[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export const DatePicker: React.FC<DatePickerProps> = ({ dates, selectedDate, onSelectDate }) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
      {dates.map((item) => {
        const isSelected = item.fullDate === selectedDate;
        const isDisabled = item.disabled;

        return (
          <TouchableOpacity
            key={item.fullDate}
            style={[
              styles.dateItem,
              isSelected && styles.selectedItem,
              isDisabled && styles.disabledItem,
            ]}
            onPress={() => !isDisabled && onSelectDate(item.fullDate)}
            activeOpacity={0.7}
            disabled={isDisabled}
          >
            <Text style={[styles.dayName, isSelected && styles.selectedText, isDisabled && styles.disabledText]}>
              {item.dayName}
            </Text>
            <Text style={[styles.dayNumber, isSelected && styles.selectedText, isDisabled && styles.disabledText]}>
              {item.dayNumber}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  dateItem: {
    width: 68,
    height: 76,
    borderRadius: spacing.radiusMd,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  selectedItem: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  disabledItem: {
    backgroundColor: colors.divider,
    borderColor: colors.border,
    opacity: 0.5,
  },
  dayName: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  dayNumber: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginTop: 2,
  },
  selectedText: {
    color: colors.white,
  },
  disabledText: {
    color: colors.textMuted,
  },
});

export default DatePicker;
