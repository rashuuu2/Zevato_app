import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ServiceFeature as FeatureType } from '@/types/service';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export interface ServiceFeatureProps {
  feature: FeatureType;
}

export const ServiceFeature: React.FC<ServiceFeatureProps> = ({ feature }) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name={(feature.icon as any) || 'checkmark-circle-outline'} size={20} color={colors.primary} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{feature.title}</Text>
        <Text style={styles.desc}>{feature.description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    backgroundColor: colors.surface,
    padding: spacing.sm + 2,
    borderRadius: spacing.radiusSm,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  desc: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
});

export default ServiceFeature;
