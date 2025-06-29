"use client";

import { useState, useTransition, useEffect } from "react";
import { generatePromoCopy } from "@/ai/flows/promo-copy-generator";
import AdminPanel from "@/components/admin-panel";
import Dashboard from "@/components/dashboard";
import PromoGenerator from "@/components/promo-generator";
import QAndABot from "@/components/q-and-a-bot";
import { initialProducts } from "@/lib/mock-data";
import type { Product } from "@/lib/types";
import {
  Bot,
  LayoutDashboard,
  Sparkles,
  Shield,
} from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [updatedIds, setUpdatedIds] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { toast } = useToast();

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

  const handleCatalogUpdate = async (file: File) => {
    startTransition(async () => {
      try {
        const text = await file.text();
        const newProductsData: Omit<Product, 'promoCopy' | 'isNew' | 'oldPrice'>[] = JSON.parse(text);

        const currentProductsMap = new Map(
          products.map((p) => [p.id, p])
        );
        const allProductIds = new Set(newProductsData.map(p => p.id));
        
        let finalProducts: Product[] = products.filter(p => allProductIds.has(p.id));
        let finalProductsMap = new Map(finalProducts.map(p => [p.id, p]));

        const generationPromises: Promise<void>[] = [];
        const productUpdates: Product[] = [];
        const justUpdatedIds: string[] = [];

        for (const newProductData of newProductsData) {
          const oldProduct = finalProductsMap.get(newProductData.id);
          let productWithChanges: Product = { ...newProductData, promoCopy: oldProduct?.promoCopy };
          let needsPromoUpdate = false;

          if (!oldProduct) {
            productWithChanges.isNew = true;
            needsPromoUpdate = true;
          } else {
            productWithChanges = { ...oldProduct, ...newProductData };
            if (oldProduct.price !== newProductData.price) {
              productWithChanges.oldPrice = oldProduct.price;
              needsPromoUpdate = true;
            }
            if(oldProduct.description !== newProductData.description){
                needsPromoUpdate = true;
            }
          }

          if (needsPromoUpdate) {
            justUpdatedIds.push(productWithChanges.id);
            const promise = generatePromoCopy({
              productName: productWithChanges.name,
              oldPrice: productWithChanges.oldPrice || productWithChanges.price,
       
              newPrice: productWithChanges.price,
              description: productWithChanges.description || "",
            }).then((output) => {
                productWithChanges.promoCopy = output.promoCopy;
            }).catch(err => {
                console.error(`Failed to generate promo copy for ${productWithChanges.name}`, err);
                productWithChanges.promoCopy = "Failed to generate new promo copy.";
            });
            generationPromises.push(promise);
          }
          productUpdates.push(productWithChanges);
        }

        await Promise.all(generationPromises);

        setProducts(productUpdates);
        setUpdatedIds(justUpdatedIds);

        toast({
          title: "Catalog Updated",
          description: `Processed ${newProductsData.length} products. AI insights generated.`,
        });

        setTimeout(() => setUpdatedIds([]), 2000);
      } catch (error) {
        console.error("Failed to update catalog:", error);
        toast({
          variant: "destructive",
          title: "Update Failed",
          description: "Could not parse or process the JSON file.",
        });
      }
    });
  };

  const navItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard", color: "from-blue-500 to-indigo-600" },
    { id: "promo-generator", icon: Sparkles, label: "Promo", color: "from-purple-500 to-pink-600" },
    { id: "q-and-a-bot", icon: Bot, label: "Q&A Bot", color: "from-emerald-500 to-teal-600" },
    { id: "admin", icon: Shield, label: "Admin", color: "from-orange-500 to-red-600" },
  ];
  
  return (
    <div className="flex h-full">
      {/* Sidebar Navigation */}
      {sidebarOpen && (
        <div className="bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 p-6 w-64 overflow-y-auto z-40 transition-all duration-300">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Admin Panel</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">Manage your retail operations</p>
          </div>
          
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:scale-[1.02] ${
                    isActive 
                      ? `bg-gradient-to-r ${item.color} text-white shadow-lg` 
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <Icon className={`h-5 w-5 transition-all duration-300 ${
                    isActive ? 'text-white' : 'group-hover:scale-110'
                  }`} />
                  <span className={`font-medium transition-all duration-300 ${
                    isActive ? 'text-white' : ''
                  }`}>
                    {item.label}
                  </span>
                  {isActive && (
                    <div className="absolute right-3 w-2 h-2 bg-white rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full p-8 overflow-y-auto">
          {activeSection === "dashboard" && (
            <Dashboard products={products} updatedIds={updatedIds} />
          )}
          {activeSection === "promo-generator" && (
            <PromoGenerator products={products} />
          )}
          {activeSection === "q-and-a-bot" && (
            <QAndABot products={products} />
          )}
          {activeSection === "admin" && (
            <div className="mx-auto max-w-lg">
              <AdminPanel onUpdate={handleCatalogUpdate} isPending={isPending} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
