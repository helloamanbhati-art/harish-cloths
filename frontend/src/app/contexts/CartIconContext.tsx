import { createContext, useContext, useState, ReactNode } from 'react';

interface CartIconContextType {
  cartIconElement: HTMLElement | null;
  setCartIconElement: (element: HTMLElement | null) => void;
}

const CartIconContext = createContext<CartIconContextType | undefined>(undefined);

export function CartIconProvider({ children }: { children: ReactNode }) {
  const [cartIconElement, setCartIconElement] = useState<HTMLElement | null>(null);

  return (
    <CartIconContext.Provider value={{ cartIconElement, setCartIconElement }}>
      {children}
    </CartIconContext.Provider>
  );
}

export function useCartIcon() {
  const context = useContext(CartIconContext);
  if (!context) {
    throw new Error('useCartIcon must be used within CartIconProvider');
  }
  return context;
}
