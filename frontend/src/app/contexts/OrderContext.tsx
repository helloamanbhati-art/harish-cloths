import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../data/products';

export interface OrderItem {
  product: Product;
  quantity: number;
  selectedMeters?: number;
}

export interface OrderStatusHistory {
  status: number;
  statusName: string;
  timestamp: string;
  location?: string;
  updatedBy?: string; // For admin dashboard tracking
  notes?: string;
}

export interface PaymentDetails {
  method: 'Razorpay' | 'UPI' | 'Card' | 'NetBanking' | 'Wallet';
  transactionId: string;
  paymentStatus: 'Pending' | 'Completed' | 'Failed' | 'Refunded';
  paidAmount: number;
  paymentDate: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  upiId?: string;
  cardLast4?: string;
  bankName?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  trackingId: string;
  invoiceNumber: string;
  items: OrderItem[];
  
  // Pricing
  subtotal: number; // Items total
  shippingCharges: number;
  discount: number;
  totalPrice: number; // Final amount to pay
  
  // Dates
  orderDate: string;
  estimatedDelivery: string;
  actualDeliveryDate?: string;
  
  // Status
  currentStatus: number;
  statusHistory: OrderStatusHistory[];
  
  // Courier
  courierPartner: {
    name: string;
    phone: string;
    email: string;
    gradient: string;
    website: string;
    description: string;
    trackingUrl?: string;
  };
  
  // Customer Details (for dashboard)
  customer: {
    id?: string;
    name: string;
    email?: string;
    phone: string;
  };
  
  // Shipping Address
  shippingAddress: {
    name: string;
    phone: string;
    email?: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
    addressType?: 'Home' | 'Office' | 'Other';
  };
  
  // Billing Address (can be different)
  billingAddress?: {
    name: string;
    phone: string;
    email?: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    pincode: string;
  };
  
  // Payment
  paymentDetails: PaymentDetails;
  
  // Admin/Dashboard fields
  orderNotes?: string; // Internal notes for admins
  customerNotes?: string; // Special delivery instructions from customer
  returnRequested?: boolean;
  returnReason?: string;
  refundStatus?: 'None' | 'Requested' | 'Processing' | 'Completed';
  cancellationRequested?: boolean;
  cancellationReason?: string;
  
  // Metadata
  orderSource: 'Website' | 'Mobile App' | 'Phone' | 'Admin';
  ipAddress?: string;
  deviceType?: 'Desktop' | 'Mobile' | 'Tablet';
}

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Order) => void;
  getOrderById: (id: string) => Order | undefined;
  updateOrderStatus: (orderId: string, status: number, notes?: string) => void;
  cancelOrder: (orderId: string, reason: string) => void;
  requestReturn: (orderId: string, reason: string) => void;
  addOrderNote: (orderId: string, note: string) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(() => {
    // Load orders from localStorage on init
    const savedOrders = localStorage.getItem('harish-cloths-orders');
    return savedOrders ? JSON.parse(savedOrders) : [];
  });

  // Save orders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('harish-cloths-orders', JSON.stringify(orders));
  }, [orders]);

  const addOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev]); // Add new order at the beginning
  };

  const getOrderById = (id: string) => {
    return orders.find((order) => order.id === id);
  };

  const updateOrderStatus = (orderId: string, status: number, notes?: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const statusNames = ['Order Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
          const newStatusHistory: OrderStatusHistory = {
            status,
            statusName: statusNames[status],
            timestamp: new Date().toISOString(),
            notes,
            updatedBy: 'System', // In backend, this would be admin user ID
          };
          
          return {
            ...order,
            currentStatus: status,
            statusHistory: [...order.statusHistory, newStatusHistory],
            actualDeliveryDate: status === 4 ? new Date().toISOString() : order.actualDeliveryDate,
          };
        }
        return order;
      })
    );
  };

  const cancelOrder = (orderId: string, reason: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              cancellationRequested: true,
              cancellationReason: reason,
              orderNotes: `${order.orderNotes || ''}\n[${new Date().toLocaleString()}] Cancellation requested: ${reason}`,
            }
          : order
      )
    );
  };

  const requestReturn = (orderId: string, reason: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              returnRequested: true,
              returnReason: reason,
              refundStatus: 'Requested',
              orderNotes: `${order.orderNotes || ''}\n[${new Date().toLocaleString()}] Return requested: ${reason}`,
            }
          : order
      )
    );
  };

  const addOrderNote = (orderId: string, note: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              orderNotes: `${order.orderNotes || ''}\n[${new Date().toLocaleString()}] ${note}`,
            }
          : order
      )
    );
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        addOrder,
        getOrderById,
        updateOrderStatus,
        cancelOrder,
        requestReturn,
        addOrderNote,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within OrderProvider');
  }
  return context;
}