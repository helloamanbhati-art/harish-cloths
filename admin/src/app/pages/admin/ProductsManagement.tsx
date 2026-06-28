import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Switch } from '../../components/ui/switch';
import { Checkbox } from '../../components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Plus, Search, Pencil, Trash2, Package, Loader2, Images } from 'lucide-react';
import { toast } from 'sonner';
import { useBrands } from '../../contexts/BrandContext';
import { useCategories } from '../../contexts/CategoryContext';
import {
  VariantManager,
  VariantDraft,
  newVariantDraft,
} from '../../components/admin/VariantManager';

interface VariantImage {
  imageUrl: string;
  isPrimary: boolean;
  sortOrder: number;
}

interface ProductVariant {
  variantId: string;
  variantName: string;
  images: VariantImage[];
}

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  images: string[];
  colors?: string[];
  variants?: ProductVariant[];
  category: string;
  description: string;
  soldBy: 'meter' | 'piece';
  clothingType?: string;
  availableSizes?: string[];
  inStock?: boolean;
  additionalChargeName?: string;
  additionalChargeAmount?: number;
}

const initialProducts: Product[] = [];
// Note: Products are now fetched from the real API

export function ProductsManagement() {
  const { brands } = useBrands();
  const { categories } = useCategories();
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const [products, setProducts] = useState<Product[]>([]);
  const [sizeOptions, setSizeOptions] = useState<string[]>([]);
  const [clothingTypeOptions, setClothingTypeOptions] = useState<string[]>([]);

const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken');
  return { 'Authorization': token ? `Bearer ${token}` : '' };
};

// Load products from API on mount
useEffect(() => {
  const fetchProducts = async () => {
    try {
      console.log('[fetchProducts] Starting...');
      const res = await fetch(`${API_BASE_URL}/api/v1/products`, {
        headers: getAuthHeaders(),
      });
      console.log('[fetchProducts] Response status:', res.status);
      const data = await res.json();
      console.log('[fetchProducts] Data received:', data);
      const mapped = (data.data || []).map((p: any) => {
        // Handle brand - could be string, object, or missing
        let brandName = '';
        if (typeof p.brand === 'string') {
          brandName = p.brand;
        } else if (p.brand && typeof p.brand === 'object') {
          brandName = p.brand.name || String(p.brand._id || '') || '';
        }

        // Handle category - could be string, object, or missing
        let categoryName = '';
        if (typeof p.category === 'string') {
          categoryName = p.category;
        } else if (p.category && typeof p.category === 'object') {
          categoryName = p.category.name || String(p.category._id || '') || '';
        }

        const images = p.images || [];
        const image = p.image || '';
        const fallbackImages = images.length > 0 ? images : (image ? [image] : []);
        
        return {
          id: p._id || p.id,
          name: p.name,
          brand: brandName,
          category: categoryName,
          price: p.price,
          image: p.image,
          images: p.images || [],
          colors: p.colors || [],
          variants: (p.variants || []).map((v: any) => ({
            variantId: v.variantId || v._id || '',
            variantName: v.variantName || v.name || 'Default',
            images: Array.isArray(v.images)
              ? v.images.map((img: any) => ({
                  imageUrl: typeof img === 'string' ? img : img.imageUrl,
                  isPrimary: img.isPrimary ?? false,
                  sortOrder: img.sortOrder ?? 0,
                }))
              : [],
          })),
          description: p.description,
          soldBy: p.soldBy,
          clothingType: p.clothingType || '',
          availableSizes: p.availableSizes || [],
          inStock: p.inStock ?? true,
          additionalChargeName: p.additionalChargeName || '',
          additionalChargeAmount: p.additionalChargeAmount || 0,
        };
      });
      console.log('[fetchProducts] Mapped products:', mapped.length);
      setProducts(mapped);
    } catch (err) {
      console.error('[fetchProducts] Exception:', err);
      toast.error('Failed to load products');
    }
  };
  fetchProducts();
}, []);

useEffect(() => {
  const fetchProductOptions = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/product-options`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to load product options');
      const data = await res.json();
      setSizeOptions(data?.data?.sizes || []);
      setClothingTypeOptions(data?.data?.clothingTypes || []);
    } catch (err) {
      console.error('[fetchProductOptions] Exception:', err);
      toast.error('Failed to load size and clothing type options');
    }
  };
  fetchProductOptions();
}, []);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [brandFilter, setBrandFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Variants state for the form
  const [variantsDraft, setVariantsDraft] = useState<VariantDraft[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    brand: '',
    category: '',
    price: '',
    soldBy: 'meter' as 'meter' | 'piece',
    clothingType: '',
    availableSizes: [] as string[],
    inStock: true,
    additionalChargeName: '',
    additionalChargeAmount: '',
  });

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesBrand = brandFilter === 'all' || product.brand === brandFilter;
    const matchesStock =
      stockFilter === 'all' ||
      (stockFilter === 'in-stock' && product.inStock) ||
      (stockFilter === 'out-of-stock' && !product.inStock);

    return matchesSearch && matchesCategory && matchesBrand && matchesStock;
  });

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        brand: product.brand,
        category: product.category,
        price: product.price.toString(),
        soldBy: product.soldBy,
        clothingType: product.clothingType || '',
        availableSizes: product.availableSizes || [],
        inStock: product.inStock ?? true,
        additionalChargeName: product.additionalChargeName || '',
        additionalChargeAmount: product.additionalChargeAmount ? product.additionalChargeAmount.toString() : '',
      });

      if (product.variants && product.variants.length > 0) {
        setVariantsDraft(
          product.variants.map((v, i) => {
            const vImages = Array.isArray(v.images) ? v.images : [];
            return {
              clientId: v.variantId || `v-exist-${i}`,
              name: v.variantName || 'Default',
              images: vImages.map((img: any, imgIdx: number) => ({
                id: `ex-${imgIdx}-${Date.now()}-${Math.random()}`,
                url: typeof img === 'string' ? img : img.imageUrl,
              })),
            };
          })
        );
      } else {
        // Fallback for legacy products
        const legacyImages = product.images?.length > 0 ? product.images : (product.image ? [product.image] : []);
        setVariantsDraft([
          {
            clientId: `v-legacy-${Date.now()}`,
            name: 'Default',
            images: legacyImages.map((url, imgIdx) => ({
              id: `ex-legacy-${imgIdx}-${Date.now()}-${Math.random()}`,
              url,
            })),
          }
        ]);
      }
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        brand: '',
        category: '',
        price: '',
        soldBy: 'meter',
        clothingType: '',
        availableSizes: [],
        inStock: true,
        additionalChargeName: '',
        additionalChargeAmount: '',
      });
      setVariantsDraft([newVariantDraft('Default')]);
    }
    setDialogOpen(true);
  };

  const handleSaveProduct = async () => {
    if (!formData.name || !formData.brand || !formData.category || !formData.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    const totalImages = variantsDraft.reduce((acc, v) => acc + v.images.length, 0);
    if (totalImages === 0) {
      toast.error('Please upload at least one product image in your variants');
      return;
    }

    try {
      setIsSaving(true);
      
      // Upload new files for each variant
      const finalizedVariants: ProductVariant[] = [];
      
      for (const variant of variantsDraft) {
        const filesToUpload = variant.images.filter((img) => img.file);
        let uploadedUrls: string[] = [];
        if (filesToUpload.length > 0) {
          const imagesForm = new FormData();
          filesToUpload.forEach((img) => imagesForm.append('images', img.file!));
          
          const uploadRes = await fetch(`${API_BASE_URL}/api/v1/admin/products/upload-images`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: imagesForm,
          });
          
          if (!uploadRes.ok) {
            toast.error(`Image upload failed for variant ${variant.name}`);
            setIsSaving(false);
            return;
          }
          const uploadData = await uploadRes.json();
          uploadedUrls = uploadData?.urls || [];
        }
        
        let uploadIdx = 0;
        const allUrls = variant.images.map((img) => {
          if (img.url) return img.url;
          return uploadedUrls[uploadIdx++];
        }).filter(Boolean);
        
        const imagesPayload = allUrls.map((url, idx) => ({
          imageUrl: url,
          isPrimary: idx === 0,
          sortOrder: idx,
        }));
        
        finalizedVariants.push({
          variantId: variant.clientId.startsWith('v-exist-') ? variant.clientId.replace('v-exist-', '') : (variant.clientId.startsWith('v-') ? variant.clientId : `v-${Math.random()}`),
          variantName: variant.name || 'Default',
          images: imagesPayload,
        });
      }

      // Step 2: Save product to database
      const payload = {
        name: formData.name,
        description: formData.description,
        brand: formData.brand,
        category: formData.category,
        price: parseFloat(formData.price),
        soldBy: formData.soldBy,
        clothingType: formData.clothingType || null,
        availableSizes: formData.availableSizes,
        variants: finalizedVariants,
        inStock: formData.inStock,
        isActive: true,
        additionalChargeName: formData.additionalChargeName || '',
        additionalChargeAmount: formData.additionalChargeAmount ? parseFloat(formData.additionalChargeAmount) : 0,
      };

  if (editingProduct) {
    const res = await fetch(`${API_BASE_URL}/api/v1/admin/products/${editingProduct.id}`, {
      method: 'PUT',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to update product');
    const data = await res.json();
    const updatedProduct = {
      id: data.data._id,
      name: data.data.name,
      brand: typeof data.data.brand === 'object' ? data.data.brand?.name : data.data.brand,
      category: typeof data.data.category === 'object' ? data.data.category?.name : data.data.category,
      price: data.data.price,
      image: data.data.image,
      images: data.data.images || [],
      colors: data.data.colors || [],
      variants: data.data.variants || [],
      description: data.data.description,
      soldBy: data.data.soldBy,
      clothingType: data.data.clothingType || '',
      availableSizes: data.data.availableSizes || [],
      inStock: data.data.inStock,
      additionalChargeName: data.data.additionalChargeName || '',
      additionalChargeAmount: data.data.additionalChargeAmount || 0,
    };
    setProducts(prev => prev.map(p => p.id === editingProduct.id ? updatedProduct : p));
    toast.success('Product updated successfully');
  } else {
    const res = await fetch(`${API_BASE_URL}/api/v1/admin/products`, {
      method: 'POST',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to create product');
    const data = await res.json();
    const newProduct = {
      id: data.data._id,
      name: data.data.name,
      brand: typeof data.data.brand === 'object' ? data.data.brand?.name : data.data.brand,
      category: typeof data.data.category === 'object' ? data.data.category?.name : data.data.category,
      price: data.data.price,
      image: data.data.image,
      images: data.data.images || [],
      colors: data.data.colors || [],
      variants: data.data.variants || [],
      description: data.data.description,
      soldBy: data.data.soldBy,
      clothingType: data.data.clothingType || '',
      availableSizes: data.data.availableSizes || [],
      inStock: data.data.inStock,
      additionalChargeName: data.data.additionalChargeName || '',
      additionalChargeAmount: data.data.additionalChargeAmount || 0,
    };
    setProducts(prev => [newProduct, ...prev]);
    toast.success('Product added successfully');
  }

  setDialogOpen(false);
  setFormData({
    name: '',
    description: '',
    brand: '',
    category: '',
    price: '',
    soldBy: 'meter',
    clothingType: '',
    availableSizes: [],
    inStock: true,
    additionalChargeName: '',
    additionalChargeAmount: '',
  });
    } catch (err) {
      console.error('Error saving product:', err);
      toast.error(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    if (!window.confirm(`Are you sure you want to delete "${product.name}"?`)) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/products/${product.id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to delete');
      setProducts(prev => prev.filter(p => p.id !== product.id));
      toast.success('Product deleted successfully');
    } catch (err) {
      toast.error('Failed to delete product');
    }
  };

  const handleToggleStock = (product: Product) => {
    setProducts(products.map(p =>
      p.id === product.id ? { ...p, inStock: !p.inStock } : p
    ));
    toast.success(`Stock status updated for ${product.name}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your fabric inventory
          </p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
        >
          <Plus className="size-4" />
          Add Product
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <Input
            placeholder="Search by name, brand, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11"
          />
        </div>
        <div className="flex gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[150px] h-11">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={brandFilter} onValueChange={setBrandFilter}>
            <SelectTrigger className="w-[150px] h-11">
              <SelectValue placeholder="Brand" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Brands</SelectItem>
              {brands.map(brand => (
                <SelectItem key={brand.id} value={brand.name}>{brand.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={stockFilter} onValueChange={setStockFilter}>
            <SelectTrigger className="w-[150px] h-11">
              <SelectValue placeholder="Stock" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stock</SelectItem>
              <SelectItem value="in-stock">In Stock</SelectItem>
              <SelectItem value="out-of-stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between px-1">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing <span className="font-medium text-gray-900 dark:text-white">{filteredProducts.length}</span> of <span className="font-medium text-gray-900 dark:text-white">{products.length}</span> products
        </p>
      </div>

      {/* Products Grid/Table */}
      {filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="py-16">
            <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
              <Package className="size-16 mb-4 opacity-50" />
              <p className="text-lg font-medium">No products found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Product Images Strip */}
                  <div className="flex-shrink-0">
                    <div className="flex flex-col gap-1">
                      {/* Primary image */}
                      <img
                        src={product.variants?.[0]?.images?.[0]?.imageUrl || product.image || (product.images && product.images[0])}
                        alt={product.name}
                        className="size-20 rounded-lg object-cover border border-gray-200 dark:border-gray-700"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjOTk5IiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBmaWxsPSJub25lIiBzdHJva2Utd2lkdGg9IjMiPjxyZWN0IHg9IjgiIHk9IjgiIHdpZHRoPSI3MiIgaGVpZ2h0PSI3MiIgcng9IjYiLz48cGF0aCBkPSJtOCA1NiAxNi0yMCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUyIiBjeT0iMzIiIHI9IjgiLz48L3N2Zz4=';
                        }}
                      />
                      {/* Extra variants/images count badge */}
                      {(product.variants && product.variants.length > 1) ? (
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Images className="size-3" />
                          {product.variants.length} variants
                        </div>
                      ) : (product.images && product.images.length > 1) ? (
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Images className="size-3" />
                          {product.images.length} photos
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg truncate">{product.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                          {product.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-3">
                          <Badge variant="outline" className="text-xs">
                            {product.brand || 'Unknown Brand'}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {product.category || 'Unknown Category'}
                          </Badge>
                          <Badge className={product.soldBy === 'meter' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs' : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs'}>
                            {product.soldBy === 'meter' ? 'Per Meter' : 'Per Piece'}
                          </Badge>
                          {product.clothingType ? (
                            <Badge variant="secondary" className="text-xs">
                              {product.clothingType}
                            </Badge>
                          ) : null}
                        </div>
                        {product.availableSizes && product.availableSizes.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {product.availableSizes.slice(0, 8).map((size) => (
                              <Badge key={`${product.id}-${size}`} variant="outline" className="text-[10px]">
                                {size}
                              </Badge>
                            ))}
                          </div>
                        ) : null}
                      </div>

                      {/* Price & Stock */}
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                          ₹{product.price}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          per {product.soldBy}
                        </div>
                        {product.additionalChargeAmount && product.additionalChargeAmount > 0 && (
                          <div className="text-xs text-emerald-500 mt-1 font-medium">
                            + ₹{product.additionalChargeAmount} ({product.additionalChargeName || 'Additional'})
                          </div>
                        )}
                        <div className="mt-3">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={product.inStock}
                              onCheckedChange={() => handleToggleStock(product)}
                            />
                            <Badge className={product.inStock ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs'}>
                              {product.inStock ? 'In Stock' : 'Out'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenDialog(product)}
                        className="flex-1"
                      >
                        <Pencil className="size-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteProduct(product)}
                        className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-900/30"
                      >
                        <Trash2 className="size-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            <DialogDescription>
              {editingProduct ? 'Update the product details below' : 'Fill in the details to add a new product'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Silk Banarasi Fabric"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter product description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brand">Brand *</Label>
                <Select value={formData.brand} onValueChange={(value) => setFormData({ ...formData, brand: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map(brand => (
                      <SelectItem key={brand.id} value={brand.name}>{brand.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="soldBy">Selling Unit *</Label>
                <Select value={formData.soldBy} onValueChange={(value: 'meter' | 'piece') => setFormData({ ...formData, soldBy: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="meter">Per Meter</SelectItem>
                    <SelectItem value="piece">Per Piece</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="additionalChargeName">Additional Charge Name</Label>
                <Input
                  id="additionalChargeName"
                  value={formData.additionalChargeName}
                  onChange={(e) => setFormData({ ...formData, additionalChargeName: e.target.value })}
                  placeholder="e.g., Ordna, Stitching Charge"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalChargeAmount">Additional Charge (₹)</Label>
                <Input
                  id="additionalChargeAmount"
                  type="number"
                  value={formData.additionalChargeAmount}
                  onChange={(e) => setFormData({ ...formData, additionalChargeAmount: e.target.value })}
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clothingType">Clothing Type</Label>
                <Select
                  value={formData.clothingType || 'none'}
                  onValueChange={(value) =>
                    setFormData({ ...formData, clothingType: value === 'none' ? '' : value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select clothing type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {clothingTypeOptions.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Available Sizes</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {sizeOptions.map((size) => (
                  <label key={size} className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={formData.availableSizes.includes(size)}
                      onCheckedChange={(checked) => {
                        const next = checked
                          ? [...formData.availableSizes, size]
                          : formData.availableSizes.filter((s) => s !== size);
                        setFormData({ ...formData, availableSizes: next });
                      }}
                    />
                    <span>{size}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Product Variants & Images *</Label>
              <VariantManager
                variants={variantsDraft}
                onChange={setVariantsDraft}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div>
                <Label htmlFor="inStock">Stock Status</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formData.inStock ? 'In Stock' : 'Out of Stock'}
                </p>
              </div>
              <Switch
                id="inStock"
                checked={formData.inStock}
                onCheckedChange={(checked) => setFormData({ ...formData, inStock: checked })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveProduct}
              disabled={isSaving}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              {isSaving ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Product'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
