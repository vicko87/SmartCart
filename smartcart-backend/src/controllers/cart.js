import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

//Obtener el carrito de un usuario
export const getCart = async (req, res) => {
    try{
        let cart = await Cart.findOne({user: req.user._id}).populate('items.product');
        if(!cart){
            //crear carrito vacío si no existe
            cart = await Cart.create({user: req.user._id, items: []});
        }

        res.status(200).json({
            success: true,
            data: cart
        });
    } catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        });    
    }
    };

    //Agregar producto al carrito
    export const addToCart = async (req, res) => {
        try{
            const { productId, quantity = 1 } = req.body;

            //validar campos requiridos
            if(!productId){
                return res.status(400).json({
                    success: false,
                    message: "Product ID is required"
                });
            }
        
            //verificar si el producto existe y pretence al usuario
            const product = await Product.findById(productId);

            if(!product){
                return res.status(404).json({
                    success: false,
                    message: "Product not found or access denied"
                });
            }

            //buscar o crear carrito
            let cart = await Cart.findOne({ user: req.user._id});
            if(!cart){
                cart = new Cart({ user: req.user._id, items: [] });
            }

            //verificar si elproducto ya esta en el carrito
            const existingItemIndex = cart.items.findIndex(
                item => item.product.toString() === productId
            );

            if(existingItemIndex > -1){
                //actualizar cantidad si ya existe
                cart.items[existingItemIndex].quantity += quantity;
            } else {
                //agregar nuevo producto al carrito
                cart.items.push({
                    product: productId,
                    quantity: quantity,
                    price: product.price
                });
            }

            await cart.save();
            await cart.populate('items.product');

            res.status(200).json({
                success: true,
                message: "Product added to cart",
                data: cart
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
        }

        //Actualizar cantidad de un producto en el carrito
        export const updateCartItem = async (req, res) => {
            try{
                const { productId}= req.params;
                const { quantity } = req.body;

                //validar cantidad
                if(!quantity || quantity < 1){
                    return res.status(400).json({
                        success: false,
                        message: "Quantity must be at least 1"
                    });
                }

                const cart = await Cart.findOne({ user: req.user._id });
                if(!cart){
                    return res.status(404).json({
                        success: false,
                        message: "Cart not found"
                    });
                }

                const itemIndex = cart.items.findIndex(
                    item => item.product.toString() === productId
                );

                if(itemIndex === -1){
                    return res.status(404).json({
                        success: false,
                        message: "Product not found in cart"
                    });
                }

                cart.items[itemIndex].quantity = quantity;
                await cart.save();
                await cart.populate('items.product');

                res.status(200).json({
                    success: true,
                    message: "Cart item updated",
                    data: cart
                });
            } catch (error) {
                res.status(500).json({
                    success: false,
                    message: error.message
                });
            }
        };

        //Eliminar producto del carrito
        export const removeCartItem = async (req, res) => {
            try{
                const { productId } = req.params;

                const cart = await Cart.findOne({ user: req.user._id });
                if(!cart){
                    return res.status(404).json({
                        success: false,
                        message: "Cart not found"
                    });
                }

            //filtrar el producto a eliminar
          const initialLength = cart.items.length;
            cart.items = cart.items.filter(
                item => item.product.toString() !== productId
            );

            //verificar si se eliminó algún producto
            if(cart.items.length === initialLength){
                return res.status(404).json({
                    success: false,
                    message: "Product not found in cart"
                });
            }

            await cart.save();
            await cart.populate('items.product');

            res.status(200).json({
                success: true,
                message: "Product removed from cart",
                data: cart
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    };

    //limpiar el carrito
    export const clearCart = async (req, res) => {
        try{
            const cart = await Cart.findOne({ user: req.user._id });
            if(!cart){
                return res.status(404).json({
                    success: false,
                    message: "Cart not found"
                });
            }

            cart.items = [];
            await cart.save();
            res.status(200).json({
                success: true,
                message: "Cart cleared successfully",
                data: cart
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            }); 
        }
    };

    //obtener el total del carrito
    export const getCartSummary = async (req, res) => {
        try{
            const cart = await Cart.findOne({ user: req.user._id });

            if(!cart){
                return res.status(200).json({
                    success: true,
                    data: {
                        totalItems: 0,
                        totalPrice: 0,
                        itemCount: 0
                    }
                });
            }
           
            res.status(200).json({
                success: true,
                data: {
                    totalItems: cart.totalItems,
                    totalPrice: cart.totalPrice,
                    itemCount: cart.items.length
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    };