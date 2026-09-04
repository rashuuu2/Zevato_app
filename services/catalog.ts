import { apiRequest } from './api';
import { ServiceCategory, Brand, Product, ProductVariant } from '@/types/service';
import { categories as fallbackCategories, subCategories as fallbackSubCategories } from '@/data/categories';
import { fallbackTvBrands, fallbackSeries, fallbackVariants } from '@/data/catalogFallback';

/**
 * Fetch top-level categories for the sidebar (parentId IS NULL)
 */
export async function fetchTopLevelCategories(): Promise<ServiceCategory[]> {
  try {
    const data = await apiRequest<ServiceCategory[]>('/categories?parentId=null');
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
  } catch (err) {
    console.warn('fetchTopLevelCategories failed, using fallback categories:', err);
  }
  return fallbackCategories;
}

/**
 * Fetch sub-categories for a given parent category
 */
export async function fetchSubcategories(parentId: string): Promise<ServiceCategory[]> {
  try {
    const data = await apiRequest<ServiceCategory[]>(`/categories/${parentId}/subcategories`);
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
  } catch (err) {
    console.warn(`fetchSubcategories for ${parentId} failed, using fallback:`, err);
  }
  return fallbackSubCategories.filter((c) => c.parentId === parentId);
}

/**
 * Fetch brands available for a given sub-category (e.g. tv-video-audio)
 */
export async function fetchBrandsForCategory(categoryId: string): Promise<Brand[]> {
  try {
    const data = await apiRequest<Brand[]>(`/brands?categoryId=${categoryId}`);
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
  } catch (err) {
    console.warn(`fetchBrandsForCategory for ${categoryId} failed:`, err);
  }
  if (categoryId === 'tv-video-audio') {
    return fallbackTvBrands;
  }
  return [];
}

/**
 * Fetch series (Product records) for a given category & brand
 */
export async function fetchSeriesForCategoryBrand(
  categoryId: string,
  brandId: string
): Promise<Product[]> {
  try {
    const data = await apiRequest<Product[]>(
      `/categories/${categoryId}/products?brandId=${brandId}`
    );
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
  } catch (err) {
    console.warn(`fetchSeriesForCategoryBrand (${categoryId}, ${brandId}) failed:`, err);
  }

  // Fallback to verified series
  const filtered = fallbackSeries.filter((s) => {
    return s.categoryId === categoryId && s.brandId === brandId;
  });
  return filtered.length > 0 ? filtered : [];
}

/**
 * Fetch product variants for a series, optionally filtered by size
 */
export async function fetchVariantsForSeries(
  seriesId: string,
  sizeValue?: number | null
): Promise<ProductVariant[]> {
  try {
    const query = sizeValue ? `?size=${sizeValue}` : '';
    const data = await apiRequest<ProductVariant[]>(`/products/${seriesId}/variants${query}`);
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
  } catch (err) {
    console.warn(`fetchVariantsForSeries for ${seriesId} failed:`, err);
  }

  const list = fallbackVariants[seriesId] || [];
  if (sizeValue) {
    return list.filter((v) => v.sizeValue === sizeValue);
  }
  return list;
}
