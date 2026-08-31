import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/common/Header';
import ProductCard from '@/components/services/ProductCard';
import EmptyState from '@/components/common/EmptyState';
import products from '@/data/products';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { Product } from '@/types/service';

export default function ProductsScreen() {
  const router = useRouter();
  const { brandId, brandName, categoryId, categoryName } = useLocalSearchParams<{
    brandId?: string;
    brandName?: string;
    categoryId?: string;
    categoryName?: string;
  }>();

  const filteredProducts = products.filter((p) => {
    if (categoryId && p.categoryId !== categoryId) return false;
    if (brandId && p.brandId !== brandId) return false;
    return true;
  });

  const handleSelectProduct = (product: Product) => {
    router.push({
      pathname: '/services/product-details' as any,
      params: {
        id: product.id,
        brandId: brandId || product.brandId || '',
        brandName: brandName || '',
        categoryId: categoryId || product.categoryId || '',
        categoryName: categoryName || '',
      },
    });
  };

  const getTitle = () => {
    if (brandName && categoryName) return `${brandName} ${categoryName}`;
    if (brandName) return `${brandName} Models`;
    if (categoryName) return `${categoryName} Models`;
    return 'Select Appliance Model';
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header title={getTitle()} subtitle="Choose your specific product model" />
      <View style={styles.container}>
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ProductCard product={item} onPress={handleSelectProduct} />}
          ListEmptyComponent={
            <EmptyState
              icon="cube-outline"
              title="No specific models found"
              description={`We couldn't find listed models for ${brandName || 'this selection'}. You can still choose general service options.`}
              actionTitle="View General Service Packages"
              onAction={() =>
                router.push({
                  pathname: '/services/service-details' as any,
                  params: { categoryId: categoryId || 'ac' },
                })
              }
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
  list: {
    paddingVertical: spacing.sm,
    paddingBottom: spacing.xl,
  },
});
