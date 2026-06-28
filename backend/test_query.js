const mongoose = require('mongoose');
const Product = require('./src/models/Product');

const uri = 'mongodb+srv://amanbhati:YYekcSB0Iw6iPttF@cluster0.2i4eg4h.mongodb.net/?appName=Cluster0';

async function run() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    const Order = require('./src/models/Order');
    const order = await Order.findOne({ orderNumber: 'ORD-1782634075651-fznz3a0xi' }).populate('items.product');
    console.log('Order found:', order.orderNumber);
    for (let item of order.items) {
      console.log('Item product name:', item.productName);
      console.log('Item color:', item.color);
      console.log('Item productImage in order:', item.productImage);
      console.log('Item product image in DB:', item.product?.image);
      console.log('Item product variants:', item.product?.variants);
    }

    // Done checking

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected');
  }
}

run();
