import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface Category {
  id: string;
  name: string;
  productCount?: number;
}

interface CategoryContextType {
  categories: Category[];
  loading: boolean;
  error: string | null;
  addCategory: (category: Category) => Promise<boolean>;
  updateCategory: (id: string, category: Category) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;
  getCategoryById: (id: string) => Category | undefined;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function getAuthHeaders() {
  const token = localStorage.getItem('adminToken');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

function clearAdminSessionAndRedirect() {
  localStorage.removeItem('adminAuth');
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
  window.location.href = '/admin/login';
}

export function CategoryProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      // Skip fetching if no token (user not authenticated)
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setCategories([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        console.log('[fetchCategories] Starting...');
        console.log('[fetchCategories] Token:', token ? 'Present' : 'Missing');

        const response = await fetch(`${API_BASE_URL}/api/v1/admin/categories`, {
          headers: getAuthHeaders(),
        });
        console.log('[fetchCategories] Response status:', response.status);

        if (response.ok) {
          const data = await response.json();
          console.log('[fetchCategories] Data received:', data);
          const mapped = (data.categories || []).map((c: any) => ({
            id: c._id || c.id,
            name: c.name,
            productCount: c.productCount || 0,
          }));
          setCategories(mapped);
        } else {
          const errorData = await response.json();
          const message = errorData?.message || 'Failed to fetch categories';
          console.error('[fetchCategories] Error:', errorData);
          if (response.status === 401) {
            clearAdminSessionAndRedirect();
            return;
          }
          setError(message);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'An unexpected error occurred';
        console.error('[fetchCategories] Exception:', error);
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const addCategory = async (category: Category): Promise<boolean> => {
    try {
      const token = localStorage.getItem('adminToken');
      console.log('[addCategory] Token:', token ? 'Present' : 'Missing');
      console.log('[addCategory] Sending request to:', `${API_BASE_URL}/api/v1/admin/categories`);
      console.log('[addCategory] Payload:', { name: category.name });

      const response = await fetch(`${API_BASE_URL}/api/v1/admin/categories`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ name: category.name }),
      });
      console.log('[addCategory] Response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('[addCategory] Success:', data);
        setCategories(prev => [...prev, {
          id: data.category._id || data.category.id,
          name: data.category.name,
          productCount: 0,
        }]);
        return true;
      } else {
        const errorData = await response.json();
        console.error('[addCategory] Error response:', errorData);
        return false;
      }
    } catch (error) {
      console.error('[addCategory] Exception:', error);
      return false;
    }
  };

  const updateCategory = async (id: string, category: Category): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/admin/categories/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ name: category.name }),
      });
      if (response.ok) {
        setCategories(prev => prev.map(c => c.id === id ? { ...c, name: category.name } : c));
        return true;
      } else {
        const errorData = await response.json();
        console.error('Error updating category:', errorData);
        return false;
      }
    } catch (error) {
      console.error('Error updating category:', error);
      return false;
    }
  };

  const deleteCategory = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/admin/categories/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        setCategories(prev => prev.filter(c => c.id !== id));
        return true;
      } else {
        const errorData = await response.json();
        console.error('Error deleting category:', errorData);
        return false;
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      return false;
    }
  };

  const getCategoryById = (id: string) => {
    return categories.find(c => c.id === id);
  };

  return (
    <CategoryContext.Provider value={{ categories, loading, error, addCategory, updateCategory, deleteCategory, getCategoryById }}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategories must be used within CategoryProvider');
  }
  return context;
}