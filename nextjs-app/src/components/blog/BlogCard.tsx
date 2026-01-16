import { cn } from '@/lib/utils';
import type { BlogPost } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

interface BlogCardProps {
    post: BlogPost;
    index?: number;
}

export function BlogCard({ post, index = 0 }: BlogCardProps) {
    const delay = (index % 3) * 100;

    const formattedDate = new Date(post.publishedAt).toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <article
            className={cn(
                'card group',
                'opacity-0 animate-fade-up',
                delay === 100 && 'animate-delay-100',
                delay === 200 && 'animate-delay-200'
            )}
        >
            <Link href={`/blog/${post.slug.current}`}>
                <div className="relative mb-4 aspect-video overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
                    {post.mainImage?.asset?.url ? (
                        <Image
                            src={post.mainImage.asset.url}
                            alt={post.mainImage.alt || post.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center">
                            <svg
                                className="h-12 w-12 text-neutral-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                                />
                            </svg>
                        </div>
                    )}
                </div>

                {/* Categories */}
                {post.categories && post.categories.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-2">
                        {post.categories.map((category) => (
                            <span
                                key={category.slug.current}
                                className="text-xs font-medium uppercase tracking-wide text-primary-600 dark:text-primary-400"
                            >
                                {category.title}
                            </span>
                        ))}
                    </div>
                )}

                <h3 className="heading-3 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                    {post.title}
                </h3>

                {post.excerpt && (
                    <p className="mt-2 line-clamp-2 text-neutral-600 dark:text-neutral-400">
                        {post.excerpt}
                    </p>
                )}

                <div className="mt-4 flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-500">
                    {post.author && (
                        <div className="flex items-center gap-2">
                            {post.author.image ? (
                                <Image
                                    src={post.author.image}
                                    alt={post.author.name}
                                    width={24}
                                    height={24}
                                    className="rounded-full"
                                />
                            ) : (
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-700">
                                    <span className="text-xs font-medium">
                                        {post.author.name.charAt(0)}
                                    </span>
                                </div>
                            )}
                            <span>{post.author.name}</span>
                        </div>
                    )}
                    <time dateTime={post.publishedAt}>{formattedDate}</time>
                </div>
            </Link>
        </article>
    );
}

export function BlogCardSkeleton() {
    return (
        <div className="card animate-pulse">
            <div className="mb-4 aspect-video rounded-lg bg-neutral-200 dark:bg-neutral-700" />
            <div className="mb-2 h-4 w-16 rounded bg-neutral-200 dark:bg-neutral-700" />
            <div className="h-6 w-full rounded bg-neutral-200 dark:bg-neutral-700" />
            <div className="mt-2 h-4 w-full rounded bg-neutral-200 dark:bg-neutral-700" />
            <div className="mt-2 h-4 w-2/3 rounded bg-neutral-200 dark:bg-neutral-700" />
            <div className="mt-4 flex items-center gap-4">
                <div className="h-6 w-6 rounded-full bg-neutral-200 dark:bg-neutral-700" />
                <div className="h-4 w-24 rounded bg-neutral-200 dark:bg-neutral-700" />
            </div>
        </div>
    );
}
