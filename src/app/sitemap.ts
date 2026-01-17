import { siteConfig } from '@/lib/constants';
import { getAllPosts, getAllProjects } from '@/lib/data';
import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';
export const revalidate = 86400; // 24 hours

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = siteConfig.url;

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/projects`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
    ];

    // Blog posts
    const posts = await getAllPosts();
    const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.publishedAt ? new Date(post.publishedAt) : new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }));

    // Projects
    const projects = await getAllProjects();
    const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
        url: `${baseUrl}/projects/${project.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }));

    return [...staticPages, ...blogPages, ...projectPages];
}
