import { PortableText, PortableTextComponents } from '@portabletext/react';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

// Type definitions for Sanity Portable Text blocks
interface ImageValue {
    asset: {
        _id: string;
        url: string;
    };
    alt?: string;
    caption?: string;
}

interface CodeBlockValue {
    code: string;
    language?: string;
    filename?: string;
}

interface YoutubeValue {
    url?: string;
}

interface CalloutValue {
    text: string;
    type?: 'info' | 'warning' | 'success' | 'error' | 'tip';
}

interface LinkValue {
    href?: string;
}

interface InternalLinkValue {
    reference?: {
        _type: string;
        slug?: {
            current: string;
        };
    };
}

interface PullQuoteValue {
    quote?: string;
    attribution?: string;
}

/**
 * Custom PortableText components for rendering Sanity block content
 */
export const portableTextComponents: PortableTextComponents = {
    types: {
        image: ({ value }: { value: ImageValue }) => {
            if (!value?.asset?.url) return null;

            return (
                <figure className="my-8 w-full">
                    <div className="relative w-full overflow-hidden rounded-lg bg-neutral-200 dark:bg-neutral-800" style={{ aspectRatio: '16/9' }}>
                        <Image
                            src={value.asset.url}
                            alt={value.alt || 'İçerik görseli'}
                            fill
                            className="object-contain"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 800px"
                            quality={85}
                            loading="lazy"
                        />
                    </div>
                    {value.caption && (
                        <figcaption className="mt-3 text-center text-sm text-neutral-600 dark:text-neutral-400">
                            {value.caption}
                        </figcaption>
                    )}
                </figure>
            );
        },
        codeBlock: ({ value }: { value: CodeBlockValue }) => {
            return (
                <div className="my-6 overflow-hidden rounded-lg bg-neutral-950 ring-1 ring-neutral-800">
                    {value.filename && (
                        <div className="border-b border-neutral-800 bg-neutral-900 px-4 py-2 text-sm font-medium text-neutral-400">
                            <code>{value.filename}</code>
                        </div>
                    )}
                    <pre className="overflow-x-auto p-4">
                        <code className={`language-${value.language || 'text'} text-neutral-300`}>
                            {value.code}
                        </code>
                    </pre>
                </div>
            );
        },
        youtube: ({ value }: { value: YoutubeValue }) => {
            const videoId = value.url?.match(
                /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
            )?.[1];

            if (!videoId) return null;

            return (
                <div className="my-8 aspect-video overflow-hidden rounded-lg">
                    <iframe
                        src={`https://www.youtube.com/embed/${videoId}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="h-full w-full"
                        title="YouTube video"
                    />
                </div>
            );
        },
        pullQuote: ({ value }: { value: PullQuoteValue }) => {
            return (
                <blockquote className="my-8 border-l-4 border-primary-500 bg-primary-500/10 pl-6 py-4 italic text-lg text-neutral-700 dark:text-neutral-300">
                    <p className="mb-3">{value.quote}</p>
                    {value.attribution && (
                        <footer className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                            — {value.attribution}
                        </footer>
                    )}
                </blockquote>
            );
        },
        callout: ({ value }: { value: CalloutValue }) => {
            const styles = {
                info: 'border-blue-500 bg-blue-50 dark:bg-blue-950',
                warning: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950',
                success: 'border-green-500 bg-green-50 dark:bg-green-950',
                error: 'border-red-500 bg-red-50 dark:bg-red-950',
                tip: 'border-purple-500 bg-purple-50 dark:bg-purple-950',
            };

            const icons = {
                info: 'ℹ️',
                warning: '⚠️',
                success: '✅',
                error: '❌',
                tip: '💡',
            };

            const type = value.type || 'info';

            return (
                <div className={`my-6 rounded-lg border-l-4 p-4 ${styles[type as keyof typeof styles]}`}>
                    <div className="flex items-start gap-3">
                        <span className="text-xl">{icons[type as keyof typeof icons]}</span>
                        <p className="text-neutral-700 dark:text-neutral-300">{value.text}</p>
                    </div>
                </div>
            );
        },
    },
    marks: {
        link: ({ children, value }: { children?: ReactNode; value?: LinkValue }) => {
            const href = value?.href || '';
            const isExternal = href.startsWith('http');

            if (isExternal) {
                return (
                    <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 underline decoration-primary-400 underline-offset-2 hover:decoration-primary-600 dark:text-primary-400"
                    >
                        {children}
                    </a>
                );
            }

            return (
                <Link
                    href={href}
                    className="text-primary-600 underline decoration-primary-400 underline-offset-2 hover:decoration-primary-600 dark:text-primary-400"
                >
                    {children}
                </Link>
            );
        },
        internalLink: ({ children, value }: { children?: ReactNode; value?: InternalLinkValue }) => {
            const ref = value?.reference;
            if (!ref) return <>{children}</>;

            const href =
                ref._type === 'post'
                    ? `/blog/${ref.slug?.current}`
                    : ref._type === 'project'
                        ? `/projects/${ref.slug?.current}`
                        : `/${ref.slug?.current}`;

            return (
                <Link
                    href={href}
                    className="text-primary-600 underline decoration-primary-400 underline-offset-2 hover:decoration-primary-600 dark:text-primary-400"
                >
                    {children}
                </Link>
            );
        },
        code: ({ children }: { children?: ReactNode }) => (
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-sm text-primary-700 dark:bg-neutral-800 dark:text-primary-300">
                {children}
            </code>
        ),
    },
    block: {
        h1: ({ children }: { children?: ReactNode }) => (
            <h1 className="mt-12 mb-4 text-4xl font-bold text-neutral-900 dark:text-white scroll-mt-20">
                {children}
            </h1>
        ),
        h2: ({ children }: { children?: ReactNode }) => (
            <h2 className="mt-10 mb-4 text-3xl font-bold text-neutral-900 dark:text-white scroll-mt-20">
                {children}
            </h2>
        ),
        h3: ({ children }: { children?: ReactNode }) => (
            <h3 className="mt-8 mb-3 text-2xl font-bold text-neutral-900 dark:text-white scroll-mt-20">
                {children}
            </h3>
        ),
        h4: ({ children }: { children?: ReactNode }) => (
            <h4 className="mt-6 mb-2 text-lg font-bold text-neutral-900 dark:text-white scroll-mt-20">
                {children}
            </h4>
        ),
        blockquote: ({ children }: { children?: ReactNode }) => (
            <blockquote className="my-6 border-l-4 border-primary-500/50 bg-primary-500/5 pl-4 italic text-neutral-600 dark:text-neutral-400 py-3">
                {children}
            </blockquote>
        ),
        normal: ({ children }: { children?: ReactNode }) => (
            <p className="my-4 leading-relaxed text-neutral-700 dark:text-neutral-300 max-w-none">
                {children}
            </p>
        ),
    },
    list: {
        bullet: ({ children }: { children?: ReactNode }) => (
            <ul className="my-4 ml-6 list-disc space-y-2 text-neutral-700 dark:text-neutral-300">
                {children}
            </ul>
        ),
        number: ({ children }: { children?: ReactNode }) => (
            <ol className="my-4 ml-6 list-decimal space-y-2 text-neutral-700 dark:text-neutral-300">
                {children}
            </ol>
        ),
    },
};

interface PortableTextRendererProps {
    value: unknown;
}

export function PortableTextRenderer({ value }: PortableTextRendererProps) {
    if (!value) return null;

    return <PortableText value={value as never} components={portableTextComponents} />;
}
