import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import {
  BarChart3,
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Layers,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Package,
  Ruler,
  Search,
  Settings,
  ShoppingBag,
  Sun,
  Tag,
  Users,
  X,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { useState } from 'react';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { OrderProvider } from '../../contexts/OrderContext';
import { CartProvider } from '../../contexts/CartContext';
import { CartIconProvider } from '../../contexts/CartIconContext';
import { ThemeProvider, useTheme } from '../../contexts/ThemeContext';
import { Logo } from '../components/Logo';

const primaryItems = [
  { icon: ShoppingBag, label: 'Orders', path: '/admin/orders' },
  { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
  { icon: Users, label: 'Customers', path: '/admin/customers' },
  { icon: Tag, label: 'Brands', path: '/admin/brands' },
  { icon: Layers, label: 'Categories', path: '/admin/categories' },
];

const secondaryItems = [
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
];

function AdminLayoutContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [productsOpen, setProductsOpen] = useState(true);
  const { theme, toggleTheme } = useTheme();

  const isPathActive = (path: string) =>
    path === '/admin' ? location.pathname === path : location.pathname.startsWith(path);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#f4f6fb] dark:bg-gray-900 transition-colors">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 fixed top-0 left-0 right-0 z-40 transition-colors">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen((open) => !open)}
              className="lg:hidden"
              aria-label={sidebarOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {sidebarOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>

            <Logo className="hidden md:flex" />

            <div className="md:hidden flex items-center gap-2">
              <img
                src="/siddhi-fashion-logo.png"
                alt="Siddhi Fashion Retail"
                className="h-8 w-auto object-contain"
              />
            </div>
          </div>

          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search products, orders, customers..."
                className="pl-10 w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="relative"
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              {theme === 'dark' ? (
                <Sun className="size-5 text-yellow-500" />
              ) : (
                <Moon className="size-5" />
              )}
            </Button>

            <Button variant="ghost" size="sm" className="relative" aria-label="Notifications">
              <Bell className="size-5" />
              <Badge className="absolute -top-1 -right-1 size-5 flex items-center justify-center p-0 text-xs">
                3
              </Badge>
            </Button>

            <div className="hidden md:flex items-center gap-2 pl-3 border-l dark:border-gray-700">
              <Avatar className="size-8">
                <AvatarFallback className="bg-[#3145a5] text-white text-sm">AD</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold dark:text-white">Admin</p>
                <p className="text-xs text-muted-foreground">Super Admin</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <aside
        className={`fixed top-[57px] left-0 bottom-0 z-30 w-60 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-[width,transform] duration-300 ease-in-out
          ${sidebarCollapsed ? 'lg:w-[76px]' : 'lg:w-60'}
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        aria-label="Admin navigation"
      >
        <nav className="relative flex h-full flex-col px-3 py-4">
          <div className="space-y-1">
            <Link
              to="/admin"
              onClick={() => setSidebarOpen(false)}
              title={sidebarCollapsed ? 'Dashboard' : undefined}
              className={`flex h-10 items-center rounded-lg px-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3145a5]
                ${sidebarCollapsed ? 'lg:justify-center lg:px-0' : ''}
                ${isPathActive('/admin')
                  ? 'bg-[#f0f1f3] text-[#3145a5] dark:bg-gray-700 dark:text-indigo-300'
                  : 'text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'}`}
            >
              <LayoutDashboard className="size-5 shrink-0" aria-hidden="true" />
              <span className={`ml-3 text-sm font-semibold ${sidebarCollapsed ? 'lg:sr-only' : ''}`}>
                Dashboard
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setProductsOpen((open) => !open)}
              title={sidebarCollapsed ? 'Products' : undefined}
              aria-expanded={productsOpen}
              className={`flex h-10 w-full items-center rounded-lg px-3 text-gray-800 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3145a5] dark:text-gray-200 dark:hover:bg-gray-700
                ${sidebarCollapsed ? 'lg:justify-center lg:px-0' : ''}
                ${isPathActive('/admin/products') || isPathActive('/admin/sizes') ? 'text-[#3145a5] dark:text-indigo-300' : ''}`}
            >
              <Package className="size-5 shrink-0" aria-hidden="true" />
              <span className={`ml-3 text-sm font-medium ${sidebarCollapsed ? 'lg:sr-only' : ''}`}>
                Products
              </span>
              <ChevronDown
                className={`ml-auto size-4 transition-transform ${productsOpen ? 'rotate-180' : ''} ${sidebarCollapsed ? 'lg:hidden' : ''}`}
                aria-hidden="true"
              />
            </button>

            {productsOpen && (
              <div className={`ml-[21px] border-l border-gray-400/80 pl-5 py-0.5 space-y-0.5 ${sidebarCollapsed ? 'lg:hidden' : ''}`}>
                <Link
                  to="/admin/products"
                  onClick={() => setSidebarOpen(false)}
                  className={`block rounded-md px-1 py-2 text-sm transition-colors hover:text-[#3145a5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3145a5]
                    ${isPathActive('/admin/products') ? 'font-semibold text-[#3145a5]' : 'text-gray-700 dark:text-gray-300'}`}
                >
                  All Products
                </Link>
                <Link
                  to="/admin/sizes"
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center rounded-md px-1 py-2 text-sm transition-colors hover:text-[#3145a5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3145a5]
                    ${isPathActive('/admin/sizes') ? 'font-semibold text-[#3145a5]' : 'text-gray-700 dark:text-gray-300'}`}
                >
                  <Ruler className="mr-2 size-3.5" aria-hidden="true" />
                  Sizes
                </Link>
              </div>
            )}

            {primaryItems.map((item) => {
              const Icon = item.icon;
              const isActive = isPathActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  title={sidebarCollapsed ? item.label : undefined}
                  className={`flex h-10 items-center rounded-lg px-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3145a5]
                    ${sidebarCollapsed ? 'lg:justify-center lg:px-0' : ''}
                    ${isActive
                      ? 'bg-[#f0f1f3] text-[#3145a5] dark:bg-gray-700 dark:text-indigo-300'
                      : 'text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'}`}
                >
                  <Icon className="size-5 shrink-0" aria-hidden="true" />
                  <span className={`ml-3 text-sm font-medium ${sidebarCollapsed ? 'lg:sr-only' : ''}`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="my-3 border-t border-gray-200 dark:border-gray-700" />

          <div className="space-y-1">
            {secondaryItems.map((item) => {
              const Icon = item.icon;
              const isActive = isPathActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  title={sidebarCollapsed ? item.label : undefined}
                  className={`flex h-10 items-center rounded-lg px-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3145a5]
                    ${sidebarCollapsed ? 'lg:justify-center lg:px-0' : ''}
                    ${isActive
                      ? 'bg-[#f0f1f3] text-[#3145a5] dark:bg-gray-700 dark:text-indigo-300'
                      : 'text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'}`}
                >
                  <Icon className="size-5 shrink-0" aria-hidden="true" />
                  <span className={`ml-3 text-sm font-medium ${sidebarCollapsed ? 'lg:sr-only' : ''}`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="mt-auto space-y-1">
            <div className="mb-2 border-t border-gray-200 dark:border-gray-700" />
            <Link
              to="/admin/help"
              onClick={() => setSidebarOpen(false)}
              title={sidebarCollapsed ? 'FAQ' : undefined}
              className={`flex h-11 items-center rounded-lg px-3 text-gray-800 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3145a5] dark:text-gray-200 dark:hover:bg-gray-700 ${sidebarCollapsed ? 'lg:justify-center lg:px-0' : ''}`}
            >
              <CircleHelp className="size-5 shrink-0" aria-hidden="true" />
              <span className={`ml-3 text-sm font-medium ${sidebarCollapsed ? 'lg:sr-only' : ''}`}>FAQ</span>
            </Link>

            <div className="border-t border-gray-200 dark:border-gray-700" />

            <button
              type="button"
              onClick={handleLogout}
              title={sidebarCollapsed ? 'Log out' : undefined}
              className={`flex h-11 w-full items-center rounded-lg px-3 text-gray-800 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3145a5] dark:text-gray-200 dark:hover:bg-gray-700 ${sidebarCollapsed ? 'lg:justify-center lg:px-0' : ''}`}
            >
              <LogOut className="size-5 shrink-0" aria-hidden="true" />
              <span className={`ml-3 text-sm font-medium ${sidebarCollapsed ? 'lg:sr-only' : ''}`}>
                Log out
              </span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setSidebarCollapsed((collapsed) => !collapsed)}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="group/collapse absolute right-0 top-[44%] hidden h-9 w-7 translate-x-1/2 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 shadow-sm transition-colors hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3145a5] lg:flex dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="size-5" aria-hidden="true" />
            ) : (
              <ChevronLeft className="size-5" aria-hidden="true" />
            )}
            <span className="pointer-events-none absolute left-full ml-2 hidden rounded bg-gray-900 px-2 py-1 text-xs font-medium text-white shadow-lg group-hover/collapse:block group-focus-visible/collapse:block">
              {sidebarCollapsed ? 'Expand' : 'Collapse'}
            </span>
          </button>
        </nav>
      </aside>

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main
        className={`pt-[57px] min-h-screen transition-[margin] duration-300 ${sidebarCollapsed ? 'lg:ml-[76px]' : 'lg:ml-60'}`}
      >
        <div className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export function AdminLayout() {
  return (
    <ThemeProvider>
      <OrderProvider>
        <CartProvider>
          <CartIconProvider>
            <AdminLayoutContent />
          </CartIconProvider>
        </CartProvider>
      </OrderProvider>
    </ThemeProvider>
  );
}
