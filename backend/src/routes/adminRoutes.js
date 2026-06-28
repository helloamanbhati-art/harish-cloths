
const express = require("express");
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const AdminUser = require("../models/AdminUser");
const Category = require("../models/Category");
const Brand = require("../models/Brand");
const Product = require("../models/Product");
const ProductOptions = require("../models/ProductOptions");
const Inventory = require("../models/Inventory");
const adminController = require("../controllers/adminController");
const { authenticateAdmin, requireRole } = require("../middleware/auth");
const { apiLimiter } = require("../middleware/rateLimiter");

// Configure Cloudinary & Multer
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

async function uploadBufferToCloudinary(fileBuffer) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "harish-cloths/products" }, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      })
      .end(fileBuffer);
  });
}

// PUBLIC ROUTE - Login (no auth required)
router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }
    const admin = await AdminUser.findOne({ email: email.toLowerCase().trim() }).select("+password");
    if (!admin || !admin.isActive) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }
    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }
    const token = jwt.sign(
      { sub: admin._id.toString(), role: "admin" },
      process.env.JWT_ACCESS_SECRET || "dev-access-secret-change-me",
      { expiresIn: "7d" }
    );
    res.json({
      success: true,
      token,
      admin: { id: admin._id, firstName: admin.firstName, email: admin.email, role: admin.role },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error during login" });
  }
});

// PROTECTED ROUTES - Apply authentication middleware here
router.use(authenticateAdmin);
router.use(apiLimiter);


// Image Upload
router.post('/products/upload-image', upload.single('image'), async (req, res) => {
  try {
    console.log('[UPLOAD] Request received');
    if (!req.file) {
      console.log('[UPLOAD] No file in request');
      return res.status(400).json({ success: false, message: 'No image uploaded' });
    }
    console.log('[UPLOAD] File received:', req.file.originalname, 'Size:', req.file.size);

    const result = await uploadBufferToCloudinary(req.file.buffer);

    res.json({ success: true, url: result.secure_url });
  } catch (error) {
    console.error('[UPLOAD] Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/products/upload-images", upload.array("images", 20), async (req, res) => {
  try {
    const files = req.files || [];
    if (!Array.isArray(files) || files.length === 0) {
      return res.status(400).json({ success: false, message: "No images uploaded" });
    }

    const uploaded = [];
    for (const file of files) {
      const result = await uploadBufferToCloudinary(file.buffer);
      uploaded.push(result.secure_url);
    }

    res.json({ success: true, urls: uploaded });
  } catch (error) {
    console.error("[UPLOAD-MULTI] Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Dashboard
router.get("/dashboard", adminController.getDashboardStats);

// Analytics
router.get("/analytics", adminController.getAnalytics);

// Product management
// NEW — resolve brand and category names to ObjectIds before saving
router.post('/products', async (req, res) => {
  try {
    const data = req.body;
    console.log('[POST /products] Request body:', data);
    console.log('[POST /products] Admin:', req.admin?._id);

    // Validate required fields
    if (!data.name || !data.description || !data.price || !data.soldBy) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, description, price, soldBy are required'
      });
    }

    // Find brand by name or ID
    let brandId = data.brand;
    if (data.brand && !data.brand.match(/^[0-9a-fA-F]{24}$/)) {
      console.log('[POST /products] Looking up brand by name:', data.brand);
      let brand = await Brand.findOne({ name: data.brand });
      if (!brand) {
        console.log('[POST /products] Creating new brand:', data.brand);
        brand = await Brand.create({ name: data.brand });
      }
      brandId = brand._id;
      console.log('[POST /products] Brand ID:', brandId);
    }

    // Find category by name or ID
    let categoryId = data.category;
    if (data.category && !data.category.match(/^[0-9a-fA-F]{24}$/)) {
      console.log('[POST /products] Looking up category by name:', data.category);
      let category = await Category.findOne({ name: data.category });
      if (!category) {
        console.log('[POST /products] Creating new category:', data.category);
        category = await Category.create({ name: data.category });
      }
      categoryId = category._id;
      console.log('[POST /products] Category ID:', categoryId);
    }

    const Product = require('../models/Product');
    const Inventory = require('../models/Inventory');

    const variants = Array.isArray(data.variants)
      ? data.variants.map((v, index) => {
          const variantImages = Array.isArray(v.images)
            ? v.images.map((img, imgIdx) => {
                if (typeof img === 'string') {
                  return {
                    imageUrl: img,
                    isPrimary: imgIdx === 0,
                    sortOrder: imgIdx,
                  };
                }
                return {
                  imageUrl: img.imageUrl || '',
                  isPrimary: img.isPrimary ?? (imgIdx === 0),
                  sortOrder: img.sortOrder ?? imgIdx,
                };
              })
            : [];
          return {
            variantId: v.variantId || v.clientId || `v-${index + 1}-${Date.now()}`,
            variantName: String(v.variantName || v.name || 'Default').trim(),
            images: variantImages,
          };
        })
      : [];

    // Derive legacy image / images from variants
    const variantWithImages = variants.find(v => v.images && v.images.length > 0);
    const firstVariantImages = variantWithImages ? variantWithImages.images.map(img => img.imageUrl) : [];
    const legacyImages = firstVariantImages.length > 0 ? firstVariantImages
      : Array.isArray(data.images) ? data.images : [];
    const legacyImage = data.image || legacyImages[0] || '';

    const productData = {
      name: data.name,
      description: data.description,
      price: data.price,
      soldBy: data.soldBy,
      clothingType: data.clothingType || null,
      availableSizes: Array.isArray(data.availableSizes) ? data.availableSizes : [],
      brand: brandId,
      category: categoryId,
      image: legacyImage,
      images: legacyImages,
      colors: data.colors || [],
      variants,
      inStock: data.inStock ?? true,
      isActive: data.isActive ?? true,
      createdBy: req.admin?._id,
      sku: data.sku || `SKU-${Date.now()}`,
    };

    console.log('[POST /products] Creating product with data:', productData);

    const product = new Product(productData);

    await product.save();
    console.log('[POST /products] Product saved successfully:', product._id);

    await Inventory.create({
      product: product._id,
      available: data.stock?.available || 100,
      lowStockThreshold: 10,
    });
    console.log('[POST /products] Inventory created for product');

    // Populate brand and category for response
    const populatedProduct = await product.populate('brand category');

    res.status(201).json({ success: true, message: 'Product created', data: populatedProduct });
  } catch (error) {
    console.error('[POST /products] Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// NEW
router.put('/products/:productId', async (req, res) => {
  try {
    const data = req.body;
    const Product = require('../models/Product');

    let brandId = data.brand;
    if (data.brand && !data.brand.match(/^[0-9a-fA-F]{24}$/)) {
      let brand = await Brand.findOne({ name: data.brand });
      if (!brand) brand = await Brand.create({ name: data.brand });
      brandId = brand._id;
    }

    let categoryId = data.category;
    if (data.category && !data.category.match(/^[0-9a-fA-F]{24}$/)) {
      let category = await Category.findOne({ name: data.category });
      if (!category) category = await Category.create({ name: data.category });
      categoryId = category._id;
    }

    const variants = Array.isArray(data.variants)
      ? data.variants.map((v, index) => {
          const variantImages = Array.isArray(v.images)
            ? v.images.map((img, imgIdx) => {
                if (typeof img === 'string') {
                  return {
                    imageUrl: img,
                    isPrimary: imgIdx === 0,
                    sortOrder: imgIdx,
                  };
                }
                return {
                  imageUrl: img.imageUrl || '',
                  isPrimary: img.isPrimary ?? (imgIdx === 0),
                  sortOrder: img.sortOrder ?? imgIdx,
                };
              })
            : [];
          return {
            variantId: v.variantId || v.clientId || `v-${index + 1}-${Date.now()}`,
            variantName: String(v.variantName || v.name || 'Default').trim(),
            images: variantImages,
          };
        })
      : undefined; // undefined = don't overwrite if not sent

    // Derive legacy image / images from variants
    const variantWithImages = variants && variants.find(v => v.images && v.images.length > 0);
    const firstVariantImages = variantWithImages ? variantWithImages.images.map(img => img.imageUrl) : null;
    const legacyImages = firstVariantImages ? firstVariantImages
      : Array.isArray(data.images) ? data.images : undefined;
    const legacyImage = data.image || (legacyImages && legacyImages[0]) || undefined;

    const updatePayload = {
      ...data,
      brand: brandId,
      category: categoryId,
      updatedBy: req.admin._id,
      ...(variants !== undefined && { variants }),
      ...(legacyImages !== undefined && { images: legacyImages }),
      ...(legacyImage !== undefined && { image: legacyImage }),
    };

    const product = await Product.findByIdAndUpdate(
      req.params.productId,
      updatePayload,
      { new: true, runValidators: true }
    ).populate('brand category');

    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, message: 'Product updated', data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
router.delete("/products/:productId", adminController.deleteProduct);
router.post("/products/bulk-update", adminController.bulkUpdateProducts);

// Product options (sizes, clothing types)
router.get("/product-options", async (req, res) => {
  try {
    let options = await ProductOptions.findOne({ key: "default" });
    if (!options) {
      options = await ProductOptions.create({ key: "default" });
    }
    res.json({
      success: true,
      data: {
        sizes: options.sizes || [],
        clothingTypes: options.clothingTypes || [],
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put("/product-options", async (req, res) => {
  try {
    const sizes = Array.isArray(req.body?.sizes)
      ? req.body.sizes.map((s) => String(s).trim()).filter(Boolean)
      : [];
    const clothingTypes = Array.isArray(req.body?.clothingTypes)
      ? req.body.clothingTypes.map((t) => String(t).trim()).filter(Boolean)
      : [];

    const uniqueSizes = [...new Set(sizes)];
    const uniqueClothingTypes = [...new Set(clothingTypes)];

    const options = await ProductOptions.findOneAndUpdate(
      { key: "default" },
      { sizes: uniqueSizes, clothingTypes: uniqueClothingTypes },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json({
      success: true,
      data: {
        sizes: options.sizes || [],
        clothingTypes: options.clothingTypes || [],
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Order management
router.get("/orders", adminController.getAllOrders);
router.put("/orders/:orderId/status", adminController.updateOrderStatus);

// Customer management
router.get("/customers", adminController.getAllCustomers);
router.get("/customers/:customerId", adminController.getCustomerDetails);

// Return management
router.get("/returns", adminController.getReturns);
router.post("/returns/:returnId/approve", adminController.approveReturn);

// Review management
router.get("/reviews", adminController.getAllReviews);
router.post("/reviews/:reviewId/approve", adminController.approveReview);
router.post("/reviews/:reviewId/reject", adminController.rejectReview);



// PASTE THIS BLOCK before module.exports = router;

// Categories
router.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json({ success: true, categories });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});
router.post("/categories", async (req, res) => {
  try {
    console.log("[POST /categories] Request body:", req.body);
    if (!req.body.name || req.body.name.trim() === "") {
      return res.status(400).json({ success: false, message: "Category name is required" });
    }
    const category = await Category.create({ name: req.body.name.trim() });
    console.log("[POST /categories] Created:", category);
    res.status(201).json({ success: true, category });
  } catch (e) {
    console.error("[POST /categories] Error:", e.message);
    res.status(500).json({ success: false, message: e.message });
  }
});
router.put("/categories/:id", async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, category });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});
router.delete("/categories/:id", async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted" });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Brands
router.get("/brands", async (req, res) => {
  try {
    const brands = await Brand.find().sort({ name: 1 });
    res.json({ success: true, brands });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});
router.post("/brands", async (req, res) => {
  try {
    console.log("[POST /brands] Request body:", req.body);
    if (!req.body.name || req.body.name.trim() === "") {
      return res.status(400).json({ success: false, message: "Brand name is required" });
    }
    const brand = await Brand.create({ name: req.body.name.trim() });
    console.log("[POST /brands] Created:", brand);
    res.status(201).json({ success: true, brand });
  } catch (e) {
    console.error("[POST /brands] Error:", e.message);
    res.status(500).json({ success: false, message: e.message });
  }
});
router.put("/brands/:id", async (req, res) => {
  try {
    const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, brand });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});
router.delete("/brands/:id", async (req, res) => {
  try {
    await Brand.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted" });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});


module.exports = router;
