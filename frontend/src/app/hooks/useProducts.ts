import { useState, useEffect } from 'react';

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  images: string[];
  category: string;
  description: string;
  soldBy: 'meter' | 'piece';
  inStock?: boolean;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${API_BASE_URL}/api/v1/products`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          let message = response.statusText;
          try {
            const errorBody = await response.json();
            if (errorBody?.message) {
              message = errorBody.message;
            }
          } catch {
            // ignore parse failure
          }
          throw new Error(`Failed to fetch products: ${response.status} ${message}`);
        }

        const data = await response.json();
        const rawProducts = data.data || data.products || [];
        
        // Transform API response to match Product type
        const transformedProducts = rawProducts.map((product: any) => ({
          id: product._id || product.id,
          name: product.name,
          brand: typeof product.brand === 'object' 
            ? product.brand?.name || 'Unknown' 
            : product.brand,
          price: product.price,
          image: product.image || (product.images && product.images[0]) || '',
          images: product.images || (product.image ? [product.image] : []),
          category: typeof product.category === 'object' 
            ? product.category?.name || 'Unknown' 
            : product.category,
          description: product.description || product.shortDescription || '',
          soldBy: product.soldBy || 'piece',
          inStock: product.inStock !== false,
        } as Product));
        
        setProducts(transformedProducts);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch products';
        setError(message);
        console.error('Error fetching products:', message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error };
}

export function useProductById(productId: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${API_BASE_URL}/api/v1/products`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          let message = response.statusText;
          try {
            const errorBody = await response.json();
            if (errorBody?.message) {
              message = errorBody.message;
            }
          } catch {
            // ignore parse failure
          }
          throw new Error(`Failed to fetch product: ${response.status} ${message}`);
        }

        const data = await response.json();
        const foundProduct = data.products?.find((p: Product) => p.id === productId);
        
        if (!foundProduct) {
          throw new Error('Product not found');
        }

        setProduct(foundProduct);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch product';
        setError(message);
        console.error('Error fetching product:', message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  return { product, loading, error };
}
