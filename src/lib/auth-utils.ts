// Authentication utility functions

export interface AdminData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  permissions: string[];
  department?: string;
  lastLogin?: Date;
  isActive: boolean;
}

export interface CustomerData {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  lastLogin?: Date;
  isActive: boolean;
}

// Get admin data from localStorage
export function getAdminData(): AdminData | null {
  if (typeof window === 'undefined') return null;
  
  const adminData = localStorage.getItem('adminData');
  if (!adminData) return null;
  
  try {
    return JSON.parse(adminData);
  } catch (error) {
    console.error('Error parsing admin data:', error);
    return null;
  }
}

// Get customer data from localStorage
export function getCustomerData(): CustomerData | null {
  if (typeof window === 'undefined') return null;
  
  const customerData = localStorage.getItem('customerData');
  if (!customerData) return null;
  
  try {
    return JSON.parse(customerData);
  } catch (error) {
    console.error('Error parsing customer data:', error);
    return null;
  }
}

// Check if admin is logged in
export function isAdminLoggedIn(): boolean {
  const adminData = getAdminData();
  const adminToken = localStorage.getItem('adminToken');
  return !!(adminData && adminToken && adminData.isActive);
}

// Check if customer is logged in
export function isCustomerLoggedIn(): boolean {
  const customerData = getCustomerData();
  const customerToken = localStorage.getItem('customerToken');
  return !!(customerData && customerToken && customerData.isActive);
}

// Logout admin
export function logoutAdmin(): void {
  localStorage.removeItem('adminData');
  localStorage.removeItem('adminToken');
  console.log('✅ Admin logged out');
}

// Logout customer
export function logoutCustomer(): void {
  localStorage.removeItem('customerData');
  localStorage.removeItem('customerToken');
  console.log('✅ Customer logged out');
}

// Get admin authentication headers for API calls
export function getAdminAuthHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  
  const adminData = getAdminData();
  if (!adminData) return {};
  
  return {
    'x-admin-id': adminData.id,
    'x-admin-email': adminData.email,
  };
}

// Create product with admin authentication
export async function createProduct(productData: {
  name: string;
  price: number;
  oldPrice?: number;
  description?: string;
  category: string;
  stock: number;
  imageUrl: string;
  tags?: string[];
  specifications?: Record<string, any>;
}) {
  const adminData = getAdminData();
  
  if (!adminData) {
    throw new Error('Admin authentication required');
  }

  const response = await fetch('/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-id': adminData.id,
    },
    body: JSON.stringify(productData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to create product');
  }

  return data;
}

// Get products with optional filtering
export async function getProducts(options?: {
  category?: string;
  adminId?: string;
  limit?: number;
  page?: number;
}) {
  const params = new URLSearchParams();
  
  if (options?.category) params.append('category', options.category);
  if (options?.adminId) params.append('adminId', options.adminId);
  if (options?.limit) params.append('limit', options.limit.toString());
  if (options?.page) params.append('page', options.page.toString());

  const response = await fetch(`/api/products?${params.toString()}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch products');
  }

  return data;
}

// Get products created by current admin
export async function getMyProducts() {
  const adminData = getAdminData();
  
  if (!adminData) {
    throw new Error('Admin authentication required');
  }

  return getProducts({ adminId: adminData.id });
} 