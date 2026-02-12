'use client';

import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';

interface Heading {
    id: string;
    text: string;
    level: number;
}

interface SmartScrollOutlineProps {
    contentSelector?: string;
    className?: string;
}

export function SmartScrollOutline({
    contentSelector = 'article',
    className
}: SmartScrollOutlineProps) {
    const [headings, setHeadings] = useState<Heading[]>([]);
    const [activeId, setActiveId] = useState<string>('');
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    // Extract headings from content
    useEffect(() => {
        const content = document.querySelector(contentSelector);
        if (!content) return;

        const headingElements = content.querySelectorAll('h2, h3, h4');
        const extractedHeadings: Heading[] = [];

        headingElements.forEach((heading, index) => {
            // Generate ID if not present
            if (!heading.id) {
                heading.id = `heading-${index}-${heading.textContent?.slice(0, 20).toLowerCase().replace(/\s+/g, '-') || index}`;
            }

            extractedHeadings.push({
                id: heading.id,
                text: heading.textContent || '',
                level: parseInt(heading.tagName.charAt(1)),
            });
        });

        setHeadings(extractedHeadings);

        // Set initial active heading
        if (extractedHeadings.length > 0) {
            setActiveId(extractedHeadings[0].id);
        }
    }, [contentSelector]);

    // Intersection Observer for scroll spy
    useEffect(() => {
        if (headings.length === 0) return;

        // Cleanup previous observer
        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        const observerOptions: IntersectionObserverInit = {
            rootMargin: '-80px 0px -60% 0px',
            threshold: [0, 0.5, 1],
        };

        observerRef.current = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveId(entry.target.id);
                }
            });
        }, observerOptions);

        // Observe all headings
        headings.forEach(({ id }) => {
            const element = document.getElementById(id);
            if (element) {
                observerRef.current?.observe(element);
            }
        });

        return () => {
            observerRef.current?.disconnect();
        };
    }, [headings]);

    // Smooth scroll to heading
    const scrollToHeading = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const headerOffset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth',
            });
        }
    };

    // Don't render if no headings
    if (headings.length === 0) return null;

    // Get tick width based on heading level
    const getTickWidth = (level: number): string => {
        switch (level) {
            case 2:
                return 'w-6'; // 24px
            case 3:
                return 'w-4'; // 16px
            case 4:
                return 'w-2'; // 8px
            default:
                return 'w-3';
        }
    };

    // Get opacity based on heading level
    const getOpacity = (level: number, isActive: boolean): string => {
        if (isActive) return 'opacity-100';
        switch (level) {
            case 2:
                return 'opacity-60';
            case 3:
                return 'opacity-40';
            case 4:
                return 'opacity-25';
            default:
                return 'opacity-30';
        }
    };

    return (
        <nav
            className={cn(
                'fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 xl:block',
                '2xl:right-8',
                className
            )}
            aria-label="İçindekiler"
        >
            <div className="relative flex flex-col items-end gap-2">
                {/* Spine line */}
                <div
                    className="absolute right-0 top-0 h-full w-px bg-neutral-200 dark:bg-neutral-700"
                    aria-hidden="true"
                />

                {headings.map((heading) => {
                    const isActive = heading.id === activeId;
                    const isHovered = heading.id === hoveredId;

                    return (
                        <div
                            key={heading.id}
                            className="relative flex items-center"
                            onMouseEnter={() => setHoveredId(heading.id)}
                            onMouseLeave={() => setHoveredId(null)}
                        >
                            {/* Tooltip (heading text) */}
                            <div
                                className={cn(
                                    'absolute right-8 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium',
                                    'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900',
                                    'shadow-lg',
                                    'pointer-events-none select-none',
                                    'transition-all duration-200',
                                    isHovered
                                        ? 'translate-x-0 opacity-100'
                                        : 'translate-x-2 opacity-0'
                                )}
                                aria-hidden={!isHovered}
                            >
                                {heading.text}
                                {/* Tooltip arrow */}
                                <div
                                    className={cn(
                                        'absolute right-0 top-1/2 -translate-y-1/2 translate-x-full',
                                        'border-8 border-transparent border-l-neutral-900 dark:border-l-white'
                                    )}
                                />
                            </div>

                            {/* Tick mark */}
                            <button
                                type="button"
                                onClick={() => scrollToHeading(heading.id)}
                                className={cn(
                                    'group relative h-2 transition-all duration-300 ease-in-out',
                                    getTickWidth(heading.level),
                                    'rounded-full',
                                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
                                    isActive
                                        ? 'bg-primary-500 dark:bg-primary-400 scale-110'
                                        : cn(
                                            'bg-neutral-400 dark:bg-neutral-500',
                                            'hover:bg-primary-400 dark:hover:bg-primary-500',
                                            'hover:scale-110'
                                        ),
                                    getOpacity(heading.level, isActive)
                                )}
                                aria-label={`${heading.text}'e git`}
                                aria-current={isActive ? 'location' : undefined}
                            />
                        </div>
                    );
                })}
            </div>
        </nav>
    );
}
