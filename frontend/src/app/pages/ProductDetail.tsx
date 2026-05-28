import { useParams, Link } from "react-router";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, ShoppingCart, Minus, Plus, Trash2, Loader } from "lucide-react";
import { ImageCarousel } from "../components/ImageCarousel";
import { useCart } from "../contexts/CartContext";
import { useState, useRef, useEffect } from "react";
import { AddToCartAnimation } from "../components/AddToCartAnimation";
import { useCartIcon } from "../contexts/CartIconContext";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card } from "../components/ui/card";
import { Separator } from "../components/ui/separator";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface Product {
  _id: string;
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  images: string[];
  brand: string;
  category: string;
  soldBy: 'meter' | 'piece';
  availableSizes?: string[];
  clothingType?: string;
  stock?: { available: number };
  inStock?: boolean;
}

export function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
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
          id: productData._id || productData.id, // Use _id as id for compatibility
          name: productData.name,
          description: productData.description,
          price: productData.price,
          image: productData.image || (productData.images && productData.images[0]) || '',
          images: productData.images || (productData.image ? [productData.image] : []),
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
        };

        setProduct(transformedProduct);
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
    if (product && buttonRef.current && cartIconElement) {
      // Get button position
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const cartRect = cartIconElement.getBoundingClientRect();

      // Calculate positions
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

      // Show animation
      setShowAnimation(true);
      
      // Add to cart based on product type
      if (product.soldBy === 'meter') {
        // Add each meter-piece combination to cart
        meterPieces.forEach(item => {
          // Add as many pieces as specified, each with the selected meter length
          for (let i = 0; i < item.pieces; i++) {
            addToCart(product, item.meters, selectedSize);
          }
        });
      } else {
        addToCart(product, undefined, selectedSize);
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
        // Constrain meters between 4 and 5
        updated[index][field] = Math.max(4, Math.min(5, value));
      } else {
        // Pieces can be 1 or more
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

  const calculateTotalPrice = () => {
    if (!product) return 0;
    return calculateTotalMeters() * product.price;
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

  return (
    <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto">
      <Link to="/">
        <Button variant="ghost" className="mb-4 md:mb-6">
          <ArrowLeft className="size-4 mr-2" />
          Back to Products
        </Button>
      </Link>

      <div className="grid md:grid-cols-2 gap-6 md:gap-8">
        <div className="aspect-square overflow-hidden rounded-lg bg-muted">
          <ImageCarousel
            images={product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : [])}
            alt={product.name}
            className="w-full h-full"
          />
        </div>

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

          <p className="text-lg md:text-xl">
            ₹{product.price.toLocaleString('en-IN')}
            {product.soldBy === 'meter' && <span className="text-sm text-muted-foreground ml-1">/meter</span>}
          </p>

          <div className="space-y-2">
            <h3 className="text-base md:text-lg">
              Description
            </h3>
            <p className="text-sm md:text-base text-muted-foreground">
              {product.description}
            </p>
          </div>

          <div className="space-y-4 pt-4">
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
                            <Label htmlFor={`meters-${index}`} className="text-xs md:text-sm">
                              Meters (4-5m only)
                            </Label>
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => updateMeterPiece(index, 'meters', item.meters - 1)}
                                disabled={item.meters <= 4}
                                className="h-9 w-9 shrink-0"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <Input
                                id={`meters-${index}`}
                                type="number"
                                min="4"
                                max="5"
                                value={item.meters}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value);
                                  if (!isNaN(val)) {
                                    updateMeterPiece(index, 'meters', val);
                                  }
                                }}
                                className="w-full text-center h-9"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => updateMeterPiece(index, 'meters', item.meters + 1)}
                                disabled={item.meters >= 5}
                                className="h-9 w-9 shrink-0"
                              >
                                <Plus className="h-3 w-3" />
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
                        <div className="flex justify-between items-center text-xs md:text-sm bg-muted/50 p-2 rounded">
                          <span className="text-muted-foreground">
                            {item.meters}m × {item.pieces} piece{item.pieces > 1 ? 's' : ''} = {item.meters * item.pieces}m total
                          </span>
                          <span className="font-semibold">
                            ₹{(product.price * item.meters * item.pieces).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </Card>

                {/* Grand Total */}
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 space-y-1">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Total Meters:</span>
                    <span className="font-semibold">{calculateTotalMeters()}m</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-sm md:text-base">Grand Total:</span>
                    <span className="font-bold text-lg md:text-xl text-primary">
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
              >
                <ShoppingCart className="size-5 mr-2" />
                {added ? "Added to Cart!" : "Add to Cart"}
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
          productImage={product.image}
          onComplete={handleAnimationComplete}
        />
      )}
    </div>
  );
}