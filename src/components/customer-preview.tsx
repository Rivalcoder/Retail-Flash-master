"use client";

import { useState, useEffect } from "react";
import { Store, User, ShoppingCart, Heart, Star, Eye, ExternalLink } from "lucide-react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import type { Product } from "@/lib/types";
import { ThemeToggle } from "@/components/theme-toggle";
import Dashboard from "@/components/dashboard";

const demoCategories = [
  { name: 'Electronics', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80' },
  { name: 'Fashion', image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400&q=80' },
  { name: 'Home', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&q=80' },
  { name: 'Fitness', image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=400&q=80' },
  { name: 'Toys', image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=400&q=80' },
  { name: 'Beauty', image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=400&q=80' },
];

interface CustomerPreviewProps {
  products: Product[];
}

export default function CustomerPreview({ products }: CustomerPreviewProps) {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  // Sync cart/wishlist counts from localStorage
  useEffect(() => {
    const syncCounts = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartCount(cart.reduce((sum: any, item: any) => sum + item.quantity, 0));
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setWishlistCount(wishlist.length);
    };
    syncCounts();
    window.addEventListener('storage', syncCounts);
    return () => window.removeEventListener('storage', syncCounts);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex flex-col">
      {/* Preview Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-blue-700 font-bold text-lg">
                <Store className="h-6 w-6" /> Retail Flash
              </div>
              
              {/* Preview Badge */}
              <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 dark:bg-amber-900/20 rounded-full border border-amber-200 dark:border-amber-700">
                <Eye className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
                  Customer Preview
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
              
              <button className="relative p-2 text-gray-600 hover:text-red-600 transition-colors">
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>
              
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Carousel */}
      <section className="w-full relative">
        <Swiper slidesPerView={1} loop autoplay className="h-72 md:h-96">
          <SwiperSlide>
            <div className="h-72 md:h-96 flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white relative">
              <img src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1200&q=80" alt="Fashion" className="absolute inset-0 w-full h-full object-cover opacity-40" />
              <div className="relative z-10 text-center">
                <h1 className="text-3xl md:text-5xl font-bold mb-4">Biggest Fashion Sale</h1>
                <p className="mb-6 text-lg">Up to 70% OFF on top brands. Limited time only!</p>
                <div className="px-6 py-3 rounded-full bg-white text-blue-700 font-semibold shadow">Shop Now</div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="h-72 md:h-96 flex items-center justify-center bg-gradient-to-r from-pink-600 to-yellow-500 text-white relative">
              <img src="https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=1200&q=80" alt="Fitness" className="absolute inset-0 w-full h-full object-cover opacity-40" />
              <div className="relative z-10 text-center">
                <h1 className="text-3xl md:text-5xl font-bold mb-4">Fitness Essentials</h1>
                <p className="mb-6 text-lg">Gear up for your goals. Exclusive deals on fitness products.</p>
                <div className="px-6 py-3 rounded-full bg-white text-pink-700 font-semibold shadow">Explore</div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </section>

      {/* Category Cards */}
      <section className="container py-8" id="categories">
        <h2 className="text-2xl font-bold mb-6 text-blue-700">Shop by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
          {demoCategories.map(cat => (
            <div key={cat.name} className="group relative rounded-2xl overflow-hidden shadow hover:shadow-lg cursor-pointer transition-all">
              <img src={cat.image} alt={cat.name} className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              <div className="absolute bottom-2 left-2 text-white font-bold text-lg drop-shadow-lg">{cat.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Admin Products Showcase */}
      <section className="container py-8" id="admin-products">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-green-700">Admin Product Catalog</h2>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>{products.length} products</span>
            <ExternalLink className="h-4 w-4" />
          </div>
        </div>
        
        {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Store className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Products Available</h3>
            <p className="text-gray-500">Add products to your catalog to see them here.</p>
          </div>
        ) : (
          <Dashboard products={products} updatedIds={[]} />
        )}
      </section>

      {/* Product Statistics */}
      <section className="container py-8">
        <h2 className="text-2xl font-bold mb-6 text-indigo-700">Catalog Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
                <Store className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Products</p>
                <p className="text-2xl font-bold text-blue-700">{products.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-xl">
                <Star className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">With Promo Copy</p>
                <p className="text-2xl font-bold text-green-700">
                  {products.filter(p => p.promoCopy).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-xl">
                <ShoppingCart className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">On Sale</p>
                <p className="text-2xl font-bold text-purple-700">
                  {products.filter(p => p.oldPrice && p.oldPrice > p.price).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-xl">
                <User className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Categories</p>
                <p className="text-2xl font-bold text-orange-700">
                  {new Set(products.map(p => p.category)).size}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 