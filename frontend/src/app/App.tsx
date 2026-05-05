import { RouterProvider } from "react-router";
import { router } from "./routes.tsx";
import { Toaster } from './components/ui/sonner';
import { ProductProvider } from './contexts/ProductContext';
import { CartProvider } from './contexts/CartContext';
import { OrderProvider } from './contexts/OrderContext';

export default function App() {
  return (
    <ProductProvider>
      <CartProvider>
        <OrderProvider>
          <RouterProvider router={router} />
          <Toaster />
        </OrderProvider>
      </CartProvider>
    </ProductProvider>
  );
}