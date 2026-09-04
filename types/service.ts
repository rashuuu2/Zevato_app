export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  description?: string;
  itemCount?: number;
  popular?: boolean;
  parentId?: string | null;
  children?: ServiceCategory[];
}

export interface Brand {
  id: string;
  name: string;
  logo?: string | null;
  categories?: string[];
}

export interface ProductVariant {
  id: string;
  productId: string;
  modelNumber: string;
  sizeLabel: string;
  sizeValue?: number | null;
  price: number;
  originalPrice?: number | null;
  releaseYear?: number | null;
  specsJson?: string | null;
  specs?: Record<string, any>;
  image?: string | null;
  inStock?: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug?: string | null;
  categoryId: string;
  brandId?: string;
  image?: string | null;
  description?: string | null;
  startingPrice?: number | null;
  featuresJson?: string | null;
  features?: string[];
  availableSizes?: number[];
  variantCount?: number;
  variants?: ProductVariant[];
}

export interface ServiceFeature {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

export interface ServiceOption {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  durationMinutes: number;
  rating?: number;
  reviewCount?: number;
  features: string[];
}

export interface ServiceDetail {
  id: string;
  categoryId: string;
  title: string;
  subtitle: string;
  image: string;
  rating: number;
  reviewCount: number;
  options: ServiceOption[];
  features: ServiceFeature[];
  faq?: { question: string; answer: string }[];
}
