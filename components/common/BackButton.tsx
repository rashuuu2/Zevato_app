import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';

export interface BackButtonProps {
  onPress?: () => void;
  style?: ViewStyle;
  color?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ onPress, style, color = colors.text }) => {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <TouchableOpacity style={[styles.btn, style]} onPress={handlePress} activeOpacity={0.7}>
      <Ionicons name="arrow-back" size={22} color={color} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    width: 40,
    height: 40,
    borderRadius: spacing.radiusFull,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
});

export default BackButton;
