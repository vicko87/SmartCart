import mongoose from "mongoose";


const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
   description: {
    type: String,
    trim: true
   },
   price: {
    type: Number,
    required: true,
    trim: 0
   },
   category: {
    type: String,
    required: true,
    trim: true
   },
   quantity: {
    type: Number,
    default: 1,
    min: 0
   },
   isCompleted: {
    type: Boolean,
    default: false
   },
   user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
   },
   timestamps: true
});

export default mongoose.model('Product', productSchema);
