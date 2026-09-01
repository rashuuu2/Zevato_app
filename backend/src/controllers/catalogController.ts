import { Request, Response } from 'express';
import prisma from '../db';

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
    res.json(categories);
  } catch (error) {
    console.error('getCategories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

export const getBrands = async (req: Request, res: Response): Promise<void> => {
  try {
    const { categoryId } = req.query;
    let brands;

    if (categoryId && typeof categoryId === 'string') {
      // Find products matching categoryId and get unique brands
      const products = await prisma.product.findMany({
        where: { categoryId },
        select: { brandId: true },
      });
      const brandIds = Array.from(new Set(products.map((p) => p.brandId)));
      brands = await prisma.brand.findMany({
        where: { id: { in: brandIds } },
      });
    } else {
      brands = await prisma.brand.findMany();
    }

    res.json(brands);
  } catch (error) {
    console.error('getBrands error:', error);
    res.status(500).json({ error: 'Failed to fetch brands' });
  }
};

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { categoryId, brandId } = req.query;
    const where: any = {};
    if (categoryId && typeof categoryId === 'string') where.categoryId = categoryId;
    if (brandId && typeof brandId === 'string') where.brandId = brandId;

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        brand: true,
      },
    });

    res.json(products);
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
      },
    });

    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.json(product);
  } catch (error) {
    console.error('getProductById error:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
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

    // Format options features from JSON string to array
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
