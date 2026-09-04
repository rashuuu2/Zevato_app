import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/components/common/Header';
import BookingStepper from '@/components/booking/BookingStepper';
import EmptyState from '@/components/common/EmptyState';

import { fetchVariantsForSeries } from '@/services/catalog';
import useBooking from '@/hooks/useBooking';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { ProductVariant } from '@/types/service';

export default function VariantsScreen() {
  const router = useRouter();
  const { updateBooking } = useBooking();
  const {
    seriesId = 'samsung-neo-qled-4k',
    seriesName = 'Neo QLED 4K Series',
    categoryId = 'tv-video-audio',
    categoryName = 'TV, Video & Audio',
    brandId = 'samsung',
    brandName = 'Samsung',
    selectedSize: initialSize,
  } = useLocalSearchParams<{
    seriesId?: string;
    seriesName?: string;
    categoryId?: string;
    categoryName?: string;
    brandId?: string;
    brandName?: string;
    selectedSize?: string;
  }>();

  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilterSize, setSelectedFilterSize] = useState<number | null>(
    initialSize && !isNaN(Number(initialSize)) ? Number(initialSize) : null
  );

  useEffect(() => {
    let isMounted = true;
    async function loadVariants() {
      setLoading(true);
      const data = await fetchVariantsForSeries(seriesId);
      if (isMounted) {
        setVariants(data);
        setLoading(false);
      }
    }
    loadVariants();
    return () => {
      isMounted = false;
    };
  }, [seriesId]);

  // Extract distinct sizes available in this series
  const availableSizes = useMemo(() => {
    const set = new Set<number>();
    variants.forEach((v) => {
      if (v.sizeValue) set.add(v.sizeValue);
    });
    return Array.from(set).sort((a, b) => a - b);
  }, [variants]);

  // Filter variants by chosen size chip
  const displayedVariants = useMemo(() => {
    if (!selectedFilterSize) return variants;
    return variants.filter((v) => v.sizeValue === selectedFilterSize);
  }, [variants, selectedFilterSize]);

  const handleSelectVariant = (variant: ProductVariant) => {
    const fullName = `${seriesName} ${variant.modelNumber} (${variant.sizeLabel})`;

    console.log('[BOOKING SELECTION] Selected Variant:', {
      productVariantId: variant.id,
      productId: seriesId,
      modelNumber: variant.modelNumber,
      sizeLabel: variant.sizeLabel,
      price: variant.price,
    });

    updateBooking({
      productId: seriesId,
      productVariantId: variant.id,
      productName: fullName,
      modelNumber: variant.modelNumber,
    });

    router.push({
      pathname: '/services/issue-select' as any,
      params: {
        categoryId,
        categoryName,
        brandId,
        brandName,
        modelNumber: variant.modelNumber,
        productVariantId: variant.id,
        productId: seriesId,
      },
    });
  };

  const renderVariantCard = ({ item }: { item: ProductVariant }) => {
    const specs = item.specs || {};
    const specEntries = Object.entries(specs);

    return (
      <View style={styles.variantCard}>
        {/* Top row: Model number, size badge, release year */}
        <View style={styles.variantHeader}>
          <View>
            <Text style={styles.modelNumber}>{item.modelNumber}</Text>
            <Text style={styles.seriesSubtitle}>{seriesName}</Text>
          </View>
          <View style={styles.badgeRow}>
            <View style={styles.sizeBadge}>
              <Text style={styles.sizeBadgeText}>{item.sizeLabel}</Text>
            </View>
            {item.releaseYear && (
              <View style={styles.yearBadge}>
                <Text style={styles.yearBadgeText}>{item.releaseYear}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Specs Highlights */}
        {specEntries.length > 0 && (
          <View style={styles.specsGrid}>
            {specEntries.map(([key, val], idx) => (
              <View key={idx} style={styles.specItem}>
                <Text style={styles.specKey}>{key}:</Text>
                <Text style={styles.specVal} numberOfLines={1}>
                  {String(val)}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Bottom row: Price & Select button */}
        <View style={styles.cardBottomRow}>
          <View>
            <Text style={styles.priceLabel}>Retail Price (approx)</Text>
            <Text style={styles.priceValue}>
              ₹{item.price.toLocaleString('en-IN')}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.selectBtn}
            onPress={() => handleSelectVariant(item)}
            activeOpacity={0.8}
          >
            <Text style={styles.selectBtnText}>Select Model</Text>
            <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header
        title={seriesName}
        subtitle={`${brandName} • Choose Exact Model`}
      />
      <BookingStepper currentStep={3} />

      {/* Size Filter Chip Row */}
      {availableSizes.length > 0 && (
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Screen Size:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsScroll}
          >
            <TouchableOpacity
              style={[
                styles.chip,
                selectedFilterSize === null && styles.chipActive,
              ]}
              onPress={() => setSelectedFilterSize(null)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedFilterSize === null && styles.chipTextActive,
                ]}
              >
                All Sizes
              </Text>
            </TouchableOpacity>

            {availableSizes.map((sz) => {
              const isActive = selectedFilterSize === sz;
              return (
                <TouchableOpacity
                  key={sz}
                  style={[styles.chip, isActive && styles.chipActive]}
                  onPress={() => setSelectedFilterSize(isActive ? null : sz)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[styles.chipText, isActive && styles.chipTextActive]}
                  >
                    {sz}"
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      <View style={styles.container}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading variants & specs...</Text>
          </View>
        ) : (
          <FlatList
            data={displayedVariants}
            renderItem={renderVariantCard}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <EmptyState
                icon="cube-outline"
                title="No models found"
                description={`No models available for the selected size (${selectedFilterSize}").`}
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
  filterSection: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    fontWeight: '600',
  },
  chipsScroll: {
    gap: spacing.xs,
    paddingRight: spacing.md,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  listContent: {
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
  variantCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  variantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  modelNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  seriesSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
  },
  sizeBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  sizeBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  yearBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  yearBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  specsGrid: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: spacing.sm,
    marginVertical: spacing.sm,
    gap: 4,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  specKey: {
    fontSize: 11,
    color: colors.textSecondary,
    textTransform: 'capitalize',
    fontWeight: '500',
  },
  specVal: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '600',
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  priceLabel: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  priceValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  selectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 10,
    gap: 4,
  },
  selectBtnText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
});
