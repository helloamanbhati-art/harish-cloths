import { Outlet, Link } from 'react-router';
import { Navbar } from '../components/Navbar';
import { useTheme } from '../hooks/useTheme';
import { CartProvider } from '../contexts/CartContext';
import { CartIconProvider, useCartIcon } from '../contexts/CartIconContext';
import { OrderProvider } from '../contexts/OrderContext';
import { Shield } from 'lucide-react';

function LayoutContent() {
  const { theme, toggleTheme } = useTheme();
  const { setCartIconElement } = useCartIcon();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <OrderProvider>
        <CartProvider>
          <Navbar 
            theme={theme} 
            onThemeToggle={toggleTheme}
            onCartIconReady={setCartIconElement}
          />
          <div className="pt-[73px] flex-1">
            <Outlet />
          </div>
          
          {/* Footer with Admin Link and Privacy Policy */}
          <footer className="border-t bg-muted/30 py-6 px-4 text-center">
            <div className="max-w-7xl mx-auto">
              <p className="text-sm text-muted-foreground mb-4">
                © {new Date().getFullYear()} A&S. All rights reserved.
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