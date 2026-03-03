import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

// Robust export with fallback to empty array to prevent undefined errors in components
export const PlaceHolderImages: ImagePlaceholder[] = data?.placeholderImages || [];

export function getPlaceholderById(id: string): ImagePlaceholder | undefined {
  if (!PlaceHolderImages) return undefined;
  return PlaceHolderImages.find(img => img.id === id);
}
