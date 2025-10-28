import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleCompleted
} from "../controllers/product.js";
import { protect } from '../middlewares/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(protect);

//Rutas publicas
router.get('/', getProducts);
router.get('/:id', getProductById);

//Rutas protegidas
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.patch('/:id/toggle', toggleCompleted);


export default router;