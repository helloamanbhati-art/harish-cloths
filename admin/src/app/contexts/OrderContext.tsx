import { createContext, useContext, ReactNode, useEffect } from 'react';
import { useOrdersAPI, Order, OrderItem, StatusHistory } from '../hooks/useOrdersAPI';

export type { Order, OrderItem, StatusHistory };

interface OrderContextType {
  orders: Order[];
  loading: boolean;
  error: string | null;
  addOrder: (order: Order) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: Order['status'], notes?: string) => Promise<Order | void>;
  getOrderById: (orderId: string) => Order | undefined;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const api = useOrdersAPI();

  // All orders are now fetched from real API via useOrdersAPI hook
  // No demo data injection needed


  return (
    <OrderContext.Provider value={{
      orders: api.orders,
      loading: api.loading,
      error: api.error,
      addOrder: api.addOrder,
      updateOrderStatus: api.updateOrderStatus,
      getOrderById: api.getOrderById,
    }}>
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
