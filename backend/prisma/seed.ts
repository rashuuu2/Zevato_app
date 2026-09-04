import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Zevota database seed with real catalog hierarchy...');

  // Load seed-data.json
  const seedDataPath = path.join(__dirname, 'seed-data.json');
  const seedData = JSON.parse(fs.readFileSync(seedDataPath, 'utf8'));

  // 1. Seed Categories: top-level first (parentId: null), then sub-categories
  console.log('📦 Seeding Categories...');
  const topLevelCategories = seedData.categories.filter((c: any) => !c.parentId);
  const subCategories = seedData.categories.filter((c: any) => !!c.parentId);

  for (const cat of topLevelCategories) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: {
        name: cat.name,
        icon: cat.icon || null,
        description: cat.description || null,
        popular: !!cat.popular,
        parentId: null,
      },
      create: {
        id: cat.id,
        name: cat.name,
        icon: cat.icon || null,
        description: cat.description || null,
        popular: !!cat.popular,
        parentId: null,
      },
    });
  }

  for (const cat of subCategories) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: {
        name: cat.name,
        icon: cat.icon || null,
        description: cat.description || null,
        popular: !!cat.popular,
        parentId: cat.parentId,
      },
      create: {
        id: cat.id,
        name: cat.name,
        icon: cat.icon || null,
        description: cat.description || null,
        popular: !!cat.popular,
        parentId: cat.parentId,
      },
    });
  }
  console.log(`✅ Seeded ${seedData.categories.length} categories (${topLevelCategories.length} top-level, ${subCategories.length} sub-categories)`);

  // 2. Seed Brands: 12 verified TV brands
  console.log('🏷️  Seeding TV Brands...');
  const tvBrands = seedData.brands.tv || [];
  for (const b of tvBrands) {
    await prisma.brand.upsert({
      where: { id: b.id },
      update: {
        name: b.name,
        logo: b.logo || null,
      },
      create: {
        id: b.id,
        name: b.name,
        logo: b.logo || null,
      },
    });
  }
  console.log(`✅ Seeded ${tvBrands.length} verified TV brands`);

  // 3. Seed Samsung TV Catalog (Series / Product + Variants)
  console.log('📺 Seeding Samsung TV Catalog...');
  const samsungSeries = seedData.tv_catalog_verified?.samsung || [];
  for (const series of samsungSeries) {
    const startingPrice = Array.isArray(series.variants) && series.variants.length > 0
      ? Math.min(...series.variants.map((v: any) => v.price))
      : 0;

    const product = await prisma.product.upsert({
      where: { id: series.series_id },
      update: {
        name: series.name,
        slug: series.series_id,
        description: series.description || null,
        startingPrice,
        featuresJson: JSON.stringify(series.featuresJson || []),
        categoryId: 'tv-video-audio',
        brandId: 'samsung',
      },
      create: {
        id: series.series_id,
        name: series.name,
        slug: series.series_id,
        description: series.description || null,
        startingPrice,
        featuresJson: JSON.stringify(series.featuresJson || []),
        categoryId: 'tv-video-audio',
        brandId: 'samsung',
      },
    });

    if (Array.isArray(series.variants)) {
      for (const v of series.variants) {
        const variantId = `${series.series_id}-${v.modelNumber}-${v.sizeValue || 'std'}`;
        await prisma.productVariant.upsert({
          where: { id: variantId },
          update: {
            productId: product.id,
            modelNumber: v.modelNumber,
            sizeLabel: v.sizeLabel,
            sizeValue: v.sizeValue ?? null,
            price: v.price,
            originalPrice: v.originalPrice ?? null,
            releaseYear: v.releaseYear ?? null,
            specsJson: JSON.stringify(v.specsJson || {}),
            image: v.image ?? null,
            inStock: v.inStock !== false,
          },
          create: {
            id: variantId,
            productId: product.id,
            modelNumber: v.modelNumber,
            sizeLabel: v.sizeLabel,
            sizeValue: v.sizeValue ?? null,
            price: v.price,
            originalPrice: v.originalPrice ?? null,
            releaseYear: v.releaseYear ?? null,
            specsJson: JSON.stringify(v.specsJson || {}),
            image: v.image ?? null,
            inStock: v.inStock !== false,
          },
        });
      }
    }
  }
  console.log(`✅ Seeded ${samsungSeries.length} Samsung series with all product variants`);

  // 4. Seed Other Brands Sample (LG and Sony sample series)
  console.log('📺 Seeding Sample Series for LG and Sony...');
  const otherSamples = seedData.tv_catalog_verified?.other_brands_sample || {};
  for (const [brandId, seriesList] of Object.entries(otherSamples)) {
    if (Array.isArray(seriesList)) {
      for (const series of seriesList as any[]) {
        const startingPrice = Array.isArray(series.variants) && series.variants.length > 0
          ? Math.min(...series.variants.map((v: any) => v.price))
          : 0;

        const product = await prisma.product.upsert({
          where: { id: series.series_id },
          update: {
            name: series.name,
            slug: series.series_id,
            description: series.description || null,
            startingPrice,
            featuresJson: JSON.stringify(series.featuresJson || []),
            categoryId: 'tv-video-audio',
            brandId,
          },
          create: {
            id: series.series_id,
            name: series.name,
            slug: series.series_id,
            description: series.description || null,
            startingPrice,
            featuresJson: JSON.stringify(series.featuresJson || []),
            categoryId: 'tv-video-audio',
            brandId,
          },
        });

        if (Array.isArray(series.variants)) {
          for (const v of series.variants) {
            const variantId = `${series.series_id}-${v.modelNumber}-${v.sizeValue || 'std'}`;
            await prisma.productVariant.upsert({
              where: { id: variantId },
              update: {
                productId: product.id,
                modelNumber: v.modelNumber,
                sizeLabel: v.sizeLabel,
                sizeValue: v.sizeValue ?? null,
                price: v.price,
                originalPrice: v.originalPrice ?? null,
                releaseYear: v.releaseYear ?? null,
                specsJson: JSON.stringify(v.specsJson || {}),
                image: v.image ?? null,
                inStock: v.inStock !== false,
              },
              create: {
                id: variantId,
                productId: product.id,
                modelNumber: v.modelNumber,
                sizeLabel: v.sizeLabel,
                sizeValue: v.sizeValue ?? null,
                price: v.price,
                originalPrice: v.originalPrice ?? null,
                releaseYear: v.releaseYear ?? null,
                specsJson: JSON.stringify(v.specsJson || {}),
                image: v.image ?? null,
                inStock: v.inStock !== false,
              },
            });
          }
        }
      }
    }
  }
  console.log('✅ Seeded sample series for LG & Sony');

  // 5. Seed Services and Service Options (mapped to new sub-categories)
  console.log('🛠️  Seeding Services & Options...');
  const servicesData = [
    {
      id: 'tv-wall-mounting',
      categoryId: 'tv-video-audio',
      title: 'TV Wall Mounting & Installation',
      subtitle: 'Precision wall mounting, wire concealment & display setup',
      image: 'tv-outline',
      rating: 4.9,
      reviewCount: 1620,
      options: [
        {
          id: 'opt-tv-1',
          title: 'Standard Wall Mount Installation (Up to 55")',
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
          title: 'Premium Large Screen Mount (65" & Above)',
          description: 'Reinforced dual-arm swivel mounting with concealed wiring',
          price: 699,
          originalPrice: 999,
          durationMinutes: 45,
          rating: 4.95,
          reviewCount: 420,
          featuresJson: JSON.stringify([
            'Swivel bracket installation',
            'Concealed conduit wiring',
            'Display angle calibration',
          ]),
        },
      ],
    },
    {
      id: 'ac-deep-cleaning',
      categoryId: 'acs',
      title: 'AC Power Jet Deep Cleaning Service',
      subtitle: 'High-pressure foam wash, cooling coil sanitization & filter cleanup',
      image: 'snow-outline',
      rating: 4.92,
      reviewCount: 2350,
      options: [
        {
          id: 'opt-ac-1',
          title: 'Power Jet Foam Wash (1 Split AC)',
          description: 'Indoor & outdoor unit deep jet spray wash with antibacterial foam',
          price: 599,
          originalPrice: 799,
          durationMinutes: 45,
          rating: 4.9,
          reviewCount: 1800,
          featuresJson: JSON.stringify([
            'High-pressure power jet wash',
            'Indoor cooling coil foam clean',
            'Outdoor condenser cleaning',
            'Drain tray & pipe flush',
          ]),
        },
      ],
    },
    {
      id: 'wm-drum-service',
      categoryId: 'washing-machines',
      title: 'Washing Machine Descaling & Service',
      subtitle: 'Drum deep clean, descaling, motor check & drainage line clearing',
      image: 'washing-machine',
      rating: 4.85,
      reviewCount: 1890,
      options: [
        {
          id: 'opt-wm-1',
          title: 'Complete Tub Descaling & Health Check',
          description: 'Removal of calcium deposits, lint filter cleaning & motor check',
          price: 499,
          originalPrice: 699,
          durationMinutes: 40,
          rating: 4.85,
          reviewCount: 1250,
          featuresJson: JSON.stringify([
            'Heavy-duty drum descaling',
            'Lint filter deep clean',
            'Water inlet filter flush',
            'Drain pump inspection',
          ]),
        },
      ],
    },
    {
      id: 'ref-cooling-repair',
      categoryId: 'refrigerators',
      title: 'Refrigerator Cooling & Gas Service',
      subtitle: 'Comprehensive cooling diagnostics, thermostat calibration & gas charging',
      image: 'cube-outline',
      rating: 4.8,
      reviewCount: 940,
      options: [
        {
          id: 'opt-ref-1',
          title: 'Cooling Diagnostic & Inspection',
          description: 'Compressor check, thermostat test, coil inspection & gas pressure check',
          price: 299,
          originalPrice: 449,
          durationMinutes: 30,
          rating: 4.8,
          reviewCount: 500,
          featuresJson: JSON.stringify([
            'Compressor health inspection',
            'Cooling coil check',
            'Thermostat accuracy test',
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
  console.log('✅ Seeded Services and Options');

  // 6. Seed Technicians
  console.log('👷 Seeding Technicians...');
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
  console.log('✅ Seeded Technicians');

  // 7. Seed Demo User & Sample Booking
  console.log('👤 Seeding Demo User & Booking...');
  const demoUser = await prisma.user.upsert({
    where: { clerkUserId: 'user_dev_demo_1' },
    update: {
      name: 'Rashi Singh',
      email: 'rashi@zevato.app',
      phone: '+91 98765 43210',
      profileCompleted: true,
    },
    create: {
      id: 'usr-demo-1',
      clerkUserId: 'user_dev_demo_1',
      name: 'Rashi Singh',
      email: 'rashi@zevato.app',
      phone: '+91 98765 43210',
      profileCompleted: true,
    },
  });

  const demoAddress = await prisma.address.upsert({
    where: { id: 'addr-demo-1' },
    update: {
      userId: demoUser.id,
      title: 'Home',
      type: 'home',
      street: 'Flat 402, Sunshine Apartments, 12th Main',
      city: 'Bengaluru',
      state: 'Karnataka',
      zipCode: '560034',
      isDefault: true,
    },
    create: {
      id: 'addr-demo-1',
      userId: demoUser.id,
      title: 'Home',
      type: 'home',
      street: 'Flat 402, Sunshine Apartments, 12th Main',
      city: 'Bengaluru',
      state: 'Karnataka',
      zipCode: '560034',
      isDefault: true,
    },
  });

  await prisma.booking.upsert({
    where: { bookingNumber: 'BK-2026-001' },
    update: {
      userId: demoUser.id,
      serviceId: 'tv-wall-mounting',
      serviceOptionId: 'opt-tv-1',
      categoryId: 'tv-video-audio',
      brandId: 'samsung',
      productId: 'samsung-neo-qled-4k',
      productVariantId: 'samsung-neo-qled-4k-QN90F-55',
      addressId: demoAddress.id,
      technicianId: 'tech-101',
      scheduledDate: 'Tomorrow',
      scheduledTimeSlot: '10:00 AM - 12:00 PM',
      bookingStatus: 'technician_assigned',
      paymentStatus: 'payment_paid',
      paymentMethodType: 'upi',
      paymentMethodTitle: 'Google Pay (UPI)',
      subtotal: 399,
      discount: 0,
      tax: 71.82,
      total: 470.82,
    },
    create: {
      id: 'bk-demo-1',
      bookingNumber: 'BK-2026-001',
      userId: demoUser.id,
      serviceId: 'tv-wall-mounting',
      serviceOptionId: 'opt-tv-1',
      categoryId: 'tv-video-audio',
      brandId: 'samsung',
      productId: 'samsung-neo-qled-4k',
      productVariantId: 'samsung-neo-qled-4k-QN90F-55',
      addressId: demoAddress.id,
      technicianId: 'tech-101',
      scheduledDate: 'Tomorrow',
      scheduledTimeSlot: '10:00 AM - 12:00 PM',
      bookingStatus: 'technician_assigned',
      paymentStatus: 'payment_paid',
      paymentMethodType: 'upi',
      paymentMethodTitle: 'Google Pay (UPI)',
      subtotal: 399,
      discount: 0,
      tax: 71.82,
      total: 470.82,
    },
  });
  console.log('✅ Seeded Demo User and Booking');

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed script error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
