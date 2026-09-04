import { Router } from 'express';
import {
  getCategories,
  getSubcategories,
  getBrands,
  getProducts,
  getProductById,
  getProductVariants,
  getServices,
  getServiceById,
} from '../controllers/catalogController';

const router = Router();

// Category hierarchy routes
router.get('/categories', getCategories);
router.get('/categories/:id/subcategories', getSubcategories);
router.get('/categories/:id/products', getProducts);

// Brands routes
router.get('/brands', getBrands);

// Product series and variants routes
router.get('/products', getProducts);
router.get('/products/:id', getProductById);
router.get('/products/:id/variants', getProductVariants);

// Services routes
router.get('/services', getServices);
router.get('/services/:id', getServiceById);

export default router;
