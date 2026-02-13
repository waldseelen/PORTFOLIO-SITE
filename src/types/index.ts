// Blog Post Types
export interface Author {
    name: string;
    bio?: string;
    image?: string;
}

export interface Category {
    title: string;
    slug: {
        current: string;
    };
}

export interface SanityImage {
    asset: {
        _id: string;
        url: string;
    };
    alt?: string;
}

export interface SEO {
    metaTitle?: string;
    metaDescription?: string;
    shareGraphic?: SanityImage;
}

export interface BlogPost {
    _id: string;
    title: string;
    slug: {
        current: string;
    };
    excerpt?: string;
    body?: unknown; // PortableText content
    publishedAt: string;
    author?: Author;
    categories?: Category[];
    mainImage?: SanityImage;
    seo?: SEO;
}

// Project Types
export interface Project {
    _id: string;
    title: string;
    slug: {
        current: string;
    };
    excerpt?: string;
    body?: unknown; // PortableText content
    categories?: Category[];
    mainImage?: SanityImage;
    technologies?: string[];
    githubUrl?: string;
    liveUrl?: string;
    featured?: boolean;
    order?: number;
    status?: 'in-progress' | 'completed' | 'archived';
    startDate?: string;
    endDate?: string;
    seo?: SEO;
}

// Page Types
export interface Page {
    _id: string;
    title: string;
    slug: {
        current: string;
    };
    body?: unknown; // PortableText content
    seo?: SEO;
}

// Site Settings Types
export interface SiteSettings {
    title: string;
    description?: string;
    logo?: SanityImage;
    ogImage?: SanityImage;
    author?: {
        name: string;
        email?: string;
        bio?: string;
        avatar?: SanityImage;
    };
    social?: {
        twitter?: string;
        github?: string;
        linkedin?: string;
        instagram?: string;
        youtube?: string;
    };
    analytics?: {
        googleAnalyticsId?: string;
        googleTagManagerId?: string;
    };
    contact?: {
        email?: string;
        phone?: string;
        address?: string;
    };
}

// Navigation Types
export interface NavItem {
    label: string;
    href: string;
    children?: NavItem[];
}

// Form Types
export interface ContactFormData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

// API Response Types
export interface ApiResponse<T = unknown> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
}
