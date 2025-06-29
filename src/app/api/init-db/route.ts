import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabases } from '@/lib/db-init';

export async function POST(request: NextRequest) {
  try {
    // Check if it's a development environment or has proper authorization
    if (process.env.NODE_ENV === 'production') {
      // In production, you might want to add proper authentication
      return NextResponse.json(
        { error: 'Database initialization is only allowed in development' },
        { status: 403 }
      );
    }

    console.log('🚀 Starting database initialization...');
    
    await initializeDatabases();
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Databases initialized successfully',
        data: {
          adminDb: 'admin_db',
          userDb: 'user_db', 
          productDb: 'product_db',
          createdUsers: {
            admin: 'admin@retailflash.com (admin123456)',
            customer: 'customer@retailflash.com (customer123)'
          }
        }
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    
    return NextResponse.json(
      { 
        error: 'Database initialization failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { 
      message: 'Database initialization endpoint',
      usage: 'POST /api/init-db to initialize databases',
      note: 'Only works in development environment'
    },
    { status: 200 }
  );
} 