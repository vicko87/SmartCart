import mongoose from "mongoose";
import Product from './models/Product.js';

async function updateStock(){
    try {
        await mongoose.connect('mongodb://localhost:27017/smartcart');
        console.log('✅ Conectado a MongoDB');

        //Actualizar stock de productos
        const result = await Product.updateMany(
            {},
            {
                 $set: { //operador de Mongo para cambiar valores
                    quantity: 100,
                    stick: 100

                  } 
                }
        );

        console.log(`✅ ${result.modifiedCount} productos actualizados con stock: 100`);

        //Mostrar productos actualizados
        const products = await Product.find();
        console.log('\n📦 Productos actualizados:');
        products.forEach(p => {
            console.log(`   - ${p.name}: Stock: ${p.stock || p.quantity}`);
        });

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}
updateStock();