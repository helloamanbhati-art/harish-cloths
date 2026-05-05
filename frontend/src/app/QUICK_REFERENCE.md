# 🚀 Quick Reference Card - Harish Cloths

## 📍 Access URLs

```
Customer Portal:     http://localhost:5173/
Admin Login:         http://localhost:5173/admin/login
Admin Dashboard:     http://localhost:5173/admin
```

## 🔐 Demo Credentials

```
Admin Login:
  Email:    admin@harishcloths.com
  Password: admin123
```

## 📊 Project Stats

- **Frontend Pages**: 20+ pages (10 customer + 10 admin)
- **UI Components**: 40+ reusable components
- **API Endpoints Needed**: ~100 endpoints
- **Database Tables**: 18 tables
- **Features**: Full e-commerce + admin dashboard

## 🎯 Key Files to Know

### Main Entry Points
- `/App.tsx` - React app root
- `/routes.tsx` - All routes configuration
- `/styles/globals.css` - Global styles

### Customer Pages
- `/pages/Home.tsx` - Product catalog
- `/pages/ProductDetail.tsx` - Product details
- `/pages/Cart.tsx` - Shopping cart
- `/pages/Checkout.tsx` - Checkout process
- `/pages/MyOrders.tsx` - Order history

### Admin Pages
- `/pages/admin/AdminLayout.tsx` - Admin layout with sidebar
- `/pages/admin/AdminDashboard.tsx` - Main dashboard
- `/pages/admin/Analytics.tsx` - Analytics & charts
- `/pages/admin/ProductsManagement.tsx` - Product CRUD
- `/pages/admin/OrdersManagement.tsx` - Order management

### Contexts (State Management)
- `/contexts/CartContext.tsx` - Cart state
- `/contexts/OrderContext.tsx` - Orders state
- `/contexts/ThemeContext.tsx` - Dark/light mode

### Mock Data (Temporary)
- `/data/products.ts` - Sample products

## 💼 Business Rules

### Selling Units
```javascript
METER: 1-5 meters selection
PIECE: Standard quantity increment
```

### GST Calculation
```javascript
Intrastate:  CGST + SGST = GST%
Interstate:  IGST = GST%

Example:
₹2000 @ 12% GST
  CGST: ₹120 (6%)
  SGST: ₹120 (6%)
  Total: ₹2240
```

### Order Flow
```
pending → confirmed → processing → 
shipped → delivered

cancelled → refunded (if paid)
```

## 🔧 Tech Stack

**Frontend:**
- React 18 + TypeScript
- React Router v7
- Tailwind CSS v4
- Shadcn UI
- Recharts (Analytics)
- Motion (Animations)

**Backend (To Build):**
- Node.js/Express OR Python/FastAPI
- PostgreSQL
- JWT Auth
- Razorpay
- Redis
- AWS S3

## 📝 npm Scripts

```bash
npm run dev       # Start dev server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

## 📦 Key Dependencies

```json
{
  "react": "^18.3.1",
  "react-router": "^7.1.3",
  "lucide-react": "icons",
  "recharts": "charts",
  "sonner": "notifications",
  "motion": "animations",
  "tailwindcss": "^4.0.0"
}
```

## 🗂️ Folder Structure (Simplified)

```
/
├── admin/              # Admin panel (new location)
├── pages/              # Customer pages
├── components/         # Reusable components
├── contexts/           # React contexts
├── data/               # Mock data
├── hooks/              # Custom hooks
├── types/              # TypeScript types
└── styles/             # Global CSS
```

## 🎨 Color Scheme

**Admin Panel:**
- Primary: Purple-Indigo gradient (#8b5cf6 → #6366f1)
- Dark mode: Gray-800/900
- Light mode: White/Gray-50

**Customer Portal:**
- Primary: Blue (#3b82f6)
- Accent: Indigo (#6366f1)

## 📄 Documentation Files

1. **BACKEND_INTEGRATION_PROMPT.md** ⭐
   - Complete backend specification
   - Database schema
   - API endpoints
   - Business logic

2. **COMPLETE_PROJECT_SUMMARY.md**
   - High-level overview
   - Architecture diagram
   - Development roadmap

3. **ADMIN_FOLDER_STRUCTURE.md**
   - Admin organization
   - Import paths
   - Migration guide

## 🔌 API Integration Points

When backend is ready, replace these:

```typescript
// Product APIs
GET    /api/v1/products
POST   /api/v1/admin/products
PUT    /api/v1/admin/products/:id
DELETE /api/v1/admin/products/:id

// Order APIs
GET    /api/v1/orders
POST   /api/v1/orders
PUT    /api/v1/admin/orders/:id/status

// Auth APIs
POST   /api/v1/auth/login
POST   /api/v1/admin/auth/login
```

## 🚦 Status Indicators

### Admin Order Status
```javascript
pending     → Yellow/Orange
confirmed   → Blue
processing  → Purple
shipped     → Indigo
delivered   → Green
cancelled   → Red
refunded    → Gray
```

## 💡 Quick Tips

1. **Dark Mode Toggle**: Top right in admin navbar
2. **Add Product**: Admin → Products → Add New
3. **View Orders**: Admin → Orders
4. **Analytics**: Admin → Analytics (with charts)
5. **Sidebar**: Collapsible on mobile/tablet

## 🐛 Common Issues & Fixes

**Issue**: Admin login not working
**Fix**: Use exact credentials: `admin@harishcloths.com` / `admin123`

**Issue**: Dark mode not persisting
**Fix**: Check localStorage - `theme` key

**Issue**: Cart not updating
**Fix**: Check CartContext provider wrapping

**Issue**: Images not loading
**Fix**: Mock data uses placeholder images

## 📞 Need Help?

- **Frontend Issues**: Check component code & props
- **Backend Setup**: See BACKEND_INTEGRATION_PROMPT.md
- **API Design**: All endpoints documented
- **Database**: Schema in backend prompt
- **Deployment**: Follow deployment checklist

## 🎯 Next Steps

1. ✅ Frontend complete
2. ⏳ Build backend using BACKEND_INTEGRATION_PROMPT.md
3. ⏳ Connect APIs to frontend
4. ⏳ Test end-to-end
5. ⏳ Deploy to production

## 📊 Feature Checklist

### Customer Features ✅
- [x] Product browsing
- [x] Search & filters
- [x] Shopping cart
- [x] Checkout
- [x] Order tracking
- [x] Responsive design

### Admin Features ✅
- [x] Dashboard
- [x] Analytics
- [x] Product CRUD
- [x] Order management
- [x] Brand management
- [x] Category management
- [x] Customer management
- [x] Settings
- [x] Dark/light mode

### Backend Features ⏳
- [ ] Database setup
- [ ] API development
- [ ] Authentication
- [ ] Payment gateway
- [ ] Email notifications
- [ ] File upload
- [ ] Testing
- [ ] Deployment

---

**Version**: 1.0.0
**Last Updated**: March 14, 2024
**Status**: Frontend Complete ✅
