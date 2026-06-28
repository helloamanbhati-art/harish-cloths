const mongoose = require('mongoose');
const Product = require('./src/models/Product');

const uri = 'mongodb+srv://amanbhati:YYekcSB0Iw6iPttF@cluster0.2i4eg4h.mongodb.net/?appName=Cluster0';

async function run() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    const product = await Product.findOne({ name: /cotton suit/i });
    console.log('Product:', product.name);
    console.log('Product variants:', JSON.stringify(product.variants, null, 2));

    const selectedColor = 'pink';
    const selectedVariant = product.variants.find(
      v => v.variantName && v.variantName.toLowerCase() === selectedColor.toLowerCase()
    );
    console.log('Selected Variant:', selectedVariant);

    if (selectedVariant && selectedVariant.images && selectedVariant.images.length > 0) {
      const primaryImg = selectedVariant.images.find(img => img.isPrimary) || selectedVariant.images[0];
      console.log('Primary Image:', primaryImg);
    } else {
      console.log('No primary image found or variant not found');
    }

  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
