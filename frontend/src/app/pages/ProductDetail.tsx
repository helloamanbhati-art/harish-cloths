import { useParams, Link, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, ShoppingCart, Minus, Plus, Trash2, Loader, LayoutGrid, Check, Star } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { usePageTitle } from "../hooks/usePageTitle";
import { useState, useRef, useEffect } from "react";
import { AddToCartAnimation } from "../components/AddToCartAnimation";
import { useCartIcon } from "../contexts/CartIconContext";
import { toast } from "sonner";
import { ProductVariant, SelectedVariantSnapshot } from "../types/product";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface Product {
  _id: string;
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  images: string[];
  variants?: ProductVariant[];
  brand: string;
  category: string;
  soldBy: 'meter' | 'piece';
  isFlatPrice?: boolean;
  availableSizes?: string[];
  clothingType?: string;
  stock?: { available: number };
  inStock?: boolean;
  additionalChargeName?: string;
  additionalChargeAmount?: number;
}

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  usePageTitle('Product Details');
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // Design variant states
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  // Meters and Qty states
  const [selectedMeters, setSelectedMeters] = useState<number>(4);
  const [quantity, setQuantity] = useState<number>(1);

  const [animationPositions, setAnimationPositions] = useState({
    start: { x: 0, y: 0 },
    end: { x: 0, y: 0 }
  });
  const buttonRef = useRef<HTMLDivElement>(null);
  const { cartIconElement } = useCartIcon();

  // Fetch product from API
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        setSelectedSize(null);
        setActiveImageIndex(0);
        setSelectedMeters(4);
        setQuantity(1);

        const response = await fetch(`${API_BASE_URL}/api/v1/products/${id}`);

        if (!response.ok) {
          throw new Error('Product not found');
        }

        const result = await response.json();
        const productData = result.data || result.product;

        if (!productData) {
          throw new Error('Product data not found');
        }

        // Transform API response to match Product type
        const transformedProduct: Product = {
          _id: productData._id || productData.id,
          id: productData._id || productData.id,
          name: productData.name,
          description: productData.description,
          price: productData.price,
          image: productData.image || (productData.images && productData.images[0]) || '',
          images: productData.images || (productData.image ? [productData.image] : []),
          variants: (productData.variants || []).map((v: any) => ({
            variantId: v.variantId || v._id || '',
            variantName: v.variantName || v.name || 'Default',
            images: Array.isArray(v.images) && v.images.length > 0
              ? v.images.map((img: any) => ({
                  imageUrl: typeof img === 'string' ? img : img.imageUrl,
                  isPrimary: img.isPrimary ?? false,
                  sortOrder: img.sortOrder ?? 0,
                }))
              : (productData.images && productData.images.length > 0
                  ? productData.images.map((imgUrl: string, idx: number) => ({
                      imageUrl: imgUrl,
                      isPrimary: idx === 0,
                      sortOrder: idx,
                    }))
                  : (productData.image ? [{ imageUrl: productData.image, isPrimary: true, sortOrder: 0 }] : [])
                ),
          })),
          brand: typeof productData.brand === 'object'
            ? productData.brand?.name || 'Unknown'
            : productData.brand,
          category: typeof productData.category === 'object'
            ? productData.category?.name || 'Unknown'
            : productData.category,
          soldBy: productData.soldBy || 'piece',
          isFlatPrice: productData.isFlatPrice ?? false,
          availableSizes: Array.isArray(productData.availableSizes) ? productData.availableSizes : [],
          clothingType: productData.clothingType || '',
          inStock: productData.inStock !== false,
          additionalChargeName: productData.additionalChargeName || '',
          additionalChargeAmount: productData.additionalChargeAmount || 0,
        };

        // Synthesize default variant if needed
        if (!transformedProduct.variants || transformedProduct.variants.length === 0) {
           transformedProduct.variants = [{
             variantId: 'default',
             variantName: 'Default',
             images: transformedProduct.images.map((img, i) => ({
               imageUrl: img,
               isPrimary: i === 0,
               sortOrder: i,
             })),
           }];
        }

        setProduct(transformedProduct);
        if (transformedProduct.variants && transformedProduct.variants.length > 0) {
          setSelectedVariant(transformedProduct.variants[0]);
        }

      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load product';
        setError(message);
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;

    if (product.availableSizes && product.availableSizes.length > 0) {
      if (!selectedSize) {
        toast.error('Please select a size before adding to cart');
        return;
      }
    }

    if (buttonRef.current && cartIconElement) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const cartRect = cartIconElement.getBoundingClientRect();

      setAnimationPositions({
        start: {
          x: buttonRect.left + buttonRect.width / 2 - 30,
          y: buttonRect.top + buttonRect.height / 2 - 30,
        },
        end: {
          x: cartRect.left + cartRect.width / 2 - 30,
          y: cartRect.top + cartRect.height / 2 - 30,
        }
      });

      setShowAnimation(true);

      const cartVariantName = selectedVariant ? selectedVariant.variantName : undefined;

      // Copy product and override image with selected variant image
      let productToCart = { ...product };
      if (selectedVariant && selectedVariant.images && selectedVariant.images.length > 0) {
        const primaryImg = selectedVariant.images.find(img => img.isPrimary) || selectedVariant.images[0];
        if (primaryImg && primaryImg.imageUrl) {
          productToCart.image = primaryImg.imageUrl;
        }
      }

      // Construct a complete SelectedVariantSnapshot
      let variantSnapshot: SelectedVariantSnapshot;
      if (selectedVariant) {
        variantSnapshot = {
          variantId: selectedVariant.variantId,
          variantName: selectedVariant.variantName,
          color: selectedVariant.variantName || product.colors?.[0] || null,
          pattern: product.name,
          sku: product.sku || null,
          thumbnail: selectedVariant.images?.[0]?.imageUrl || product.image || null,
          primaryImage: (selectedVariant.images?.find(img => img.isPrimary) || selectedVariant.images?.[0])?.imageUrl || product.image || null,
          galleryImages: selectedVariant.images?.map(img => img.imageUrl) || [],
          priceAtPurchase: product.price
        };
      } else {
        variantSnapshot = {
          variantId: 'default',
          variantName: cartVariantName || 'Default',
          color: cartVariantName || 'Default',
          pattern: product.name,
          sku: product.sku || null,
          thumbnail: product.image || null,
          primaryImage: product.image || null,
          galleryImages: product.images || [],
          priceAtPurchase: product.price
        };
      }

      addToCart(
        productToCart,
        product.soldBy === 'meter' ? selectedMeters : undefined,
        selectedSize || undefined,
        cartVariantName,
        variantSnapshot,
        quantity
      );

      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const handleBuyNow = () => {
    if (!product) return;

    if (product.availableSizes && product.availableSizes.length > 0) {
      if (!selectedSize) {
        toast.error('Please select a size before checking out');
        return;
      }
    }

    const cartVariantName = selectedVariant ? selectedVariant.variantName : undefined;

    // Copy product and override image with selected variant image
    let productToCart = { ...product };
    if (selectedVariant && selectedVariant.images && selectedVariant.images.length > 0) {
      const primaryImg = selectedVariant.images.find(img => img.isPrimary) || selectedVariant.images[0];
      if (primaryImg && primaryImg.imageUrl) {
        productToCart.image = primaryImg.imageUrl;
      }
    }

    // Construct a complete SelectedVariantSnapshot
    let variantSnapshot: SelectedVariantSnapshot;
    if (selectedVariant) {
      variantSnapshot = {
        variantId: selectedVariant.variantId,
        variantName: selectedVariant.variantName,
        color: selectedVariant.variantName || product.colors?.[0] || null,
        pattern: product.name,
        sku: product.sku || null,
        thumbnail: selectedVariant.images?.[0]?.imageUrl || product.image || null,
        primaryImage: (selectedVariant.images?.find(img => img.isPrimary) || selectedVariant.images?.[0])?.imageUrl || product.image || null,
        galleryImages: selectedVariant.images?.map(img => img.imageUrl) || [],
        priceAtPurchase: product.price
      };
    } else {
      variantSnapshot = {
        variantId: 'default',
        variantName: cartVariantName || 'Default',
        color: cartVariantName || 'Default',
        pattern: product.name,
        sku: product.sku || null,
        thumbnail: product.image || null,
        primaryImage: product.image || null,
        galleryImages: product.images || [],
        priceAtPurchase: product.price
      };
    }

    addToCart(
      productToCart,
      product.soldBy === 'meter' ? selectedMeters : undefined,
      selectedSize || undefined,
      cartVariantName,
      variantSnapshot,
      quantity
    );

    navigate('/cart');
  };

  const handleAnimationComplete = () => {
    setShowAnimation(false);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <Loader className="size-8 animate-spin mx-auto text-primary" />
          <h2 className="text-2xl font-semibold">Loading product...</h2>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
          <p className="text-muted-foreground mb-4">{error || 'The product you are looking for does not exist.'}</p>
          <Link to="/">
            <Button>
              <ArrowLeft className="size-4 mr-2" />
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const galleryImages = (selectedVariant && selectedVariant.images && selectedVariant.images.length > 0 
    ? selectedVariant.images 
    : (product.variants && product.variants.find(v => v.images && v.images.length > 0)?.images) || product.images) || [];
  
  const carouselImages = galleryImages.map((img: any) => typeof img === 'string' ? img : img.imageUrl);
  const primaryImageForAnimation = carouselImages && carouselImages.length > 0 ? carouselImages[0] : product.image;
  const variants = product.variants || [];

  return (
    <div className="flex-1 px-6 py-4 md:px-10 md:py-8 max-w-7xl mx-auto w-full">
      {/* Back Button */}
      <Link to="/">
        <Button variant="ghost" className="mb-4 md:mb-6">
          <ArrowLeft className="size-4 mr-2" />
          Back to Products
        </Button>
      </Link>

      <div className="grid md:grid-cols-2 gap-6 md:gap-10">
        
        {/* Left Column: Main Image & Gallery Thumbnails */}
        <div className="space-y-4">
          {/* Main Image container */}
          <div className="aspect-square overflow-hidden rounded-lg bg-muted border border-border shadow-sm">
            <img
              src={carouselImages[activeImageIndex] || product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-300 animate-fade-in"
            />
          </div>

          {/* Thumbnails list inline */}
          {carouselImages.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto py-1 scrollbar-thin">
              {carouselImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`w-24 h-24 md:w-28 md:h-28 rounded-md overflow-hidden border-2 transition-all flex-shrink-0 ${
                    index === activeImageIndex
                      ? 'border-primary ring-2 ring-primary/20 scale-105 shadow-sm'
                      : 'border-border/60 hover:border-primary/60'
                  }`}
                  aria-label={`View image ${index + 1}`}
                >
                  <img
                    src={image}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover select-none"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Title, Code, Ratings, Price, Dropdowns, and Actions */}
        <div className="space-y-4">
          <div className="pb-2">
            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
              {product.name}
            </h1>
          </div>

          <div className="border-t border-border pt-4 space-y-3">
            {/* Availability Row */}
            <div className="space-y-1.5 text-sm text-muted-foreground font-medium">
              <div>
                Availability:&nbsp;&nbsp;<span className={`${product.inStock ? 'text-emerald-600' : 'text-destructive'} font-semibold`}>{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
              </div>
            </div>
          </div>

          {/* Price section with dividers */}
          <div className="border-t border-b border-border py-4 my-2">
            <div className="text-2xl md:text-3xl font-bold text-emerald-600 font-sans">
              ₹{product.price.toFixed(2)}
            </div>
          </div>

          {/* Variants Swatches Selection */}
          {variants.length > 1 && (
            <div className="flex gap-3 overflow-x-auto py-1.5 scrollbar-none">
              {variants.map((variant, idx) => {
                const isSelected = selectedVariant?.variantName === variant.variantName;
                const variantImageUrl = variant.images && variant.images[0]
                  ? (typeof variant.images[0] === 'string' ? variant.images[0] : variant.images[0].imageUrl)
                  : '';
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedVariant(variant);
                      setActiveImageIndex(0);
                    }}
                    className="shrink-0 focus-visible:outline-none"
                    aria-label={`Select variant ${variant.variantName}`}
                  >
                    <div className={`relative size-16 md:size-20 rounded-md overflow-hidden border-2 transition-all ${
                      isSelected ? 'border-primary ring-2 ring-primary/20 scale-105' : 'border-border/60 hover:border-primary/60'
                    }`}>
                      {variantImageUrl ? (
                        <img src={variantImageUrl} alt={variant.variantName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[8px] bg-muted">No img</div>
                      )}
                      {isSelected && (
                        <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                          <Check className="size-3 text-primary stroke-[3]" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Size Selection (if available) */}
          {product.availableSizes && product.availableSizes.length > 0 && (
            <div className="space-y-2 p-3.5 bg-muted/20 rounded-lg border">
              <label className="text-sm font-semibold">Select Size</label>
              <div className="flex flex-wrap gap-2">
                {product.availableSizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedSize(size)}
                    className="px-3 h-8 text-xs font-semibold"
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Fabric Length Dropdown Selector */}
          {product.soldBy === 'meter' && (
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground flex items-center gap-0.5">
                <span className="text-destructive font-bold">*</span> Length
              </label>
              <Select
                value={String(selectedMeters)}
                onValueChange={(val) => setSelectedMeters(parseFloat(val))}
              >
                <SelectTrigger className="w-full bg-background border border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4">4 meter</SelectItem>
                  <SelectItem value="5">5 meter</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Qty, Add to Cart panel */}
          <div className="py-4 border-t border-border mt-4">
            <div className="flex items-center gap-3">
              {/* Quantity selector */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-muted-foreground">Qty</span>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val) && val >= 1) {
                      setQuantity(val);
                    }
                  }}
                  className="w-16 text-center border border-border rounded-md py-1.5 text-sm font-semibold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                />
              </div>

              {/* Add to Cart button */}
              <div ref={buttonRef} className="flex-1">
                <Button
                  onClick={handleAddToCart}
                  disabled={product.availableSizes && product.availableSizes.length > 0 && !selectedSize}
                  className="w-full flex items-center justify-center gap-2 py-2"
                >
                  <ShoppingCart className="size-4" />
                  {added ? "Added!" : "Add to Cart"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom area: Description and details tab */}
      <div className="mt-10 border-t pt-8">
        <div className="flex border-b border-border">
          <button className="bg-primary text-primary-foreground font-semibold text-sm px-6 py-2.5 rounded-t-md focus:outline-none select-none">
            Description
          </button>
        </div>

        <div className="p-4 md:p-6 border border-t-0 border-border rounded-b-md bg-card space-y-4 text-sm text-muted-foreground leading-relaxed">
          <p className="text-foreground leading-relaxed">
            {product.description}
          </p>
          
          {/* Detailed specs table */}
          <div className="space-y-2 pt-4 border-t border-border max-w-md">
            <div className="flex justify-between items-center py-1">
              <span className="font-semibold text-foreground">product weight:</span>
              <span className="font-medium">850 gm</span>
            </div>
            <div className="flex justify-between items-center py-1 border-t border-border/40">
              <span className="font-semibold text-foreground">5 mtr weight:</span>
              <span className="font-medium">750 gm</span>
            </div>
            <div className="flex justify-between items-center py-1 border-t border-border/40">
              <span className="font-semibold text-foreground">raj shipping:</span>
              <span className="font-medium">80</span>
            </div>
            <div className="flex justify-between items-center py-1 border-t border-border/40">
              <span className="font-semibold text-foreground">out of Rajasthan:</span>
              <span className="font-medium">80</span>
            </div>
          </div>
        </div>
      </div>

      {/* Add To Cart Animation */}
      {showAnimation && (
        <AddToCartAnimation
          show={showAnimation}
          startPosition={animationPositions.start}
          endPosition={animationPositions.end}
          productImage={primaryImageForAnimation}
          onComplete={handleAnimationComplete}
        />
      )}
    </div>
  );
}