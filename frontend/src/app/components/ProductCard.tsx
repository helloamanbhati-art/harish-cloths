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
          <div className="aspect-square overflow-hidden relative bg-muted">
            <img
              src={product.image || (product.images && product.images[0]) || ''}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 select-none"
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
          <CardContent className="p-3.5 space-y-1 text-left">
            <div className="text-[10px] md:text-xs uppercase tracking-wider text-muted-foreground font-medium flex items-center gap-1.5">
              <span>{typeof product.category === 'object' ? product.category?.name : product.category}</span>
              {product.brand && (
                <>
                  <span className="text-muted-foreground/30">•</span>
                  <span>{typeof product.brand === 'object' ? product.brand?.name : product.brand}</span>
                </>
              )}
            </div>
            <h3 className="font-semibold text-base md:text-lg text-foreground truncate hover:text-primary transition-colors">
              {product.name}
            </h3>
            <div className="font-bold text-base md:text-lg text-primary">
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