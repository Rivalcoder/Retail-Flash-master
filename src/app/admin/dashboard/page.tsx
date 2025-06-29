"use client";

import { useState, useTransition } from "react";
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

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [updatedIds, setUpdatedIds] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

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
              description: productWithChanges.description,
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
  
  return (
    <div className="relative flex-1">
      <Tabs defaultValue="dashboard" className="flex-1">
        <TabsList className="grid w-full grid-cols-1 sm:w-auto sm:grid-cols-4">
          <TabsTrigger value="dashboard">
            <LayoutDashboard className="mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="promo-generator">
            <Sparkles className="mr-2" />
            Promo Generator
          </TabsTrigger>
          <TabsTrigger value="q-and-a-bot">
            <Bot className="mr-2" />
            Q&amp;A Bot
          </TabsTrigger>
          <TabsTrigger value="admin">
            <Shield className="mr-2" />
            Admin
          </TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="mt-6">
          <Dashboard products={products} updatedIds={updatedIds} />
        </TabsContent>
        <TabsContent value="promo-generator" className="mt-6">
          <PromoGenerator products={products} />
        </TabsContent>
        <TabsContent value="q-and-a-bot" className="mt-6">
          <QAndABot products={products} />
        </TabsContent>
        <TabsContent value="admin" className="mt-6">
          <div className="mx-auto max-w-lg">
            <AdminPanel onUpdate={handleCatalogUpdate} isPending={isPending} />
          </div>
        </TabsContent>
      </Tabs>
      {/* Floating Chatbot Button for Admin */}
      <Link
        href="/admin/dashboard/chatbot"
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full shadow-lg p-4 hover:scale-105 transition-transform focus:outline-none"
        aria-label="Open chat bot"
      >
        <Bot className="h-7 w-7" />
      </Link>
    </div>
  );
}
