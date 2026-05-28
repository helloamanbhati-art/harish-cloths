import { useState, useMemo, useEffect } from 'react';
import { Product, FilterState, BrandCount, CategoryCount, ClothingTypeCount, PriceRange } from '../types/product';

const defaultFilterRange: [number, number] = [0, 25000];

const formatPrice = (value: number) => `₹${value.toLocaleString('en-IN')}`;

const computePriceRanges = (products: Product[]): PriceRange[] => {
  if (products.length === 0) {
    return [{ label: 'All prices', min: 0, max: 25000 }];
  }

  const prices = products.map((product) => product.price).sort((a, b) => a - b);
  const minPrice = prices[0];
  const maxPrice = prices[prices.length - 1];
  const rangeWidth = Math.max(1, Math.ceil((maxPrice - minPrice) / 4));

  return Array.from({ length: 4 }, (_, index) => {
    const min = minPrice + index * rangeWidth;
    const max = index === 3 ? maxPrice : min + rangeWidth - 1;
    const label = index === 0
      ? `${formatPrice(min)} - ${formatPrice(max)}`
      : index === 3
        ? `${formatPrice(min)} and above`
        : `${formatPrice(min)} - ${formatPrice(max)}`;

    return { label, min, max };
  });
};

const initialFilters: FilterState = {
  priceRange: defaultFilterRange,
  selectedBrands: [],
  selectedCategories: [],
  selectedSizes: [],
  selectedClothingTypes: [],
};

export function useProductFilters(products: Product[]) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const brands = useMemo(
    () => Array.from(new Set(products.map((product) => product.brand))).sort(),
    [products]
  );

  const categories = useMemo(
    () => Array.from(new Set(products.map((product) => product.category))).sort(),
    [products]
  );

  const priceRanges = useMemo(() => computePriceRanges(products), [products]);

  const defaultProductRange = useMemo(() => {
    if (!products.length) {
      return defaultFilterRange;
    }

    const prices = products.map((product) => product.price);
    return [Math.min(...prices), Math.max(...prices)] as [number, number];
  }, [products]);

  useEffect(() => {
    if (
      products.length > 0 &&
      filters.priceRange[0] === defaultFilterRange[0] &&
      filters.priceRange[1] === defaultFilterRange[1]
    ) {
      setFilters((prev) => ({ ...prev, priceRange: defaultProductRange }));
    }
  }, [defaultProductRange, filters.priceRange, products.length]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Price filter
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false;
      }

      // Brand filter
      if (filters.selectedBrands.length > 0 && !filters.selectedBrands.includes(product.brand)) {
        return false;
      }

      // Category filter
      if (filters.selectedCategories.length > 0 && !filters.selectedCategories.includes(product.category)) {
        return false;
      }

      // Size filter
      if (filters.selectedSizes.length > 0) {
        const productSizes = product.availableSizes || [];
        const hasSelectedSize = filters.selectedSizes.some(size => productSizes.includes(size));
        if (!hasSelectedSize) {
          return false;
        }
      }

      // Clothing type filter
      if (filters.selectedClothingTypes.length > 0) {
        const type = product.clothingType || '';
        if (!type || !filters.selectedClothingTypes.includes(type)) {
          return false;
        }
      }

      return true;
    });
  }, [products, filters]);

  const brandCounts = useMemo((): BrandCount[] => {
    return brands.map(brand => {
      const count = products.filter(product => {
        const matchesPrice = product.price >= filters.priceRange[0] && 
                            product.price <= filters.priceRange[1];
        const matchesCategory = filters.selectedCategories.length === 0 || filters.selectedCategories.includes(product.category);
        return matchesPrice && matchesCategory && product.brand === brand;
      }).length;

      return { brand, count };
    });
  }, [products, filters.priceRange, filters.selectedCategories, brands]);

  const categoryCounts = useMemo((): CategoryCount[] => {
    return categories.map(category => {
      const count = products.filter(product => {
        const matchesPrice = product.price >= filters.priceRange[0] && 
                            product.price <= filters.priceRange[1];
        const matchesBrand = filters.selectedBrands.length === 0 || filters.selectedBrands.includes(product.brand);
        return matchesPrice && matchesBrand && product.category === category;
      }).length;

      return { category, count };
    });
  }, [products, filters.priceRange, filters.selectedBrands, categories]);

  const sizeCounts = useMemo(() => {
    const allSizes = new Set<string>();
    products.forEach(product => {
      if (product.availableSizes) {
        product.availableSizes.forEach(size => allSizes.add(size));
      }
    });

    return Array.from(allSizes).sort().map(size => {
      const count = products.filter(product => {
        const matchesPrice = product.price >= filters.priceRange[0] && 
                            product.price <= filters.priceRange[1];
        const matchesBrand = filters.selectedBrands.length === 0 || filters.selectedBrands.includes(product.brand);
        const matchesCategory = filters.selectedCategories.length === 0 || filters.selectedCategories.includes(product.category);
        const hasSize = product.availableSizes?.includes(size);
        return matchesPrice && matchesBrand && matchesCategory && hasSize;
      }).length;

      return { size, count };
    });
  }, [products, filters.priceRange, filters.selectedBrands, filters.selectedCategories]);

  const clothingTypeCounts = useMemo((): ClothingTypeCount[] => {
    const allTypes = Array.from(
      new Set(products.map((product) => product.clothingType).filter(Boolean))
    ) as string[];

    return allTypes.sort().map((type) => {
      const count = products.filter((product) => {
        const matchesPrice =
          product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
        const matchesBrand =
          filters.selectedBrands.length === 0 || filters.selectedBrands.includes(product.brand);
        const matchesCategory =
          filters.selectedCategories.length === 0 ||
          filters.selectedCategories.includes(product.category);
        const matchesSize =
          filters.selectedSizes.length === 0 ||
          filters.selectedSizes.some((size) => product.availableSizes?.includes(size));
        return (
          matchesPrice &&
          matchesBrand &&
          matchesCategory &&
          matchesSize &&
          product.clothingType === type
        );
      }).length;

      return { type, count };
    });
  }, [
    products,
    filters.priceRange,
    filters.selectedBrands,
    filters.selectedCategories,
    filters.selectedSizes,
  ]);

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  return {
    filters,
    setFilters,
    priceRanges,
    filteredProducts,
    brandCounts,
    categoryCounts,
    sizeCounts,
    clothingTypeCounts,
    resetFilters
  };
}