import express from 'express';
import {
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
    getCartSummary
} from '../controllers/cart.js';

import { protect } from '../middlewares/auth.js';

// Todas las rutas del carrito requieren autenticación
router.use(protect);

const router = express.Router();

// Rutas del carrito
router.get('/', getCart);
router.post('/add', addToCart);
router.get('/summary', getCartSummary);
router.put('/item/:productId', updateCartItem);
router.delete('/item/:productId', removeCartItem);
router.delete('/clear', clearCart);


export default router;