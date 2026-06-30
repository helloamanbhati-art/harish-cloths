export interface VariantImage {
  imageUrl: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface ProductVariant {
  variantId: string;
  variantName: string;
  images: VariantImage[];
}

export interface SelectedVariantSnapshot {
  variantId: string;
  variantName: string;
  color: string | null;
  pattern: string | null;
  sku: string | null;
  thumbnail: string | null;
  primaryImage: string | null;
  galleryImages: string[];
  priceAtPurchase: number;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  images: string[]; // Legacy
  colors?: string[]; // Legacy
  variants?: ProductVariant[]; // New variants system
  category: string;
  description: string;
  soldBy: 'meter' | 'piece'; // How the product is sold
  availableSizes?: string[]; // Available sizes for this product
  clothingType?: string; // Type of clothing (shirt, jeans, etc)
  additionalChargeName?: string; // Custom charge label set by admin (e.g., "Ordna", "Stitching")
  additionalChargeAmount?: number; // Additional charge amount per piece
  isFlatPrice?: boolean; // If true, do not multiply price by selected meters
  compareAtPrice?: number; // Price for 5 meters package
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