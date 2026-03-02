
import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

// Ensure we have a safe fallback to an empty array to prevent "undefined" errors
export const PlaceHolderImages: ImagePlaceholder[] = data?.placeholderImages || [];

export function getPlaceholderById(id: string): ImagePlaceholder | undefined {
  return PlaceHolderImages.find(img => img.id === id);
}
