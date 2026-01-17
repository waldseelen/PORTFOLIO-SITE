/**
 * Programming Languages API Route
 * Get list of supported programming languages
 */

import { NextResponse } from 'next/server';

interface Language {
    id: string;
    name: string;
    version: string;
    extension: string;
    is_active: boolean;
    icon?: string;
    description?: string;
}

// Supported languages with metadata
const LANGUAGES: Language[] = [
    {
        id: 'python',
        name: 'Python',
        version: '3.11',
        extension: 'py',
        is_active: true,
        icon: '🐍',
        description: 'Popular general-purpose programming language',
    },
    {
        id: 'javascript',
        name: 'JavaScript',
        version: 'ES2023',
        extension: 'js',
        is_active: true,
        icon: '📜',
        description: 'The language of the web',
    },
    {
        id: 'typescript',
        name: 'TypeScript',
        version: '5.3',
        extension: 'ts',
        is_active: true,
        icon: '📘',
        description: 'JavaScript with type safety',
    },
    {
        id: 'java',
        name: 'Java',
        version: '21',
        extension: 'java',
        is_active: true,
        icon: '☕',
        description: 'Enterprise-grade object-oriented language',
    },
    {
        id: 'cpp',
        name: 'C++',
        version: 'C++20',
        extension: 'cpp',
        is_active: true,
        icon: '⚡',
        description: 'High-performance systems programming',
    },
    {
        id: 'c',
        name: 'C',
        version: 'C17',
        extension: 'c',
        is_active: true,
        icon: '🔧',
        description: 'Low-level systems programming language',
    },
    {
        id: 'go',
        name: 'Go',
        version: '1.21',
        extension: 'go',
        is_active: true,
        icon: '🐹',
        description: 'Fast, statically typed compiled language',
    },
    {
        id: 'rust',
        name: 'Rust',
        version: '1.75',
        extension: 'rs',
        is_active: true,
        icon: '🦀',
        description: 'Memory-safe systems programming',
    },
    {
        id: 'php',
        name: 'PHP',
        version: '8.3',
        extension: 'php',
        is_active: false,
        icon: '🐘',
        description: 'Server-side scripting language',
    },
    {
        id: 'ruby',
        name: 'Ruby',
        version: '3.3',
        extension: 'rb',
        is_active: false,
        icon: '💎',
        description: 'Dynamic, elegant programming language',
    },
];

export async function GET() {
    // Only return active languages
    const activeLanguages = LANGUAGES.filter((lang) => lang.is_active);

    return NextResponse.json({
        success: true,
        data: {
            languages: activeLanguages,
            total: activeLanguages.length,
        },
    });
}
