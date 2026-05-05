import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import { Plus, Edit, Trash2, Tag } from 'lucide-react';
import { luxuryBrands as initialBrands } from '../../data/products';
import { toast } from 'sonner';

export function BrandsManagement() {
  const [brands, setBrands] = useState<string[]>(initialBrands);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<string | null>(null);
  const [brandName, setBrandName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingBrand) {
      // Update existing brand
      setBrands(brands.map((b) => (b === editingBrand ? brandName : b)));
      toast.success('Brand updated successfully!');
    } else {
      // Add new brand
      if (brands.includes(brandName)) {
        toast.error('Brand already exists!');
        return;
      }
      setBrands([...brands, brandName]);
      toast.success('Brand added successfully!');
    }

    setBrandName('');
    setIsAddDialogOpen(false);
    setEditingBrand(null);
  };

  const handleEdit = (brand: string) => {
    setEditingBrand(brand);
    setBrandName(brand);
    setIsAddDialogOpen(true);
  };

  const handleDelete = (brand: string) => {
    if (confirm(`Are you sure you want to delete "${brand}"?`)) {
      setBrands(brands.filter((b) => b !== brand));
      toast.success('Brand deleted successfully!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Brands Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage fabric brands for your product catalog
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingBrand(null);
                setBrandName('');
              }}
            >
              <Plus className="size-4 mr-2" />
              Add New Brand
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingBrand ? 'Edit Brand' : 'Add New Brand'}
              </DialogTitle>
              <DialogDescription>
                {editingBrand
                  ? 'Update the brand name below'
                  : 'Enter a new brand name for your products'}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="brandName">Brand Name *</Label>
                <Input
                  id="brandName"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="e.g., Fabindia, Raymond, Biba"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  {editingBrand ? 'Update Brand' : 'Add Brand'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    setEditingBrand(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">
                  Total Brands
                </p>
                <p className="text-3xl font-bold mt-2">{brands.length}</p>
              </div>
              <div className="p-3 rounded-full bg-primary/10">
                <Tag className="size-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Brands Grid */}
      <Card>
        <CardHeader>
          <CardTitle>All Brands ({brands.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {brands.map((brand) => (
              <Card key={brand} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Tag className="size-4 text-primary" />
                        <h3 className="font-semibold text-lg">{brand}</h3>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {Math.floor(Math.random() * 20) + 5} products
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(brand)}
                      >
                        <Edit className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(brand)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {brands.length === 0 && (
            <div className="text-center py-12">
              <Tag className="size-12 mx-auto mb-3 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No brands found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

