import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface Brand {
  id: string;
  name: string;
  productCount?: number;
}

interface BrandContextType {
  brands: Brand[];
  addBrand: (brand: Brand) => Promise<boolean>;
  updateBrand: (id: string, brand: Brand) => Promise<boolean>;
  deleteBrand: (id: string) => Promise<boolean>;
  getBrandById: (id: string) => Brand | undefined;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function getAuthHeaders() {
  const token = localStorage.getItem('adminToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
}

export function BrandProvider({ children }: { children: ReactNode }) {
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        console.log('[fetchBrands] Starting...');
        const token = localStorage.getItem('adminToken');
        console.log('[fetchBrands] Token:', token ? 'Present' : 'Missing');

        const response = await fetch(`${API_BASE_URL}/api/v1/admin/brands`, {
          headers: getAuthHeaders(),
        });
        console.log('[fetchBrands] Response status:', response.status);

        if (response.ok) {
          const data = await response.json();
          console.log('[fetchBrands] Data received:', data);
          const mapped = (data.brands || []).map((b: any) => ({
            id: b._id || b.id,
            name: b.name,
            productCount: b.productCount || 0,
          }));
          setBrands(mapped);
        } else {
          const errorData = await response.json();
          console.error('[fetchBrands] Error:', errorData);
        }
      } catch (error) {
        console.error('[fetchBrands] Exception:', error);
      }
    };

    fetchBrands();
  }, []);

  const addBrand = async (brand: Brand): Promise<boolean> => {
    try {
      const token = localStorage.getItem('adminToken');
      console.log('[addBrand] Token:', token ? 'Present' : 'Missing');
      console.log('[addBrand] Sending request to:', `${API_BASE_URL}/api/v1/admin/brands`);
      console.log('[addBrand] Payload:', { name: brand.name });

      const response = await fetch(`${API_BASE_URL}/api/v1/admin/brands`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ name: brand.name }),
      });
      console.log('[addBrand] Response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('[addBrand] Success:', data);
        setBrands(prev => [...prev, {
          id: data.brand._id || data.brand.id,
          name: data.brand.name,
          productCount: 0,
        }]);
        return true;
      } else {
        const errorData = await response.json();
        console.error('[addBrand] Error response:', errorData);
        return false;
      }
    } catch (error) {
      console.error('[addBrand] Exception:', error);
      return false;
    }
  };

  const updateBrand = async (id: string, brand: Brand): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/admin/brands/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ name: brand.name }),
      });
      if (response.ok) {
        setBrands(prev => prev.map(b => b.id === id ? { ...b, name: brand.name } : b));
        return true;
      } else {
        const errorData = await response.json();
        console.error('Error updating brand:', errorData);
        return false;
      }
    } catch (error) {
      console.error('Error updating brand:', error);
      return false;
    }
  };

  const deleteBrand = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/admin/brands/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        setBrands(prev => prev.filter(b => b.id !== id));
        return true;
      } else {
        const errorData = await response.json();
        console.error('Error deleting brand:', errorData);
        return false;
      }
    } catch (error) {
      console.error('Error deleting brand:', error);
      return false;
    }
  };

  const getBrandById = (id: string) => {
    return brands.find(b => b.id === id);
  };

  return (
    <BrandContext.Provider value={{ brands, addBrand, updateBrand, deleteBrand, getBrandById }}>
      {children}
    </BrandContext.Provider>
  );
}

export function useBrands() {
  const context = useContext(BrandContext);
  if (!context) {
    throw new Error('useBrands must be used within BrandProvider');
  }
  return context;
}