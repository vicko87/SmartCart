import express from 'express';
import {
    getOrders,
    getOrderById,
    createOrderFromCart,
    updateOrderStatus,
    cancelOrder,
    getOrderStats
}  from '../controllers/order.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.use(protect);

// Rutas de órdenes
router.get('/', getOrders);                          // GET /api/orders - Obtener todas las órdenes
router.get('/stats', getOrderStats);                 // GET /api/orders/stats - Estadísticas
router.post('/create', createOrderFromCart);         // POST /api/orders/create - Crear orden desde carrito
router.get('/:orderId', getOrderById);               // GET /api/orders/:orderId - Obtener orden específica
router.put('/:id/status', updateOrderStatus);        // PUT /api/orders/:id/status - Actualizar estado
router.delete('/:id/cancel', cancelOrder);           // DELETE /api/orders/:id/cancel - Cancelar orden

export default router;