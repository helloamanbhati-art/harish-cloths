import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Tag, 
  Layers, 
  Settings, 
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Moon,
  Sun,
  BarChart3
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
import { Logo } from '../../components/admin/Logo';

function AdminLayoutContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
    { icon: Package, label: 'Products', path: '/admin/products', badge: '156' },
    { icon: ShoppingBag, label: 'Orders', path: '/admin/orders', badge: '12' },
    { icon: Tag, label: 'Brands', path: '/admin/brands' },
    { icon: Layers, label: 'Categories', path: '/admin/categories' },
    { icon: Users, label: 'Customers', path: '/admin/customers' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  const handleLogout = () => {
    // Clear admin auth (in production, clear JWT token)
    localStorage.removeItem('adminAuth');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Top Navigation Bar */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 fixed top-0 left-0 right-0 z-40 transition-colors">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              {sidebarOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
            
            <Logo className="hidden md:flex" />
            
            {/* Mobile Logo */}
            <div className="md:hidden flex items-center gap-2">
              <img
                src="/harish-clothing-logo.svg"
                alt="Harish Clothing"
                className="h-8 w-auto object-contain"
              />
            </div>
          </div>

          {/* Center Section - Search */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search products, orders, customers..."
                className="pl-10 w-full"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={toggleTheme}
              className="relative"
            >
              {theme === 'dark' ? (
                <Sun className="size-5 text-yellow-500" />
              ) : (
                <Moon className="size-5" />
              )}
            </Button>

            <Button variant="ghost" size="sm" className="relative">
              <Bell className="size-5" />
              <Badge className="absolute -top-1 -right-1 size-5 flex items-center justify-center p-0 text-xs">
                3
              </Badge>
            </Button>

            <div className="hidden md:flex items-center gap-2 pl-3 border-l dark:border-gray-700">
              <Avatar className="size-8">
                <AvatarFallback className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white text-sm">
                  AD
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold dark:text-white">Admin</p>
                <p className="text-xs text-muted-foreground">Super Admin</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed top-[57px] left-0 bottom-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-30 transition-all duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="p-4 space-y-1 h-full flex flex-col">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="size-5" />
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.badge && (
                  <Badge
                    variant={isActive ? 'secondary' : 'outline'}
                    className={isActive ? 'bg-white/20 text-white border-white/30' : 'dark:border-gray-600'}
                  >
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}

          {/* Logout at bottom */}
          <div className="mt-auto pt-4 border-t dark:border-gray-700">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-red-600 dark:text-red-400 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
              onClick={handleLogout}
            >
              <LogOut className="size-5" />
              <span className="font-medium">Logout</span>
            </Button>
          </div>
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-64 pt-[57px] min-h-screen">
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