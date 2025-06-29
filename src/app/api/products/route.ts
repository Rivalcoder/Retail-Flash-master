import { NextRequest, NextResponse } from 'next/server';
import { getProductModel } from '@/models/Product';
import { getAdminModel } from '@/models/Admin';
import { z } from 'zod';

const CreateProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  price: z.number().positive('Price must be positive'),
  oldPrice: z.number().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  stock: z.number().min(0, 'Stock cannot be negative'),
  imageUrl: z.string().url('Valid image URL is required').optional(),
  tags: z.array(z.string()).optional(),
  specifications: z.record(z.any()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const productData = CreateProductSchema.parse(body);

    // Get admin ID from request headers (in real app, this would come from JWT token)
    const adminId = request.headers.get('x-admin-id');
    
    if (!adminId) {
      return NextResponse.json(
        { error: 'Admin authentication required' },
        { status: 401 }
      );
    }

    // Verify admin exists
    const AdminModel = await getAdminModel();
    const admin = await AdminModel.findById(adminId);
    
    if (!admin) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404 }
      );
    }

    const ProductModel = await getProductModel();

    // Create new product with admin reference
    const product = new ProductModel({
      ...productData,
      createdBy: adminId,
      isActive: true,
      isNew: true,
      ratings: {
        average: 0,
        count: 0
      }
    });

    await product.save();

    console.log(`✅ Product "${product.name}" created by admin: ${admin.email}`);

    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      product: {
        _id: product._id,
        name: product.name,
        price: product.price,
        oldPrice: product.oldPrice,
        description: product.description,
        category: product.category,
        stock: product.stock,
        imageUrl: product.imageUrl,
        promoCopy: product.promoCopy,
        isNew: product.isNew,
        createdBy: product.createdBy,
        ratings: product.ratings,
        tags: product.tags,
        specifications: product.specifications,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      }
    });

  } catch (error) {
    console.error('❌ Product creation error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const ProductModel = await getProductModel();
    const AdminModel = await getAdminModel();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const adminId = searchParams.get('adminId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');

    // Build query
    let query: any = { isActive: true };
    
    if (category) {
      query.category = category;
    }
    
    if (adminId) {
      query.createdBy = adminId;
    }

    // Get products with pagination
    const products = await ProductModel.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    // Get total count
    const total = await ProductModel.countDocuments(query);

    console.log(`✅ Retrieved ${products.length} products`);

    return NextResponse.json({
      success: true,
      products: products.map(product => ({
        _id: product._id,
        name: product.name,
        price: product.price,
        oldPrice: product.oldPrice,
        description: product.description,
        category: product.category,
        stock: product.stock,
        imageUrl: product.imageUrl,
        promoCopy: product.promoCopy,
        isNew: product.isNew,
        createdBy: product.createdBy,
        ratings: product.ratings,
        tags: product.tags,
        specifications: product.specifications,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('❌ Product retrieval error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 