import React from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  containerStyle,
  style,
  multiline,
  ...rest
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputWrapper,
          multiline ? styles.multilineWrapper : null,
          error ? styles.errorBorder : null,
        ]}
      >
        {leftIcon && (
          <View style={[styles.iconLeft, multiline ? styles.multilineIcon : null]}>
            {leftIcon}
          </View>
        )}
        <TextInput
          style={[styles.input, multiline ? styles.multilineInput : null, style]}
          placeholderTextColor={colors.textMuted}
          multiline={multiline}
          {...rest}
        />
        {rightIcon && (
          <View style={[styles.iconRight, multiline ? styles.multilineIcon : null]}>
            {rightIcon}
          </View>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.radiusMd,
    paddingHorizontal: spacing.md,
    minHeight: 48,
  },
  multilineWrapper: {
    alignItems: 'flex-start',
    paddingVertical: spacing.sm,
    minHeight: 110,
  },
  errorBorder: {
    borderColor: colors.danger,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: typography.fontSize.md,
    paddingVertical: 0,
  },
  multilineInput: {
    textAlignVertical: 'top',
    paddingTop: 0,
    minHeight: 88,
  },
  iconLeft: {
    marginRight: spacing.sm,
  },
  iconRight: {
    marginLeft: spacing.sm,
  },
  multilineIcon: {
    marginTop: spacing.xs,
  },
  errorText: {
    color: colors.danger,
    fontSize: typography.fontSize.xs,
    marginTop: 4,
  },
});

export default Input;
