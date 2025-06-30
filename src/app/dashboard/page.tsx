"use client";

import { useState, useEffect } from "react";
import Dashboard from "@/components/dashboard";
import { initialProducts } from "@/lib/mock-data";
import type { Product } from "@/lib/types";
import { getCustomerData, isCustomerLoggedIn, logoutCustomer } from "@/lib/auth-utils";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { ShoppingCart, User, Home, Tag, Gift, Heart, Star, ChevronRight, LogOut, Store, Sparkles } from "lucide-react";
import CartDrawer from '@/components/CartDrawer';
import WishlistDrawer from '@/components/WishlistDrawer';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { useRouter } from "next/navigation";

const demoCategories = [
  { name: 'Electronics', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80' },
  { name: 'Fashion', image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400&q=80' },
  { name: 'Home', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&q=80' },
  { name: 'Fitness', image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=400&q=80' },
  { name: 'Toys', image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=400&q=80' },
  { name: 'Beauty', image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=400&q=80' },
];

export default function CustomerDashboardPage() {
  const [products] = useState<Product[]>(initialProducts);
  const updatedIds: string[] = [];
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [customerData, setCustomerData] = useState<any>(null);
  const router = useRouter();

  // Check authentication on component mount
  useEffect(() => {
    if (!isCustomerLoggedIn()) {
      router.push('/login');
      return;
    }

    const customer = getCustomerData();
    setCustomerData(customer);
  }, [router]);

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

  const handleLogout = () => {
    logoutCustomer();
    router.push('/login');
  };

  if (!customerData) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex flex-col">
      {/* Header with Customer Info */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-blue-700 font-bold text-lg">
                <Store className="h-6 w-6" /> Retail Flash
              </div>
              
              {/* Customer Info */}
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  {customerData.firstName} {customerData.lastName}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
              
              <button
                onClick={() => setWishlistOpen(true)}
                className="relative p-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>
              
              <ThemeToggle />
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm font-medium">Logout</span>
              </button>
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
                <Link href="#offers" className="px-6 py-3 rounded-full bg-white text-blue-700 font-semibold shadow hover:bg-blue-50 transition-all">Shop Now</Link>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="h-72 md:h-96 flex items-center justify-center bg-gradient-to-r from-pink-600 to-yellow-500 text-white relative">
              <img src="https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=1200&q=80" alt="Fitness" className="absolute inset-0 w-full h-full object-cover opacity-40" />
              <div className="relative z-10 text-center">
                <h1 className="text-3xl md:text-5xl font-bold mb-4">Fitness Essentials</h1>
                <p className="mb-6 text-lg">Gear up for your goals. Exclusive deals on fitness products.</p>
                <Link href="#offers" className="px-6 py-3 rounded-full bg-white text-pink-700 font-semibold shadow hover:bg-pink-50 transition-all">Explore</Link>
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

      {/* Offers/Deals Section */}
      <section className="container py-8" id="offers">
        <h2 className="text-2xl font-bold mb-6 text-pink-700">Top Deals & Flash Sales</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.slice(0, 4).map((product, i) => (
            <div key={product.id || i} className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-gray-100 dark:border-gray-800 flex flex-col">
              <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow z-10">{Math.round(Math.random()*50+10)}% OFF</span>
              <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-t-2xl" />
              <div className="flex-1 flex flex-col p-5 gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-200 border-blue-200 dark:border-blue-700">{product.category}</span>
                  <div className="flex items-center text-yellow-500">
                    {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 fill-current" />)}
                  </div>
                </div>
                <div className="text-lg font-bold leading-tight">{product.name}</div>
                <div className="flex items-end gap-2 mt-2">
                  <span className="text-xl font-bold text-blue-700">₹{product.price.toLocaleString()}</span>
                  {product.oldPrice && <span className="text-sm text-gray-400 line-through">₹{product.oldPrice.toLocaleString()}</span>}
                </div>
                <Link href="#" className="mt-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow hover:from-blue-700 hover:to-purple-700 transition-all text-center">Add to Cart</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recommended Products Section */}
      <section className="container py-8">
        <h2 className="text-2xl font-bold mb-6 text-purple-700">Recommended for You</h2>
        <Dashboard products={products.slice(4)} updatedIds={updatedIds} />
      </section>

      {/* Modern Footer */}
      <footer className="border-t py-6 mt-8 bg-white/80 dark:bg-gray-900/80">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-blue-700 font-bold text-lg">
            <Store className="h-6 w-6" /> Retail Flash
          </div>
          <div className="flex gap-4 text-sm text-gray-500">
            <Link href="#">About</Link>
            <Link href="#">Contact</Link>
            <Link href="#">Terms</Link>
            <Link href="#">Privacy</Link>
          </div>
          <div className="text-xs text-gray-400">&copy; {new Date().getFullYear()} Retail Flash. All rights reserved.</div>
        </div>
      </footer>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <WishlistDrawer open={wishlistOpen} onClose={() => setWishlistOpen(false)} />
    </div>
  );
}
