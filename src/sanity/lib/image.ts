import createImageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { dataset, projectId } from '../env';

// https://www.sanity.io/docs/image-url
const builder = createImageUrlBuilder({ projectId, dataset })

export const urlFor = (source: SanityImageSource) => {
    return builder.image(source)
}

/**
 * Get optimized image URL with specific dimensions and quality
 * @param source - Sanity image source
 * @param width - Target width in pixels
 * @param quality - Quality (1-100), default 75
 * @returns Optimized image URL
 */
export const getOptimizedImageUrl = (
    source: SanityImageSource,
    width: number = 1200,
    quality: number = 75
): string => {
    return builder
        .image(source)
        .width(width)
        .quality(quality)
        .auto('format')
        .fit('max')
        .url() || '';
}

/**
 * Get responsive image srcset for Sanity images
 * @param source - Sanity image source
 * @returns Object with src and srcset
 */
export const getResponsiveImageSrcSet = (source: SanityImageSource) => {
    const widths = [640, 750, 828, 1080, 1200, 1920];

    const srcSet = widths
        .map((width) => `${getOptimizedImageUrl(source, width, 75)} ${width}w`)
        .join(', ');

    return {
        src: getOptimizedImageUrl(source, 1200, 80),
        srcSet,
    };
}
