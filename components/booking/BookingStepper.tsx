import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export interface BookingStepperProps {
  currentStep: number;
  steps?: string[];
}

const DEFAULT_STEPS = ['Category', 'Brand', 'Model', 'Issue', 'Schedule', 'Confirm'];

export const BookingStepper: React.FC<BookingStepperProps> = ({
  currentStep,
  steps = DEFAULT_STEPS,
}) => {
  return (
    <View style={styles.container}>
      {steps.map((label, index) => {
        const stepNum = index + 1;
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;

        return (
          <React.Fragment key={label}>
            <View style={styles.stepItem}>
              <View
                style={[
                  styles.circle,
                  isActive && styles.activeCircle,
                  isCompleted && styles.completedCircle,
                ]}
              >
                {isCompleted ? (
                  <Ionicons name="checkmark" size={14} color={colors.white} />
                ) : (
                  <Text
                    style={[
                      styles.stepNumber,
                      (isActive || isCompleted) && styles.activeNumber,
                    ]}
                  >
                    {stepNum}
                  </Text>
                )}
              </View>
              <Text
                style={[
                  styles.label,
                  isActive && styles.activeLabel,
                  isCompleted && styles.completedLabel,
                ]}
                numberOfLines={1}
              >
                {label}
              </Text>
            </View>
            {index < steps.length - 1 && (
              <View
                style={[
                  styles.line,
                  isCompleted && styles.completedLine,
                ]}
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm + 2,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  stepItem: {
    alignItems: 'center',
    maxWidth: 52,
  },
  circle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.divider,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeCircle: {
    backgroundColor: colors.primary,
  },
  completedCircle: {
    backgroundColor: colors.success,
  },
  stepNumber: {
    fontSize: typography.fontSize.xs - 1,
    fontWeight: typography.fontWeight.bold,
    color: colors.textSecondary,
  },
  activeNumber: {
    color: colors.white,
  },
  label: {
    fontSize: 9,
    color: colors.textMuted,
    marginTop: 3,
    textAlign: 'center',
  },
  activeLabel: {
    color: colors.primary,
    fontWeight: typography.fontWeight.bold,
  },
  completedLabel: {
    color: colors.success,
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: colors.divider,
    marginHorizontal: 2,
    marginBottom: 14,
  },
  completedLine: {
    backgroundColor: colors.success,
  },
});

export default BookingStepper;
