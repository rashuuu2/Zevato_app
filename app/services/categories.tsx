import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/common/Header';
import CategoryCard from '@/components/services/CategoryCard';
import categories from '@/data/categories';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { ServiceCategory } from '@/types/service';

export default function CategoriesScreen() {
  const router = useRouter();

  const handleSelect = (category: ServiceCategory) => {
    router.push({
      pathname: '/services/service-details' as any,
      params: { categoryId: category.id, categoryName: category.name },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header title="All Categories" />
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CategoryCard category={item} onPress={handleSelect} />}
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
