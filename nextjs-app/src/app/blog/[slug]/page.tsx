import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
// import { sanityFetch } from '@/sanity/client';
// import { postBySlugQuery, postSlugsQuery } from '@/sanity/queries';

interface BlogPostPageProps {
    params: Promise<{ slug: string }>;
}

// Generate static params for all blog posts
export async function generateStaticParams() {
    // TODO: Sanity entegrasyonunda bu kısım aktif edilecek
    // const slugs = await sanityFetch<string[]>({
    //   query: postSlugsQuery,
    //   tags: [cacheTags.blog],
    // });
    // return slugs.map((slug) => ({ slug }));

    return [
        { slug: 'nextjs-15-modern-web' },
        { slug: 'typescript-best-practices' },
        { slug: 'sanity-cms-headless' },
    ];
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const { slug } = await params;

    // TODO: Sanity'den post verisi çekilecek
    const post = {
        title: `Blog Post: ${slug}`,
        excerpt: 'Bu bir blog yazısı açıklamasıdır.',
    };

    if (!post) {
        return {
            title: 'Yazı Bulunamadı',
        };
    }

    return {
        title: post.title,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: 'article',
        },
    };
}

// ISR with long revalidation (24 hours)
export const revalidate = 86400; // 24 hours

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params;

    // TODO: Sanity entegrasyonunda bu kısım aktif edilecek
    // const post = await sanityFetch({
    //   query: postBySlugQuery,
    //   params: { slug },
    //   tags: [cacheTags.blogPost(slug)],
    // });

    // Placeholder post for initial setup
    const post = {
        _id: '1',
        title: `Blog Post: ${slug}`,
        slug: { current: slug },
        excerpt: 'Bu bir blog yazısı açıklamasıdır.',
        body: 'Bu alan Sanity PortableText ile doldurulacak.',
        publishedAt: '2024-01-15',
        author: { name: 'Admin', bio: 'Full-Stack Developer', image: null },
        categories: [{ title: 'Web Development', slug: { current: 'web-development' } }],
    };

    if (!post) {
        notFound();
    }

    return (
        <article className="section">
            <div className="container-custom">
                {/* Breadcrumb */}
                <nav className="mb-8" aria-label="Breadcrumb">
                    <ol className="flex items-center gap-2 text-sm text-neutral-500">
                        <li>
                            <Link href="/" className="hover:text-neutral-900 dark:hover:text-neutral-50">
                                Ana Sayfa
                            </Link>
                        </li>
                        <li>/</li>
                        <li>
                            <Link href="/blog" className="hover:text-neutral-900 dark:hover:text-neutral-50">
                                Blog
                            </Link>
                        </li>
                        <li>/</li>
                        <li className="text-neutral-900 dark:text-neutral-50">{post.title}</li>
                    </ol>
                </nav>

                {/* Article Header */}
                <header className="mx-auto max-w-3xl text-center">
                    {/* Categories */}
                    <div className="mb-4 flex flex-wrap justify-center gap-2">
                        {post.categories?.map((cat) => (
                            <span
                                key={cat.slug.current}
                                className="rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-700 dark:bg-primary-900 dark:text-primary-300"
                            >
                                {cat.title}
                            </span>
                        ))}
                    </div>

                    <h1 className="heading-1 text-balance">{post.title}</h1>

                    {/* Meta */}
                    <div className="mt-6 flex items-center justify-center gap-4 text-neutral-600 dark:text-neutral-400">
                        <div className="flex items-center gap-2">
                            <div className="h-10 w-10 rounded-full bg-neutral-200 dark:bg-neutral-700" />
                            <span className="font-medium">{post.author?.name}</span>
                        </div>
                        <span>•</span>
                        <time dateTime={post.publishedAt}>
                            {new Date(post.publishedAt).toLocaleDateString('tr-TR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </time>
                    </div>
                </header>

                {/* Featured Image Placeholder */}
                <div className="mx-auto mt-10 max-w-4xl">
                    <div className="aspect-video rounded-2xl bg-neutral-100 dark:bg-neutral-800" />
                </div>

                {/* Article Content */}
                <div className="prose-custom mx-auto mt-12 max-w-3xl">
                    {/* TODO: PortableText ile içerik render edilecek */}
                    <p className="text-lg leading-relaxed">
                        {post.excerpt}
                    </p>
                    <p className="mt-6 text-neutral-600 dark:text-neutral-400">
                        Bu alan Sanity CMS entegrasyonu tamamlandığında PortableText komponenti ile
                        zengin içerik olarak render edilecektir.
                    </p>
                </div>

                {/* Article Footer */}
                <footer className="mx-auto mt-16 max-w-3xl border-t border-neutral-200 pt-8 dark:border-neutral-800">
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-neutral-200 dark:bg-neutral-700" />
                        <div>
                            <p className="font-semibold text-neutral-900 dark:text-neutral-50">
                                {post.author?.name}
                            </p>
                            <p className="text-neutral-600 dark:text-neutral-400">{post.author?.bio}</p>
                        </div>
                    </div>
                </footer>
            </div>
        </article>
    );
}
