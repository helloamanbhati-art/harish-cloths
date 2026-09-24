import { Product } from '../types/product';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-96 p-4">
        <div className="text-center space-y-4">
          <div className="text-6xl">😔</div>
          <h2 className="text-xl font-medium">No items match your filters</h2>
          <p className="text-muted-foreground text-sm md:text-base">
            Try adjusting your price range or selecting different brands
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-6">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
        {products.map((product, index) => (
          <ProductCard key={`${product.id}-${product.variants?.[0]?.variantId || index}`} product={product} />
        ))}
      </div>
    </div>
  );
}
