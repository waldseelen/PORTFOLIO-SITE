import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx for conditional classes and tailwind-merge for deduplication
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Format a date to a readable string
 */
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
    const defaultOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };
    return new Date(date).toLocaleDateString('tr-TR', options || defaultOptions);
}

/**
 * Truncate text to a specific length
 */
export function truncate(text: string, length: number): string {
    if (text.length <= length) return text;
    return text.slice(0, length).trim() + '...';
}

/**
 * Generate a slug from text
 */
export function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

/**
 * Capitalize first letter
 */
export function capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Check if we're on the client side
 */
export const isClient = typeof window !== 'undefined';

/**
 * Check if we're in development mode
 */
export const isDev = process.env.NODE_ENV === 'development';
