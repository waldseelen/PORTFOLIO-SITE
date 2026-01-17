/**
 * Search Autocomplete API Route
 * Provides autocomplete suggestions from Sanity
 */

import { sanityFetch } from '@/sanity/client';
import { NextRequest, NextResponse } from 'next/server';

// Autocomplete query - gets titles that match the query
const autocompleteQuery = `{
    "posts": *[_type == "post" && title match $query + "*"] | order(publishedAt desc) [0...5] {
        "label": title,
        "value": slug.current,
        "type": "post"
    },
    "projects": *[_type == "project" && title match $query + "*"] | order(order asc) [0...5] {
        "label": title,
        "value": slug.current,
        "type": "project"
    }
}`;

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q') || '';

        if (!query || query.length < 2) {
            return NextResponse.json({
                success: true,
                suggestions: [],
            });
        }

        const results = await sanityFetch<{
            posts: Array<{ label: string; value: string; type: string }>;
            projects: Array<{ label: string; value: string; type: string }>;
        }>({
            query: autocompleteQuery,
            params: { query },
        });

        // Combine and limit suggestions
        const suggestions = [
            ...results.posts,
            ...results.projects,
        ].slice(0, 8);

        return NextResponse.json({
            success: true,
            suggestions,
        });
    } catch (error) {
        console.error('Autocomplete API error:', error);
        return NextResponse.json(
            {
                success: false,
                suggestions: [],
                error: 'Öneriler alınırken bir hata oluştu.',
            },
            { status: 500 }
        );
    }
}
