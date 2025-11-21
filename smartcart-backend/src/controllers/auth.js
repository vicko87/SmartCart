import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Generar JWT
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
}
// Registro de usuario
export const register = async(req, res) => {
    try{
        const{name, email, password} = req.body;

        // Verificar si el usuario ya existe
        const userExists = await User.findOne({email});
        if(userExists) {
            return res.status(400).json({message: 'User already exists'});
    }
        // Crear nuevo usuario
        const user = await User.create({
            name,
            email,
            password
        })

        if(user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id)
            });
        }
    }catch (error) {
        res.status(500).json({message: 'Server error'});
    }
    };
// Login de usuario
 export const login = async(req, res) => {
    try {
        const {email, password} = req.body;

        //Buscar usuario por email
        const user = await User.findOne({email});

        if(user && (await user.comparePassword(password))) {
            res.json({
                _id:user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({message: 'Invalid email or password'});
        }
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
}


// Obtener usuario actual
export const getCurrentUser = async (req, res) => {
    try {
        // req.user ya viene del middleware 'protect'
        const user = await User.findById(req.user._id).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};