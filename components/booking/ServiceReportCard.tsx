import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export interface ServiceReportCardProps {
  diagnosis?: string;
  workPerformed?: string;
  partsReplaced?: string;
  serviceStatus?: string;
  technicianNotes?: string;
  onViewFullReport?: () => void;
}

export const ServiceReportCard: React.FC<ServiceReportCardProps> = ({
  diagnosis = 'Compressor coil choked with debris & low refrigerant pressure detected during diagnostic cycle.',
  workPerformed = 'Complete high-pressure power jet wash, coil chemical descaling & refrigerant gas top-up.',
  partsReplaced = 'OEM High-Density Filter Mesh + Gas Seal Valve (90-day warranty applied)',
  serviceStatus = 'Fully Operational (Passed 16-point safety check)',
  technicianNotes = 'Appliance temperature stabilized at optimal levels. Clean filters every 30 days for maximum efficiency.',
  onViewFullReport,
}) => {
  const handleDefaultViewReport = () => {
    Alert.alert(
      'Service Inspection Report',
      `• Diagnosis: ${diagnosis}\n\n• Work Performed: ${workPerformed}\n\n• Parts Replaced: ${partsReplaced}\n\n• Status: ${serviceStatus}\n\n• Technician Notes: ${technicianNotes}`
    );
  };

  const ReportRow = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.row}>
      <View style={styles.bulletRow}>
        <Ionicons name="checkmark-circle" size={14} color={colors.success} />
        <Text style={styles.label}>{label}</Text>
      </View>
      <Text style={styles.value}>{value}</Text>
    </View>
  );

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <Ionicons name="document-text" size={18} color={colors.primary} />
          <Text style={styles.heading}>Service Report</Text>
        </View>
        <TouchableOpacity
          onPress={onViewFullReport || handleDefaultViewReport}
          activeOpacity={0.7}
          style={styles.viewLink}
        >
          <Text style={styles.linkText}>View Full Report</Text>
          <Ionicons name="chevron-forward" size={12} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      <ReportRow label="Diagnosis" value={diagnosis} />
      <ReportRow label="Work Performed" value={workPerformed} />
      <ReportRow label="Parts Replaced" value={partsReplaced} />
      <ReportRow label="Service Status" value={serviceStatus} />
      <ReportRow label="Technician Notes" value={technicianNotes} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: spacing.radiusMd + 2,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs + 2,
    borderWidth: 1,
    borderColor: '#E7ECF3',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heading: {
    fontSize: typography.fontSize.sm + 1,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  viewLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  linkText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F4F9',
    marginVertical: spacing.xs + 2,
  },
  row: {
    marginVertical: 4,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  label: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: '#334155',
  },
  value: {
    fontSize: typography.fontSize.xs - 1,
    color: '#64748B',
    lineHeight: 16,
    paddingLeft: 18,
  },
});

export default ServiceReportCard;
