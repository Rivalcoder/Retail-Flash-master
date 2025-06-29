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

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Discover Amazing Products
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore our curated collection of premium products with exclusive deals and innovative features
        </p>
      </motion.div>

      {/* Live Notifications Section */}
      {showNotifications && notifications.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Flame className="h-5 w-5 text-purple-500 animate-pulse" />
              Live Updates & Hot Deals
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNotifications(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              Hide
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {notifications.slice(0, 6).map((notification) => (
                <motion.div
                  key={notification.id}
                  variants={notificationVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                  className={cn(
                    "relative overflow-hidden rounded-xl border-2 border-dashed p-4 cursor-pointer group hover:scale-105 transition-all duration-300",
                    notification.bgColor
                  )}
                  onClick={() => removeNotification(notification.id)}
                >
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  
                  <div className="relative flex items-center gap-3">
                    <div className={cn("p-2 rounded-lg", notification.bgColor)}>
                      <notification.icon className={cn("h-5 w-5", notification.color)} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-gray-900 dark:text-white">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {notification.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <Tag className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </div>
                  
                  {/* Pulse effect for flash sales */}
                  {notification.type === 'flash-sale' && (
                    <div className="absolute top-2 right-2 w-2 h-2 bg-yellow-500 rounded-full animate-ping" />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        {[
          { icon: Package, label: "Total Products", value: products.length },
          { icon: Star, label: "New Arrivals", value: products.filter(p => p.isNew).length },
          { icon: TrendingUp, label: "On Sale", value: products.filter(p => p.oldPrice).length },
          { icon: Zap, label: "Categories", value: categories.length - 1 }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg">
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex flex-col sm:flex-row gap-4 items-center justify-between"
      >
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="transition-all duration-300 hover:scale-105"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="transition-all duration-300"
          >
            Grid
          </Button>
          <Button
            variant={viewMode === "flashcards" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("flashcards")}
            className="transition-all duration-300"
          >
            Flashcards
          </Button>
        </div>
      </motion.div>

      {/* Products Grid */}
      {viewMode === "grid" && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              className="group relative"
            >
              {/* Product Notification Badge */}
              {notifications.some(n => n.productId === product.id) && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 500, 
                    damping: 30,
                    delay: index * 0.1 
                  }}
                  className="absolute -top-2 -right-2 z-10"
                >
                  <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-pulse">
                    HOT
                  </div>
                </motion.div>
              )}

              <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 group-hover:scale-105">
                <CardHeader className="p-0 relative">
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {product.isNew && (
                        <Badge className="bg-green-500 hover:bg-green-600 animate-pulse">
                          New
                        </Badge>
                      )}
                      {product.oldPrice && (
                        <Badge variant="destructive" className="animate-bounce">
                          Sale
                        </Badge>
                      )}
                      {product.stock <= 10 && product.stock > 0 && (
                        <Badge className="bg-orange-500 hover:bg-orange-600 animate-pulse">
                          {product.stock} Left
                        </Badge>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="w-8 h-8 p-0 rounded-full bg-white/90 hover:bg-white"
                        onClick={() => toggleFavorite(product.id)}
                      >
                        <Heart 
                          className={cn(
                            "h-4 w-4 transition-colors",
                            favorites.has(product.id) ? "fill-red-500 text-red-500" : "text-gray-600"
                          )} 
                        />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="w-8 h-8 p-0 rounded-full bg-white/90 hover:bg-white"
                      >
                        <Eye className="h-4 w-4 text-gray-600" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {product.category}
                      </Badge>
                      <div className="flex items-center text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-current" />
                        ))}
                      </div>
                    </div>
                    
                    <CardTitle className="text-lg font-bold leading-tight group-hover:text-purple-600 transition-colors">
                      {product.name}
                    </CardTitle>
                    
                    {product.tagline && (
                      <p className="text-sm text-purple-600 font-medium italic">
                        "{product.tagline}"
                      </p>
                    )}
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center justify-between pt-2">
                      <div className="space-y-1">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          ₹{product.price.toLocaleString()}
                        </div>
                        {product.oldPrice && (
                          <div className="text-sm text-gray-500 line-through">
                            ₹{product.oldPrice.toLocaleString()}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <Package className="mr-1 h-4 w-4" />
                        {product.stock}
                      </div>
                    </div>
                    
                    <Button className="w-full mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 group-hover:scale-105">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Flashcards View */}
      {viewMode === "flashcards" && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              variants={flashcardVariants}
              whileHover="hover"
              className="group perspective-1000 relative"
            >
              {/* Product Notification Badge for Flashcards */}
              {notifications.some(n => n.productId === product.id) && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 500, 
                    damping: 30,
                    delay: index * 0.1 
                  }}
                  className="absolute -top-2 -right-2 z-10"
                >
                  <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-pulse">
                    HOT
                  </div>
                </motion.div>
              )}

              <Card className="relative h-96 overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 transform-style-preserve-3d">
                {/* Front of Card */}
                <div className="absolute inset-0 backface-hidden">
                  <div className="relative h-full">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className="bg-white/20 backdrop-blur-sm">
                          {product.category}
                        </Badge>
                        {product.isNew && (
                          <Badge className="bg-green-500 animate-pulse">
                            New
                          </Badge>
                        )}
                      </div>
                      
                      <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                      
                      {product.tagline && (
                        <p className="text-sm text-purple-200 font-medium mb-3 italic">
                          "{product.tagline}"
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold">
                          ₹{product.price.toLocaleString()}
                        </div>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="bg-white/20 backdrop-blur-sm hover:bg-white/30"
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Back of Card */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-purple-600 to-blue-600 p-6 flex flex-col justify-center text-white">
                  <div className="text-center space-y-4">
                    <h3 className="text-xl font-bold">{product.name}</h3>
                    <p className="text-sm text-purple-100">{product.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Price:</span>
                        <span className="font-bold">₹{product.price.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Stock:</span>
                        <span>{product.stock} units</span>
                      </div>
                      {product.oldPrice && (
                        <div className="flex justify-between">
                          <span>Original:</span>
                          <span className="line-through">₹{product.oldPrice.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                    
                    <Button className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
