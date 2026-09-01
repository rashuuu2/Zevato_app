import { Router } from 'express';
import {
  getCategories,
  getBrands,
  getProducts,
  getProductById,
  getServices,
  getServiceById,
} from '../controllers/catalogController';

const router = Router();

router.get('/categories', getCategories);
router.get('/brands', getBrands);
router.get('/products', getProducts);
router.get('/products/:id', getProductById);
router.get('/services', getServices);
router.get('/services/:id', getServiceById);

export default router;
