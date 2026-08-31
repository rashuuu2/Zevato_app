import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/components/common/Header';
import Input from '@/components/common/Input';
import CategoryCard from '@/components/services/CategoryCard';
import EmptyState from '@/components/common/EmptyState';
import categories from '@/data/categories';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { ServiceCategory } from '@/types/service';

export default function CategoriesScreen() {
  const router = useRouter();
  const { categoryId: paramCategoryId } = useLocalSearchParams<{ categoryId?: string }>();
  const [search, setSearch] = useState('');

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectCategory = (category: ServiceCategory) => {
    router.push({
      pathname: '/services/brands' as any,
      params: { categoryId: category.id, categoryName: category.name },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header title="Appliance Categories" subtitle="Select a category to view compatible brands" />
      <View style={styles.container}>
        <Input
          placeholder="Filter categories..."
          value={search}
          onChangeText={setSearch}
          leftIcon={<Ionicons name="filter-outline" size={18} color={colors.textSecondary} />}
          containerStyle={styles.searchBar}
        />
        <FlatList
          data={filteredCategories}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CategoryCard
              category={item}
              selected={item.id === paramCategoryId}
              onPress={handleSelectCategory}
            />
          )}
          ListEmptyComponent={
            <EmptyState
              icon="grid-outline"
              title="No categories available"
              description="No matching categories found for your selection."
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
  list: {
    paddingVertical: spacing.xs,
    paddingBottom: spacing.xl,
  },
});
