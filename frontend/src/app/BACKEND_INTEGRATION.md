# Backend Integration Guide

## 🎯 Overview
This application is fully structured for backend integration. All order data is currently stored in localStorage but can be easily replaced with API calls to your backend/dashboard.

## 📦 Order Data Structure

### Complete Order Object
```typescript
{
  // Unique Identifiers
  id: string,                    // Unique order ID
  orderNumber: string,           // Customer-facing order number (HC...)
  trackingId: string,            // Courier tracking ID (TRK...)
  invoiceNumber: string,         // Invoice number for accounting
  
  // Items
  items: OrderItem[],            // Array of ordered products
  
  // Pricing (All in ₹ INR)
  subtotal: number,              // Items total before tax
  gstAmount: number,             // 18% GST amount
  shippingCharges: number,       // Shipping cost (currently 0)
  discount: number,              // Discount applied
  totalPrice: number,            // Subtotal before GST
  totalWithGST: number,          // Final payable amount
  
  // Timestamps
  orderDate: string,             // ISO timestamp when order placed
  estimatedDelivery: string,     // ISO timestamp for expected delivery
  actualDeliveryDate?: string,   // ISO timestamp when delivered
  
  // Order Status
  currentStatus: number,         // 0-4 (Placed, Processing, Shipped, Out for Delivery, Delivered)
  statusHistory: OrderStatusHistory[], // Full status update timeline
  
  // Courier Information
  courierPartner: {
    name: string,
    phone: string,
    email: string,
    gradient: string,            // UI color gradient
    website: string,
    description: string,
    trackingUrl?: string,        // Full tracking URL
  },
  
  // Customer Details
  customer: {
    id?: string,                 // Customer ID from your auth system
    name: string,
    email?: string,
    phone: string,
  },
  
  // Addresses
  shippingAddress: {
    name: string,
    phone: string,
    email?: string,
    addressLine1: string,
    addressLine2: string,
    city: string,
    state: string,
    pincode: string,
    landmark?: string,
    addressType?: 'Home' | 'Office' | 'Other',
  },
  billingAddress?: {...},        // Same structure as shippingAddress
  
  // Payment Information
  paymentDetails: {
    method: 'UPI' | 'Card' | 'NetBanking' | 'COD' | 'Wallet',
    transactionId: string,
    paymentStatus: 'Pending' | 'Completed' | 'Failed' | 'Refunded',
    paidAmount: number,
    paymentDate: string,
    upiId?: string,              // For UPI payments
    cardLast4?: string,          // For card payments
    bankName?: string,           // For NetBanking
  },
  
  // Admin Dashboard Fields
  orderNotes?: string,           // Internal admin notes
  customerNotes?: string,        // Special delivery instructions
  returnRequested?: boolean,
  returnReason?: string,
  refundStatus?: 'None' | 'Requested' | 'Processing' | 'Completed',
  cancellationRequested?: boolean,
  cancellationReason?: string,
  
  // Analytics Metadata
  orderSource: 'Website' | 'Mobile App' | 'Phone' | 'Admin',
  ipAddress?: string,
  deviceType?: 'Desktop' | 'Mobile' | 'Tablet',
}
```

### Order Item Structure
```typescript
{
  product: Product,              // Full product object
  quantity: number,              // Number of pieces
  selectedMeters?: number,       // For fabric sold by meter
}
```

### Status History Entry
```typescript
{
  status: number,                // 0-4
  statusName: string,            // Human-readable status
  timestamp: string,             // ISO timestamp
  location?: string,             // Geographic location of update
  updatedBy?: string,            // Admin user who updated (or 'System')
  notes?: string,                // Optional notes about the update
}
```

## 🔌 Backend Integration Points

### 1. Replace OrderContext with API Calls

**Current (localStorage):**
```typescript
const [orders, setOrders] = useState<Order[]>(() => {
  const saved = localStorage.getItem('harish-cloths-orders');
  return saved ? JSON.parse(saved) : [];
});
```

**With Backend:**
```typescript
const [orders, setOrders] = useState<Order[]>([]);

useEffect(() => {
  // Fetch orders from backend
  fetch('/api/orders', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(data => setOrders(data));
}, []);
```

### 2. Create Order API

**Current (OrderSuccess.tsx):**
```typescript
addOrder(newOrder);
```

**With Backend:**
```typescript
fetch('/api/orders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(newOrder)
})
  .then(res => res.json())
  .then(order => {
    // Navigate to order detail page
    navigate(`/order/${order.id}`);
  });
```

### 3. Update Order Status API

**Current:**
```typescript
updateOrderStatus(orderId, status, notes);
```

**With Backend:**
```typescript
fetch(`/api/orders/${orderId}/status`, {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${adminToken}` // Admin only
  },
  body: JSON.stringify({ status, notes, updatedBy: adminId })
})
  .then(res => res.json())
  .then(updatedOrder => {
    setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));
  });
```

### 4. Webhook for Real-Time Updates

Connect your courier partner webhooks to update order status:

```javascript
// Backend webhook endpoint
app.post('/webhooks/courier/:courierName', (req, res) => {
  const { trackingId, status, location } = req.body;
  
  // Find order by tracking ID
  const order = await Order.findOne({ trackingId });
  
  // Update status
  order.statusHistory.push({
    status: mapCourierStatus(status),
    statusName: status,
    timestamp: new Date().toISOString(),
    location,
    updatedBy: 'Courier System',
    notes: `Update from ${req.params.courierName}`
  });
  
  order.currentStatus = mapCourierStatus(status);
  await order.save();
  
  // Send push notification to customer
  sendPushNotification(order.customer.id, {
    title: 'Order Update',
    body: `Your order is now ${status}`
  });
  
  res.json({ success: true });
});
```

## 🎨 Admin Dashboard Features Ready

### Features You Can Build:

1. **Order Management**
   - View all orders with filters (status, date range, customer)
   - Search by order number, tracking ID, customer phone
   - Update order status manually
   - Assign courier partners
   - Add internal notes

2. **Customer Management**
   - View customer order history
   - Customer contact details
   - Device/source analytics

3. **Financial Reports**
   - Revenue by date range
   - GST collection reports
   - Payment method breakdown
   - Pending payments (COD)

4. **Inventory Tracking**
   - Track which products are in orders
   - Alert when stock is low
   - Meter-wise fabric tracking

5. **Courier Management**
   - Performance metrics per courier
   - Average delivery times
   - Failed delivery tracking

6. **Returns & Refunds**
   - View return requests
   - Process refunds
   - Track return reasons for insights

## 🗄️ Recommended Database Schema

### MongoDB Example:
```javascript
const OrderSchema = new Schema({
  id: { type: String, required: true, unique: true },
  orderNumber: { type: String, required: true, unique: true, index: true },
  trackingId: { type: String, required: true, unique: true, index: true },
  invoiceNumber: { type: String, required: true },
  
  items: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number,
    selectedMeters: Number,
    priceAtPurchase: Number // Store price at time of purchase
  }],
  
  subtotal: Number,
  gstAmount: Number,
  shippingCharges: Number,
  discount: Number,
  totalPrice: Number,
  totalWithGST: Number,
  
  orderDate: { type: Date, default: Date.now, index: true },
  estimatedDelivery: Date,
  actualDeliveryDate: Date,
  
  currentStatus: { type: Number, min: 0, max: 4, index: true },
  statusHistory: [{
    status: Number,
    statusName: String,
    timestamp: { type: Date, default: Date.now },
    location: String,
    updatedBy: String,
    notes: String
  }],
  
  courierPartner: {
    name: String,
    phone: String,
    email: String,
    trackingUrl: String
  },
  
  customer: {
    id: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    name: String,
    email: String,
    phone: { type: String, index: true }
  },
  
  shippingAddress: {
    name: String,
    phone: String,
    email: String,
    addressLine1: String,
    addressLine2: String,
    city: { type: String, index: true },
    state: { type: String, index: true },
    pincode: { type: String, index: true },
    landmark: String,
    addressType: String
  },
  
  billingAddress: {
    // Same as shippingAddress
  },
  
  paymentDetails: {
    method: { type: String, enum: ['UPI', 'Card', 'NetBanking', 'COD', 'Wallet'] },
    transactionId: { type: String, unique: true, sparse: true },
    paymentStatus: { type: String, enum: ['Pending', 'Completed', 'Failed', 'Refunded'] },
    paidAmount: Number,
    paymentDate: Date,
    upiId: String,
    cardLast4: String,
    bankName: String
  },
  
  orderNotes: String,
  customerNotes: String,
  returnRequested: { type: Boolean, default: false },
  returnReason: String,
  refundStatus: { type: String, enum: ['None', 'Requested', 'Processing', 'Completed'] },
  cancellationRequested: { type: Boolean, default: false },
  cancellationReason: String,
  
  orderSource: { type: String, enum: ['Website', 'Mobile App', 'Phone', 'Admin'] },
  ipAddress: String,
  deviceType: String,
}, {
  timestamps: true // Adds createdAt, updatedAt
});

// Indexes for better query performance
OrderSchema.index({ 'customer.phone': 1, orderDate: -1 });
OrderSchema.index({ currentStatus: 1, orderDate: -1 });
OrderSchema.index({ orderDate: -1 });
```

## 📱 API Endpoints Structure

```
GET    /api/orders                    - List all orders (admin)
GET    /api/orders/:id                - Get order details
POST   /api/orders                    - Create new order
PATCH  /api/orders/:id/status         - Update order status (admin)
PATCH  /api/orders/:id/courier        - Assign courier (admin)
POST   /api/orders/:id/cancel         - Request cancellation
POST   /api/orders/:id/return         - Request return
GET    /api/orders/:id/invoice        - Generate invoice PDF

GET    /api/customers/:phone/orders   - Get customer orders by phone
POST   /api/track                     - Track order (by order# + phone)

GET    /api/admin/orders/stats        - Dashboard statistics
GET    /api/admin/orders/export       - Export orders CSV

POST   /webhooks/courier/:name        - Courier status webhooks
POST   /webhooks/payment/:gateway     - Payment gateway webhooks
```

## 🔐 Security Considerations

1. **Authentication**: Replace localStorage with JWT tokens or session-based auth
2. **Order Ownership**: Verify user owns the order before showing details
3. **Admin Routes**: Protect status update endpoints with admin-only middleware
4. **PII Protection**: Hash/encrypt sensitive customer data
5. **Rate Limiting**: Add rate limits on order creation to prevent abuse
6. **Input Validation**: Validate all incoming data (use Joi/Zod)

## 🚀 Migration Checklist

- [ ] Set up backend (Node.js + Express / Django / Laravel)
- [ ] Create database tables/collections
- [ ] Implement authentication system
- [ ] Create API endpoints for orders
- [ ] Replace OrderContext localStorage with API calls
- [ ] Integrate payment gateway
- [ ] Set up courier partner webhooks
- [ ] Build admin dashboard
- [ ] Add email/SMS notifications
- [ ] Implement invoice generation
- [ ] Set up monitoring & analytics
- [ ] Add backup & disaster recovery

## 📧 Next Steps for Your Dashboard

### Phase 1: Basic Admin Panel
- Login system for admins
- View all orders table
- Filter & search functionality
- Update order status manually

### Phase 2: Advanced Features
- Automated status updates from couriers
- Email/SMS notifications
- Invoice generation (PDF)
- Revenue analytics

### Phase 3: Full E-commerce
- User authentication on website
- Saved addresses
- Order history for logged-in users
- Wishlist & favorites

---

**All the data structures are in place! When you're ready to build your backend, just replace the localStorage calls with API calls and you're good to go!** 🎉
