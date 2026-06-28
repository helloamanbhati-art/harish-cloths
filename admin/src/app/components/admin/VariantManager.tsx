import { useRef } from 'react';
import { Plus, Trash2, GripVertical, Upload, X, Star, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { cn } from '../ui/utils';

export interface VariantImageItem {
  id: string;
  file?: File;
  url?: string;
}

export interface VariantDraft {
  /** Stable client-side ID (never sent to server) */
  clientId: string;
  name: string;
  /** Unified list of images (both newly added Files and existing Cloudinary URLs) */
  images: VariantImageItem[];
}

interface VariantManagerProps {
  variants: VariantDraft[];
  onChange: (variants: VariantDraft[]) => void;
  maxImagesPerVariant?: number;
  maxFileSizeMB?: number;
}

let _id = 0;
export function newVariantDraft(name = ''): VariantDraft {
  return { clientId: `v-${++_id}-${Date.now()}`, name, images: [] };
}

export function VariantManager({
  variants,
  onChange,
  maxImagesPerVariant = 20,
  maxFileSizeMB = 5,
}: VariantManagerProps) {

  const addVariant = () => {
    onChange([...variants, newVariantDraft()]);
  };

  const removeVariant = (clientId: string) => {
    onChange(variants.filter((v) => v.clientId !== clientId));
  };

  const updateName = (clientId: string, name: string) => {
    onChange(variants.map((v) => v.clientId === clientId ? { ...v, name } : v));
  };

  const addFiles = (clientId: string, fileList: FileList | File[]) => {
    const variant = variants.find((v) => v.clientId === clientId);
    if (!variant) return;
    const total = variant.images.length;
    const remaining = Math.max(0, maxImagesPerVariant - total);
    const accepted: File[] = [];
    const files = Array.from(fileList);
    for (const file of files) {
      if (accepted.length >= remaining) break;
      if (!file.type.startsWith('image/')) continue;
      if (file.size / (1024 * 1024) > maxFileSizeMB) continue;
      accepted.push(file);
    }
    if (accepted.length > 0) {
      const newItems: VariantImageItem[] = accepted.map((file, idx) => ({
        id: `new-${Date.now()}-${idx}-${Math.random()}`,
        file,
      }));
      onChange(variants.map((v) =>
        v.clientId === clientId ? { ...v, images: [...v.images, ...newItems] } : v
      ));
    }
  };

  const removeImage = (clientId: string, itemId: string) => {
    onChange(variants.map((v) =>
      v.clientId === clientId
        ? { ...v, images: v.images.filter((img) => img.id !== itemId) }
        : v
    ));
  };

  const moveImage = (clientId: string, fromIndex: number, direction: 'left' | 'right') => {
    const toIndex = direction === 'left' ? fromIndex - 1 : fromIndex + 1;
    onChange(variants.map((v) => {
      if (v.clientId !== clientId) return v;
      if (toIndex < 0 || toIndex >= v.images.length) return v;
      const nextImages = [...v.images];
      const temp = nextImages[fromIndex];
      nextImages[fromIndex] = nextImages[toIndex];
      nextImages[toIndex] = temp;
      return { ...v, images: nextImages };
    }));
  };

  return (
    <div className="space-y-4">
      {variants.length === 0 && (
        <div className="border-2 border-dashed border-muted rounded-xl p-8 text-center text-muted-foreground">
          <ImageIcon className="size-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm font-medium">No variants yet</p>
          <p className="text-xs mt-1 opacity-70">Click "Add Variant" to create the first one</p>
        </div>
      )}

      {variants.map((variant, variantIndex) => (
        <VariantCard
          key={variant.clientId}
          variant={variant}
          variantIndex={variantIndex}
          maxImagesPerVariant={maxImagesPerVariant}
          maxFileSizeMB={maxFileSizeMB}
          onNameChange={(name) => updateName(variant.clientId, name)}
          onAddFiles={(files) => addFiles(variant.clientId, files)}
          onRemoveImage={(itemId) => removeImage(variant.clientId, itemId)}
          onMoveImage={(fromIdx, direction) => moveImage(variant.clientId, fromIdx, direction)}
          onDelete={() => removeVariant(variant.clientId)}
        />
      ))}

      <Button
        type="button"
        variant="outline"
        className="w-full border-dashed h-11 gap-2 text-sm font-medium"
        onClick={addVariant}
      >
        <Plus className="size-4" />
        Add Variant
      </Button>
    </div>
  );
}

/* ─── Individual variant card ──────────────────────────────────── */

interface VariantCardProps {
  variant: VariantDraft;
  variantIndex: number;
  maxImagesPerVariant: number;
  maxFileSizeMB: number;
  onNameChange: (name: string) => void;
  onAddFiles: (files: FileList) => void;
  onRemoveImage: (itemId: string) => void;
  onMoveImage: (fromIdx: number, direction: 'left' | 'right') => void;
  onDelete: () => void;
}

function VariantCard({
  variant,
  variantIndex,
  maxImagesPerVariant,
  maxFileSizeMB,
  onNameChange,
  onAddFiles,
  onRemoveImage,
  onMoveImage,
  onDelete,
}: VariantCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const totalImages = variant.images.length;
  const canAdd = totalImages < maxImagesPerVariant;

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) onAddFiles(e.dataTransfer.files);
  };

  // Build unified preview list
  const allPreviews = variant.images.map((item) => {
    const src = item.url ? item.url : (item.file ? URL.createObjectURL(item.file) : '');
    return {
      id: item.id,
      src,
      type: item.url ? ('existing' as const) : ('new' as const),
    };
  });

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-muted/40 border-b border-border">
        <GripVertical className="size-4 text-muted-foreground/50 shrink-0" />
        <span className="text-xs font-semibold text-muted-foreground shrink-0 w-20">
          Variant {variantIndex + 1}
        </span>
        <Input
          value={variant.name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="e.g. Blue Floral, Red Print…"
          className="flex-1 h-8 text-sm font-medium"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0 size-8 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={onDelete}
          title="Delete variant"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        <Label className="text-xs text-muted-foreground">
          Images — {totalImages}/{maxImagesPerVariant} · First image shown as variant preview · Hover preview to reorder
        </Label>

        {/* Drop zone */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => canAdd && inputRef.current?.click()}
          className={cn(
            'border-2 border-dashed rounded-lg py-4 flex flex-col items-center gap-1.5 transition-colors select-none',
            canAdd
              ? 'cursor-pointer border-muted-foreground/30 hover:border-primary hover:bg-primary/5'
              : 'border-muted/30 opacity-40 cursor-not-allowed'
          )}
        >
          <Upload className="size-4 text-muted-foreground" />
          <p className="text-xs text-muted-foreground font-medium">
            {canAdd ? 'Click or drop images here' : `Max ${maxImagesPerVariant} images reached`}
          </p>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => { if (e.target.files) { onAddFiles(e.target.files); e.target.value = ''; } }}
        />

        {/* Image grid */}
        {allPreviews.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {allPreviews.map((item, globalIdx) => (
              <div
                key={item.id}
                className={cn(
                  'relative aspect-square rounded-lg overflow-hidden border-2 group',
                  globalIdx === 0 ? 'border-primary shadow-sm' : 'border-transparent'
                )}
              >
                <img
                  src={item.src}
                  alt={`Variant image ${globalIdx + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />

                {/* Primary badge */}
                {globalIdx === 0 && (
                  <div className="absolute top-1 left-1 bg-primary text-primary-foreground rounded-full p-0.5 z-10 shadow-sm">
                    <Star className="size-2.5 fill-current" />
                  </div>
                )}

                {/* New badge */}
                {item.type === 'new' && (
                  <div className="absolute bottom-1 left-1 bg-green-500 text-white text-[8px] font-bold px-1 rounded z-10 shadow-sm">
                    NEW
                  </div>
                )}

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => onRemoveImage(item.id)}
                  className="absolute top-1 right-1 bg-black/70 hover:bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-sm"
                >
                  <X className="size-2.5" />
                </button>

                {/* Reorder Controls overlay on hover */}
                <div className="absolute inset-x-0 bottom-0 bg-black/60 flex items-center justify-around py-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button
                    type="button"
                    disabled={globalIdx === 0}
                    onClick={() => onMoveImage(globalIdx, 'left')}
                    className="text-white hover:text-indigo-300 disabled:opacity-30 disabled:hover:text-white"
                    title="Move Left"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <span className="text-[10px] text-white select-none font-medium">{globalIdx + 1}</span>
                  <button
                    type="button"
                    disabled={globalIdx === allPreviews.length - 1}
                    onClick={() => onMoveImage(globalIdx, 'right')}
                    className="text-white hover:text-indigo-300 disabled:opacity-30 disabled:hover:text-white"
                    title="Move Right"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

