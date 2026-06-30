import { Link, useNavigate } from 'react-router';
import { useCart } from '../contexts/CartContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const getDisplayValue = (value: unknown) => {
  if (typeof value === 'string') {
    return value;
  }

  if (value && typeof value === 'object' && 'name' in value) {
    const name = (value as { name?: unknown }).name;
    return typeof name === 'string' && name.trim() ? name : 'Unknown';
  }

  return 'Unknown';
};

export function Cart() {
  usePageTitle('Shopping Cart');
  const { items, removeFromCart, updateQuantity, updateMeters, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="flex-1 p-8 max-w-7xl mx-auto">
        <Link to="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="size-4 mr-2" />
            Back to Products
          </Button>
        </Link>

        <div className="text-center py-12">
          <ShoppingBag className="size-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">
            Add some luxury clothing products to get started
          </p>
          <Link to="/">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto">
      <Link to="/">
        <Button variant="ghost" className="mb-4 md:mb-6">
          <ArrowLeft className="size-4 mr-2" />
          Back to Products
        </Button>
      </Link>

      <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl md:text-2xl">Shopping Cart</h1>
            <Button variant="ghost" size="sm" onClick={clearCart}>
              Clear All
            </Button>
          </div>

          {items.map((item, index) => (
            <Card key={`${item.id}-${item.selectedMeters || 'piece'}-${item.selectedSize || 'nosize'}-${index}`}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="w-24 h-24 overflow-hidden rounded-lg flex-shrink-0">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <Badge variant="outline" className="text-xs mb-1">
                          {getDisplayValue(item.brand)}
                        </Badge>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {getDisplayValue(item.category)}
                        </p>
                        {/* Show size info if applicable */}
                        {item.selectedSize && (
                          <Badge variant="secondary" className="mt-1 mr-2 text-xs">
                            Size: {item.selectedSize}
                          </Badge>
                        )}
                        {/* Show design info if applicable */}
                        {item.selectedColor && (
                          <Badge variant="secondary" className="mt-1 mr-2 text-xs bg-primary/10 text-primary border border-primary/20">
                            Design: {item.selectedColor}
                          </Badge>
                        )}
                        {/* Show meter info if applicable */}
                        {item.soldBy === 'meter' && item.selectedMeters && (
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            <span className="text-xs text-muted-foreground font-medium">Length:</span>
                            <span className="text-xs bg-muted text-foreground border border-border rounded-md px-2.5 py-1 font-semibold shadow-sm">
                              {item.selectedMeters.toFixed(1)} Meters
                            </span>
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id, item.selectedMeters, item.selectedSize, item.selectedColor)}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                      {item.soldBy !== 'meter' ? (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedMeters, item.selectedSize, item.selectedColor)}
                            className="h-8 w-8"
                          >
                            <Minus className="size-3" />
                          </Button>
                          <span className="w-20 text-center text-sm font-medium">
                            {item.quantity} pc{item.quantity > 1 ? 's' : ''}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedMeters, item.selectedSize, item.selectedColor)}
                            className="h-8 w-8"
                          >
                            <Plus className="size-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground font-semibold">
                          Quantity: <span className="text-foreground font-bold">{item.quantity}</span>
                        </div>
                      )}
                      <div className="text-left sm:text-right">
                        <span className="text-xs text-muted-foreground block sm:inline mr-1">Total:</span>
                        <span className="font-bold text-base sm:text-lg">
                          ₹{((item.soldBy === 'meter' && item.selectedMeters === 5 ? item.price + (item.compareAtPrice || 0) : item.price) * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl">Order Summary</h2>

              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t">
                <span className="font-semibold">Total</span>
                <span className="font-semibold text-xl">
                  ₹{totalPrice.toLocaleString('en-IN')}
                </span>
              </div>

              <Button className="w-full" size="lg" onClick={() => navigate('/checkout')}>
                <ShoppingBag className="size-5 mr-2" />
                Proceed to Checkout
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Secure checkout with encrypted payment
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
