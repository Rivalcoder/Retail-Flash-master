"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Flame, Tag, Clock } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "@/lib/types";

interface ScrollableOfferCardsProps {
  products: Product[];
}

export default function ScrollableOfferCards({ products }: ScrollableOfferCardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter products for offers - items with oldPrice (discounted) or low stock (hot deals)
  const offerProducts = products.filter(product => 
    product.oldPrice || product.stock < 50
  ).slice(0, 8); // Limit to 8 items for better performance

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, offerProducts.length - 3));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? Math.max(0, offerProducts.length - 4) : prev - 1
    );
  };

  // Auto-scroll every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (offerProducts.length > 4) {
        nextSlide();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [offerProducts.length]);

  if (offerProducts.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-gradient-to-r from-orange-50 via-red-50 to-pink-50 dark:from-orange-900/20 dark:via-red-900/20 dark:to-pink-900/20 py-6">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Flame className="h-6 w-6 text-red-500" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                Hot Deals & Flash Offers
              </h2>
            </div>
            <div className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
              <Clock className="h-4 w-4" />
              <span>Limited Time</span>
            </div>
          </div>
          
          {/* Navigation Buttons */}
          {offerProducts.length > 4 && (
            <div className="flex gap-2">
              <button
                onClick={prevSlide}
                className="p-2 rounded-full bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 shadow-md transition-all"
                aria-label="Previous offers"
                title="Previous offers"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextSlide}
                className="p-2 rounded-full bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 shadow-md transition-all"
                aria-label="Next offers"
                title="Next offers"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        {/* Scrollable Cards Container */}
        <div className="relative overflow-hidden">
          <motion.div
            className="flex gap-4 transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / 4)}%)`,
            }}
          >
            {offerProducts.map((product, index) => {
              const discount = product.oldPrice 
                ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
                : 0;
              const isHotDeal = product.stock < 50;
              const isLessPrice = product.oldPrice && discount > 20;

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
                >
                  <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden group">
                    {/* Offer Badge */}
                    <div className="absolute top-3 left-3 z-10">
                      {isHotDeal && (
                        <div className="flex items-center gap-1 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                          <Flame className="h-3 w-3" />
                          <span>HOT DEAL</span>
                        </div>
                      )}
                      {isLessPrice && (
                        <div className="flex items-center gap-1 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                          <Tag className="h-3 w-3" />
                          <span>{discount}% OFF</span>
                        </div>
                      )}
                    </div>

                    {/* Stock Alert for Hot Deals */}
                    {isHotDeal && (
                      <div className="absolute top-3 right-3 z-10">
                        <div className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                          Only {product.stock} left!
                        </div>
                      </div>
                    )}

                    {/* Product Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-200 border border-blue-200 dark:border-blue-700">
                          {product.category}
                        </span>
                        {product.isNew && (
                          <span className="text-xs px-2 py-1 rounded-full bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-200 border border-green-200 dark:border-green-700">
                            NEW
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-lg leading-tight mb-2 text-gray-800 dark:text-gray-200">
                        {product.name}
                      </h3>

                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {product.description}
                      </p>

                      {/* Price Section */}
                      <div className="flex items-end gap-2 mb-3">
                        <span className="text-xl font-bold text-red-600 dark:text-red-400">
                          ₹{product.price.toLocaleString()}
                        </span>
                        {product.oldPrice && (
                          <span className="text-sm text-gray-400 line-through">
                            ₹{product.oldPrice.toLocaleString()}
                          </span>
                        )}
                      </div>

                      {/* Action Button */}
                      <button className="w-full px-4 py-2 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold shadow-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105">
                        {isHotDeal ? 'Grab Now!' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Dots Indicator */}
        {offerProducts.length > 4 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: Math.ceil(offerProducts.length / 4) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-red-500 w-6'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
                aria-label={`Go to slide ${index + 1}`}
                title={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
} 