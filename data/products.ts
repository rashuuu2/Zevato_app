import { Product } from '@/types/service';

export const products: Product[] = [
  { id: 'p1', name: 'Split Air Conditioner (1.5 Ton)', categoryId: 'ac', brandId: 'lg', image: 'snow', startingPrice: 599 },
  { id: 'p2', name: 'Window Air Conditioner', categoryId: 'ac', brandId: 'voltas', image: 'snow', startingPrice: 499 },
  { id: 'p3', name: 'Front Load Washing Machine', categoryId: 'washing-machine', brandId: 'ifb', image: 'aperture', startingPrice: 699 },
  { id: 'p4', name: 'Top Load Washing Machine', categoryId: 'washing-machine', brandId: 'samsung', image: 'aperture', startingPrice: 499 },
  { id: 'p5', name: 'Double Door Refrigerator', categoryId: 'refrigerator', brandId: 'whirlpool', image: 'cube', startingPrice: 799 },
  { id: 'p6', name: 'Smart OLED / LED TV', categoryId: 'tv', brandId: 'sony', image: 'tv', startingPrice: 399 },
  { id: 'p7', name: 'RO Water Purifier', categoryId: 'water-purifier', brandId: 'kent', image: 'water', startingPrice: 349 },
];

export default products;
