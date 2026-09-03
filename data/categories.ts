import { ServiceCategory } from '@/types/service';

export const categories: ServiceCategory[] = [
  {
    id: 'electronics',
    name: 'Electronics',
    icon: 'tv-outline',
    description: 'TV, laptop, computer & display repair and servicing',
    itemCount: 12,
    popular: true,
  },
  {
    id: 'appliances',
    name: 'Appliances',
    icon: 'home-outline',
    description: 'AC, washing machine, refrigerator & kitchen appliance repair',
    itemCount: 18,
    popular: true,
  },
  {
    id: 'plumbing',
    name: 'Plumbing',
    icon: 'water-outline',
    description: 'Pipe fitting, leak repair, tap & drain fixing',
    itemCount: 10,
    popular: true,
  },
  {
    id: 'electricals',
    name: 'Electricals',
    icon: 'flash-outline',
    description: 'Wiring, switchboards, fan & light installation',
    itemCount: 15,
    popular: true,
  },
  {
    id: 'car-services',
    name: 'Car Services',
    icon: 'car-outline',
    description: 'Car wash, detailing, AC service & general maintenance',
    itemCount: 8,
    popular: false,
  },
  {
    id: 'cleaning',
    name: 'Cleaning',
    icon: 'sparkles-outline',
    description: 'Deep cleaning, sofa cleaning, pest control & sanitization',
    itemCount: 14,
    popular: true,
  },
  {
    id: 'furniture',
    name: 'Furniture',
    icon: 'bed-outline',
    description: 'Assembly, repair, polishing & carpentry work',
    itemCount: 9,
    popular: false,
  },
  {
    id: 'more',
    name: 'More',
    icon: 'grid-outline',
    description: 'Browse all available service categories',
    itemCount: 0,
    popular: false,
  },
];

export default categories;
