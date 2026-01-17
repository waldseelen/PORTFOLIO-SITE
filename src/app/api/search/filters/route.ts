/**
 * Search Filters API Route
 * Returns available filters for search (categories, tags, etc.)
 */

import { sanityFetch } from '@/sanity/client';
import { NextResponse } from 'next/server';

// Filters query - gets all categories and tags
const filtersQuery = `{
    "categories": *[_type == "category"] | order(title asc) {
        _id,
        title,
        "slug": slug.current,
        "count": count(*[_type == "post" && references(^._id)])
    },
    "tags": *[_type == "tag"] | order(title asc) {
        _id,
        title,
        "slug": slug.current
    },
    "technologies": *[_type == "project"].technologies[] | unique | order(@ asc)
}`;

export async function GET() {
    try {
        const filters = await sanityFetch<{
            categories: Array<{
                _id: string;
                title: string;
                slug: string;
                count: number;
            }>;
            tags: Array<{
                _id: string;
                title: string;
                slug: string;
            }>;
            technologies: string[];
        }>({
            query: filtersQuery,
            revalidate: 86400, // 24 hours
        });

        return NextResponse.json({
            success: true,
            data: filters,
        });
    } catch (error) {
        console.error('Search filters API error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Filtreler alınırken bir hata oluştu.',
            },
            { status: 500 }
        );
    }
}
