import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/common/Header';
import ProductCard from '@/components/services/ProductCard';
import products from '@/data/products';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { Product } from '@/types/service';

export default function ProductsScreen() {
  const router = useRouter();
  const { brandName, categoryId } = useLocalSearchParams<{ brandName?: string; categoryId?: string }>();

  const filteredProducts = products.filter((p) => {
    if (categoryId && p.categoryId !== categoryId) return false;
    return true;
  });

  const handleSelectProduct = (product: Product) => {
    router.push({
      pathname: '/services/product-details' as any,
      params: { id: product.id },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header title={brandName ? `${brandName} Appliances` : 'Select Product Model'} />
      <FlatList
        data={filteredProducts.length > 0 ? filteredProducts : products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProductCard product={item} onPress={handleSelectProduct} />}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: spacing.md,
  },
});
