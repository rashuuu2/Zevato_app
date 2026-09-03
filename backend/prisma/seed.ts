import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Zevota database seed...');

  // 1. Seed Categories
  const categories = [
    // New categories matching the target home screen design
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
    // Legacy categories kept for existing product/service foreign keys
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

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: cat,
      create: cat,
    });
  }
  console.log('✅ Categories seeded');

  // 2. Seed Brands
  const brands = [
    { id: 'lg', name: 'LG', logo: 'hardware-chip-outline' },
    { id: 'samsung', name: 'Samsung', logo: 'phone-portrait-outline' },
    { id: 'whirlpool', name: 'Whirlpool', logo: 'sync-outline' },
    { id: 'voltas', name: 'Voltas', logo: 'snow-outline' },
    { id: 'sony', name: 'Sony', logo: 'tv-outline' },
    { id: 'kent', name: 'Kent', logo: 'water-outline' },
    { id: 'ifb', name: 'IFB', logo: 'grid-outline' },
    { id: 'daikin', name: 'Daikin', logo: 'thermometer-outline' },
  ];

  for (const brand of brands) {
    await prisma.brand.upsert({
      where: { id: brand.id },
      update: brand,
      create: brand,
    });
  }
  console.log('✅ Brands seeded');

  // 3. Seed Products
  const products = [
    { id: 'p-ac-lg', name: 'LG Dual Inverter Split AC (1.5 Ton)', categoryId: 'ac', brandId: 'lg', image: 'snow-outline', startingPrice: 599 },
    { id: 'p-ac-samsung', name: 'Samsung WindFree Split AC', categoryId: 'ac', brandId: 'samsung', image: 'snow-outline', startingPrice: 579 },
    { id: 'p-ac-voltas', name: 'Voltas Adjustable Inverter Window AC', categoryId: 'ac', brandId: 'voltas', image: 'snow-outline', startingPrice: 499 },
    { id: 'p-ac-daikin', name: 'Daikin 3 Star Inverter Split AC', categoryId: 'ac', brandId: 'daikin', image: 'snow-outline', startingPrice: 649 },
    { id: 'p-wm-lg', name: 'LG 8kg AI Direct Drive Front Load', categoryId: 'washing-machine', brandId: 'lg', image: 'aperture-outline', startingPrice: 649 },
    { id: 'p-wm-samsung', name: 'Samsung EcoBubble Top Load Washer', categoryId: 'washing-machine', brandId: 'samsung', image: 'aperture-outline', startingPrice: 499 },
    { id: 'p-wm-ifb', name: 'IFB Senator Aqua VX 8kg Front Load', categoryId: 'washing-machine', brandId: 'ifb', image: 'aperture-outline', startingPrice: 699 },
    { id: 'p-wm-whirlpool', name: 'Whirlpool Stainwash Pro 7.5kg Top Load', categoryId: 'washing-machine', brandId: 'whirlpool', image: 'aperture-outline', startingPrice: 459 },
    { id: 'p-ref-lg', name: 'LG Smart Inverter Frost Free Double Door', categoryId: 'refrigerator', brandId: 'lg', image: 'cube-outline', startingPrice: 749 },
    { id: 'p-ref-samsung', name: 'Samsung Convertible 5in1 Double Door', categoryId: 'refrigerator', brandId: 'samsung', image: 'cube-outline', startingPrice: 799 },
    { id: 'p-ref-whirlpool', name: 'Whirlpool Protton 3-Door Refrigerator', categoryId: 'refrigerator', brandId: 'whirlpool', image: 'cube-outline', startingPrice: 699 },
    { id: 'p-tv-sony', name: 'Sony Bravia 55" 4K Ultra HD Smart LED TV', categoryId: 'tv', brandId: 'sony', image: 'tv-outline', startingPrice: 499 },
    { id: 'p-tv-lg', name: 'LG 43" 4K Smart WebOS TV', categoryId: 'tv', brandId: 'lg', image: 'tv-outline', startingPrice: 399 },
    { id: 'p-tv-samsung', name: 'Samsung Crystal 4K Neo Series Smart TV', categoryId: 'tv', brandId: 'samsung', image: 'tv-outline', startingPrice: 429 },
    { id: 'p-wp-kent', name: 'Kent Grand Plus RO + UV + UF Water Purifier', categoryId: 'water-purifier', brandId: 'kent', image: 'water-outline', startingPrice: 349 },
    { id: 'p-elec-gen', name: 'Home Electrical Wiring & Switchboard Inspection', categoryId: 'electrical', brandId: 'lg', image: 'flash-outline', startingPrice: 299 },
  ];

  for (const prod of products) {
    await prisma.product.upsert({
      where: { id: prod.id },
      update: prod,
      create: prod,
    });
  }
  console.log('✅ Products seeded');

  // 4. Seed Services and Service Options
  const servicesData = [
    {
      id: 'ac-jet-service',
      categoryId: 'ac',
      title: 'AC Power Jet Service & Repair',
      subtitle: 'Deep foam cleaning of indoor & outdoor unit coils with pressure washer',
      image: 'snow-outline',
      rating: 4.85,
      reviewCount: 2340,
      options: [
        {
          id: 'opt-ac-1',
          title: 'Foam & Power Jet Service (1 Unit)',
          description: 'Complete deep cleaning using specialized jet pump and foam solution',
          price: 599,
          originalPrice: 899,
          durationMinutes: 45,
          rating: 4.9,
          reviewCount: 1420,
          featuresJson: JSON.stringify([
            'High pressure jet pump wash',
            'Anti-bacterial foam cleaning',
            'Drain pipe clearing',
            'Gas pressure inspection check',
          ]),
        },
        {
          id: 'opt-ac-2',
          title: 'AC Gas Refill & Service Package',
          description: 'Full gas leak repair, pressure testing & R32/R410 gas charging',
          price: 2499,
          originalPrice: 2999,
          durationMinutes: 90,
          rating: 4.8,
          reviewCount: 920,
          featuresJson: JSON.stringify([
            'Complete refrigerant gas charging',
            'Nitrogen leak detection test',
            'Complimentary jet wash service',
            '30-day post service warranty',
          ]),
        },
      ],
    },
    {
      id: 'wm-deep-clean',
      categoryId: 'washing-machine',
      title: 'Washing Machine Descaling & Repair',
      subtitle: 'Internal drum descaling, filter flushing, and motor spin test',
      image: 'aperture-outline',
      rating: 4.78,
      reviewCount: 1150,
      options: [
        {
          id: 'opt-wm-1',
          title: 'Drum Descaling & Deep Service',
          description: 'Chemical tub wash and lint filter sanitation',
          price: 499,
          originalPrice: 699,
          durationMinutes: 40,
          rating: 4.8,
          reviewCount: 890,
          featuresJson: JSON.stringify([
            'Organic descaling treatment',
            'Vibration & noise inspection',
            'Water inlet valve cleaning',
          ]),
        },
        {
          id: 'opt-wm-2',
          title: 'Full Machine Check & Motor Repair',
          description: 'Comprehensive diagnostic, belt replacement & noise fix',
          price: 899,
          originalPrice: 1199,
          durationMinutes: 60,
          rating: 4.7,
          reviewCount: 260,
          featuresJson: JSON.stringify([
            'Motor gear & belt check',
            'Drain pump unclogging',
            '30-day labor warranty',
          ]),
        },
      ],
    },
    {
      id: 'ref-cooling-service',
      categoryId: 'refrigerator',
      title: 'Refrigerator Maintenance & Cooling Repair',
      subtitle: 'Compressor health check, thermostat calibration & gas top-up',
      image: 'cube-outline',
      rating: 4.82,
      reviewCount: 980,
      options: [
        {
          id: 'opt-ref-1',
          title: 'Standard Refrigerator Diagnostic & Cleaning',
          description: 'Coil vacuuming, drain cleaning, and gasket seal inspection',
          price: 449,
          originalPrice: 599,
          durationMinutes: 45,
          rating: 4.8,
          reviewCount: 540,
          featuresJson: JSON.stringify([
            'Condenser coil cleaning',
            'Thermostat testing',
            'Door seal leak check',
          ]),
        },
        {
          id: 'opt-ref-2',
          title: 'Gas Charging & Cooling Overhaul',
          description: 'Complete gas recharge, filter drier replacement, and leak repair',
          price: 1999,
          originalPrice: 2499,
          durationMinutes: 90,
          rating: 4.9,
          reviewCount: 440,
          featuresJson: JSON.stringify([
            'Refrigerant gas refill',
            'Filter drier replace',
            'Free 30-day warranty',
          ]),
        },
      ],
    },
    {
      id: 'tv-wall-mounting',
      categoryId: 'tv',
      title: 'TV Wall Mounting & Screen Repair',
      subtitle: 'Precision wall mounting, wire concealment & display diagnostics',
      image: 'tv-outline',
      rating: 4.9,
      reviewCount: 1620,
      options: [
        {
          id: 'opt-tv-1',
          title: 'Wall Mount Installation (Up to 55")',
          description: 'Heavy-duty wall bracket mounting with cable alignment',
          price: 399,
          originalPrice: 599,
          durationMinutes: 30,
          rating: 4.9,
          reviewCount: 1200,
          featuresJson: JSON.stringify([
            'Precision level alignment',
            'Bracket fixture installation',
            'HDMI & AV cable setup',
          ]),
        },
        {
          id: 'opt-tv-2',
          title: 'Display Panel Repair Diagnostic',
          description: 'Backlight issue check, motherboard fix, and audio troubleshooting',
          price: 599,
          originalPrice: 799,
          durationMinutes: 60,
          rating: 4.8,
          reviewCount: 420,
          featuresJson: JSON.stringify([
            'Component level diagnosis',
            'Sound & display tune-up',
            'Upfront repair estimate',
          ]),
        },
      ],
    },
    {
      id: 'wp-ro-service',
      categoryId: 'water-purifier',
      title: 'Water Purifier RO Filter Service',
      subtitle: 'Sediment & carbon filter replacement, RO membrane flushing & TDS check',
      image: 'water-outline',
      rating: 4.88,
      reviewCount: 1430,
      options: [
        {
          id: 'opt-wp-1',
          title: 'Standard RO Filter Maintenance',
          description: 'Sediment & pre-carbon filter replacement with TDS level tuning',
          price: 349,
          originalPrice: 499,
          durationMinutes: 35,
          rating: 4.9,
          reviewCount: 950,
          featuresJson: JSON.stringify([
            'Pre-filter candle replacement',
            'TDS water quality test',
            'Leak proof tube check',
          ]),
        },
        {
          id: 'opt-wp-2',
          title: 'Complete RO Membrane & Filter Overhaul',
          description: 'All 4 filters + RO membrane replacement with UV lamp check',
          price: 1899,
          originalPrice: 2299,
          durationMinutes: 60,
          rating: 4.8,
          reviewCount: 480,
          featuresJson: JSON.stringify([
            'Genuine RO membrane unit',
            'Complete filter kit swap',
            'UV chamber sterilization',
          ]),
        },
      ],
    },
    {
      id: 'elec-general-repair',
      categoryId: 'electrical',
      title: 'Home Electrical Repair & Installation',
      subtitle: 'Switchboard installation, wiring inspection & appliance setup',
      image: 'flash-outline',
      rating: 4.75,
      reviewCount: 820,
      options: [
        {
          id: 'opt-elec-1',
          title: 'Switchboard & Socket Repair',
          description: 'Fix blown fuses, faulty switches & short circuit troubleshooting',
          price: 299,
          originalPrice: 399,
          durationMinutes: 30,
          rating: 4.8,
          reviewCount: 520,
          featuresJson: JSON.stringify([
            'Short circuit detection',
            'Switchboard replacement',
            'Safety ground check',
          ]),
        },
      ],
    },
  ];

  for (const svc of servicesData) {
    const { options, ...serviceData } = svc;
    await prisma.service.upsert({
      where: { id: serviceData.id },
      update: serviceData,
      create: serviceData,
    });

    for (const opt of options) {
      await prisma.serviceOption.upsert({
        where: { id: opt.id },
        update: { ...opt, serviceId: serviceData.id },
        create: { ...opt, serviceId: serviceData.id },
      });
    }
  }
  console.log('✅ Services & Service Options seeded');

  // 5. Seed Technicians
  const technicians = [
    {
      id: 'tech-101',
      name: 'Ramesh Kumar',
      phone: '+91 98765 43210',
      rating: 4.9,
      completedJobs: 428,
      avatarUrl: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150',
      availability: 'available',
      currentLat: 12.9141,
      currentLng: 77.6411,
    },
    {
      id: 'tech-102',
      name: 'Suresh Rao',
      phone: '+91 98765 43211',
      rating: 4.8,
      completedJobs: 312,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      availability: 'available',
      currentLat: 12.925,
      currentLng: 77.65,
    },
  ];

  for (const tech of technicians) {
    await prisma.technician.upsert({
      where: { id: tech.id },
      update: tech,
      create: tech,
    });
  }
  console.log('✅ Technicians seeded');

  console.log('🎉 Seed process completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed script error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
