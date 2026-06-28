import { useRef, useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Star } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { cn } from '../ui/utils';

interface MultiImageUploadProps {
  files: File[];
  existingUrls: string[];
  colors: string[];
  onFilesChange: (files: File[]) => void;
  onExistingUrlsChange: (urls: string[]) => void;
  onColorsChange: (colors: string[]) => void;
  className?: string;
  maxSizeMB?: number;
  maxFiles?: number;
}

interface PreviewItem {
  key: string;
  url: string;
  type: 'new' | 'existing';
  fileIndex?: number;  // index within files[]
  existingIndex?: number; // index within existingUrls[]
  globalIndex: number; // index in combined previews
}

export function MultiImageUpload({
  files,
  existingUrls,
  colors = [],
  onFilesChange,
  onExistingUrlsChange,
  onColorsChange,
  className,
  maxSizeMB = 5,
  maxFiles = 20,
}: MultiImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [sizeErrors, setSizeErrors] = useState<string[]>([]);

  // Build combined preview list — existing first, then new files
  const previews: PreviewItem[] = [
    ...existingUrls.map((url, i) => ({
      key: `existing-${i}-${url}`,
      url,
      type: 'existing' as const,
      existingIndex: i,
      globalIndex: i,
    })),
    ...files.map((file, i) => ({
      key: `new-${file.name}-${file.size}-${file.lastModified}`,
      url: URL.createObjectURL(file),
      type: 'new' as const,
      fileIndex: i,
      globalIndex: existingUrls.length + i,
    })),
  ];

  const totalCount = existingUrls.length + files.length;

  const addFiles = useCallback(
    (selected: FileList | File[]) => {
      const fileList = Array.from(selected);
      const accepted: File[] = [];
      const errors: string[] = [];
      const remainingSlots = Math.max(0, maxFiles - totalCount);

      for (const file of fileList) {
        if (accepted.length >= remainingSlots) {
          errors.push(`Max ${maxFiles} images allowed`);
          break;
        }
        if (!file.type.startsWith('image/')) {
          errors.push(`"${file.name}" is not an image`);
          continue;
        }
        const sizeMB = file.size / (1024 * 1024);
        if (sizeMB > maxSizeMB) {
          errors.push(`"${file.name}" exceeds ${maxSizeMB}MB limit`);
          continue;
        }
        accepted.push(file);
      }

      setSizeErrors(errors);

      if (accepted.length > 0) {
        onFilesChange([...files, ...accepted]);
        // Append empty color slots for new images
        onColorsChange([...colors, ...accepted.map(() => '')]);
      }
    },
    [files, colors, existingUrls.length, maxFiles, maxSizeMB, totalCount, onFilesChange, onColorsChange]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
      e.target.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const dropped = e.dataTransfer.files;
    if (dropped && dropped.length > 0) {
      addFiles(dropped);
    }
  };

  const handleRemove = (item: PreviewItem) => {
    if (item.type === 'existing') {
      // Remove from existingUrls
      const newExisting = existingUrls.filter((_, i) => i !== item.existingIndex);
      // Remove corresponding color
      const newColors = colors.filter((_, i) => i !== item.globalIndex);
      onExistingUrlsChange(newExisting);
      onColorsChange(newColors);
    } else {
      // Remove from files
      const newFiles = files.filter((_, i) => i !== item.fileIndex);
      // Remove corresponding color
      const newColors = colors.filter((_, i) => i !== item.globalIndex);
      onFilesChange(newFiles);
      onColorsChange(newColors);
    }
    setSizeErrors([]);
  };

  const handleColorChange = (globalIndex: number, val: string) => {
    const updatedColors = [...colors];
    while (updatedColors.length <= globalIndex) {
      updatedColors.push('');
    }
    updatedColors[globalIndex] = val;
    onColorsChange(updatedColors);
  };

  const canAddMore = totalCount < maxFiles;

  return (
    <div className={cn('w-full space-y-3', className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Drop Zone / Upload Button */}
      <div
        role="button"
        tabIndex={canAddMore ? 0 : -1}
        onClick={() => canAddMore && inputRef.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && canAddMore && inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'w-full rounded-xl border-2 border-dashed transition-all cursor-pointer select-none',
          'flex flex-col items-center justify-center gap-2 py-6',
          canAddMore
            ? isDragging
              ? 'border-primary bg-primary/10 scale-[1.01]'
              : 'border-gray-300 dark:border-gray-600 hover:border-primary hover:bg-primary/5'
            : 'border-gray-200 dark:border-gray-700 opacity-50 cursor-not-allowed'
        )}
      >
        <div className={cn(
          'rounded-full p-3 transition-colors',
          isDragging ? 'bg-primary/20' : 'bg-muted'
        )}>
          <Upload className={cn('size-5', isDragging ? 'text-primary' : 'text-muted-foreground')} />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-foreground">
            {canAddMore
              ? isDragging
                ? 'Drop images here'
                : 'Click to upload or drag & drop'
              : `Maximum ${maxFiles} images reached`}
          </p>
          {canAddMore && (
            <p className="text-xs text-muted-foreground mt-0.5">
              PNG, JPG, WEBP up to {maxSizeMB}MB each · {totalCount}/{maxFiles} uploaded
            </p>
          )}
        </div>
      </div>

      {/* Size / type errors */}
      {sizeErrors.length > 0 && (
        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 space-y-1">
          {sizeErrors.map((err, i) => (
            <p key={i} className="text-xs text-red-600 dark:text-red-400">{err}</p>
          ))}
        </div>
      )}

      {/* Image Grid */}
      {previews.length === 0 ? (
        <div className="w-full h-40 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-center">
          <div className="text-center text-gray-400 dark:text-gray-500">
            <ImageIcon className="size-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No images selected</p>
            <p className="text-xs mt-1 opacity-70">Upload images to see previews here</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {previews.map((item) => (
            <div
              key={item.key}
              className={cn(
                'flex flex-col rounded-xl border overflow-hidden transition-shadow hover:shadow-md',
                item.globalIndex === 0
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'border-gray-200 dark:border-gray-700'
              )}
            >
              {/* Image Preview */}
              <div className="relative aspect-square bg-muted overflow-hidden">
                <img
                  src={item.url}
                  alt={`Product image ${item.globalIndex + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />

                {/* Primary badge */}
                {item.globalIndex === 0 && (
                  <div className="absolute top-1.5 left-1.5 flex items-center gap-1 bg-primary text-primary-foreground text-[10px] font-semibold px-2 py-0.5 rounded-full shadow">
                    <Star className="size-2.5 fill-current" />
                    Primary
                  </div>
                )}

                {/* Image number */}
                {item.globalIndex > 0 && (
                  <div className="absolute top-1.5 left-1.5 bg-black/60 text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
                    #{item.globalIndex + 1}
                  </div>
                )}

                {/* Source badge */}
                <div className={cn(
                  'absolute bottom-1.5 right-1.5 text-[9px] font-semibold px-1.5 py-0.5 rounded-full',
                  item.type === 'new'
                    ? 'bg-green-500/90 text-white'
                    : 'bg-blue-500/90 text-white'
                )}>
                  {item.type === 'new' ? 'New' : 'Saved'}
                </div>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => handleRemove(item)}
                  className="absolute top-1.5 right-1.5 rounded-full bg-black/70 hover:bg-red-500 text-white p-1 transition-colors"
                  aria-label="Remove image"
                >
                  <X className="size-3" />
                </button>
              </div>

              {/* Color tag */}
              <div className="p-2 bg-background">
                <Input
                  placeholder="Color (e.g. Red)"
                  value={colors[item.globalIndex] || ''}
                  onChange={(e) => handleColorChange(item.globalIndex, e.target.value)}
                  className="h-7 text-xs"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {totalCount > 0 && (
        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground">{totalCount}</span> image{totalCount !== 1 ? 's' : ''} selected
          {totalCount > 0 && ' · First image will be shown as the main product photo'}
        </p>
      )}
    </div>
  );
}
