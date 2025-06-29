import { useEffect, useState } from 'react';
import { ShoppingCart, X } from 'lucide-react';
import { Button } from './ui/button';
import { Product } from '@/lib/types';

interface CartItem {
  product: Product;
  quantity: number;
}

export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('cart');
    if (stored) setCart(JSON.parse(stored));
  }, [open]);

  const updateCart = (items: CartItem[]) => {
    setCart(items);
    localStorage.setItem('cart', JSON.stringify(items));
  };

  const removeItem = (id: string) => {
    updateCart(cart.filter(item => item.product._id !== id));
  };

  const changeQty = (id: string, qty: number) => {
    updateCart(cart.map(item => item.product._id === id ? { ...item, quantity: qty } : item));
  };

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className={`fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-900 shadow-2xl z-[100] transform transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-bold flex items-center gap-2"><ShoppingCart className="h-5 w-5" />Cart</h2>
        <Button variant="ghost" size="icon" onClick={onClose}><X /></Button>
      </div>
      <div className="p-4 flex-1 overflow-y-auto space-y-4">
        {cart.length === 0 ? <p className="text-center text-gray-500">Your cart is empty.</p> : cart.map(item => (
          <div key={item.product._id} className="flex gap-3 items-center border-b pb-2">
            <img src={item.product.image || item.product.imageUrl} alt={item.product.name} className="w-12 h-12 rounded object-cover" />
            <div className="flex-1">
              <div className="font-medium">{item.product.name}</div>
              <div className="text-sm text-muted-foreground">₹{item.product.price}</div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => changeQty(item.product._id, Math.max(1, item.quantity - 1))}>-</Button>
              <span className="w-8 text-center">{item.quantity}</span>
              <Button size="sm" variant="outline" onClick={() => changeQty(item.product._id, item.quantity + 1)}>+</Button>
            </div>
            <Button size="icon" variant="ghost" onClick={() => removeItem(item.product._id)}><X className="h-4 w-4" /></Button>
          </div>
        ))}
      </div>
      <div className="p-4 border-t flex items-center justify-between">
        <span className="font-bold">Total:</span>
        <span className="text-lg font-bold text-blue-700">₹{total.toLocaleString()}</span>
      </div>
    </div>
  );
} 