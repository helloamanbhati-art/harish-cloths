# Admin Panel Folder Structure

## Current Organization

The admin panel code is organized in the following structure:

```
/admin/
├── components/
│   └── Logo.tsx                  # Admin panel logo component
│
└── pages/
    ├── AdminLayout.tsx           # Main layout with sidebar & navbar
    ├── AdminLogin.tsx            # Admin login page
    ├── AdminDashboard.tsx        # Dashboard with stats & charts
    ├── Analytics.tsx             # Analytics page with detailed charts
    ├── ProductsManagement.tsx    # Full CRUD for products
    ├── OrdersManagement.tsx      # Order management & status updates
    ├── BrandsManagement.tsx      # Brand management
    ├── CategoriesManagement.tsx  # Category management
    ├── CustomersManagement.tsx   # Customer management
    └── AdminSettings.tsx         # Settings management

/pages/admin/  (Original location - can be deleted after migration)
├── AdminLayout.tsx
├── AdminLogin.tsx
├── AdminDashboard.tsx
├── Analytics.tsx
├── ProductsManagement.tsx
├── OrdersManagement.tsx
├── BrandsManagement.tsx
├── CategoriesManagement.tsx
├── CustomersManagement.tsx
└── AdminSettings.tsx

/components/admin/  (Original location - can be deleted after migration)
└── Logo.tsx

/contexts/  (Shared with frontend)
├── OrderContext.tsx
├── CartContext.tsx
├── CartIconContext.tsx
└── ThemeContext.tsx

/components/ui/  (Shared UI components)
├── button.tsx
├── input.tsx
├── card.tsx
├── table.tsx
├── dialog.tsx
├── select.tsx
├── badge.tsx
└── ... (all other UI components)

/data/  (Temporary mock data - will be replaced by backend)
└── products.ts
```

## Import Path Changes

### For files in `/admin/pages/`:
```typescript
// Old imports (from /pages/admin/):
import { Logo } from '../../components/admin/Logo';
import { Button } from '../../components/ui/button';
import { OrderContext } from '../../contexts/OrderContext';

// New imports (from /admin/pages/):
import { Logo } from '../components/Logo';
import { Button } from '../../components/ui/button';
import { OrderContext } from '../../contexts/OrderContext';
```

### For files in `/admin/components/`:
```typescript
// Imports remain mostly the same:
import { cn } from '../../components/ui/utils';
```

## Routes Configuration

### Current routes.tsx structure:
```typescript
import { createBrowserRouter } from "react-router";

// Customer-facing pages
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { ProductDetail } from "./pages/ProductDetail";
import { Cart } from "./pages/Cart";
import { Checkout } from "./pages/Checkout";
import { Payment } from "./pages/Payment";
import { OrderSuccess } from "./pages/OrderSuccess";
import { MyOrders } from "./pages/MyOrders";
import { OrderDetail } from "./pages/OrderDetail";
import { NotFound } from "./pages/NotFound";

// Admin pages
import { AdminLayout } from "./admin/pages/AdminLayout";
import { AdminLogin } from "./pages/admin/AdminLogin";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { ProductsManagement } from "./pages/admin/ProductsManagement";
import { OrdersManagement } from "./pages/admin/OrdersManagement";
import { BrandsManagement } from "./pages/admin/BrandsManagement";
import { CategoriesManagement } from "./pages/admin/CategoriesManagement";
import { CustomersManagement } from "./pages/admin/CustomersManagement";
import { AdminSettings } from "./pages/admin/AdminSettings";
import { Analytics } from "./pages/admin/Analytics";

export const router = createBrowserRouter([
  // Customer routes
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "product/:id", Component: ProductDetail },
      { path: "cart", Component: Cart },
      { path: "checkout", Component: Checkout },
      { path: "payment", Component: Payment },
      { path: "order-success", Component: OrderSuccess },
      { path: "my-orders", Component: MyOrders },
      { path: "order/:id", Component: OrderDetail },
    ],
  },
  
  // Admin routes
  {
    path: "/admin/login",
    Component: AdminLogin,
  },
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      { index: true, Component: AdminDashboard },
      { path: "analytics", Component: Analytics },
      { path: "products", Component: ProductsManagement },
      { path: "orders", Component: OrdersManagement },
      { path: "brands", Component: BrandsManagement },
      { path: "categories", Component: CategoriesManagement },
      { path: "customers", Component: CustomersManagement },
      { path: "settings", Component: AdminSettings },
    ],
  },
  
  // 404 page
  {
    path: "*",
    Component: NotFound,
  },
]);
```

## Key Features

### Admin Panel Features:
1. **Authentication System**
   - Login page with demo credentials
   - JWT-based auth (localStorage for now)
   - Protected routes

2. **Dashboard**
   - Revenue stats
   - Order stats
   - Customer stats
   - Product stats
   - Recent orders list
   - Top selling products
   - Low stock alerts

3. **Analytics Page**
   - Revenue overview chart
   - Monthly performance comparison
   - Category distribution pie chart
   - Top selling products
   - Time range filters (7d, 30d, 90d, 1y)

4. **Product Management**
   - Full CRUD operations
   - Image upload support
   - Stock management
   - Selling unit (meter/piece)
   - Category & brand assignment
   - Search & filters

5. **Order Management**
   - Order list with filters
   - Status updates (pending, confirmed, processing, shipped, delivered, cancelled)
   - Order details view
   - Customer information
   - Payment information

6. **Brand Management**
   - Add, edit, delete brands
   - Logo upload
   - Active/inactive toggle

7. **Category Management**
   - Add, edit, delete categories
   - Image upload
   - Active/inactive toggle

8. **Customer Management**
   - Customer list
   - Customer details
   - Order history
   - Active/inactive toggle

9. **Settings**
   - Business information
   - Payment settings
   - Shipping settings
   - Tax (GST) settings
   - Email settings

10. **UI Features**
    - Dark/Light mode toggle
    - Responsive sidebar
    - Professional color scheme
    - Smooth animations
    - Toast notifications

## Shared Dependencies

### Contexts (used by both frontend and admin):
- `OrderContext` - Manages orders data
- `CartContext` - Manages cart state
- `CartIconContext` - Manages cart icon animations
- `ThemeContext` - Manages dark/light theme

### UI Components (shared):
All components in `/components/ui/` are shared between customer-facing pages and admin panel.

## Data Flow

### Current State (Development):
```
Admin Panel (UI)
    ↓
Mock Data (/data/products.ts)
    ↓
React Context (OrderContext, etc.)
    ↓
Local State Management
```

### After Backend Integration:
```
Admin Panel (UI)
    ↓
API Calls (fetch/axios)
    ↓
Backend REST API
    ↓
Database (PostgreSQL/MongoDB)
    ↓
Response
    ↓
React Context (with API data)
    ↓
Admin Panel (UI updated)
```

## Backend Integration Points

When backend is ready, replace these with API calls:

1. **Products**: 
   - GET /api/v1/admin/products
   - POST /api/v1/admin/products
   - PUT /api/v1/admin/products/:id
   - DELETE /api/v1/admin/products/:id

2. **Orders**:
   - GET /api/v1/admin/orders
   - PUT /api/v1/admin/orders/:id/status

3. **Brands**:
   - GET /api/v1/admin/brands
   - POST /api/v1/admin/brands
   - PUT /api/v1/admin/brands/:id
   - DELETE /api/v1/admin/brands/:id

4. **Categories**:
   - GET /api/v1/admin/categories
   - POST /api/v1/admin/categories
   - PUT /api/v1/admin/categories/:id
   - DELETE /api/v1/admin/categories/:id

5. **Customers**:
   - GET /api/v1/admin/customers
   - GET /api/v1/admin/customers/:id
   - PUT /api/v1/admin/customers/:id

6. **Settings**:
   - GET /api/v1/admin/settings
   - PUT /api/v1/admin/settings

7. **Analytics**:
   - GET /api/v1/admin/dashboard/stats
   - GET /api/v1/admin/analytics/revenue
   - GET /api/v1/admin/analytics/categories

8. **Authentication**:
   - POST /api/v1/admin/auth/login
   - POST /api/v1/admin/auth/logout
   - GET /api/v1/admin/auth/me

## Environment Setup

### Required Environment Variables (Frontend):
```env
VITE_API_URL=http://localhost:3000/api/v1
VITE_ADMIN_API_URL=http://localhost:3000/api/v1/admin
VITE_RAZORPAY_KEY_ID=your_razorpay_key
```

### API Service Setup:
Create `/services/api.ts`:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL;
const ADMIN_API_URL = import.meta.env.VITE_ADMIN_API_URL;

export const api = {
  get: (url: string) => fetch(`${API_BASE_URL}${url}`).then(r => r.json()),
  post: (url: string, data: any) => fetch(`${API_BASE_URL}${url}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  // ... put, delete, etc.
};

export const adminApi = {
  // Same structure but uses ADMIN_API_URL
  // Includes auth token in headers
};
```

## Migration Checklist

- [x] Created `/admin/components/Logo.tsx`
- [x] Created `/admin/pages/AdminLayout.tsx`
- [ ] Move remaining admin pages to `/admin/pages/`
- [ ] Update all import paths
- [ ] Update routes.tsx to use new paths
- [ ] Test all admin functionality
- [ ] Delete old `/pages/admin/` folder
- [ ] Delete old `/components/admin/` folder
- [ ] Update documentation

## Notes

- The admin panel is fully functional with mock data
- All UI components are complete and styled
- Dark mode is fully implemented
- Ready for backend API integration
- No hardcoded data on production - all admin-controlled
