import { useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../ui/utils';

interface MultiImageUploadProps {
  files: File[];
  existingUrls: string[];
  onFilesChange: (files: File[]) => void;
  onExistingUrlsChange: (urls: string[]) => void;
  className?: string;
  maxSizeMB?: number;
  maxFiles?: number;
}

export function MultiImageUpload({
  files,
  existingUrls,
  onFilesChange,
  onExistingUrlsChange,
  className,
  maxSizeMB = 5,
  maxFiles = 10,
}: MultiImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const localPreviews = files.map((file) => ({
    key: `${file.name}-${file.size}-${file.lastModified}`,
    url: URL.createObjectURL(file),
    type: 'new' as const,
  }));

  const remotePreviews = existingUrls.map((url, index) => ({
    key: `existing-${index}-${url}`,
    url,
    type: 'existing' as const,
    index,
  }));

  const previews = [...remotePreviews, ...localPreviews];
  const totalCount = existingUrls.length + files.length;

  const addFiles = (selected: FileList) => {
    const accepted: File[] = [];
    const remainingSlots = Math.max(0, maxFiles - totalCount);

    for (let i = 0; i < selected.length && accepted.length < remainingSlots; i += 1) {
      const file = selected[i];
      if (!file.type.startsWith('image/')) continue;
      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB > maxSizeMB) continue;
      accepted.push(file);
    }

    if (accepted.length > 0) {
      onFilesChange([...files, ...accepted]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(e.target.files);
      e.target.value = '';
    }
  };

  const removeExisting = (index: number) => {
    onExistingUrlsChange(existingUrls.filter((_, i) => i !== index));
  };

  const removeNew = (key: string) => {
    onFilesChange(
      files.filter((file) => `${file.name}-${file.size}-${file.lastModified}` !== key)
    );
  };

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

      <Button
        type="button"
        variant="outline"
        className="w-full h-12 border-dashed"
        onClick={() => inputRef.current?.click()}
        disabled={totalCount >= maxFiles}
      >
        <Upload className="size-4 mr-2" />
        {totalCount >= maxFiles ? `Max ${maxFiles} images reached` : 'Upload product images'}
      </Button>

      {previews.length === 0 ? (
        <div className="w-full h-40 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <ImageIcon className="size-8 mx-auto mb-2" />
            <p className="text-sm">No images selected</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {previews.map((item, index) => (
            <div key={item.key} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              <img src={item.url} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => (item.type === 'existing' ? removeExisting(item.index) : removeNew(item.key))}
                className="absolute top-2 right-2 rounded-full bg-black/65 text-white p-1 hover:bg-black/80"
                aria-label="Remove image"
              >
                <X className="size-3" />
              </button>
              {index === 0 && (
                <span className="absolute bottom-2 left-2 text-[10px] px-2 py-1 rounded bg-black/65 text-white">
                  Primary
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-500 dark:text-gray-400">
        {totalCount}/{maxFiles} images. First image is shown as the main product image.
      </p>
    </div>
  );
}
