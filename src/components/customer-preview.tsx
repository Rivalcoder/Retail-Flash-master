"use client";

import { useState, useEffect } from "react";
import { Store, User, ShoppingCart, Heart, Star, Eye, ExternalLink, Sparkles } from "lucide-react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import type { Product } from "@/lib/types";
import { ThemeToggle } from "@/components/theme-toggle";
import Dashboard from "@/components/dashboard";

const demoCategories = [
  { name: 'Electronics', image: 'https://as1.ftcdn.net/v2/jpg/02/57/16/84/1000_F_257168460_AwhicdEIavp7bdCbHXyTaBTHnBoBcZad.jpg' },
  { name: 'Fashion', image: 'https://as2.ftcdn.net/v2/jpg/01/41/72/83/1000_F_141728316_rqGLy0W6NJ4KuG0s3bRsNFO5Ot6M6Kuo.jpg' },
  { name: 'Home', image: 'https://media.newhomeinc.com/348/2022/11/30/The-Apex-Georgian-Elevation-1.jpeg?width=1920&height=1280&fit=bounds&ois=db08613' },
  { name: 'Fitness', image: 'https://i.etsystatic.com/29035216/r/il/7e7e20/3640388699/il_1588xN.3640388699_sg0x.jpg' },
  { name: 'Toys', image: 'https://plus.unsplash.com/premium_photo-1684980182025-cdc9629e32db?q=80&w=747&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { name: 'Beauty', image: 'https://plus.unsplash.com/premium_photo-1677526496597-aa0f49053ce2?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
];

interface CustomerPreviewProps {
  products: Product[];
}

export default function CustomerPreview({ products }: CustomerPreviewProps) {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  // Debug logging
  useEffect(() => {
    console.log('Products with promo copy:', products.filter(p => p.promoCopy).length);
    console.log('All products:', products.length);
    products.forEach((product, index) => {
      console.log(`Product ${index}:`, product.name, 'Image:', product.image);
    });
  }, [products]);

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

            </div>
          </div>
        </div>
      </header>

      {/* Hero Carousel */}
      <section className="w-full relative">
        <Swiper
          slidesPerView={1}
          modules={[Autoplay]}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          className="h-72 md:h-96"
        >
          {products.filter(p => p.promoCopy).slice(0, 3).map((product, index) => (
            <SwiperSlide key={product.id || index}>
              <div className="h-72 md:h-96 flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white relative">
                <img 
                  src={product.imageUrl || product.image || `https://images.unsplash.com/photo-${1500000000000 + index}?w=1200&q=80`} 
                  alt={product.name} 
                  className="absolute inset-0 w-full h-full object-cover opacity-40"
                  onError={(e) => {
                    console.log('Image failed to load:', product.imageUrl || product.image);
                    e.currentTarget.src = `https://images.unsplash.com/photo-${1500000000000 + index}?w=1200&q=80`;
                  }}
                />
                <div className="relative z-10 text-center">
                  <h1 className="text-3xl md:text-5xl font-bold mb-4">{product.name}</h1>
                  <p className="mb-6 text-lg">{product.promoCopy && product.promoCopy.replace(/\*\*/g, "")}</p>
                  <div className="px-6 py-3 rounded-full bg-white text-blue-700 font-semibold shadow">Shop Now</div>
                </div>
              </div>
            </SwiperSlide>
          ))}
          
          {/* Show some products even if they don't have promo copy */}
          {products.filter(p => p.promoCopy).length === 0 && products.length > 0 && (
            products.slice(0, 3).map((product, index) => (
              <SwiperSlide key={product.id || index}>
                <div className="h-72 md:h-96 flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white relative">
                  <img 
                    src={product.imageUrl || product.image || `https://images.unsplash.com/photo-${1500000000000 + index}?w=1200&q=80`} 
                    alt={product.name} 
                    className="absolute inset-0 w-full h-full object-cover opacity-40"
                    onError={(e) => {
                      console.log('Image failed to load:', product.imageUrl || product.image);
                      e.currentTarget.src = `https://images.unsplash.com/photo-${1500000000000 + index}?w=1200&q=80`;
                    }}
                  />
                  <div className="relative z-10 text-center">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">{product.name}</h1>
                    <p className="mb-6 text-lg">Discover amazing products and exclusive deals</p>
                    <div className="px-6 py-3 rounded-full bg-white text-blue-700 font-semibold shadow">Shop Now</div>
                  </div>
                </div>
              </SwiperSlide>
            ))
          )}
          
          {/* Final fallback slide if no products at all */}
          {products.length === 0 && (
            <SwiperSlide className="rounded-md">
              <div className="h-72 md:h-96 flex  items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white relative">
                <img 
                  src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1200&q=80" 
                  alt="Retail Flash" 
                  className="absolute inset-0 w-full h-full object-cover opacity-40"
                  onError={(e) => {
                    console.log('Fallback image failed to load');
                    e.currentTarget.src = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80";
                  }}
                />
                <div className="relative z-10 text-center">
                  <h1 className="text-3xl md:text-5xl font-bold mb-4">Welcome to Retail Flash</h1>
                  <p className="mb-6 text-lg">Discover amazing products and exclusive deals</p>
                  <div className="px-6 py-3 rounded-full bg-white text-blue-700 font-semibold shadow">Explore Products</div>
                </div>
              </div>
            </SwiperSlide>
          )}
        </Swiper>
      </section>

      {/* Category Cards */}
      <section className="container py-8" id="categories">
        <h2 className="text-2xl font-bold mb-6 text-black-700">Shop by Category</h2>
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
          <h2 className="text-2xl font-bold text-black-700">Admin Product Catalog</h2>
          <div className="flex items-center gap-2 text-sm text-gray-900 dark:text-gray-100">
            <span>Products : {products.length}</span>
            {/* <ExternalLink className="h-4 w-4" /> */}
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
        <h2 className="text-2xl font-bold mb-6 text-black-700">Catalog Statistics</h2>
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