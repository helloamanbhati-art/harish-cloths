import { useState, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

interface ImageCarouselProps {
  images: string[];
  alt: string;
  className?: string;
  currentIndex?: number;
  onIndexChange?: (index: number) => void;
}

export function ImageCarousel({
  images = [],
  alt,
  className = '',
  currentIndex,
  onIndexChange,
}: ImageCarouselProps) {
  const [internalIndex, setInternalIndex] = useState(0);
  const activeIndex = currentIndex !== undefined ? currentIndex : internalIndex;

  // Reset when images list changes
  useEffect(() => {
    if (activeIndex >= images.length && images.length > 0) {
      setActiveIndex(0);
    }
  }, [images.length]);

  const setActiveIndex = (index: number) => {
    if (onIndexChange) {
      onIndexChange(index);
    } else {
      setInternalIndex(index);
    }
  };

  const goToPrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIndex(activeIndex === 0 ? images.length - 1 : activeIndex - 1);
  };

  const goToNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIndex(activeIndex === images.length - 1 ? 0 : activeIndex + 1);
  };

  const goToSlide = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIndex(index);
  };

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) {
      setActiveIndex(activeIndex === images.length - 1 ? 0 : activeIndex + 1);
    } else if (distance < -minSwipeDistance) {
      setActiveIndex(activeIndex === 0 ? images.length - 1 : activeIndex - 1);
    }
  };

  if (!images || images.length === 0) return null;

  const safeIndex = Math.min(activeIndex, images.length - 1);

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Main image */}
      <div
        className="relative group w-full h-full overflow-hidden rounded-lg bg-muted"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <ImageWithFallback
          key={safeIndex}
          src={images[safeIndex]}
          alt={`${alt} - Image ${safeIndex + 1}`}
          className="w-full h-full object-cover select-none animate-fade-in transition-all duration-350"
        />

        {/* Image counter pill */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs font-medium px-2.5 py-1 rounded-full">
            {safeIndex + 1} / {images.length}
          </div>
        )}

        {/* Prev / Next arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity size-8 z-10 shadow-md"
              onClick={goToPrevious}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity size-8 z-10 shadow-md"
              onClick={goToNext}
            >
              <ChevronRight className="size-4" />
            </Button>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              onClick={(e) => goToSlide(index, e)}
              className={`shrink-0 size-16 md:size-18 rounded-md overflow-hidden border-2 transition-all ${
                index === safeIndex
                  ? 'border-primary ring-2 ring-primary/30 scale-105'
                  : 'border-transparent hover:border-muted-foreground/40 opacity-70 hover:opacity-100'
              }`}
              aria-label={`Go to image ${index + 1}`}
            >
              <ImageWithFallback
                src={image}
                alt={`${alt} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
