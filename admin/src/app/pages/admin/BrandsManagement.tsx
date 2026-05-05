import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../components/ui/dialog';
import { Plus, Pencil, Trash2, Tag, TrendingUp } from 'lucide-react';
import { useBrands } from '../../contexts/BrandContext';
import { toast } from 'sonner';

export function BrandsManagement() {
  const { brands, addBrand, updateBrand, deleteBrand } = useBrands();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<typeof brands[0] | null>(null);
  const [brandName, setBrandName] = useState('');

  const totalProducts = brands.reduce((sum, brand) => sum + (brand.productCount || 0), 0);
  const averageProducts = brands.length > 0 ? Math.round(totalProducts / brands.length) : 0;

  const handleOpenDialog = (brand?: typeof brands[0]) => {
    if (brand) {
      setEditingBrand(brand);
      setBrandName(brand.name);
    } else {
      setEditingBrand(null);
      setBrandName('');
    }
    setDialogOpen(true);
  };

  const handleSaveBrand = async () => {
    if (!brandName.trim() || brandName.trim().length < 2) {
      toast.error('Brand name must be at least 2 characters');
      return;
    }

    // Check for duplicates (case-insensitive)
    const isDuplicate = brands.some(
      (b) => b.name.toLowerCase() === brandName.trim().toLowerCase() && b.id !== editingBrand?.id
    );

    if (isDuplicate) {
      toast.error('A brand with this name already exists');
      return;
    }

    let success: boolean;
    if (editingBrand) {
      success = await updateBrand(editingBrand.id, { ...editingBrand, name: brandName.trim() });
      if (success) {
        toast.success('Brand updated successfully');
      } else {
        toast.error('Failed to update brand');
        return;
      }
    } else {
      success = await addBrand({
        id: Date.now().toString(),
        name: brandName.trim(),
        productCount: 0,
      });
      if (success) {
        toast.success('Brand added successfully');
      } else {
        toast.error('Failed to add brand');
        return;
      }
    }

    setDialogOpen(false);
    setBrandName('');
  };

  const handleDeleteBrand = async (brand: typeof brands[0]) => {
    if (window.confirm(`Are you sure you want to delete "${brand.name}"?`)) {
      const success = await deleteBrand(brand.id);
      if (success) {
        toast.success('Brand deleted successfully');
      } else {
        toast.error('Failed to delete brand');
      }
    }
  };

  const getInitial = (name: string) => name.charAt(0).toUpperCase();

  const getGradientClass = (index: number) => {
    const gradients = [
      'bg-gradient-to-br from-purple-500 to-purple-600',
      'bg-gradient-to-br from-blue-500 to-blue-600',
      'bg-gradient-to-br from-green-500 to-green-600',
      'bg-gradient-to-br from-orange-500 to-orange-600',
      'bg-gradient-to-br from-pink-500 to-pink-600',
      'bg-gradient-to-br from-indigo-500 to-indigo-600',
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Brands Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Total {brands.length} brands
          </p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
        >
          <Plus className="size-4" />
          Add Brand
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Brands</p>
                <h3 className="text-2xl font-bold mt-1">{brands.length}</h3>
              </div>
              <div className="size-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Tag className="size-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Products</p>
                <h3 className="text-2xl font-bold mt-1">{totalProducts}</h3>
              </div>
              <div className="size-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <TrendingUp className="size-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Avg Products/Brand</p>
                <h3 className="text-2xl font-bold mt-1">{averageProducts}</h3>
              </div>
              <div className="size-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <TrendingUp className="size-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Brands Grid */}
      {brands.length === 0 ? (
        <Card>
          <CardContent className="py-16">
            <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
              <Tag className="size-16 mb-4 opacity-50" />
              <p className="text-lg font-medium">No brands found</p>
              <p className="text-sm">Click "Add Brand" to create your first brand</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands.map((brand, index) => (
            <Card key={brand.id}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className={`size-16 rounded-full ${getGradientClass(index)} flex items-center justify-center text-white text-2xl font-bold flex-shrink-0`}>
                    {getInitial(brand.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg truncate">{brand.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {brand.productCount || 0} products
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenDialog(brand)}
                    className="flex-1"
                  >
                    <Pencil className="size-4" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteBrand(brand)}
                    className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="size-4" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingBrand ? 'Edit Brand' : 'Add New Brand'}</DialogTitle>
            <DialogDescription>
              {editingBrand ? 'Update the brand name below' : 'Enter the name for the new brand'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="brandName">Brand Name *</Label>
              <Input
                id="brandName"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="e.g., Fabindia"
                onKeyDown={(e) => e.key === 'Enter' && handleSaveBrand()}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveBrand}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              Save Brand
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
