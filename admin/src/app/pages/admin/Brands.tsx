import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Plus } from 'lucide-react';

const brands = [
  { id: '1', name: 'Banarasi Elite', products: 12, revenue: 145000 },
  { id: '2', name: 'Traditional Weaves', products: 8, revenue: 98000 },
  { id: '3', name: 'Modern Fabrics', products: 15, revenue: 178000 },
  { id: '4', name: 'South Silks', products: 10, revenue: 132000 },
];

export function Brands() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Brands</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage fabric brands</p>
        </div>
        <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
          <Plus className="size-4" />
          Add Brand
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brands.map((brand) => (
          <Card key={brand.id}>
            <CardContent className="pt-6">
              <h3 className="font-bold text-lg">{brand.name}</h3>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Products</span>
                  <span className="font-medium">{brand.products}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Revenue</span>
                  <span className="font-medium">₹{brand.revenue.toLocaleString()}</span>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">Edit Brand</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
