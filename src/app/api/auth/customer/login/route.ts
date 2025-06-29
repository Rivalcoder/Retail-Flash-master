import { NextRequest, NextResponse } from 'next/server';
import { getUserModel } from '@/models/User';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const CustomerLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function POST(request: NextRequest) {
  console.log('🔐 Customer login API called');
  
  try {
    const body = await request.json();
    console.log('📝 Request body:', { email: body.email, password: '***' });
    
    const { email, password } = CustomerLoginSchema.parse(body);
    console.log('✅ Input validation passed');

    console.log('🗄️ Connecting to user database...');
    const UserModel = await getUserModel();
    console.log('✅ User model loaded');

    // Check if customer exists
    console.log('🔍 Checking if customer exists:', email);
    let customer = await UserModel.findOne({ email: email.toLowerCase() }).select('+password');
    console.log('🔍 Customer found:', !!customer);

    if (!customer) {
      console.log('🆕 Creating new customer account...');
      // Create new customer if not found
      const hashedPassword = await bcrypt.hash(password, 12);
      
      customer = new UserModel({
        email: email.toLowerCase(),
        password: hashedPassword,
        firstName: 'Customer',
        lastName: 'User',
        role: 'customer',
        isActive: true,
        address: {
          country: 'India'
        }
      });

      await customer.save();
      
      console.log('✅ New customer created:', email);
    } else {
      console.log('🔐 Verifying password for existing customer...');
      // Verify password for existing customer
      const isPasswordValid = await bcrypt.compare(password, customer.password || '');
      console.log('🔐 Password valid:', isPasswordValid);
      
      if (!isPasswordValid) {
        console.log('❌ Invalid password');
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        );
      }

      // Update last login
      customer.lastLogin = new Date();
      await customer.save();
      
      console.log('✅ Customer login successful:', email);
    }

    // Remove password from response
    const customerResponse = {
      id: customer._id,
      email: customer.email,
      firstName: customer.firstName,
      lastName: customer.lastName,
      role: customer.role,
      phone: customer.phone,
      address: customer.address,
      lastLogin: customer.lastLogin,
      isActive: customer.isActive
    };

    console.log('✅ Sending success response');
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      customer: customerResponse,
      token: `customer_${customer._id}_${Date.now()}` // Simple token for demo
    });

  } catch (error) {
    console.error('❌ Customer login error:', error);
    
    if (error instanceof z.ZodError) {
      console.log('❌ Validation error:', error.errors);
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 