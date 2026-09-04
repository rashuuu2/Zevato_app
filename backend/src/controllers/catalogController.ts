import { Request, Response } from 'express';
import prisma from '../db';

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const { parentId } = req.query;
    const where: any = {};

    // Treat missing, empty, or string "null" as top-level categories (parentId IS NULL)
    if (parentId === undefined || parentId === 'null' || parentId === null || parentId === '') {
      where.parentId = null;
    } else if (parentId === 'all') {
      // Return all categories without hierarchy filtering
    } else {
      where.parentId = String(parentId);
    }

    const categories = await prisma.category.findMany({
      where,
      include: {
        children: true,
      },
      orderBy: { name: 'asc' },
    });

    res.json(categories);
  } catch (error) {
    console.error('getCategories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

export const getSubcategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const subcategories = await prisma.category.findMany({
      where: { parentId: id },
      orderBy: { name: 'asc' },
    });
    res.json(subcategories);
  } catch (error) {
    console.error('getSubcategories error:', error);
    res.status(500).json({ error: 'Failed to fetch subcategories' });
  }
};

export const getBrands = async (req: Request, res: Response): Promise<void> => {
  try {
    const { categoryId } = req.query;
    let brands;

    if (categoryId === 'tv-video-audio') {
      // For TV category, return all 12 verified TV brands from the catalog
      const tvBrandIds = [
        'samsung', 'lg', 'sony', 'xiaomi', 'tcl', 'vu',
        'panasonic', 'haier', 'hisense', 'onida', 'philips', 'bpl'
      ];
      brands = await prisma.brand.findMany({
        where: { id: { in: tvBrandIds } },
        orderBy: { name: 'asc' },
      });
    } else if (categoryId && typeof categoryId === 'string') {
      // Find products matching categoryId and get unique brands
      const products = await prisma.product.findMany({
        where: { categoryId },
        select: { brandId: true },
      });
      const brandIds = Array.from(new Set(products.map((p) => p.brandId)));

      if (brandIds.length > 0) {
        brands = await prisma.brand.findMany({
          where: { id: { in: brandIds } },
          orderBy: { name: 'asc' },
        });
      } else {
        brands = await prisma.brand.findMany({
          orderBy: { name: 'asc' },
        });
      }
    } else {
      brands = await prisma.brand.findMany({
        orderBy: { name: 'asc' },
      });
    }

    res.json(brands);
  } catch (error) {
    console.error('getBrands error:', error);
    res.status(500).json({ error: 'Failed to fetch brands' });
  }
};

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    // Support categoryId from either route param /categories/:id/products or query ?categoryId=
    const categoryId = req.params.id || req.query.categoryId;
    const { brandId } = req.query;

    const where: any = {};
    if (categoryId && typeof categoryId === 'string') where.categoryId = categoryId;
    if (brandId && typeof brandId === 'string') where.brandId = brandId;

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        brand: true,
        variants: {
          orderBy: { sizeValue: 'asc' },
        },
      },
      orderBy: { name: 'asc' },
    });

    const formatted = products.map((p) => {
      let features: string[] = [];
      try {
        features = JSON.parse(p.featuresJson || '[]');
      } catch {
        features = [];
      }

      const sizeValues = Array.from(
        new Set(p.variants.map((v) => v.sizeValue).filter((v): v is number => typeof v === 'number'))
      ).sort((a, b) => a - b);

      const lowestPrice =
        p.variants.length > 0
          ? Math.min(...p.variants.map((v) => v.price))
          : p.startingPrice;

      return {
        ...p,
        startingPrice: lowestPrice,
        features,
        availableSizes: sizeValues,
        variantCount: p.variants.length,
      };
    });

    res.json(formatted);
  } catch (error) {
    console.error('getProducts error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
        variants: {
          orderBy: { sizeValue: 'asc' },
        },
      },
    });

    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    let features: string[] = [];
    try {
      features = JSON.parse(product.featuresJson || '[]');
    } catch {
      features = [];
    }

    const sizeValues = Array.from(
      new Set(product.variants.map((v) => v.sizeValue).filter((v): v is number => typeof v === 'number'))
    ).sort((a, b) => a - b);

    res.json({
      ...product,
      features,
      availableSizes: sizeValues,
      variantCount: product.variants.length,
    });
  } catch (error) {
    console.error('getProductById error:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

export const getProductVariants = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { size } = req.query;

    const where: any = { productId: id };
    if (size !== undefined && size !== '' && !isNaN(Number(size))) {
      where.sizeValue = Number(size);
    }

    const variants = await prisma.productVariant.findMany({
      where,
      include: {
        product: {
          include: {
            brand: true,
            category: true,
          },
        },
      },
      orderBy: [{ sizeValue: 'asc' }, { price: 'asc' }],
    });

    const formatted = variants.map((v) => {
      let specs: Record<string, any> = {};
      try {
        specs = JSON.parse(v.specsJson || '{}');
      } catch {
        specs = {};
      }
      return {
        ...v,
        specs,
      };
    });

    res.json(formatted);
  } catch (error) {
    console.error('getProductVariants error:', error);
    res.status(500).json({ error: 'Failed to fetch product variants' });
  }
};

export const getServices = async (req: Request, res: Response): Promise<void> => {
  try {
    const { categoryId } = req.query;
    const where: any = {};
    if (categoryId && typeof categoryId === 'string') where.categoryId = categoryId;

    const services = await prisma.service.findMany({
      where,
      include: {
        options: true,
        category: true,
      },
    });

    const formatted = services.map((s) => ({
      ...s,
      options: s.options.map((opt) => ({
        ...opt,
        features: JSON.parse(opt.featuresJson || '[]'),
      })),
    }));

    res.json(formatted);
  } catch (error) {
    console.error('getServices error:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
};

export const getServiceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        options: true,
        category: true,
      },
    });

    if (!service) {
      res.status(404).json({ error: 'Service not found' });
      return;
    }

    const formatted = {
      ...service,
      options: service.options.map((opt) => ({
        ...opt,
        features: JSON.parse(opt.featuresJson || '[]'),
      })),
      features: [
        { id: 'f1', title: 'Certified Engineers', description: 'Experienced technicians with 500+ jobs completed', icon: 'shield-checkmark-outline' },
        { id: 'f2', title: '30-Day Guarantee', description: 'Free re-service if issue recurs within 30 days', icon: 'ribbon-outline' },
        { id: 'f3', title: 'Transparent Pricing', description: 'Fixed rate cards without hidden charges', icon: 'pricetag-outline' },
      ],
      faq: [
        { question: 'How long does this service take?', answer: 'Service takes approximately 45 to 60 minutes per unit.' },
        { question: 'What warranty is provided?', answer: 'All services include a 30-day post-service satisfaction warranty.' },
      ],
    };

    res.json(formatted);
  } catch (error) {
    console.error('getServiceById error:', error);
    res.status(500).json({ error: 'Failed to fetch service' });
  }
};
