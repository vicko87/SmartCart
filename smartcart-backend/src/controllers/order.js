import Order from '../models/Order.js';
import Cart from '../models/Cart.js';

// Obtener todas las ordenes del usuario
export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('items.product')
            .sort({ createdAt: -1 }); // Más recientes primero

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Obtener una orden específica por ID
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findOne({ _id: req.params.orderId, user: req.user._id })
            .populate('items.product')
            .populate('user', 'name email');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Crear orden desde el carrito
export const createOrderFromCart = async (req, res) => {
    try {
        const { notes } = req.body;

        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty"
            });
        }

        // Preparar items para la orden
        const orderItems = cart.items.map(item => ({
            product: item.product._id,
            name: item.product.name,
            quantity: item.quantity,
            price: item.price,
            total: item.price * item.quantity
        }));

        // Crear la orden
        const order = new Order({
            user: req.user._id,
            orderNumber: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            items: orderItems,
            totalAmount: cart.totalPrice,
            totalItems: cart.totalItems,
            notes: notes || ''
        });

        await order.save();
        await order.populate('items.product');

        // Limpiar el carrito
        cart.items = [];
        await cart.save();

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Actualizar el estado de una orden
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status. Valid options: pending, processing, shipped, delivered, cancelled"
            });
        }

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // Verificar que la orden pertenece al usuario
        if (order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        order.status = status;

        // Si la marca como entregada, agregar fecha de finalización
        if (status === 'delivered') {
            order.completedDate = new Date();
        }

        await order.save();
        await order.populate('items.product');

        res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Cancelar una orden
export const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // Verificar que la orden pertenece al usuario
        if (order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        // Solo se pueden cancelar órdenes pendientes o en proceso
        if (!['pending', 'processing'].includes(order.status)) {
            return res.status(400).json({
                success: false,
                message: "Cannot cancel this order"
            });
        }

        order.status = 'cancelled';
        await order.save();

        res.status(200).json({
            success: true,
            message: "Order cancelled successfully",
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Obtener estadísticas de órdenes del usuario
export const getOrderStats = async (req, res) => {
    try {
        const stats = await Order.aggregate([
            { $match: { user: req.user._id } },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                    totalAmount: { $sum: "$totalAmount" }
                }
            }
        ]);

        const totalOrders = await Order.countDocuments({ user: req.user._id });
        const totalSpent = await Order.aggregate([
            { $match: { user: req.user._id, status: "delivered" } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalOrders,
                totalSpent: totalSpent[0]?.total || 0,
                statusBreakdown: stats
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};