# Razorpay Payment Gateway Setup Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: Get Razorpay Test Keys

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/signup)
2. Sign up for a free account
3. Navigate to **Settings → API Keys**
4. You'll see **Test Keys** already available:
   - **Key ID**: `rzp_test_1DP5MM47F8wC1j` (or similar)
   - **Key Secret**: Click "Generate" to get your secret key

### Step 2: Configure Backend Environment

Create/update `backend/.env` file:

```env
# Required - Database
MONGODB_URI=mongodb://localhost:27017/harish-cloths

# Required - Security  
JWT_ACCESS_SECRET=your_strong_secret_key_here
ADMIN_EMAIL=admin@harishcloths.com
ADMIN_PASSWORD=admin123

# Required - Razorpay Payment Gateway
RAZORPAY_KEY_ID=rzp_test_1DP5MM47F8wC1j
RAZORPAY_KEY_SECRET=your_razorpay_secret_key_here

# Optional - Email (for order confirmations)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your_gmail@gmail.com
SMTP_PASSWORD=your_app_password

# Optional - Images (for product uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### Step 3: Configure Frontend Environment

Create/update `frontend/.env` file:

```env
VITE_API_URL=http://localhost:3000
VITE_RAZORPAY_KEY=rzp_test_1DP5MM47F8wC1j
```

### Step 4: Configure Admin Panel Environment

Create/update `admin/.env` file:

```env
VITE_API_URL=http://localhost:3000
VITE_RAZORPAY_KEY=rzp_test_1DP5MM47F8wC1j
```

### Step 5: Start the Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev

# Terminal 3 - Admin Panel (optional)
cd admin
npm run dev
```

---

## 🧪 Test the Payment Flow

### 1. Add Products to Cart
- Browse products on frontend
- Add items to cart
- Proceed to checkout

### 2. Fill Checkout Form
- Enter shipping details
- Click "Proceed to Payment"

### 3. Test Payment
- Click "Pay ₹XXX Securely"
- Razorpay modal should open
- Use test credentials:
  - **Card**: `4111 1111 1111 1111` (any future expiry, any CVV)
  - **UPI**: Any UPI ID
  - **Net Banking**: Any bank

### 4. Verify Success
- Payment should succeed
- Order should be created
- Redirect to order success page

---

## 🔧 Troubleshooting

### "Payment gateway is loading" stuck
**Solution**: Check `VITE_RAZORPAY_KEY` in frontend `.env`

### "Razorpay order creation failed"
**Solution**: Check `RAZORPAY_KEY_SECRET` in backend `.env`

### "Payment verification failed"
**Solution**: Ensure backend is running and accessible

### "Order not created"
**Solution**: Check MongoDB connection and backend logs

### Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Modal doesn't open | Razorpay script not loaded | Check internet connection |
| Invalid key error | Wrong API key | Verify keys in `.env` files |
| Order fails | Backend not running | Start backend server |
| CORS error | Frontend can't reach backend | Check `VITE_API_URL` |

---

## 📱 Test Payment Methods

### Test Cards
- **Success**: `4111 1111 1111 1111`
- **Failure**: `4242 4242 4242 4242`
- **Any expiry date**: Future date
- **Any CVV**: 3 digits

### Test UPI
- Any UPI ID format: `username@paytm`

### Test Net Banking
- Any bank from the list

---

## 🚀 Going Live (Production)

### 1. Get Live Keys
- Go to Razorpay Dashboard
- Complete KYC verification
- Generate Live API Keys

### 2. Update Environment
```env
# Production
RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXXXXXX
RAZORPAY_KEY_SECRET=your_live_secret_key
VITE_RAZORPAY_KEY=rzp_live_XXXXXXXXXXXXXX
```

### 3. Update URLs
```env
VITE_API_URL=https://your-domain.com
FRONTEND_URL=https://your-domain.com
```

### 4. Security Checklist
- [ ] Use HTTPS
- [ ] Never commit `.env` files
- [ ] Use strong JWT secret
- [ ] Enable rate limiting
- [ ] Monitor for fraud

---

## 📞 Support

### Razorpay Support
- **Email**: support@razorpay.com
- **Phone**: 022-6171-7333
- **Chat**: Available in dashboard

### Common Debugging Commands

```bash
# Check backend logs
cd backend && npm run dev

# Test API endpoint
curl http://localhost:3000/health

# Check environment variables
echo $RAZORPAY_KEY_ID
```

---

## ✅ Pre-Flight Checklist

Before testing payments, ensure:

- [ ] Backend server running on port 3000
- [ ] Frontend server running on port 5173
- [ ] MongoDB connected
- [ ] Razorpay keys configured in `.env`
- [ ] No CORS errors in browser console
- [ ] Products available in cart
- [ ] Internet connection active

---

## 🎯 Success Indicators

You'll know it's working when:

1. ✅ Checkout form submits successfully
2. ✅ "Loading Payment Gateway..." shows briefly
3. ✅ Razorpay modal opens with correct amount
4. ✅ Test payment completes
5. ✅ "Payment successful" message appears
6. ✅ Order confirmation page loads
7. ✅ Order appears in admin panel

---

**🎉 Your payment gateway is now ready!**

For additional help, check the browser console and backend terminal logs for detailed error messages.
