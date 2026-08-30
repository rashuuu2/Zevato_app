import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export interface BookingStepperProps {
  currentStep: number; // 1: Schedule, 2: Address, 3: Payment
  totalSteps?: number;
}

export const BookingStepper: React.FC<BookingStepperProps> = ({ currentStep, totalSteps = 3 }) => {
  const steps = ['Schedule', 'Address', 'Payment'];

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
                <Text
                  style={[
                    styles.stepNumber,
                    (isActive || isCompleted) && styles.activeNumber,
                  ]}
                >
                  {stepNum}
                </Text>
              </View>
              <Text style={[styles.label, isActive && styles.activeLabel]}>{label}</Text>
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
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  stepItem: {
    alignItems: 'center',
  },
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
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
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.textSecondary,
  },
  activeNumber: {
    color: colors.white,
  },
  label: {
    fontSize: typography.fontSize.xs - 1,
    color: colors.textSecondary,
    marginTop: 4,
  },
  activeLabel: {
    color: colors.primary,
    fontWeight: typography.fontWeight.bold,
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: colors.divider,
    marginHorizontal: spacing.xs,
    marginBottom: 16,
  },
  completedLine: {
    backgroundColor: colors.success,
  },
});

export default BookingStepper;
