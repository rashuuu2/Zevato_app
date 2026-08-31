import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/components/common/Header';
import Button from '@/components/common/Button';
import SectionHeader from '@/components/common/SectionHeader';
import products from '@/data/products';
import brands from '@/data/brands';
import categories from '@/data/categories';
import useBooking from '@/hooks/useBooking';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { formatCurrency } from '@/utils/formatCurrency';

export default function ProductDetailsScreen() {
  const router = useRouter();
  const { updateBooking } = useBooking();
  const { id, brandName, categoryName } = useLocalSearchParams<{
    id?: string;
    brandName?: string;
    categoryName?: string;
  }>();

  const product = products.find((p) => p.id === id) || products[0];
  const brand = brands.find((b) => b.id === product.brandId);
  const category = categories.find((c) => c.id === product.categoryId);

  const displayBrand = brandName || brand?.name || 'Appliance';
  const displayCategory = categoryName || category?.name || 'Service';

  const handleSelectService = () => {
    updateBooking({
      productName: product.name,
      brandName: displayBrand,
      categoryName: displayCategory,
    });

    router.push({
      pathname: '/services/service-details' as any,
      params: {
        productId: product.id,
        categoryId: product.categoryId,
        brandId: product.brandId || '',
        productName: product.name,
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header title={product.name} subtitle={`${displayBrand} • ${displayCategory}`} />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Product Card Graphic */}
        <View style={styles.imageCard}>
          <View style={styles.iconCircle}>
            <Ionicons name={(product.image as any) || 'hardware-chip-outline'} size={64} color={colors.primary} />
          </View>
          <View style={styles.brandBadge}>
            <Text style={styles.brandBadgeText}>{displayBrand.toUpperCase()}</Text>
          </View>
          <Text style={styles.title}>{product.name}</Text>
          <Text style={styles.price}>Starting at {formatCurrency(product.startingPrice)}</Text>
        </View>

        {/* Feature Highlights */}
        <SectionHeader title="Included Appliance Care" />
        <View style={styles.featureBox}>
          <View style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={20} color={colors.success} />
            <Text style={styles.featureText}>Certified multi-point diagnostic inspection</Text>
          </View>
          <View style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={20} color={colors.success} />
            <Text style={styles.featureText}>100% Genuine OEM parts replacement compatibility</Text>
          </View>
          <View style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={20} color={colors.success} />
            <Text style={styles.featureText}>Complimentary 30-day post-service warranty</Text>
          </View>
          <View style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={20} color={colors.success} />
            <Text style={styles.featureText}>Background verified & trained technician</Text>
          </View>
        </View>

        <Button
          title="Select Service Options"
          variant="primary"
          size="large"
          onPress={handleSelectService}
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
    paddingBottom: spacing.xl,
  },
  imageCard: {
    backgroundColor: colors.surface,
    padding: spacing.xl,
    borderRadius: spacing.radiusLg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  brandBadge: {
    backgroundColor: colors.primaryLight,
    paddingVertical: 3,
    paddingHorizontal: spacing.sm,
    borderRadius: spacing.radiusFull,
    marginBottom: spacing.xs,
  },
  brandBadgeText: {
    fontSize: typography.fontSize.xs - 1,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    textAlign: 'center',
  },
  price: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    marginTop: spacing.xs,
  },
  featureBox: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: spacing.radiusMd,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 4,
  },
  featureText: {
    fontSize: typography.fontSize.sm,
    color: colors.text,
    flex: 1,
  },
  btn: {
    marginTop: spacing.sm,
  },
});
