export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  images: string[]; // Multiple product images
  category: string;
  description: string;
  soldBy: 'meter' | 'piece'; // How the product is sold
  availableSizes?: string[]; // Available sizes for this product
  clothingType?: string; // Type of clothing (shirt, jeans, etc)
}

export interface FilterState {
  priceRange: [number, number];
  selectedBrands: string[];
  selectedCategories: string[];
  selectedSizes: string[];
  selectedClothingTypes: string[];
}

export interface PriceRange {
  label: string;
  min: number;
  max: number;
}

export interface BrandCount {
  brand: string;
  count: number;
}

export interface CategoryCount {
  category: string;
  count: number;
}

export interface ClothingTypeCount {
  type: string;
  count: number;
}