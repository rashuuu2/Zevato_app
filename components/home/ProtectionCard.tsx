import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export interface ProtectionCardProps {
  onLearnMore?: () => void;
}

export const ProtectionCard: React.FC<ProtectionCardProps> = ({ onLearnMore }) => {
  return (
    <View style={styles.card}>
      <View style={styles.content}>
        {/* Gradient Shield Icon with Sparkles - No white circle wrapper */}
        <View style={styles.iconContainer}>
          <Svg width={42} height={42} viewBox="0 0 44 44">
            <Defs>
              <LinearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#2575FC" />
                <Stop offset="100%" stopColor="#0B5CFF" />
              </LinearGradient>
            </Defs>

            {/* Sparkle 1: Top-Left */}
            <Path
              d="M 5 2 Q 5 5 8 5 Q 5 5 5 8 Q 5 5 2 5 Q 5 5 5 2 Z"
              fill="#93C5FD"
              opacity={0.85}
            />

            {/* Sparkle 2: Bottom-Right */}
            <Path
              d="M 38 28 Q 38 31 41 31 Q 38 31 38 34 Q 38 31 35 31 Q 38 31 38 28 Z"
              fill="#60A5FA"
              opacity={0.8}
            />

            {/* Sparkle 3: Bottom-Left subtle accent */}
            <Path
              d="M 4 32 Q 4 34 6 34 Q 4 34 4 36 Q 4 34 2 34 Q 4 34 4 32 Z"
              fill="#93C5FD"
              opacity={0.65}
            />

            {/* Shield with diagonal linear gradient */}
            <Path
              d="M 8 8 C 14 6.5, 22 5, 22 5 C 22 5, 30 6.5, 36 8 C 36 24, 28 34, 22 39 C 16 34, 8 24, 8 8 Z"
              fill="url(#shieldGrad)"
            />

            {/* Crisp white checkmark inside shield */}
            <Path
              d="M 15 21 L 20 26 L 29 16"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth={2.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </View>

        {/* Text Container */}
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>
            Worry Free. We've Got You!
          </Text>
          <Text style={styles.description} numberOfLines={2}>
            Trusted experts, easy booking and transparent pricing.
          </Text>
        </View>

        {/* Compact Pill Button */}
        {onLearnMore && (
          <TouchableOpacity onPress={onLearnMore} style={styles.btn} activeOpacity={0.7}>
            <Text style={styles.btnText}>Know More</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#EEF5FF',
    borderRadius: spacing.radiusLg,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: '#D6E5FF',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 42,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 14.5,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    letterSpacing: -0.2,
  },
  description: {
    fontSize: 11.5,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 15,
  },
  btn: {
    paddingVertical: 6,
    paddingHorizontal: 13,
    borderRadius: spacing.radiusFull,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    fontSize: 12,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
});

export default ProtectionCard;
