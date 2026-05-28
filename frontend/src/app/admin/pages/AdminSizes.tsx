import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Plus, Trash2 } from 'lucide-react';

interface SizeCategory {
  type: string;
  sizes: string[];
  description: string;
}

const DEFAULT_SIZES: SizeCategory[] = [
  {
    type: 'shirt',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: 'Shirt, T-Shirt, Dress Sizes',
  },
  {
    type: 'jeans',
    sizes: ['28', '30', '32', '34', '36', '38', '40', '42'],
    description: 'Jeans, Pants Sizes (Waist)',
  },
  {
    type: 'onesize',
    sizes: ['One Size'],
    description: 'One Size Fit All Items',
  },
];

export function AdminSizes() {
  const [sizeCategories, setSizeCategories] = useState<SizeCategory[]>(DEFAULT_SIZES);
  const [newSize, setNewSize] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(0);

  const handleAddSize = () => {
    if (newSize.trim()) {
      const updated = [...sizeCategories];
      if (!updated[selectedCategory].sizes.includes(newSize.toUpperCase())) {
        updated[selectedCategory].sizes = [...updated[selectedCategory].sizes, newSize.toUpperCase()];
        setSizeCategories(updated);
        setNewSize('');
      }
    }
  };

  const handleRemoveSize = (categoryIdx: number, sizeIdx: number) => {
    const updated = [...sizeCategories];
    updated[categoryIdx].sizes = updated[categoryIdx].sizes.filter((_, idx) => idx !== sizeIdx);
    setSizeCategories(updated);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Size Management</h1>
        <p className="text-muted-foreground">
          Manage available sizes for different clothing types
        </p>
      </div>

      <div className="grid gap-6">
        {sizeCategories.map((category, categoryIdx) => (
          <Card key={category.type}>
            <CardHeader>
              <CardTitle className="text-lg">{category.type.charAt(0).toUpperCase() + category.type.slice(1)} Sizes</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current Sizes */}
              <div>
                <Label className="text-sm font-semibold mb-3 block">Available Sizes</Label>
                <div className="flex flex-wrap gap-2 mb-4 p-3 bg-muted/30 rounded-lg min-h-10">
                  {category.sizes.length > 0 ? (
                    category.sizes.map((size, sizeIdx) => (
                      <Badge
                        key={sizeIdx}
                        variant="secondary"
                        className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                        onClick={() => handleRemoveSize(categoryIdx, sizeIdx)}
                      >
                        {size}
                        <span className="ml-1 text-xs">✕</span>
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground italic">No sizes added</span>
                  )}
                </div>
              </div>

              {/* Add New Size */}
              {categoryIdx === selectedCategory && (
                <div>
                  <Label className="text-sm font-semibold mb-2 block">Add New Size</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter size (e.g., L, XXL, 36)"
                      value={newSize}
                      onChange={(e) => setNewSize(e.target.value.toUpperCase())}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddSize()}
                      className="flex-1"
                    />
                    <Button onClick={handleAddSize}>
                      <Plus className="size-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              )}

              {categoryIdx !== selectedCategory && (
                <Button
                  variant="outline"
                  onClick={() => setSelectedCategory(categoryIdx)}
                  className="w-full"
                >
                  <Plus className="size-4 mr-2" />
                  Add Size to {category.type}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Size Guide */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-base">Size Guide</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2 text-blue-900">
          <p>
            <strong>Standard Clothing Sizes:</strong> XS, S, M, L, XL, XXL, XXXL
          </p>
          <p>
            <strong>Jeans/Pants Sizes:</strong> Use waist measurements (28, 30, 32, 34, 36, 38, 40, 42)
          </p>
          <p>
            <strong>Custom Sizes:</strong> You can add any size format needed for your products
          </p>
          <p>
            <strong>Tip:</strong> Click on a size badge to remove it from the category
          </p>
        </CardContent>
      </Card>

      {/* Product Size Assignment Info */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-base">How to Use Sizes</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2 text-green-900">
          <ol className="list-decimal list-inside space-y-1">
            <li>Create or edit a product in the Products section</li>
            <li>Assign available sizes to the product</li>
            <li>Customers can select their preferred size when browsing and ordering</li>
            <li>Order details will include the selected size information</li>
            <li>Size data is tracked for inventory and analytics purposes</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
