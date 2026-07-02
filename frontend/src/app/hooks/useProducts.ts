import { useState, useEffect } from 'react';

export interface VariantImage {
  imageUrl: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface ProductVariant {
  variantId: string;
  variantName: string;
  images: VariantImage[];
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  images: string[];
  colors?: string[];
  variants?: ProductVariant[];
  category: string;
  description: string;
  soldBy: 'meter' | 'piece';
  availableSizes?: string[];
  clothingType?: string;
  inStock?: boolean;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const transformProduct = (product: any): Product => {
  const rawImages: string[] = Array.isArray(product.images) ? product.images : [];
  const validImages = rawImages.filter((url: string) => url && url.trim().length > 0);
  const primaryImage = product.image && product.image.trim()
    ? product.image
    : validImages[0] || '';

  const fallbackImages = validImages.length > 0 ? validImages : (primaryImage ? [primaryImage] : []);
  
  const variants = Array.isArray(product.variants) && product.variants.length > 0
    ? product.variants.map((v: any) => ({
        variantId: v.variantId || v._id || '',
        variantName: v.variantName || v.name || 'Default',
        images: Array.isArray(v.images)
          ? v.images.map((img: any) => ({
              imageUrl: typeof img === 'string' ? img : img.imageUrl,
              isPrimary: img.isPrimary ?? false,
              sortOrder: img.sortOrder ?? 0,
            }))
          : [],
      }))
    : fallbackImages.length > 0
      ? [{
          variantId: 'default',
          variantName: 'Default',
          images: fallbackImages.map((img, i) => ({
            imageUrl: img,
            isPrimary: i === 0,
            sortOrder: i,
          })),
        }]
      : [];

  return {
    id: product._id || product.id,
    name: product.name,
    brand: typeof product.brand === 'object'
      ? product.brand?.name || ''
      : product.brand || '',
    price: product.price,
    image: primaryImage,
    images: fallbackImages,
    colors: Array.isArray(product.colors) ? product.colors : [],
    variants,
    category: typeof product.category === 'object'
      ? product.category?.name || ''
      : product.category || '',
    description: product.description || product.shortDescription || '',
    soldBy: product.soldBy || 'piece',
    availableSizes: Array.isArray(product.availableSizes) ? product.availableSizes : [],
    clothingType: product.clothingType || '',
    inStock: product.inStock !== false,
    compareAtPrice: product.compareAtPrice || 0,
  };
};

// Module-level cache: persists for the lifetime of the browser session (page not refreshed).
// Re-visits to the home page use cached data instantly with no loading spinner.
let _cachedProducts: Product[] | null = null;
let _isFetching = false;
const _listeners: Array<(products: Product[]) => void> = [];

async function fetchAndCacheProducts(): Promise<Product[]> {
  if (_cachedProducts) return _cachedProducts;
  if (_isFetching) {
    // Wait for in-progress fetch
    return new Promise((resolve) => {
      _listeners.push(resolve);
    });
  }

  _isFetching = true;
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/products`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      let message = response.statusText;
      try {
        const errorBody = await response.json();
        if (errorBody?.message) message = errorBody.message;
      } catch { /* ignore */ }
      throw new Error(`Failed to fetch products: ${response.status} ${message}`);
    }

    const data = await response.json();
    const rawProducts = data.data || data.products || [];
    const products = rawProducts.map(transformProduct);
    _cachedProducts = products;
    // Notify any waiting listeners
    _listeners.forEach((cb) => cb(products));
    _listeners.length = 0;
    return products;
  } finally {
    _isFetching = false;
  }
}

export function useProducts() {
  // Start with cached data immediately if available (instant render)
  const [products, setProducts] = useState<Product[]>(_cachedProducts ?? []);
  const [loading, setLoading] = useState(_cachedProducts === null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (_cachedProducts) {
      // Already have data — show it instantly, then do a silent background refresh
      setProducts(_cachedProducts);
      setLoading(false);
      fetchAndCacheProducts()
        .then((fresh) => {
          _cachedProducts = fresh;
          setProducts(fresh);
        })
        .catch(() => { /* ignore background refresh errors */ });
      return;
    }

    fetchAndCacheProducts()
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        const message = err instanceof Error ? err.message : 'Failed to fetch products';
        setError(message);
        setLoading(false);
        console.error('Error fetching products:', message);
      });
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
        
        const response = await fetch(`${API_BASE_URL}/api/v1/products/${productId}`, {
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
        const rawProduct = data.data || data.product;
        
        if (!rawProduct) {
          throw new Error('Product not found');
        }

        setProduct(transformProduct(rawProduct));
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
