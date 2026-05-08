import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface Category {
  _id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  displayOrder?: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  products?: number;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function useCategoriesAPI() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  };

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/v1/catalog/categories`, {
          headers: getAuthHeaders(),
        });

        if (response.ok) {
          const data = await response.json();
          setCategories(data.data || []);
          setError(null);
        } else if (response.status === 401) {
          throw new Error('Unauthorized - Please login again');
        } else {
          throw new Error('Failed to fetch categories');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch categories';
        setError(errorMessage);
        toast.error(errorMessage);
        // Fallback to empty array on error
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const addCategory = async (categoryData: Partial<Category>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/admin/categories`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(categoryData),
      });

      if (response.ok) {
        const data = await response.json();
        setCategories([...categories, data.data]);
        toast.success('Category added successfully');
        return data.data;
      } else {
        throw new Error('Failed to add category');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add category';
      toast.error(errorMessage);
      throw err;
    }
  };

  const updateCategory = async (id: string, categoryData: Partial<Category>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/admin/categories/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(categoryData),
      });

      if (response.ok) {
        const data = await response.json();
        setCategories(categories.map(c => c._id === id ? data.data : c));
        toast.success('Category updated successfully');
        return data.data;
      } else {
        throw new Error('Failed to update category');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update category';
      toast.error(errorMessage);
      throw err;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/admin/categories/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        setCategories(categories.filter(c => c._id !== id));
        toast.success('Category deleted successfully');
      } else {
        throw new Error('Failed to delete category');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete category';
      toast.error(errorMessage);
      throw err;
    }
  };

  return {
    categories,
    loading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
  };
}
