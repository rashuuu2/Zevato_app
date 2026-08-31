import { Product } from '@/types/service';

export const products: Product[] = [
  // Air Conditioners
  { id: 'p-ac-lg', name: 'LG Dual Inverter Split AC (1.5 Ton)', categoryId: 'ac', brandId: 'lg', image: 'snow-outline', startingPrice: 599 },
  { id: 'p-ac-samsung', name: 'Samsung WindFree Split AC', categoryId: 'ac', brandId: 'samsung', image: 'snow-outline', startingPrice: 579 },
  { id: 'p-ac-voltas', name: 'Voltas Adjustable Inverter Window AC', categoryId: 'ac', brandId: 'voltas', image: 'snow-outline', startingPrice: 499 },
  { id: 'p-ac-daikin', name: 'Daikin 3 Star Inverter Split AC', categoryId: 'ac', brandId: 'daikin', image: 'snow-outline', startingPrice: 649 },

  // Washing Machines
  { id: 'p-wm-lg', name: 'LG 8kg AI Direct Drive Front Load', categoryId: 'washing-machine', brandId: 'lg', image: 'aperture-outline', startingPrice: 649 },
  { id: 'p-wm-samsung', name: 'Samsung EcoBubble Top Load Washer', categoryId: 'washing-machine', brandId: 'samsung', image: 'aperture-outline', startingPrice: 499 },
  { id: 'p-wm-ifb', name: 'IFB Senator Aqua VX 8kg Front Load', categoryId: 'washing-machine', brandId: 'ifb', image: 'aperture-outline', startingPrice: 699 },
  { id: 'p-wm-whirlpool', name: 'Whirlpool Stainwash Pro 7.5kg Top Load', categoryId: 'washing-machine', brandId: 'whirlpool', image: 'aperture-outline', startingPrice: 459 },

  // Refrigerators
  { id: 'p-ref-lg', name: 'LG Smart Inverter Frost Free Double Door', categoryId: 'refrigerator', brandId: 'lg', image: 'cube-outline', startingPrice: 749 },
  { id: 'p-ref-samsung', name: 'Samsung Convertible 5in1 Double Door', categoryId: 'refrigerator', brandId: 'samsung', image: 'cube-outline', startingPrice: 799 },
  { id: 'p-ref-whirlpool', name: 'Whirlpool Protton 3-Door Refrigerator', categoryId: 'refrigerator', brandId: 'whirlpool', image: 'cube-outline', startingPrice: 699 },

  // TVs & Audio
  { id: 'p-tv-sony', name: 'Sony Bravia 55" 4K Ultra HD Smart LED TV', categoryId: 'tv', brandId: 'sony', image: 'tv-outline', startingPrice: 499 },
  { id: 'p-tv-lg', name: 'LG 43" 4K Smart WebOS TV', categoryId: 'tv', brandId: 'lg', image: 'tv-outline', startingPrice: 399 },
  { id: 'p-tv-samsung', name: 'Samsung Crystal 4K Neo Series Smart TV', categoryId: 'tv', brandId: 'samsung', image: 'tv-outline', startingPrice: 429 },

  // Water Purifiers
  { id: 'p-wp-kent', name: 'Kent Grand Plus RO + UV + UF Water Purifier', categoryId: 'water-purifier', brandId: 'kent', image: 'water-outline', startingPrice: 349 },

  // Electrical
  { id: 'p-elec-gen', name: 'Home Electrical Wiring & Switchboard Inspection', categoryId: 'electrical', brandId: 'lg', image: 'flash-outline', startingPrice: 299 },
];

export default products;
