import { NextRequest, NextResponse } from 'next/server';
import { getProductModel } from '@/models/Product';
import { productDbConnect } from '@/lib/mongodb';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get admin data from request headers
    const adminId = request.headers.get('x-admin-id');
    const adminEmail = request.headers.get('x-admin-email');
    
    if (!adminId || !adminEmail) {
      return NextResponse.json(
        { error: 'Admin authentication required' },
        { status: 401 }
      );
    }

    const { id: productId } = await params;
    const updateData = await request.json();

    // Connect to product database
    const productConnection = await productDbConnect();
    const ProductModel = await getProductModel();

    // Find and update the product by MongoDB _id
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      { 
        $set: {
          ...updateData,
          updatedAt: new Date()
        }
      },
      { new: true }
    );

    if (!updatedProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct
    });

  } catch (error) {
    console.error('Product update error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update product',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params;

    // Connect to product database
    const productConnection = await productDbConnect();
    const ProductModel = await getProductModel();

    // Find the product by MongoDB _id
    const product = await ProductModel.findById(productId);

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      product
    });

  } catch (error) {
    console.error('Product fetch error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch product',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get admin data from request headers
    const adminId = request.headers.get('x-admin-id');
    const adminEmail = request.headers.get('x-admin-email');
    
    if (!adminId || !adminEmail) {
      return NextResponse.json(
        { error: 'Admin authentication required' },
        { status: 401 }
      );
    }

    const { id: productId } = await params;

    // Connect to product database
    const productConnection = await productDbConnect();
    const ProductModel = await getProductModel();

    // Find and delete the product by MongoDB _id
    const deletedProduct = await ProductModel.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
      product: deletedProduct
    });

  } catch (error) {
    console.error('Product deletion error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to delete product',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 