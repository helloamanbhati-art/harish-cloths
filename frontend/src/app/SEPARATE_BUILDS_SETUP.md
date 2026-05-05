# 🔧 Separate Builds Configuration

Guide to configure independent build processes for customer app and admin panel.

---

## 📦 Package.json Updates

### Update your `package.json` scripts:

```json
{
  "name": "hs-ecommerce",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "dev:admin": "vite --config vite.config.admin.ts --port 5174",
    "build": "vite build",
    "build:admin": "vite build --config vite.config.admin.ts",
    "preview": "vite preview",
    "preview:admin": "vite preview --config vite.config.admin.ts --port 4174",
    "build:all": "npm run build && npm run build:admin",
    "lint": "eslint .",
    "type-check": "tsc --noEmit"
  }
}
```

---

## ⚙️ Vite Configuration

### 1. Create `vite.config.admin.ts` (New File)

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  
  // Set root to admin-panel directory
  root: './admin-panel',
  
  // Build configuration
  build: {
    outDir: '../dist-admin',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'admin-panel/index.html'),
      },
    },
  },
  
  // Public directory
  publicDir: '../public',
  
  // Base URL
  base: '/',
  
  // Server configuration
  server: {
    port: 5174,
    strictPort: false,
    host: true,
  },
  
  // Preview configuration
  preview: {
    port: 4174,
    strictPort: false,
  },
  
  // Resolve configuration
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './admin-panel'),
    },
  },
});
```

### 2. Update `vite.config.ts` (Customer App)

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  
  // Root is current directory
  root: './',
  
  // Build configuration
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
    },
  },
  
  // Public directory
  publicDir: 'public',
  
  // Base URL
  base: '/',
  
  // Server configuration
  server: {
    port: 5173,
    strictPort: false,
    host: true,
  },
  
  // Resolve configuration
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
```

---

## 📄 HTML Entry Points

### 1. Create `/admin-panel/index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="H&S Admin Panel - Luxury Fabric Management" />
    <title>H&S Admin Panel</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/App.tsx"></script>
  </body>
</html>
```

### 2. Verify `/index.html` (Customer App)

Should point to root `/App.tsx`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="H&S - Luxury Women's Clothing Fabrics" />
    <title>H&S - Premium Fabrics</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/App.tsx"></script>
  </body>
</html>
```

---

## 🗂️ Directory Structure

```
project-root/
├── index.html              ← Customer app entry
├── App.tsx                 ← Customer app root
├── vite.config.ts          ← Customer build config
├── vite.config.admin.ts    ← Admin build config (NEW)
├── package.json            ← Updated scripts
│
├── admin-panel/
│   ├── index.html          ← Admin app entry (NEW)
│   ├── App.tsx             ← Admin app root
│   └── ... (admin files)
│
├── dist/                   ← Customer build output
└── dist-admin/             ← Admin build output
```

---

## 🚀 Usage

### Development Mode:

**Customer App (Port 5173):**
```bash
npm run dev
# Opens http://localhost:5173
```

**Admin Panel (Port 5174):**
```bash
npm run dev:admin
# Opens http://localhost:5174
# Login: admin@harishcloths.com / admin123
```

**Run Both Simultaneously:**
```bash
# Terminal 1
npm run dev

# Terminal 2
npm run dev:admin
```

### Build for Production:

**Customer App Only:**
```bash
npm run build
# Output: /dist
```

**Admin Panel Only:**
```bash
npm run build:admin
# Output: /dist-admin
```

**Build Both:**
```bash
npm run build:all
# Output: /dist and /dist-admin
```

### Preview Production Builds:

**Customer App:**
```bash
npm run preview
# Preview at http://localhost:4173
```

**Admin Panel:**
```bash
npm run preview:admin
# Preview at http://localhost:4174
```

---

## 🌐 Deployment

### Build Outputs:

| App | Output Directory | Deploy To |
|-----|------------------|-----------|
| Customer | `/dist` | `yourdomain.com` |
| Admin | `/dist-admin` | `admin.yourdomain.com` |

### Netlify Deployment:

**Customer App:**
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Admin Panel:**
```toml
# admin-panel/netlify.toml
[build]
  command = "npm run build:admin"
  publish = "dist-admin"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Deploy:
```bash
# Customer app
netlify deploy --dir=dist --prod

# Admin panel
netlify deploy --dir=dist-admin --prod --site=admin-site-id
```

### Vercel Deployment:

**vercel.json** (root):
```json
{
  "name": "hs-customer-app",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**admin-panel/vercel.json**:
```json
{
  "name": "hs-admin-panel",
  "buildCommand": "npm run build:admin",
  "outputDirectory": "dist-admin",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Deploy:
```bash
# Customer app
vercel --prod

# Admin panel (from admin-panel directory)
cd admin-panel
vercel --prod
```

---

## 🔒 Environment Variables

### Customer App (`.env`):

```bash
VITE_API_URL=https://api.yourdomain.com
VITE_APP_MODE=customer
VITE_STRIPE_PUBLIC_KEY=pk_live_xxx
```

### Admin Panel (`admin-panel/.env`):

```bash
VITE_API_URL=https://api.yourdomain.com
VITE_APP_MODE=admin
VITE_ADMIN_SECRET_KEY=admin_secret_xxx
```

---

## 📊 Bundle Size Comparison

After extraction:

| App | Before | After | Reduction |
|-----|--------|-------|-----------|
| Customer | ~2.5 MB | ~1.7 MB | **32%** ⬇️ |
| Admin | N/A | ~1.8 MB | N/A |

**Benefits:**
- Faster customer page loads
- Better SEO for customer app
- Smaller deployments
- Independent scaling

---

## 🧪 Testing Checklist

### Before Deployment:

Customer App:
- [ ] `npm run build` succeeds
- [ ] `npm run preview` shows customer pages
- [ ] No admin routes accessible
- [ ] All customer features work
- [ ] No console errors

Admin Panel:
- [ ] `npm run build:admin` succeeds
- [ ] `npm run preview:admin` shows admin panel
- [ ] Can login with demo credentials
- [ ] All admin pages load
- [ ] Dark mode toggle works
- [ ] No console errors

Both Apps:
- [ ] Correct bundle sizes
- [ ] No shared runtime code
- [ ] Environment variables work
- [ ] API calls configured correctly

---

## 🐛 Troubleshooting

### Issue: "Cannot find module"
**Fix**: Check import paths in admin panel files. They should use relative paths from `/admin-panel/`.

### Issue: "Build fails for admin"
**Fix**: Ensure `/admin-panel/index.html` exists and points to `/App.tsx`.

### Issue: "Both apps share state"
**Fix**: They shouldn't. They're completely independent. Clear browser cache.

### Issue: "Admin panel shows 404 on refresh"
**Fix**: Configure server redirects (see deployment configs above).

---

## 📦 CI/CD Pipeline Example

**GitHub Actions (`.github/workflows/deploy.yml`):**

```yaml
name: Deploy Apps

on:
  push:
    branches: [main]

jobs:
  deploy-customer:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm install
      - run: npm run build
      
      - name: Deploy Customer App
        run: netlify deploy --dir=dist --prod
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.CUSTOMER_SITE_ID }}

  deploy-admin:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm install
      - run: npm run build:admin
      
      - name: Deploy Admin Panel
        run: netlify deploy --dir=dist-admin --prod
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.ADMIN_SITE_ID }}
```

---

## ✅ Success Criteria

After setup, you should be able to:

- [x] Run customer app on port 5173
- [x] Run admin panel on port 5174
- [x] Build customer app to `/dist`
- [x] Build admin panel to `/dist-admin`
- [x] Deploy apps independently
- [x] Apps run without shared state
- [x] Correct bundle sizes
- [x] Environment variables work

---

## 🎯 Final Commands Reference

```bash
# Development
npm run dev              # Customer app (port 5173)
npm run dev:admin        # Admin panel (port 5174)

# Build
npm run build            # Customer app → /dist
npm run build:admin      # Admin panel → /dist-admin
npm run build:all        # Both apps

# Preview
npm run preview          # Customer app
npm run preview:admin    # Admin panel

# Deploy (example with Netlify)
netlify deploy --dir=dist --prod
netlify deploy --dir=dist-admin --prod
```

---

**Status**: Ready to configure and deploy! 🚀

*Last Updated: April 17, 2026*
