import express from 'express';

const router = express.Router();

// Rutas de órdenes - temporales  
router.get('/test', (req, res) => {
    res.json({ message: 'Order routes funcionando' });
});

export default router;