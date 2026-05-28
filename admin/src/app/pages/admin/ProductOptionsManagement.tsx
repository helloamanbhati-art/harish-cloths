import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Label } from '../../components/ui/label';
import { Plus, X } from 'lucide-react';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function getAuthHeaders() {
  const token = localStorage.getItem('adminToken');
  return {
    Authorization: token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
  };
}

export function ProductOptionsManagement() {
  const [sizes, setSizes] = useState<string[]>([]);
  const [clothingTypes, setClothingTypes] = useState<string[]>([]);
  const [newSize, setNewSize] = useState('');
  const [newType, setNewType] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/admin/product-options`, {
          headers: getAuthHeaders(),
        });
        if (!res.ok) throw new Error('Failed to load product options');
        const data = await res.json();
        setSizes(data?.data?.sizes || []);
        setClothingTypes(data?.data?.clothingTypes || []);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to load product options');
      }
    };

    fetchOptions();
  }, []);

  const addUniqueValue = (
    value: string,
    list: string[],
    setList: (next: string[]) => void,
    clearInput: () => void
  ) => {
    const cleaned = value.trim();
    if (!cleaned) return;
    const alreadyExists = list.some((item) => item.toLowerCase() === cleaned.toLowerCase());
    if (alreadyExists) {
      toast.error('Already exists');
      return;
    }
    setList([...list, cleaned]);
    clearInput();
  };

  const removeByIndex = (index: number, list: string[], setList: (next: string[]) => void) => {
    setList(list.filter((_, idx) => idx !== index));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/product-options`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ sizes, clothingTypes }),
      });
      if (!res.ok) throw new Error('Failed to save product options');
      toast.success('Product options saved');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Product Options</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Create sizes and clothing types for admin products and customer filters.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sizes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newSize}
              onChange={(e) => setNewSize(e.target.value)}
              placeholder="Add size (e.g. M, XL, 34, Free Size)"
            />
            <Button
              type="button"
              onClick={() => addUniqueValue(newSize, sizes, setSizes, () => setNewSize(''))}
            >
              <Plus className="size-4 mr-1" />
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size, index) => (
              <Badge key={`${size}-${index}`} variant="secondary" className="gap-1">
                {size}
                <button type="button" onClick={() => removeByIndex(index, sizes, setSizes)} aria-label="Remove size">
                  <X className="size-3" />
                </button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Clothing Types</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              placeholder="Add type (e.g. shirt, jeans, women tops, kurti)"
            />
            <Button
              type="button"
              onClick={() =>
                addUniqueValue(newType, clothingTypes, setClothingTypes, () => setNewType(''))
              }
            >
              <Plus className="size-4 mr-1" />
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {clothingTypes.map((type, index) => (
              <Badge key={`${type}-${index}`} variant="outline" className="gap-1">
                {type}
                <button
                  type="button"
                  onClick={() => removeByIndex(index, clothingTypes, setClothingTypes)}
                  aria-label="Remove clothing type"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Options'}
        </Button>
      </div>
    </div>
  );
}
