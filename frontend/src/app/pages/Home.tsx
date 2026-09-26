import { FilterSidebar } from '../components/FilterSidebar';
import { ProductGrid } from '../components/ProductGrid';
import { useProductFilters } from '../hooks/useProductFilters';
import { useProductContext } from '../contexts/ProductContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useSearchParams } from 'react-router';
import { HomeHero } from '../components/HomeHero';

export function Home() {
  usePageTitle();
  const { products, categories, loading, error } = useProductContext();
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
  } = useProductFilters(products, categories);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleToggle = () => setIsFilterOpen(prev => !prev);
    window.addEventListener('toggle-filters', handleToggle);
    return () => window.removeEventListener('toggle-filters', handleToggle);
  }, []);

  useEffect(() => {
    const category = searchParams.get('category');

    setFilters((current) => ({
      ...current,
      selectedCategories: category ? [category] : [],
    }));
  }, [searchParams, setFilters]);

  const isAllProductsView = searchParams.get('view') === 'all';
  const allProductDesigns = products.flatMap((product) => {
    if (!product.variants || product.variants.length === 0) {
      return [product];
    }

    return product.variants.map((variant) => {
      const variantImages = [...variant.images]
        .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary) || a.sortOrder - b.sortOrder)
        .map((image) => image.imageUrl)
        .filter(Boolean);

      return {
        ...product,
        image: variantImages[0] || product.image,
        images: variantImages.length > 0 ? variantImages : product.images,
        variants: [variant],
      };
    });
  });
  const productsForView = isAllProductsView
    ? allProductDesigns
    : searchParams.get('sale') === 'true'
      ? filteredProducts.filter((product) => product.compareAtPrice && product.compareAtPrice > product.price)
      : filteredProducts;
  const searchQuery = searchParams.get('search')?.trim().toLocaleLowerCase() || '';
  const visibleProducts = searchQuery
    ? productsForView.filter((product) =>
        [product.name, product.brand, product.category, product.clothingType]
          .filter(Boolean)
          .some((value) => value?.toLocaleLowerCase().includes(searchQuery)),
      )
    : productsForView;

  return (
    <div className="min-h-screen bg-[#fffdf9]">
      {/* Filter Sidebar */}
      {isFilterOpen && <FilterSidebar
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
      />}
      
      <main className="min-w-0 overflow-x-hidden">
        {!isAllProductsView && <HomeHero />}
        {error ? (
          <div className="flex h-full items-center justify-center p-6">
            <div className="text-center">
              <p className="mb-4 font-semibold text-red-500">Failed to load products</p>
              <p className="text-gray-600 dark:text-gray-300">{error}</p>
            </div>
          </div>
        ) : loading ? (
          <div className="flex h-full items-center justify-center" role="status" aria-label="Loading products">
            <Loader2 className="size-8 animate-spin text-[#3145a5]" />
          </div>
        ) : (
          <section id="collection" aria-labelledby="collection-title" className="scroll-mt-40 py-14 sm:py-20">
            <div className="mx-auto mb-9 flex max-w-[1500px] items-end justify-between px-4 sm:px-8">
              <div>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#9a6444]">Curated for you</p>
                <h2 id="collection-title" className="font-serif text-3xl font-normal tracking-[-0.02em] text-[#2b211c] sm:text-4xl">{searchQuery ? `Search results for “${searchParams.get('search')}”` : isAllProductsView ? 'All Products' : searchParams.get('sale') === 'true' ? 'The Sale Edit' : 'New Arrivals'}</h2>
              </div>
              <p className="hidden text-xs uppercase tracking-[0.16em] text-[#76685f] sm:block">{visibleProducts.length} styles</p>
            </div>
            <ProductGrid products={visibleProducts} />
          </section>
        )}
      </main>
    </div>
  );
}
