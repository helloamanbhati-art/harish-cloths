import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import { Plus, Edit, Trash2, DollarSign, Settings as SettingsIcon } from 'lucide-react';
import { priceRanges as initialPriceRanges } from '../../data/products';
import { toast } from 'sonner';

interface PriceRange {
  label: string;
  min: number;
  max: number;
}

export function AdminSettings() {
  const [priceRanges, setPriceRanges] = useState<PriceRange[]>(initialPriceRanges);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingRange, setEditingRange] = useState<PriceRange | null>(null);
  const [formData, setFormData] = useState<PriceRange>({
    label: '',
    min: 0,
    max: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.min >= formData.max) {
      toast.error('Minimum price must be less than maximum price!');
      return;
    }

    if (editingRange) {
      // Update existing range
      setPriceRanges(
        priceRanges.map((r) =>
          r.label === editingRange.label ? formData : r
        )
      );
      toast.success('Price range updated successfully!');
    } else {
      // Add new range
      setPriceRanges([...priceRanges, formData]);
      toast.success('Price range added successfully!');
    }

    setFormData({ label: '', min: 0, max: 0 });
    setIsAddDialogOpen(false);
    setEditingRange(null);
  };

  const handleEdit = (range: PriceRange) => {
    setEditingRange(range);
    setFormData(range);
    setIsAddDialogOpen(true);
  };

  const handleDelete = (label: string) => {
    if (confirm(`Are you sure you want to delete "${label}"?`)) {
      setPriceRanges(priceRanges.filter((r) => r.label !== label));
      toast.success('Price range deleted successfully!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage application settings and configurations
          </p>
        </div>
      </div>

      {/* Price Ranges Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Price Range Filters</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Configure price ranges for product filtering on the frontend
              </p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setEditingRange(null);
                    setFormData({ label: '', min: 0, max: 0 });
                  }}
                >
                  <Plus className="size-4 mr-2" />
                  Add Range
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingRange ? 'Edit Price Range' : 'Add New Price Range'}
                  </DialogTitle>
                  <DialogDescription>
                    Define a price range for product filtering
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="label">Label *</Label>
                    <Input
                      id="label"
                      value={formData.label}
                      onChange={(e) =>
                        setFormData({ ...formData, label: e.target.value })
                      }
                      placeholder="e.g., Under ₹400"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="min">Minimum Price (₹) *</Label>
                      <Input
                        id="min"
                        type="number"
                        value={formData.min}
                        onChange={(e) =>
                          setFormData({ ...formData, min: Number(e.target.value) })
                        }
                        placeholder="0"
                        required
                        min="0"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="max">Maximum Price (₹) *</Label>
                      <Input
                        id="max"
                        type="number"
                        value={formData.max}
                        onChange={(e) =>
                          setFormData({ ...formData, max: Number(e.target.value) })
                        }
                        placeholder="0"
                        required
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button type="submit" className="flex-1">
                      {editingRange ? 'Update Range' : 'Add Range'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsAddDialogOpen(false);
                        setEditingRange(null);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {priceRanges.map((range) => (
              <Card key={range.label} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="size-4 text-green-600" />
                        <h3 className="font-semibold">{range.label}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          ₹{range.min}
                        </Badge>
                        <span className="text-xs text-muted-foreground">to</span>
                        <Badge variant="outline" className="text-xs">
                          ₹{range.max}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(range)}
                      >
                        <Edit className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(range.label)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {priceRanges.length === 0 && (
            <div className="text-center py-12">
              <DollarSign className="size-12 mx-auto mb-3 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No price ranges configured</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="storeName">Store Name</Label>
              <Input id="storeName" defaultValue="A&S" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="storeEmail">Store Email</Label>
              <Input id="storeEmail" type="email" defaultValue="support@amanandsons.com" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="storePhone">Store Phone</Label>
              <Input id="storePhone" defaultValue="+91 98765 43210" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gstRate">GST Rate (%)</Label>
              <Input id="gstRate" type="number" defaultValue="18" min="0" max="100" />
            </div>
          </div>

          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      {/* System Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="size-5" />
            System Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Version:</span>
            <span className="font-mono">1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Last Updated:</span>
            <span>{new Date().toLocaleDateString('en-IN')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Environment:</span>
            <Badge variant="outline">Production</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
