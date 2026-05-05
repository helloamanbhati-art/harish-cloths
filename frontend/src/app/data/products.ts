// Products data is now fetched from real API
// This file is kept for compatibility and type definitions

export const products: any[] = [];

export const luxuryBrands: string[] = [];

export const priceRanges = [
  { label: 'Under ₹400', min: 0, max: 399 },
  { label: '₹400-₹600', min: 400, max: 600 },
  { label: '₹600-₹900', min: 600, max: 900 },
  { label: '₹900-₹1000', min: 900, max: 2500 }
];

// NOTE: All product data is now fetched from the real backend API
// See ProductContext and useProducts hook for API integration

