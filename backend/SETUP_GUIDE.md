# Complete E-Commerce Backend Setup Guide

## 🎯 What Has Been Built

Your e-commerce system now has:

### ✅ Database Models (13 Collections)
1. **Customer** - Full user authentication & profile management
2. **Product** - Complete product catalog with variants
3. **Order** - Full order lifecycle with payment tracking
4. **Review** - Product reviews with moderation
5. **Discount** - Coupon & promotion system
6. **Return** - Return & refund workflow
7. **Inventory** - Real-time stock management
8. **PaymentTransaction** - Payment history
9. **Notification** - Multi-channel notifications
10. **Tax** - Tax rule engine
11. **Brand** - Brand management
12. **Category** - Category management
13. **AdminUser** - Admin accounts

### ✅ Complete API Routes
- 50+ endpoints covering all operations
- Full CRUD for products, orders, customers
- Payment integration (Razorpay)
- Review system with moderation
- Return/refund processing
- Admin analytics & dashboard

### ✅ Security & Validation
- JWT authentication
- Password hashing (bcrypt)
- Input validation (Joi)
- Rate limiting
- Error handling
- Request logging

---

## 📦 Installation Steps

### Step 1: Install New Dependencies

```bash
cd backend

# Install all required packages
npm install joi express-rate-limit winston nodemailer razorpay
```

Or copy the new package.json:
```bash
cp package.json.new package.json
npm install
```

### Step 2: Create/Update .env File

Create a `.env` file in the backend directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/harish-cloths

# JWT Security
JWT_ACCESS_SECRET=your_super_secret_jwt_key_here_change_this

# Admin Account
ADMIN_EMAIL=admin@harishcloths.com
ADMIN_PASSWORD=admin123

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay Payment (Sign up at https://razorpay.com)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx

# Email Configuration (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_password
EMAIL_FROM_ADDRESS=noreply@harishcloths.com

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Environment
NODE_ENV=development
PORT=3000
LOG_LEVEL=info
```

### Step 3: Verify Project Structure

Your `backend/src/` should now have:

```
src/
├── models/              ✅ 13 comprehensive models
├── controllers/         ✅ 6 controllers with all logic
├── routes/              ✅ 7 route files
├── middleware/          ✅ Auth, validation, error handling
├── services/            ✅ Payment, email, inventory, etc.
├── validation/          ✅ Input schemas
├── app.js               ✅ Main Express app
└── server.js            ✅ Server entry point
```

### Step 4: Start Development Server

```bash
# Start with nodemon (auto-reload on file changes)
npm run dev

# Or start production server
npm start
```

You should see:
```
Backend running on port 3000
✅ Default admin created: admin@harishcloths.com
```

---

## 🔌 Testing the API

### Test Customer Registration

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

### Test Admin Login

```bash
curl -X POST http://localhost:3000/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@harishcloths.com",
    "password": "admin123"
  }'
```

### Create a Product (Admin Only)

```bash
curl -X POST http://localhost:3000/api/v1/admin/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_admin_token>" \
  -d '{
    "name": "Premium Saree",
    "brand": "622a1234...",
    "category": "622a1234...",
    "price": 2499,
    "description": "Beautiful silk saree",
    "soldBy": "meter",
    "stock": {
      "available": 50,
      "lowStockThreshold": 10
    }
  }'
```

---

## 🔐 Key Security Features Enabled

### 1. Authentication
- **JWT Tokens** - Secure, stateless authentication
- **Password Hashing** - bcryptjs with salt rounds
- **Account Lockout** - After 5 failed login attempts
- **Token Expiration** - 30-day validity

### 2. Validation
- **Input Validation** - All endpoints validate inputs
- **Email Format** - Regex validation
- **Phone Number** - 10-digit validation
- **Type Checking** - Joi schemas

### 3. Rate Limiting
- **Auth Endpoints** - Max 5 requests per 15 minutes
- **API Endpoints** - Max 30 requests per minute
- **Upload Endpoints** - Max 50 uploads per hour
- **General** - Max 100 requests per 15 minutes

### 4. Error Handling
- **Mongoose Errors** - Validation error messages
- **JWT Errors** - Invalid/expired tokens
- **Duplicate Keys** - Unique constraint violations
- **Custom Errors** - Standardized error responses

### 5. Logging
- **Request Logging** - Winston logger
- **Error Tracking** - Stack traces
- **Performance** - Response times
- **Files** - logs/error.log & logs/combined.log

---

## 💳 Payment Integration (Razorpay)

### Setup Razorpay Account
1. Go to https://razorpay.com
2. Sign up for free account
3. Get your **Key ID** and **Key Secret**
4. Add to `.env` file

### Payment Flow
```
1. Customer places order
2. Backend creates Razorpay order
3. Frontend shows Razorpay payment modal
4. Customer completes payment
5. Razorpay callback to backend
6. Backend verifies signature
7. Update order status to "paid"
8. Send confirmation email
```

---

## 📧 Email Configuration

### Using Gmail
1. Enable 2FA on your Gmail account
2. Create an **App Password** (not your regular password)
3. Add to `.env`:
   ```env
   SMTP_EMAIL=your_email@gmail.com
   SMTP_PASSWORD=your_16_char_app_password
   ```

### Using Other Providers
- **Sendgrid**: Update `emailService.js` provider
- **Mailgun**: Add mailgun provider
- **AWS SES**: Add SES provider

---

## 📊 Database Setup

### MongoDB Local
```bash
# Install MongoDB Community Edition
# Then start it
mongod

# Create database (automatic with first document)
# Connection string: mongodb://localhost:27017/harish-cloths
```

### MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Add to `.env`:
   ```env
   MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/harish-cloths
   ```

---

## 🚀 Next Steps

### Frontend Integration
Update your React frontend to use new endpoints:

```javascript
// Example: Login
const response = await fetch('http://localhost:3000/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
const { token, data } = await response.json();
localStorage.setItem('token', token);
```

### Admin Operations
Use new admin endpoints in your admin panel:

```javascript
// Get dashboard stats
const response = await fetch('http://localhost:3000/api/v1/admin/dashboard', {
  headers: {
    'Authorization': `Bearer ${adminToken}`
  }
});
```

### Inventory Management
Orders automatically update inventory:

```javascript
// Stock is reserved when order is created
// Stock is confirmed when order is delivered
// Stock is returned when return is approved
```

### Email Notifications
Automatic emails for:
- ✅ Registration welcome
- ✅ Order confirmation
- ✅ Payment received
- ✅ Shipping updates
- ✅ Delivery confirmation
- ✅ Return approved
- ✅ Refund processed
- ✅ Password reset

---

## 🐛 Troubleshooting

### "MONGODB_URI is missing"
→ Add `MONGODB_URI` to `.env` and ensure MongoDB is running

### "JWT_ACCESS_SECRET is missing"
→ Add `JWT_ACCESS_SECRET` to `.env`

### "Email sending failed"
→ Check SMTP credentials in `.env`
→ Enable less secure apps (if Gmail)

### "Razorpay order creation failed"
→ Check `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`

### "Port 3000 already in use"
→ Change `PORT` in `.env` or stop other services

### "CORS error"
→ Frontend URL should match `FRONTEND_URL` in `.env`
→ Or add to CORS whitelist in `app.js`

---

## 📝 API Documentation

Full API documentation is available in `ARCHITECTURE.md` with:
- All endpoints
- Request/response formats
- Authentication requirements
- Error codes
- Data models

---

## ✨ Production Checklist

Before deploying to production:

- [ ] Change all default passwords
- [ ] Generate strong JWT secret
- [ ] Set `NODE_ENV=production`
- [ ] Use MongoDB Atlas instead of local
- [ ] Enable HTTPS
- [ ] Set up SSL certificates
- [ ] Configure CDN for images
- [ ] Set up backups
- [ ] Enable monitoring (DataDog/New Relic)
- [ ] Load testing
- [ ] Security audit

---

## 📞 Support

For issues or questions:
1. Check `ARCHITECTURE.md` for detailed documentation
2. Review error messages in `logs/error.log`
3. Check `.env` configuration
4. Verify MongoDB connection
5. Review network requests in browser DevTools

---

**Your complete e-commerce backend is now ready! 🎉**

Start the server with `npm run dev` and begin building! 🚀
