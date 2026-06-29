import { FilterState, BrandCount, CategoryCount, ClothingTypeCount } from '../types/product';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { X } from 'lucide-react';
import { useEffect } from 'react';

interface SizeCount {
  size: string;
  count: number;
}

interface FilterSidebarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  priceRanges: { label: string; min: number; max: number; }[];
  brandCounts: BrandCount[];
  categoryCounts: CategoryCount[];
  sizeCounts?: SizeCount[];
  clothingTypeCounts?: ClothingTypeCount[];
  onResetFilters: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export function FilterSidebar({ 
  filters, 
  onFiltersChange, 
  priceRanges,
  brandCounts, 
  categoryCounts,
  sizeCounts = [],
  clothingTypeCounts = [],
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

  const handleCategoryToggle = (category: string) => {
    const updatedCategories = filters.selectedCategories.includes(category)
      ? filters.selectedCategories.filter(c => c !== category)
      : [...filters.selectedCategories, category];

    onFiltersChange({
      ...filters,
      selectedCategories: updatedCategories
    });
  };

  const handleSizeToggle = (size: string) => {
    const updatedSizes = filters.selectedSizes.includes(size)
      ? filters.selectedSizes.filter(s => s !== size)
      : [...filters.selectedSizes, size];

    onFiltersChange({
      ...filters,
      selectedSizes: updatedSizes
    });
  };

  const handleClothingTypeToggle = (type: string) => {
    const updatedTypes = filters.selectedClothingTypes.includes(type)
      ? filters.selectedClothingTypes.filter((t) => t !== type)
      : [...filters.selectedClothingTypes, type];

    onFiltersChange({
      ...filters,
      selectedClothingTypes: updatedTypes,
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

          {/* Category Filter */}
          <div className="space-y-3 md:space-y-2">
            <h3 className="text-sm font-medium">Categories</h3>
            <div className="space-y-2.5 md:space-y-2">
              {categoryCounts.map((categoryCount) => (
                <div key={categoryCount.category} className="flex items-center space-x-2.5 md:space-x-2">
                  <Checkbox
                    id={categoryCount.category}
                    checked={filters.selectedCategories.includes(categoryCount.category)}
                    onCheckedChange={() => handleCategoryToggle(categoryCount.category)}
                  />
                  <label 
                    htmlFor={categoryCount.category}
                    className="flex-1 text-sm cursor-pointer flex items-center justify-between"
                  >
                    <span className="text-xs md:text-xs">{categoryCount.category}</span>
                    <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
                      {categoryCount.count}
                    </Badge>
                  </label>
                </div>
              ))}
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
                    className="text-sm cursor-pointer"
                  >
                    {brandCount.brand}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Size Filter */}
          {sizeCounts && sizeCounts.length > 0 && (
            <>
              <div className="space-y-3 md:space-y-2">
                <h3 className="text-sm font-medium">Sizes</h3>
                <div className="flex flex-wrap gap-2">
                  {sizeCounts.map((sizeCount) => (
                    <Button
                      key={sizeCount.size}
                      variant={filters.selectedSizes.includes(sizeCount.size) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleSizeToggle(sizeCount.size)}
                      className="text-xs h-8 px-2.5"
                      disabled={sizeCount.count === 0}
                    >
                      {sizeCount.size}
                      {sizeCount.count > 0 && (
                        <Badge variant="secondary" className="ml-1 text-[10px] px-1">
                          {sizeCount.count}
                        </Badge>
                      )}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />
            </>
          )}

          {clothingTypeCounts && clothingTypeCounts.length > 0 && (
            <>
              <div className="space-y-3 md:space-y-2">
                <h3 className="text-sm font-medium">Clothing Type</h3>
                <div className="space-y-2.5 md:space-y-2">
                  {clothingTypeCounts.map((typeCount) => (
                    <div key={typeCount.type} className="flex items-center space-x-2.5 md:space-x-2">
                      <Checkbox
                        id={`type-${typeCount.type}`}
                        checked={filters.selectedClothingTypes.includes(typeCount.type)}
                        onCheckedChange={() => handleClothingTypeToggle(typeCount.type)}
                      />
                      <label
                        htmlFor={`type-${typeCount.type}`}
                        className="flex-1 text-sm cursor-pointer flex items-center justify-between"
                      >
                        <span className="text-xs md:text-xs capitalize">{typeCount.type}</span>
                        <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
                          {typeCount.count}
                        </Badge>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />
            </>
          )}
        </div>
      </div>
    </>
  );
}