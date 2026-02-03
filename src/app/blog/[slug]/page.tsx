import { FadeInUp } from '@/components/animations';
import { BlogComments } from '@/components/comments';
import { SmartScrollOutline } from '@/components/navigation';
import { PortableTextRenderer } from '@/components/portable-text/PortableTextRenderer';
import { getAllPostSlugs, getPostBySlug } from '@/lib/data';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface BlogPostPageProps {
    params: Promise<{ slug: string }>;
}

// Generate static params for all blog posts
export async function generateStaticParams() {
    try {
        const slugs = await getAllPostSlugs();
        return slugs.map((slug) => ({ slug }));
    } catch (error) {
        console.error('Error generating static params:', error);
        return [];
    }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const { slug } = await params;

    try {
        const post = await getPostBySlug(slug);

        if (!post) {
            return {
                title: 'Yazı Bulunamadı',
            };
        }

        return {
            title: post.title,
            description: post.excerpt || '',
            openGraph: {
                title: post.title,
                description: post.excerpt || '',
                type: 'article',
                images: post.mainImage?.asset?.url ? [post.mainImage.asset.url] : [],
            },
        };
    } catch (error) {
        console.error('Error generating metadata:', error);
        return {
            title: 'Yazı Bulunamadı',
        };
    }
}

// ISR with long revalidation (24 hours)
export const revalidate = 86400; // 24 hours

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params;

    let post;
    try {
        post = await getPostBySlug(slug);
    } catch (error) {
        console.error('Error fetching post:', error);
        notFound();
    }

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

                {/* Featured Image */}
                {post.mainImage?.asset?.url && (
                    <div className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-2xl bg-neutral-900/50 ring-1 ring-white/10">
                        <img
                            src={post.mainImage.asset.url}
                            alt={post.mainImage.alt || post.title}\n                            className="aspect-video w-full h-auto object-cover\"\n                            loading=\"lazy\"\n                        />\n                    </div>\n                )}

                {/* Article Content */}
                <div className="prose-custom mx-auto mt-12 max-w-3xl">
                    {post.body && Array.isArray(post.body) && post.body.length > 0 ? (
                        <PortableTextRenderer value={post.body} />
                    ) : (
                        <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
                            {post.excerpt}
                        </p>
                    )}
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

                {/* Comments Section */}
                <FadeInUp delay={0.2}>
                    <div className="mx-auto mt-16 max-w-3xl">
                        <BlogComments slug={slug} title={post.title} />
                    </div>
                </FadeInUp>

                {/* Smart Scroll Outline (Table of Contents) */}
                <SmartScrollOutline contentSelector=".prose-custom" />
            </div>
        </article>
    );
}
