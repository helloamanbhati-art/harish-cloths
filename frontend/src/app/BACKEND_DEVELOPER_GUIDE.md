# 👨‍💻 Backend Developer Onboarding Guide

## Welcome! 👋

You've been assigned to build the backend for **Harish Cloths** - a luxury women's clothing fabrics e-commerce platform. The frontend is complete and waiting for your APIs!

---

## 📚 Required Reading (In Order)

### 1. Start Here: **QUICK_REFERENCE.md** (5 min read)
Get familiar with the project basics, tech stack, and access URLs.

### 2. Main Document: **BACKEND_INTEGRATION_PROMPT.md** (30 min read) ⭐
This is your **PRIMARY REFERENCE** containing:
- Complete database schema (18 tables)
- All API endpoints (~100 endpoints)
- Business logic requirements
- GST calculation formulas
- Security requirements
- Payment integration guide
- Email notification templates
- Testing requirements
- Deployment checklist

### 3. Project Overview: **COMPLETE_PROJECT_SUMMARY.md** (15 min read)
Understand the full project architecture, features, and roadmap.

### 4. Frontend Context: **ADMIN_FOLDER_STRUCTURE.md** (10 min read)
See how the frontend is organized and what data it expects.

---

## 🎯 Your Mission

Build a complete backend system that:
1. ✅ Provides ~100 RESTful API endpoints
2. ✅ Manages 18 database tables
3. ✅ Handles Indian GST tax calculations
4. ✅ Integrates Razorpay payment gateway
5. ✅ Sends transactional emails
6. ✅ Manages product images (S3/Cloudinary)
7. ✅ Implements JWT authentication
8. ✅ Provides admin analytics data

---

## 🗓️ Suggested 10-Week Timeline

### Week 1-2: Foundation
**Goal**: Database & Authentication

#### Tasks:
- [ ] Set up project (Node.js/Express OR Python/FastAPI)
- [ ] Configure PostgreSQL database
- [ ] Create all 18 tables (see schema in BACKEND_INTEGRATION_PROMPT.md)
- [ ] Set up database migrations
- [ ] Implement JWT authentication
- [ ] Create admin auth endpoints (login, logout, me)
- [ ] Create user auth endpoints (register, login, logout)
- [ ] Write seed data scripts
- [ ] Test authentication flow

#### Deliverables:
```
✓ Database schema created
✓ Migrations working
✓ POST /api/v1/auth/register
✓ POST /api/v1/auth/login
✓ POST /api/v1/admin/auth/login
✓ GET  /api/v1/auth/me
✓ Seed data populated
```

---

### Week 3-4: Core E-Commerce
**Goal**: Products, Categories, Brands, Cart

#### Tasks:
- [ ] Implement Product APIs (10 endpoints)
- [ ] Implement Category APIs (6 endpoints)
- [ ] Implement Brand APIs (5 endpoints)
- [ ] Implement Cart APIs (6 endpoints)
- [ ] Set up file upload (AWS S3 / Cloudinary)
- [ ] Image optimization pipeline
- [ ] Implement filtering & search
- [ ] Write unit tests for business logic

#### Deliverables:
```
✓ GET    /api/v1/products (with filters, pagination)
✓ GET    /api/v1/products/:slug
✓ POST   /api/v1/admin/products
✓ PUT    /api/v1/admin/products/:id
✓ DELETE /api/v1/admin/products/:id
✓ POST   /api/v1/admin/products/:id/images
✓ GET    /api/v1/categories
✓ GET    /api/v1/brands
✓ POST   /api/v1/cart/items
✓ PUT    /api/v1/cart/items/:id
```

---

### Week 5-6: Orders & Payments
**Goal**: Checkout, Orders, Razorpay Integration

#### Tasks:
- [ ] Implement checkout calculation API
- [ ] Build GST calculation logic (CGST/SGST/IGST)
- [ ] Implement order creation
- [ ] Integrate Razorpay SDK
- [ ] Create payment initiation endpoint
- [ ] Create payment verification endpoint
- [ ] Handle Razorpay webhooks
- [ ] Implement order status management
- [ ] Create invoice generation (PDF)
- [ ] Write integration tests

#### Key Business Logic (CRITICAL):
```javascript
// GST Calculation
function calculateGST(amount, gstRate, isInterstate, state) {
  const gstAmount = (amount * gstRate) / 100;
  
  if (isInterstate) {
    return {
      igst: gstAmount,
      cgst: 0,
      sgst: 0,
      total: gstAmount
    };
  } else {
    return {
      igst: 0,
      cgst: gstAmount / 2,
      sgst: gstAmount / 2,
      total: gstAmount
    };
  }
}

// Order Total Calculation
function calculateOrderTotal(cartItems, coupon, shipping, state) {
  // 1. Calculate subtotal
  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);
  
  // 2. Apply discount
  const discount = coupon ? calculateDiscount(coupon, subtotal) : 0;
  
  // 3. Calculate taxable amount
  const taxableAmount = subtotal - discount;
  
  // 4. Calculate GST
  const gst = calculateGST(taxableAmount, 12, isInterstate(state));
  
  // 5. Add shipping
  const total = taxableAmount + gst.total + shipping;
  
  return {
    subtotal,
    discount,
    taxableAmount,
    gst,
    shipping,
    total
  };
}

// Stock Management
async function reduceStock(productId, quantity) {
  const product = await getProduct(productId);
  
  if (product.stock_quantity < quantity) {
    throw new Error('Insufficient stock');
  }
  
  const newStock = product.stock_quantity - quantity;
  
  await updateProduct(productId, {
    stock_quantity: newStock,
    stock_status: getStockStatus(newStock, product.low_stock_threshold)
  });
}

function getStockStatus(quantity, threshold) {
  if (quantity === 0) return 'out_of_stock';
  if (quantity <= threshold) return 'low_stock';
  return 'in_stock';
}
```

#### Deliverables:
```
✓ POST /api/v1/checkout/calculate
✓ POST /api/v1/checkout/initiate (Razorpay)
✓ POST /api/v1/checkout/verify
✓ POST /api/v1/orders
✓ GET  /api/v1/orders
✓ GET  /api/v1/orders/:id
✓ POST /api/v1/orders/:id/cancel
✓ POST /api/v1/payments/razorpay/webhook
✓ GET  /api/v1/orders/:id/invoice (PDF)
✓ GST calculation working correctly
✓ Stock management working
```

---

### Week 7-8: Admin Features
**Goal**: Dashboard, Analytics, Management

#### Tasks:
- [ ] Implement dashboard statistics API
- [ ] Build analytics endpoints (charts data)
- [ ] Implement order management APIs
- [ ] Create customer management APIs
- [ ] Build coupon management
- [ ] Implement settings management
- [ ] Create activity logging
- [ ] Build reporting APIs
- [ ] Write admin integration tests

#### Deliverables:
```
✓ GET /api/v1/admin/dashboard/stats
✓ GET /api/v1/admin/analytics/revenue
✓ GET /api/v1/admin/analytics/categories
✓ PUT /api/v1/admin/orders/:id/status
✓ GET /api/v1/admin/customers
✓ POST /api/v1/admin/coupons
✓ GET /api/v1/admin/settings
✓ PUT /api/v1/admin/settings
```

---

### Week 9-10: Polish & Deploy
**Goal**: Testing, Optimization, Deployment

#### Tasks:
- [ ] Write comprehensive tests (70%+ coverage)
- [ ] Set up Redis caching
- [ ] Implement rate limiting
- [ ] Security audit & fixes
- [ ] Performance optimization
- [ ] Load testing (Apache JMeter / k6)
- [ ] Set up monitoring (Sentry, New Relic)
- [ ] Configure logging (Winston/Pino)
- [ ] Set up CI/CD pipeline
- [ ] Deploy to staging
- [ ] User acceptance testing
- [ ] Deploy to production
- [ ] Create API documentation (Swagger)

#### Deliverables:
```
✓ Test coverage ≥ 70%
✓ API response time < 200ms
✓ Rate limiting configured
✓ Redis caching implemented
✓ Security headers configured
✓ Monitoring dashboards set up
✓ Production deployment complete
✓ API documentation published
```

---

## 🛠️ Development Setup

### Prerequisites
```bash
# Choose your stack:
Option 1: Node.js + Express
- Node.js 18+
- npm or yarn
- PostgreSQL 14+
- Redis 6+

Option 2: Python + FastAPI
- Python 3.10+
- pip
- PostgreSQL 14+
- Redis 6+
```

### Initial Setup
```bash
# 1. Create project directory
mkdir harish-cloths-backend
cd harish-cloths-backend

# 2. Initialize project
# For Node.js:
npm init -y
npm install express pg jsonwebtoken bcrypt multer aws-sdk razorpay nodemailer

# For Python:
pip install fastapi uvicorn sqlalchemy psycopg2 pyjwt passlib boto3 razorpay

# 3. Set up database
createdb harish_cloths_db

# 4. Create .env file
cp .env.example .env
# Fill in your credentials

# 5. Run migrations
npm run migrate
# OR
alembic upgrade head

# 6. Seed data
npm run seed
# OR
python seed.py

# 7. Start server
npm run dev
# OR
uvicorn main:app --reload
```

### Environment Variables Template
```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/harish_cloths_db
DATABASE_POOL_SIZE=20

# JWT
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_EXPIRES_IN=24h
REFRESH_TOKEN_SECRET=your-refresh-secret-key
ADMIN_JWT_SECRET=your-admin-secret-key
ADMIN_JWT_EXPIRES_IN=12h

# Payment Gateway
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
RAZORPAY_WEBHOOK_SECRET=xxxxx

# Email Service (Choose one)
SENDGRID_API_KEY=SG.xxxxx
# OR
AWS_SES_ACCESS_KEY=xxxxx
AWS_SES_SECRET_KEY=xxxxx

# File Storage
AWS_ACCESS_KEY_ID=xxxxx
AWS_SECRET_ACCESS_KEY=xxxxx
AWS_S3_BUCKET=harish-cloths-images
AWS_REGION=ap-south-1

# Redis
REDIS_URL=redis://localhost:6379
REDIS_TTL=3600

# Application
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5173
ADMIN_URL=http://localhost:5173/admin

# Rate Limiting
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## 📊 Database Schema Quick Reference

### Core Tables (18)
```sql
1. users                    -- Customer accounts
2. addresses                -- Shipping/billing addresses
3. admin_users              -- Admin accounts with roles
4. categories               -- Product categories
5. brands                   -- Product brands
6. products                 -- Product catalog
7. product_images           -- Product image gallery
8. orders                   -- Order master table
9. order_items              -- Order line items
10. order_status_history    -- Order status audit trail
11. carts                   -- Shopping carts
12. cart_items              -- Cart line items
13. wishlists               -- User wishlists
14. coupons                 -- Discount codes
15. coupon_usage            -- Coupon usage tracking
16. settings                -- System settings (key-value)
17. gst_rates               -- GST configuration
18. shipping_zones          -- Shipping rate zones
```

**Full schema with all columns**: See `BACKEND_INTEGRATION_PROMPT.md` Section 2

---

## 🔌 API Endpoints Overview

### Public APIs (Customer-facing)
- **Auth**: 7 endpoints
- **Products**: 8 endpoints
- **Categories**: 3 endpoints
- **Brands**: 3 endpoints
- **Cart**: 6 endpoints
- **Orders**: 5 endpoints
- **Checkout**: 5 endpoints
- **Payments**: 3 endpoints

### Admin APIs
- **Dashboard**: 4 endpoints
- **Products**: 10 endpoints
- **Orders**: 9 endpoints
- **Categories**: 6 endpoints
- **Brands**: 5 endpoints
- **Customers**: 6 endpoints
- **Settings**: 7 endpoints
- **Analytics**: 4 endpoints

**Total**: ~100 endpoints

**Complete API documentation**: See `BACKEND_INTEGRATION_PROMPT.md` Section 3

---

## 🧪 Testing Strategy

### Unit Tests
```javascript
// Example: Test GST calculation
describe('GST Calculation', () => {
  test('should calculate CGST/SGST for intrastate', () => {
    const result = calculateGST(1000, 12, false);
    expect(result.cgst).toBe(60);
    expect(result.sgst).toBe(60);
    expect(result.total).toBe(120);
  });
  
  test('should calculate IGST for interstate', () => {
    const result = calculateGST(1000, 12, true);
    expect(result.igst).toBe(120);
    expect(result.total).toBe(120);
  });
});

// Example: Test order calculation
describe('Order Total', () => {
  test('should calculate order total correctly', () => {
    const items = [
      { price: 1000, quantity: 2 },
      { price: 500, quantity: 1 }
    ];
    const result = calculateOrderTotal(items, null, 100, 'TN');
    expect(result.subtotal).toBe(2500);
    expect(result.total).toBeGreaterThan(2500); // With GST & shipping
  });
});
```

### Integration Tests
```javascript
// Example: Test product creation
describe('POST /api/v1/admin/products', () => {
  test('should create product with valid data', async () => {
    const response = await request(app)
      .post('/api/v1/admin/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(validProductData);
    
    expect(response.status).toBe(201);
    expect(response.body.data.name).toBe(validProductData.name);
  });
  
  test('should reject without auth', async () => {
    const response = await request(app)
      .post('/api/v1/admin/products')
      .send(validProductData);
    
    expect(response.status).toBe(401);
  });
});
```

---

## 🔒 Security Checklist

- [ ] JWT tokens with proper expiry
- [ ] Password hashing with bcrypt (10+ rounds)
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (use ORM/parameterized queries)
- [ ] XSS prevention (sanitize inputs)
- [ ] Rate limiting (100 req/15min per IP)
- [ ] CORS configured for frontend domain only
- [ ] HTTPS enforced in production
- [ ] Secure headers (helmet.js)
- [ ] Environment variables for secrets
- [ ] Payment signature verification
- [ ] Webhook signature validation
- [ ] File upload validation (type, size)
- [ ] Admin route protection
- [ ] Activity logging for admin actions

---

## 📧 Email Templates Needed

1. **Welcome Email** - After user registration
2. **Email Verification** - With verification link
3. **Password Reset** - With reset token
4. **Order Confirmation** - Order details with items
5. **Order Shipped** - With tracking number
6. **Order Delivered** - Delivery confirmation
7. **Order Cancelled** - Cancellation details
8. **Refund Processed** - Refund confirmation
9. **Low Stock Alert** (Admin) - Inventory warning
10. **New Order Alert** (Admin) - New order notification

**Template variables**: See `BACKEND_INTEGRATION_PROMPT.md` Section 5

---

## 💳 Razorpay Integration Flow

```javascript
// Step 1: Create Razorpay order
app.post('/api/v1/checkout/initiate', async (req, res) => {
  const { amount } = req.body;
  
  const options = {
    amount: amount * 100, // Convert to paise
    currency: 'INR',
    receipt: generateReceiptId(),
  };
  
  const order = await razorpay.orders.create(options);
  res.json({ razorpay_order_id: order.id, amount, currency: 'INR' });
});

// Step 2: Frontend shows Razorpay checkout
// User completes payment

// Step 3: Verify payment
app.post('/api/v1/checkout/verify', async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  
  // Verify signature
  const isValid = verifyRazorpaySignature(
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  );
  
  if (isValid) {
    // Create order in database
    const order = await createOrder(req.body);
    
    // Send confirmation email
    await sendOrderConfirmation(order);
    
    res.json({ success: true, order });
  } else {
    res.status(400).json({ error: 'Invalid payment signature' });
  }
});

// Step 4: Handle webhooks
app.post('/api/v1/payments/razorpay/webhook', async (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  
  // Verify webhook signature
  const isValid = verifyWebhookSignature(req.body, signature);
  
  if (isValid) {
    const event = req.body.event;
    
    switch (event) {
      case 'payment.captured':
        await handlePaymentCaptured(req.body.payload);
        break;
      case 'payment.failed':
        await handlePaymentFailed(req.body.payload);
        break;
    }
    
    res.json({ status: 'ok' });
  } else {
    res.status(400).json({ error: 'Invalid signature' });
  }
});
```

---

## 📊 Analytics Data Format

Frontend expects specific data structures for charts:

```javascript
// Revenue Chart Data
{
  data: [
    { date: 'Mar 1', revenue: 12500, orders: 5 },
    { date: 'Mar 2', revenue: 15000, orders: 7 },
    // ... 30 days
  ]
}

// Category Distribution
{
  data: [
    { name: 'Silk', value: 45, color: '#8b5cf6' },
    { name: 'Cotton', value: 30, color: '#3b82f6' },
    { name: 'Chiffon', value: 15, color: '#ec4899' },
    { name: 'Linen', value: 10, color: '#f59e0b' }
  ]
}

// Top Products
{
  data: [
    { name: 'Premium Silk', sales: 145, revenue: 72500 },
    { name: 'Cotton Voile', sales: 120, revenue: 48000 },
    // ...
  ]
}

// Dashboard Stats
{
  totalRevenue: 250000,
  totalOrders: 156,
  totalCustomers: 89,
  totalProducts: 234,
  revenueChange: '+12.5%',
  ordersChange: '+8.2%'
}
```

---

## 🚀 Deployment Guide

### Production Checklist
- [ ] Environment variables configured
- [ ] Database backup scheduled
- [ ] Redis configured
- [ ] S3 bucket created & configured
- [ ] Razorpay live keys obtained
- [ ] Email service configured
- [ ] SSL certificate installed
- [ ] Monitoring set up (Sentry, New Relic)
- [ ] Logging configured
- [ ] Rate limiting enabled
- [ ] CORS restricted to production domain
- [ ] Load testing completed
- [ ] Security audit done
- [ ] API documentation published

### Recommended Platforms
- **Backend Hosting**: AWS EC2, DigitalOcean, Heroku, Railway
- **Database**: AWS RDS, DigitalOcean Managed PostgreSQL
- **Redis**: AWS ElastiCache, Redis Cloud
- **File Storage**: AWS S3, Cloudinary
- **Monitoring**: Sentry, New Relic, Datadog
- **CI/CD**: GitHub Actions, GitLab CI, Jenkins

---

## 🐛 Debugging Tips

### Common Issues

**Issue**: Database connection failing
```bash
# Check connection string
psql $DATABASE_URL

# Check PostgreSQL is running
sudo systemctl status postgresql
```

**Issue**: JWT verification failing
```javascript
// Check secret matches
console.log('Using secret:', process.env.JWT_SECRET);

// Check token format
const decoded = jwt.decode(token, { complete: true });
console.log(decoded);
```

**Issue**: Razorpay webhook not working
```javascript
// Log webhook payload
console.log('Webhook received:', req.body);
console.log('Signature:', req.headers['x-razorpay-signature']);

// Test webhook locally with ngrok
ngrok http 3000
```

**Issue**: Image upload failing
```javascript
// Check S3 credentials
console.log('AWS Key:', process.env.AWS_ACCESS_KEY_ID);

// Check file size
console.log('File size:', file.size / 1024 / 1024, 'MB');

// Check MIME type
console.log('MIME type:', file.mimetype);
```

---

## 📞 Support & Questions

### Getting Stuck?

1. **Check Documentation**: All answers are in `BACKEND_INTEGRATION_PROMPT.md`
2. **Review Schema**: Database structure is fully documented
3. **Check API Specs**: Every endpoint is documented with examples
4. **Test Incrementally**: Build one feature at a time
5. **Write Tests**: Tests help catch issues early

### Key Resources
- Razorpay Docs: https://razorpay.com/docs/
- PostgreSQL Docs: https://www.postgresql.org/docs/
- JWT Best Practices: https://jwt.io/introduction
- REST API Design: https://restfulapi.net/

---

## ✅ Definition of Done

Your backend is complete when:

- [ ] All 100 API endpoints working
- [ ] Database schema matches specification
- [ ] Authentication & authorization working
- [ ] GST calculations accurate
- [ ] Razorpay integration tested
- [ ] Email notifications sending
- [ ] File uploads working
- [ ] Stock management functioning
- [ ] Order flow end-to-end tested
- [ ] Admin dashboard APIs returning correct data
- [ ] Analytics endpoints providing chart data
- [ ] 70%+ test coverage achieved
- [ ] API documentation published
- [ ] Security audit passed
- [ ] Performance benchmarks met (<200ms response)
- [ ] Production deployment successful
- [ ] Frontend integrated & tested

---

## 🎉 Success Metrics

After launch, monitor:
- API response times < 200ms
- 99.9% uptime
- Zero critical bugs
- Payment success rate > 95%
- Order completion rate
- Database query performance
- Error rates < 1%

---

## 📝 Final Notes

- **Be thorough**: Every detail matters in e-commerce
- **Test extensively**: Especially payment & GST logic
- **Document as you go**: Future devs will thank you
- **Ask questions**: Better to clarify than assume
- **Follow standards**: REST best practices, semantic versioning
- **Think security**: Every endpoint is a potential vulnerability
- **Optimize later**: Get it working first, then optimize
- **Use version control**: Commit often, meaningful messages

---

**Good luck! You've got this! 🚀**

If you need clarification on anything, refer to:
- `BACKEND_INTEGRATION_PROMPT.md` (primary reference)
- `COMPLETE_PROJECT_SUMMARY.md` (project overview)
- `QUICK_REFERENCE.md` (quick lookups)

**Remember**: The frontend is complete and waiting for your APIs. Every endpoint you build brings the platform closer to launch! 💪
