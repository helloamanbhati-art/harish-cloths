import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useCatalogCategories, useProducts, Product } from '../hooks/useProducts';

interface ProductContextType {
  products: Product[];
  categories: string[];
  loading: boolean;
  error: string | null;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const { products, loading, error } = useProducts();
  const categories = useCatalogCategories();

  return (
    <ProductContext.Provider value={{ products, categories, loading, error }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProductContext() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProductContext must be used within ProductProvider');
  }
  return context;
}
