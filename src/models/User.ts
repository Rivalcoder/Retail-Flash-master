import mongoose, { Schema, Document } from 'mongoose';
import { userDbConnect } from '@/lib/mongodb';

export interface IUser extends Document {
  email: string;
  password?: string;
  role: 'customer' | 'admin';
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
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
    minlength: [6, 'Password must be at least 6 characters long.'],
  },
  role: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer',
  },
  firstName: {
    type: String,
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters.'],
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters.'],
  },
  phone: {
    type: String,
    trim: true,
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: {
      type: String,
      default: 'India',
    },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: {
    type: Date,
  },
}, { 
  timestamps: true,
  collection: 'users'
});

// Index for better query performance
// Removed email index since unique: true already creates it
UserSchema.index({ role: 1 });
UserSchema.index({ isActive: 1 });

// Create model with user database connection
async function getUserModel() {
  const userConnection = await userDbConnect();
  return userConnection.models.User || userConnection.model<IUser>('User', UserSchema);
}

export { getUserModel };
export default getUserModel;
