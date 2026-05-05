import { FilterState, BrandCount } from '../types/product';
import { priceRanges } from '../data/products';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { X } from 'lucide-react';
import { useEffect } from 'react';

interface FilterSidebarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  brandCounts: BrandCount[];
  onResetFilters: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export function FilterSidebar({ 
  filters, 
  onFiltersChange, 
  brandCounts, 
  onResetFilters,
  isOpen,
  onClose
}: FilterSidebarProps) {
  // Prevent body scroll when mobile filter is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handlePredefinedRangeClick = (min: number, max: number) => {
    onFiltersChange({
      ...filters,
      priceRange: [min, max]
    });
  };

  const handleBrandToggle = (brand: string) => {
    const updatedBrands = filters.selectedBrands.includes(brand)
      ? filters.selectedBrands.filter(b => b !== brand)
      : [...filters.selectedBrands, brand];
    
    onFiltersChange({
      ...filters,
      selectedBrands: updatedBrands
    });
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:sticky inset-y-0 md:top-0 left-0 z-50
        w-80 md:w-64 bg-card border-r
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        overflow-y-auto
        h-screen md:h-[calc(100vh-73px)]
      `}>
        <div className="p-6 md:p-4 space-y-6 md:space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg md:text-base font-semibold">Filters</h2>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onResetFilters}
                className="text-xs md:text-xs px-2 md:px-3"
              >
                Reset
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="md:hidden"
              >
                <X className="size-4" />
              </Button>
            </div>
          </div>

          <Separator />

          {/* Price Filter */}
          <div className="space-y-3 md:space-y-2">
            <h3 className="text-sm font-medium">Price Range</h3>
            
            {/* Predefined Ranges */}
            <div className="space-y-2">
              <div className="grid grid-cols-1 gap-2">
                {priceRanges.map((range, index) => (
                  <Button
                    key={index}
                    variant={
                      filters.priceRange[0] === range.min && filters.priceRange[1] === range.max
                        ? 'default'
                        : 'outline'
                    }
                    size="sm"
                    onClick={() => handlePredefinedRangeClick(range.min, range.max)}
                    className="text-xs h-8 justify-start"
                  >
                    {range.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          {/* Brand Filter */}
          <div className="space-y-3 md:space-y-2">
            <h3 className="text-sm font-medium">Brands</h3>
            <div className="space-y-2.5 md:space-y-2">
              {brandCounts.map((brandCount) => (
                <div key={brandCount.brand} className="flex items-center space-x-2.5 md:space-x-2">
                  <Checkbox
                    id={brandCount.brand}
                    checked={filters.selectedBrands.includes(brandCount.brand)}
                    onCheckedChange={() => handleBrandToggle(brandCount.brand)}
                  />
                  <label 
                    htmlFor={brandCount.brand}
                    className="flex-1 text-sm cursor-pointer flex items-center justify-between"
                  >
                    <span className="text-xs md:text-xs">{brandCount.brand}</span>
                    <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
                      {brandCount.count}
                    </Badge>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}