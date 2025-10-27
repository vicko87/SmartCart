import express from 'express';

const router = express.Router();

// Rutas del carrito - temporales
router.get('/test', (req, res) => {
    res.json({ message: 'Cart routes funcionando' });
});

export default router;