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

  const variantsCount = product.variants ? product.variants.length : 0;

  return (
    <>
      <Link to={`/product/${product.id}`}>
        <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full bg-white border border-border/60 rounded-lg group">
          <div className="aspect-[3/4] overflow-hidden relative bg-muted">
            <img
              src={product.image || (product.images && product.images[0]) || ''}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 select-none"
            />
            {variantsCount > 1 && (
              <span className="absolute bottom-2.5 right-2.5 bg-white/90 backdrop-blur-sm text-[10px] md:text-xs font-semibold text-gray-700 px-2 py-0.5 rounded shadow-sm z-10">
                +{variantsCount - 1} More
              </span>
            )}
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
          <CardContent className="p-3.5 space-y-1.5 text-left">
            <h3 className="text-sm text-muted-foreground font-medium truncate">
              {product.name}
            </h3>
            <div className="font-bold text-base md:text-lg text-gray-900">
              ₹{product.price.toLocaleString('en-IN')}
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