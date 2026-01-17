/**
 * Data Layer - Blog Data Fetching
 * Centralized data fetching with ISR and caching
 */

import { cacheTags, revalidationTimes } from '@/lib/revalidation';
import { sanityFetch } from '@/sanity/client';
import {
    allPostsQuery,
    featuredPostsQuery,
    postBySlugQuery,
    postSlugsQuery,
} from '@/sanity/queries';
import type { BlogPost } from '@/types';

/**
 * Get all blog posts
 * Cached with 'posts' tag, revalidates every 6 hours
 */
export async function getAllPosts(): Promise<BlogPost[]> {
    return sanityFetch<BlogPost[]>({
        query: allPostsQuery,
        tags: [cacheTags.posts],
        revalidate: revalidationTimes.medium, // 6 hours
    });
}

/**
 * Get featured blog posts for homepage
 * Cached with 'posts' tag
 */
export async function getFeaturedPosts(limit: number = 3): Promise<BlogPost[]> {
    return sanityFetch<BlogPost[]>({
        query: featuredPostsQuery,
        params: { limit },
        tags: [cacheTags.posts],
        revalidate: revalidationTimes.medium,
    });
}

/**
 * Get a single blog post by slug
 * Cached with specific post tag, revalidates every 24 hours
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
    return sanityFetch<BlogPost | null>({
        query: postBySlugQuery,
        params: { slug },
        tags: [cacheTags.posts, cacheTags.post(slug)],
        revalidate: revalidationTimes.low, // 24 hours
    });
}

/**
 * Get all post slugs for static generation
 */
export async function getAllPostSlugs(): Promise<string[]> {
    return sanityFetch<string[]>({
        query: postSlugsQuery,
        tags: [cacheTags.posts],
        revalidate: revalidationTimes.medium,
    });
}

/**
 * Get posts by category
 */
export async function getPostsByCategory(categorySlug: string): Promise<BlogPost[]> {
    const query = `
        *[_type == "post" && $categorySlug in categories[]->slug.current] | order(publishedAt desc) {
            _id,
            title,
            slug,
            excerpt,
            publishedAt,
            "author": author->{
                name,
                "image": image.asset->url
            },
            "categories": categories[]->{
                title,
                slug
            },
            mainImage {
                asset->{
                    _id,
                    url
                },
                alt
            }
        }
    `;

    return sanityFetch<BlogPost[]>({
        query,
        params: { categorySlug },
        tags: [cacheTags.posts, cacheTags.categories],
        revalidate: revalidationTimes.medium,
    });
}

/**
 * Get related posts (same category, excluding current)
 */
export async function getRelatedPosts(
    currentSlug: string,
    categorySlug?: string,
    limit: number = 3
): Promise<BlogPost[]> {
    const query = `
        *[_type == "post" && slug.current != $currentSlug ${categorySlug ? '&& $categorySlug in categories[]->slug.current' : ''
        }] | order(publishedAt desc) [0...$limit] {
            _id,
            title,
            slug,
            excerpt,
            publishedAt,
            mainImage {
                asset->{
                    _id,
                    url
                },
                alt
            }
        }
    `;

    return sanityFetch<BlogPost[]>({
        query,
        params: { currentSlug, categorySlug, limit },
        tags: [cacheTags.posts],
        revalidate: revalidationTimes.medium,
    });
}
