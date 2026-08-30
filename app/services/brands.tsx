import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/common/Header';
import BrandCard from '@/components/services/BrandCard';
import brands from '@/data/brands';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { Brand } from '@/types/service';

export default function BrandsScreen() {
  const router = useRouter();

  const handleSelect = (brand: Brand) => {
    router.push({
      pathname: '/services/products' as any,
      params: { brandId: brand.id, brandName: brand.name },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header title="Select Appliance Brand" />
      <FlatList
        data={brands}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemWrapper}>
            <BrandCard brand={item} onPress={handleSelect} />
          </View>
        )}
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
  itemWrapper: {
    marginBottom: spacing.sm,
  },
});
