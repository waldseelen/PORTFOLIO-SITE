/**
 * Sanity Revalidation Utilities
 * Helper functions for on-demand revalidation
 */

import { revalidatePath, revalidateTag } from 'next/cache';

/**
 * Revalidate content by type and optional slug
 */
export async function revalidateContent(
    type: 'post' | 'project' | 'page' | 'author' | 'category' | 'settings',
    slug?: string
): Promise<{ paths: string[]; tags: string[] }> {
    const paths: string[] = [];
    const tags: string[] = [];

    switch (type) {
        case 'post':
            revalidateTag('posts');
            tags.push('posts');
            revalidatePath('/blog');
            paths.push('/blog');
            if (slug) {
                revalidateTag(`post-${slug}`);
                tags.push(`post-${slug}`);
                revalidatePath(`/blog/${slug}`);
                paths.push(`/blog/${slug}`);
            }
            break;

        case 'project':
            revalidateTag('projects');
            tags.push('projects');
            revalidatePath('/projects');
            paths.push('/projects');
            if (slug) {
                revalidateTag(`project-${slug}`);
                tags.push(`project-${slug}`);
                revalidatePath(`/projects/${slug}`);
                paths.push(`/projects/${slug}`);
            }
            break;

        case 'page':
            if (slug) {
                revalidateTag(`page-${slug}`);
                tags.push(`page-${slug}`);
                revalidatePath(`/${slug}`);
                paths.push(`/${slug}`);
            }
            break;

        case 'author':
            revalidateTag('posts');
            tags.push('posts');
            break;

        case 'category':
            revalidateTag('posts');
            revalidateTag('projects');
            tags.push('posts', 'projects');
            break;

        case 'settings':
            revalidateTag('settings');
            tags.push('settings');
            revalidatePath('/', 'layout');
            paths.push('/');
            break;
    }

    return { paths, tags };
}

/**
 * Cache tags used throughout the application
 */
export const cacheTags = {
    posts: 'posts',
    post: (slug: string) => `post-${slug}`,
    projects: 'projects',
    project: (slug: string) => `project-${slug}`,
    pages: 'pages',
    page: (slug: string) => `page-${slug}`,
    settings: 'settings',
    authors: 'authors',
    categories: 'categories',
} as const;

/**
 * Revalidation times in seconds
 */
export const revalidationTimes = {
    // Low frequency - 24 hours (for rarely changing content)
    low: 86400,
    // Medium frequency - 6 hours (for blog posts, projects)
    medium: 21600,
    // High frequency - 1 hour (for time-sensitive content)
    high: 3600,
    // Very high - 5 minutes (for near real-time needs)
    veryHigh: 300,
} as const;
