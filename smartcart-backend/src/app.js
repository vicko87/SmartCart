import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB} from  './config/db.js';

//Importar rutas
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';            
import orderRoutes from './routes/orderRoutes.js';

// Configurar variables de entorno
dotenv.config();

// Crear aplicación Express
const app = express();

// Conectar a la base de datos
connectDB();

//Middlewares
app.use(cors());
app.use(express.json());

//Rutas
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

//Ruta de prueba
app.get('/', (req, res) => {
    res.jsonp('API de SmartCart funcionando correctamente');
});

//Puerto
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});