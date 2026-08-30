import { Brand } from '@/types/service';

export const brands: Brand[] = [
  { id: 'lg', name: 'LG', logo: 'hardware-chip-outline', categories: ['ac', 'washing-machine', 'refrigerator', 'tv'] },
  { id: 'samsung', name: 'Samsung', logo: 'phone-portrait-outline', categories: ['ac', 'washing-machine', 'refrigerator', 'tv'] },
  { id: 'whirlpool', name: 'Whirlpool', logo: 'sync-outline', categories: ['washing-machine', 'refrigerator'] },
  { id: 'voltas', name: 'Voltas', logo: 'snow-outline', categories: ['ac'] },
  { id: 'sony', name: 'Sony', logo: 'tv-outline', categories: ['tv'] },
  { id: 'kent', name: 'Kent', logo: 'water-outline', categories: ['water-purifier'] },
  { id: 'ifb', name: 'IFB', logo: 'grid-outline', categories: ['washing-machine'] },
  { id: 'daikin', name: 'Daikin', logo: 'thermometer-outline', categories: ['ac'] },
];

export default brands;
