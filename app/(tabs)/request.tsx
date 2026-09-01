import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import categories from '@/data/categories';
import useBooking from '@/hooks/useBooking';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { ServiceCategory } from '@/types/service';

export default function RequestScreen() {
  const router = useRouter();
  const { updateBooking, resetBooking } = useBooking();

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
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <Text style={styles.pageTitle}>New Service Request</Text>
        <Text style={styles.pageSubtitle}>
          Select your appliance category to start the booking process
        </Text>

        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          renderItem={renderCategoryCard}
          contentContainerStyle={styles.listContent}
          ListFooterComponent={
            <View style={styles.helpBanner}>
              <Ionicons name="help-circle-outline" size={20} color={colors.primary} />
              <Text style={styles.helpText}>
                You'll select brand, enter model, describe the issue, and pick a time — all in the next steps.
              </Text>
            </View>
          }
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
  pageSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginHorizontal: spacing.md,
    marginTop: 2,
    marginBottom: spacing.md,
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
  listContent: {
    paddingBottom: spacing.md,
  },
  helpBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    padding: spacing.sm + 2,
    borderRadius: spacing.radiusMd,
    gap: spacing.xs,
  },
  helpText: {
    fontSize: typography.fontSize.xs,
    color: colors.primaryDark,
    flex: 1,
    lineHeight: 16,
  },
});
