export interface SubServiceItem {
  id: string;
  label: string;
  icon: string; // icon glyph name
  iconFamily?: 'ionicons' | 'material';
}

export interface MasterCategory {
  id: string;
  label: string;
  icon: string;
  iconFamily?: 'ionicons' | 'material';
  bannerTitle: string;
  bannerDescription: string;
  bannerImage?: any;
  subServices: SubServiceItem[];
}

export const masterCategories: MasterCategory[] = [
  {
    id: 'electronics-appliances',
    label: 'Electronics & Appliances',
    icon: 'tv-outline',
    iconFamily: 'ionicons',
    bannerTitle: 'Electronics & Appliances',
    bannerDescription: 'Repair, install and maintain all your electronic items with ease.',
    bannerImage: require('@/assets/images/electronics-hero.jpg'),
    subServices: [
      { id: 'tv-video-audio', label: 'TV Video & Audio', icon: 'tv-outline', iconFamily: 'ionicons' },
      { id: 'kitchen-appliances', label: 'Kitchen & Other Appliances', icon: 'restaurant-outline', iconFamily: 'ionicons' },
      { id: 'computers-laptops', label: 'Computers & Laptops', icon: 'laptop-outline', iconFamily: 'ionicons' },
      { id: 'cameras-lenses', label: 'Cameras & Lenses', icon: 'camera-outline', iconFamily: 'ionicons' },
      { id: 'games-entertainment', label: 'Games & Entertainment', icon: 'game-controller-outline', iconFamily: 'ionicons' },
      { id: 'refrigerators', label: 'Refrigerators', icon: 'cube-outline', iconFamily: 'ionicons' },
      { id: 'computer-accessories', label: 'Computer Accessories', icon: 'headset-outline', iconFamily: 'ionicons' },
      { id: 'printers-scanners', label: 'Printers & Scanners', icon: 'print-outline', iconFamily: 'ionicons' },
      { id: 'acs', label: 'ACs', icon: 'air-conditioner', iconFamily: 'material' },
      { id: 'hard-disks-storage', label: 'Hard Disks & Storage', icon: 'server-outline', iconFamily: 'ionicons' },
      { id: 'washing-machines', label: 'Washing Machines', icon: 'washing-machine', iconFamily: 'material' },
      { id: 'view-all', label: 'View All', icon: 'ellipsis-horizontal', iconFamily: 'ionicons' },
    ],
  },
  {
    id: 'car-services',
    label: 'Car Services',
    icon: 'car-outline',
    iconFamily: 'ionicons',
    bannerTitle: 'Car Services',
    bannerDescription: 'Doorstep car wash, AC inspection, battery and repair services.',
    subServices: [
      { id: 'car-wash', label: 'Car Wash & Polish', icon: 'water-outline', iconFamily: 'ionicons' },
      { id: 'car-ac', label: 'Car AC Service', icon: 'air-conditioner', iconFamily: 'material' },
      { id: 'car-battery', label: 'Battery Check', icon: 'battery-charging-outline', iconFamily: 'ionicons' },
      { id: 'car-view-all', label: 'View All', icon: 'ellipsis-horizontal', iconFamily: 'ionicons' },
    ],
  },
  {
    id: 'plumbing',
    label: 'Plumbing',
    icon: 'water-outline',
    iconFamily: 'ionicons',
    bannerTitle: 'Plumbing Services',
    bannerDescription: 'Fix leaks, install faucets, unclog drains and water tank service.',
    subServices: [
      { id: 'pipe-leak', label: 'Pipe & Leak Repair', icon: 'water-outline', iconFamily: 'ionicons' },
      { id: 'tap-drain', label: 'Taps & Drains', icon: 'faucet', iconFamily: 'material' },
      { id: 'plumbing-view-all', label: 'View All', icon: 'ellipsis-horizontal', iconFamily: 'ionicons' },
    ],
  },
  {
    id: 'electricals',
    label: 'Electricals',
    icon: 'flash-outline',
    iconFamily: 'ionicons',
    bannerTitle: 'Electrical Services',
    bannerDescription: 'Certified electrician assistance for wiring, fans, and switches.',
    subServices: [
      { id: 'switchboard', label: 'Switches & Sockets', icon: 'flash-outline', iconFamily: 'ionicons' },
      { id: 'fan-light', label: 'Fans & Lights', icon: 'bulb-outline', iconFamily: 'ionicons' },
      { id: 'electrical-view-all', label: 'View All', icon: 'ellipsis-horizontal', iconFamily: 'ionicons' },
    ],
  },
  {
    id: 'cleaning',
    label: 'Cleaning',
    icon: 'sparkles-outline',
    iconFamily: 'ionicons',
    bannerTitle: 'Cleaning & Pest Control',
    bannerDescription: 'Full house deep cleaning, sofa shampooing, and pest disinfection.',
    subServices: [
      { id: 'home-clean', label: 'Deep Cleaning', icon: 'sparkles-outline', iconFamily: 'ionicons' },
      { id: 'sofa-clean', label: 'Sofa & Carpet', icon: 'sofa', iconFamily: 'material' },
      { id: 'cleaning-view-all', label: 'View All', icon: 'ellipsis-horizontal', iconFamily: 'ionicons' },
    ],
  },
  {
    id: 'furniture',
    label: 'Furniture',
    icon: 'bed-outline',
    iconFamily: 'ionicons',
    bannerTitle: 'Furniture & Carpentry',
    bannerDescription: 'Furniture assembly, repairs, polishing, and custom woodwork.',
    subServices: [
      { id: 'bed-table', label: 'Assembly & Setup', icon: 'bed-outline', iconFamily: 'ionicons' },
      { id: 'carpenter', label: 'Repairs & Fitting', icon: 'hammer-outline', iconFamily: 'ionicons' },
      { id: 'furniture-view-all', label: 'View All', icon: 'ellipsis-horizontal', iconFamily: 'ionicons' },
    ],
  },
  {
    id: 'more-services',
    label: 'More Services',
    icon: 'grid-outline',
    iconFamily: 'ionicons',
    bannerTitle: 'More Services',
    bannerDescription: 'Explore painting, smart locks, packers & movers, and more.',
    subServices: [
      { id: 'painting', label: 'Home Painting', icon: 'color-palette-outline', iconFamily: 'ionicons' },
      { id: 'security', label: 'Smart Security', icon: 'shield-checkmark-outline', iconFamily: 'ionicons' },
      { id: 'more-view-all', label: 'View All', icon: 'ellipsis-horizontal', iconFamily: 'ionicons' },
    ],
  },
];

export default masterCategories;
