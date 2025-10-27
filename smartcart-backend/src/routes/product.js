import express from 'express';

const router = express.Router();

// Rutas de productos - temporales hasta crear controladores
router.get('/test', (req, res) => {
    res.json({ message: 'Product routes funcionando' });
});

export default router;