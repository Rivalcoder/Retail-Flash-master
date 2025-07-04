"use client";

import { useState, useEffect } from "react";
import { Bell, AlertTriangle, Package, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import type { Product } from "@/lib/types";

interface NotificationBellProps {
  products: Product[];
  onNavigateToInventory?: () => void;
}

export default function NotificationBell({ products, onNavigateToInventory }: NotificationBellProps) {
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Calculate low stock products (stock < 10 or undefined stock)
  useEffect(() => {
    const lowStock = products.filter(product => 
      product.stock === undefined || product.stock < 10
    );
    setLowStockProducts(lowStock);
  }, [products]);

  const notificationCount = lowStockProducts.length;

  const handleViewInventory = () => {
    setIsOpen(false);
    if (onNavigateToInventory) {
      onNavigateToInventory();
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative h-9 w-9 rounded-lg hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-900/20 dark:hover:text-orange-400 transition-all duration-200"
        >
          <Bell className="h-4 w-4 transition-all duration-200" />
          {notificationCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs font-bold"
            >
              {notificationCount > 99 ? '99+' : notificationCount}
            </Badge>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm">Low Stock Alerts</h4>
            {notificationCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {notificationCount} items
              </Badge>
            )}
          </div>
        </div>
        <ScrollArea className="h-80">
          {notificationCount === 0 ? (
            <div className="p-6 text-center">
              <Package className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">All products are well stocked!</p>
            </div>
          ) : (
            <div className="p-2 space-y-2">
              {lowStockProducts.map((product) => (
                <Card key={product._id} className="border-l-4 border-l-orange-500 hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-sm truncate">{product.name}</h5>
                        <p className="text-xs text-muted-foreground">
                          Current Stock: <span className="font-semibold text-orange-600">{product.stock ?? 'Not set'}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Price: ${product.price}
                        </p>
                      </div>
                      <div className="flex items-center ml-2">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
        {notificationCount > 0 && (
          <div className="p-3 border-t border-border">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-900/20 dark:hover:text-orange-400"
              onClick={handleViewInventory}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View All in Inventory
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
} 