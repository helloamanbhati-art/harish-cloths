import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../types/product';

export interface CartItem extends Product {
  quantity: number;
  selectedMeters?: number; // For products sold by meter
  selectedSize?: string; // For sized products
  selectedColor?: string; // For color variants
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, selectedMeters?: number, selectedSize?: string, selectedColor?: string) => void;
  removeFromCart: (productId: string, selectedMeters?: number, selectedSize?: string, selectedColor?: string) => void;
  updateQuantity: (productId: string, quantity: number, selectedMeters?: number, selectedSize?: string, selectedColor?: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const getDisplayValue = (value: unknown, fallback: string) => {
  if (typeof value === 'string') {
    return value;
  }

  if (value && typeof value === 'object' && 'name' in value) {
    const name = (value as { name?: unknown }).name;
    return typeof name === 'string' && name.trim() ? name : fallback;
  }

  return fallback;
};

const normalizeProduct = (product: Product): Product => ({
  ...product,
  brand: getDisplayValue(product.brand, 'Unknown Brand'),
  category: getDisplayValue(product.category, 'Uncategorized'),
});

const normalizeCartItems = (rawItems: unknown): CartItem[] => {
  if (!Array.isArray(rawItems)) {
    return [];
  }

  return rawItems
    .filter((item): item is CartItem => Boolean(item && typeof item === 'object'))
    .map((item) => {
      const normalizedProduct = normalizeProduct(item as Product);

      return {
        ...item,
        ...normalizedProduct,
        quantity: typeof item.quantity === 'number' && item.quantity > 0 ? item.quantity : 1,
        selectedMeters:
          typeof item.selectedMeters === 'number' && item.selectedMeters > 0
            ? item.selectedMeters
            : undefined,
        selectedColor: typeof item.selectedColor === 'string' ? item.selectedColor : undefined,
      };
    });
};

const matchesCartItem = (item: CartItem, productId: string, selectedMeters?: number, selectedSize?: string, selectedColor?: string) =>
  item.id === productId &&
  item.selectedMeters === selectedMeters &&
  item.selectedSize === selectedSize &&
  item.selectedColor === selectedColor;

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');

    if (!saved) {
      return [];
    }

    try {
      return normalizeCartItems(JSON.parse(saved));
    } catch (error) {
      console.error('Failed to parse saved cart:', error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, selectedMeters?: number, selectedSize?: string, selectedColor?: string) => {
    const normalizedProduct = normalizeProduct(product);

    setItems(current => {
      const existing = current.find(
        item => matchesCartItem(item, normalizedProduct.id, selectedMeters, selectedSize, selectedColor)
      );

      if (existing) {
        return current.map(item =>
          matchesCartItem(item, normalizedProduct.id, selectedMeters, selectedSize, selectedColor)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...current, { ...normalizedProduct, quantity: 1, selectedMeters, selectedSize, selectedColor }];
    });
  };

  const removeFromCart = (productId: string, selectedMeters?: number, selectedSize?: string, selectedColor?: string) => {
    setItems(current => current.filter(item => !matchesCartItem(item, productId, selectedMeters, selectedSize, selectedColor)));
  };

  const updateQuantity = (productId: string, quantity: number, selectedMeters?: number, selectedSize?: string, selectedColor?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedMeters, selectedSize, selectedColor);
      return;
    }

    setItems(current =>
      current.map(item =>
        matchesCartItem(item, productId, selectedMeters, selectedSize, selectedColor) ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => {
    const itemPrice = item.soldBy === 'meter' && item.selectedMeters
      ? item.price * item.selectedMeters
      : item.price;
    const additionalCharge = (item.additionalChargeAmount || 0) * item.quantity;
    return sum + (itemPrice * item.quantity) + additionalCharge;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
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
