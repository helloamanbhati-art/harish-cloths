const mongoose = require('mongoose');

const uri = 'mongodb+srv://amanbhati:YYekcSB0Iw6iPttF@cluster0.2i4eg4h.mongodb.net/?appName=Cluster0';

async function run() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    // Inspect orders collection
    const ordersColl = mongoose.connection.db.collection('orders');
    const orders = await ordersColl.find({}).sort({ createdAt: -1 }).limit(5).toArray();
    console.log(`\nFound ${orders.length} orders in DB:`);
    for (let o of orders) {
      console.log(`Order: ${o.orderNumber} (_id: ${o._id})`);
      console.log(`  Customer: ${o.customerName} (${o.customerEmail})`);
      console.log(`  Total: ${o.total}`);
      console.log(`  Items (${o.items?.length || 0}):`);
      for (let item of o.items || []) {
        console.log(`    - Product: ${item.productName}`);
        console.log(`      Color: "${item.color}"`);
        console.log(`      Size: "${item.size}"`);
        console.log(`      Quantity: ${item.quantity}`);
        console.log(`      Image in DB: ${item.productImage}`);
      }
      console.log('-----------------------------');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected');
  }
}

run();
