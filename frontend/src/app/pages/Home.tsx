import { FilterSidebar } from '../components/FilterSidebar';
import { ProductGrid } from '../components/ProductGrid';
import { useProductFilters } from '../hooks/useProductFilters';
import { useProductContext } from '../contexts/ProductContext';
import { useState } from 'react';
import { Button } from '../components/ui/button';
import { SlidersHorizontal, Loader2 } from 'lucide-react';

export function Home() {
  const { products, loading, error } = useProductContext();
  const {
    filters,
    setFilters,
    priceRanges,
    filteredProducts,
    brandCounts,
    categoryCounts,
    resetFilters
  } = useProductFilters(products);

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-73px)]">
        <div className="text-center">
          <p className="text-red-500 font-semibold mb-4">Failed to load products</p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-73px)]">
        <Loader2 className="size-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-73px)]">
      {/* Mobile Filter Button */}
      <div className="md:hidden p-4 border-b">
        <Button 
          variant="outline" 
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="w-full"
        >
          <SlidersHorizontal className="size-4 mr-2" />
          Filters & Sorting
        </Button>
      </div>

      {/* Filter Sidebar */}
      <FilterSidebar
        filters={filters}
        onFiltersChange={setFilters}
        priceRanges={priceRanges}
        brandCounts={brandCounts}
        categoryCounts={categoryCounts}
        onResetFilters={resetFilters}
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />
      
      <div className="flex-1 overflow-y-auto">
        <ProductGrid products={filteredProducts} />
      </div>
    </div>
  );
}