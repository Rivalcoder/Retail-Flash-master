import { useEffect, useState } from 'react';
import { Heart, X } from 'lucide-react';
import { Button } from './ui/button';
import { Product } from '@/lib/types';

export default function WishlistDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [wishlist, setWishlist] = useState<Product[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('wishlist');
    if (stored) setWishlist(JSON.parse(stored));
  }, [open]);

  const removeItem = (id: string) => {
    const updated = wishlist.filter(item => item.id !== id);
    setWishlist(updated);
    localStorage.setItem('wishlist', JSON.stringify(updated));
  };

  return (
    <div className={`fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-900 shadow-2xl z-[100] transform transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-bold flex items-center gap-2"><Heart className="h-5 w-5 text-pink-500" />Wishlist</h2>
        <Button variant="ghost" size="icon" onClick={onClose}><X /></Button>
      </div>
      <div className="p-4 flex-1 overflow-y-auto space-y-4">
        {wishlist.length === 0 ? <p className="text-center text-gray-500">Your wishlist is empty.</p> : wishlist.map(item => (
          <div key={item.id} className="flex gap-3 items-center border-b pb-2">
            <img src={item.image} alt={item.name} className="w-14 h-14 rounded object-cover" />
            <div className="flex-1">
              <div className="font-semibold">{item.name}</div>
              <div className="text-sm text-gray-500">₹{item.price.toLocaleString()}</div>
            </div>
            <Button size="icon" variant="ghost" onClick={() => removeItem(item.id)}><X className="h-4 w-4" /></Button>
          </div>
        ))}
      </div>
    </div>
  );
} 