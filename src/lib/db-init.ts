import { adminDbConnect, userDbConnect, productDbConnect } from './mongodb';
import { getAdminModel } from '@/models/Admin';
import { getUserModel } from '@/models/User';
import { getProductModel } from '@/models/Product';
import bcrypt from 'bcryptjs';

export async function initializeDatabases() {
  try {
    console.log('🔄 Initializing databases...');

    // Connect to all databases
    const adminConnection = await adminDbConnect();
    const userConnection = await userDbConnect();
    const productConnection = await productDbConnect();

    console.log('✅ All database connections established');

    // Initialize Admin Database
    await initializeAdminDatabase();
    
    // Initialize User Database
    await initializeUserDatabase();
    
    // Initialize Product Database
    await initializeProductDatabase();

    console.log('🎉 Database initialization completed successfully!');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}

async function initializeAdminDatabase() {
  try {
    console.log('📊 Initializing Admin Database...');
    
    const AdminModel = await getAdminModel();
    
    // Check if super admin already exists
    const existingSuperAdmin = await AdminModel.findOne({ role: 'super_admin' });
    
    if (!existingSuperAdmin) {
      // Create super admin user
      const hashedPassword = await bcrypt.hash('admin123456', 12);
      
      const superAdmin = new AdminModel({
        email: 'admin@retailflash.com',
        password: hashedPassword,
        firstName: 'Super',
        lastName: 'Admin',
        role: 'super_admin',
        permissions: [
          'manage_products',
          'manage_users', 
          'manage_admins',
          'view_analytics',
          'manage_orders',
          'manage_categories',
          'manage_promotions',
          'view_reports'
        ],
        isActive: true,
        department: 'Management'
      });
      
      await superAdmin.save();
      console.log('✅ Super Admin created successfully');
    } else {
      console.log('ℹ️ Super Admin already exists');
    }
    
  } catch (error) {
    console.error('❌ Admin database initialization failed:', error);
    throw error;
  }
}

async function initializeUserDatabase() {
  try {
    console.log('👥 Initializing User Database...');
    
    const UserModel = await getUserModel();
    
    // Check if demo customer exists
    const existingCustomer = await UserModel.findOne({ email: 'customer@retailflash.com' });
    
    if (!existingCustomer) {
      // Create demo customer
      const hashedPassword = await bcrypt.hash('customer123', 12);
      
      const demoCustomer = new UserModel({
        email: 'customer@retailflash.com',
        password: hashedPassword,
        firstName: 'Demo',
        lastName: 'Customer',
        role: 'customer',
        isActive: true,
        address: {
          street: '123 Demo Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400001',
          country: 'India'
        }
      });
      
      await demoCustomer.save();
      console.log('✅ Demo Customer created successfully');
    } else {
      console.log('ℹ️ Demo Customer already exists');
    }
    
  } catch (error) {
    console.error('❌ User database initialization failed:', error);
    throw error;
  }
}

async function initializeProductDatabase() {
  try {
    console.log('📦 Initializing Product Database...');
    
    const ProductModel = await getProductModel();
    const AdminModel = await getAdminModel();
    
    // Get super admin for product creation
    const superAdmin = await AdminModel.findOne({ role: 'super_admin' });
    
    if (!superAdmin) {
      throw new Error('Super admin not found for product initialization');
    }
    
    // Check if demo products exist
    const existingProducts = await ProductModel.countDocuments();
    
    if (existingProducts === 0) {
      // Create demo products
      const demoProducts = [
        {
          name: 'Wireless Bluetooth Headphones',
          price: 2499,
          oldPrice: 2999,
          description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
          category: 'Electronics',
          stock: 50,
          imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
          promoCopy: '🎧 Experience crystal clear sound with our premium wireless headphones! Save ₹500 on this amazing deal.',
          isNew: true,
          isActive: true,
          createdBy: superAdmin._id,
          tags: ['wireless', 'bluetooth', 'noise-cancellation', 'audio'],
          specifications: {
            'Battery Life': '30 hours',
            'Connectivity': 'Bluetooth 5.0',
            'Noise Cancellation': 'Active',
            'Weight': '250g'
          },
          ratings: {
            average: 4.5,
            count: 128
          }
        },
        {
          name: 'Smart Fitness Watch',
          price: 8999,
          oldPrice: 11999,
          description: 'Advanced fitness tracking with heart rate monitor, GPS, and water resistance.',
          category: 'Fitness',
          stock: 25,
          imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
          promoCopy: '🏃‍♂️ Track your fitness journey with precision! Get ₹3000 off on this premium smartwatch.',
          isNew: true,
          isActive: true,
          createdBy: superAdmin._id,
          tags: ['fitness', 'smartwatch', 'heart-rate', 'gps'],
          specifications: {
            'Display': '1.4" AMOLED',
            'Battery Life': '7 days',
            'Water Resistance': '5ATM',
            'GPS': 'Built-in'
          },
          ratings: {
            average: 4.3,
            count: 89
          }
        },
        {
          name: 'Organic Cotton T-Shirt',
          price: 799,
          oldPrice: 999,
          description: 'Comfortable and eco-friendly cotton t-shirt available in multiple colors.',
          category: 'Fashion',
          stock: 100,
          imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80',
          promoCopy: '👕 Stay comfortable and eco-friendly! Save ₹200 on our organic cotton collection.',
          isNew: false,
          isActive: true,
          createdBy: superAdmin._id,
          tags: ['organic', 'cotton', 'comfortable', 'eco-friendly'],
          specifications: {
            'Material': '100% Organic Cotton',
            'Fit': 'Regular',
            'Care': 'Machine washable',
            'Sizes': 'XS, S, M, L, XL'
          },
          ratings: {
            average: 4.7,
            count: 256
          }
        }
      ];
      
      await ProductModel.insertMany(demoProducts);
      console.log('✅ Demo Products created successfully');
    } else {
      console.log(`ℹ️ ${existingProducts} products already exist in database`);
    }
    
  } catch (error) {
    console.error('❌ Product database initialization failed:', error);
    throw error;
  }
}

// Export for manual initialization
export { initializeDatabases }; 