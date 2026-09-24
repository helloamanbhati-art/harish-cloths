import { Menu, Package, ShoppingCart } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { useCart } from '../contexts/CartContext';
import { HarishClothsLogo } from './HarishClothsLogo';

interface NavbarProps {
  onCartIconReady?: (element: HTMLElement) => void;
}

export function Navbar({ onCartIconReady }: NavbarProps) {
  const { totalItems } = useCart();
  const cartButtonRef = useRef<HTMLDivElement>(null);
  const [previousTotal, setPreviousTotal] = useState(totalItems);
  const [bounce, setBounce] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    if (cartButtonRef.current && onCartIconReady) onCartIconReady(cartButtonRef.current);
  }, [onCartIconReady]);

  useEffect(() => {
    if (totalItems > previousTotal) {
      setBounce(true);
      const timer = window.setTimeout(() => setBounce(false), 600);
      setPreviousTotal(totalItems);
      return () => window.clearTimeout(timer);
    }
    setPreviousTotal(totalItems);
  }, [previousTotal, totalItems]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-[1600px] items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-2">
          {pathname === '/' && (
            <Button type="button" variant="ghost" size="icon" className="md:hidden" onClick={() => window.dispatchEvent(new Event('toggle-filters'))} aria-label="Open navigation and filters">
              <Menu className="size-5" />
            </Button>
          )}
          <Link to="/" className="flex items-center transition-opacity hover:opacity-80" aria-label="Siddhi Fashion home">
            <HarishClothsLogo className="h-10 w-auto text-foreground md:h-12" />
          </Link>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <Link to="/my-orders" className="hidden sm:block">
            <Button variant="ghost" size="sm" className="gap-2"><Package className="size-4" /><span>My Orders</span></Button>
          </Link>
          <Link to="/cart" aria-label={`Cart with ${totalItems} items`}>
            <motion.div animate={bounce ? { scale: [1, 1.3, 1] } : {}} transition={{ duration: 0.4 }}>
              <div ref={cartButtonRef}>
                <Button variant="outline" size="icon" className="relative">
                  <ShoppingCart className="size-5" />
                  {totalItems > 0 && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">{totalItems > 99 ? '99+' : totalItems}</motion.span>}
                </Button>
              </div>
            </motion.div>
          </Link>
        </div>
      </div>
    </header>
  );
}
