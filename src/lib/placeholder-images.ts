import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

// Ensure PlaceHolderImages is always an array to prevent runtime errors during mapping
export const PlaceHolderImages: ImagePlaceholder[] = data?.placeholderImages || [];
