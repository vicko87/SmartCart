import mongoose from "mongoose";


const cartItemSchema = new mongoose.Schema({
           product: {
             type: mongoose.Schema.Types.ObjectId,
              ref: 'Product',
             required: true
             },
     
           quantity: {
                type: Number,
                required: true,
                min: 1,
                default: 1
            },
        price: {
            type: Number,
            required: true,
            min: 0
        }
    });

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true//cada usuario tiene un solo carrito
    },
    items: [cartItemSchema],//Lista de items en el carrito
    totalPrice: {
        type: Number,
        default: 0,
        min: 0
    },
    totalItems: {
        type: Number,
        default: 0,
        min: 0
    }
    },
      { timestamps: true } // agrega automáticamente las fechas de creación y actualización.
);

//Metodo para calcular totales
cartSchema.methods.calculateTotals = function() {
    this.totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
    this.totalPrice = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
   return this;
};

//Pre-save hook para calcular totales antes de guardar
cartSchema.pre('save', function(next) {
    this.calculateTotals();
    next();
});






export default mongoose.model('Cart', cartSchema);