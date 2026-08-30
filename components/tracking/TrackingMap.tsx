import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export interface TrackingMapProps {
  eta?: string;
  distance?: string;
}

export const TrackingMap: React.FC<TrackingMapProps> = ({ eta = '18 mins', distance = '3.2 km away' }) => {
  return (
    <View style={styles.mapContainer}>
      <View style={styles.gridOverlay}>
        <Ionicons name="navigate-circle" size={48} color={colors.primary} />
        <Text style={styles.mapTitle}>Live Technician Location</Text>
        <Text style={styles.mapSubtitle}>Technician is en route to your address</Text>
      </View>
      <View style={styles.etaBar}>
        <View style={styles.etaBox}>
          <Text style={styles.etaLabel}>Estimated Arrival</Text>
          <Text style={styles.etaValue}>{eta}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.etaBox}>
          <Text style={styles.etaLabel}>Distance</Text>
          <Text style={styles.etaValue}>{distance}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    height: 180,
    borderRadius: spacing.radiusLg,
    backgroundColor: '#E5EEFF',
    borderWidth: 1,
    borderColor: '#C7D9FF',
    justifyContent: 'space-between',
    overflow: 'hidden',
    marginVertical: spacing.sm,
  },
  gridOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  mapTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.primaryDark,
    marginTop: spacing.xs,
  },
  mapSubtitle: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  etaBar: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  etaBox: {
    flex: 1,
    alignItems: 'center',
  },
  etaLabel: {
    fontSize: typography.fontSize.xs - 1,
    color: colors.textSecondary,
  },
  etaValue: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginTop: 2,
  },
  divider: {
    width: 1,
    backgroundColor: colors.border,
  },
});

export default TrackingMap;
