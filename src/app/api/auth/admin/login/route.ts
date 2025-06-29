import { NextRequest, NextResponse } from 'next/server';
import { getAdminModel } from '@/models/Admin';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const AdminLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function POST(request: NextRequest) {
  console.log('🔐 Admin login API called');
  
  try {
    const body = await request.json();
    console.log('📝 Request body:', { email: body.email, password: '***' });
    
    const { email, password } = AdminLoginSchema.parse(body);
    console.log('✅ Input validation passed');

    console.log('🗄️ Connecting to admin database...');
    const AdminModel = await getAdminModel();
    console.log('✅ Admin model loaded');

    // Check if admin exists
    console.log('🔍 Checking if admin exists:', email);
    let admin = await AdminModel.findOne({ email: email.toLowerCase() }).select('+password');
    console.log('🔍 Admin found:', !!admin);

    if (!admin) {
      console.log('🆕 Creating new admin account...');
      // Create new admin if not found
      const hashedPassword = await bcrypt.hash(password, 12);
      
      admin = new AdminModel({
        email: email.toLowerCase(),
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        permissions: [
          'manage_products',
          'view_analytics',
          'manage_orders',
          'manage_categories'
        ],
        isActive: true,
        department: 'General'
      });

      await admin.save();
      
      console.log('✅ New admin created:', email);
    } else {
      console.log('🔐 Verifying password for existing admin...');
      // Verify password for existing admin
      const isPasswordValid = await bcrypt.compare(password, admin.password || '');
      console.log('🔐 Password valid:', isPasswordValid);
      
      if (!isPasswordValid) {
        console.log('❌ Invalid password');
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        );
      }

      // Update last login
      admin.lastLogin = new Date();
      admin.loginAttempts = 0;
      await admin.save();
      
      console.log('✅ Admin login successful:', email);
    }

    // Remove password from response
    const adminResponse = {
      id: admin._id,
      email: admin.email,
      firstName: admin.firstName,
      lastName: admin.lastName,
      role: admin.role,
      permissions: admin.permissions,
      department: admin.department,
      lastLogin: admin.lastLogin,
      isActive: admin.isActive
    };

    console.log('✅ Sending success response');
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      admin: adminResponse,
      token: `admin_${admin._id}_${Date.now()}` // Simple token for demo
    });

  } catch (error) {
    console.error('❌ Admin login error:', error);
    
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