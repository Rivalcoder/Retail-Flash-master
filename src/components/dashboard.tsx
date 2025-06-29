"use client";

import { useState, useEffect } from "react";
import type { Product } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Image from "next/image";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { 
  Package, 
  Star, 
  TrendingUp, 
  Zap, 
  Heart,
  ShoppingCart,
  Eye,
  ArrowRight,
  Flame,
  Clock,
  Tag,
  TrendingDown,
  AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

interface DashboardProps {
  products: Product[];
  updatedIds: string[];
}

interface Notification {
  id: string;
  type: 'stock-update' | 'price-drop' | 'new-product' | 'hot-deal' | 'flash-sale';
  productId: string;
  message: string;
  icon: any;
  color: string;
  bgColor: string;
  timestamp: Date;
}

export default function Dashboard({ products, updatedIds }: DashboardProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"grid" | "flashcards">("flashcards");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(true);

  const categories = ["All", ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = selectedCategory === "All" 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  // Generate notifications based on product updates
  useEffect(() => {
    const newNotifications: Notification[] = [];
    
    products.forEach(product => {
      // New product notifications
      if (product.isNew) {
        newNotifications.push({
          id: `new-${product.id}`,
          type: 'new-product',
          productId: product.id,
          message: `New Arrival: ${product.name}`,
          icon: Zap,
          color: 'text-green-600',
          bgColor: 'bg-green-100 dark:bg-green-900/20',
          timestamp: new Date()
        });
      }

      // Price drop notifications
      if (product.oldPrice && product.price < product.oldPrice) {
        const discount = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
        newNotifications.push({
          id: `price-${product.id}`,
          type: 'price-drop',
          productId: product.id,
          message: `${discount}% OFF - ${product.name}`,
          icon: TrendingDown,
          color: 'text-red-600',
          bgColor: 'bg-red-100 dark:bg-red-900/20',
          timestamp: new Date()
        });
      }

      // Low stock notifications
      if (product.stock <= 10 && product.stock > 0) {
        newNotifications.push({
          id: `stock-${product.id}`,
          type: 'stock-update',
          productId: product.id,
          message: `Only ${product.stock} left - ${product.name}`,
          icon: AlertTriangle,
          color: 'text-orange-600',
          bgColor: 'bg-orange-100 dark:bg-orange-900/20',
          timestamp: new Date()
        });
      }

      // Hot deals for products with high stock and good prices
      if (product.stock > 50 && product.price < 2000) {
        newNotifications.push({
          id: `hot-${product.id}`,
          type: 'hot-deal',
          productId: product.id,
          message: `Hot Deal: ${product.name}`,
          icon: Flame,
          color: 'text-purple-600',
          bgColor: 'bg-purple-100 dark:bg-purple-900/20',
          timestamp: new Date()
        });
      }
    });

    // Add some flash sale notifications
    const flashSaleProducts = products.filter(p => p.oldPrice && p.price < p.oldPrice).slice(0, 2);
    flashSaleProducts.forEach(product => {
      newNotifications.push({
        id: `flash-${product.id}`,
        type: 'flash-sale',
        productId: product.id,
        message: `⚡ Flash Sale: ${product.name}`,
        icon: Clock,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
        timestamp: new Date()
      });
    });

    setNotifications(newNotifications);
  }, [products]);

  const toggleFavorite = (productId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
    } else {
      newFavorites.add(productId);
    }
    setFavorites(newFavorites);
  };

  const removeNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const flashcardVariants = {
    hidden: { scale: 0.8, opacity: 0, rotateY: -90 },
    visible: {
      scale: 1,
      opacity: 1,
      rotateY: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.05,
      rotateY: 5,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const notificationVariants = {
    hidden: { x: -100, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: { 
      x: 100, 
      opacity: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  // --- Offer/Deal Carousel Data ---
  const offerProducts = notifications.filter(n => n.type === 'flash-sale' || n.type === 'price-drop').map(n => products.find(p => p.id === n.productId)).filter(Boolean);

  return (
    <div className="space-y-8">
      {/* Offer/Deal Carousel */}
      {/* {offerProducts.length > 0 && (
        <div className="w-full max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-left text-blue-700">Hot Deals & Offers</h2>
          <Swiper slidesPerView={1.2} spaceBetween={16} breakpoints={{ 640: { slidesPerView: 2.2 }, 1024: { slidesPerView: 3.2 } }}>
            {offerProducts.map((product: Product, idx: number) => (
              <SwiperSlide key={product.id + '-' + idx}>
                <div className="relative bg-gradient-to-br from-yellow-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg p-4 flex flex-col items-center group h-full">
                  <div className="relative w-40 h-40 mb-4">
                    <Image src={product.image} alt={product.name} fill className="object-cover rounded-xl group-hover:scale-105 transition-transform duration-300" />
                    {product.oldPrice && product.price < product.oldPrice && (
                      <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF</span>
                    )}
          </div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white mb-1">{product.name}</div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl font-bold text-blue-700">₹{product.price.toLocaleString()}</span>
                    {product.oldPrice && (
                      <span className="text-sm text-gray-500 line-through">₹{product.oldPrice.toLocaleString()}</span>
                    )}
                  </div>
                  <Button className="w-full mt-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">Shop Now</Button>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          </div>
      )} */}

      {/* Category Bar */}
      <div className="w-full overflow-x-auto pb-2">
        <div className="flex gap-2 min-w-max">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="rounded-full px-5 py-2 whitespace-nowrap shadow-sm border-2 border-blue-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
            >
              {category}
            </Button>
          ))}
        </div>
        </div>

      {/* Products Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
        >
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
            className="relative group bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-800 flex flex-col"
          >
            {/* Offer/Discount Badge */}
            {product.oldPrice && product.price < product.oldPrice && (
              <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow z-10">{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF</span>
            )}
            {/* Wishlist Icon */}
            <button
                        onClick={() => toggleFavorite(product.id)}
              className="absolute top-4 right-4 z-10 bg-white/80 dark:bg-gray-800/80 rounded-full p-2 shadow hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-colors"
              title={favorites.has(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart className={cn("h-5 w-5 transition-colors", favorites.has(product.id) ? "fill-red-500 text-red-500" : "text-gray-400")}/>
            </button>
            {/* Product Image */}
            <div className="relative w-full h-48 flex-shrink-0 rounded-t-2xl overflow-hidden">
              <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
            {/* Product Info */}
            <div className="flex-1 flex flex-col p-5 gap-2">
                    <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-200 border-blue-200 dark:border-blue-700">{product.category}</Badge>
                      <div className="flex items-center text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-current" />
                        ))}
                      </div>
                    </div>
              <CardTitle className="text-lg font-bold leading-tight group-hover:text-blue-700 transition-colors">{product.name}</CardTitle>
                    {product.tagline && (
                <p className="text-xs text-blue-600 dark:text-blue-200 font-medium italic">{product.tagline}</p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{product.description}</p>
              <div className="flex items-end gap-2 mt-2">
                <span className="text-xl font-bold text-blue-700">₹{product.price.toLocaleString()}</span>
                      {product.oldPrice && (
                  <span className="text-sm text-gray-400 line-through">₹{product.oldPrice.toLocaleString()}</span>
                      )}
                    </div>
              <Button className="w-full mt-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">Add to Cart <ShoppingCart className="ml-2 h-4 w-4" /></Button>
                </div>
            </motion.div>
          ))}
        </motion.div>
    </div>
  );
}
