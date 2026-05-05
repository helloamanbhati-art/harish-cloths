import { createBrowserRouter } from 'react-router';
import { Layout } from './pages/Layout';
import { Home } from './pages/Home';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Payment } from './pages/Payment';
import { OrderSuccess } from './pages/OrderSuccess';
import { MyOrders } from './pages/MyOrders';
import { OrderDetail } from './pages/OrderDetail';
import { NotFound } from './pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { 
        index: true, 
        element: <Home /> 
      },
      { 
        path: 'product/:id', 
        element: <ProductDetail /> 
      },
      { 
        path: 'cart', 
        element: <Cart /> 
      },
      { 
        path: 'checkout', 
        element: <Checkout /> 
      },
      { 
        path: 'payment', 
        element: <Payment /> 
      },
      { 
        path: 'order-success', 
        element: <OrderSuccess /> 
      },
      { 
        path: 'my-orders', 
        element: <MyOrders /> 
      },
      { 
        path: 'order/:id', 
        element: <OrderDetail /> 
      },
      { 
        path: '*', 
        element: <NotFound /> 
      },
    ],
  },
]);