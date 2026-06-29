import { Sun, Moon, ShoppingCart, Package, Shield, SlidersHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import { Link, useLocation } from 'react-router';
import { useCart } from '../contexts/CartContext';
import { useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { HarishClothsLogo } from './HarishClothsLogo';

interface NavbarProps {
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  onCartIconReady?: (element: HTMLElement) => void;
}

export function Navbar({ theme, onThemeToggle, onCartIconReady }: NavbarProps) {
  const { totalItems } = useCart();
  const cartButtonRef = useRef<HTMLDivElement>(null);
  const [prevTotalItems, setPrevTotalItems] = useState(totalItems);
  const [bounce, setBounce] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    if (cartButtonRef.current && onCartIconReady) {
      onCartIconReady(cartButtonRef.current);
    }
  }, [onCartIconReady]);

  useEffect(() => {
    if (totalItems > prevTotalItems) {
      setBounce(true);
      setTimeout(() => setBounce(false), 600);
    }
    setPrevTotalItems(totalItems);
  }, [totalItems, prevTotalItems]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="flex items-center justify-between px-4 md:px-8 py-3 md:py-4">
        {/* Logo Section - Left */}
        <div className="flex items-center gap-1.5 md:gap-3">
          {isHome && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => window.dispatchEvent(new Event('toggle-filters'))}
              aria-label="Toggle filters"
            >
              <SlidersHorizontal className="size-5 text-foreground" />
            </Button>
          )}
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
            <HarishClothsLogo className="h-10 md:h-12 w-auto text-foreground" />
          </Link>
        </div>
        
        {/* Right Section: My Orders + Theme Toggle + Cart */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* My Orders Button */}
          <Link to="/my-orders">
            <Button
              variant="outline"
              size="sm"
              className="hidden md:flex items-center gap-2 transition-all duration-300 hover:scale-105"
            >
              <Package className="size-4" />
              <span>My Orders</span>
            </Button>
            {/* Mobile: Icon Only */}
            <Button
              variant="outline"
              size="icon"
              className="md:hidden transition-all duration-300 hover:scale-105"
            >
              <Package className="size-4" />
            </Button>
          </Link>

          {/* Theme Toggle */}
          <Button
            variant="outline"
            size="icon"
            onClick={onThemeToggle}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            className="relative overflow-hidden transition-all duration-300 hover:scale-105"
          >
            <motion.div
              initial={false}
              animate={{ rotate: theme === 'light' ? 0 : 180 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center"
            >
              {theme === 'light' ? (
                <Moon className="size-4 md:size-5" />
              ) : (
                <Sun className="size-4 md:size-5" />
              )}
            </motion.div>
          </Button>
          
          {/* Cart Button */}
          <Link to="/cart">
            <motion.div
              animate={bounce ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.4 }}
            >
              <div ref={cartButtonRef}>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="relative transition-all duration-300 hover:scale-105"
                >
                  <ShoppingCart className="size-4 md:size-5" />
                  {totalItems > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full size-5 md:size-6 flex items-center justify-center font-semibold shadow-lg"
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </Button>
              </div>
            </motion.div>
          </Link>
        </div>
      </div>
    </nav>
  );
}