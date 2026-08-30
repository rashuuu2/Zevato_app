import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Input from '@/components/common/Input';
import CategoryCard from '@/components/services/CategoryCard';
import SectionHeader from '@/components/common/SectionHeader';
import BrandCard from '@/components/services/BrandCard';

import categories from '@/data/categories';
import brands from '@/data/brands';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { ServiceCategory, Brand } from '@/types/service';

export default function ServicesScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectCategory = (category: ServiceCategory) => {
    router.push({
      pathname: '/services/service-details' as any,
      params: { categoryId: category.id, categoryName: category.name },
    });
  };

  const handleSelectBrand = (brand: Brand) => {
    router.push({
      pathname: '/services/products' as any,
      params: { brandId: brand.id, brandName: brand.name },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <Text style={styles.pageTitle}>Service Catalog</Text>
        <Input
          placeholder="Search for AC, Washing Machine, RO service..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Ionicons name="search" size={20} color={colors.textSecondary} />}
          containerStyle={styles.searchBar}
        />

        <FlatList
          data={filteredCategories}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={() => (
            <>
              <SectionHeader title="Popular Appliance Brands" />
              <View style={styles.brandsRow}>
                {brands.map((b) => (
                  <BrandCard key={b.id} brand={b} onPress={handleSelectBrand} />
                ))}
              </View>
              <SectionHeader title="All Service Categories" />
            </>
          )}
          renderItem={({ item }) => (
            <CategoryCard category={item} onPress={handleSelectCategory} />
          )}
          contentContainerStyle={styles.listContent}
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
  },
  pageTitle: {
    fontSize: typography.fontSize.heading,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
  },
  searchBar: {
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
  },
  brandsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs + 2,
    marginHorizontal: spacing.md,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
});
