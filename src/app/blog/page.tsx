import { BlogCard, BlogCardSkeleton } from '@/components/blog/BlogCard';
import { getAllPosts } from '@/lib/data';
import type { BlogPost } from '@/types';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export const metadata: Metadata = {
    title: 'Blog',
    description: 'Teknoloji, yazılım geliştirme ve web üzerine yazılar.',
};

// ISR with medium revalidation (6 hours)
export const revalidate = 21600;

export default async function BlogPage() {
    const t = await getTranslations('blog');
    let posts: BlogPost[] = [];

    try {
        posts = await getAllPosts();
    } catch (error) {
        console.error('Error fetching posts:', error);
    }

    // Fallback demo posts if no data from Sanity
    const demoPosts = [
        {
            _id: '1',
            title: 'Next.js 15 ile Modern Web Geliştirme',
            slug: { current: 'nextjs-15-modern-web' },
            excerpt: 'Next.js 15 ile gelen yeni özellikler ve App Router kullanımı hakkında kapsamlı bir rehber.',
            publishedAt: '2024-01-15',
            author: { name: 'Admin' },
            categories: [{ title: 'Web Development', slug: { current: 'web-development' } }],
        },
        {
            _id: '2',
            title: 'TypeScript Best Practices',
            slug: { current: 'typescript-best-practices' },
            excerpt: 'TypeScript ile daha güvenli ve sürdürülebilir kod yazmanın yolları.',
            publishedAt: '2024-01-10',
            author: { name: 'Admin' },
            categories: [{ title: 'TypeScript', slug: { current: 'typescript' } }],
        },
        {
            _id: '3',
            title: 'Sanity CMS ile Headless İçerik Yönetimi',
            slug: { current: 'sanity-cms-headless' },
            excerpt: 'Sanity CMS kurulumu ve Next.js ile entegrasyonu adım adım.',
            publishedAt: '2024-01-05',
            author: { name: 'Admin' },
            categories: [{ title: 'CMS', slug: { current: 'cms' } }],
        },
    ] as BlogPost[];

    const displayPosts = posts.length > 0 ? posts : demoPosts;

    return (
        <div className="pt-28 pb-16">
            <div className="container-custom">
                {/* Page Header */}
                <div className="mb-12 max-w-2xl">
                    <h1 className="heading-1">{t('title')}</h1>
                    <p className="mt-4 text-lg text-neutral-300">
                        {t('subtitle')}
                    </p>
                    <div className="mt-6 grid gap-4 rounded-2xl glass-panel p-4 text-left sm:grid-cols-3">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-secondary-400">
                                {t('focus')}
                            </p>
                            <p className="mt-1 text-sm text-neutral-300">
                                {t('focusDesc')}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-secondary-400">
                                {t('format')}
                            </p>
                            <p className="mt-1 text-sm text-neutral-300">
                                {t('formatDesc')}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-secondary-400">
                                {t('goal')}
                            </p>
                            <p className="mt-1 text-sm text-neutral-300">
                                {t('goalDesc')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Blog Posts Grid */}
                {displayPosts.length > 0 ? (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {displayPosts.map((post, index) => (
                            <BlogCard key={post._id} post={post} index={index} />
                        ))}
                    </div>
                ) : (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                            <BlogCardSkeleton key={i} />
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {posts.length === 0 && (
                    <div className="mt-8 text-center">
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Demo içerik gösteriliyor. Sanity Studio&apos;dan gerçek içerik ekleyin.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
