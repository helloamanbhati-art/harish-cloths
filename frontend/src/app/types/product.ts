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
}

export interface FilterState {
  priceRange: [number, number];
  selectedBrands: string[];
}

export interface BrandCount {
  brand: string;
  count: number;
}