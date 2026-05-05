import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Plus } from 'lucide-react';

const categories = [
  { id: '1', name: 'Silk', products: 45, color: '#8B5CF6' },
  { id: '2', name: 'Cotton', products: 38, color: '#06B6D4' },
  { id: '3', name: 'Chiffon', products: 25, color: '#10B981' },
  { id: '4', name: 'Georgette', products: 18, color: '#F59E0B' },
  { id: '5', name: 'Velvet', products: 12, color: '#EF4444' },
  { id: '6', name: 'Linen', products: 22, color: '#8B5CF6' },
];

export function Categories() {
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-lg" style={{ backgroundColor: category.color }} />
                <div>
                  <h3 className="font-bold text-lg">{category.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{category.products} products</p>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">Edit Category</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
