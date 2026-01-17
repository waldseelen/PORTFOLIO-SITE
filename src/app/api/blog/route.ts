/**
 * Blog API Route
 * Main blog endpoint - fetches posts from Sanity
 */

import { getAllPosts, getFeaturedPosts, getPostsByCategory } from '@/lib/data';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const featured = searchParams.get('featured') === 'true';
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const page = parseInt(searchParams.get('page') || '1', 10);

        let posts;

        if (featured) {
            posts = await getFeaturedPosts(limit);
        } else if (category) {
            posts = await getPostsByCategory(category);
        } else {
            posts = await getAllPosts();
        }

        // Pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedPosts = posts.slice(startIndex, endIndex);

        return NextResponse.json({
            success: true,
            data: paginatedPosts,
            pagination: {
                page,
                limit,
                total: posts.length,
                totalPages: Math.ceil(posts.length / limit),
                hasNext: endIndex < posts.length,
                hasPrevious: page > 1,
            },
        });
    } catch (error) {
        console.error('Blog API error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Blog yazıları alınırken bir hata oluştu.',
            },
            { status: 500 }
        );
    }
}
