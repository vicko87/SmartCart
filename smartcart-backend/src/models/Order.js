import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    total: {
        type: Number,
        required: true,
        min: 0
    }
});

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderNumber: {
        type: String,
        required: true,
        unique: true
    },
    items: [orderItemSchema],
    totalAmount: {
        type: Number,
        required: true,
        min: 0   
    },
    totalItems: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    completedDate: {
        type: Date
    },
    notes: {
        type: String,
        maxlength: 500
    }
}, { timestamps: true });

// Generar número de orden único antes de guardar
orderSchema.pre('save', async function(next) {
    if (this.isNew && !this.orderNumber) { 
        try {
            const count = await this.constructor.countDocuments(); 
            this.orderNumber = `ORD-${Date.now()}-${(count + 1).toString().padStart(4, '0')}`;
        } catch (error) {
            return next(error);
        }
    }
    next();
});

// Método para calcular totales del pedido
orderSchema.methods.calculateTotals = function() {
    this.totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
    this.totalAmount = this.items.reduce((total, item) => total + item.total, 0);
    return this;
};

export default mongoose.model('Order', orderSchema);