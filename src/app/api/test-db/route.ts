import { NextResponse } from 'next/server';
import { adminDbConnect } from '@/lib/mongodb';

export async function GET() {
  try {
    console.log('🧪 Testing database connection...');
    
    if (!process.env.MONGO_URL) {
      return NextResponse.json({
        success: false,
        error: 'MONGO_URL environment variable is not set'
      }, { status: 500 });
    }
    
    const connection = await adminDbConnect();
    
    // Test the connection
    const admin = connection.db.admin();
    const result = await admin.ping();
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      ping: result,
      connectionState: connection.readyState,
      databaseName: connection.name
    });
    
  } catch (error) {
    console.error('❌ Database test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      connectionState: 'failed'
    }, { status: 500 });
  }
} 