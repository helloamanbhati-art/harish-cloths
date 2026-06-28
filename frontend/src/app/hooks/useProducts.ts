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
      ? product.brand?.name || 'Unknown'
      : product.brand,
    price: product.price,
    image: primaryImage,
    images: fallbackImages,
    colors: Array.isArray(product.colors) ? product.colors : [],
    variants,
    category: typeof product.category === 'object'
      ? product.category?.name || 'Unknown'
      : product.category,
    description: product.description || product.shortDescription || '',
    soldBy: product.soldBy || 'piece',
    availableSizes: Array.isArray(product.availableSizes) ? product.availableSizes : [],
    clothingType: product.clothingType || '',
    inStock: product.inStock !== false,
  };
};

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
        const transformedProducts = rawProducts.map(transformProduct);
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
