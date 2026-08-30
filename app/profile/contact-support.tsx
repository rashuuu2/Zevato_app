import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '@/components/common/Header';
import Button from '@/components/common/Button';
import ProfileMenuItem from '@/components/profile/ProfileMenuItem';

import { colors } from '@/constants/colors';
import { config } from '@/constants/config';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export default function ContactSupportScreen() {
  const handleCall = () => {
    Alert.alert('Calling Support', `Dialing ${config.supportPhone}...`);
  };

  const handleEmail = () => {
    Alert.alert('Email Support', `Opening email client to ${config.supportEmail}...`);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header title="Contact Support" />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Need Immediate Assistance?</Text>
        <Text style={styles.subtitle}>Our customer delight team is available 24/7 for support.</Text>

        <ProfileMenuItem
          icon="call-outline"
          title="Toll-Free Phone Support"
          subtitle={config.supportPhone}
          onPress={handleCall}
        />

        <ProfileMenuItem
          icon="mail-outline"
          title="Email Support"
          subtitle={config.supportEmail}
          onPress={handleEmail}
        />

        <Button
          title="Start Live Chat"
          variant="primary"
          size="large"
          onPress={() => Alert.alert('Live Chat', 'Connecting with support agent...')}
          style={styles.btn}
        />
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
  title: {
    fontSize: typography.fontSize.heading,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  btn: {
    marginTop: spacing.xl,
  },
});
