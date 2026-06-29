import { FilterSidebar } from '../components/FilterSidebar';
import { ProductGrid } from '../components/ProductGrid';
import { useProductFilters } from '../hooks/useProductFilters';
import { useProductContext } from '../contexts/ProductContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export function Home() {
  usePageTitle();
  const { products, loading, error } = useProductContext();
  const {
    filters,
    setFilters,
    priceRanges,
    filteredProducts,
    brandCounts,
    categoryCounts,
    sizeCounts,
    clothingTypeCounts,
    resetFilters
  } = useProductFilters(products);

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const handleToggle = () => setIsFilterOpen(prev => !prev);
    window.addEventListener('toggle-filters', handleToggle);
    return () => window.removeEventListener('toggle-filters', handleToggle);
  }, []);

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
      {/* Filter Sidebar */}
      <FilterSidebar
        filters={filters}
        onFiltersChange={setFilters}
        priceRanges={priceRanges}
        brandCounts={brandCounts}
        categoryCounts={categoryCounts}
        sizeCounts={sizeCounts}
        clothingTypeCounts={clothingTypeCounts}
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