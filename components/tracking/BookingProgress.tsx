import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BookingStep } from '@/types/booking';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export interface BookingProgressProps {
  steps: BookingStep[];
}

export const BookingProgress: React.FC<BookingProgressProps> = ({ steps }) => {
  return (
    <View style={styles.container}>
      {steps.map((step, idx) => {
        const isLast = idx === steps.length - 1;
        return (
          <View key={step.id} style={styles.stepRow}>
            <View style={styles.indicatorCol}>
              <View style={[styles.circle, step.completed && styles.completedCircle]}>
                {step.completed ? (
                  <Ionicons name="checkmark" size={14} color={colors.white} />
                ) : (
                  <View style={styles.innerDot} />
                )}
              </View>
              {!isLast && <View style={[styles.line, step.completed && styles.completedLine]} />}
            </View>
            <View style={styles.contentCol}>
              <Text style={[styles.title, step.completed && styles.completedTitle]}>{step.title}</Text>
              {step.timestamp && <Text style={styles.timestamp}>{step.timestamp}</Text>}
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.sm,
  },
  stepRow: {
    flexDirection: 'row',
    minHeight: 48,
  },
  indicatorCol: {
    alignItems: 'center',
    width: 32,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.divider,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedCircle: {
    backgroundColor: colors.success,
  },
  innerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.textMuted,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: colors.divider,
    marginVertical: 4,
  },
  completedLine: {
    backgroundColor: colors.success,
  },
  contentCol: {
    flex: 1,
    paddingLeft: spacing.sm,
    paddingBottom: spacing.sm,
  },
  title: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
  completedTitle: {
    color: colors.text,
    fontWeight: typography.fontWeight.bold,
  },
  timestamp: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
});

export default BookingProgress;
