import React from 'react';
import heroFashionImg from '../assets/images/hero_crown_fashion_1790417371860.jpg';
import overcoatImg from '../assets/images/product_tailored_overcoat_1790417384963.jpg';
import silkDressImg from '../assets/images/product_silk_dress_1790417400989.jpg';
import merinoKnitImg from '../assets/images/product_merino_knitwear_1790417419287.jpg';
import courierFleetImg from '../assets/images/courier_fleet_tracking_1790417434344.jpg';
import bespokeSuitImg from '../assets/images/product_bespoke_suit_1790419434059.jpg';
import empressCapeImg from '../assets/images/product_empress_cape_1790419446512.jpg';
import silkScarfImg from '../assets/images/product_silk_scarf_1790419461191.jpg';
import craftsmanshipImg from '../assets/images/craftsmanship_atelier_1790419480360.jpg';
import flagshipImg from '../assets/images/flagship_boutique_1790419496331.jpg';

export {
  heroFashionImg,
  overcoatImg,
  silkDressImg,
  merinoKnitImg,
  courierFleetImg,
  bespokeSuitImg,
  empressCapeImg,
  silkScarfImg,
  craftsmanshipImg,
  flagshipImg,
};

// Map product IDs to their dedicated high-resolution local assets
export const PRODUCT_ASSET_MAP: Record<string, { image: string; secondaryImage: string }> = {
  'crw-01': {
    image: overcoatImg,
    secondaryImage: heroFashionImg,
  },
  'crw-02': {
    image: silkDressImg,
    secondaryImage: heroFashionImg,
  },
  'crw-03': {
    image: merinoKnitImg,
    secondaryImage: heroFashionImg,
  },
  'crw-04': {
    image: bespokeSuitImg,
    secondaryImage: overcoatImg,
  },
  'crw-05': {
    image: empressCapeImg,
    secondaryImage: silkDressImg,
  },
  'crw-06': {
    image: silkScarfImg,
    secondaryImage: merinoKnitImg,
  },
};

// Match filenames or keywords to ensure Vite-bundled hash asset URLs are always returned
const ASSET_FILENAME_LOOKUP: Array<{ pattern: RegExp | string; asset: string }> = [
  { pattern: /product_bespoke_suit/i, asset: bespokeSuitImg },
  { pattern: /product_empress_cape/i, asset: empressCapeImg },
  { pattern: /product_silk_scarf/i, asset: silkScarfImg },
  { pattern: /product_tailored_overcoat/i, asset: overcoatImg },
  { pattern: /product_silk_dress/i, asset: silkDressImg },
  { pattern: /product_merino_knitwear/i, asset: merinoKnitImg },
  { pattern: /courier_fleet_tracking/i, asset: courierFleetImg },
  { pattern: /craftsmanship_atelier/i, asset: craftsmanshipImg },
  { pattern: /flagship_boutique/i, asset: flagshipImg },
  { pattern: /hero_crown_fashion/i, asset: heroFashionImg },
];

/**
 * Resolves any image URL to ensure it loads reliably in development,
 * in production builds, and on deployed hosting environments.
 */
export function resolveImageUrl(
  src?: string | null,
  productId?: string,
  isSecondary = false
): string {
  // If product ID matches our catalog, prefer the bundled asset
  if (productId && PRODUCT_ASSET_MAP[productId]) {
    const productAssets = PRODUCT_ASSET_MAP[productId];
    if (isSecondary) {
      return productAssets.secondaryImage;
    }
    // If src is missing or points to a local path, use the dedicated asset
    if (!src || src.includes('assets/images') || src.startsWith('/src/')) {
      return productAssets.image;
    }
  }

  if (!src) {
    if (productId && PRODUCT_ASSET_MAP[productId]) {
      return PRODUCT_ASSET_MAP[productId].image;
    }
    return overcoatImg;
  }

  // If already a valid full external URL (http/https/data/blob)
  if (src.startsWith('data:') || src.startsWith('blob:')) {
    return src;
  }

  // Check known asset filename patterns (matches both /src/assets/images/... and /assets/images/...)
  for (const item of ASSET_FILENAME_LOOKUP) {
    if (typeof item.pattern === 'string') {
      if (src.includes(item.pattern)) return item.asset;
    } else if (item.pattern.test(src)) {
      return item.asset;
    }
  }

  // If it's a relative path pointing to src/assets/images, convert to public /images/ path
  if (src.startsWith('/src/assets/images/')) {
    const filename = src.replace('/src/assets/images/', '');
    return `/images/${filename}`;
  }

  return src;
}

/**
 * Fallback handler for <img> onError events to guarantee an image is always displayed.
 */
export function handleImageError(
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackSrc?: string
) {
  const target = event.currentTarget;
  if (target.dataset.hasFailed) {
    return;
  }
  target.dataset.hasFailed = 'true';
  target.src = fallbackSrc || overcoatImg;
}
