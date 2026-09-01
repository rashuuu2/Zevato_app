import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/components/common/Header';
import Input from '@/components/common/Input';
import BookingStepper from '@/components/booking/BookingStepper';
import EmptyState from '@/components/common/EmptyState';

import brands from '@/data/brands';
import useBooking from '@/hooks/useBooking';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { Brand } from '@/types/service';

export default function BrandsScreen() {
  const router = useRouter();
  const { updateBooking } = useBooking();
  const { categoryId, categoryName } = useLocalSearchParams<{ categoryId?: string; categoryName?: string }>();
  const [search, setSearch] = useState('');

  const categoryBrands = brands.filter((b) => {
    if (categoryId && !b.categories.includes(categoryId)) return false;
    if (search && !b.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleSelectBrand = (brand: Brand) => {
    updateBooking({
      brandId: brand.id,
      brandName: brand.name,
    });
    router.push({
      pathname: '/services/model-input' as any,
      params: {
        categoryId: categoryId || '',
        categoryName: categoryName || '',
        brandId: brand.id,
        brandName: brand.name,
      },
    });
  };

  const renderBrandCard = ({ item }: { item: Brand }) => {
    const iconName = (item.logo || 'hardware-chip-outline') as any;
    return (
      <TouchableOpacity
        style={styles.brandCard}
        onPress={() => handleSelectBrand(item)}
        activeOpacity={0.7}
      >
        <View style={styles.brandIconCircle}>
          <Ionicons name={iconName} size={28} color={colors.primary} />
        </View>
        <Text style={styles.brandName} numberOfLines={1}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header
        title={categoryName ? `Select ${categoryName} Brand` : 'Select Brand'}
        subtitle="Choose your appliance brand"
      />
      <BookingStepper currentStep={2} />
      <View style={styles.container}>
        <Input
          placeholder="Search brand name..."
          value={search}
          onChangeText={setSearch}
          leftIcon={<Ionicons name="search-outline" size={18} color={colors.textSecondary} />}
          containerStyle={styles.searchBar}
        />
        <FlatList
          data={categoryBrands}
          keyExtractor={(item) => item.id}
          numColumns={3}
          columnWrapperStyle={styles.rowWrapper}
          renderItem={renderBrandCard}
          ListEmptyComponent={
            <EmptyState
              icon="hardware-chip-outline"
              title="No brands found"
              description={`No brands match your selection${categoryName ? ` for ${categoryName}` : ''}.`}
            />
          }
          ListFooterComponent={
            <View style={styles.trustBanner}>
              <Ionicons name="shield-checkmark" size={18} color={colors.success} />
              <Text style={styles.trustText}>
                All technicians are brand-certified & background verified
              </Text>
            </View>
          }
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  searchBar: {
    marginVertical: spacing.xs,
  },
  rowWrapper: {
    justifyContent: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  brandCard: {
    width: '30%',
    backgroundColor: colors.surface,
    borderRadius: spacing.radiusMd,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
    alignItems: 'center',
  },
  brandIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  brandName: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    textAlign: 'center',
  },
  trustBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successLight,
    padding: spacing.sm + 2,
    borderRadius: spacing.radiusMd,
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  trustText: {
    fontSize: typography.fontSize.xs,
    color: colors.success,
    fontWeight: typography.fontWeight.semibold,
    flex: 1,
  },
  list: {
    paddingVertical: spacing.xs,
    paddingBottom: spacing.xl,
  },
});
