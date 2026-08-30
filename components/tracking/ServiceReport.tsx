import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export interface ServiceReportProps {
  summary: string;
  checklist: { task: string; done: boolean }[];
  remarks?: string;
}

export const ServiceReport: React.FC<ServiceReportProps> = ({ summary, checklist, remarks }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.heading}>Technician Inspection Report</Text>
      <Text style={styles.summary}>{summary}</Text>
      <View style={styles.list}>
        {checklist.map((item, index) => (
          <View key={index} style={styles.checkItem}>
            <Ionicons
              name={item.done ? 'checkmark-circle' : 'ellipse-outline'}
              size={18}
              color={item.done ? colors.success : colors.textMuted}
            />
            <Text style={[styles.checkText, item.done && styles.doneText]}>{item.task}</Text>
          </View>
        ))}
      </View>
      {remarks && (
        <View style={styles.remarksBox}>
          <Text style={styles.remarksTitle}>Technician Notes:</Text>
          <Text style={styles.remarksText}>{remarks}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: spacing.radiusMd,
    borderWidth: 1,
    borderColor: colors.border,
    marginVertical: spacing.sm,
  },
  heading: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  summary: {
    fontSize: typography.fontSize.xs + 1,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  list: {
    gap: spacing.xs,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  checkText: {
    fontSize: typography.fontSize.xs + 1,
    color: colors.textSecondary,
  },
  doneText: {
    color: colors.text,
    fontWeight: typography.fontWeight.medium,
  },
  remarksBox: {
    marginTop: spacing.md,
    padding: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: spacing.radiusSm,
  },
  remarksTitle: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  remarksText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
});

export default ServiceReport;
