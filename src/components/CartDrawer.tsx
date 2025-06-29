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
    updateCart(cart.filter(item => item.product.id !== id));
  };

  const changeQty = (id: string, qty: number) => {
    updateCart(cart.map(item => item.product.id === id ? { ...item, quantity: qty } : item));
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
          <div key={item.product.id} className="flex gap-3 items-center border-b pb-2">
            <img src={item.product.image} alt={item.product.name} className="w-14 h-14 rounded object-cover" />
            <div className="flex-1">
              <div className="font-semibold">{item.product.name}</div>
              <div className="text-sm text-gray-500">₹{item.product.price.toLocaleString()}</div>
              <div className="flex items-center gap-2 mt-1">
                <Button size="sm" variant="outline" onClick={() => changeQty(item.product.id, Math.max(1, item.quantity - 1))}>-</Button>
                <span>{item.quantity}</span>
                <Button size="sm" variant="outline" onClick={() => changeQty(item.product.id, item.quantity + 1)}>+</Button>
              </div>
            </div>
            <Button size="icon" variant="ghost" onClick={() => removeItem(item.product.id)}><X className="h-4 w-4" /></Button>
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