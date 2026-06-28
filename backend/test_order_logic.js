const mongoose = require('mongoose');
const Product = require('./src/models/Product');
const Order = require('./src/models/Order');

const uri = 'mongodb+srv://amanbhati:YYekcSB0Iw6iPttF@cluster0.2i4eg4h.mongodb.net/?appName=Cluster0';

async function run() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    // Mock request items
    const items = [
      {
        productId: '6a4085efc56b20b30f5213f9', // bsy fabric ultimate fabric
        quantity: 1,
        meters: 4,
        selectedSize: null,
        selectedColor: 'rad'
      }
    ];

    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        console.log(`Product ${item.productId} not found`);
        return;
      }

      const metersPerPiece =
        product.soldBy === "meter"
          ? Math.max(Number(item.meters) || 1, 1)
          : 1;
      const additionalCharge = (product.additionalChargeAmount || 0) * item.quantity;
      const itemTotal = product.price * item.quantity * metersPerPiece + additionalCharge;
      subtotal += itemTotal;

      // Find the variant matching the selected color/design and set its primary image if available
      let productImage = product.image;
      if (item.selectedColor && product.variants && product.variants.length > 0) {
        const selectedVariant = product.variants.find(
          v => v.variantName && v.variantName.toLowerCase() === item.selectedColor.toLowerCase()
        );
        if (selectedVariant && selectedVariant.images && selectedVariant.images.length > 0) {
          const primaryImg = selectedVariant.images.find(img => img.isPrimary) || selectedVariant.images[0];
          if (primaryImg && primaryImg.imageUrl) {
            productImage = primaryImg.imageUrl;
          }
        }
      }

      orderItems.push({
        product: product._id,
        productName: product.name,
        productImage: productImage,
        brand: product.brand,
        size: item.selectedSize || null,
        color: item.selectedColor || null,
        price: product.price,
        quantity: item.quantity,
        meters: metersPerPiece,
        soldBy: product.soldBy,
        subtotal: itemTotal,
        additionalChargeName: product.additionalChargeName || '',
        additionalChargeAmount: product.additionalChargeAmount || 0,
        discount: 0,
        tax: 0,
        total: itemTotal,
      });
    }

    console.log('Resulting order items:', JSON.stringify(orderItems, null, 2));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected');
  }
}

run();
