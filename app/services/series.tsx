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
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Header from '@/components/common/Header';
import BookingStepper from '@/components/booking/BookingStepper';
import EmptyState from '@/components/common/EmptyState';

import { fetchSeriesForCategoryBrand } from '@/services/catalog';
import useBooking from '@/hooks/useBooking';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { Product } from '@/types/service';

export default function SeriesScreen() {
  const router = useRouter();
  const { updateBooking } = useBooking();
  const {
    categoryId = 'tv-video-audio',
    categoryName = 'TV, Video & Audio',
    brandId = 'samsung',
    brandName = 'Samsung',
  } = useLocalSearchParams<{
    categoryId?: string;
    categoryName?: string;
    brandId?: string;
    brandName?: string;
  }>();

  const [seriesList, setSeriesList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadSeries() {
      setLoading(true);
      const data = await fetchSeriesForCategoryBrand(categoryId, brandId);
      if (isMounted) {
        setSeriesList(data);
        setLoading(false);
      }
    }
    loadSeries();
    return () => {
      isMounted = false;
    };
  }, [categoryId, brandId]);

  // Compute union of all available size values across all series
  const allSizes = useMemo(() => {
    const sizeSet = new Set<number>();
    seriesList.forEach((s) => {
      if (Array.isArray(s.availableSizes)) {
        s.availableSizes.forEach((sz) => sizeSet.add(sz));
      }
      if (Array.isArray(s.variants)) {
        s.variants.forEach((v) => {
          if (v.sizeValue) sizeSet.add(v.sizeValue);
        });
      }
    });
    return Array.from(sizeSet).sort((a, b) => a - b);
  }, [seriesList]);

  // Filter series by size chip if selected
  const filteredSeries = useMemo(() => {
    if (!selectedSize) return seriesList;
    return seriesList.filter((s) => {
      if (Array.isArray(s.availableSizes)) {
        return s.availableSizes.includes(selectedSize);
      }
      if (Array.isArray(s.variants)) {
        return s.variants.some((v) => v.sizeValue === selectedSize);
      }
      return false;
    });
  }, [seriesList, selectedSize]);

  const handleSelectSeries = (series: Product) => {
    updateBooking({
      productId: series.id,
      productName: series.name,
    });

    router.push({
      pathname: '/services/variants' as any,
      params: {
        seriesId: series.id,
        seriesName: series.name,
        categoryId,
        categoryName,
        brandId,
        brandName,
        selectedSize: selectedSize ? String(selectedSize) : '',
      },
    });
  };

  const renderSeriesCard = ({ item }: { item: Product }) => {
    const features = item.features || [];
    const count = item.variantCount || (item.variants ? item.variants.length : 0);

    return (
      <TouchableOpacity
        style={styles.seriesCard}
        onPress={() => handleSelectSeries(item)}
        activeOpacity={0.8}
      >
        <View style={styles.cardHeader}>
          <View style={styles.titleGroup}>
            <Text style={styles.seriesTitle}>{item.name}</Text>
            {item.description ? (
              <Text style={styles.seriesDescription} numberOfLines={2}>
                {item.description}
              </Text>
            ) : null}
          </View>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons name="television" size={26} color={colors.primary} />
          </View>
        </View>

        {/* Feature Tags */}
        {features.length > 0 && (
          <View style={styles.tagsRow}>
            {features.slice(0, 3).map((feat, idx) => (
              <View key={idx} style={styles.tagBadge}>
                <Text style={styles.tagText}>{feat}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Card Footer: Starting price + Variant count + Action */}
        <View style={styles.cardFooter}>
          <View>
            <Text style={styles.priceLabel}>Starting from</Text>
            <Text style={styles.priceValue}>
              {item.startingPrice ? `₹${item.startingPrice.toLocaleString('en-IN')}` : 'Contact for Price'}
            </Text>
          </View>

          <View style={styles.actionGroup}>
            {count > 0 && (
              <Text style={styles.variantCountBadge}>{count} models</Text>
            )}
            <View style={styles.viewBtn}>
              <Text style={styles.viewBtnText}>View Models</Text>
              <Ionicons name="chevron-forward" size={16} color="#FFFFFF" />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header
        title={`${brandName} TVs`}
        subtitle="Select a TV Series"
      />
      <BookingStepper currentStep={3} />

      {/* Size Filter Chip Row */}
      {allSizes.length > 0 && (
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Filter by Screen Size:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsScroll}
          >
            <TouchableOpacity
              style={[
                styles.chip,
                selectedSize === null && styles.chipActive,
              ]}
              onPress={() => setSelectedSize(null)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedSize === null && styles.chipTextActive,
                ]}
              >
                All Sizes
              </Text>
            </TouchableOpacity>

            {allSizes.map((sz) => {
              const isActive = selectedSize === sz;
              return (
                <TouchableOpacity
                  key={sz}
                  style={[styles.chip, isActive && styles.chipActive]}
                  onPress={() => setSelectedSize(isActive ? null : sz)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
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
            <Text style={styles.loadingText}>Loading {brandName} series...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredSeries}
            renderItem={renderSeriesCard}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <EmptyState
                icon="tv-outline"
                title="No series found"
                description={`No TV series available for the selected size (${selectedSize}").`}
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
  seriesCard: {
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  titleGroup: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  seriesTitle: {
    fontSize: 18,
    color: colors.text,
    fontWeight: '700',
    marginBottom: 4,
  },
  seriesDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: spacing.md,
  },
  tagBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  tagText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600',
  },
  cardFooter: {
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
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  actionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  variantCountBadge: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  viewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    gap: 2,
  },
  viewBtnText: {
    fontSize: 12,
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
