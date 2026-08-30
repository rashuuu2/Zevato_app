import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import Header from '@/components/common/Header';
import Button from '@/components/common/Button';

import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export default function ReferEarnScreen() {
  const code = 'ZEVOTA200';

  const handleShare = () => {
    Alert.alert('Referral Code Copied', `Code ${code} copied to clipboard! Share it with friends.`);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header title="Refer & Earn" />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Ionicons name="gift" size={64} color={colors.primary} />
          <Text style={styles.title}>Give ₹200, Get ₹200</Text>
          <Text style={styles.desc}>
            Invite your friends and family to Zevota Care. They get ₹200 off their first service, and you get ₹200 care credit when completed.
          </Text>

          <View style={styles.codeBox}>
            <Text style={styles.codeLabel}>YOUR REFERRAL CODE</Text>
            <Text style={styles.codeText}>{code}</Text>
          </View>
        </View>

        <Button title="Share Referral Code" variant="primary" size="large" onPress={handleShare} style={styles.btn} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    padding: spacing.xl,
    borderRadius: spacing.radiusLg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    fontSize: typography.fontSize.heading,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginTop: spacing.md,
  },
  desc: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
    lineHeight: 20,
  },
  codeBox: {
    marginTop: spacing.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.primaryLight,
    borderRadius: spacing.radiusMd,
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  codeLabel: {
    fontSize: typography.fontSize.xs - 2,
    fontWeight: typography.fontWeight.bold,
    color: colors.primaryDark,
    letterSpacing: 1,
  },
  codeText: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    marginTop: 2,
    letterSpacing: 2,
  },
  btn: {
    marginTop: spacing.xl,
  },
});
