# Razorpay Payment Integration Guide

This document explains how to integrate the Razorpay payment gateway with your backend API.

## Frontend Implementation (Already Done)

The frontend is ready to integrate with your backend. The payment flow is implemented in:
- `/src/app/pages/Payment.tsx` - Main payment page with Razorpay integration

## Backend Integration Steps

### 1. Install Razorpay SDK (Backend)

```bash
# For Node.js/Express backend
npm install razorpay

# For Python backend
pip install razorpay
```

### 2. Get Razorpay API Keys

1. Sign up at [https://razorpay.com](https://razorpay.com)
2. Navigate to Settings → API Keys
3. Generate API keys (Key ID and Key Secret)
4. Add them to your environment variables:

```env
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_secret_key_here
```

### 3. Update Frontend Environment Variable

Update the Razorpay key in `/src/app/pages/Payment.tsx`:

```typescript
key: process.env.RAZORPAY_KEY_ID || 'rzp_test_REPLACE_WITH_YOUR_KEY',
```

Or create a `.env` file:

```env
VITE_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
```

And update Payment.tsx to use:

```typescript
key: import.meta.env.VITE_RAZORPAY_KEY_ID,
```

## Required Backend API Endpoints

### 1. Create Order Endpoint

**Endpoint:** `POST /api/payment/create-order`

**Request Body:**
```json
{
  "amount": 5000,
  "currency": "INR"
}
```

**Backend Implementation (Node.js):**

```javascript
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

app.post('/api/payment/create-order', async (req, res) => {
  try {
    const { amount, currency } = req.body;
    
    const options = {
      amount: amount * 100, // amount in paise
      currency: currency,
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1
    };

    const order = await razorpay.orders.create(options);
    
    res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**Backend Implementation (Python/Flask):**

```python
import razorpay
from flask import Flask, request, jsonify

client = razorpay.Client(auth=(os.environ['RAZORPAY_KEY_ID'], os.environ['RAZORPAY_KEY_SECRET']))

@app.route('/api/payment/create-order', methods=['POST'])
def create_order():
    try:
        data = request.get_json()
        amount = data['amount']
        currency = data['currency']
        
        order_data = {
            'amount': amount * 100,  # amount in paise
            'currency': currency,
            'receipt': f'receipt_{int(time.time())}',
            'payment_capture': 1
        }
        
        order = client.order.create(data=order_data)
        
        return jsonify({
            'id': order['id'],
            'amount': order['amount'],
            'currency': order['currency']
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500
```

### 2. Verify Payment Endpoint

**Endpoint:** `POST /api/payment/verify`

**Request Body:**
```json
{
  "razorpay_payment_id": "pay_xxxxxxxxxxxxx",
  "razorpay_order_id": "order_xxxxxxxxxxxxx",
  "razorpay_signature": "signature_string",
  "items": [...],
  "totalAmount": 5000
}
```

**Backend Implementation (Node.js):**

```javascript
const crypto = require('crypto');

app.post('/api/payment/verify', async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      items,
      totalAmount
    } = req.body;

    // Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Payment is verified
      // Save order to database
      const order = await saveOrderToDatabase({
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        items: items,
        amount: totalAmount,
        status: 'paid'
      });

      res.json({
        success: true,
        message: 'Payment verified successfully',
        orderId: order.id
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid signature'
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**Backend Implementation (Python/Flask):**

```python
import hmac
import hashlib

@app.route('/api/payment/verify', methods=['POST'])
def verify_payment():
    try:
        data = request.get_json()
        payment_id = data['razorpay_payment_id']
        order_id = data['razorpay_order_id']
        signature = data['razorpay_signature']
        items = data['items']
        total_amount = data['totalAmount']
        
        # Verify signature
        sign = f"{order_id}|{payment_id}"
        expected_sign = hmac.new(
            os.environ['RAZORPAY_KEY_SECRET'].encode(),
            sign.encode(),
            hashlib.sha256
        ).hexdigest()
        
        if signature == expected_sign:
            # Payment is verified
            # Save order to database
            order = save_order_to_database({
                'payment_id': payment_id,
                'order_id': order_id,
                'items': items,
                'amount': total_amount,
                'status': 'paid'
            })
            
            return jsonify({
                'success': True,
                'message': 'Payment verified successfully',
                'orderId': order['id']
            })
        else:
            return jsonify({
                'success': False,
                'message': 'Invalid signature'
            }), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500
```

### 3. Payment Failed Endpoint (Optional)

**Endpoint:** `POST /api/payment/failed`

**Request Body:**
```json
{
  "error": {
    "code": "error_code",
    "description": "error_description"
  }
}
```

**Backend Implementation:**

```javascript
app.post('/api/payment/failed', async (req, res) => {
  try {
    const { error } = req.body;
    
    // Log the failed payment
    await logFailedPayment(error);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## Frontend Integration

Update `/src/app/pages/Payment.tsx` to use your backend endpoints:

```typescript
const handlePayment = async () => {
  setIsProcessing(true);

  try {
    // Call your backend to create order
    const orderResponse = await fetch('YOUR_BACKEND_URL/api/payment/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        amount: finalAmount, 
        currency: 'INR' 
      })
    });
    
    const orderData = await orderResponse.json();

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'Harish Cloths',
      description: 'Purchase of fabric products',
      order_id: orderData.id,
      handler: function (response: RazorpayResponse) {
        handlePaymentSuccess(response);
      },
      // ... rest of the options
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  } catch (error) {
    setIsProcessing(false);
    toast.error('Failed to initiate payment');
  }
};

const handlePaymentSuccess = async (response: RazorpayResponse) => {
  try {
    // Verify payment with backend
    const verifyResponse = await fetch('YOUR_BACKEND_URL/api/payment/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_signature: response.razorpay_signature,
        items: items,
        totalAmount: finalAmount
      })
    });
    
    const verifyData = await verifyResponse.json();

    if (verifyData.success) {
      toast.success('Payment successful!');
      navigate('/order-success', {
        state: {
          items: items,
          totalPrice: finalAmount,
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
        },
      });
      setTimeout(() => clearCart(), 100);
    } else {
      toast.error('Payment verification failed');
    }
  } catch (error) {
    toast.error('Payment verification failed. Please contact support.');
  }
};
```

## Testing

### Test Mode
1. Use test API keys (start with `rzp_test_`)
2. Use test card numbers:
   - Success: `4111 1111 1111 1111`
   - Failure: `4111 1111 1111 1234`
   - CVV: Any 3 digits
   - Expiry: Any future date

### Production Mode
1. Complete KYC verification on Razorpay dashboard
2. Switch to live API keys (start with `rzp_live_`)
3. Configure webhooks for order updates

## Security Best Practices

1. **Never expose Key Secret on frontend** - Only use Key ID
2. **Always verify payment signature on backend** - Don't trust frontend
3. **Use HTTPS** for all API communications
4. **Store API keys in environment variables** - Never commit to code
5. **Implement rate limiting** on payment endpoints
6. **Log all payment transactions** for auditing

## Webhook Configuration (Optional but Recommended)

Set up webhooks to receive payment updates:

**Webhook URL:** `https://your-backend.com/api/payment/webhook`

**Events to subscribe:**
- `payment.captured`
- `payment.failed`
- `order.paid`

**Implementation:**

```javascript
app.post('/api/payment/webhook', async (req, res) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers['x-razorpay-signature'];
  
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(JSON.stringify(req.body))
    .digest('hex');
  
  if (signature === expectedSignature) {
    // Process webhook event
    const event = req.body.event;
    const payload = req.body.payload;
    
    // Handle different events
    switch(event) {
      case 'payment.captured':
        await updateOrderStatus(payload.payment.entity.id, 'captured');
        break;
      case 'payment.failed':
        await updateOrderStatus(payload.payment.entity.id, 'failed');
        break;
    }
    
    res.json({ success: true });
  } else {
    res.status(400).json({ error: 'Invalid signature' });
  }
});
```

## Support

- **Razorpay Documentation:** https://razorpay.com/docs/
- **API Reference:** https://razorpay.com/docs/api/
- **Support:** https://razorpay.com/support/
