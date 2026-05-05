# 🚀 How to Run Admin Panel Separately

## ⚠️ Important: Figma Make Environment

**You are currently in Figma Make**, which is designed to run **ONE app at a time**. To run the admin panel separately:

### Option 1: Download and Run Locally (Recommended)

1. **Download the project** from Figma Make
2. **Extract admin panel** on your local machine:
   ```bash
   python3 extract_admin_panel.py
   ```
3. **Run both apps** in separate terminals:
   ```bash
   # Terminal 1 - Customer App
   npm install
   npm run dev  # → http://localhost:5173
   
   # Terminal 2 - Admin Panel
   cd admin-panel
   npm install
   npm run dev  # → http://localhost:5174
   ```

### Option 2: Deploy to Separate Domains

Deploy each app to different hosting platforms:
- **Customer App** → `yourdomain.com`
- **Admin Panel** → `admin.yourdomain.com`

---

## 🎯 Current Figma Make Setup

**What's Running Now:**
- The **combined app** with both customer and admin routes
- All routes work in one application
- Access admin at: `/admin/login`

**Admin Login:**
- Email: `admin@harishcloths.com`
- Password: `admin123`

**Customer Routes:**
- Home: `/`
- Products: `/products` (if exists)
- Cart: `/cart`
- Checkout: `/checkout`

**Admin Routes:**
- Login: `/admin/login`
- Dashboard: `/admin/dashboard`
- Products: `/admin/products`
- Orders: `/admin/orders`
- Brands: `/admin/brands`
- Categories: `/admin/categories`
- Customers: `/admin/customers`
- Analytics: `/admin/analytics`
- Settings: `/admin/settings`

---

## What the Extraction Creates

The extraction script creates a **completely independent admin panel** with:

```
admin-panel/
├── package.json          ← Its own dependencies
├── vite.config.ts        ← Its own Vite config
├── index.html            ← Its own entry point
├── App.tsx               ← Admin app
├── routes.tsx            ← Admin routes
├── pages/                ← All 10 admin pages
├── components/           ← All admin components
└── node_modules/         ← Its own dependencies
```

It's literally a **separate React app** that just happens to be in your project folder.

---

## Development Workflow

### Option A: Run Both Together (Recommended)

**Terminal 1 - Customer App:**
```bash
npm run dev
```

**Terminal 2 - Admin Panel:**
```bash
cd admin-panel
npm run dev
```

### Option B: Run Only Admin Panel

```bash
cd admin-panel
npm run dev
```

### Option C: Run Only Customer App

```bash
npm run dev
```

---

## Production Deployment

### Build Customer App
```bash
npm run build
# Output: /dist folder
# Deploy this to: yourdomain.com
```

### Build Admin Panel
```bash
cd admin-panel
npm run build
# Output: /admin-panel/dist folder
# Deploy this to: admin.yourdomain.com
```

---

## Deployment Examples

### Netlify

**Customer App:**
```bash
npm run build
netlify deploy --dir=dist --prod
```

**Admin Panel:**
```bash
cd admin-panel
npm run build
netlify deploy --dir=dist --prod --site=your-admin-site-id
```

### Vercel

**Customer App:**
```bash
vercel --prod
```

**Admin Panel:**
```bash
cd admin-panel
vercel --prod
```

---

## File Structure

### Before Extraction:
```
project-root/
├── App.tsx               ← Has both customer + admin routes
├── routes.tsx            ← Has both customer + admin routes
└── pages/                ← All pages mixed together
```

### After Extraction:
```
project-root/
├── App.tsx               ← Customer only ✅
├── routes.tsx            ← Customer routes only ✅
├── pages/                ← Customer pages only ✅
│
└── admin-panel/          ← Completely independent app ✅
    ├── package.json      ← Own dependencies
    ├── vite.config.ts    ← Own config
    ├── index.html        ← Own entry
    ├── App.tsx           ← Admin app
    ├── routes.tsx        ← Admin routes
    └── pages/            ← Admin pages
```

---

## URLs

| App | Development | Production |
|-----|-------------|------------|
| **Customer** | `http://localhost:5173` | `https://yourdomain.com` |
| **Admin** | `http://localhost:5174` | `https://admin.yourdomain.com` |

---

## Quick Commands

```bash
# EXTRACTION (First Time Only)
python3 extract_admin_panel.py      # Extract admin panel
python3 verify_extraction.py        # Verify it worked

# CUSTOMER APP
npm run dev                         # Development
npm run build                       # Production build

# ADMIN PANEL
cd admin-panel
npm install                         # First time only
npm run dev                         # Development
npm run build                       # Production build
```

---

## Troubleshooting

### Error: "Cannot find module"
**Cause:** Haven't extracted yet  
**Fix:**
```bash
python3 extract_admin_panel.py
```

### Error: "Dependencies not installed"
**Cause:** Need to install admin dependencies  
**Fix:**
```bash
cd admin-panel
npm install
```

### Error: "Port 5174 already in use"
**Cause:** Admin panel already running  
**Fix:** Close the other terminal, or change port in `admin-panel/vite.config.ts`

### Admin shows blank screen
**Cause:** Build error or missing files  
**Fix:**
```bash
# Re-extract
python3 extract_admin_panel.py

# Reinstall
cd admin-panel
rm -rf node_modules
npm install
npm run dev
```

---

## Testing Checklist

**After extraction:**
- [ ] Run `python3 verify_extraction.py` - should pass all checks
- [ ] `cd admin-panel && npm install` - installs successfully
- [ ] Customer app runs on 5173
- [ ] Admin panel runs on 5174
- [ ] Both apps work independently
- [ ] No shared state between apps

---

## Why This Approach?

✅ **Simple:** Just two independent apps  
✅ **Clean:** No complex config needed  
✅ **Flexible:** Deploy anywhere independently  
✅ **Maintainable:** Each app has its own dependencies  
✅ **Secure:** Completely separate codebases  

---

## Next Steps

1. ✅ Extract: `python3 extract_admin_panel.py`
2. ✅ Install: `cd admin-panel && npm install`
3. ✅ Run customer: `npm run dev` (Terminal 1)
4. ✅ Run admin: `cd admin-panel && npm run dev` (Terminal 2)
5. ✅ Test both apps
6. ✅ Deploy to separate domains

---

**That's it!** No complex configuration needed. Just extract and run! 🚀

*Last Updated: April 17, 2026*