import { createClient, type SanityClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

// Check if Sanity is configured
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

// Validate projectId format (a-z, 0-9, and dashes only)
const isValidProjectId = projectId ? /^[a-z0-9-]+$/.test(projectId) : false;

// Only create client if projectId is configured and valid
const isSanityConfigured = isValidProjectId;

// Sanity client configuration
export const client: SanityClient | null = isSanityConfigured
    ? createClient({
        projectId: projectId!,
        dataset,
        apiVersion: '2026-01-18',
        useCdn: process.env.NODE_ENV === 'production',
        token: process.env.SANITY_API_TOKEN,
    })
    : null;

// Image URL builder
const builder = client ? imageUrlBuilder(client) : null;

// Export configuration status
export { isSanityConfigured };

/**
 * Generate optimized image URL from Sanity image reference
 */
export function urlFor(source: SanityImageSource) {
    if (!builder) {
        console.warn('Sanity is not configured. Image URL cannot be generated.');
        return { url: () => '' };
    }
    return builder.image(source);
}

/**
 * Fetch data from Sanity with proper caching
 * Returns empty array/null if Sanity is not configured
 */
export async function sanityFetch<T>({
    query,
    params = {},
    tags = [],
    revalidate,
}: {
    query: string;
    params?: Record<string, unknown>;
    tags?: string[];
    revalidate?: number | false;
}): Promise<T> {
    if (!client) {
        console.warn('Sanity is not configured. Returning empty result.');
        return [] as unknown as T;
    }

    try {
        return await client.fetch<T>(query, params, {
            next: {
                revalidate: revalidate ?? 3600, // Default: 1 hour
                tags,
            },
        });
    } catch (error) {
        console.warn('Error fetching data from Sanity (returning empty):', error instanceof Error ? error.message : error);
        return [] as unknown as T;
    }
}
