'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular';
    width?: string | number;
    height?: string | number;
    animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({
    className,
    variant = 'rectangular',
    width,
    height,
    animation = 'pulse',
}: SkeletonProps) {
    const variantClasses = {
        text: 'rounded',
        circular: 'rounded-full',
        rectangular: 'rounded-lg',
    };

    const animationClasses = {
        pulse: 'animate-pulse',
        wave: '',
        none: '',
    };

    if (animation === 'wave') {
        return (
            <div
                className={cn(
                    'relative overflow-hidden bg-neutral-200 dark:bg-neutral-700',
                    variantClasses[variant],
                    className
                )}
                style={{ width, height }}
            >
                <motion.div
                    className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ translateX: ['100%', '-100%'] }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                />
            </div>
        );
    }

    return (
        <div
            className={cn(
                'bg-neutral-200 dark:bg-neutral-700',
                variantClasses[variant],
                animationClasses[animation],
                className
            )}
            style={{ width, height }}
        />
    );
}

// Card skeleton
export function CardSkeleton({ className }: { className?: string }) {
    return (
        <div className={cn('rounded-2xl border border-neutral-200 p-6 dark:border-neutral-800', className)}>
            <Skeleton className="mb-4 aspect-video w-full" />
            <Skeleton className="mb-2 h-4 w-1/4" variant="text" />
            <Skeleton className="mb-2 h-6 w-3/4" variant="text" />
            <Skeleton className="h-4 w-full" variant="text" />
            <Skeleton className="mt-2 h-4 w-2/3" variant="text" />
            <div className="mt-4 flex gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
            </div>
        </div>
    );
}

// Post skeleton
export function PostSkeleton({ className }: { className?: string }) {
    return (
        <div className={cn('space-y-6', className)}>
            <Skeleton className="h-10 w-3/4" variant="text" />
            <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10" variant="circular" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-24" variant="text" />
                    <Skeleton className="h-3 w-32" variant="text" />
                </div>
            </div>
            <Skeleton className="aspect-video w-full" />
            <div className="space-y-3">
                <Skeleton className="h-4 w-full" variant="text" />
                <Skeleton className="h-4 w-full" variant="text" />
                <Skeleton className="h-4 w-3/4" variant="text" />
            </div>
        </div>
    );
}

// List skeleton
export function ListSkeleton({
    count = 3,
    className
}: {
    count?: number;
    className?: string;
}) {
    return (
        <div className={cn('space-y-4', className)}>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12" variant="circular" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-1/2" variant="text" />
                        <Skeleton className="h-3 w-3/4" variant="text" />
                    </div>
                </div>
            ))}
        </div>
    );
}
