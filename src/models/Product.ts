import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  category: String,
  stock: Number,
  imageUrl: String,
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema); 