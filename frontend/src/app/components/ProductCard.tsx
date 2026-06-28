import { Product } from '../types/product';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ImageCarousel } from './ImageCarousel';
import { Link } from 'react-router';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useCartIcon } from '../contexts/CartIconContext';
import { AddToCartAnimation } from './AddToCartAnimation';
import { useState, useRef } from 'react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { cartIconElement } = useCartIcon();
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationPositions, setAnimationPositions] = useState({
    start: { x: 0, y: 0 },
    end: { x: 0, y: 0 }
  });
  const buttonRef = useRef<HTMLDivElement>(null);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // For meter products, user must go to product detail page to select meters
    if (product.soldBy === 'meter') {
      // Navigate to product detail - handled by the Link wrapper
      return;
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
      addToCart(product);
    }
  };

  return (
    <>
      <Link to={`/product/${product.id}`}>
        <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full group">
          <div className="aspect-square overflow-hidden relative">
            <ImageCarousel
              images={(() => {
                const variantWithImages = product.variants?.find(v => v.images && v.images.length > 0);
                if (variantWithImages) {
                  return variantWithImages.images.map((img: any) => typeof img === 'string' ? img : img.imageUrl);
                }
                return product.images || [];
              })()}
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
            {/* Quick Add Button */}
            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity" ref={buttonRef}>
              <Button
                size="icon"
                onClick={handleAddToCart}
                className="rounded-full shadow-lg"
              >
                <ShoppingCart className="size-4" />
              </Button>
            </div>
          </div>
          <CardContent className="p-3 md:p-4 space-y-2">
            <div className="flex items-start justify-between">
              <div className="space-y-1 flex-1">
                <Badge variant="outline" className="text-xs">
                  {typeof product.brand === 'object' ? product.brand?.name : product.brand}
                </Badge>
                <h3 className="font-medium leading-tight text-sm md:text-base">{product.name}</h3>
                <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
                  {product.description}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-base md:text-lg font-semibold">
                ₹{product.price.toLocaleString('en-IN')}
                {product.soldBy === 'meter' && <span className="text-xs text-muted-foreground ml-1">/meter</span>}
              </span>
              <Badge variant="secondary" className="text-xs">
                {typeof product.category === 'object' ? product.category?.name : product.category}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </Link>

      {showAnimation && (
        <AddToCartAnimation
          show={showAnimation}
          startPosition={animationPositions.start}
          endPosition={animationPositions.end}
          productImage={product.image}
          onComplete={() => setShowAnimation(false)}
        />
      )}
    </>
  );
}