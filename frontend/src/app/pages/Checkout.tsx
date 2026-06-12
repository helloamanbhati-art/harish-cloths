import { Link, useNavigate } from 'react-router';
import { useCart } from '../contexts/CartContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { useState, FormEvent } from 'react';
import { toast } from 'sonner';

interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  houseName: string;
  building: string;
  street: string;
  landmark: string;
  city: string;
  state: string;
  zip: string;
  sameAsShipping: boolean;
  couponCode: string;
  customerNotes: string;
}

export function Checkout() {
  usePageTitle('Checkout');
  const { items, totalPrice } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    houseName: '',
    building: '',
    street: '',
    landmark: '',
    city: '',
    state: '',
    zip: '',
    sameAsShipping: true,
    couponCode: '',
    customerNotes: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [id]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      toast.error('First name is required');
      return false;
    }
    if (!formData.lastName.trim()) {
      toast.error('Last name is required');
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      toast.error('Valid email is required');
      return false;
    }
    if (!formData.phone.trim()) {
      toast.error('Phone number is required');
      return false;
    }
    if (!formData.houseName.trim()) {
      toast.error('House/Flat name is required');
      return false;
    }
    if (!formData.building.trim()) {
      toast.error('Building/Society name is required');
      return false;
    }
    if (!formData.street.trim()) {
      toast.error('Street/Road/Area is required');
      return false;
    }
    if (!formData.city.trim()) {
      toast.error('City is required');
      return false;
    }
    if (!formData.state.trim()) {
      toast.error('State is required');
      return false;
    }
    if (!formData.zip.trim() || formData.zip.length !== 6) {
      toast.error('Valid 6-digit PIN code is required');
      return false;
    }
    return true;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    // Prepare shipping address
    const shippingAddress = {
      fullName: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
      houseName: formData.houseName,
      building: formData.building,
      street: formData.street,
      landmark: formData.landmark,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zip,
      country: 'India',
    };

    // Store checkout data in sessionStorage for payment page
    const checkoutData = {
      shippingAddress,
      billingAddress: formData.sameAsShipping ? shippingAddress : shippingAddress,
      sameAsShipping: formData.sameAsShipping,
      email: formData.email,
      couponCode: formData.couponCode,
      customerNotes: formData.customerNotes,
    };

    sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData));
    
    toast.success('Proceeding to payment...');
    
    // Navigate to payment page
    setTimeout(() => {
      navigate('/payment');
    }, 500);
  };

  if (items.length === 0) {
    return (
      <div className="flex-1 p-8 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <ShoppingBag className="size-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">
            Add some products before checking out
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
      <Link to="/cart">
        <Button variant="ghost" className="mb-4 md:mb-6">
          <ArrowLeft className="size-4 mr-2" />
          Back to Cart
        </Button>
      </Link>

      <h1 className="text-xl md:text-2xl mb-4 md:mb-6">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      placeholder="Doe"
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="john.doe@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="houseName">House/Flat Name or Number *</Label>
                  <Input
                    id="houseName"
                    value={formData.houseName}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Flat 301, Sunrise Apartments"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="building">Building/Society Name *</Label>
                  <Input
                    id="building"
                    value={formData.building}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Royal Heights, Sector 7"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="street">Street/Road/Area *</Label>
                  <Input
                    id="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., MG Road, Andheri West"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="landmark">Landmark (Optional)</Label>
                  <Input
                    id="landmark"
                    value={formData.landmark}
                    onChange={handleInputChange}
                    placeholder="e.g., Near City Mall, Opposite Metro Station"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      placeholder="Mumbai"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      placeholder="Maharashtra"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">PIN Code *</Label>
                    <Input
                      id="zip"
                      value={formData.zip}
                      onChange={handleInputChange}
                      required
                      placeholder="400001"
                      pattern="[0-9]{6}"
                      maxLength={6}
                    />
                  </div>
                </div>

                <div className="bg-muted/50 p-3 rounded-lg border border-border">
                  <p className="text-xs text-muted-foreground">
                    <strong>Note:</strong> Please provide complete address details to ensure smooth delivery of your parcel.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.name} x {item.quantity} {item.soldBy === 'meter' ? 'meters' : 'pcs'}
                      </span>
                      <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>Free</span>
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold text-xl">
                    ₹{totalPrice.toLocaleString('en-IN')}
                  </span>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={isProcessing}
                >
                  <ShoppingBag className="size-5 mr-2" />
                  {isProcessing ? 'Processing...' : 'Proceed to Payment'}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Your information is secure and encrypted
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}