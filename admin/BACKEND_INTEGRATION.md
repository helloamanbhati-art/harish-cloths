# Backend Integration Guide

This guide explains how to integrate the Harish Cloths Admin Panel with your backend API.

## Image Upload Integration

### Current Implementation (Frontend Ready)

The `ImageUpload` component (`src/app/components/admin/ImageUpload.tsx`) is designed to accept File objects and prepare them for backend upload.

### Backend Integration Steps

#### 1. Create Image Upload API Endpoint

Create an endpoint in your backend to handle image uploads:

```javascript
// Backend Example (Node.js/Express)
const multer = require('multer');
const path = require('path');

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/products/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

// POST /api/v1/admin/products/upload-image
app.post('/api/v1/admin/products/upload-image', 
  authenticateAdmin, 
  upload.single('image'), 
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const imageUrl = `/uploads/products/${req.file.filename}`;
    
    res.json({
      success: true,
      url: imageUrl,
      filename: req.file.filename
    });
  }
);
```

#### 2. Update Frontend ProductsManagement.tsx

Replace the placeholder in `handleSaveProduct` function:

```typescript
// BEFORE (Current - Placeholder)
if (formData.imageFile) {
  // This is a placeholder - in production, you'll upload to server here
  // const uploadResponse = await uploadImage(formData.imageFile);
  // imageUrl = uploadResponse.url;
  imageUrl = URL.createObjectURL(formData.imageFile);
}

// AFTER (Production - Actual Upload)
if (formData.imageFile) {
  const uploadFormData = new FormData();
  uploadFormData.append('image', formData.imageFile);
  
  const response = await fetch(`${API_BASE_URL}/api/v1/admin/products/upload-image`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
    },
    body: uploadFormData
  });
  
  if (response.ok) {
    const data = await response.json();
    imageUrl = data.url;
  } else {
    toast.error('Failed to upload image');
    return;
  }
}
```

#### 3. Create Reusable Upload Service

Create `src/app/services/uploadService.ts`:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function uploadProductImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);
  
  const response = await fetch(`${API_BASE_URL}/api/v1/admin/products/upload-image`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
    },
    body: formData
  });
  
  if (!response.ok) {
    throw new Error('Failed to upload image');
  }
  
  const data = await response.json();
  return data.url;
}
```

Then use it in your component:

```typescript
import { uploadProductImage } from '../../services/uploadService';

// In handleSaveProduct:
if (formData.imageFile) {
  try {
    imageUrl = await uploadProductImage(formData.imageFile);
  } catch (error) {
    toast.error('Failed to upload image');
    return;
  }
}
```

## API Endpoints Reference

### Products

```
POST   /api/v1/admin/products              Create product
GET    /api/v1/admin/products              List all products
GET    /api/v1/admin/products/:id          Get single product
PUT    /api/v1/admin/products/:id          Update product
DELETE /api/v1/admin/products/:id          Delete product
POST   /api/v1/admin/products/upload-image Upload product image
```

### Orders

```
GET    /api/v1/orders                      List all orders
GET    /api/v1/orders/:id                  Get single order
POST   /api/v1/orders                      Create order
PUT    /api/v1/admin/orders/:id/status     Update order status
```

### Brands

```
GET    /api/v1/admin/brands                List all brands
POST   /api/v1/admin/brands                Create brand
PUT    /api/v1/admin/brands/:id            Update brand
DELETE /api/v1/admin/brands/:id            Delete brand
```

### Categories

```
GET    /api/v1/admin/categories            List all categories
POST   /api/v1/admin/categories            Create category
PUT    /api/v1/admin/categories/:id        Update category
DELETE /api/v1/admin/categories/:id        Delete category
```

## Request/Response Formats

### Create Product

**Request:**
```json
{
  "name": "Silk Banarasi Fabric",
  "description": "Premium quality silk fabric",
  "brand": "Banarasi Elite",
  "category": "Silk",
  "price": 1200,
  "soldBy": "meter",
  "image": "/uploads/products/product-1234567890.jpg",
  "inStock": true
}
```

**Response:**
```json
{
  "success": true,
  "product": {
    "id": "prod_123",
    "name": "Silk Banarasi Fabric",
    "description": "Premium quality silk fabric",
    "brand": "Banarasi Elite",
    "category": "Silk",
    "price": 1200,
    "soldBy": "meter",
    "image": "/uploads/products/product-1234567890.jpg",
    "inStock": true,
    "createdAt": "2026-04-23T10:30:00Z",
    "updatedAt": "2026-04-23T10:30:00Z"
  }
}
```

### Update Order Status

**Request:**
```json
{
  "status": 2,
  "notes": "Package dispatched via Delhivery"
}
```

**Response:**
```json
{
  "success": true,
  "order": {
    "id": "1",
    "status": 2,
    "statusHistory": [
      {
        "status": 0,
        "statusName": "Order Placed",
        "timestamp": "2026-04-23T10:00:00Z",
        "updatedBy": "System"
      },
      {
        "status": 2,
        "statusName": "Shipped",
        "timestamp": "2026-04-23T12:00:00Z",
        "updatedBy": "Admin",
        "notes": "Package dispatched via Delhivery"
      }
    ]
  }
}
```

## Authentication

All admin endpoints require a Bearer token:

```
Authorization: Bearer <admin_token>
```

The token is stored in `localStorage` with key `adminToken` after successful admin login.

## Error Handling

The frontend automatically falls back to localStorage when the API is unavailable. Ensure your API returns proper error responses:

```json
{
  "success": false,
  "error": "Product not found",
  "code": "PRODUCT_NOT_FOUND"
}
```

## Database Schema Recommendations

### Products Table

```sql
CREATE TABLE products (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  brand VARCHAR(100) NOT NULL,
  category VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  sold_by ENUM('meter', 'piece') NOT NULL,
  image VARCHAR(500) NOT NULL,
  in_stock BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_brand (brand),
  INDEX idx_category (category),
  INDEX idx_in_stock (in_stock)
);
```

### Orders Table

```sql
CREATE TABLE orders (
  id VARCHAR(36) PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255),
  customer_phone VARCHAR(20) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  status TINYINT NOT NULL,
  shipping_address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_customer_phone (customer_phone),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
);

CREATE TABLE order_items (
  id VARCHAR(36) PRIMARY KEY,
  order_id VARCHAR(36) NOT NULL,
  product_id VARCHAR(36) NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  product_image VARCHAR(500),
  brand VARCHAR(100),
  price DECIMAL(10, 2) NOT NULL,
  quantity INT NOT NULL,
  meters DECIMAL(10, 2),
  sold_by ENUM('meter', 'piece') NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  INDEX idx_order_id (order_id),
  INDEX idx_product_id (product_id)
);

CREATE TABLE order_status_history (
  id VARCHAR(36) PRIMARY KEY,
  order_id VARCHAR(36) NOT NULL,
  status TINYINT NOT NULL,
  status_name VARCHAR(50) NOT NULL,
  updated_by VARCHAR(100) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  INDEX idx_order_id (order_id)
);
```

## Environment Variables

Create a `.env` file in the root of your project:

```env
# Frontend (.env)
VITE_API_URL=http://localhost:3000
```

For production:

```env
# Production Frontend (.env.production)
VITE_API_URL=https://api.harishcloths.com
```

## Next Steps

1. Set up your backend server with the endpoints listed above
2. Configure image upload storage (local filesystem, AWS S3, Cloudinary, etc.)
3. Update the `VITE_API_URL` environment variable
4. Replace the placeholder image upload code in `ProductsManagement.tsx`
5. Test the integration with your backend API

The frontend is fully prepared for backend integration. All data is structured to match typical REST API patterns, making integration straightforward.
