import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Plus, Edit2, Trash2, Loader2 } from 'lucide-react';

interface AdminProduct {
  _id: string;
  name: string;
  price: number;
  category: string;
  brand: string;
  availableSizes?: string[];
  clothingType?: string;
  stock?: { available: number };
}

export function AdminProducts() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<AdminProduct>>({});

  useEffect(() => {
    // Fetch products - Replace with actual API call
    setLoading(true);
    setTimeout(() => {
      setProducts([
        {
          _id: '1',
          name: 'Cotton Shirt',
          price: 1299,
          category: 'Shirts',
          brand: 'Premium',
          clothingType: 'shirt',
          availableSizes: ['S', 'M', 'L', 'XL'],
          stock: { available: 45 },
        },
        {
          _id: '2',
          name: 'Denim Jeans',
          price: 2499,
          category: 'Jeans',
          brand: 'Classic',
          clothingType: 'jeans',
          availableSizes: ['28', '30', '32', '34', '36'],
          stock: { available: 32 },
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleEditClick = (product: AdminProduct) => {
    setEditingId(product._id);
    setFormData(product);
  };

  const handleSave = () => {
    if (editingId) {
      setProducts(products.map(p => p._id === editingId ? { ...p, ...formData } as AdminProduct : p));
      setEditingId(null);
      setFormData({});
    }
  };

  const handleDelete = (id: string) => {
    setProducts(products.filter(p => p._id !== id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="size-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Products Management</h1>
        <Button>
          <Plus className="size-4 mr-2" />
          Add Product
        </Button>
      </div>

      <div className="grid gap-4">
        {products.map((product) => (
          <Card key={product._id}>
            <CardContent className="p-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {editingId === product._id ? (
                    <>
                      <div className="space-y-2">
                        <Label>Product Name</Label>
                        <Input
                          value={formData.name || ''}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Price</Label>
                        <Input
                          type="number"
                          value={formData.price || ''}
                          onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Clothing Type</Label>
                        <select 
                          className="w-full border rounded px-3 py-2 text-sm"
                          value={formData.clothingType || ''}
                          onChange={(e) => setFormData({ ...formData, clothingType: e.target.value })}
                        >
                          <option value="">Select Type</option>
                          <option value="shirt">Shirt</option>
                          <option value="pants">Pants</option>
                          <option value="jeans">Jeans</option>
                          <option value="dress">Dress</option>
                          <option value="skirt">Skirt</option>
                          <option value="jacket">Jacket</option>
                        </select>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <p className="text-xs text-muted-foreground">Product Name</p>
                        <p className="font-semibold text-lg">{product.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Price</p>
                        <p className="font-semibold">₹{product.price.toLocaleString('en-IN')}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Clothing Type</p>
                        <Badge variant="outline">{product.clothingType || 'N/A'}</Badge>
                      </div>
                    </>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Available Sizes</p>
                    {editingId === product._id ? (
                      <Input
                        placeholder="Enter sizes separated by comma (S, M, L, XL)"
                        value={(formData.availableSizes || []).join(', ')}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          availableSizes: e.target.value.split(',').map(s => s.trim()) 
                        })}
                      />
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {product.availableSizes && product.availableSizes.length > 0 ? (
                          product.availableSizes.map(size => (
                            <Badge key={size} variant="secondary">{size}</Badge>
                          ))
                        ) : (
                          <span className="text-sm text-muted-foreground">No sizes set</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {editingId === product._id ? (
                      <>
                        <Button size="sm" onClick={handleSave}>Save</Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>Cancel</Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditClick(product)}
                        >
                          <Edit2 className="size-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(product._id)}
                        >
                          <Trash2 className="size-3 mr-1" />
                          Delete
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
