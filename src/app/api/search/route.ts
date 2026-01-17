/**
 * Search API Route
 * Main search endpoint - fetches from Sanity
 */

import { sanityFetch } from '@/sanity/client';
import { NextRequest, NextResponse } from 'next/server';

// Search query for posts and projects
const searchQuery = `{
    "posts": *[_type == "post" && (
        title match $query + "*" ||
        excerpt match $query + "*" ||
        pt::text(body) match $query + "*" ||
        categories[]->title match $query + "*"
    )] | order(publishedAt desc) [$start...$end] {
        _id,
        _type,
        title,
        slug,
        excerpt,
        publishedAt,
        "categories": categories[]->title
    },
    "projects": *[_type == "project" && (
        title match $query + "*" ||
        excerpt match $query + "*" ||
        description match $query + "*" ||
        pt::text(body) match $query + "*" ||
        technologies[] match $query + "*" ||
        categories[]->title match $query + "*"
    )] | order(order asc) [$start...$end] {
        _id,
        _type,
        title,
        slug,
        excerpt,
        technologies
    }
}`;

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q') || '';
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '10', 10);

        if (!query || query.length < 2) {
            return NextResponse.json({
                success: true,
                data: { posts: [], projects: [] },
                query: '',
                total: 0,
            });
        }

        const start = (page - 1) * limit;
        const end = start + limit;

        const results = await sanityFetch<{
            posts: Array<{
                _id: string;
                _type: string;
                title: string;
                slug: { current: string };
                excerpt?: string;
                publishedAt?: string;
                categories?: string[];
            }>;
            projects: Array<{
                _id: string;
                _type: string;
                title: string;
                slug: { current: string };
                excerpt?: string;
                technologies?: string[];
            }>;
        }>({
            query: searchQuery,
            params: { query, start, end },
        });

        const total = (results?.posts?.length || 0) + (results?.projects?.length || 0);

        return NextResponse.json({
            success: true,
            data: results || { posts: [], projects: [] },
            query,
            page,
            limit,
            total,
        });
    } catch (error) {
        console.error('Search API error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Arama sırasında bir hata oluştu.',
            },
            { status: 500 }
        );
    }
}
