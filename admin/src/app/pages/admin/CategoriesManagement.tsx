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
  DialogFooter,
} from '../../components/ui/dialog';
import { Plus, Pencil, Trash2, Layers, Package, TrendingUp } from 'lucide-react';
import { useCategories } from '../../contexts/CategoryContext';
import { toast } from 'sonner';

export function CategoriesManagement() {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<typeof categories[0] | null>(null);
  const [categoryName, setCategoryName] = useState('');

  const totalProducts = categories.reduce((sum, cat) => sum + (cat.productCount || 0), 0);
  const averageProducts = categories.length > 0 ? Math.round(totalProducts / categories.length) : 0;

  const handleOpenDialog = (category?: typeof categories[0]) => {
    if (category) {
      setEditingCategory(category);
      setCategoryName(category.name);
    } else {
      setEditingCategory(null);
      setCategoryName('');
    }
    setDialogOpen(true);
  };

  const handleSaveCategory = async () => {
    if (!categoryName.trim()) {
      toast.error('Category name is required');
      return;
    }

    // Check for duplicates (case-insensitive)
    const isDuplicate = categories.some(
      (c) => c.name.toLowerCase() === categoryName.trim().toLowerCase() && c.id !== editingCategory?.id
    );

    if (isDuplicate) {
      toast.error('A category with this name already exists');
      return;
    }

    let success: boolean;
    if (editingCategory) {
      success = await updateCategory(editingCategory.id, { ...editingCategory, name: categoryName.trim() });
      if (success) {
        toast.success('Category updated successfully');
      } else {
        toast.error('Failed to update category');
        return;
      }
    } else {
      success = await addCategory({
        id: Date.now().toString(),
        name: categoryName.trim(),
        productCount: 0,
      });
      if (success) {
        toast.success('Category added successfully');
      } else {
        toast.error('Failed to add category');
        return;
      }
    }

    setDialogOpen(false);
    setCategoryName('');
  };

  const handleDeleteCategory = async (category: typeof categories[0]) => {
    const hasProducts = (category.productCount || 0) > 0;
    const message = hasProducts
      ? `"${category.name}" has ${category.productCount} products assigned to it. Are you sure you want to delete this category?`
      : `Are you sure you want to delete "${category.name}"?`;

    if (window.confirm(message)) {
      const success = await deleteCategory(category.id);
      if (success) {
        toast.success('Category deleted successfully');
      } else {
        toast.error('Failed to delete category');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categories Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Total {categories.length} categories
          </p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
        >
          <Plus className="size-4" />
          Add Category
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Categories</p>
                <h3 className="text-2xl font-bold mt-1">{categories.length}</h3>
              </div>
              <div className="size-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Layers className="size-6 text-purple-600 dark:text-purple-400" />
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
                <Package className="size-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Avg Products/Category</p>
                <h3 className="text-2xl font-bold mt-1">{averageProducts}</h3>
              </div>
              <div className="size-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <TrendingUp className="size-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categories Table */}
      <Card>
        <CardContent className="p-0">
          {categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500 dark:text-gray-400">
              <Layers className="size-16 mb-4 opacity-50" />
              <p className="text-lg font-medium">No categories found</p>
              <p className="text-sm">Click "Add Category" to create your first category</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400 w-16">#</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Category Name</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Product Count</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category, index) => (
                    <tr key={category.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="py-3 px-4 text-gray-500 dark:text-gray-400">{index + 1}</td>
                      <td className="py-3 px-4">
                        <span className="font-medium">{category.name}</span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={
                          (category.productCount || 0) > 20
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                            : (category.productCount || 0) > 10
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }>
                          {category.productCount || 0} products
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(category)}
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteCategory(category)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
            <DialogDescription>
              {editingCategory ? 'Update the category name below' : 'Enter the name for the new category'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="categoryName">Category Name *</Label>
              <Input
                id="categoryName"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="e.g., Silk"
                onKeyDown={(e) => e.key === 'Enter' && handleSaveCategory()}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveCategory}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              Save Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
