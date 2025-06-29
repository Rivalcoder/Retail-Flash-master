"use client";

import { useState } from "react";
import Dashboard from "@/components/dashboard";
import QAndABot from "@/components/q-and-a-bot";
import { initialProducts } from "@/lib/mock-data";
import type { Product } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, Bot, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function CustomerDashboardPage() {
  const [products] = useState<Product[]>(initialProducts);
  const updatedIds: string[] = [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="h-8 w-8 text-purple-600 mr-3 animate-pulse" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Retail Flash Dashboard
            </h1>
            <Sparkles className="h-8 w-8 text-blue-600 ml-3 animate-pulse" />
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your ultimate shopping companion with AI-powered recommendations and interactive product discovery
          </p>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs defaultValue="products" className="w-full">
            <TabsList className="grid w-full grid-cols-1 sm:w-auto sm:grid-cols-2 mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg">
              <TabsTrigger 
                value="products"
                className="flex items-center space-x-2 py-3 px-6 transition-all duration-300 hover:scale-105"
              >
                <LayoutDashboard className="h-5 w-5" />
                <span className="font-medium">Product Gallery</span>
              </TabsTrigger>
              <TabsTrigger 
                value="q-and-a-bot"
                className="flex items-center space-x-2 py-3 px-6 transition-all duration-300 hover:scale-105"
              >
                <Bot className="h-5 w-5" />
                <span className="font-medium">AI Assistant</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="products" className="mt-0">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Dashboard products={products} updatedIds={updatedIds} />
              </motion.div>
            </TabsContent>
            
            <TabsContent value="q-and-a-bot" className="mt-0">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg p-6"
              >
                <QAndABot products={products} />
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
