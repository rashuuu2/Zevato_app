import { ServiceCategory } from '@/types/service';

export const categories: ServiceCategory[] = [
  {
    id: 'ac',
    name: 'Air Conditioner',
    icon: 'snow-outline',
    description: 'Jet service, repair, gas refill & installation',
    itemCount: 14,
    popular: true,
  },
  {
    id: 'washing-machine',
    name: 'Washing Machine',
    icon: 'aperture-outline',
    description: 'Drum cleaning, repair, motor & drainage fixes',
    itemCount: 10,
    popular: true,
  },
  {
    id: 'refrigerator',
    name: 'Refrigerator',
    icon: 'cube-outline',
    description: 'Cooling check, gas charging & compressor repair',
    itemCount: 8,
    popular: true,
  },
  {
    id: 'tv',
    name: 'Television & Audio',
    icon: 'tv-outline',
    description: 'Wall mounting, panel repair & display troubleshooting',
    itemCount: 12,
    popular: false,
  },
  {
    id: 'water-purifier',
    name: 'Water Purifier',
    icon: 'water-outline',
    description: 'Filter replacement, RO service & leak repair',
    itemCount: 6,
    popular: true,
  },
  {
    id: 'electrical',
    name: 'Electrical Services',
    icon: 'flash-outline',
    description: 'Wiring, switchboards, fan & light installation',
    itemCount: 18,
    popular: false,
  },
];

export default categories;
