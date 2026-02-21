import { useState } from 'react';
import type { ListingImage as ListingImageType } from '../../../backend';
import { cn } from '@/lib/utils';

interface ListingImageProps {
  image: ListingImageType;
  alt: string;
  className?: string;
  lazy?: boolean;
}

export function ListingImage({ image, alt, className, lazy = true }: ListingImageProps) {
  const [imageError, setImageError] = useState(false);

  // Handle preview URLs (object URLs from file picker)
  // Use direct URL from blob if available, otherwise fallback to url field
  const imageUrl = image.blob ? image.blob.getDirectURL() : image.url;

  if (imageError || !imageUrl) {
    return (
      <div className={cn('flex items-center justify-center bg-muted text-muted-foreground', className)}>
        <span className="text-sm">Image unavailable</span>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      className={className}
      onError={() => setImageError(true)}
      loading={lazy ? 'lazy' : 'eager'}
      decoding="async"
    />
  );
}
