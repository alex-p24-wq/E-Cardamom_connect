import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true, minlength: 1, maxlength: 100 },
  price: { 
    type: Number, 
    required: true, 
    min: [0.01, 'Price must be greater than 0'],
    validate: {
      validator: function(v) {
        return v > 0;
      },
      message: 'Price must be a positive number greater than 0'
    }
  },
  stock: { 
    type: Number, 
    required: true, 
    min: [1, 'Stock must be at least 1 kg'],
    validate: {
      validator: function(v) {
        return Number.isInteger(v) && v >= 1;
      },
      message: 'Stock must be at least 1 kg or more'
    }
  },
  grade: { type: String, enum: ['Premium', 'Organic', 'Regular'], required: true },
  image: { type: String, trim: true },
  state: { type: String, trim: true, maxlength: 100 },
  district: { type: String, trim: true, maxlength: 100 },
  nearestHub: { type: String, trim: true, maxlength: 200 },
  description: { type: String, trim: true, maxlength: 500 },
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', ProductSchema);
export default Product;