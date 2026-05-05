# Harish Cloths - Admin Panel Guide

## Overview
Complete admin dashboard for managing luxury women's clothing fabrics e-commerce platform with comprehensive analytics, dark/light mode, and full CRUD operations.

## 🔐 Login Credentials
- **Email**: `admin@harishcloths.com`
- **Password**: `admin123`
- **Login URL**: `/admin/login`

## 📁 File Structure

### Admin Pages (`/pages/admin/`)
```
├── AdminLayout.tsx          # Main layout with sidebar, navbar, dark mode
├── AdminLogin.tsx           # Authentication page
├── AdminDashboard.tsx       # Overview with stats and recent activity
├── Analytics.tsx            # NEW: Comprehensive analytics with charts
├── ProductsManagement.tsx   # CRUD for products
├── OrdersManagement.tsx     # Order management and status updates
├── BrandsManagement.tsx     # Brand management
├── CategoriesManagement.tsx # Category management
├── CustomersManagement.tsx  # Customer data management
└── AdminSettings.tsx        # System settings
```

### Components (`/components/`)
```
├── admin/
│   └── Logo.tsx            # NEW: Admin panel logo component
├── ui/                     # Shadcn UI components (improved for dark mode)
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── badge.tsx
│   └── ... (other UI components)
└── ErrorBoundary.tsx       # Error handling component
```

### Contexts (`/contexts/`)
```
├── OrderContext.tsx        # Order state management
├── CartContext.tsx         # Cart state management
├── CartIconContext.tsx     # Cart icon animations
└── ThemeContext.tsx        # NEW: Dark/Light mode management
```

## 🎨 Features

### 1. Analytics Dashboard (`/admin/analytics`)
**NEW FEATURE** - Comprehensive business insights:
- **Revenue Overview**: Daily revenue tracking with area charts
- **Monthly Performance**: Bar charts comparing revenue and orders
- **Category Distribution**: Pie chart showing sales by category
- **Top Products**: List of best-performing products
- **Time Range Filters**: 7 days, 30 days, 90 days, 1 year
- **Key Metrics Cards**: Revenue, Orders, Avg Order Value, Products
- **Interactive Charts**: Built with Recharts library

### 2. Dark/Light Mode Toggle
- **Theme Toggle Button**: Sun/Moon icon in navbar
- **Persistent State**: Saves preference to localStorage
- **Smooth Transitions**: All components support dark mode
- **Improved Colors**: Better contrast and readability
- **Context-based**: Uses ThemeContext for global state

### 3. Enhanced UI Components
- **Logo Component**: Professional branded logo in navbar
- **Gradient Sidebar**: Purple to indigo gradient for active items
- **Better Badges**: Dark mode support for status badges
- **Improved Cards**: Shadow and border improvements
- **Color Consistency**: Unified color scheme across all pages

### 4. Dashboard Features
- **Quick Stats**: Revenue, Orders, Products, Customers
- **Trend Indicators**: Up/down arrows with percentage changes
- **Recent Orders**: Latest 5 orders with status badges
- **Top Products**: Best-selling items with images
- **Low Stock Alerts**: Warning for out-of-stock items
- **Real-time Data**: Pulls from OrderContext and products data

### 5. Full CRUD Operations
All management pages support:
- ✅ Create new items
- ✅ Read/View all items
- ✅ Update existing items
- ✅ Delete items
- ✅ Search functionality
- ✅ Filters and sorting
- ✅ Pagination

## 🎯 Navigation Menu

### Main Menu Items:
1. **Dashboard** (`/admin`) - Overview and quick stats
2. **Analytics** (`/admin/analytics`) - NEW: Charts and insights
3. **Products** (`/admin/products`) - Product management (Badge: 156)
4. **Orders** (`/admin/orders`) - Order management (Badge: 12)
5. **Brands** (`/admin/brands`) - Brand CRUD
6. **Categories** (`/admin/categories`) - Category CRUD
7. **Customers** (`/admin/customers`) - Customer management
8. **Settings** (`/admin/settings`) - System configuration
9. **Logout** - Clear session and return to login

## 🌓 Dark Mode Implementation

### How It Works:
```typescript
// ThemeContext provides theme state
const { theme, toggleTheme } = useTheme();

// Toggle button in navbar
<Button onClick={toggleTheme}>
  {theme === 'dark' ? <Sun /> : <Moon />}
</Button>
```

### Components with Dark Mode:
- ✅ AdminLayout (navbar, sidebar, background)
- ✅ All Cards (background, borders, text)
- ✅ All Badges (status colors)
- ✅ Charts (Recharts with dark mode support)
- ✅ Forms and Inputs
- ✅ Buttons and Links

## 📊 Analytics Page Components

### Charts Included:
1. **Area Chart** - Daily revenue trend (30 days)
2. **Bar Chart** - Monthly revenue vs orders comparison
3. **Pie Chart** - Category distribution (Silk, Cotton, Chiffon, Linen)

### Metrics Tracked:
- Total Revenue (₹)
- Total Orders
- Average Order Value (₹)
- Total Products
- Top 5 Selling Products
- Sales by Category

## 🎨 Color Scheme

### Light Mode:
- Background: `bg-gray-50`
- Cards: `bg-white`
- Text: `text-gray-900`
- Borders: `border-gray-200`

### Dark Mode:
- Background: `bg-gray-900`
- Cards: `bg-gray-800`
- Text: `text-white`
- Borders: `border-gray-700`

### Brand Colors:
- Primary: Purple 600 → Indigo 600 gradient
- Success: Green 600
- Warning: Orange 600
- Error: Red 600
- Info: Blue 600

## 🔄 State Management

### OrderProvider
Wraps admin layout to provide order data and methods:
- `orders` - Array of all orders
- `addOrder()` - Create new order
- `updateOrderStatus()` - Update order status
- `cancelOrder()` - Cancel order
- `requestReturn()` - Process return

### ThemeProvider
Manages dark/light mode:
- `theme` - Current theme ('light' | 'dark')
- `toggleTheme()` - Switch between themes
- Persists to localStorage

## 📱 Responsive Design

### Breakpoints:
- **Mobile**: < 768px (hamburger menu, stacked layout)
- **Tablet**: 768px - 1024px (sidebar visible)
- **Desktop**: > 1024px (full layout with sidebar)

### Mobile Features:
- Collapsible sidebar
- Hamburger menu button
- Overlay backdrop
- Touch-friendly buttons
- Responsive charts

## 🚀 Getting Started

1. **Access Admin Panel**: Navigate to `/admin/login`
2. **Login**: Use credentials above
3. **Explore Dashboard**: View overview stats
4. **Check Analytics**: See detailed charts at `/admin/analytics`
5. **Toggle Theme**: Click sun/moon icon in navbar
6. **Manage Data**: Use CRUD operations on all entities

## 📈 Future Enhancements

- [ ] Real-time notifications
- [ ] Advanced filters in analytics
- [ ] Export reports (PDF/Excel)
- [ ] Role-based access control
- [ ] Activity logs
- [ ] Bulk operations
- [ ] Email notifications
- [ ] Inventory management
- [ ] GST reports

## 🛠 Technologies Used

- **React Router** - Navigation (react-router, not react-router-dom)
- **Recharts** - Analytics charts
- **Tailwind CSS** - Styling with dark mode support
- **Lucide React** - Icons
- **Sonner** - Toast notifications
- **LocalStorage** - Data persistence
- **Context API** - State management

## 💡 Tips

1. **Dark Mode**: Toggle anytime with navbar button
2. **Search**: Use search bar in navbar for quick access
3. **Notifications**: Bell icon shows 3 pending notifications
4. **Responsive**: Works on all device sizes
5. **Logo**: Professional branding in navbar
6. **Analytics**: Time range filters for different views
7. **Charts**: Hover for detailed tooltips

---

**Last Updated**: March 2026
**Version**: 2.0
**Admin Email**: admin@harishcloths.com
