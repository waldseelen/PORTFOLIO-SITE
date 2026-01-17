// Site configuration constants
export const siteConfig = {
    name: process.env.NEXT_PUBLIC_SITE_NAME || 'Portfolio',
    description: 'Modern portfolio website built with Next.js and Sanity',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com',
    author: {
        name: 'Your Name',
        email: 'email@example.com',
        twitter: '@yourhandle',
    },
    links: {
        github: 'https://github.com/yourusername',
        linkedin: 'https://linkedin.com/in/yourusername',
        twitter: 'https://twitter.com/yourhandle',
    },
} as const;

// Navigation items
export const navItems = [
    { label: 'Ana Sayfa', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: 'Projeler', href: '/projects' },
    { label: 'Hakkımda', href: '/about' },
    { label: 'İletişim', href: '/contact' },
] as const;

// ISR revalidation times (in seconds)
export const revalidateTimes = {
    short: 60 * 60, // 1 hour
    medium: 6 * 60 * 60, // 6 hours
    long: 24 * 60 * 60, // 24 hours
} as const;

// Cache tags for on-demand revalidation
export const cacheTags = {
    blog: 'blog',
    blogPost: (slug: string) => `blog-post-${slug}`,
    projects: 'projects',
    project: (slug: string) => `project-${slug}`,
    pages: 'pages',
    page: (slug: string) => `page-${slug}`,
} as const;
