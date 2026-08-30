import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export interface DateOption {
  dayName: string;
  dayNumber: string;
  fullDate: string;
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
        return (
          <TouchableOpacity
            key={item.fullDate}
            style={[styles.dateItem, isSelected && styles.selectedItem]}
            onPress={() => onSelectDate(item.fullDate)}
            activeOpacity={0.7}
          >
            <Text style={[styles.dayName, isSelected && styles.selectedText]}>{item.dayName}</Text>
            <Text style={[styles.dayNumber, isSelected && styles.selectedText]}>{item.dayNumber}</Text>
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
    width: 64,
    height: 72,
    borderRadius: spacing.radiusMd,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedItem: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dayName: {
    fontSize: typography.fontSize.xs,
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
});

export default DatePicker;
