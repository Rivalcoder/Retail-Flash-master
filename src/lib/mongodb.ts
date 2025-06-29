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
    bufferCommands: false,
  };
  
  return mongoose.createConnection(connectionString, opts);
}

// Admin database connection
async function adminDbConnect() {
  if (cached.adminConn) {
    return cached.adminConn;
  }

  if (!cached.adminPromise) {
    cached.adminPromise = createConnection('admin_db');
  }
  
  try {
    cached.adminConn = await cached.adminPromise;
  } catch (e) {
    cached.adminPromise = null;
    throw e;
  }

  return cached.adminConn;
}

// User database connection
async function userDbConnect() {
  if (cached.userConn) {
    return cached.userConn;
  }

  if (!cached.userPromise) {
    cached.userPromise = createConnection('user_db');
  }
  
  try {
    cached.userConn = await cached.userPromise;
  } catch (e) {
    cached.userPromise = null;
    throw e;
  }

  return cached.userConn;
}

// Product database connection
async function productDbConnect() {
  if (cached.productConn) {
    return cached.productConn;
  }

  if (!cached.productPromise) {
    cached.productPromise = createConnection('product_db');
  }
  
  try {
    cached.productConn = await cached.productPromise;
  } catch (e) {
    cached.productPromise = null;
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
