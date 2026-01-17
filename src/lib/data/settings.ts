/**
 * Data Layer - Site Settings & Pages
 * Centralized data fetching with ISR and caching
 */

import { cacheTags, revalidationTimes } from '@/lib/revalidation';
import { sanityFetch } from '@/sanity/client';
import { pageBySlugQuery, siteSettingsQuery } from '@/sanity/queries';
import type { Page, SiteSettings } from '@/types';

/**
 * Get site settings
 * Cached with 'settings' tag, revalidates every 24 hours
 */
export async function getSiteSettings(): Promise<SiteSettings | null> {
    return sanityFetch<SiteSettings | null>({
        query: siteSettingsQuery,
        tags: [cacheTags.settings],
        revalidate: revalidationTimes.low, // 24 hours
    });
}

/**
 * Get a single page by slug
 * Cached with specific page tag, revalidates every 24 hours
 */
export async function getPageBySlug(slug: string): Promise<Page | null> {
    return sanityFetch<Page | null>({
        query: pageBySlugQuery,
        params: { slug },
        tags: [cacheTags.pages, cacheTags.page(slug)],
        revalidate: revalidationTimes.low, // 24 hours
    });
}
