# Harish Cloths - Admin Dashboard

A modern, full-featured admin dashboard for managing an Indian fabric e-commerce platform, built with React, TypeScript, and Tailwind CSS.

## 🎨 Features

### Admin Panel

#### Dashboard
- **Real-time Stats**: Revenue, Orders, Products, and Active Customers
- **Analytics Charts**: 
  - Revenue over time (Area chart)
  - Sales by category (Pie chart)
  - Monthly revenue (Bar chart)
  - User growth trends
- **Recent Orders**: Quick view of latest orders with status
- **Top Products**: Best-selling items by revenue
- **Low Stock Alerts**: Automatic notifications for out-of-stock items

#### Products Management
- ✅ **Image Upload**: Drag-and-drop file upload (ready for backend)
- ✅ **CRUD Operations**: Create, Read, Update, Delete products
- ✅ **Advanced Filters**: By category, brand, and stock status
- ✅ **Real-time Search**: Instant product filtering
- ✅ **Stock Toggle**: Quick in/out of stock updates
- ✅ **Selling Units**: Support for meter and piece-based pricing
- ✅ **Modern Card Layout**: Beautiful product cards with all details

#### Orders Management
- **Comprehensive Order View**: All order details in one place
- **Status Management**: Update order status with history tracking
- **Customer Information**: Full customer details and shipping address
- **Order Items**: Detailed line items with images
- **Price Breakdown**: Subtotal, GST, shipping, discounts
- **Payment Info**: Transaction details and payment status
- **Courier Tracking**: Delivery partner and tracking information
- **Status History**: Complete audit trail of status changes

#### Brands Management
- **Visual Cards**: Brand cards with colored avatars
- **Statistics**: Product count per brand
- **CRUD**: Add, edit, delete brands
- **Duplicate Prevention**: Case-insensitive validation
- **Real-time Sync**: Updates reflect immediately in product dropdowns

#### Categories Management
- **Clean Table View**: Easy-to-scan category list
- **Product Counts**: Visual badges showing products per category
- **CRUD**: Full category management
- **Warning on Delete**: Alerts if category has assigned products
- **Real-time Sync**: Available immediately in product forms

#### Customers Management
- **Derived from Orders**: Automatic customer extraction from order data
- **Smart Analytics**:
  - Total customers
  - Active this month
  - Average orders per customer
  - Average customer value
- **Customer Profiles**: Avatar, contact info, location
- **Order History**: View all orders per customer
- **Relative Dates**: "2 days ago" style timestamps

#### Analytics
- **Time Range Filters**: 7D, 30D, 90D, 1Y views
- **Trend Analysis**: Period-over-period comparisons
- **Revenue Insights**: Daily revenue tracking
- **Category Performance**: Sales breakdown by fabric type
- **Top Products**: Revenue and unit sales tracking
- **Visual Progress Bars**: Easy-to-understand performance indicators

#### Settings
- **Store Configuration**:
  - Store name, email, phone
  - GST rate (0-28%)
  - Free shipping threshold
  - Default shipping rate
- **Price Range Filters**: Manage customer-facing price filters
- **System Information**: Version, environment, last updated

## 🛠️ Tech Stack

- **React 18.3** with TypeScript
- **React Router v7** for routing
- **Tailwind CSS v4** for styling
- **Shadcn/UI** components
- **Recharts** for data visualization
- **Lucide React** for icons
- **Sonner** for toast notifications
- **Context API** for state management

## 📁 Project Structure

```
src/app/
├── components/
│   ├── admin/
│   │   ├── AdminLayout.tsx       # Main admin layout with sidebar
│   │   └── ImageUpload.tsx       # File upload component
│   ├── customer/
│   │   └── Layout.tsx            # Customer-facing layout
│   └── ui/                       # Shadcn UI components
├── contexts/
│   ├── BrandContext.tsx          # Brand state management
│   ├── CartContext.tsx           # Shopping cart state
│   ├── CategoryContext.tsx       # Category state management
│   ├── OrderContext.tsx          # Order state with API integration
│   └── ThemeContext.tsx          # Dark/Light mode
├── hooks/
│   └── useOrdersAPI.tsx          # API integration hook
├── pages/
│   ├── admin/
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminAnalytics.tsx
│   │   ├── AdminSettings.tsx
│   │   ├── ProductsManagement.tsx
│   │   ├── OrdersManagement.tsx
│   │   ├── BrandsManagement.tsx
│   │   ├── CategoriesManagement.tsx
│   │   ├── CustomersManagement.tsx
│   │   └── Login.tsx
│   └── customer/                 # Customer pages (placeholders)
├── router.tsx                    # React Router v7 configuration
└── App.tsx                       # Root application component
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and pnpm

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Admin Login

**Demo Credentials:**
- Email: `admin@harishcloths.com`
- Password: `admin123`

## 🔌 Backend Integration

The application is **fully backend-ready**. See [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md) for detailed integration guide.

### Key Features:
- ✅ API-first architecture with localStorage fallback
- ✅ Automatic offline mode detection
- ✅ File upload ready for server integration
- ✅ Status history tracking
- ✅ Authorization headers included
- ✅ Proper error handling

### Quick Backend Setup:

1. Set environment variable:
```env
VITE_API_URL=http://localhost:3000
```

2. Implement these endpoints:
```
POST   /api/v1/admin/products/upload-image
POST   /api/v1/admin/products
GET    /api/v1/orders
PUT    /api/v1/admin/orders/:id/status
```

3. The frontend will automatically use the API and fall back to localStorage if unavailable.

## 🎨 Design Features

### Image Upload
- **Drag & Drop**: Intuitive file upload
- **Preview**: Instant image preview
- **Validation**: File type and size checks (max 5MB)
- **Change/Remove**: Easy image management
- **Backend Ready**: File object prepared for FormData upload

### Responsive Design
- **Mobile First**: Works on all screen sizes
- **Collapsible Sidebar**: Mobile drawer on small screens
- **Adaptive Layouts**: Grid/Table views adjust automatically
- **Touch Friendly**: Large touch targets on mobile

### Dark Mode
- **System Preference**: Respects OS dark mode
- **Manual Toggle**: Sun/Moon icon in navbar
- **Persistent**: Saves preference in localStorage
- **Full Coverage**: All components support dark mode

### UX Enhancements
- **Loading States**: Spinners for async operations
- **Toast Notifications**: Success/error feedback
- **Empty States**: Helpful messages when no data
- **Search Highlights**: Real-time search feedback
- **Relative Dates**: Human-readable timestamps
- **Progress Indicators**: Visual feedback for actions

## 📊 Business Rules

### Fabric Selling Units
- **Meter-based**: Price × Quantity × Meters
- **Piece-based**: Price × Quantity
- Properly displayed in cart, orders, and invoices

### Order Status Flow
```
0: Order Placed (Yellow)
1: Processing (Blue)
2: Shipped (Purple)
3: Out for Delivery (Orange)
4: Delivered (Green)
cancelled: Cancelled (Red)
refunded: Refunded (Gray)
```

### GST Calculation
- Standard rate: 18% (configurable in settings)
- Applied on subtotal
- Clearly shown in breakdowns

## 🔒 Security

- Admin routes protected by auth guard
- Token-based authentication
- Authorization headers on API calls
- Input validation on all forms
- XSS protection via React
- CSRF protection ready

## 📱 Customer Portal (Coming Soon)

Placeholder routes created for:
- Home page
- Product catalog
- Product detail
- Shopping cart
- Checkout flow
- Order tracking

## 🚧 Roadmap

- [ ] Customer-facing store implementation
- [ ] Product image gallery (multiple images)
- [ ] Advanced search with filters
- [ ] Bulk operations (import/export)
- [ ] Email notifications
- [ ] SMS integration
- [ ] Analytics dashboards
- [ ] Inventory management
- [ ] Discount/coupon system
- [ ] Customer reviews

## 📄 License

Proprietary - Harish Cloths

## 👨‍💻 Development

Built with ❤️ using modern web technologies and best practices.

For backend integration, see [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md)
