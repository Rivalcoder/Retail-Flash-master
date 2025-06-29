import { NextRequest, NextResponse } from 'next/server';
import { getProductModel } from '@/models/Product';
import { productDbConnect } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
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

    // Connect to product database
    const productConnection = await productDbConnect();
    const ProductModel = await getProductModel();

    // Parse the JSON data from request body
    const productsData = await request.json();

    if (!Array.isArray(productsData)) {
      return NextResponse.json(
        { error: 'Invalid JSON format. Expected an array of products.' },
        { status: 400 }
      );
    }

    let added = 0;
    let updated = 0;
    let errors = 0;
    const results = [];

    for (const productData of productsData) {
      try {
        // Validate required fields
        if (!productData.id || !productData.name || !productData.price) {
          results.push({
            id: productData.id || 'unknown',
            status: 'error',
            message: 'Missing required fields (id, name, price)'
          });
          errors++;
          continue;
        }

        // Check if product exists by name and category (since we don't have id field)
        const existingProduct = await ProductModel.findOne({ 
          name: productData.name,
          category: productData.category 
        });

        if (existingProduct) {
          // Update existing product
          const updateData = {
            name: productData.name,
            price: parseFloat(productData.price),
            description: productData.description,
            category: productData.category,
            stock: parseInt(productData.stock) || 0,
            imageUrl: productData.imageUrl,
            tags: productData.tags || [],
            specifications: productData.specifications || {},
            updatedAt: new Date()
          };

          await ProductModel.findByIdAndUpdate(
            existingProduct._id,
            { $set: updateData }
          );

          results.push({
            id: productData.id,
            _id: existingProduct._id.toString(),
            status: 'updated',
            message: 'Product updated successfully'
          });
          updated++;
        } else {
          // Create new product
          const newProduct = new ProductModel({
            name: productData.name,
            price: parseFloat(productData.price),
            description: productData.description,
            category: productData.category,
            stock: parseInt(productData.stock) || 0,
            imageUrl: productData.imageUrl,
            tags: productData.tags || [],
            specifications: productData.specifications || {},
            isNew: true,
            isActive: true,
            createdBy: adminId, // Associate with admin
            ratings: {
              average: 0,
              count: 0
            }
          });

          await newProduct.save();

          results.push({
            id: productData.id,
            _id: newProduct._id.toString(),
            status: 'created',
            message: 'Product created successfully'
          });
          added++;
        }
      } catch (error) {
        console.error(`Error processing product ${productData.id}:`, error);
        results.push({
          id: productData.id || 'unknown',
          status: 'error',
          message: error instanceof Error ? error.message : 'Unknown error'
        });
        errors++;
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Catalog update completed',
      summary: {
        total: productsData.length,
        added,
        updated,
        errors
      },
      results
    });

  } catch (error) {
    console.error('Catalog upload error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process catalog upload',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 