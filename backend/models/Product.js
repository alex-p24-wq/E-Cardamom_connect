import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0 },
  grade: { type: String, enum: ['Premium', 'Organic', 'Regular'], required: true },
  image: { type: String, trim: true },
  address: { type: String, trim: true },
  experienceYears: { type: Number, min: 0 },
  description: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', ProductSchema);
export default Product;