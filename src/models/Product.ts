import mongoose, { Schema, Document } from 'mongoose';
import { productDbConnect } from '@/lib/mongodb';

export interface IProduct extends Document {
  name: string;
  price: number;
  oldPrice?: number;
  description?: string;
  category: string;
  stock: number;
  imageUrl: string;
  promoCopy?: string;
  isNew?: boolean;
  isActive: boolean;
  createdBy: mongoose.Types.ObjectId; // Admin who created the product
  tags?: string[];
  specifications?: Record<string, any>;
  ratings?: {
    average: number;
    count: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema({
  name: { 
    type: String, 
    required: [true, 'Product name is required.'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters.'],
  },
  price: { 
    type: Number, 
    required: [true, 'Product price is required.'],
    min: [0, 'Price cannot be negative.'],
  },
  oldPrice: { 
    type: Number,
    min: [0, 'Old price cannot be negative.'],
  },
  description: { 
    type: String,
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters.'],
  },
  category: { 
    type: String, 
    required: [true, 'Product category is required.'],
    trim: true,
  },
  stock: { 
    type: Number, 
    required: [true, 'Stock quantity is required.'],
    min: [0, 'Stock cannot be negative.'],
    default: 0,
  },
  imageUrl: { 
    type: String, 
    required: [true, 'Product image is required.'],
  },
  promoCopy: { 
    type: String,
    trim: true,
  },
  isNew: { 
    type: Boolean, 
    default: false,
  },
  isActive: { 
    type: Boolean, 
    default: true,
  },
  createdBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'Admin',
    required: [true, 'Admin ID is required.'],
  },
  tags: [{ 
    type: String, 
    trim: true 
  }],
  specifications: { 
    type: Schema.Types.Mixed,
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    count: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
}, { 
  timestamps: true,
  collection: 'products',
  suppressReservedKeysWarning: true
});

// Indexes for better query performance
ProductSchema.index({ name: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ isActive: 1 });
ProductSchema.index({ createdBy: 1 });
ProductSchema.index({ isNew: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ 'ratings.average': -1 });

// Create model with product database connection
async function getProductModel() {
  const productConnection = await productDbConnect();
  return productConnection.models.Product || productConnection.model<IProduct>('Product', ProductSchema);
}

export { getProductModel };
export default getProductModel; 