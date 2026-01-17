/**
 * Data Layer - Project Data Fetching
 * Centralized data fetching with ISR and caching
 */

import { cacheTags, revalidationTimes } from '@/lib/revalidation';
import { sanityFetch } from '@/sanity/client';
import {
    allProjectsQuery,
    featuredProjectsQuery,
    projectBySlugQuery,
    projectSlugsQuery,
} from '@/sanity/queries';
import type { Project } from '@/types';

/**
 * Get all projects
 * Cached with 'projects' tag, revalidates every 6 hours
 */
export async function getAllProjects(): Promise<Project[]> {
    return sanityFetch<Project[]>({
        query: allProjectsQuery,
        tags: [cacheTags.projects],
        revalidate: revalidationTimes.medium, // 6 hours
    });
}

/**
 * Get featured projects for homepage
 * Cached with 'projects' tag
 */
export async function getFeaturedProjects(limit: number = 4): Promise<Project[]> {
    return sanityFetch<Project[]>({
        query: featuredProjectsQuery,
        params: { limit },
        tags: [cacheTags.projects],
        revalidate: revalidationTimes.medium,
    });
}

/**
 * Get a single project by slug
 * Cached with specific project tag, revalidates every 24 hours
 */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
    return sanityFetch<Project | null>({
        query: projectBySlugQuery,
        params: { slug },
        tags: [cacheTags.projects, cacheTags.project(slug)],
        revalidate: revalidationTimes.low, // 24 hours
    });
}

/**
 * Get all project slugs for static generation
 */
export async function getAllProjectSlugs(): Promise<string[]> {
    return sanityFetch<string[]>({
        query: projectSlugsQuery,
        tags: [cacheTags.projects],
        revalidate: revalidationTimes.medium,
    });
}

/**
 * Get projects by technology
 */
export async function getProjectsByTechnology(technology: string): Promise<Project[]> {
    const query = `
        *[_type == "project" && $technology in technologies] | order(order asc, _createdAt desc) {
            _id,
            title,
            slug,
            excerpt,
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
            },
            technologies,
            featured
        }
    `;

    return sanityFetch<Project[]>({
        query,
        params: { technology },
        tags: [cacheTags.projects],
        revalidate: revalidationTimes.medium,
    });
}

/**
 * Get all unique technologies from projects
 */
export async function getAllTechnologies(): Promise<string[]> {
    const query = `
        array::unique(*[_type == "project" && defined(technologies)].technologies[])
    `;

    return sanityFetch<string[]>({
        query,
        tags: [cacheTags.projects],
        revalidate: revalidationTimes.medium,
    });
}
