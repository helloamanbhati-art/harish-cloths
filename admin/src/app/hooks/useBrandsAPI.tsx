import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface Brand {
  _id: string;
  name: string;
  description?: string;
  logo?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  products?: number;
  revenue?: number;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function useBrandsAPI() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  };

  // Fetch brands on mount
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/v1/catalog`, {
          headers: getAuthHeaders(),
        });

        if (response.ok) {
          const data = await response.json();
          setBrands(data.data || []);
          setError(null);
        } else if (response.status === 401) {
          throw new Error('Unauthorized - Please login again');
        } else {
          throw new Error('Failed to fetch brands');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch brands';
        setError(errorMessage);
        toast.error(errorMessage);
        // Fallback to empty array on error
        setBrands([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  const addBrand = async (brandData: Partial<Brand>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/admin/brands`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(brandData),
      });

      if (response.ok) {
        const data = await response.json();
        setBrands([...brands, data.data]);
        toast.success('Brand added successfully');
        return data.data;
      } else {
        throw new Error('Failed to add brand');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add brand';
      toast.error(errorMessage);
      throw err;
    }
  };

  const updateBrand = async (id: string, brandData: Partial<Brand>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/admin/brands/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(brandData),
      });

      if (response.ok) {
        const data = await response.json();
        setBrands(brands.map(b => b._id === id ? data.data : b));
        toast.success('Brand updated successfully');
        return data.data;
      } else {
        throw new Error('Failed to update brand');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update brand';
      toast.error(errorMessage);
      throw err;
    }
  };

  const deleteBrand = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/admin/brands/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        setBrands(brands.filter(b => b._id !== id));
        toast.success('Brand deleted successfully');
      } else {
        throw new Error('Failed to delete brand');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete brand';
      toast.error(errorMessage);
      throw err;
    }
  };

  return {
    brands,
    loading,
    error,
    addBrand,
    updateBrand,
    deleteBrand,
  };
}
