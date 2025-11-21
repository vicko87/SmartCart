import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// GET all products - Público
router.get('/', async (req, res) => {
    try {
        console.log('📦 GET /api/products - Fetching products...');
        
        const products = await Product.find();
        
        console.log('✅ Products found:', products.length);
        
        if (products.length > 0) {
            console.log('✅ First product:', {
                id: products[0]._id,
                name: products[0].name,
                price: products[0].price
            });
        }
        
        res.json({ 
            success: true, 
            data: products 
        });
        
    } catch (error) {
        console.error('❌ Error fetching products:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});

// GET product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ 
                success: false, 
                message: 'Producto no encontrado' 
            });
        }
        
        res.json({ 
            success: true, 
            data: product 
        });
        
    } catch (error) {
        console.error('❌ Error fetching product:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});

export default router;