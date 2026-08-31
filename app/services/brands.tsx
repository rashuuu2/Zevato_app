import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/components/common/Header';
import Input from '@/components/common/Input';
import BrandCard from '@/components/services/BrandCard';
import EmptyState from '@/components/common/EmptyState';
import brands from '@/data/brands';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { Brand } from '@/types/service';

export default function BrandsScreen() {
  const router = useRouter();
  const { categoryId, categoryName } = useLocalSearchParams<{ categoryId?: string; categoryName?: string }>();
  const [search, setSearch] = useState('');

  const categoryBrands = brands.filter((b) => {
    if (categoryId && !b.categories.includes(categoryId)) {
      return false;
    }
    if (search && !b.name.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    return true;
  });

  const handleSelectBrand = (brand: Brand) => {
    router.push({
      pathname: '/services/products' as any,
      params: {
        categoryId: categoryId || '',
        categoryName: categoryName || '',
        brandId: brand.id,
        brandName: brand.name,
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header
        title={categoryName ? `${categoryName} Brands` : 'Appliance Brands'}
        subtitle="Select your appliance brand"
      />
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
          numColumns={2}
          columnWrapperStyle={styles.rowWrapper}
          renderItem={({ item }) => (
            <View style={styles.cardItem}>
              <BrandCard brand={item} onPress={handleSelectBrand} />
            </View>
          )}
          ListEmptyComponent={
            <EmptyState
              icon="hardware-chip-outline"
              title="No brands found"
              description={`No brands match your selection${categoryName ? ` for ${categoryName}` : ''}.`}
            />
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
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  cardItem: {
    width: '48%',
  },
  list: {
    paddingVertical: spacing.xs,
    paddingBottom: spacing.xl,
  },
});
