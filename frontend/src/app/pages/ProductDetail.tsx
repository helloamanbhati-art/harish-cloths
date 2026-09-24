import { useParams, Link, useLocation } from "react-router";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, ShoppingCart, Minus, Plus, Loader, Check, ChevronDown, ChevronLeft, ChevronRight, Share2 } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { usePageTitle } from "../hooks/usePageTitle";
import { useState, useRef, useEffect, useCallback } from "react";
import { AddToCartAnimation } from "../components/AddToCartAnimation";
import { useCartIcon } from "../contexts/CartIconContext";
import { toast } from "sonner";
import { ProductVariant, SelectedVariantSnapshot } from "../types/product";
import { isVideoMediaUrl } from "../utils/media";

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
  const location = useLocation();
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

        let availableSizes = Array.isArray(productData.availableSizes)
          ? productData.availableSizes
          : [];

        // Legacy per-piece products may not have sizes stored directly on the
        // product. Fall back to the public admin-managed size options so the
        // customer can still select a size before adding the item to cart.
        if ((productData.soldBy || 'piece') === 'piece' && availableSizes.length === 0) {
          try {
            const optionsResponse = await fetch(`${API_BASE_URL}/api/v1/catalog/product-options`);
            if (optionsResponse.ok) {
              const optionsResult = await optionsResponse.json();
              availableSizes = Array.isArray(optionsResult?.data?.sizes)
                ? optionsResult.data.sizes
                : [];
            }
          } catch (optionsError) {
            console.warn('Unable to load fallback product sizes:', optionsError);
          }
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
            ? productData.brand?.name || ''
            : productData.brand || '',
          category: typeof productData.category === 'object'
            ? productData.category?.name || ''
            : productData.category || '',
          soldBy: productData.soldBy || 'piece',
          isFlatPrice: productData.isFlatPrice ?? false,
          availableSizes,
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
          // Check if a specific variant was requested via ?variant=<variantId> in the URL
          const params = new URLSearchParams(location.search);
          const requestedVariantId = params.get('variant');
          const matchedVariant = requestedVariantId
            ? transformedProduct.variants.find((v: ProductVariant) => v.variantId === requestedVariantId)
            : null;
          setSelectedVariant(matchedVariant || transformedProduct.variants[0]);
        }

        // Preload all variant images in the background so switching feels instant
        const allVariantImageUrls: string[] = [];
        (transformedProduct.variants || []).forEach((v: any) => {
          (v.images || []).forEach((img: any) => {
            const url = typeof img === 'string' ? img : img.imageUrl;
            if (url) allVariantImageUrls.push(url);
          });
        });
        allVariantImageUrls.forEach((url) => {
          const preloadImg = new window.Image();
          preloadImg.src = url;
        });

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

  const handleAnimationComplete = useCallback(() => {
    setShowAnimation(false);
  }, []);

  const handleVariantSelect = useCallback((variant: ProductVariant) => {
    setSelectedVariant(variant);
    setActiveImageIndex(0);
  }, []);

  const handleShare = async () => {
    if (!product) return;

    const shareData = {
      title: product.name,
      text: `Take a look at ${product.name} from Siddhi Fashion.`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      await navigator.clipboard.writeText(shareData.url);
      toast.success('Product link copied');
    } catch (shareError) {
      if (shareError instanceof DOMException && shareError.name === 'AbortError') return;
      toast.error('Unable to share this product');
    }
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
  const activeMedia = carouselImages[activeImageIndex] || product.image;
  const variants = product.variants || [];
  const requiresSize = Boolean(product.availableSizes?.length);
  const purchaseDisabled = !product.inStock || (requiresSize && !selectedSize);
  const productLookupCode = product.id.slice(-8).toUpperCase();
  const hasPinkShootDetails = productLookupCode === '36A46A94';

  return (
    <main className="mx-auto w-full max-w-[1440px] px-4 py-4 sm:px-6 lg:px-8">
      <Link to="/" className="mb-3 inline-flex items-center gap-2 rounded-md px-1 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <ArrowLeft className="size-4" /> Back to products
      </Link>
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.12fr)_minmax(390px,0.88fr)] lg:gap-8">
        <section aria-label="Product images" className="grid min-w-0 gap-3 sm:grid-cols-[72px_minmax(0,1fr)]">
          {carouselImages.length > 1 && (
            <div className="order-2 flex gap-3 overflow-x-auto pb-1 sm:order-1 sm:flex-col sm:pb-0">
              {carouselImages.map((media, index) => (
                <button key={`${media}-${index}`} type="button" onClick={() => setActiveImageIndex(index)} className={`h-20 w-[72px] shrink-0 overflow-hidden rounded-md border-2 bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${index === activeImageIndex ? 'border-primary' : 'border-transparent hover:border-muted-foreground/40'}`} aria-label={`View product media ${index + 1} of ${carouselImages.length}`} aria-pressed={index === activeImageIndex}>
                  {isVideoMediaUrl(media) ? (
                    <video src={media} aria-hidden="true" muted playsInline preload="metadata" className="h-full w-full object-cover" />
                  ) : (
                    <img src={media} alt="" className="h-full w-full object-cover" />
                  )}
                </button>
              ))}
            </div>
          )}
          <div className={`group relative order-1 flex min-h-[400px] items-center justify-center overflow-hidden rounded-lg bg-muted sm:order-2 lg:h-[calc(100dvh-150px)] lg:min-h-[540px] lg:max-h-[720px] ${carouselImages.length <= 1 ? 'sm:col-span-2' : ''}`}>
            {isVideoMediaUrl(activeMedia) ? (
              <video src={activeMedia} aria-label={`${product.name} product video`} className="h-full w-full object-contain" controls playsInline preload="metadata" />
            ) : (
              <img src={activeMedia} alt={`${product.name}${carouselImages.length > 1 ? `, image ${activeImageIndex + 1}` : ''}`} className="h-full w-full object-contain" loading="eager" decoding="async" />
            )}
            {carouselImages.length > 1 && <><Button type="button" variant="secondary" size="icon" onClick={() => setActiveImageIndex((activeImageIndex - 1 + carouselImages.length) % carouselImages.length)} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-background/90 shadow-sm backdrop-blur-sm sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100 sm:focus-visible:opacity-100" aria-label="Previous product image"><ChevronLeft className="size-5" /></Button><Button type="button" variant="secondary" size="icon" onClick={() => setActiveImageIndex((activeImageIndex + 1) % carouselImages.length)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-background/90 shadow-sm backdrop-blur-sm sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100 sm:focus-visible:opacity-100" aria-label="Next product image"><ChevronRight className="size-5" /></Button><span className="absolute bottom-3 right-3 rounded-full bg-background/90 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm" aria-live="polite">{activeImageIndex + 1} / {carouselImages.length}</span></>}
          </div>
        </section>

        <section aria-labelledby="product-title" className="px-1 py-2 sm:px-2 lg:sticky lg:top-[88px] lg:max-h-[calc(100dvh-105px)] lg:self-start lg:overflow-y-auto lg:px-4">
          <div className="flex flex-wrap items-center gap-2"><Badge variant="secondary">{product.brand || product.category || 'Siddhi Fashion'}</Badge><Badge variant={product.inStock ? 'outline' : 'destructive'} className={product.inStock ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : ''}>{product.inStock ? 'In stock' : 'Out of stock'}</Badge></div>
          <h1 id="product-title" className="mt-3 text-xl font-semibold leading-tight tracking-tight sm:text-2xl">{product.name}</h1>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-x-6 gap-y-2 border-b pb-4"><div><p className="text-2xl font-bold text-emerald-600">₹{(product.soldBy === 'meter' && selectedMeters === 5 ? product.price + (product.compareAtPrice || 0) : product.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p><p className="mt-0.5 text-xs text-muted-foreground">MRP inclusive of all taxes</p></div><p className="text-xs text-muted-foreground">Product code: {productLookupCode}</p></div>

          {variants.length > 1 && <fieldset className="border-b py-3"><legend className="mb-2 text-sm font-semibold">Style <span className="font-normal text-muted-foreground">— {selectedVariant?.variantName}</span></legend><div className="flex flex-wrap gap-2">{variants.map((variant) => { const image = variant.images?.[0]?.imageUrl; const selected = selectedVariant?.variantId === variant.variantId; return <button key={variant.variantId} type="button" onClick={() => handleVariantSelect(variant)} className={`relative size-16 overflow-hidden rounded-md border-2 bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${selected ? 'border-primary' : 'border-transparent hover:border-muted-foreground/40'}`} aria-label={`Select ${variant.variantName}`} aria-pressed={selected} title={variant.variantName}>{image ? <img src={image} alt="" className="h-full w-full object-cover" /> : <span className="grid h-full place-items-center px-1 text-xs">{variant.variantName}</span>}{selected && <span className="absolute right-1 top-1 grid size-5 place-items-center rounded-full bg-primary text-primary-foreground"><Check className="size-3" /></span>}</button>; })}</div></fieldset>}

          {product.soldBy === 'meter' && <fieldset className="border-b py-3"><legend className="mb-2 text-sm font-semibold">Fabric length</legend><div className="flex flex-wrap gap-2">{[4, 5].map((meters) => <button key={meters} type="button" onClick={() => setSelectedMeters(meters)} className={`rounded-md border px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${selectedMeters === meters ? 'border-primary bg-primary text-primary-foreground' : 'bg-background hover:bg-accent'}`} aria-pressed={selectedMeters === meters}>{meters} metres{meters === 5 && product.compareAtPrice ? ` (+₹${product.compareAtPrice.toFixed(2)})` : ''}</button>)}</div></fieldset>}

          <div className="space-y-4 py-4">
            <div><p className="mb-2 text-sm font-semibold">Quantity</p><div className="inline-flex h-10 items-center overflow-hidden rounded-md border bg-background"><button type="button" className="grid h-full w-10 place-items-center transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:text-muted-foreground" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity === 1} aria-label="Decrease quantity"><Minus className="size-4" /></button><output className="min-w-10 border-x px-2 text-center text-sm font-semibold" aria-live="polite">{quantity}</output><button type="button" className="grid h-full w-10 place-items-center transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:text-muted-foreground" onClick={() => setQuantity(Math.min(10, quantity + 1))} disabled={quantity === 10} aria-label="Increase quantity"><Plus className="size-4" /></button></div></div>
            {product.availableSizes && product.availableSizes.length > 0 ? <fieldset><legend className="text-sm font-semibold">Size <span className="text-destructive" aria-hidden="true">*</span><span className="sr-only">(required)</span></legend><div className="mt-2 flex flex-wrap gap-2">{product.availableSizes.map((size) => <button key={size} type="button" onClick={() => setSelectedSize(size)} className={`min-h-10 min-w-12 rounded-sm border px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${selectedSize === size ? 'border-foreground bg-foreground text-background' : 'border-input bg-background hover:border-foreground hover:bg-accent'}`} aria-pressed={selectedSize === size} aria-label={`Size ${size}${selectedSize === size ? ', selected' : ''}`}>{size}</button>)}</div><p className={`mt-1.5 text-xs ${selectedSize ? 'font-medium text-foreground' : 'text-muted-foreground'}`} aria-live="polite">{selectedSize ? `Selected: ${selectedSize}` : 'Select a size to continue'}</p></fieldset> : <div><p className="text-sm font-semibold">Sold by</p><p className="mt-2 text-sm text-muted-foreground">{product.soldBy === 'meter' ? 'Fabric length' : 'One piece'}</p></div>}
          </div>

          <div ref={buttonRef}><Button onClick={handleAddToCart} disabled={purchaseDisabled} className="h-12 w-full gap-2 text-base"><ShoppingCart className="size-4" />{!product.inStock ? 'Out of stock' : added ? 'Added to cart' : requiresSize && !selectedSize ? 'Select a size' : 'Add to cart'}</Button></div>
          <div className="mt-4 border-t pt-4">
            {hasPinkShootDetails ? (
              <details className="group mt-2 border-b">
                <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 py-3 text-sm font-semibold transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
                  More details
                  <ChevronDown className="size-4 shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
                </summary>
                <div className="space-y-5 border-t py-5 text-sm leading-6">
                  <div className="space-y-1">
                    <p><strong>Product Code:</strong> ST0549</p>
                    <p><strong>Upper length:</strong> 39 inches (99.06 cm) approx.</p>
                    <p><strong>Bottom length:</strong> 38 inches (96.5 cm) approx.</p>
                    <p><strong>Care:</strong> Dry clean only</p>
                  </div>

                  <div>
                    <h2 className="font-semibold">📌 Estimated Delivery Information</h2>
                    <ul className="mt-2 space-y-1 text-muted-foreground">
                      <li><strong className="text-foreground">Delhi NCR:</strong> 5 to 7 days (approx.)</li>
                      <li><strong className="text-foreground">Rest of India:</strong> 8 to 10 days (approx.)</li>
                      <li><strong className="text-foreground">Village/Remote area:</strong> 12 to 15 days (approx.)</li>
                      <li><strong className="text-foreground">Outside India:</strong> 10 to 15 days (approx.)</li>
                    </ul>
                    <p className="mt-3 font-semibold">📌 No express shipping</p>
                  </div>

                  <div className="space-y-2 text-muted-foreground">
                    <p>After placing your order, details will be sent to your email address and to the WhatsApp number provided for parcel delivery.</p>
                    <p className="font-semibold text-foreground">📌 Please check your email spam folder too.</p>
                    <p><strong className="text-foreground">Disclaimer:</strong> Color variations may occur due to differences in phone screen resolution or photographic lighting.</p>
                  </div>

                  <div>
                    <h2 className="font-semibold">Washing Instructions</h2>
                    <ul className="mt-2 space-y-1 text-muted-foreground">
                      <li><strong className="text-foreground">All silk suits:</strong> Dry clean only</li>
                      <li><strong className="text-foreground">Embroidery suits:</strong> Dry clean only</li>
                      <li><strong className="text-foreground">Printed cotton:</strong> Gentle dip wash with mild detergent</li>
                    </ul>
                  </div>

                  <Button type="button" variant="outline" onClick={handleShare} className="w-full gap-2">
                    <Share2 className="size-4" aria-hidden="true" />
                    Share
                  </Button>
                </div>
              </details>
            ) : product.description ? (
              <><h2 className="mt-5 text-base font-semibold">Product details</h2><p className="mt-2 whitespace-pre-line text-sm leading-6 text-muted-foreground">{product.description}</p></>
            ) : null}
          </div>
        </section>
      </div>
      {showAnimation && <AddToCartAnimation show={showAnimation} startPosition={animationPositions.start} endPosition={animationPositions.end} productImage={primaryImageForAnimation} onComplete={handleAnimationComplete} />}
    </main>
  );
}
