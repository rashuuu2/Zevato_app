import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/components/common/Header';
import Button from '@/components/common/Button';
import products from '@/data/products';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { formatCurrency } from '@/utils/formatCurrency';

export default function ProductDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const product = products.find((p) => p.id === id) || products[0];

  const handleBookNow = () => {
    router.push({
      pathname: '/services/service-details' as any,
      params: { categoryId: product.categoryId },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header title={product.name} />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.imageCard}>
          <Ionicons name="hardware-chip-outline" size={80} color={colors.primary} />
          <Text style={styles.title}>{product.name}</Text>
          <Text style={styles.price}>Starting at {formatCurrency(product.startingPrice)}</Text>
        </View>

        <Text style={styles.sectionHeading}>Included Care Features</Text>
        <View style={styles.bulletList}>
          <Text style={styles.bullet}>• Comprehensive multi-point diagnostic check</Text>
          <Text style={styles.bullet}>• Certified OEM spare parts compatibility</Text>
          <Text style={styles.bullet}>• 30-day Post service warranty coverage</Text>
        </View>

        <Button
          title="Select Service Options"
          variant="primary"
          size="large"
          onPress={handleBookNow}
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
  imageCard: {
    backgroundColor: colors.surface,
    padding: spacing.xl,
    borderRadius: spacing.radiusLg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  price: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    marginTop: spacing.xs,
  },
  sectionHeading: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  bulletList: {
    gap: spacing.xs,
    marginBottom: spacing.xl,
  },
  bullet: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  btn: {
    marginTop: spacing.md,
  },
});
