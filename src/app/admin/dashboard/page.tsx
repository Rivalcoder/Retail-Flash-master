"use client";

import { useState, useTransition, useEffect } from "react";
import AdminPanel from "@/components/admin-panel";
import PromoGenerator from "@/components/promo-generator";
import QAndABot from "@/components/q-and-a-bot";
import CustomerPreview from "@/components/customer-preview";
import { initialProducts } from "@/lib/mock-data";
import type { Product } from "@/lib/types";
import { getAdminData, isAdminLoggedIn, logoutAdmin, getAdminAuthHeaders } from "@/lib/auth-utils";
import {
  Bot,
  Sparkles,
  Shield,
  User,
  LogOut,
  Package,
  Eye,
  ExternalLink,
  Menu,
} from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import InventoryPage from "@/components/inventory-page";

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [updatedIds, setUpdatedIds] = useState<string[]>([]);
  const [activeSection, setActiveSection] = useState("inventory");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [adminData, setAdminData] = useState<any>(null);
  const { toast } = useToast();
  const router = useRouter();

  // Set client flag to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load admin data on client side
  useEffect(() => {
    if (isClient) {
      // Try to get admin data multiple times to ensure it's loaded
      const loadAdminData = () => {
        const data = getAdminData();
        if (data) {
          setAdminData(data);
        } else {
          // Retry after a short delay if data is not available
          setTimeout(() => {
            const retryData = getAdminData();
            if (retryData) {
              setAdminData(retryData);
            }
          }, 50);
        }
      };
      
      loadAdminData();
    }
  }, [isClient]);

  // Load products from Pathway API first, then fallback to database on mount
  useEffect(() => {
    let isMounted = true;
    const loadProducts = async (showLoading = false) => {
      if (showLoading) setIsLoadingProducts(true);
      let productsData = [];
      try {
        const pathwayRes = await fetch('https://rivalcoder-pathway.hf.space/products');
        if (pathwayRes.ok) {
          const data = await pathwayRes.json();
          productsData = Array.isArray(data) ? data : data.products || [];
        } else {
          throw new Error('Pathway API not ok');
        }
      } catch (err) {
        try {
          const response = await fetch('/api/products');
          if (response.ok) {
            const data = await response.json();
            productsData = data.products || [];
          } else {
            console.error('Failed to load products from local DB:', response.statusText);
          }
        } catch (error) {
          console.error('Failed to load products from both Pathway API and local DB:', error);
        }
      } finally {
        if (isMounted) setProducts(productsData);
        if (isMounted && showLoading) setIsLoadingProducts(false);
      }
    };

    if (isClient && adminData && isAdminLoggedIn()) {
      loadProducts(true); // Only fetch once on mount
    }
    return () => {
      isMounted = false;
    };
  }, [isClient, adminData]);
  
  // Handle authentication check on mount - with delay to allow localStorage to be ready
  useEffect(() => {
    if (isClient) {
      // Add a small delay to ensure localStorage is properly loaded
      const timer = setTimeout(() => {
        const currentAdminData = getAdminData();
        if (!currentAdminData || !isAdminLoggedIn()) {
          router.push('/admin/login');
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isClient, router]);

  // Listen for sidebar toggle events from the layout
  useEffect(() => {
    const handleSidebarToggle = () => {
      setSidebarOpen(prev => !prev);
    };

    // Listen for custom events
    window.addEventListener('toggle-sidebar', handleSidebarToggle);
    
    // Also listen for localStorage changes
    const handleStorageChange = () => {
      const isOpen = localStorage.getItem('sidebar-open') === 'true';
      setSidebarOpen(isOpen);
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Check initial state
    const initialSidebarState = localStorage.getItem('sidebar-open');
    if (initialSidebarState !== null) {
      setSidebarOpen(initialSidebarState === 'true');
    }

    return () => {
      window.removeEventListener('toggle-sidebar', handleSidebarToggle);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Manual refresh handler
  const handleManualRefresh = async () => {
    setIsLoadingProducts(true);
    let productsData = [];
    try {
      const pathwayRes = await fetch('https://rivalcoder-pathway.hf.space/products');
      if (pathwayRes.ok) {
        const data = await pathwayRes.json();
        productsData = Array.isArray(data) ? data : data.products || [];
      } else {
        throw new Error('Pathway API not ok');
      }
    } catch (err) {
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          productsData = data.products || [];
        } else {
          console.error('Failed to load products from local DB:', response.statusText);
        }
      } catch (error) {
        console.error('Failed to load products from both Pathway API and local DB:', error);
      }
    } finally {
      setProducts(productsData);
      setIsLoadingProducts(false);
    }
  };

  // Don't render anything until client-side hydration is complete
  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Wait for admin data to be loaded before checking authentication
  if (isClient && adminData === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading authentication...</p>
        </div>
      </div>
    );
  }

  // Check admin authentication after client-side hydration and data loading
  if (!adminData || !isAdminLoggedIn()) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Show loading while products are being loaded
  if (isLoadingProducts) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logoutAdmin();
    router.push('/admin/login');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const handleCatalogUpdate = async (file: File) => {
    startTransition(async () => {
      try {
        const text = await file.text();
        const newProductsData = JSON.parse(text);
        const authHeaders = getAdminAuthHeaders();
        if (!authHeaders['x-admin-id']) {
          throw new Error('Admin authentication required. Please log in again.');
        }
        // Upload to database via API
        const response = await fetch('/api/products/upload-json', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...authHeaders,
          },
          body: JSON.stringify(newProductsData),
        });
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error || 'Failed to upload products');
        }
        // Only append products that are truly new (not already in the list)
        setProducts(prev => [
          ...prev,
          ...newProductsData.filter((p: any) => !prev.some(prod => prod.id === p.id))
        ]);
        // Process AI promo generation for new/updated products
        const productsNeedingPromo = result.results
          .filter((r: any) => r.status === 'created' || r.status === 'updated')
          .map((r: any) => ({
            ...newProductsData.find((p: any) => p.id === r.id),
            _id: r._id // Add the MongoDB _id from the result
          }))
          .filter(Boolean);

        console.log('Products needing promo generation:', productsNeedingPromo);

        const generationPromises: Promise<void>[] = [];
        const justUpdatedIds: string[] = [];

        for (const productData of productsNeedingPromo) {
          console.log('Generating promo for product:', productData.name);
          justUpdatedIds.push(productData.id);
          const promise = fetch('/api/promo/generate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: productData.name,
              price: productData.price,
              oldPrice: productData.oldPrice || productData.price,
              description: productData.description || "",
            }),
          }).then(async (response) => {
            const result = await response.json();
            console.log('Generated promo copy for', productData.name, ':', result.promoCopy);
            
            // Update the product with generated promo copy using MongoDB _id
            return fetch(`/api/products/${productData._id}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                ...authHeaders,
              },
              body: JSON.stringify({ promoCopy: result.promoCopy }),
            }).then(() => {
              console.log('Updated product with promo copy:', productData.name);
              // Return void to match expected Promise<void>
            });
          }).catch(err => {
            console.error(`Failed to generate promo copy for ${productData.name}`, err);
          });
          generationPromises.push(promise);
        }

        console.log('Waiting for all promo generation to complete...');
        await Promise.all(generationPromises);
        console.log('All promo generation completed');

        setUpdatedIds(justUpdatedIds);

        toast({
          title: "Catalog Updated Successfully",
          description: `Processed ${result.summary.total} products. ${result.summary.added} added, ${result.summary.updated} updated. AI promo copy generated.`,
        });

        setTimeout(() => setUpdatedIds([]), 3000);
      } catch (error) {
        console.error("Failed to update catalog:", error);
        toast({
          variant: "destructive",
          title: "Update Failed",
          description: error instanceof Error ? error.message : "Could not process the JSON file.",
        });
      }
    });
  };

  // Handler to update promo copy for a product
  const handleUpdatePromoCopy = async (productId: string, promoCopy: string) => {
    try {
      const authHeaders = getAdminAuthHeaders();
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify({ promoCopy }),
      });
      if (!response.ok) throw new Error('Failed to update promo copy');
      // Only update local state, do not re-fetch from backend
      setProducts(prev => prev.map(p => p._id === productId ? { ...p, promoCopy } : p));
    } catch (err) {
      console.error('Error updating promo copy:', err);
    }
  };

  // Handler to generate promo copy for a product
  const handleGeneratePromoCopy = async (productId: string) => {
    try {
      const product = products.find(p => p._id === productId);
      if (!product) throw new Error('Product not found');
      const authHeaders = getAdminAuthHeaders();
      const response = await fetch('/api/promo/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify({
          name: product.name,
          price: product.price,
          oldPrice: product.oldPrice || product.price,
          description: product.description || '',
        }),
      });
      if (!response.ok) throw new Error('Failed to generate promo copy');
      const data = await response.json();
      // Immediately update local state with new promo copy
      setProducts(prev => prev.map(p => p._id === productId ? { ...p, promoCopy: data.promoCopy } : p));
      return data.promoCopy;
    } catch (err) {
      console.error('Error generating promo copy:', err);
      throw err;
    }
  };

  const navItems = [
    { id: "inventory", icon: Package, label: "Inventory", color: "from-green-500 to-emerald-600" },
    { id: "promo-generator", icon: Sparkles, label: "Promo", color: "from-purple-500 to-pink-600" },
    { id: "q-and-a-bot", icon: Bot, label: "Q&A Bot", color: "from-emerald-500 to-teal-600" },
    { id: "customer-preview", icon: Eye, label: "Customer Preview", color: "from-amber-500 to-orange-600" },
    { id: "admin", icon: Shield, label: "Admin", color: "from-orange-500 to-red-600" },
  ];
  
  return (
    <div className="flex h-full">
      {/* Sidebar Navigation */}
      <div
        className={`bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 p-2 flex flex-col items-center overflow-y-auto z-40 transition-all duration-300
          ${sidebarOpen ? 'w-64 px-6' : 'w-16 px-2'}
        `}
      >
        {/* Sidebar Header and Toggle */}
        <div className={`flex items-center justify-between w-full mb-8 ${sidebarOpen ? '' : 'flex-col mb-4'}`}>
          {sidebarOpen && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Admin Panel</h2>
              {/* <p className="text-sm text-slate-600 dark:text-slate-400">Manage your retail operations</p> */}
            </div>
          )}
          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label={sidebarOpen ? 'Minimize sidebar' : 'Expand sidebar'}
          >
            <span className="sr-only">Toggle sidebar</span>
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 w-full flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`group relative flex items-center ${sidebarOpen ? 'gap-3 px-4 py-3' : 'justify-center p-3'} w-full rounded-xl transition-all duration-300 hover:scale-[1.02] ${
                  isActive
                    ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                <Icon className={`h-5 w-5 transition-all duration-300 ${
                  isActive ? 'text-white' : 'group-hover:scale-110'
                }`} />
                <span
                  className={`
                    font-medium text-[16px]
                    transition-all duration-300 ease-in-out
                    ${isActive ? 'text-white' : ''}
                    ${sidebarOpen ? 'opacity-100 ml-2 max-w-[160px] pr-2' : 'opacity-0 ml-0 max-w-0 pr-0'}
                    overflow-hidden whitespace-nowrap align-middle
                  `}
                  style={{
                    transitionProperty: 'opacity, margin, max-width, padding, color',
                    display: 'inline-block',
                    verticalAlign: 'middle',
                  }}
                >
                  {item.label}
                </span>
                {isActive && sidebarOpen && (
                  <div className="absolute right-3 w-2 h-2 bg-white rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className={`pt-4 border-t border-slate-200 dark:border-slate-700 w-full ${sidebarOpen ? 'mt-8' : 'mt-4'}`}>
          <button
            onClick={handleLogout}
            className={`flex items-center ${sidebarOpen ? 'gap-3 px-4 py-3' : 'justify-center p-3'} w-full rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300`}
          >
            <LogOut className="h-5 w-5" />
            {sidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full p-8 overflow-y-auto">
          {activeSection === "inventory" && (
            <div className="w-full max-w-none">
              <InventoryPage />
            </div>
          )}
          {activeSection === "promo-generator" && (
            <PromoGenerator
              products={products}
              onUpdatePromoCopy={handleUpdatePromoCopy}
              onGeneratePromoCopy={handleGeneratePromoCopy}
            />
          )}
          {activeSection === "q-and-a-bot" && (
          <QAndABot products={products} />
          )}
          {activeSection === "customer-preview" && (
            <div className="w-full max-w-none">
              <CustomerPreview products={products} />
            </div>
          )}
          {activeSection === "admin" && (
          <div className="w-full max-w-none">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-green-700">Admin Product Catalog</h2>
              <div className="flex items-center gap-2 text-sm text-gray-100">
                <span>{products.length} products</span>
                <ExternalLink className="h-4 w-4" />
              </div>
            </div>
            <AdminPanel onUpdate={handleCatalogUpdate} isPending={isPending} />
          </div>
          )}
        </div>
      </div>
    </div>
  );
}
