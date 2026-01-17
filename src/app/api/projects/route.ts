/**
 * Projects API Route
 * Main projects endpoint - fetches projects from Sanity
 */

import { getAllProjects, getFeaturedProjects, getProjectsByTechnology } from '@/lib/data';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const technology = searchParams.get('technology');
        const featured = searchParams.get('featured') === 'true';
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const page = parseInt(searchParams.get('page') || '1', 10);

        let projects;

        if (featured) {
            projects = await getFeaturedProjects(limit);
        } else if (technology) {
            projects = await getProjectsByTechnology(technology);
        } else {
            projects = await getAllProjects();
        }

        // Pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedProjects = projects.slice(startIndex, endIndex);

        return NextResponse.json({
            success: true,
            data: paginatedProjects,
            pagination: {
                page,
                limit,
                total: projects.length,
                totalPages: Math.ceil(projects.length / limit),
                hasNext: endIndex < projects.length,
                hasPrevious: page > 1,
            },
        });
    } catch (error) {
        console.error('Projects API error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Projeler alınırken bir hata oluştu.',
            },
            { status: 500 }
        );
    }
}
