import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../ui/utils';

interface ImageUploadProps {
  value?: string | File;
  onChange: (file: File | null) => void;
  preview?: string;
  className?: string;
  maxSizeMB?: number;
}

export function ImageUpload({
  value,
  onChange,
  preview,
  className,
  maxSizeMB = 5,
}: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(preview || null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Validate file size
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > maxSizeMB) {
      alert(`File size should be less than ${maxSizeMB}MB`);
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    onChange(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className={cn('w-full', className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />

      {previewUrl ? (
        <div className="relative w-full h-64 rounded-lg border-2 border-gray-200 dark:border-gray-700 overflow-hidden group">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => inputRef.current?.click()}
            >
              <Upload className="size-4 mr-2" />
              Change
            </Button>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={handleRemove}
            >
              <X className="size-4 mr-2" />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            'w-full h-64 rounded-lg border-2 border-dashed cursor-pointer transition-all',
            dragActive
              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/10'
              : 'border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500'
          )}
        >
          <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-500 dark:text-gray-400">
            <div className="size-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <ImageIcon className="size-8 text-gray-400 dark:text-gray-500" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium mb-1">
                Click to upload or drag and drop
              </p>
              <p className="text-xs">PNG, JPG, GIF up to {maxSizeMB}MB</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
