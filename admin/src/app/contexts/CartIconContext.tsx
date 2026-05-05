import { createContext, useContext, useState, ReactNode } from 'react';

interface CartIconContextType {
  showCartIcon: boolean;
  setShowCartIcon: (show: boolean) => void;
}

const CartIconContext = createContext<CartIconContextType | undefined>(undefined);

export function CartIconProvider({ children }: { children: ReactNode }) {
  const [showCartIcon, setShowCartIcon] = useState(false);

  return (
    <CartIconContext.Provider value={{ showCartIcon, setShowCartIcon }}>
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
