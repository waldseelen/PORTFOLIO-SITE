import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bugragormus.com';

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
            },
            // Block AI training bots
            {
                userAgent: 'GPTBot',
                disallow: '/',
            },
            {
                userAgent: 'ChatGPT-User',
                disallow: '/',
            },
            {
                userAgent: 'CCBot',
                disallow: '/',
            },
            {
                userAgent: 'anthropic-ai',
                disallow: '/',
            },
            {
                userAgent: 'Google-Extended',
                disallow: '/',
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
