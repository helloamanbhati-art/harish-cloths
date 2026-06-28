import { useParams, Link } from "react-router";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, ShoppingCart, Minus, Plus, Trash2, Loader, LayoutGrid, Check } from "lucide-react";
import { ImageCarousel } from "../components/ImageCarousel";
import { useCart } from "../contexts/CartContext";
import { usePageTitle } from "../hooks/usePageTitle";
import { useState, useRef, useEffect } from "react";
import { AddToCartAnimation } from "../components/AddToCartAnimation";
import { useCartIcon } from "../contexts/CartIconContext";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { toast } from "sonner";
import { ProductVariant, SelectedVariantSnapshot } from "../types/product";

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
  availableSizes?: string[];
  clothingType?: string;
  stock?: { available: number };
  inStock?: boolean;
  additionalChargeName?: string;
  additionalChargeAmount?: number;
}

export function ProductDetail() {
  const { id } = useParams();
  usePageTitle('Product Details');
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // New variants state
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  const [meterPieces, setMeterPieces] = useState<Array<{ meters: number; pieces: number }>>([
    { meters: 4, pieces: 1 }
  ]);
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
    if (product && product.availableSizes && product.availableSizes.length > 0) {
      if (!selectedSize) {
        toast.error('Please select a size before adding to cart');
        return;
      }
    }

    if (product && buttonRef.current && cartIconElement) {
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

      if (product.soldBy === 'meter') {
        meterPieces.forEach(item => {
          for (let i = 0; i < item.pieces; i++) {
            addToCart(productToCart, item.meters, selectedSize, cartVariantName, variantSnapshot);
          }
        });
      } else {
        addToCart(productToCart, undefined, selectedSize, cartVariantName, variantSnapshot);
      }

      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const handleAnimationComplete = () => {
    setShowAnimation(false);
  };

  // Functions for meter pieces
  const updateMeterPiece = (index: number, field: 'meters' | 'pieces', value: number) => {
    setMeterPieces(prev => {
      const updated = [...prev];
      if (field === 'meters') {
        updated[index][field] = Math.max(4, Math.min(5, value));
      } else {
        updated[index][field] = Math.max(1, value);
      }
      return updated;
    });
  };

  const addMeterPiece = () => {
    setMeterPieces(prev => [...prev, { meters: 4, pieces: 1 }]);
  };

  const removeMeterPiece = (index: number) => {
    if (meterPieces.length > 1) {
      setMeterPieces(prev => prev.filter((_, i) => i !== index));
    }
  };

  const calculateTotalMeters = () => {
    return meterPieces.reduce((total, item) => total + (item.meters * item.pieces), 0);
  };

  const calculateTotalPieces = () => {
    return meterPieces.reduce((total, item) => total + item.pieces, 0);
  };

  const calculateTotalPrice = () => {
    if (!product) return 0;
    const fabricCost = calculateTotalMeters() * product.price;
    const additionalCharge = (product.additionalChargeAmount || 0) * calculateTotalPieces();
    return fabricCost + additionalCharge;
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <Loader className="size-8 animate-spin mx-auto text-primary" />
          <h2 className="text-2xl">Loading product...</h2>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-2xl mb-2">Product Not Found</h2>
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
  
  // Map VariantImage items to string URLs for ImageCarousel
  const carouselImages = galleryImages.map((img: any) => typeof img === 'string' ? img : img.imageUrl);
  
  const primaryImageForAnimation = carouselImages && carouselImages.length > 0 ? carouselImages[0] : product.image;
  const variants = product.variants || [];

  return (
    <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto">
      <Link to="/">
        <Button variant="ghost" className="mb-4 md:mb-6">
          <ArrowLeft className="size-4 mr-2" />
          Back to Products
        </Button>
      </Link>

      <div className="grid md:grid-cols-2 gap-6 md:gap-8">
        {/* Main Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg bg-muted">
            <ImageCarousel
              images={carouselImages}
              alt={product.name}
              className="w-full h-full"
              currentIndex={activeImageIndex}
              onIndexChange={setActiveImageIndex}
            />
          </div>

          {/* Variants Selection (Mobile/Tablet only) */}
          {variants.length > 1 && (
            <div className="block md:hidden space-y-4 p-4 border border-border/60 bg-card rounded-2xl shadow-sm">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold flex items-center gap-2 text-foreground">
                  <LayoutGrid className="size-4 text-primary" /> Select Design & Pattern
                </Label>
                {selectedVariant && (
                  <span className="text-xs text-muted-foreground">
                    Selected: <span className="font-bold text-primary">{selectedVariant.variantName}</span>
                  </span>
                )}
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2 pt-1 scrollbar-thin scrollbar-thumb-muted-foreground/20 hover:scrollbar-thumb-muted-foreground/30 snap-x snap-mandatory scroll-smooth">
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
                      className="flex flex-col items-center gap-2 shrink-0 snap-start focus-visible:outline-none group relative py-1"
                      aria-label={`Select ${variant.variantName || 'Default'} variant`}
                    >
                      {/* Circular Swatch Container */}
                      <div className={`relative size-16 rounded-full overflow-hidden transition-all duration-300 bg-muted border-2 ${
                        isSelected 
                          ? 'border-primary ring-4 ring-primary/20 scale-105 shadow-md' 
                          : 'border-border/60 hover:border-primary/60 hover:scale-102 hover:shadow-sm'
                      }`}>
                        {variantImageUrl ? (
                          <img 
                            src={variantImageUrl} 
                            alt={variant.variantName} 
                            className="w-full h-full object-cover select-none transition-transform duration-500 group-hover:scale-110" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-[10px] bg-muted">No img</div>
                        )}
                        
                        {/* Inner selected ring/indicator */}
                        {isSelected && (
                          <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                            <div className="bg-primary text-primary-foreground rounded-full p-1 shadow-sm scale-90">
                              <Check className="size-3 stroke-[3]" />
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Swatch Label */}
                      <span className={`text-[10px] font-medium text-center max-w-[80px] truncate transition-colors duration-200 ${
                        isSelected ? 'text-primary font-bold' : 'text-muted-foreground group-hover:text-foreground'
                      }`} title={variant.variantName || 'Default'}>
                        {variant.variantName || 'Default'}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Product Info & Settings */}
        <div className="space-y-4 md:space-y-6">
          <div className="space-y-2">
            <Badge variant="outline" className="text-sm">
              {product.brand}
            </Badge>
            <h1 className="text-2xl md:text-3xl">
              {product.name}
            </h1>
            <Badge variant="secondary" className="text-sm">
              {product.category}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-lg md:text-xl border-b pb-4">
            <span className="font-semibold text-gray-900 dark:text-white">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.soldBy === 'meter' && <span className="text-sm text-muted-foreground">/meter</span>}
            {product.additionalChargeAmount && product.additionalChargeAmount > 0 && (
              <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                + ₹{product.additionalChargeAmount.toLocaleString('en-IN')} ({product.additionalChargeName || 'Additional'})
              </span>
            )}
            {product.soldBy === 'meter' && meterPieces[0] && (
              <span className="text-base font-bold bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20 transition-all duration-300 ml-1">
                = ₹{(product.price * meterPieces[0].meters * meterPieces[0].pieces + (product.additionalChargeAmount || 0) * meterPieces[0].pieces).toLocaleString('en-IN')} (Total for {meterPieces[0].meters}m)
              </span>
            )}
            {product.soldBy === 'piece' && (
              <span className="text-base font-bold bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20 transition-all duration-300 ml-1">
                = ₹{(product.price + (product.additionalChargeAmount || 0)).toLocaleString('en-IN')} (Total for 1 pc)
              </span>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-base md:text-lg">
              Description
            </h3>
            <p className="text-sm md:text-base text-muted-foreground">
              {product.description}
            </p>
          </div>

          <div className="space-y-4 pt-4">
            
            {/* Variants Selection (Desktop only) */}
            {variants.length > 1 && (
              <div className="hidden md:block space-y-4 p-4 border border-border/60 bg-card rounded-2xl shadow-sm">
                <div className="flex items-center justify-between">
                  <Label className="text-sm md:text-base font-semibold flex items-center gap-2 text-foreground">
                    <LayoutGrid className="size-4 text-primary" /> Select Design & Pattern
                  </Label>
                  {selectedVariant && (
                    <span className="text-xs text-muted-foreground">
                      Selected: <span className="font-bold text-primary">{selectedVariant.variantName}</span>
                    </span>
                  )}
                </div>
                <div className="flex gap-4 overflow-x-auto pb-2 pt-1 scrollbar-thin scrollbar-thumb-muted-foreground/20 hover:scrollbar-thumb-muted-foreground/30 snap-x snap-mandatory scroll-smooth">
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
                        className="flex flex-col items-center gap-2 shrink-0 snap-start focus-visible:outline-none group relative py-1"
                        aria-label={`Select ${variant.variantName || 'Default'} variant`}
                      >
                        {/* Circular Swatch Container */}
                        <div className={`relative size-16 md:size-20 rounded-full overflow-hidden transition-all duration-300 bg-muted border-2 ${
                          isSelected 
                            ? 'border-primary ring-4 ring-primary/20 scale-105 shadow-md' 
                            : 'border-border/60 hover:border-primary/60 hover:scale-102 hover:shadow-sm'
                        }`}>
                          {variantImageUrl ? (
                            <img 
                              src={variantImageUrl} 
                              alt={variant.variantName} 
                              className="w-full h-full object-cover select-none transition-transform duration-500 group-hover:scale-110" 
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-[10px] bg-muted">No img</div>
                          )}
                          
                          {/* Inner selected ring/indicator */}
                          {isSelected && (
                            <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                              <div className="bg-primary text-primary-foreground rounded-full p-1 shadow-sm scale-90">
                                <Check className="size-3 stroke-[3]" />
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Swatch Label */}
                        <span className={`text-[10px] md:text-xs font-medium text-center max-w-[80px] md:max-w-[96px] truncate transition-colors duration-200 ${
                          isSelected ? 'text-primary font-bold' : 'text-muted-foreground group-hover:text-foreground'
                        }`} title={variant.variantName || 'Default'}>
                          {variant.variantName || 'Default'}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.availableSizes && product.availableSizes.length > 0 && (
              <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
                <Label className="text-sm md:text-base font-semibold">
                  Select Size
                </Label>
                <div className="flex flex-wrap gap-2">
                  {product.availableSizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedSize(size)}
                      className="px-3 h-8 text-xs"
                    >
                      {size}
                    </Button>
                  ))}
                </div>
                {selectedSize && (
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Selected: <span className="font-semibold text-foreground">{selectedSize}</span>
                  </p>
                )}
              </div>
            )}

            {/* Meter Selection */}
            {product.soldBy === 'meter' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm md:text-base font-semibold">
                    Select Meters & Pieces
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addMeterPiece}
                    className="h-8"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add More
                  </Button>
                </div>

                <Card className="p-3 md:p-4 space-y-3">
                  {meterPieces.map((item, index) => (
                    <div key={index}>
                      {index > 0 && <Separator className="mb-3" />}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs md:text-sm font-medium text-muted-foreground">
                            Option {index + 1}
                          </span>
                          {meterPieces.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeMeterPiece(index)}
                              className="h-7 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Remove
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {/* Meters Selection */}
                          <div className="space-y-2">
                            <Label className="text-xs md:text-sm">
                              Meters (Select size)
                            </Label>
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant={item.meters === 4 ? 'default' : 'outline'}
                                onClick={() => updateMeterPiece(index, 'meters', 4)}
                                className="flex-1 h-9 text-xs"
                              >
                                4 Meters
                              </Button>
                              <Button
                                type="button"
                                variant={item.meters === 5 ? 'default' : 'outline'}
                                onClick={() => updateMeterPiece(index, 'meters', 5)}
                                className="flex-1 h-9 text-xs"
                              >
                                5 Meters
                              </Button>
                            </div>
                          </div>

                          {/* Pieces Selection */}
                          <div className="space-y-2">
                            <Label htmlFor={`pieces-${index}`} className="text-xs md:text-sm">
                              Number of Pieces
                            </Label>
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => updateMeterPiece(index, 'pieces', item.pieces - 1)}
                                disabled={item.pieces <= 1}
                                className="h-9 w-9 shrink-0"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <Input
                                id={`pieces-${index}`}
                                type="number"
                                min="1"
                                value={item.pieces}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value);
                                  if (!isNaN(val)) {
                                    updateMeterPiece(index, 'pieces', val);
                                  }
                                }}
                                className="w-full text-center h-9"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => updateMeterPiece(index, 'pieces', item.pieces + 1)}
                                className="h-9 w-9 shrink-0"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Subtotal for this option */}
                        <div className="flex justify-between items-center bg-muted/50 p-3 rounded-lg border border-muted/50">
                          <div className="flex flex-col">
                            <span className="text-sm md:text-base font-semibold text-foreground">
                              {item.meters}m × {item.pieces} piece{item.pieces > 1 ? 's' : ''} = {item.meters * item.pieces}m total
                            </span>
                            {product.additionalChargeAmount && product.additionalChargeAmount > 0 && (
                              <span className="text-xs text-emerald-500">
                                + ₹{(product.additionalChargeAmount * item.pieces).toLocaleString('en-IN')} ({product.additionalChargeName || 'Additional'})
                              </span>
                            )}
                          </div>
                          <span className="font-bold text-base md:text-lg text-primary">
                            ₹{(
                              (product.soldBy === 'meter'
                                ? product.price * item.meters * item.pieces
                                : product.price * item.pieces
                              ) + (product.additionalChargeAmount || 0) * item.pieces
                            ).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </Card>

                {/* Grand Total */}
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-center text-sm md:text-base text-foreground/80">
                    <span>Total Meters:</span>
                    <span className="font-semibold text-foreground">{calculateTotalMeters()}m</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-primary/10 pt-2">
                    <span className="font-bold text-base md:text-lg text-foreground">Grand Total:</span>
                    <span className="font-extrabold text-xl md:text-2xl text-primary">
                      ₹{calculateTotalPrice().toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={buttonRef}>
              <Button
                className="w-full"
                size="lg"
                onClick={handleAddToCart}
                disabled={product && product.availableSizes && product.availableSizes.length > 0 && !selectedSize}
                variant={product && product.availableSizes && product.availableSizes.length > 0 && !selectedSize ? "outline" : "default"}
              >
                <ShoppingCart className="size-5 mr-2" />
                {product && product.availableSizes && product.availableSizes.length > 0 && !selectedSize
                  ? "Select Size First"
                  : added ? "Added to Cart!" : "Add to Cart"}
              </Button>
            </div>
          </div>

          <div className="border-t pt-4 md:pt-6 space-y-4">
            <div>
              <h4 className="mb-2 text-sm md:text-base">
                Product Details
              </h4>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">
                    Brand
                  </dt>
                  <dd>{product.brand}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">
                    Category
                  </dt>
                  <dd>{product.category}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">
                    Sold By
                  </dt>
                  <dd className="capitalize">{product.soldBy}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">
                    Product ID
                  </dt>
                  <dd className="text-xs md:text-sm">
                    {product._id || product.id}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>

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