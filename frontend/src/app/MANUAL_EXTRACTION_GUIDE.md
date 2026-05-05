# 📋 Manual Admin Panel Extraction Guide

## Quick Start (3 Methods)

### ⚡ Method 1: Run Python Script (Recommended - 30 seconds)
```bash
# From project root
python3 extract_admin_panel.py
```
**Done!** Skip to "Testing" section below.

---

### 🔧 Method 2: Run Shell Script (Alternative - 1 minute)
```bash
# Make script executable
chmod +x EXTRACT_ADMIN_SCRIPT.sh

# Run it
./EXTRACT_ADMIN_SCRIPT.sh
```
**Done!** Skip to "Testing" section below.

---

### 👐 Method 3: Manual Extraction (If scripts don't work - 10 minutes)

Follow these steps carefully:

#### Step 1: Create Directory Structure
```bash
mkdir -p admin-panel/pages
mkdir -p admin-panel/components/ui
mkdir -p admin-panel/contexts
mkdir -p admin-panel/types
mkdir -p admin-panel/data
mkdir -p admin-panel/hooks
mkdir -p admin-panel/styles
```

#### Step 2: Copy Admin Pages (10 files)
```bash
cp pages/admin/AdminDashboard.tsx admin-panel/pages/
cp pages/admin/AdminLogin.tsx admin-panel/pages/
cp pages/admin/AdminLayout.tsx admin-panel/pages/
cp pages/admin/Analytics.tsx admin-panel/pages/
cp pages/admin/ProductsManagement.tsx admin-panel/pages/
cp pages/admin/OrdersManagement.tsx admin-panel/pages/
cp pages/admin/BrandsManagement.tsx admin-panel/pages/
cp pages/admin/CategoriesManagement.tsx admin-panel/pages/
cp pages/admin/CustomersManagement.tsx admin-panel/pages/
cp pages/admin/AdminSettings.tsx admin-panel/pages/
```

#### Step 3: Copy Admin Components
```bash
cp components/admin/Logo.tsx admin-panel/components/
```

#### Step 4: Copy ALL UI Components (50+ files)
```bash
cp components/ui/* admin-panel/components/ui/
```

This copies all shadcn/ui components:
- accordion.tsx, alert.tsx, avatar.tsx, badge.tsx, button.tsx
- card.tsx, checkbox.tsx, dialog.tsx, dropdown-menu.tsx, input.tsx
- label.tsx, select.tsx, separator.tsx, sheet.tsx, sidebar.tsx
- skeleton.tsx, slider.tsx, switch.tsx, table.tsx, tabs.tsx
- textarea.tsx, toast.tsx, tooltip.tsx, etc.
- **Plus utilities**: use-mobile.ts, utils.ts

#### Step 5: Copy Contexts (4 files)
```bash
cp contexts/ThemeContext.tsx admin-panel/contexts/
cp contexts/OrderContext.tsx admin-panel/contexts/
cp contexts/CartContext.tsx admin-panel/contexts/
cp contexts/CartIconContext.tsx admin-panel/contexts/
```

#### Step 6: Copy Types
```bash
cp types/product.ts admin-panel/types/
```

#### Step 7: Copy Data
```bash
cp data/products.ts admin-panel/data/
```

#### Step 8: Copy Hooks
```bash
cp hooks/useTheme.ts admin-panel/hooks/ 2>/dev/null || echo "useTheme.ts not found (OK if using context)"
```

#### Step 9: Copy Styles
```bash
cp styles/globals.css admin-panel/styles/
```

#### Step 10: Update Import Paths in Admin Panel Files

**Critical!** Update these files to fix import paths:

**In ALL files in `admin-panel/pages/`**, replace:
```typescript
// OLD:
import { Something } from '../../components/ui/something';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { Logo } from '../../components/admin/Logo';

// NEW:
import { Something } from '../components/ui/something';
import { ThemeProvider } from '../contexts/ThemeContext';
import { Logo } from '../components/Logo';
```

**Specific replacements needed:**

| File | Old Import | New Import |
|------|-----------|------------|
| All pages/*.tsx | `'../../components/ui/'` | `'../components/ui/'` |
| All pages/*.tsx | `'../../components/admin/'` | `'../components/'` |
| All pages/*.tsx | `'../../contexts/'` | `'../contexts/'` |
| All pages/*.tsx | `'../../data/'` | `'../data/'` |
| All pages/*.tsx | `'../../types/'` | `'../types/'` |
| AdminLayout.tsx | `'../components/Logo'` | `'./components/Logo'` |

**Use Find & Replace in your editor:**
1. Open `admin-panel/pages/` folder
2. Find: `'../../components/ui/` → Replace: `'../components/ui/`
3. Find: `'../../contexts/` → Replace: `'../contexts/`
4. Find: `'../../components/admin/` → Replace: `'../components/`
5. Find: `'../../data/` → Replace: `'../data/`
6. Find: `"../../components/ui/` → Replace: `"../components/ui/`
7. Find: `"../../contexts/` → Replace: `"../contexts/`
8. Find: `"../../components/admin/` → Replace: `"../components/`

#### Step 11: Remove Admin from Main App
```bash
# Remove admin pages
rm -rf pages/admin/

# Remove admin components
rm -rf admin/
rm -rf components/admin/
```

#### Step 12: Update Main App Routes

Edit `/routes.tsx` and:

1. **Remove these imports:**
```typescript
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { Analytics } from './pages/admin/Analytics';
import { ProductsManagement } from './pages/admin/ProductsManagement';
import { OrdersManagement } from './pages/admin/OrdersManagement';
import { BrandsManagement } from './pages/admin/BrandsManagement';
import { CategoriesManagement } from './pages/admin/CategoriesManagement';
import { CustomersManagement } from './pages/admin/CustomersManagement';
import { AdminSettings } from './pages/admin/AdminSettings';
```

2. **Remove this entire route block:**
```typescript
  // Admin Routes
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
        element: <Analytics />,
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
    ],
  },
```

3. **Your routes.tsx should now only have customer routes:**
```typescript
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
      { index: true, element: <Home /> },
      { path: 'product/:id', element: <ProductDetail /> },
      { path: 'cart', element: <Cart /> },
      { path: 'checkout', element: <Checkout /> },
      { path: 'payment', element: <Payment /> },
      { path: 'order-success', element: <OrderSuccess /> },
      { path: 'my-orders', element: <MyOrders /> },
      { path: 'order/:id', element: <OrderDetail /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
```

---

## ✅ Testing

### Test Customer App (Main)
```bash
# From project root
npm run dev

# Visit http://localhost:5173
# Should only show customer pages (no /admin routes)
```

### Test Admin Panel
```bash
# Navigate to admin panel
cd admin-panel

# Install dependencies (if needed)
npm install

# Run admin panel
npm run dev

# Visit http://localhost:5174
# Login: admin@harishcloths.com / admin123
```

---

## 🚨 Troubleshooting

### Error: "Cannot find module '../components/ui/button'"
**Fix:** You didn't update import paths correctly. Re-do Step 10.

### Error: "Cannot find module './contexts/ThemeContext'"
**Fix:** Missing context files. Re-do Step 5.

### Admin panel shows blank screen
**Fix:** Check browser console. Usually missing imports or incorrect paths.

### Main app still shows admin routes
**Fix:** You didn't update `/routes.tsx`. Re-do Step 12.

---

## 📦 Final Structure

```
project-root/
├── admin-panel/           ← NEW: Standalone admin app
│   ├── App.tsx
│   ├── routes.tsx
│   ├── pages/            (10 files)
│   ├── components/
│   │   ├── Logo.tsx
│   │   └── ui/          (50+ files)
│   ├── contexts/        (4 files)
│   ├── types/           (1 file)
│   ├── data/            (1 file)
│   ├── hooks/           (1 file)
│   └── styles/          (1 file)
│
└── (main app)           ← UPDATED: Customer app only
    ├── App.tsx
    ├── routes.tsx        (admin routes removed)
    ├── pages/            (NO admin folder)
    │   ├── Home.tsx
    │   ├── Cart.tsx
    │   └── ... (customer pages only)
    └── components/       (NO admin folder)
```

---

## ✅ Success Checklist

- [ ] `admin-panel/` folder exists with all files
- [ ] All import paths updated in admin panel
- [ ] `pages/admin/` deleted from main app
- [ ] `components/admin/` deleted from main app
- [ ] `/routes.tsx` updated (no admin imports/routes)
- [ ] Customer app runs without errors (`npm run dev`)
- [ ] Admin panel runs independently (`cd admin-panel && npm run dev`)
- [ ] Can login to admin: admin@harishcloths.com / admin123
- [ ] Both dark/light modes work in admin panel

---

## 🎯 What's Next?

1. **Configure separate builds** - See `/ADMIN_PANEL_EXTRACTION_COMPLETE.md`
2. **Set up backend API** - Replace mock data with real endpoints
3. **Deploy to separate domains:**
   - Customer: `yourdomain.com`
   - Admin: `admin.yourdomain.com`

---

**Need help?** Check `/ADMIN_PANEL_EXTRACTION_COMPLETE.md` for deployment guide.
