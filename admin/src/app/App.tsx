import { RouterProvider } from 'react-router';
import { Toaster } from './components/ui/sonner';
import { ThemeProvider } from './contexts/ThemeContext';
import { OrderProvider } from './contexts/OrderContext';
import { CartProvider } from './contexts/CartContext';
import { CartIconProvider } from './contexts/CartIconContext';
import { BrandProvider } from './contexts/BrandContext';
import { CategoryProvider } from './contexts/CategoryContext';
import router from './router';

export default function App() {
  return (
    <ThemeProvider>
      <BrandProvider>
        <CategoryProvider>
          <OrderProvider>
            <CartProvider>
              <CartIconProvider>
                <Toaster position="top-right" />
                <RouterProvider router={router} />
              </CartIconProvider>
            </CartProvider>
          </OrderProvider>
        </CategoryProvider>
      </BrandProvider>
    </ThemeProvider>
  );
}
