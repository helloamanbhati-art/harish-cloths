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
  status:
    | 0
    | 1
    | 2
    | 3
    | 4
    | 'pending'
    | 'confirmed'
    | 'processing'
    | 'shipped'
    | 'out_for_delivery'
    | 'delivered'
    | 'cancelled'
    | 'refunded';
  statusName: string;
  timestamp: string;
  updatedBy: string;
  notes?: string;
}

export interface Order {
  id: string;
  _id?: string;
  orderNumber?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod?: string;
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded' | 'cancelled';
  shippingMethod?: string;
  carrier?: string;
  trackingNumber?: string;
  billingAddress?: any;
  paymentDetails?: {
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
    transactionId?: string;
    paidAmount?: number;
    paidAt?: string;
    failureReason?: string;
  };
  status:
    | 0
    | 1
    | 2
    | 3
    | 4
    | 'pending'
    | 'confirmed'
    | 'processing'
    | 'shipped'
    | 'out_for_delivery'
    | 'delivered'
    | 'cancelled'
    | 'refunded';
  createdAt: string;
  shippingAddress?: string;
  statusHistory?: StatusHistory[];
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const normalizeOrder = (order: any): Order => ({
  ...order,
  id: order.id || order._id || '',
  _id: order._id || order.id,
  orderNumber: order.orderNumber || (order._id ? String(order._id).slice(-10) : undefined),
  status: order.status,
  createdAt: order.createdAt || '',
  paymentStatus: order.paymentStatus,
  paymentMethod: order.paymentMethod,
  paymentDetails: order.paymentDetails || {},
  shippingMethod: order.shippingMethod,
  carrier: order.carrier,
  trackingNumber: order.trackingNumber,
  billingAddress: order.billingAddress,
});
const STORAGE_KEY = 'harish-cloths-orders';

const statusNames: Record<number | string, string> = {
  0: 'Order Placed',
  1: 'Processing',
  2: 'Shipped',
  3: 'Out for Delivery',
  4: 'Delivered',
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
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
      // Skip fetching if no token (user not authenticated)
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setOrders([]);
        setLoading(false);
        return;
      }

      try {
      // NEW — admin orders are at /api/v1/admin/orders
const response = await fetch(`${API_BASE_URL}/api/v1/admin/orders`, {
  headers: getAuthHeaders(),
});

        if (response.ok) {
          const data = await response.json();
          const normalizedOrders = (data.data || []).map(normalizeOrder);
          setOrders(normalizedOrders);
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
        const savedResponse = await response.json();
        const savedOrder = savedResponse.data?.order || savedResponse.data || savedResponse;
        const normalizedOrder = normalizeOrder(savedOrder);
        setOrders(prev => [normalizedOrder, ...prev]);
        toast.success('Order placed successfully!');
        return normalizedOrder;
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
        const updateResponse = await response.json();
        const updatedOrder = updateResponse.data || updateResponse;
        const normalizedOrder = normalizeOrder(updatedOrder);
        setOrders(prev =>
          prev.map(order =>
            order.id === orderId || order._id === orderId
              ? {
                  ...normalizedOrder,
                  statusHistory: [
                    ...(normalizedOrder.statusHistory || []),
                    statusHistoryEntry,
                  ],
                }
              : order
          )
        );
        toast.success('Order status updated successfully!');
        return normalizedOrder;
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
    return orders.find(order => order.id === orderId || order._id === orderId);
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
