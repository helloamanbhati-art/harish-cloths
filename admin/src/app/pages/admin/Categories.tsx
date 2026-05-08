import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Plus } from 'lucide-react';
import { useCategoriesAPI } from '../../hooks/useCategoriesAPI';

const DEFAULT_COLORS = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#EC4899'];

export function Categories() {
  const { categories, loading, error } = useCategoriesAPI();

  const getColorForCategory = (category: any) => {
    return category.color || DEFAULT_COLORS[Math.floor(Math.random() * DEFAULT_COLORS.length)];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Organize your fabric types</p>
        </div>
        <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
          <Plus className="size-4" />
          Add Category
        </Button>
      </div>

      {loading && (
        <div className="flex items-center justify-center p-8">
          <div className="text-gray-500 dark:text-gray-400">Loading categories...</div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 p-4 rounded-lg">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {!loading && categories.length === 0 && !error && (
        <div className="flex items-center justify-center p-8">
          <div className="text-gray-500 dark:text-gray-400">No categories found</div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category._id}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-lg" style={{ backgroundColor: getColorForCategory(category) }} />
                <div>
                  <h3 className="font-bold text-lg">{category.name}</h3>
                  {category.products ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400">{category.products} products</p>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">No products yet</p>
                  )}
                </div>
              </div>
              {category.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">{category.description}</p>
              )}
              <Button variant="outline" className="w-full mt-4">Edit Category</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
