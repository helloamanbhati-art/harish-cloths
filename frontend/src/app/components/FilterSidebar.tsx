import { useEffect, useState, type ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router';
import {
  BadgePercent,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Grid2X2,
  House,
  Info,
  Layers3,
  LockKeyhole,
  Mail,
  PackageSearch,
  RotateCcw,
  Ruler,
  Shirt,
  Tags,
  Truck,
  X,
} from 'lucide-react';
import { FilterState, BrandCount, CategoryCount, ClothingTypeCount } from '../types/product';
import { Button } from './ui/button';

interface SizeCount {
  size: string;
  count: number;
}

interface FilterSidebarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  priceRanges: { label: string; min: number; max: number }[];
  brandCounts: BrandCount[];
  categoryCounts: CategoryCount[];
  sizeCounts?: SizeCount[];
  clothingTypeCounts?: ClothingTypeCount[];
  onResetFilters: () => void;
  isOpen: boolean;
  onClose: () => void;
}

interface MenuGroupProps {
  icon: typeof Layers3;
  label: string;
  open: boolean;
  collapsed: boolean;
  onToggle: () => void;
  children: ReactNode;
}

function MenuGroup({ icon: Icon, label, open, collapsed, onToggle, children }: MenuGroupProps) {
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        title={collapsed ? label : undefined}
        className={`flex h-10 w-full items-center rounded-lg px-3 text-gray-800 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3145a5] dark:text-gray-200 dark:hover:bg-gray-700 ${collapsed ? 'md:justify-center md:px-0' : ''}`}
      >
        <Icon className="size-[18px] shrink-0" aria-hidden="true" />
        <span className={`ml-3 text-sm font-medium ${collapsed ? 'md:sr-only' : ''}`}>{label}</span>
        <ChevronDown
          className={`ml-auto size-4 transition-transform ${open ? 'rotate-180' : ''} ${collapsed ? 'md:hidden' : ''}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          className={`relative ml-5 space-y-0.5 py-1 pl-5
            before:absolute before:bottom-[22px] before:left-0 before:top-1 before:w-px before:bg-gray-800
            [&>*]:relative [&>*]:before:pointer-events-none [&>*]:before:absolute [&>*]:before:-left-5 [&>*]:before:top-1/2
            [&>*]:before:h-2 [&>*]:before:w-3 [&>*]:before:-translate-y-2 [&>*]:before:rounded-bl-lg
            [&>*]:before:border-b [&>*]:before:border-l [&>*]:before:border-gray-800
            dark:before:bg-gray-200 dark:[&>*]:before:border-gray-200 ${collapsed ? 'md:hidden' : ''}`}
        >
          {children}
        </div>
      )}
    </div>
  );
}

interface SidebarLinkProps {
  to: string;
  label: string;
  icon: typeof House;
  collapsed: boolean;
  onClick: () => void;
  active?: boolean;
}

function SidebarLink({ to, label, icon: Icon, collapsed, onClick, active = false }: SidebarLinkProps) {
  return (
    <Link
      to={to}
      onClick={onClick}
      title={collapsed ? label : undefined}
      aria-current={active ? 'page' : undefined}
      className={`flex min-h-10 items-center rounded-lg px-3 text-gray-800 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3145a5] dark:text-gray-200 dark:hover:bg-gray-700 ${collapsed ? 'md:justify-center md:px-0' : ''} ${active ? 'bg-[#f0f1f3] font-semibold text-gray-900 dark:bg-gray-700 dark:text-gray-100' : ''}`}
    >
      <Icon className="size-[18px] shrink-0" aria-hidden="true" />
      <span className={`ml-3 text-sm ${active ? 'font-semibold' : 'font-medium'} ${collapsed ? 'md:sr-only' : ''}`}>{label}</span>
    </Link>
  );
}

const submenuButtonClass =
  'flex w-full items-center justify-between gap-2 rounded-md px-1 py-2 text-left text-sm font-medium text-gray-800 transition-colors hover:text-[#3145a5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3145a5] dark:text-gray-200';

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
  onClose,
}: FilterSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(true);
  const [sizesOpen, setSizesOpen] = useState(false);
  const [typesOpen, setTypesOpen] = useState(false);
  const [brandsOpen, setBrandsOpen] = useState(false);
  const [pricesOpen, setPricesOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const isSaleView = searchParams.get('sale') === 'true';
  const isAllProductsView = searchParams.get('view') === 'all';
  const isDefaultView = !isSaleView && !isAllProductsView && !searchParams.get('category');

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handlePredefinedRangeClick = (min: number, max: number) => {
    onFiltersChange({ ...filters, priceRange: [min, max] });
  };

  const handleBrandToggle = (brand: string) => {
    const selectedBrands = filters.selectedBrands.includes(brand)
      ? filters.selectedBrands.filter((item) => item !== brand)
      : [...filters.selectedBrands, brand];
    onFiltersChange({ ...filters, selectedBrands });
  };

  const handleCategoryToggle = (category: string) => {
    const selectedCategories = filters.selectedCategories.includes(category)
      ? filters.selectedCategories.filter((item) => item !== category)
      : [...filters.selectedCategories, category];
    onFiltersChange({ ...filters, selectedCategories });
  };

  const handleSizeToggle = (size: string) => {
    const selectedSizes = filters.selectedSizes.includes(size)
      ? filters.selectedSizes.filter((item) => item !== size)
      : [...filters.selectedSizes, size];
    onFiltersChange({ ...filters, selectedSizes });
  };

  const handleClothingTypeToggle = (type: string) => {
    const selectedClothingTypes = filters.selectedClothingTypes.includes(type)
      ? filters.selectedClothingTypes.filter((item) => item !== type)
      : [...filters.selectedClothingTypes, type];
    onFiltersChange({ ...filters, selectedClothingTypes });
  };

  const handleAllProductsClick = () => {
    onResetFilters();
    onClose();
  };

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-60 border-r border-gray-200 bg-white transition-[width,transform] duration-300 ease-in-out dark:border-gray-700 dark:bg-gray-900 md:sticky md:top-0 md:z-20 md:h-[calc(100vh-73px)]
          ${collapsed ? 'md:w-[76px]' : 'md:w-60'}
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
        aria-label="Shop navigation and filters"
      >
        <nav className="relative flex h-full flex-col overflow-visible px-3 py-4">
          <div className="mb-2 flex items-center justify-between md:hidden">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">Menu</span>
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close menu">
              <X className="size-5" />
            </Button>
          </div>

          <div className="min-h-0 flex-1 space-y-1 overflow-y-auto overflow-x-hidden pr-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <p className={`px-3 pb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400 ${collapsed ? 'md:sr-only' : ''}`}>Shop</p>
            <SidebarLink to="/" label="Home" icon={House} collapsed={collapsed} onClick={onClose} active={isDefaultView} />
            <SidebarLink to="/?view=all" label="All Products" icon={Grid2X2} collapsed={collapsed} onClick={handleAllProductsClick} active={isAllProductsView} />

            <MenuGroup
              icon={Layers3}
              label="Shop by Category"
              open={categoriesOpen}
              collapsed={collapsed}
              onToggle={() => setCategoriesOpen((open) => !open)}
            >
              {categoryCounts.map(({ category, count }) => {
                const selected = filters.selectedCategories.includes(category);
                return (
                  <button
                    type="button"
                    key={category}
                    onClick={() => handleCategoryToggle(category)}
                    aria-pressed={selected}
                    className={`${submenuButtonClass} ${selected ? 'font-semibold text-[#3145a5] dark:text-indigo-300' : ''}`}
                  >
                    <span className="truncate">{category}</span>
                    <span className="text-xs text-gray-400">{count}</span>
                  </button>
                );
              })}
            </MenuGroup>

            <SidebarLink to="/?sale=true" label="Sale" icon={BadgePercent} collapsed={collapsed} onClick={onClose} active={isSaleView} />

            <div className={`my-3 border-t border-gray-200 dark:border-gray-700 ${collapsed ? 'md:mx-2' : ''}`} />
            <p className={`px-3 pb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400 ${collapsed ? 'md:sr-only' : ''}`}>Shop filters</p>

            {sizeCounts.length > 0 && (
              <MenuGroup
                icon={Ruler}
                label="Sizes"
                open={sizesOpen}
                collapsed={collapsed}
                onToggle={() => setSizesOpen((open) => !open)}
              >
                {sizeCounts.map(({ size, count }) => {
                  const selected = filters.selectedSizes.includes(size);
                  return (
                    <button
                      type="button"
                      key={size}
                      onClick={() => handleSizeToggle(size)}
                      aria-pressed={selected}
                      disabled={count === 0}
                      className={`${submenuButtonClass} disabled:opacity-40 ${selected ? 'font-semibold text-[#3145a5] dark:text-indigo-300' : ''}`}
                    >
                      <span>{size}</span>
                      <span className="text-xs text-gray-400">{count}</span>
                    </button>
                  );
                })}
              </MenuGroup>
            )}

            {clothingTypeCounts.length > 0 && (
              <MenuGroup
                icon={Shirt}
                label="Clothing"
                open={typesOpen}
                collapsed={collapsed}
                onToggle={() => setTypesOpen((open) => !open)}
              >
                {clothingTypeCounts.map(({ type, count }) => {
                  const selected = filters.selectedClothingTypes.includes(type);
                  return (
                    <button
                      type="button"
                      key={type}
                      onClick={() => handleClothingTypeToggle(type)}
                      aria-pressed={selected}
                      className={`${submenuButtonClass} capitalize ${selected ? 'font-semibold text-[#3145a5] dark:text-indigo-300' : ''}`}
                    >
                      <span className="truncate">{type}</span>
                      <span className="text-xs text-gray-400">{count}</span>
                    </button>
                  );
                })}
              </MenuGroup>
            )}

            {brandCounts.length > 0 && (
              <MenuGroup
                icon={Tags}
                label="Brands"
                open={brandsOpen}
                collapsed={collapsed}
                onToggle={() => setBrandsOpen((open) => !open)}
              >
                {brandCounts.map(({ brand, count }) => {
                  const selected = filters.selectedBrands.includes(brand);
                  return (
                    <button
                      type="button"
                      key={brand}
                      onClick={() => handleBrandToggle(brand)}
                      aria-pressed={selected}
                      className={`${submenuButtonClass} ${selected ? 'font-semibold text-[#3145a5] dark:text-indigo-300' : ''}`}
                    >
                      <span className="truncate">{brand}</span>
                      <span className="text-xs text-gray-400">{count}</span>
                    </button>
                  );
                })}
              </MenuGroup>
            )}

            {priceRanges.length > 0 && (
              <MenuGroup
                icon={CircleDollarSign}
                label="Price"
                open={pricesOpen}
                collapsed={collapsed}
                onToggle={() => setPricesOpen((open) => !open)}
              >
                {priceRanges.map(({ label, min, max }) => {
                  const selected = filters.priceRange[0] === min && filters.priceRange[1] === max;
                  return (
                    <button
                      type="button"
                      key={label}
                      onClick={() => handlePredefinedRangeClick(min, max)}
                      aria-pressed={selected}
                      className={`${submenuButtonClass} ${selected ? 'font-semibold text-[#3145a5] dark:text-indigo-300' : ''}`}
                    >
                      <span className="truncate">{label}</span>
                    </button>
                  );
                })}
              </MenuGroup>
            )}

            <div className="my-3 border-t border-gray-200 dark:border-gray-700" />
            <p className={`px-3 pb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400 ${collapsed ? 'md:sr-only' : ''}`}>Orders &amp; help</p>
            <SidebarLink to="/my-orders" label="Track Order" icon={PackageSearch} collapsed={collapsed} onClick={onClose} />
            <SidebarLink to="/size-guide" label="Size Guide" icon={Ruler} collapsed={collapsed} onClick={onClose} />
            <SidebarLink to="/shipping-delivery" label="Shipping & Delivery" icon={Truck} collapsed={collapsed} onClick={onClose} />
            <SidebarLink to="/contact-us" label="Contact Us" icon={Mail} collapsed={collapsed} onClick={onClose} />
            <SidebarLink to="/about-us" label="About Us" icon={Info} collapsed={collapsed} onClick={onClose} />
            <SidebarLink to="/privacy-policy" label="Privacy Policy" icon={LockKeyhole} collapsed={collapsed} onClick={onClose} />
          </div>

          <div className="mt-3 border-t border-gray-200 pt-2 dark:border-gray-700">
            <button
              type="button"
              onClick={onResetFilters}
              title={collapsed ? 'Reset filters' : undefined}
              className={`flex h-11 w-full items-center rounded-lg px-3 text-gray-800 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3145a5] dark:text-gray-200 dark:hover:bg-gray-700 ${collapsed ? 'md:justify-center md:px-0' : ''}`}
            >
              <RotateCcw className="size-[18px] shrink-0" aria-hidden="true" />
              <span className={`ml-3 text-sm font-medium ${collapsed ? 'md:sr-only' : ''}`}>Reset filters</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setCollapsed((value) => !value)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="group/collapse absolute right-0 top-[44%] hidden h-9 w-7 translate-x-1/2 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 shadow-sm transition-colors hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3145a5] md:flex dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            {collapsed ? <ChevronRight className="size-5" /> : <ChevronLeft className="size-5" />}
            <span className="pointer-events-none absolute left-full ml-2 hidden rounded bg-gray-900 px-2 py-1 text-xs font-medium text-white shadow-lg group-hover/collapse:block group-focus-visible/collapse:block">
              {collapsed ? 'Expand' : 'Collapse'}
            </span>
          </button>
        </nav>
      </aside>
    </>
  );
}
