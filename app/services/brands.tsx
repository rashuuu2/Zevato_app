import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Header from '@/components/common/Header';
import Input from '@/components/common/Input';
import BookingStepper from '@/components/booking/BookingStepper';
import EmptyState from '@/components/common/EmptyState';

import fallbackBrands from '@/data/brands';
import { fetchBrandsForCategory, fetchSeriesForCategoryBrand } from '@/services/catalog';
import useBooking from '@/hooks/useBooking';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { Brand } from '@/types/service';

export default function BrandsScreen() {
  const router = useRouter();
  const { updateBooking } = useBooking();
  const { categoryId, categoryName } = useLocalSearchParams<{ categoryId?: string; categoryName?: string }>();

  const [search, setSearch] = useState('');
  const [brandsList, setBrandsList] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadBrands() {
      setLoading(true);
      if (categoryId) {
        const remote = await fetchBrandsForCategory(categoryId);
        if (isMounted && remote.length > 0) {
          setBrandsList(remote);
          setLoading(false);
          return;
        }
      }

      // Fallback
      if (isMounted) {
        const filtered = fallbackBrands.filter((b) => {
          if (!categoryId) return true;
          if (categoryId === 'tv-video-audio') return true;
          return Array.isArray(b.categories) ? b.categories.includes(categoryId) : true;
        });
        setBrandsList(filtered.length > 0 ? filtered : fallbackBrands);
        setLoading(false);
      }
    }
    loadBrands();
    return () => {
      isMounted = false;
    };
  }, [categoryId]);

  const filteredBrands = brandsList.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectBrand = async (brand: Brand) => {
    updateBooking({
      brandId: brand.id,
      brandName: brand.name,
    });

    // Check if category & brand have series in the catalog
    if (categoryId) {
      try {
        const series = await fetchSeriesForCategoryBrand(categoryId, brand.id);
        if (series && series.length > 0) {
          router.push({
            pathname: '/services/series' as any,
            params: {
              categoryId,
              categoryName: categoryName || '',
              brandId: brand.id,
              brandName: brand.name,
            },
          });
          return;
        }
      } catch (e) {
        console.warn('Checking catalog series failed, continuing to manual input:', e);
      }
    }

    // Fallback to manual model input screen for scaffolded categories
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
    return (
      <TouchableOpacity
        style={styles.brandCard}
        onPress={() => handleSelectBrand(item)}
        activeOpacity={0.7}
      >
        <View style={styles.brandIconCircle}>
          <MaterialCommunityIcons name="tag-outline" size={24} color={colors.primary} />
        </View>
        <Text style={styles.brandName} numberOfLines={1}>
          {item.name}
        </Text>
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

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading brands...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredBrands}
            renderItem={renderBrandCard}
            keyExtractor={(item) => item.id}
            numColumns={3}
            columnWrapperStyle={styles.row}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <EmptyState
                icon="search-outline"
                title="No brands found"
                description={`No brands matching "${search}". Try searching for another brand.`}
              />
            }
          />
        )}
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
    marginBottom: spacing.md,
  },
  listContent: {
    paddingBottom: spacing.xxl,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  brandCard: {
    width: '31%',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  brandIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  brandName: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
});
