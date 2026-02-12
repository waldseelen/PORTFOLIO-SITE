'use client';

import { trackEvent } from '@/components/analytics';
import { useDebounce } from '@/hooks/useDebounce';
import { Command } from 'cmdk';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface SearchResult {
    posts: Array<{
        _id: string;
        _type: string;
        title: string;
        slug: { current: string };
        excerpt?: string;
    }>;
    projects: Array<{
        _id: string;
        _type: string;
        title: string;
        slug: { current: string };
        excerpt?: string;
    }>;
}

const OPEN_SEARCH_COMMAND_EVENT = 'open-search-command';

export function SearchCommand() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<SearchResult>({ posts: [], projects: [] });

    const debouncedSearch = useDebounce(search, 300);

    // Toggle with CMD+K
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
            if (e.key === 'Escape') {
                setOpen(false);
            }
        };
        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    useEffect(() => {
        const handleOpen = () => setOpen(true);
        window.addEventListener(OPEN_SEARCH_COMMAND_EVENT, handleOpen);
        return () => window.removeEventListener(OPEN_SEARCH_COMMAND_EVENT, handleOpen);
    }, []);

    // Fetch results
    useEffect(() => {
        if (!debouncedSearch || debouncedSearch.length < 2) {
            setResults({ posts: [], projects: [] });
            return;
        }

        const fetchResults = async () => {
            setLoading(true);
            try {
                // Track search
                trackEvent('search', 'User Interaction', debouncedSearch);

                const res = await fetch(`/api/search?q=${encodeURIComponent(debouncedSearch)}`);
                const data = await res.json();
                if (data.success) {
                    setResults(data.data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [debouncedSearch]);

    const runCommand = (command: () => void) => {
        setOpen(false);
        command();
    };

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/50 pt-[20vh] backdrop-blur-sm transition-all"
            role="dialog"
            aria-modal="true"
            aria-label="Site içi arama"
        >
            <Command
                className="w-full max-w-lg overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900"
                shouldFilter={false} // We sort/filter on server
            >
                <div className="flex items-center border-b border-neutral-200 px-3 dark:border-neutral-800" cmdk-input-wrapper="">
                    <svg className="mr-2 h-4 w-4 shrink-0 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <Command.Input
                        value={search}
                        onValueChange={setSearch}
                        placeholder="Ara... (Blog, Projeler)"
                        className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-neutral-500 disabled:cursor-not-allowed disabled:opacity-50 dark:placeholder:text-neutral-400"
                    />
                    {loading && <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />}
                    <button
                        type="button"
                        className="ml-2 rounded-md bg-neutral-100 p-1 text-xs text-neutral-500 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400"
                        onClick={() => setOpen(false)}
                    >
                        ESC
                    </button>
                </div>

                <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2" aria-busy={loading}>
                    {!loading && results.posts.length === 0 && results.projects.length === 0 && search.length > 0 && (
                        <Command.Empty className="py-6 text-center text-sm">Sonuç bulunamadı.</Command.Empty>
                    )}

                    {/* Suggestions when empty */}
                    {!search && (
                        <Command.Group heading="Öneriler">
                            <Command.Item
                                onSelect={() => runCommand(() => router.push('/blog'))}
                                className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-neutral-100 aria-selected:text-neutral-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:aria-selected:bg-neutral-800 dark:aria-selected:text-neutral-50"
                            >
                                📝 Tüm Blog Yazıları
                            </Command.Item>
                            <Command.Item
                                onSelect={() => runCommand(() => router.push('/projects'))}
                                className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-neutral-100 aria-selected:text-neutral-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:aria-selected:bg-neutral-800 dark:aria-selected:text-neutral-50"
                            >
                                🚀 Tüm Projeler
                            </Command.Item>
                            <Command.Item
                                onSelect={() => runCommand(() => router.push('/contact'))}
                                className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-neutral-100 aria-selected:text-neutral-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:aria-selected:bg-neutral-800 dark:aria-selected:text-neutral-50"
                            >
                                👋 İletişim
                            </Command.Item>
                        </Command.Group>
                    )}

                    {results.posts.length > 0 && (
                        <Command.Group heading="Blog">
                            {results.posts.map((post) => (
                                <Command.Item
                                    key={post._id}
                                    onSelect={() => runCommand(() => router.push(`/blog/${post.slug.current}`))}
                                    className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-neutral-100 aria-selected:text-neutral-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:aria-selected:bg-neutral-800 dark:aria-selected:text-neutral-50"
                                >
                                    <span className="mr-2">📝</span>
                                    <div className="flex flex-col">
                                        <span>{post.title}</span>
                                        {post.excerpt && <span className="text-xs text-neutral-500 line-clamp-1">{post.excerpt}</span>}
                                    </div>
                                </Command.Item>
                            ))}
                        </Command.Group>
                    )}

                    {results.projects.length > 0 && (
                        <Command.Group heading="Projeler">
                            {results.projects.map((project) => (
                                <Command.Item
                                    key={project._id}
                                    onSelect={() => runCommand(() => router.push(`/projects/${project.slug.current}`))}
                                    className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-neutral-100 aria-selected:text-neutral-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:aria-selected:bg-neutral-800 dark:aria-selected:text-neutral-50"
                                >
                                    <span className="mr-2">🚀</span>
                                    <div className="flex flex-col">
                                        <span>{project.title}</span>
                                        {project.excerpt && <span className="text-xs text-neutral-500 line-clamp-1">{project.excerpt}</span>}
                                    </div>
                                </Command.Item>
                            ))}
                        </Command.Group>
                    )}
                </Command.List>
            </Command>
        </div>
    );
}

// Button to trigger search
export function SearchButton() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <button
            type="button"
            onClick={() => {
                window.dispatchEvent(new CustomEvent(OPEN_SEARCH_COMMAND_EVENT));
            }}
            className="flex items-center gap-2 rounded-md border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-sm text-neutral-500 transition-colors hover:border-neutral-300 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200"
        >
            <span className="text-xs">Ara...</span>
            <kbd className="hidden rounded bg-neutral-200 px-1 py-0.5 text-[10px] font-bold dark:bg-neutral-800 md:inline-flex">
                CMD K
            </kbd>
        </button>
    );
}
