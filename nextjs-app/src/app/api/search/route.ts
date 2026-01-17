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
        pt::text(body) match $query + "*"
    )] | order(publishedAt desc) [0...$limit] {
        _id,
        _type,
        title,
        slug,
        excerpt,
        publishedAt
    },
    "projects": *[_type == "project" && (
        title match $query + "*" ||
        excerpt match $query + "*" ||
        description match $query + "*"
    )] | order(order asc) [0...$limit] {
        _id,
        _type,
        title,
        slug,
        excerpt
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

        const results = await sanityFetch<{
            posts: Array<{
                _id: string;
                _type: string;
                title: string;
                slug: { current: string };
                excerpt?: string;
                publishedAt?: string;
            }>;
            projects: Array<{
                _id: string;
                _type: string;
                title: string;
                slug: { current: string };
                excerpt?: string;
            }>;
        }>({
            query: searchQuery,
            params: { query, limit: limit * page },
        });

        const total = results.posts.length + results.projects.length;

        return NextResponse.json({
            success: true,
            data: results,
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
