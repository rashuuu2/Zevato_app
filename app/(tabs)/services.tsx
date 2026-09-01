import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Input from '@/components/common/Input';
import EmptyState from '@/components/common/EmptyState';

import categories from '@/data/categories';
import useBooking from '@/hooks/useBooking';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { ServiceCategory } from '@/types/service';

export default function ServicesScreen() {
  const router = useRouter();
  const { updateBooking, resetBooking } = useBooking();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectCategory = (category: ServiceCategory) => {
    resetBooking();
    updateBooking({
      category,
      categoryId: category.id,
      categoryName: category.name,
    });
    router.push({
      pathname: '/services/brands' as any,
      params: { categoryId: category.id, categoryName: category.name },
    });
  };

  const renderCategoryCard = ({ item }: { item: ServiceCategory }) => {
    const iconName = (item.icon || 'build-outline') as any;
    return (
      <TouchableOpacity
        style={styles.categoryCard}
        onPress={() => handleSelectCategory(item)}
        activeOpacity={0.7}
      >
        <View style={styles.categoryIconCircle}>
          <Ionicons name={iconName} size={28} color={colors.primary} />
        </View>
        <Text style={styles.categoryName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.categoryDesc} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.categoryArrow}>
          <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <Text style={styles.pageTitle}>Services</Text>
        <Text style={styles.pageSubtitle}>Select a service category to get started</Text>

        <Input
          placeholder="Search AC, Washing Machine, RO..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Ionicons name="search" size={20} color={colors.textSecondary} />}
          containerStyle={styles.searchBar}
        />

        <FlatList
          data={filteredCategories}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          renderItem={renderCategoryCard}
          ListEmptyComponent={
            <EmptyState
              icon="search-outline"
              title="No categories found"
              description={`No service categories match "${searchQuery}".`}
            />
          }
          contentContainerStyle={styles.listContent}
        />

        {/* Help Banner */}
        <View style={styles.helpBanner}>
          <Ionicons name="chatbubbles-outline" size={20} color={colors.primary} />
          <Text style={styles.helpText}>
            Can't find what you need?{' '}
            <Text style={styles.helpLink}>Chat with our experts</Text>
          </Text>
        </View>
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
  pageSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginHorizontal: spacing.md,
    marginTop: 2,
    marginBottom: spacing.xs,
  },
  searchBar: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.xs,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  categoryCard: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: spacing.radiusMd,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    alignItems: 'center',
    position: 'relative',
  },
  categoryIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  categoryName: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 2,
  },
  categoryDesc: {
    fontSize: typography.fontSize.xs - 1,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 14,
  },
  categoryArrow: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
  },
  listContent: {
    paddingBottom: spacing.md,
  },
  helpBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.sm + 2,
    borderRadius: spacing.radiusMd,
    gap: spacing.xs,
  },
  helpText: {
    fontSize: typography.fontSize.xs,
    color: colors.text,
    flex: 1,
  },
  helpLink: {
    color: colors.primary,
    fontWeight: typography.fontWeight.bold,
  },
});
