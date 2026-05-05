# Harish Cloths E-Commerce Platform - Complete Backend Architecture

## 📋 System Overview

This is a production-ready e-commerce backend built with Node.js, Express, MongoDB, and comprehensive microservices architecture.

## 🗂️ Project Structure

```
backend/src/
├── models/              # Database schemas (MongoDB)
│   ├── Customer.js      # Customer user accounts
│   ├── Product.js       # Product catalog
│   ├── Order.js         # Orders & transactions
│   ├── Review.js        # Product reviews
│   ├── Discount.js      # Coupons & promotions
│   ├── Return.js        # Return requests
│   ├── Inventory.js     # Stock management
│   ├── PaymentTransaction.js  # Payment records
│   ├── Notification.js  # User notifications
│   ├── Tax.js           # Tax rules
│   ├── Brand.js         # Product brands
│   ├── Category.js      # Product categories
│   ├── AdminUser.js     # Admin accounts
│   └── AppSettings.js   # Global store settings
│
├── controllers/         # Business logic
│   ├── authController.js       # Customer auth
│   ├── productController.js    # Product CRUD
│   ├── orderController.js      # Order management
│   ├── reviewController.js     # Reviews & ratings
│   ├── paymentController.js    # Payment processing
│   └── adminController.js      # Admin operations
│
├── routes/              # API endpoints
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── orderRoutes.js
│   ├── reviewRoutes.js
│   ├── paymentRoutes.js
│   ├── adminRoutes.js
│   └── catalogRoutes.js
│
├── middleware/          # Request processing
│   ├── auth.js          # JWT authentication
│   ├── validation.js    # Input validation
│   ├── errorHandler.js  # Error handling
│   ├── rateLimiter.js   # Rate limiting
│   └── logger.js        # Request logging
│
├── services/            # External integrations
│   ├── paymentService.js  # Razorpay integration
│   ├── emailService.js    # Email notifications
│   ├── inventoryService.js  # Stock management
│   ├── discountService.js   # Coupon logic
│   └── taxService.js        # Tax calculations
│
├── validation/          # Joi schemas
│   ├── customerValidation.js
│   ├── productValidation.js
│   ├── orderValidation.js
│   ├── adminValidation.js
│   └── customerOrderValidation.js
│
├── utils/               # Utility functions
├── config/              # Configuration files
├── app.js               # Express application
└── server.js            # Server entry point
```

## 🔌 API Endpoints

### Authentication (Customer)
- `POST /api/v1/auth/register` - Register new customer
- `POST /api/v1/auth/login` - Customer login
- `GET /api/v1/auth/profile` - Get profile (auth required)
- `PUT /api/v1/auth/profile` - Update profile
- `POST /api/v1/auth/request-password-reset` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset password

### Products
- `GET /api/v1/products` - List products (with filters)
- `GET /api/v1/products/:id` - Get product details
- `GET /api/v1/products/search?q=query` - Search products
- `GET /api/v1/products/featured` - Get featured products
- `GET /api/v1/products/category/:categoryId` - Products by category
- `GET /api/v1/products/brand/:brandId` - Products by brand
- `GET /api/v1/products/:id/related` - Related products
- `GET /api/v1/products/:id/reviews` - Product reviews
- `GET /api/v1/catalog/` - Get brands and categories

### Orders
- `POST /api/v1/orders` - Create order
- `GET /api/v1/orders` - Get customer orders
- `GET /api/v1/orders/:orderId` - Get order details
- `POST /api/v1/orders/:orderId/cancel` - Cancel order
- `POST /api/v1/orders/:orderId/return` - Request return
- `GET /api/v1/orders/track/:orderNumber` - Track order (public)

### Reviews
- `POST /api/v1/reviews` - Create review
- `GET /api/v1/reviews/product/:productId` - Get product reviews
- `PUT /api/v1/reviews/:reviewId` - Update review
- `DELETE /api/v1/reviews/:reviewId` - Delete review
- `POST /api/v1/reviews/:reviewId/helpful` - Mark as helpful
- `POST /api/v1/reviews/:reviewId/unhelpful` - Mark as unhelpful

### Payments
- `POST /api/v1/payment/create-order` - Create Razorpay order
- `POST /api/v1/payment/verify` - Verify payment
- `POST /api/v1/payment/failure` - Log failed payment
- `POST /api/v1/payment/refund-request` - Request refund
- `POST /api/v1/payment/webhook/razorpay` - Razorpay webhook

### Admin
- `GET /api/v1/admin/dashboard` - Dashboard stats
- `GET /api/v1/admin/analytics` - Analytics data
- `POST /api/v1/admin/products` - Create product
- `PUT /api/v1/admin/products/:productId` - Update product
- `DELETE /api/v1/admin/products/:productId` - Delete product
- `GET /api/v1/admin/orders` - All orders
- `PUT /api/v1/admin/orders/:orderId/status` - Update order status
- `GET /api/v1/admin/customers` - Customer list
- `GET /api/v1/admin/customers/:customerId` - Customer details
- `GET /api/v1/admin/returns` - Return requests
- `POST /api/v1/admin/returns/:returnId/approve` - Approve return
- `GET /api/v1/admin/reviews` - Pending reviews
- `POST /api/v1/admin/reviews/:reviewId/approve` - Approve review
- `POST /api/v1/admin/reviews/:reviewId/reject` - Reject review

## 🔐 Authentication

### JWT Token Structure
```json
{
  "sub": "customer_id",
  "role": "customer | admin",
  "iat": 1234567890,
  "exp": 1234654290
}
```

### Headers
```
Authorization: Bearer <token>
```

## 📦 Database Models

### Customer
- Full authentication with password hashing
- Multiple addresses support
- Wishlist functionality
- Loyalty points tracking
- Account verification

### Product
- Full-text search support
- Variants management
- Stock tracking
- Tax configuration
- SEO metadata

### Order
- Complete order lifecycle
- Multiple payment methods
- Shipping tracking
- Return/refund workflow
- Status history with audit trail

### Review
- Star ratings (1-5)
- Verified purchase verification
- Image & video support
- Moderation workflow
- Helpful/unhelpful voting

### Discount
- Percentage & fixed discounts
- Time-based validity
- Category/product-specific
- Usage limits & redemption tracking
- Stacking rules

### Return
- Multi-item returns
- Refund processing
- Return shipping tracking
- Inspection notes
- Audit trail

### Payment Transaction
- Complete transaction history
- Payment gateway responses
- Refund tracking
- Multiple payment methods

### Inventory
- Real-time stock tracking
- Reserved vs available stock
- Stock history/audit trail
- Low stock alerts
- Reorder management

## 🔧 Services

### Payment Service (Razorpay)
- Order creation
- Signature verification
- Refunds
- Webhook handling

### Email Service
- Order confirmation
- Shipping updates
- Payment confirmations
- Password resets
- Welcome emails
- Multi-channel notifications

### Inventory Service
- Stock reservation on order
- Stock confirmation on delivery
- Return stock processing
- Low stock alerts
- Manual adjustments

### Discount Service
- Coupon validation
- Discount calculation
- Usage tracking

### Tax Service
- Tax rule management
- Slab-based tax calculation
- Country/state/city targeting

## 🛡️ Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt with salt rounds
- **Rate Limiting** - Prevent brute force attacks
- **Input Validation** - Joi schemas
- **Error Handling** - Comprehensive error responses
- **CORS** - Cross-origin resource sharing
- **Request Logging** - Winston logger
- **Account Lockout** - After failed login attempts

## 📊 Required Environment Variables

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/harish-cloths

# JWT
JWT_ACCESS_SECRET=your_jwt_secret_key

# Admin
ADMIN_EMAIL=admin@harishcloths.com
ADMIN_PASSWORD=admin123

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_password
EMAIL_FROM_ADDRESS=noreply@harishcloths.com

# Frontend
FRONTEND_URL=http://localhost:5173

# Environment
NODE_ENV=development
PORT=3000
```

## 🚀 Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install joi express-rate-limit winston nodemailer razorpay cloudinary dotenv mongoose bcryptjs jsonwebtoken cors multer
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start the server:**
   ```bash
   npm run dev    # Development with nodemon
   npm start      # Production
   ```

## 📈 Data Flow

### Customer Registration
```
Frontend (Register Form)
    ↓
POST /api/v1/auth/register
    ↓
Validate input (Joi schema)
    ↓
Hash password (bcrypt)
    ↓
Create Customer document
    ↓
Send welcome email
    ↓
Return JWT token
```

### Place Order Flow
```
Frontend (Checkout)
    ↓
POST /api/v1/orders
    ↓
Validate items & address
    ↓
Calculate tax & discounts
    ↓
Create Order document
    ↓
Create Razorpay order
    ↓
Return Razorpay order ID
    ↓
Frontend redirects to Razorpay
    ↓
POST /api/v1/payment/verify
    ↓
Verify signature
    ↓
Update order status to "confirmed"
    ↓
Send confirmation email
    ↓
Return success
```

### Return/Refund Flow
```
Customer requests return
    ↓
Create Return document
    ↓
Admin reviews & approves
    ↓
POST /api/v1/payment/:orderId/refund
    ↓
Process refund via Razorpay
    ↓
Update order status to "refunded"
    ↓
Record refund transaction
    ↓
Send refund notification
```

## 🔍 Monitoring & Logging

All requests are logged with:
- Method & URL
- Status code
- Response time
- IP address
- Error details (if any)

Logs are stored in:
- `logs/error.log` - Errors only
- `logs/combined.log` - All requests

## 📱 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ },
  "pagination": { /* if applicable */ }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

## ✅ Validation Examples

All inputs are validated using Joi schemas before processing:

- Email format validation
- Phone number format (10 digits)
- Password strength (min 6 characters)
- Zipcode format (6 digits)
- Required fields
- Type checking
- Range validation

## 🔗 Next Steps

1. **Frontend Integration** - Connect React frontend to these APIs
2. **Admin Panel** - Use admin routes for dashboard management
3. **Testing** - Create comprehensive test suites
4. **Deployment** - Deploy to production environment (AWS, Heroku, etc.)
5. **Monitoring** - Set up APM tools (DataDog, New Relic)
6. **CI/CD** - GitHub Actions or GitLab CI

---

**Built for a complete e-commerce experience with production-ready code!**
