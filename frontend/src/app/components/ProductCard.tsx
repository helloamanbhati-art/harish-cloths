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
import { isVideoMediaUrl } from '../utils/media';

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
  const primaryMedia = product.image || (product.images && product.images[0]) || '';

  return (
    <>
      <Link to={`/product/${product.id}`} className="block">
        <Card className="group m-0 cursor-pointer gap-0 overflow-hidden rounded-none border-none bg-transparent p-0 shadow-none">
          <div className="aspect-[3/4] overflow-hidden relative bg-muted rounded-none">
            {isVideoMediaUrl(primaryMedia) ? (
              <video
                src={primaryMedia}
                aria-label={`${product.name} product video`}
                muted
                loop
                autoPlay
                playsInline
                preload="metadata"
                className="h-full w-full select-none rounded-none object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
              />
            ) : (
              <img
                src={primaryMedia}
                alt={product.name}
                loading="lazy"
                decoding="async"
                className="h-full w-full select-none rounded-none object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
              />
            )}
            {variantsCount > 1 && (
              <span className="absolute bottom-2.5 right-2.5 bg-white/90 dark:bg-black/90 backdrop-blur-sm text-[10px] md:text-xs font-semibold text-gray-700 dark:text-gray-200 px-2 py-0.5 rounded-none shadow-sm z-10">
                +{variantsCount - 1} More
              </span>
            )}
            {!product.inStock && (
              <Badge variant="destructive" className="absolute top-2.5 left-2.5 font-semibold text-[10px] md:text-xs bg-red-600 text-white border-none rounded-none shadow-md z-10">
                Out of Stock
              </Badge>
            )}
            {/* Quick Add Button */}
            {product.inStock && (
              <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity" ref={buttonRef}>
                <Button
                  size="icon"
                  onClick={handleAddToCart}
                  className="rounded-none shadow-lg"
                >
                  <ShoppingCart className="size-4" />
                </Button>
              </div>
            )}
          </div>
          <CardContent className="space-y-1 border-none bg-transparent px-1 pt-4 text-center [&:last-child]:pb-0">
            <h3 className="truncate px-1 font-serif text-[15px] font-normal tracking-[0.01em] text-[#342923] sm:text-base">
              {product.name}
            </h3>
            <div className="text-xs font-medium tracking-[0.08em] text-[#76685f] sm:text-sm">
              ₹{product.price.toFixed(2)}
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
