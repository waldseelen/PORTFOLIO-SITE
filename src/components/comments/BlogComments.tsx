'use client';

import Giscus from '@giscus/react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

interface BlogCommentsProps {
    slug: string;
    title?: string;
    className?: string;
}

// Giscus configuration - Update these values with your repository info
// To set up Giscus:
// 1. Go to https://giscus.app
// 2. Enter your repository name
// 3. Enable GitHub Discussions on your repository
// 4. Update the values below

const GISCUS_CONFIG = {
    repo: process.env.NEXT_PUBLIC_GISCUS_REPO || 'username/repo',
    repoId: process.env.NEXT_PUBLIC_GISCUS_REPO_ID || '',
    category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY || 'Blog Comments',
    categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID || '',
} as const;

export function BlogComments({ slug, title: _title, className }: BlogCommentsProps) {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Don't render until mounted to prevent hydration mismatch
    if (!mounted) {
        return (
            <div className={className}>
                <div className="animate-pulse space-y-4">
                    <div className="h-8 w-32 rounded bg-neutral-200 dark:bg-neutral-700" />
                    <div className="h-32 rounded-lg bg-neutral-100 dark:bg-neutral-800" />
                </div>
            </div>
        );
    }

    // Check if Giscus is configured
    if (!GISCUS_CONFIG.repoId || !GISCUS_CONFIG.categoryId) {
        return (
            <div className={className}>
                <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-6 text-center dark:border-neutral-700 dark:bg-neutral-800">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Yorum sistemi henüz yapılandırılmamış.
                    </p>
                    <p className="mt-2 text-xs text-neutral-500">
                        Giscus&apos;u etkinleştirmek için çevre değişkenlerini ayarlayın.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={className}>
            <h2 className="mb-6 text-2xl font-bold text-neutral-900 dark:text-neutral-50">
                Yorumlar
            </h2>
            <Giscus
                id="comments"
                repo={GISCUS_CONFIG.repo as `${string}/${string}`}
                repoId={GISCUS_CONFIG.repoId}
                category={GISCUS_CONFIG.category}
                categoryId={GISCUS_CONFIG.categoryId}
                mapping="specific"
                term={slug}
                reactionsEnabled="1"
                emitMetadata="0"
                inputPosition="top"
                theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
                lang="tr"
                loading="lazy"
            />
        </div>
    );
}
