import { useParams, Link, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, ShoppingCart, Minus, Plus, Trash2, Loader, LayoutGrid, Check, Star, ChevronLeft, ChevronRight } from "lucide-react";
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
  compareAtPrice?: number;
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
          compareAtPrice: productData.compareAtPrice || 0,
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
        
        {/* Left Column: Main Image Carousel */}
        <div className="space-y-4">
          {/* Main Image container with scroll/carousel overlay */}
          <div className="relative overflow-hidden rounded-none bg-muted group p-0">
            <img
              src={carouselImages[activeImageIndex] || product.image}
              alt={product.name}
              className="w-full h-auto object-contain transition-all duration-350 animate-fade-in rounded-none p-0 m-0"
            />
            {carouselImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveImageIndex((prev) => (prev === 0 ? carouselImages.length - 1 : prev - 1));
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity focus-visible:opacity-100 cursor-pointer z-10"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveImageIndex((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1));
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity focus-visible:opacity-100 cursor-pointer z-10"
                  aria-label="Next image"
                >
                  <ChevronRight className="size-5" />
                </button>

                {/* Dot Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/30 px-3 py-1.5 rounded-full z-10">
                  {carouselImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`size-2 rounded-full transition-all ${
                        idx === activeImageIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Variants Swatches Selection */}
          {variants.length > 1 && (
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3.5 py-2.5 px-2.5 w-fit">
              {variants.map((variant, idx) => {
                const isSelected = selectedVariant?.variantId === variant.variantId;
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
                    className="shrink-0 focus-visible:outline-none p-0 m-0"
                    aria-label={`Select variant ${variant.variantName}`}
                  >
                    <div className={`relative size-24 md:size-32 rounded-none overflow-hidden border-2 transition-all p-0 ${
                      isSelected ? 'border-emerald-600 ring-2 ring-emerald-500/20 scale-105' : 'border-border/60 hover:border-gray-400'
                    }`}>
                      {variantImageUrl ? (
                        <img src={variantImageUrl} alt={variant.variantName} className="w-full h-full object-cover rounded-none p-0 m-0" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[8px] bg-muted rounded-none p-0 m-0">No img</div>
                      )}
                    </div>
                  </button>
                );
              })}
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
              ₹{(product.soldBy === 'meter' && selectedMeters === 5
                ? (product.price + (product.compareAtPrice || 0))
                : product.price).toFixed(2)}
            </div>
          </div>



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
                  <span>
                    {selectedMeters} meter
                    {selectedMeters === 5 && product.compareAtPrice && product.compareAtPrice > 0
                      ? ` (+₹${product.compareAtPrice.toFixed(2)})`
                      : ''}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4">4 meter</SelectItem>
                  <SelectItem value="5">
                    5 meter {product.compareAtPrice && product.compareAtPrice > 0 ? `(+₹${product.compareAtPrice.toFixed(2)})` : ''}
                  </SelectItem>
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
                <Select
                  value={String(quantity)}
                  onValueChange={(val) => setQuantity(parseInt(val))}
                >
                  <SelectTrigger className="w-20 bg-background border border-border">
                    <span>{quantity}</span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Add to Cart button */}
              <div ref={buttonRef} className="flex-1">
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.inStock || (product.availableSizes && product.availableSizes.length > 0 && !selectedSize)}
                  className="w-full flex items-center justify-center gap-2 py-2"
                >
                  <ShoppingCart className="size-4" />
                  {!product.inStock ? "Out of Stock" : added ? "Added!" : "Add to Cart"}
                </Button>
              </div>
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