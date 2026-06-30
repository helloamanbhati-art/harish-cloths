import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, SelectedVariantSnapshot } from '../types/product';

export interface CartItem extends Product {
  quantity: number;
  selectedMeters?: number; // For products sold by meter
  selectedSize?: string; // For sized products
  selectedColor?: string; // For color variants
  selectedVariant?: SelectedVariantSnapshot; // Full variant details snapshot
}

interface CartContextType {
  items: CartItem[];
  addToCart: (
    product: Product,
    selectedMeters?: number,
    selectedSize?: string,
    selectedColor?: string,
    selectedVariant?: SelectedVariantSnapshot,
    quantity?: number
  ) => void;
  removeFromCart: (productId: string, selectedMeters?: number, selectedSize?: string, selectedColor?: string) => void;
  updateQuantity: (productId: string, quantity: number, selectedMeters?: number, selectedSize?: string, selectedColor?: string) => void;
  updateMeters: (productId: string, currentMeters: number, newMeters: number, selectedSize?: string, selectedColor?: string) => void;
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
        selectedVariant: item.selectedVariant && typeof item.selectedVariant === 'object' ? item.selectedVariant : undefined,
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

  const addToCart = (
    product: Product,
    selectedMeters?: number,
    selectedSize?: string,
    selectedColor?: string,
    selectedVariant?: SelectedVariantSnapshot,
    quantity = 1
  ) => {
    const normalizedProduct = normalizeProduct(product);

    // Ensure selectedVariant is always a fully formed SelectedVariantSnapshot
    let variantSnapshot: SelectedVariantSnapshot;

    if (selectedVariant) {
      variantSnapshot = selectedVariant;
    } else {
      // Find matching variant by name/color or fall back to the first variant
      const matchingVariant = product.variants?.find(v => v.variantName === selectedColor) || product.variants?.[0];
      if (matchingVariant) {
        variantSnapshot = {
          variantId: matchingVariant.variantId,
          variantName: matchingVariant.variantName,
          color: matchingVariant.variantName || product.colors?.[0] || null,
          pattern: product.name,
          sku: product.sku || null,
          thumbnail: matchingVariant.images?.[0]?.imageUrl || product.image || null,
          primaryImage: (matchingVariant.images?.find(img => img.isPrimary) || matchingVariant.images?.[0])?.imageUrl || product.image || null,
          galleryImages: matchingVariant.images?.map(img => img.imageUrl) || [],
          priceAtPurchase: product.price
        };
      } else {
        variantSnapshot = {
          variantId: 'default',
          variantName: selectedColor || 'Default',
          color: selectedColor || 'Default',
          pattern: product.name,
          sku: product.sku || null,
          thumbnail: product.image || null,
          primaryImage: product.image || null,
          galleryImages: product.images || [],
          priceAtPurchase: product.price
        };
      }
    }

    setItems(current => {
      const existing = current.find(
        item => matchesCartItem(item, normalizedProduct.id, selectedMeters, selectedSize, selectedColor)
      );

      if (existing) {
        return current.map(item =>
          matchesCartItem(item, normalizedProduct.id, selectedMeters, selectedSize, selectedColor)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...current, { ...normalizedProduct, quantity, selectedMeters, selectedSize, selectedColor, selectedVariant: variantSnapshot }];
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

  const updateMeters = (
    productId: string,
    currentMeters: number,
    newMeters: number,
    selectedSize?: string,
    selectedColor?: string
  ) => {
    setItems(current => {
      const targetIdx = current.findIndex(
        item => matchesCartItem(item, productId, currentMeters, selectedSize, selectedColor)
      );
      if (targetIdx === -1) return current;

      const targetItem = current[targetIdx];
      const existingIdx = current.findIndex(
        item => matchesCartItem(item, productId, newMeters, selectedSize, selectedColor)
      );

      if (existingIdx !== -1 && existingIdx !== targetIdx) {
        return current
          .map((item, idx) => {
            if (idx === existingIdx) {
              return { ...item, quantity: item.quantity + targetItem.quantity };
            }
            return item;
          })
          .filter((_, idx) => idx !== targetIdx);
      } else {
        return current.map((item, idx) =>
          idx === targetIdx ? { ...item, selectedMeters: newMeters } : item
        );
      }
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => {
    const itemPrice = item.soldBy === 'meter' && item.selectedMeters === 5
      ? item.price + (item.compareAtPrice || 0)
      : item.price;
    return sum + (itemPrice * item.quantity);
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateMeters,
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
