import { Outlet, Link } from 'react-router';
import { Navbar } from '../components/Navbar';
import { CartProvider } from '../contexts/CartContext';
import { CartIconProvider, useCartIcon } from '../contexts/CartIconContext';
import { OrderProvider } from '../contexts/OrderContext';
import { Shield } from 'lucide-react';

function LayoutContent() {
  const { setCartIconElement } = useCartIcon();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <OrderProvider>
        <CartProvider>
          <Navbar 
            onCartIconReady={setCartIconElement}
          />
          <div className="flex-1 pt-[114px] md:pt-[155px]">
            <Outlet />
          </div>
          
          {/* Footer with Admin Link and Privacy Policy */}
          <footer className="border-t border-[#ded8d1] bg-[#211b18] px-4 py-10 text-center text-white">
            <div className="max-w-7xl mx-auto">
              <p className="text-sm text-muted-foreground mb-4">
                © {new Date().getFullYear()} Siddhi Fashion. All rights reserved.
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                <Link
                  to="/privacy-policy"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors underline"
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/admin/login"
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  <Shield className="size-3" />
                  Admin Access
                </Link>
              </div>
            </div>
          </footer>
        </CartProvider>
      </OrderProvider>
    </div>
  );
}

export function Layout() {
  return (
    <CartIconProvider>
      <LayoutContent />
    </CartIconProvider>
  );
}
