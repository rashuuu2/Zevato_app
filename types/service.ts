export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  itemCount?: number;
  popular?: boolean;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  categories: string[];
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  brandId?: string;
  image: string;
  startingPrice: number;
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
