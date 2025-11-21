
const mongoose = require('mongoose');
const Product = require('./models/Product');

const products = [
    { name: "Manzanas Rojas", description: "Manzanas frescas del kg", price: 5.50, category: "Frutas", stock: 50 },
    { name: "Lechuga Orgánica", description: "Lechuga fresca hidropónica", price: 3.00, category: "Verduras", stock: 30 },
    { name: "Tomates", description: "Tomates rojos frescos del kg", price: 4.00, category: "Verduras", stock: 40 },
    { name: "Plátanos", description: "Plátanos de seda del kg", price: 3.50, category: "Frutas", stock: 60 },
    { name: "Leche Entera", description: "Leche fresca 1 litro", price: 4.50, category: "Lácteos", stock: 100 },
    { name: "Pan Integral", description: "Pan integral recién horneado", price: 2.50, category: "Panadería", stock: 20 },
    { name: "Pollo Fresco", description: "Pechuga de pollo 1kg", price: 15.00, category: "Carnes", stock: 15 },
    { name: "Yogurt Natural", description: "Yogurt natural 1 litro", price: 6.00, category: "Lácteos", stock: 25 },
    { name: "Zanahorias", description: "Zanahorias frescas del kg", price: 2.80, category: "Verduras", stock: 35 },
    { name: "Naranjas", description: "Naranjas de jugo del kg", price: 4.20, category: "Frutas", stock: 45 }
];

async function createProducts() {
    try {
        await mongoose.connect('mongodb://localhost:27017/smartcart');
        console.log('✅ Conectado a MongoDB');

        await Product.deleteMany({});
        console.log('🗑️ Productos anteriores eliminados');

        await Product.insertMany(products);
        console.log('✅ 10 productos creados exitosamente!');

        const allProducts = await Product.find();
        console.log('\n📦 Productos en la base de datos:');
        allProducts.forEach(p => {
            console.log(`   - ${p.name} (${p.category}) - S/. ${p.price}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

createProducts();