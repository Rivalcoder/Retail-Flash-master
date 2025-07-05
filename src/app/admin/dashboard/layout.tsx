"use client"
import Link from "next/link";
import { LogOut, Crown, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import Image from "next/image";
import logo from "../../../../public/logo.png";
import NotificationBell from "@/components/notification-bell";
import type { Product } from "@/lib/types";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [products, setProducts] = useState<Product[]>([]);

  // Load products for notification bell
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const pathwayRes = await fetch('https://rivalcoder-pathway.hf.space/products');
        if (pathwayRes.ok) {
          const data = await pathwayRes.json();
          const productsData = Array.isArray(data) ? data : data.products || [];
          setProducts(productsData);
        } else {
          // Fallback to local API
          const response = await fetch('/api/products');
          if (response.ok) {
            const data = await response.json();
            setProducts(data.products || []);
          }
        }
      } catch (error) {
        console.error('Failed to load products for notifications:', error);
      }
    };

    loadProducts();
  }, []);

  const handleNavigateToInventory = () => {
    // Dispatch a custom event that the dashboard page can listen to
    window.dispatchEvent(new CustomEvent('navigate-to-inventory'));
  };

  return (
    <div className="flex h-screen w-full flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <header className="flex-shrink-0 border-b border-white/20 bg-white/80 backdrop-blur-xl dark:bg-slate-900/80">
        <div className="flex h-16 items-center justify-between px-6">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-gradient-to-br from-blue-700 to-purple-800 shadow-lg">
              <Image
                src={logo}
                alt="logo"
                width={70}
                height={70}
                className="h-13 w-13 object-contain"
              />
            </div>

            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Retail Flash
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Admin Panel</span>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 border border-amber-200/50 dark:border-amber-700/50">
              <Crown className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <span className="text-sm font-medium text-amber-700 dark:text-amber-300">Admin Co-Pilot</span>
            </div>

            <div className="h-6 w-px bg-slate-300 dark:bg-slate-600" />
            
            <NotificationBell products={products} onNavigateToInventory={handleNavigateToInventory} />
            
            <ThemeToggle />

            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 rounded-lg hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
              asChild
            >
              <Link href="/">
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Logout</span>
              </Link>
            </Button>

            <Avatar className="h-9 w-9 ring-2 ring-white dark:ring-slate-800 shadow-lg">
              <AvatarImage src="https://img.freepik.com/premium-vector/man-avatar-profile-picture-isolated-background-avatar-profile-picture-man_1293239-4861.jpg?semt=ais_hybrid&w=740" data-ai-hint="logo abstract" />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                AD
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
