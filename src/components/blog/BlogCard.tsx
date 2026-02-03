'use client';

import { cn } from '@/lib/utils';
import type { BlogPost } from '@/types';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

interface BlogCardProps {
    post: BlogPost;
    index?: number;
}

export function BlogCard({ post, index = 0 }: BlogCardProps) {
    const formattedDate = new Date(post.publishedAt).toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative h-full"
        >
            <Link href={`/blog/${post.slug.current}`} className="block h-full">
                <div className={cn(
                    'glass-panel relative h-full overflow-hidden p-4',
                    'hover:shadow-[0_0_30px_rgba(0,240,255,0.15)]',
                    'border border-white/5 hover:border-primary-500/30',
                    'isolate'
                )}>
                    {/* Hover Glow Effect */}
                    <div className="absolute -inset-1 -z-10 rounded-2xl bg-gradient-to-r from-primary-500/20 to-secondary-500/20 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />

                    {/* Image Container */}
                    <div className="relative mb-4 aspect-video overflow-hidden rounded-lg bg-neutral-900/50 flex-shrink-0">
                        {post.mainImage?.asset?.url ? (
                            <Image
                                src={post.mainImage.asset.url}
                                alt={post.mainImage.alt || post.title}
                                fill
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, (max-width: 1280px) 45vw, 33vw"
                                quality={75}
                                loading="lazy"
                                placeholder="blur"
                                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzBBMEEwQSIvPjwvc3ZnPg=="
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center border border-white/5 bg-[#0A0A0A]">
                                <svg
                                    className="h-12 w-12 text-neutral-700"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    aria-hidden="true"
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

                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#030014] via-transparent to-transparent opacity-60" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 flex flex-col flex-grow min-h-0">
                        {/* Categories */}
                        {post.categories && post.categories.length > 0 && (
                            <div className="mb-3 flex flex-wrap gap-2">
                                {post.categories.map((category) => (
                                    <span
                                        key={category.slug.current}
                                        className="inline-flex items-center rounded-full border border-primary-500/30 bg-primary-500/10 px-2.5 py-0.5 text-xs font-medium text-primary-400 shadow-[0_0_10px_rgba(0,240,255,0.1)] backdrop-blur-md"
                                    >
                                        {category.title}
                                    </span>
                                ))}
                            </div>
                        )}

                        <h3 className="heading-3 mb-2 line-clamp-2 text-xl font-bold text-white transition-colors group-hover:text-primary-400">
                            {post.title}
                        </h3>

                        {post.excerpt && (
                            <p className="mb-4 line-clamp-2 text-sm text-neutral-400">
                                {post.excerpt}
                            </p>
                        )}

                        <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4 text-xs text-neutral-500">
                            <div className="flex items-center gap-2">
                                {post.author?.image ? (
                                    <Image
                                        src={post.author.image}
                                        alt={post.author.name}
                                        width={24}
                                        height={24}
                                        className="rounded-full ring-1 ring-white/10"
                                    />
                                ) : (
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-800 ring-1 ring-white/10">
                                        <span className="text-[10px] font-medium text-neutral-400">
                                            {post.author?.name.charAt(0)}
                                        </span>
                                    </div>
                                )}
                                <span className="text-neutral-400">{post.author?.name}</span>
                            </div>
                            <time dateTime={post.publishedAt} className="font-mono text-primary-500/70">
                                {formattedDate}
                            </time>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.article>
    );
}

export function BlogCardSkeleton() {
    return (
        <div className="glass-panel animate-pulse p-4">
            <div className="mb-4 aspect-video rounded-lg bg-neutral-800/50" />
            <div className="mb-2 h-4 w-16 rounded bg-neutral-800/50" />
            <div className="mb-2 h-6 w-full rounded bg-neutral-800/50" />
            <div className="mb-4 h-4 w-2/3 rounded bg-neutral-800/50" />
            <div className="flex items-center justify-between pt-4">
                <div className="h-6 w-24 rounded bg-neutral-800/50" />
                <div className="h-4 w-20 rounded bg-neutral-800/50" />
            </div>
        </div>
    );
}
