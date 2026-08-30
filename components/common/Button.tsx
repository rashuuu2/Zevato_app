import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
  onPress,
  ...rest
}) => {
  const getContainerStyle = () => {
    const base: ViewStyle[] = [styles.button];

    // Variant
    if (variant === 'primary') base.push(styles.primaryBtn);
    else if (variant === 'secondary') base.push(styles.secondaryBtn);
    else if (variant === 'outline') base.push(styles.outlineBtn);
    else if (variant === 'ghost') base.push(styles.ghostBtn);
    else if (variant === 'danger') base.push(styles.dangerBtn);

    // Size
    if (size === 'small') base.push(styles.smallBtn);
    else if (size === 'medium') base.push(styles.mediumBtn);
    else if (size === 'large') base.push(styles.largeBtn);

    if (disabled || loading) base.push(styles.disabledBtn);

    return [base, style];
  };

  const getTextStyle = () => {
    const base: TextStyle[] = [styles.text];

    if (variant === 'primary' || variant === 'danger') base.push(styles.whiteText);
    else if (variant === 'secondary') base.push(styles.secondaryText);
    else if (variant === 'outline' || variant === 'ghost') base.push(styles.primaryText);

    if (size === 'small') base.push(styles.smallText);
    else if (size === 'large') base.push(styles.largeText);

    if (disabled) base.push(styles.disabledText);

    return [base, textStyle];
  };

  return (
    <TouchableOpacity
      style={getContainerStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? colors.white : colors.primary} />
      ) : (
        <>
          {icon}
          <Text style={getTextStyle()}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: spacing.radiusMd,
    gap: spacing.xs,
  },
  primaryBtn: {
    backgroundColor: colors.primary,
  },
  secondaryBtn: {
    backgroundColor: colors.primaryLight,
  },
  outlineBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  ghostBtn: {
    backgroundColor: 'transparent',
  },
  dangerBtn: {
    backgroundColor: colors.danger,
  },
  smallBtn: {
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
  },
  mediumBtn: {
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.lg,
  },
  largeBtn: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  disabledBtn: {
    opacity: 0.6,
  },
  text: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    textAlign: 'center',
  },
  whiteText: {
    color: colors.white,
  },
  primaryText: {
    color: colors.primary,
  },
  secondaryText: {
    color: colors.primaryDark,
  },
  smallText: {
    fontSize: typography.fontSize.sm,
  },
  largeText: {
    fontSize: typography.fontSize.lg,
  },
  disabledText: {
    color: colors.textMuted,
  },
});

export default Button;
