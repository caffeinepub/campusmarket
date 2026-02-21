import { useState } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { ListingImage } from './ListingImage';
import type { ListingImage as ListingImageType } from '../../../backend';

interface ListingImageCarouselProps {
  images: ListingImageType[];
  title: string;
}

export function ListingImageCarousel({ images, title }: ListingImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-square w-full bg-muted flex items-center justify-center">
        <span className="text-muted-foreground">No images available</span>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full"
        setApi={(api) => {
          if (api) {
            api.on('select', () => {
              setCurrentIndex(api.selectedScrollSnap());
            });
          }
        }}
      >
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={image.id.toString()}>
              <div className="aspect-square w-full overflow-hidden bg-muted animate-in fade-in duration-300">
                <ListingImage image={image} alt={`${title} - Image ${index + 1}`} className="h-full w-full object-cover" />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {images.length > 1 && (
          <>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </>
        )}
      </Carousel>

      {/* Pagination indicator */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
          {images.map((_, index) => (
            <div
              key={index}
              className="h-1.5 rounded-full bg-white/60 backdrop-blur-sm transition-all duration-300"
              style={{
                width: currentIndex === index ? '24px' : '6px',
                backgroundColor: currentIndex === index ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.6)',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
