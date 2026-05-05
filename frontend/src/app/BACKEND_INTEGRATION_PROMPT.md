# Complete Backend Integration Prompt for Luxury Women's Clothing Fabric E-Commerce Platform

## Project Overview
Build a complete backend system for **Harish Cloths** - a luxury women's clothing fabrics e-commerce platform specializing in premium fabrics (silk, cotton, chiffon, linen, etc.) sold in both meters and pieces, with full admin dashboard management.

## Business Model
- **Currency**: Indian Rupees (₹)
- **Tax Structure**: GST (Indian tax system)
- **Product Types**: Fabrics sold by meter (4-5 meter limit) OR by piece
- **Target Market**: Indian market, B2C luxury fabric sales

---

## Core System Requirements

### 1. Technology Stack (Backend)
- **Runtime**: Node.js with Express.js OR Python with FastAPI/Django
- **Database**: PostgreSQL (recommended) OR MongoDB
- **Authentication**: JWT-based authentication
- **File Storage**: AWS S3, Cloudinary, or similar for product images
- **Payment Gateway**: Razorpay (for Indian market) or Stripe
- **Email Service**: SendGrid, AWS SES, or similar
- **API Architecture**: RESTful API with proper versioning

### 2. Database Schema

#### **Users Table** (Customers)
```sql
users:
  - id (UUID, primary key)
  - email (unique, indexed)
  - password_hash
  - full_name
  - phone_number (unique, indexed)
  - created_at
  - updated_at
  - is_active (boolean)
  - email_verified (boolean)
  - phone_verified (boolean)
```

#### **Addresses Table**
```sql
addresses:
  - id (UUID, primary key)
  - user_id (foreign key -> users)
  - address_type (billing/shipping)
  - full_name
  - phone_number
  - address_line1
  - address_line2
  - city
  - state
  - postal_code
  - country (default: India)
  - is_default (boolean)
  - created_at
  - updated_at
```

#### **Admin Users Table**
```sql
admin_users:
  - id (UUID, primary key)
  - email (unique, indexed)
  - password_hash
  - full_name
  - role (super_admin, admin, manager)
  - permissions (JSON/array)
  - last_login
  - is_active (boolean)
  - created_at
  - updated_at
```

#### **Categories Table**
```sql
categories:
  - id (UUID, primary key)
  - name (unique, indexed)
  - slug (unique, indexed)
  - description (text)
  - image_url
  - display_order (integer)
  - is_active (boolean)
  - created_at
  - updated_at
  - created_by (foreign key -> admin_users)
```

#### **Brands Table**
```sql
brands:
  - id (UUID, primary key)
  - name (unique, indexed)
  - slug (unique, indexed)
  - description (text)
  - logo_url
  - website_url
  - display_order (integer)
  - is_active (boolean)
  - created_at
  - updated_at
  - created_by (foreign key -> admin_users)
```

#### **Products Table**
```sql
products:
  - id (UUID, primary key)
  - name (indexed)
  - slug (unique, indexed)
  - description (text)
  - category_id (foreign key -> categories)
  - brand_id (foreign key -> brands)
  
  // Product Details
  - sku (unique, indexed)
  - base_price (decimal)
  - selling_price (decimal)
  - discount_percentage (decimal, nullable)
  
  // Selling Unit
  - selling_unit (enum: 'meter', 'piece')
  - min_quantity (integer, default: 1)
  - max_quantity (integer, nullable) // For meters: 4-5 limit
  
  // Stock Management
  - stock_quantity (integer)
  - stock_status (enum: 'in_stock', 'low_stock', 'out_of_stock')
  - low_stock_threshold (integer)
  
  // Fabric Specifications
  - fabric_type (varchar) // silk, cotton, chiffon, linen, etc.
  - fabric_width (decimal) // in inches/cm
  - fabric_weight (decimal) // GSM
  - fabric_care (text) // washing instructions
  - fabric_composition (text) // 100% silk, cotton blend, etc.
  
  // Product Attributes
  - color (varchar)
  - pattern (varchar) // plain, printed, embroidered, etc.
  - occasion (varchar) // casual, festive, formal
  - season (varchar) // summer, winter, all-season
  
  // SEO & Display
  - meta_title (varchar)
  - meta_description (text)
  - tags (JSON/array)
  
  // Status & Timestamps
  - is_featured (boolean)
  - is_bestseller (boolean)
  - is_active (boolean)
  - published_at (timestamp, nullable)
  - created_at
  - updated_at
  - created_by (foreign key -> admin_users)
```

#### **Product Images Table**
```sql
product_images:
  - id (UUID, primary key)
  - product_id (foreign key -> products)
  - image_url (text)
  - alt_text (varchar)
  - display_order (integer)
  - is_primary (boolean)
  - created_at
  - updated_at
```

#### **Orders Table**
```sql
orders:
  - id (UUID, primary key)
  - order_number (unique, indexed) // HC-2024-001234
  - user_id (foreign key -> users)
  
  // Order Amounts (All in INR)
  - subtotal (decimal)
  - discount_amount (decimal, default: 0)
  - gst_amount (decimal)
  - cgst_amount (decimal) // Central GST
  - sgst_amount (decimal) // State GST
  - igst_amount (decimal) // Integrated GST (for interstate)
  - shipping_charges (decimal, default: 0)
  - total_amount (decimal) // Final payable amount
  
  // Addresses
  - shipping_address_id (foreign key -> addresses)
  - billing_address_id (foreign key -> addresses)
  
  // Status Tracking
  - order_status (enum: 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')
  - payment_status (enum: 'pending', 'paid', 'failed', 'refunded')
  - payment_method (enum: 'razorpay', 'cod', 'upi')
  
  // Payment Details
  - payment_id (varchar) // Razorpay payment ID
  - payment_gateway_response (JSON)
  
  // Timestamps
  - ordered_at
  - confirmed_at (nullable)
  - shipped_at (nullable)
  - delivered_at (nullable)
  - cancelled_at (nullable)
  - created_at
  - updated_at
  
  // Additional Info
  - customer_notes (text, nullable)
  - admin_notes (text, nullable)
  - cancellation_reason (text, nullable)
```

#### **Order Items Table**
```sql
order_items:
  - id (UUID, primary key)
  - order_id (foreign key -> orders)
  - product_id (foreign key -> products)
  
  // Product Snapshot (Store at time of order)
  - product_name
  - product_sku
  - product_image_url
  
  // Pricing
  - unit_price (decimal)
  - quantity (decimal) // Can be meters or pieces
  - selling_unit (enum: 'meter', 'piece')
  - discount_amount (decimal)
  - gst_rate (decimal) // 5%, 12%, 18%, 28%
  - gst_amount (decimal)
  - total_price (decimal)
  
  // Timestamps
  - created_at
  - updated_at
```

#### **Order Status History Table**
```sql
order_status_history:
  - id (UUID, primary key)
  - order_id (foreign key -> orders)
  - old_status (varchar)
  - new_status (varchar)
  - updated_by (foreign key -> admin_users, nullable)
  - notes (text, nullable)
  - created_at
```

#### **Cart Table** (Optional, can use session-based)
```sql
carts:
  - id (UUID, primary key)
  - user_id (foreign key -> users, nullable) // null for guest users
  - session_id (varchar, indexed) // for guest users
  - created_at
  - updated_at
  - expires_at
```

#### **Cart Items Table**
```sql
cart_items:
  - id (UUID, primary key)
  - cart_id (foreign key -> carts)
  - product_id (foreign key -> products)
  - quantity (decimal)
  - selling_unit (enum: 'meter', 'piece')
  - added_at
  - updated_at
```

#### **Wishlist Table**
```sql
wishlists:
  - id (UUID, primary key)
  - user_id (foreign key -> users)
  - product_id (foreign key -> products)
  - added_at
  
  UNIQUE(user_id, product_id)
```

#### **Reviews & Ratings Table** (Future enhancement)
```sql
reviews:
  - id (UUID, primary key)
  - user_id (foreign key -> users)
  - product_id (foreign key -> products)
  - order_item_id (foreign key -> order_items)
  - rating (integer, 1-5)
  - title (varchar)
  - comment (text)
  - is_verified_purchase (boolean)
  - is_approved (boolean)
  - admin_response (text, nullable)
  - created_at
  - updated_at
```

#### **Settings Table** (Key-Value store for admin settings)
```sql
settings:
  - id (UUID, primary key)
  - key (unique, indexed)
  - value (JSON)
  - category (varchar) // general, payment, shipping, tax, email
  - description (text)
  - updated_at
  - updated_by (foreign key -> admin_users)
```

#### **GST Settings Table**
```sql
gst_rates:
  - id (UUID, primary key)
  - category_id (foreign key -> categories, nullable)
  - product_id (foreign key -> products, nullable)
  - rate_percentage (decimal) // 5, 12, 18, 28
  - hsn_code (varchar) // Harmonized System of Nomenclature code
  - is_active (boolean)
  - created_at
  - updated_at
```

#### **Shipping Zones & Rates Table**
```sql
shipping_zones:
  - id (UUID, primary key)
  - name (varchar) // e.g., "Metro Cities", "Tier 2 Cities"
  - states (JSON/array) // Array of state codes
  - base_rate (decimal)
  - per_kg_rate (decimal, nullable)
  - free_shipping_threshold (decimal, nullable)
  - estimated_days_min (integer)
  - estimated_days_max (integer)
  - is_active (boolean)
  - created_at
  - updated_at
```

#### **Coupons/Discount Codes Table**
```sql
coupons:
  - id (UUID, primary key)
  - code (unique, indexed, uppercase)
  - description (text)
  - discount_type (enum: 'percentage', 'fixed_amount')
  - discount_value (decimal)
  - min_order_value (decimal, nullable)
  - max_discount_amount (decimal, nullable) // For percentage discounts
  - usage_limit (integer, nullable) // Total usage limit
  - usage_per_user (integer, nullable)
  - valid_from (timestamp)
  - valid_until (timestamp)
  - applicable_categories (JSON/array, nullable)
  - applicable_products (JSON/array, nullable)
  - is_active (boolean)
  - created_at
  - updated_at
  - created_by (foreign key -> admin_users)
```

#### **Coupon Usage Table**
```sql
coupon_usage:
  - id (UUID, primary key)
  - coupon_id (foreign key -> coupons)
  - user_id (foreign key -> users)
  - order_id (foreign key -> orders)
  - discount_applied (decimal)
  - used_at
```

#### **Notifications Table**
```sql
notifications:
  - id (UUID, primary key)
  - user_id (foreign key -> users, nullable)
  - type (enum: 'order_confirmation', 'order_shipped', 'order_delivered', 'promotional')
  - title (varchar)
  - message (text)
  - is_read (boolean)
  - action_url (varchar, nullable)
  - created_at
  - read_at (nullable)
```

#### **Email Logs Table**
```sql
email_logs:
  - id (UUID, primary key)
  - recipient_email (varchar, indexed)
  - subject (varchar)
  - template_name (varchar)
  - status (enum: 'sent', 'failed', 'pending')
  - error_message (text, nullable)
  - sent_at (nullable)
  - created_at
```

#### **Activity Logs Table** (Admin actions)
```sql
activity_logs:
  - id (UUID, primary key)
  - admin_id (foreign key -> admin_users)
  - action_type (varchar) // create, update, delete, login, etc.
  - entity_type (varchar) // product, order, user, etc.
  - entity_id (UUID, nullable)
  - changes (JSON) // Store before/after values
  - ip_address (varchar)
  - user_agent (text)
  - created_at
```

---

## 3. API Endpoints Structure

### **Public API Endpoints**

#### **Authentication & User Management**
```
POST   /api/v1/auth/register              - Customer registration
POST   /api/v1/auth/login                 - Customer login
POST   /api/v1/auth/logout                - Logout
POST   /api/v1/auth/forgot-password       - Request password reset
POST   /api/v1/auth/reset-password        - Reset password
POST   /api/v1/auth/verify-email          - Verify email
POST   /api/v1/auth/resend-verification   - Resend verification email
GET    /api/v1/auth/me                    - Get current user (authenticated)
PUT    /api/v1/auth/profile                - Update profile
PUT    /api/v1/auth/change-password       - Change password
```

#### **Products**
```
GET    /api/v1/products                   - List products (with filters, pagination)
GET    /api/v1/products/:slug             - Get single product by slug
GET    /api/v1/products/:id               - Get single product by ID
GET    /api/v1/products/featured          - Get featured products
GET    /api/v1/products/bestsellers       - Get bestselling products
GET    /api/v1/products/related/:id       - Get related products
GET    /api/v1/products/search            - Search products
```

#### **Categories**
```
GET    /api/v1/categories                 - List all active categories
GET    /api/v1/categories/:slug           - Get category by slug
GET    /api/v1/categories/:slug/products  - Get products in category
```

#### **Brands**
```
GET    /api/v1/brands                     - List all active brands
GET    /api/v1/brands/:slug               - Get brand by slug
GET    /api/v1/brands/:slug/products      - Get products by brand
```

#### **Cart**
```
GET    /api/v1/cart                       - Get cart (session or user-based)
POST   /api/v1/cart/items                 - Add item to cart
PUT    /api/v1/cart/items/:id             - Update cart item quantity
DELETE /api/v1/cart/items/:id             - Remove item from cart
DELETE /api/v1/cart                       - Clear cart
POST   /api/v1/cart/apply-coupon          - Apply coupon code
DELETE /api/v1/cart/remove-coupon         - Remove coupon
```

#### **Wishlist** (Authenticated)
```
GET    /api/v1/wishlist                   - Get user wishlist
POST   /api/v1/wishlist                   - Add product to wishlist
DELETE /api/v1/wishlist/:productId        - Remove from wishlist
```

#### **Orders** (Authenticated)
```
GET    /api/v1/orders                     - List user orders
GET    /api/v1/orders/:id                 - Get order details
POST   /api/v1/orders                     - Create order
POST   /api/v1/orders/:id/cancel          - Cancel order
GET    /api/v1/orders/:id/invoice         - Download invoice PDF
```

#### **Addresses** (Authenticated)
```
GET    /api/v1/addresses                  - List user addresses
POST   /api/v1/addresses                  - Add new address
PUT    /api/v1/addresses/:id              - Update address
DELETE /api/v1/addresses/:id              - Delete address
PUT    /api/v1/addresses/:id/default      - Set as default
```

#### **Checkout**
```
POST   /api/v1/checkout/calculate         - Calculate order totals (subtotal, GST, shipping)
POST   /api/v1/checkout/validate          - Validate cart & coupon before payment
POST   /api/v1/checkout/initiate          - Initiate payment (Razorpay)
POST   /api/v1/checkout/verify            - Verify payment & create order
POST   /api/v1/checkout/cod               - Place COD order
```

#### **Payments**
```
POST   /api/v1/payments/razorpay/webhook  - Razorpay webhook for payment status
POST   /api/v1/payments/verify            - Verify payment signature
```

#### **Utilities**
```
GET    /api/v1/settings/public            - Get public settings (shipping, GST info)
POST   /api/v1/contact                    - Contact form submission
GET    /api/v1/filters/options            - Get all filter options (price ranges, colors, etc.)
```

---

### **Admin API Endpoints**

#### **Admin Authentication**
```
POST   /api/v1/admin/auth/login           - Admin login
POST   /api/v1/admin/auth/logout          - Admin logout
GET    /api/v1/admin/auth/me              - Get current admin user
PUT    /api/v1/admin/auth/profile         - Update admin profile
```

#### **Dashboard Analytics**
```
GET    /api/v1/admin/dashboard/stats      - Get dashboard stats
GET    /api/v1/admin/dashboard/revenue    - Get revenue analytics
GET    /api/v1/admin/dashboard/orders     - Get recent orders
GET    /api/v1/admin/dashboard/products   - Get top selling products
GET    /api/v1/admin/analytics/revenue    - Revenue over time
GET    /api/v1/admin/analytics/categories - Category-wise sales
GET    /api/v1/admin/analytics/customers  - Customer analytics
```

#### **Product Management**
```
GET    /api/v1/admin/products             - List all products (with filters)
POST   /api/v1/admin/products             - Create product
GET    /api/v1/admin/products/:id         - Get product details
PUT    /api/v1/admin/products/:id         - Update product
DELETE /api/v1/admin/products/:id         - Delete product
PUT    /api/v1/admin/products/:id/toggle  - Toggle active status
POST   /api/v1/admin/products/:id/images  - Upload product images
DELETE /api/v1/admin/products/:id/images/:imageId - Delete image
PUT    /api/v1/admin/products/:id/stock   - Update stock
POST   /api/v1/admin/products/bulk-import - Bulk import products (CSV)
GET    /api/v1/admin/products/export      - Export products (CSV)
```

#### **Order Management**
```
GET    /api/v1/admin/orders               - List all orders (with filters, search)
GET    /api/v1/admin/orders/:id           - Get order details
PUT    /api/v1/admin/orders/:id/status    - Update order status
PUT    /api/v1/admin/orders/:id           - Update order details
DELETE /api/v1/admin/orders/:id           - Delete order (soft delete)
POST   /api/v1/admin/orders/:id/refund    - Process refund
GET    /api/v1/admin/orders/:id/invoice   - Generate invoice
POST   /api/v1/admin/orders/:id/notes     - Add admin notes
GET    /api/v1/admin/orders/export        - Export orders (CSV/Excel)
```

#### **Category Management**
```
GET    /api/v1/admin/categories           - List all categories
POST   /api/v1/admin/categories           - Create category
GET    /api/v1/admin/categories/:id       - Get category
PUT    /api/v1/admin/categories/:id       - Update category
DELETE /api/v1/admin/categories/:id       - Delete category
PUT    /api/v1/admin/categories/:id/toggle - Toggle active status
PUT    /api/v1/admin/categories/reorder   - Reorder categories
```

#### **Brand Management**
```
GET    /api/v1/admin/brands               - List all brands
POST   /api/v1/admin/brands               - Create brand
GET    /api/v1/admin/brands/:id           - Get brand
PUT    /api/v1/admin/brands/:id           - Update brand
DELETE /api/v1/admin/brands/:id           - Delete brand
PUT    /api/v1/admin/brands/:id/toggle    - Toggle active status
```

#### **Customer Management**
```
GET    /api/v1/admin/customers            - List all customers
GET    /api/v1/admin/customers/:id        - Get customer details
PUT    /api/v1/admin/customers/:id        - Update customer
DELETE /api/v1/admin/customers/:id        - Delete customer
PUT    /api/v1/admin/customers/:id/toggle - Toggle active status
GET    /api/v1/admin/customers/:id/orders - Get customer orders
GET    /api/v1/admin/customers/export     - Export customers
```

#### **Coupon Management**
```
GET    /api/v1/admin/coupons              - List all coupons
POST   /api/v1/admin/coupons              - Create coupon
GET    /api/v1/admin/coupons/:id          - Get coupon
PUT    /api/v1/admin/coupons/:id          - Update coupon
DELETE /api/v1/admin/coupons/:id          - Delete coupon
PUT    /api/v1/admin/coupons/:id/toggle   - Toggle active status
GET    /api/v1/admin/coupons/:id/usage    - Get coupon usage stats
```

#### **Settings Management**
```
GET    /api/v1/admin/settings             - Get all settings
GET    /api/v1/admin/settings/:category   - Get settings by category
PUT    /api/v1/admin/settings             - Update settings
PUT    /api/v1/admin/settings/gst         - Update GST rates
PUT    /api/v1/admin/settings/shipping    - Update shipping zones
PUT    /api/v1/admin/settings/payment     - Update payment settings
PUT    /api/v1/admin/settings/email       - Update email settings
```

#### **Admin User Management** (Super Admin only)
```
GET    /api/v1/admin/users                - List admin users
POST   /api/v1/admin/users                - Create admin user
GET    /api/v1/admin/users/:id            - Get admin user
PUT    /api/v1/admin/users/:id            - Update admin user
DELETE /api/v1/admin/users/:id            - Delete admin user
PUT    /api/v1/admin/users/:id/permissions - Update permissions
```

#### **Notifications**
```
GET    /api/v1/admin/notifications        - List notifications
POST   /api/v1/admin/notifications        - Send notification
PUT    /api/v1/admin/notifications/:id/read - Mark as read
DELETE /api/v1/admin/notifications/:id    - Delete notification
```

#### **Reports**
```
GET    /api/v1/admin/reports/sales        - Sales report
GET    /api/v1/admin/reports/inventory    - Inventory report
GET    /api/v1/admin/reports/customers    - Customer report
GET    /api/v1/admin/reports/tax          - Tax/GST report
```

#### **File Upload**
```
POST   /api/v1/admin/upload               - Upload image/file
DELETE /api/v1/admin/upload/:id           - Delete uploaded file
```

#### **Activity Logs**
```
GET    /api/v1/admin/logs/activities      - Get activity logs
GET    /api/v1/admin/logs/emails          - Get email logs
```

---

## 4. Key Business Logic Requirements

### **A. GST Calculation (Indian Tax System)**
```
For products under ₹1000:
  GST Rate = 5%
  
For products ₹1000 - ₹5000:
  GST Rate = 12%
  
For products above ₹5000:
  GST Rate = 18% (luxury items)

// Intrastate (within same state):
CGST = GST Rate / 2
SGST = GST Rate / 2

// Interstate (different states):
IGST = GST Rate

Example:
Product Price: ₹2000
GST Rate: 12%
GST Amount: ₹240

If Intrastate:
  CGST: ₹120 (6%)
  SGST: ₹120 (6%)
  
If Interstate:
  IGST: ₹240 (12%)
```

### **B. Meter/Piece Logic**
```javascript
// When adding to cart:
if (product.selling_unit === 'meter') {
  // Show meter selection (1-5 meters)
  // Validate: quantity >= 1 && quantity <= product.max_quantity (default 5)
  // Calculate: price = product.selling_price * selected_meters
}

if (product.selling_unit === 'piece') {
  // Add directly to cart with quantity = 1
  // Allow quantity increment in cart
  // Calculate: price = product.selling_price * quantity
}

// Stock validation:
if (cart_quantity > product.stock_quantity) {
  throw Error('Insufficient stock')
}
```

### **C. Order Number Generation**
```javascript
// Format: HC-YYYY-NNNNNN
// Example: HC-2024-000123

function generateOrderNumber() {
  const year = new Date().getFullYear();
  const lastOrder = await getLastOrderOfYear(year);
  const nextNumber = (lastOrder?.sequence || 0) + 1;
  return `HC-${year}-${String(nextNumber).padStart(6, '0')}`;
}
```

### **D. Price Calculation Flow**
```javascript
// Cart Calculation:
1. Calculate subtotal (sum of all items)
2. Apply coupon discount (if applicable)
3. Calculate GST on (subtotal - discount)
4. Add shipping charges
5. Final Total = subtotal - discount + GST + shipping

// Example:
Subtotal: ₹5000
Discount: -₹500 (10% coupon)
Taxable Amount: ₹4500
GST (12%): ₹540
  CGST: ₹270
  SGST: ₹270
Shipping: ₹100
Total: ₹5140
```

### **E. Stock Management**
```javascript
// When order is placed:
- Reduce product.stock_quantity by order_item.quantity
- Update stock_status based on threshold:
  if (stock_quantity === 0) status = 'out_of_stock'
  else if (stock_quantity <= low_stock_threshold) status = 'low_stock'
  else status = 'in_stock'

// When order is cancelled:
- Restore product.stock_quantity
- Update stock_status accordingly
```

### **F. Order Status Flow**
```
pending -> confirmed -> processing -> shipped -> delivered
                ↓
            cancelled (can cancel before shipped)
                ↓
            refunded (after payment)
```

### **G. Payment Integration (Razorpay)**
```javascript
// Step 1: Create Razorpay order
POST /api/v1/checkout/initiate
Response: { razorpay_order_id, amount, currency: 'INR' }

// Step 2: Frontend shows Razorpay checkout
// User completes payment

// Step 3: Verify payment
POST /api/v1/checkout/verify
Body: {
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature
}

// Verify signature using Razorpay secret
// If valid, create order and send confirmation

// Step 4: Handle webhooks for payment status
POST /api/v1/payments/razorpay/webhook
```

---

## 5. Email Notifications

### **Customer Emails**
1. **Welcome Email** - After registration
2. **Email Verification** - With verification link
3. **Password Reset** - With reset link
4. **Order Confirmation** - After successful order
5. **Order Shipped** - With tracking details
6. **Order Delivered** - Delivery confirmation
7. **Order Cancelled** - Cancellation confirmation
8. **Refund Processed** - Refund confirmation

### **Admin Emails**
1. **New Order Alert** - When new order placed
2. **Low Stock Alert** - When product stock is low
3. **Daily Sales Report** - End of day summary
4. **New Customer Registration** - Alert for new sign-ups

### **Email Template Variables**
```
- {{ customer_name }}
- {{ order_number }}
- {{ order_total }}
- {{ order_items }}
- {{ shipping_address }}
- {{ tracking_number }}
- {{ estimated_delivery }}
- {{ order_date }}
- {{ invoice_url }}
```

---

## 6. Security Requirements

### **Authentication**
- JWT tokens with expiry (24 hours for customers, 12 hours for admin)
- Refresh token mechanism
- Password: Min 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special char
- Bcrypt hashing with salt rounds = 10

### **Authorization**
- Role-based access control (RBAC) for admin
- Route-level middleware for protected endpoints
- Admin permissions: products.create, products.edit, orders.manage, etc.

### **API Security**
- Rate limiting (100 requests/15 minutes per IP)
- CORS configuration for frontend domain only
- Input validation & sanitization on all endpoints
- SQL injection prevention (use parameterized queries/ORM)
- XSS prevention (escape output)
- CSRF tokens for state-changing operations

### **Data Security**
- Encrypt sensitive data (payment info, addresses)
- HTTPS only in production
- Secure headers (helmet.js)
- Hide stack traces in production
- Log sensitive operations

### **Payment Security**
- Never store credit card details
- Use Razorpay/Stripe tokenization
- Verify payment signatures
- Handle webhooks with signature validation

---

## 7. Performance & Optimization

### **Database**
- Index frequently queried fields (email, slug, sku, order_number)
- Use database connection pooling
- Implement caching for:
  - Product listings
  - Categories & brands
  - Settings
- Use Redis for session management and cart storage

### **API**
- Implement pagination (default: 20 items per page)
- Use eager loading to prevent N+1 queries
- Compress responses (gzip)
- CDN for static assets & product images
- Image optimization (WebP format, multiple sizes)

### **Caching Strategy**
```
Redis cache:
- Product details: 1 hour TTL
- Category list: 24 hours TTL
- Brand list: 24 hours TTL
- Settings: 24 hours TTL
- Cart: 7 days TTL
- Session: 24 hours TTL

Cache invalidation:
- Clear product cache when admin updates product
- Clear category cache when admin updates categories
```

---

## 8. File Upload Requirements

### **Product Images**
- Max file size: 5MB per image
- Allowed formats: JPG, JPEG, PNG, WebP
- Generate multiple sizes:
  - Thumbnail: 150x150
  - Medium: 500x500
  - Large: 1200x1200
- Store in S3/Cloudinary
- Maintain aspect ratio

### **Brand/Category Images**
- Max file size: 2MB
- Allowed formats: JPG, PNG, SVG
- Sizes: 300x300 (square)

---

## 9. Logging & Monitoring

### **Application Logs**
- Error logs (all exceptions)
- Access logs (HTTP requests)
- Security logs (failed login attempts, suspicious activity)
- Business logs (orders, payments)

### **Monitoring**
- API response times
- Database query performance
- Error rates
- Payment success/failure rates
- Order conversion rates

### **Tools**
- Winston/Pino for logging
- Sentry for error tracking
- New Relic/Datadog for APM
- PM2 for process management

---

## 10. Testing Requirements

### **Unit Tests**
- Test all business logic functions
- Test utility functions (GST calculation, order number generation)
- Mock external API calls

### **Integration Tests**
- Test API endpoints
- Test database operations
- Test payment flow

### **Test Coverage**
- Minimum 70% code coverage
- Critical paths must have 100% coverage:
  - Order placement
  - Payment processing
  - GST calculation
  - Stock management

---

## 11. Deployment & Environment

### **Environment Variables**
```
# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname
DATABASE_POOL_SIZE=20

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
REFRESH_TOKEN_SECRET=your-refresh-secret
REFRESH_TOKEN_EXPIRES_IN=7d

# Admin
ADMIN_JWT_SECRET=your-admin-secret
ADMIN_JWT_EXPIRES_IN=12h

# Payment
RAZORPAY_KEY_ID=your-key-id
RAZORPAY_KEY_SECRET=your-key-secret
RAZORPAY_WEBHOOK_SECRET=your-webhook-secret

# Email
SENDGRID_API_KEY=your-sendgrid-key
FROM_EMAIL=noreply@harishcloths.com
ADMIN_EMAIL=admin@harishcloths.com

# File Storage
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=harish-cloths-images
AWS_REGION=ap-south-1

# Redis
REDIS_URL=redis://localhost:6379
REDIS_TTL=3600

# App
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://harishcloths.com
ADMIN_URL=https://admin.harishcloths.com

# Rate Limiting
RATE_LIMIT_WINDOW=15min
RATE_LIMIT_MAX_REQUESTS=100

# Shipping
DEFAULT_SHIPPING_RATE=100
FREE_SHIPPING_THRESHOLD=2000
```

### **Deployment Checklist**
- [ ] Set up production database with backups
- [ ] Configure Redis for caching
- [ ] Set up CDN for images
- [ ] Configure SSL certificates
- [ ] Set up monitoring & logging
- [ ] Configure email service
- [ ] Set up payment gateway
- [ ] Test all critical flows
- [ ] Set up CI/CD pipeline
- [ ] Configure auto-scaling (if cloud)

---

## 12. API Documentation

### **Generate using:**
- Swagger/OpenAPI 3.0
- Postman Collection
- Include:
  - All endpoints with examples
  - Request/response schemas
  - Authentication details
  - Error codes
  - Rate limits

### **Error Response Format**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  },
  "timestamp": "2024-03-14T10:30:00Z"
}
```

### **Success Response Format**
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 156,
    "pages": 8
  },
  "timestamp": "2024-03-14T10:30:00Z"
}
```

---

## 13. Data Seeding (Development)

### **Seed the following:**
1. **Admin User**
   - Email: admin@harishcloths.com
   - Password: admin123
   - Role: super_admin

2. **Categories** (10-15)
   - Silk, Cotton, Chiffon, Linen, Georgette, Organza, etc.

3. **Brands** (10-15)
   - Indian and international fabric brands

4. **Products** (100-150)
   - Mix of meter and piece items
   - Different price ranges
   - Various stock levels

5. **Sample Customers** (20-30)
   - With addresses

6. **Sample Orders** (30-50)
   - Different statuses
   - Various payment methods

7. **GST Rates**
   - 5%, 12%, 18% with HSN codes

8. **Shipping Zones**
   - Metro, Tier 1, Tier 2, Rest of India

9. **Settings**
   - Default configurations

---

## 14. Frontend Integration Points

### **Frontend should expect:**
1. **Product data** with all attributes including selling_unit
2. **Real-time cart calculations** via API
3. **Order status updates** via polling or webhooks
4. **Dynamic filters** from `/api/v1/filters/options`
5. **Settings-driven UI** (GST rates, shipping info) from `/api/v1/settings/public`
6. **Image URLs** from CDN with multiple sizes
7. **Pagination metadata** in list responses
8. **Error handling** for all API calls

### **State Management Needed:**
- Cart state (sync with backend)
- User authentication state
- Order tracking
- Wishlist
- Recently viewed products

---

## 15. Additional Features (Nice to Have)

1. **Bulk Operations**
   - Bulk product import/export (CSV)
   - Bulk price updates
   - Bulk stock updates

2. **Advanced Search**
   - Elasticsearch integration
   - Filters: price, color, fabric type, brand, category
   - Autocomplete suggestions

3. **Inventory Alerts**
   - Email admin when stock < threshold
   - Auto-suggest reorder quantity

4. **Customer Loyalty Program**
   - Points system
   - Tier-based discounts

5. **Product Recommendations**
   - Based on purchase history
   - Related products
   - Frequently bought together

6. **SMS Notifications**
   - Order confirmation
   - Shipping updates
   - OTP verification

7. **Multi-language Support**
   - English & Hindi
   - Regional languages

8. **Analytics Dashboard**
   - Revenue charts
   - Best-selling products
   - Customer demographics
   - Traffic sources

9. **Abandoned Cart Recovery**
   - Email reminders
   - Special discounts

10. **Return & Refund Management**
    - Return requests
    - Refund processing
    - Return shipping labels

---

## 16. Database Migrations

### **Use migration tool:**
- Sequelize (if using Sequelize ORM)
- Prisma Migrate (if using Prisma)
- Knex.js migrations
- Alembic (if Python/SQLAlchemy)

### **Migration Strategy:**
- Version controlled migrations
- Separate files for up/down
- Seed data in separate files
- Never modify existing migrations
- Test migrations on staging first

---

## 17. Final Checklist

### **Before launching:**
- [ ] All CRUD operations working
- [ ] Authentication & authorization implemented
- [ ] Payment integration tested
- [ ] GST calculations verified
- [ ] Email notifications working
- [ ] Order flow end-to-end tested
- [ ] Stock management working correctly
- [ ] Admin panel fully functional
- [ ] API documentation complete
- [ ] Error handling on all endpoints
- [ ] Input validation on all endpoints
- [ ] Rate limiting configured
- [ ] Logging set up
- [ ] Monitoring configured
- [ ] Backups scheduled
- [ ] SSL certificates installed
- [ ] CORS configured correctly
- [ ] Environment variables secured
- [ ] Database indexes created
- [ ] Performance tested (load testing)

---

## 18. Support & Maintenance

### **Post-launch:**
1. Monitor error logs daily
2. Check payment gateway reconciliation
3. Monitor inventory levels
4. Review customer feedback
5. Update GST rates as per government changes
6. Regular security audits
7. Database backups (daily)
8. Update dependencies regularly
9. Performance optimization
10. Feature enhancements based on usage

---

## Summary

This backend system should be:
- **Secure**: JWT auth, input validation, rate limiting
- **Scalable**: Caching, CDN, connection pooling
- **Reliable**: Error handling, logging, monitoring
- **Maintainable**: Clean code, documented, tested
- **Feature-complete**: All business requirements covered
- **GST compliant**: Proper Indian tax calculations
- **Payment ready**: Razorpay integration
- **Admin-friendly**: Full control via dashboard APIs

The admin panel frontend is already built and requires these APIs to be fully dynamic and functional. The entire system should allow the admin to control every aspect without hardcoding anything on the frontend.
