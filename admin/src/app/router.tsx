import { createBrowserRouter } from 'react-router';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLogin } from './pages/admin/Login';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminAnalytics } from './pages/admin/AdminAnalytics';
import { ProductsManagement } from './pages/admin/ProductsManagement';
import { OrdersManagement } from './pages/admin/OrdersManagement';
import { BrandsManagement } from './pages/admin/BrandsManagement';
import { CategoriesManagement } from './pages/admin/CategoriesManagement';
import { CustomersManagement } from './pages/admin/CustomersManagement';
import { AdminSettings } from './pages/admin/AdminSettings';
import { ProductOptionsManagement } from './pages/admin/ProductOptionsManagement';

// Customer-facing components (placeholders for now)
import Layout from './components/customer/Layout';
import Home from './pages/customer/Home';
import ProductDetail from './pages/customer/ProductDetail';
import Cart from './pages/customer/Cart';
import Checkout from './pages/customer/Checkout';
import Payment from './pages/customer/Payment';
import OrderSuccess from './pages/customer/OrderSuccess';
import MyOrders from './pages/customer/MyOrders';
import OrderDetail from './pages/customer/OrderDetail';
import NotFound from './pages/customer/NotFound';

const router = createBrowserRouter([
  // Customer-facing routes
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'product/:id',
        element: <ProductDetail />,
      },
      {
        path: 'cart',
        element: <Cart />,
      },
      {
        path: 'checkout',
        element: <Checkout />,
      },
      {
        path: 'payment',
        element: <Payment />,
      },
      {
        path: 'order-success',
        element: <OrderSuccess />,
      },
      {
        path: 'my-orders',
        element: <MyOrders />,
      },
      {
        path: 'order/:id',
        element: <OrderDetail />,
      },
    ],
  },

  // Admin routes
  {
    path: '/admin/login',
    element: <AdminLogin />,
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: 'analytics',
        element: <AdminAnalytics />,
      },
      {
        path: 'products',
        element: <ProductsManagement />,
      },
      {
        path: 'orders',
        element: <OrdersManagement />,
      },
      {
        path: 'brands',
        element: <BrandsManagement />,
      },
      {
        path: 'categories',
        element: <CategoriesManagement />,
      },
      {
        path: 'customers',
        element: <CustomersManagement />,
      },
      {
        path: 'settings',
        element: <AdminSettings />,
      },
      {
        path: 'product-options',
        element: <ProductOptionsManagement />,
      },
    ],
  },

  // 404 Not Found
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;
