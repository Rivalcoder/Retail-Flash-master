import { useState, useEffect, useCallback } from 'react';
import type { Product } from '@/lib/types';

interface StockAlert {
  id: string;
  productId: string;
  productName: string;
  currentStock: number;
  previousStock: number;
  threshold: number;
  severity: 'critical' | 'warning' | 'notice';
  timestamp: Date;
  isNew: boolean;
}

interface UseStockMonitorProps {
  products: Product[];
  checkInterval?: number; // in milliseconds
  thresholds?: {
    critical: number;
    warning: number;
    notice: number;
  };
}

export function useStockMonitor({ 
  products, 
  checkInterval = 30000, // 30 seconds
  thresholds = { critical: 5, warning: 10, notice: 20 }
}: UseStockMonitorProps) {
  const [stockAlerts, setStockAlerts] = useState<StockAlert[]>([]);
  const [previousStockLevels, setPreviousStockLevels] = useState<Map<string, number>>(new Map());
  const [isMonitoring, setIsMonitoring] = useState(false);

  // Get stock severity level
  const getStockSeverity = useCallback((stock: number) => {
    if (stock === 0) return 'critical';
    if (stock <= thresholds.critical) return 'critical';
    if (stock <= thresholds.warning) return 'warning';
    if (stock <= thresholds.notice) return 'notice';
    return null;
  }, [thresholds]);

  // Check for stock changes and generate alerts
  const checkStockLevels = useCallback(() => {
    const newAlerts: StockAlert[] = [];
    const currentStockLevels = new Map<string, number>();

    products.forEach(product => {
      const currentStock = product.stock ?? 0;
      const previousStock = previousStockLevels.get(product._id) ?? currentStock;
      currentStockLevels.set(product._id, currentStock);

      const severity = getStockSeverity(currentStock);
      
      // Generate alert if:
      // 1. Stock is low and we haven't alerted for this level yet
      // 2. Stock has decreased significantly
      // 3. Stock has gone from above threshold to below threshold
      if (severity) {
        const previousSeverity = getStockSeverity(previousStock);
        const stockDecreased = currentStock < previousStock;
        const crossedThreshold = !previousSeverity && severity;
        const severityIncreased = previousSeverity && severity && 
          ['notice', 'warning', 'critical'].indexOf(severity) > 
          ['notice', 'warning', 'critical'].indexOf(previousSeverity);

        if (stockDecreased || crossedThreshold || severityIncreased) {
          newAlerts.push({
            id: `${product._id}-${Date.now()}`,
            productId: product._id,
            productName: product.name,
            currentStock,
            previousStock,
            threshold: thresholds[severity as keyof typeof thresholds],
            severity,
            timestamp: new Date(),
            isNew: true
          });
        }
      }
    });

    setPreviousStockLevels(currentStockLevels);
    
    if (newAlerts.length > 0) {
      setStockAlerts(prev => [...newAlerts, ...prev.slice(0, 49)]); // Keep last 50 alerts
    }
  }, [products, previousStockLevels, getStockSeverity, thresholds]);

  // Start monitoring
  const startMonitoring = useCallback(() => {
    setIsMonitoring(true);
    // Initial check
    checkStockLevels();
  }, [checkStockLevels]);

  // Stop monitoring
  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
  }, []);

  // Clear alerts
  const clearAlerts = useCallback(() => {
    setStockAlerts([]);
  }, []);

  // Dismiss specific alert
  const dismissAlert = useCallback((alertId: string) => {
    setStockAlerts(prev => prev.filter(alert => alert.id !== alertId));
  }, []);

  // Mark alert as read
  const markAlertAsRead = useCallback((alertId: string) => {
    setStockAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId ? { ...alert, isNew: false } : alert
      )
    );
  }, []);

  // Get current low stock products
  const getLowStockProducts = useCallback(() => {
    return products.filter(product => {
      const severity = getStockSeverity(product.stock ?? 0);
      return severity !== null;
    });
  }, [products, getStockSeverity]);

  // Get alert statistics
  const getAlertStats = useCallback(() => {
    const critical = stockAlerts.filter(a => a.severity === 'critical').length;
    const warning = stockAlerts.filter(a => a.severity === 'warning').length;
    const notice = stockAlerts.filter(a => a.severity === 'notice').length;
    const unread = stockAlerts.filter(a => a.isNew).length;

    return { critical, warning, notice, unread, total: stockAlerts.length };
  }, [stockAlerts]);

  // Set up monitoring interval
  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(checkStockLevels, checkInterval);
    return () => clearInterval(interval);
  }, [isMonitoring, checkStockLevels, checkInterval]);

  // Initialize previous stock levels on first load
  useEffect(() => {
    if (products.length > 0 && previousStockLevels.size === 0) {
      const initialLevels = new Map<string, number>();
      products.forEach(product => {
        initialLevels.set(product._id, product.stock ?? 0);
      });
      setPreviousStockLevels(initialLevels);
    }
  }, [products, previousStockLevels.size]);

  return {
    stockAlerts,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    clearAlerts,
    dismissAlert,
    markAlertAsRead,
    getLowStockProducts,
    getAlertStats,
    checkStockLevels
  };
} 