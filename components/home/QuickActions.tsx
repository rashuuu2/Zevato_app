import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export interface QuickActionsProps {
  onRequestService?: () => void;
  onMyServices?: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onRequestService,
  onMyServices,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Left Action: Request a Service */}
        <TouchableOpacity
          style={styles.actionItem}
          onPress={onRequestService}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={['#0B5CFF', '#0043C8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconCircle}
          >
            <Ionicons name="build" size={20} color={colors.white} />
          </LinearGradient>
          <View style={styles.textBox}>
            <View style={styles.titleRow}>
              <Text style={styles.title} numberOfLines={1}>
                Request a Service
              </Text>
              <Ionicons name="chevron-forward" size={13} color={colors.textSecondary} />
            </View>
            <Text style={styles.subtitle} numberOfLines={2}>
              Raise a new service request
            </Text>
          </View>
        </TouchableOpacity>

        {/* Thin vertical divider line */}
        <View style={styles.divider} />

        {/* Right Action: My Services */}
        <TouchableOpacity
          style={styles.actionItem}
          onPress={onMyServices}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={['#0B5CFF', '#0043C8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconCircle}
          >
            <Ionicons name="card" size={20} color={colors.white} />
          </LinearGradient>
          <View style={styles.textBox}>
            <View style={styles.titleRow}>
              <Text style={styles.title} numberOfLines={1}>
                My Services
              </Text>
              <Ionicons name="chevron-forward" size={13} color={colors.textSecondary} />
            </View>
            <Text style={styles.subtitle} numberOfLines={2}>
              View your registered items and requests
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    marginTop: spacing.sm + 4,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: spacing.radiusLg,
    borderWidth: 1,
    borderColor: '#EBF0F7',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  actionItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    gap: 8,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBox: {
    flex: 1,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 2,
  },
  title: {
    fontSize: typography.fontSize.xs + 1,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    flexShrink: 1,
  },
  subtitle: {
    fontSize: 10.5,
    color: colors.textSecondary,
    lineHeight: 14,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 38,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 2,
  },
});

export default QuickActions;
