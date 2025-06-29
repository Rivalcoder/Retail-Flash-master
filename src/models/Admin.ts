import mongoose, { Schema, Document } from 'mongoose';
import { adminDbConnect } from '@/lib/mongodb';

export interface IAdmin extends Document {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  role: 'super_admin' | 'admin' | 'moderator';
  permissions: string[];
  isActive: boolean;
  lastLogin?: Date;
  loginAttempts: number;
  lockUntil?: Date;
  profileImage?: string;
  phone?: string;
  department?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema: Schema = new Schema({
  email: {
    type: String,
    required: [true, 'Please provide an email.'],
    unique: true,
    match: [/.+@.+\..+/, 'Please enter a valid email address.'],
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password.'],
    select: false,
    minlength: [8, 'Password must be at least 8 characters long.'],
  },
  firstName: {
    type: String,
    required: [true, 'First name is required.'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters.'],
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required.'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters.'],
  },
  role: {
    type: String,
    enum: ['super_admin', 'admin', 'moderator'],
    default: 'admin',
  },
  permissions: [{
    type: String,
    enum: [
      'manage_products',
      'manage_users', 
      'manage_admins',
      'view_analytics',
      'manage_orders',
      'manage_categories',
      'manage_promotions',
      'view_reports'
    ],
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: {
    type: Date,
  },
  loginAttempts: {
    type: Number,
    default: 0,
  },
  lockUntil: {
    type: Date,
  },
  profileImage: {
    type: String,
  },
  phone: {
    type: String,
    trim: true,
  },
  department: {
    type: String,
    trim: true,
  },
}, { 
  timestamps: true,
  collection: 'admins'
});

// Indexes for better query performance
AdminSchema.index({ email: 1 });
AdminSchema.index({ role: 1 });
AdminSchema.index({ isActive: 1 });
AdminSchema.index({ department: 1 });

// Virtual for full name
AdminSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Ensure virtual fields are serialized
AdminSchema.set('toJSON', { virtuals: true });
AdminSchema.set('toObject', { virtuals: true });

// Create model with admin database connection
async function getAdminModel() {
  const adminConnection = await adminDbConnect();
  return adminConnection.models.Admin || adminConnection.model<IAdmin>('Admin', AdminSchema);
}

export { getAdminModel };
export default getAdminModel; 