import mongoose from 'mongoose';

const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
  throw new Error(
    'Please define the MONGO_URL environment variable inside .env'
  );
}

/**
 * Global is used here to maintain cached connections across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { 
    adminConn: null, 
    userConn: null, 
    productConn: null,
    adminPromise: null,
    userPromise: null,
    productPromise: null
  };
}

// Helper function to create database connection
async function createConnection(databaseName: string) {
  const connectionString = `${MONGO_URL}/${databaseName}`;
  const opts = {
    bufferCommands: false, // Disable buffering to ensure immediate connection
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 10000, // Increased timeout
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000, // Added connection timeout
  };
  
  const connection = mongoose.createConnection(connectionString, opts);
  
  // Wait for connection to be ready
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error(`Connection timeout for ${databaseName}`));
    }, 10000);
    
    connection.once('connected', () => {
      clearTimeout(timeout);
      resolve(connection);
    });
    
    connection.once('error', (error) => {
      clearTimeout(timeout);
      reject(error);
    });
  });
  
  return connection;
}

// Admin database connection
async function adminDbConnect() {
  if (cached.adminConn && cached.adminConn.readyState === 1) {
    return cached.adminConn;
  }

  if (!cached.adminPromise) {
    cached.adminPromise = createConnection('admin_db');
  }
  
  try {
    cached.adminConn = await cached.adminPromise;
    console.log('✅ Admin database connected successfully');
  } catch (e) {
    cached.adminPromise = null;
    console.error('❌ Admin database connection failed:', e);
    throw e;
  }

  return cached.adminConn;
}

// User database connection
async function userDbConnect() {
  if (cached.userConn && cached.userConn.readyState === 1) {
    return cached.userConn;
  }

  if (!cached.userPromise) {
    cached.userPromise = createConnection('user_db');
  }
  
  try {
    cached.userConn = await cached.userPromise;
    console.log('✅ User database connected successfully');
  } catch (e) {
    cached.userPromise = null;
    console.error('❌ User database connection failed:', e);
    throw e;
  }

  return cached.userConn;
}

// Product database connection
async function productDbConnect() {
  if (cached.productConn && cached.productConn.readyState === 1) {
    return cached.productConn;
  }

  if (!cached.productPromise) {
    cached.productPromise = createConnection('product_db');
  }
  
  try {
    cached.productConn = await cached.productPromise;
    console.log('✅ Product database connected successfully');
  } catch (e) {
    cached.productPromise = null;
    console.error('❌ Product database connection failed:', e);
    throw e;
  }

  return cached.productConn;
}

// Legacy function for backward compatibility
async function dbConnect() {
  return adminDbConnect();
}

export { adminDbConnect, userDbConnect, productDbConnect };
export default dbConnect;
