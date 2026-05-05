import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  brand: string;
  price: number;
  quantity: number;
  meters?: number;
  soldBy: 'meter' | 'piece';
}

export interface StatusHistory {
  status: number | 'cancelled' | 'refunded';
  statusName: string;
  timestamp: string;
  updatedBy: string;
  notes?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 0 | 1 | 2 | 3 | 4 | 'cancelled' | 'refunded';
  createdAt: string;
  shippingAddress?: string;
  statusHistory?: StatusHistory[];
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const STORAGE_KEY = 'harish-cloths-orders';

const statusNames: Record<number | string, string> = {
  0: 'Order Placed',
  1: 'Processing',
  2: 'Shipped',
  3: 'Out for Delivery',
  4: 'Delivered',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
};

export function useOrdersAPI() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  };

  const loadFromLocalStorage = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (err) {
      console.error('Failed to load orders from localStorage:', err);
    }
    return [];
  };

  const saveToLocalStorage = (ordersData: Order[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ordersData));
    } catch (err) {
      console.error('Failed to save orders to localStorage:', err);
    }
  };

  // Fetch orders on mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
      // NEW — admin orders are at /api/v1/admin/orders
const response = await fetch(`${API_BASE_URL}/api/v1/admin/orders`, {
  headers: getAuthHeaders(),
});

        if (response.ok) {
          const data = await response.json();
          setOrders(data.data);
          setError(null);
        } else {
          throw new Error('API request failed');
        }
      } catch (err) {
        console.log('API unavailable, loading from localStorage');
        const localOrders = loadFromLocalStorage();
        setOrders(localOrders);
        setError('Using offline mode');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const addOrder = async (newOrder: Order) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/orders`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newOrder),
      });

      if (response.ok) {
        const savedOrder = await response.json();
        setOrders(prev => [savedOrder, ...prev]);
        toast.success('Order placed successfully!');
        return savedOrder;
      } else {
        throw new Error('API request failed');
      }
    } catch (err) {
      console.log('API unavailable, saving to localStorage');
      const updatedOrders = [newOrder, ...orders];
      setOrders(updatedOrders);
      saveToLocalStorage(updatedOrders);
      toast.success('Order placed! (Offline mode)');
      return newOrder;
    }
  };

  const updateOrderStatus = async (
    orderId: string,
    newStatus: Order['status'],
    notes?: string
  ) => {
    const statusHistoryEntry: StatusHistory = {
      status: newStatus,
      statusName: statusNames[newStatus] || 'Unknown',
      timestamp: new Date().toISOString(),
      updatedBy: 'Admin',
      notes,
    };

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/admin/orders/${orderId}/status`,
        {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify({ status: newStatus, notes }),
        }
      );

      if (response.ok) {
        const updatedOrder = await response.json();
        setOrders(prev =>
          prev.map(order =>
            order.id === orderId
              ? {
                  ...updatedOrder,
                  statusHistory: [
                    ...(updatedOrder.statusHistory || []),
                    statusHistoryEntry,
                  ],
                }
              : order
          )
        );
        toast.success('Order status updated successfully!');
        return updatedOrder;
      } else {
        throw new Error('API request failed');
      }
    } catch (err) {
      console.log('API unavailable, updating localStorage');
      const updatedOrders = orders.map(order =>
        order.id === orderId
          ? {
              ...order,
              status: newStatus,
              statusHistory: [
                ...(order.statusHistory || []),
                statusHistoryEntry,
              ],
            }
          : order
      );
      setOrders(updatedOrders);
      saveToLocalStorage(updatedOrders);
      toast.success('Order status updated! (Offline mode)');
    }
  };

  const getOrderById = (orderId: string) => {
    return orders.find(order => order.id === orderId);
  };

  return {
    orders,
    loading,
    error,
    addOrder,
    updateOrderStatus,
    getOrderById,
  };
}
