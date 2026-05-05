import { createContext, useContext, useState, ReactNode } from 'react';

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  brand: string;
  price: number;
  quantity: number;
  meters?: number;
  soldBy: 'meter' | 'piece';
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateMeters: (itemId: string, meters: number) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: CartItem) => {
    setItems(prev => {
      const existing = prev.find(i => i.productId === item.productId);
      if (existing) {
        return prev.map(i =>
          i.productId === item.productId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
  };

  const removeItem = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    setItems(prev => prev.map(item =>
      item.id === itemId ? { ...item, quantity } : item
    ));
  };

  const updateMeters = (itemId: string, meters: number) => {
    setItems(prev => prev.map(item =>
      item.id === itemId ? { ...item, meters } : item
    ));
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce((sum, item) => {
    const itemPrice = item.soldBy === 'meter'
      ? item.price * item.quantity * (item.meters || 1)
      : item.price * item.quantity;
    return sum + itemPrice;
  }, 0);

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      updateMeters,
      clearCart,
      total
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
