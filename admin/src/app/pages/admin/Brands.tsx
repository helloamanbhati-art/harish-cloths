import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Plus } from 'lucide-react';
import { useBrandsAPI } from '../../hooks/useBrandsAPI';

export function Brands() {
  const { brands, loading, error } = useBrandsAPI();

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

      {loading && (
        <div className="flex items-center justify-center p-8">
          <div className="text-gray-500 dark:text-gray-400">Loading brands...</div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 p-4 rounded-lg">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {!loading && brands.length === 0 && !error && (
        <div className="flex items-center justify-center p-8">
          <div className="text-gray-500 dark:text-gray-400">No brands found</div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brands.map((brand) => (
          <Card key={brand._id}>
            <CardContent className="pt-6">
              {brand.logo && (
                <img src={brand.logo} alt={brand.name} className="w-full h-32 object-cover rounded-lg mb-4" />
              )}
              <h3 className="font-bold text-lg">{brand.name}</h3>
              {brand.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{brand.description}</p>
              )}
              <div className="mt-4 space-y-2">
                {brand.products && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Products</span>
                    <span className="font-medium">{brand.products}</span>
                  </div>
                )}
                {brand.revenue && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Revenue</span>
                    <span className="font-medium">₹{brand.revenue.toLocaleString()}</span>
                  </div>
                )}
              </div>
              <Button variant="outline" className="w-full mt-4">Edit Brand</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
