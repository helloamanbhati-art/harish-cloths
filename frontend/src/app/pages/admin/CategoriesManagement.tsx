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
import { Plus, Edit, Trash2, Layers } from 'lucide-react';
import { products } from '../../data/products';
import { toast } from 'sonner';

export function CategoriesManagement() {
  const initialCategories = Array.from(new Set(products.map((p) => p.category)));
  const [categories, setCategories] = useState<string[]>(initialCategories);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingCategory) {
      // Update existing category
      setCategories(categories.map((c) => (c === editingCategory ? categoryName : c)));
      toast.success('Category updated successfully!');
    } else {
      // Add new category
      if (categories.includes(categoryName)) {
        toast.error('Category already exists!');
        return;
      }
      setCategories([...categories, categoryName]);
      toast.success('Category added successfully!');
    }

    setCategoryName('');
    setIsAddDialogOpen(false);
    setEditingCategory(null);
  };

  const handleEdit = (category: string) => {
    setEditingCategory(category);
    setCategoryName(category);
    setIsAddDialogOpen(true);
  };

  const handleDelete = (category: string) => {
    if (confirm(`Are you sure you want to delete "${category}"?`)) {
      setCategories(categories.filter((c) => c !== category));
      toast.success('Category deleted successfully!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Categories Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage fabric categories and classifications
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingCategory(null);
                setCategoryName('');
              }}
            >
              <Plus className="size-4 mr-2" />
              Add New Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </DialogTitle>
              <DialogDescription>
                {editingCategory
                  ? 'Update the category name below'
                  : 'Enter a new category name for your products'}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="categoryName">Category Name *</Label>
                <Input
                  id="categoryName"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="e.g., Silk, Cotton, Chiffon"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  {editingCategory ? 'Update Category' : 'Add Category'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    setEditingCategory(null);
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
                  Total Categories
                </p>
                <p className="text-3xl font-bold mt-2">{categories.length}</p>
              </div>
              <div className="p-3 rounded-full bg-purple/10">
                <Layers className="size-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categories Grid */}
      <Card>
        <CardHeader>
          <CardTitle>All Categories ({categories.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const productCount = products.filter(p => p.category === category).length;
              
              return (
                <Card key={category} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Layers className="size-4 text-purple-600" />
                          <h3 className="font-semibold text-lg">{category}</h3>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {productCount} products
                        </Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(category)}
                        >
                          <Edit className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(category)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {categories.length === 0 && (
            <div className="text-center py-12">
              <Layers className="size-12 mx-auto mb-3 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No categories found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

