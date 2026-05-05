import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../components/ui/dialog';
import { Plus, Pencil, Trash2, Store, DollarSign, Info } from 'lucide-react';
import { toast } from 'sonner';

interface PriceRange {
  id: string;
  label: string;
  min: number;
  max: number;
}

const initialPriceRanges: PriceRange[] = [
  { id: '1', label: 'Under ₹400', min: 0, max: 399 },
  { id: '2', label: '₹400–₹600', min: 400, max: 600 },
  { id: '3', label: '₹600–₹900', min: 600, max: 900 },
  { id: '4', label: '₹900+', min: 900, max: 2500 },
];

export function AdminSettings() {
  // Store Settings State
  const [storeName, setStoreName] = useState('Harish Cloths');
  const [storeEmail, setStoreEmail] = useState('admin@harishcloths.com');
  const [storePhone, setStorePhone] = useState('+91 98765 43210');
  const [gstRate, setGstRate] = useState(18);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(2000);
  const [defaultShippingRate, setDefaultShippingRate] = useState(100);

  // Price Ranges State
  const [priceRanges, setPriceRanges] = useState<PriceRange[]>(initialPriceRanges);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRange, setEditingRange] = useState<PriceRange | null>(null);
  const [rangeLabel, setRangeLabel] = useState('');
  const [rangeMin, setRangeMin] = useState('');
  const [rangeMax, setRangeMax] = useState('');

  const handleSaveSettings = () => {
    // Validate GST rate
    if (gstRate < 0 || gstRate > 28) {
      toast.error('GST rate must be between 0 and 28');
      return;
    }

    toast.success('Settings saved successfully!');
  };

  const handleOpenRangeDialog = (range?: PriceRange) => {
    if (range) {
      setEditingRange(range);
      setRangeLabel(range.label);
      setRangeMin(range.min.toString());
      setRangeMax(range.max.toString());
    } else {
      setEditingRange(null);
      setRangeLabel('');
      setRangeMin('');
      setRangeMax('');
    }
    setDialogOpen(true);
  };

  const handleSavePriceRange = () => {
    if (!rangeLabel.trim()) {
      toast.error('Label is required');
      return;
    }

    const minValue = parseFloat(rangeMin);
    const maxValue = parseFloat(rangeMax);

    if (isNaN(minValue) || isNaN(maxValue)) {
      toast.error('Min and Max must be valid numbers');
      return;
    }

    if (minValue >= maxValue) {
      toast.error('Min must be less than Max');
      return;
    }

    if (editingRange) {
      setPriceRanges(priceRanges.map(r =>
        r.id === editingRange.id
          ? { ...r, label: rangeLabel.trim(), min: minValue, max: maxValue }
          : r
      ));
      toast.success('Price range updated successfully');
    } else {
      setPriceRanges([...priceRanges, {
        id: Date.now().toString(),
        label: rangeLabel.trim(),
        min: minValue,
        max: maxValue,
      }]);
      toast.success('Price range added successfully');
    }

    setDialogOpen(false);
  };

  const handleDeleteRange = (range: PriceRange) => {
    if (window.confirm(`Are you sure you want to delete "${range.label}"?`)) {
      setPriceRanges(priceRanges.filter(r => r.id !== range.id));
      toast.success('Price range deleted successfully');
    }
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage your store settings and configurations
        </p>
      </div>

      {/* CARD 1: Store Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Store className="size-5 text-purple-600 dark:text-purple-400" />
            <CardTitle>Store Settings</CardTitle>
          </div>
          <CardDescription>Update your store information and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="storeName">Store Name</Label>
            <Input
              id="storeName"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="storeEmail">Store Email</Label>
            <Input
              id="storeEmail"
              type="email"
              value={storeEmail}
              onChange={(e) => setStoreEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="storePhone">Store Phone</Label>
            <Input
              id="storePhone"
              value={storePhone}
              onChange={(e) => setStorePhone(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gstRate">GST Rate (%)</Label>
            <Input
              id="gstRate"
              type="number"
              min="0"
              max="28"
              value={gstRate}
              onChange={(e) => setGstRate(parseFloat(e.target.value))}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">Range: 0-28%</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="freeShippingThreshold">Free Shipping Threshold (₹)</Label>
              <Input
                id="freeShippingThreshold"
                type="number"
                min="0"
                value={freeShippingThreshold}
                onChange={(e) => setFreeShippingThreshold(parseFloat(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultShippingRate">Default Shipping Rate (₹)</Label>
              <Input
                id="defaultShippingRate"
                type="number"
                min="0"
                value={defaultShippingRate}
                onChange={(e) => setDefaultShippingRate(parseFloat(e.target.value))}
              />
            </div>
          </div>

          <Button
            onClick={handleSaveSettings}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            Save Settings
          </Button>
        </CardContent>
      </Card>

      {/* CARD 2: Price Range Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="size-5 text-purple-600 dark:text-purple-400" />
              <div>
                <CardTitle>Price Range Filters</CardTitle>
                <CardDescription>Manage price filters for the customer-facing site</CardDescription>
              </div>
            </div>
            <Button
              onClick={() => handleOpenRangeDialog()}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              <Plus className="size-4" />
              Add Price Range
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {priceRanges.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>No price ranges defined</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Label</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Min ₹</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Max ₹</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {priceRanges.map((range) => (
                    <tr key={range.id} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 px-4 font-medium">{range.label}</td>
                      <td className="py-3 px-4">₹{range.min}</td>
                      <td className="py-3 px-4">₹{range.max}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenRangeDialog(range)}
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteRange(range)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* CARD 3: System Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Info className="size-5 text-purple-600 dark:text-purple-400" />
            <CardTitle>System Information</CardTitle>
          </div>
          <CardDescription>Read-only system details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">App Version</span>
            <span className="font-medium">v1.0.0</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">Environment</span>
            <span className="font-medium">Development</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">Last Updated</span>
            <span className="font-medium">{getCurrentDate()}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600 dark:text-gray-400">Admin Email</span>
            <span className="font-medium">{storeEmail}</span>
          </div>
        </CardContent>
      </Card>

      {/* Price Range Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingRange ? 'Edit Price Range' : 'Add Price Range'}</DialogTitle>
            <DialogDescription>
              {editingRange ? 'Update the price range details' : 'Create a new price filter range'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rangeLabel">Label</Label>
              <Input
                id="rangeLabel"
                value={rangeLabel}
                onChange={(e) => setRangeLabel(e.target.value)}
                placeholder="e.g., Under ₹400"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rangeMin">Min (₹)</Label>
                <Input
                  id="rangeMin"
                  type="number"
                  value={rangeMin}
                  onChange={(e) => setRangeMin(e.target.value)}
                  placeholder="0"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rangeMax">Max (₹)</Label>
                <Input
                  id="rangeMax"
                  type="number"
                  value={rangeMax}
                  onChange={(e) => setRangeMax(e.target.value)}
                  placeholder="399"
                  min="0"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSavePriceRange}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              Save Range
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
