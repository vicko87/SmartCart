import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware to protect routes
export const protect = async (req, res, next) => {
    let token;

    //verify token
    if(req.headers.authorization?.startsWith('Bearer')) {
        try {
            //extraer el token del header(quita la palabra 'Bearer ')
            token = req.headers.authorization.split(' ')[1];
            //verificar el token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            //buscar el usuario por id  en la BD
            req.user = await User.findById(decoded.id).select('-password');
            //pasar al siguiente middleware
            next();
        }catch (error) {
            res.status(401).json({message: 'Not authorized, token failed'});
        }
    }
    //si no hay token
    if (!token) return res.status(401).json({message: 'Not authorized, no token'});
};