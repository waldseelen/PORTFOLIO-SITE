/**
 * GDPR Data Export API Route
 * Allows users to export their data
 */

import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Oturum açmanız gerekiyor.',
                },
                { status: 401 }
            );
        }

        // Collect all user data
        const userData = {
            profile: {
                name: session.user.name,
                email: session.user.email,
                image: session.user.image,
            },
            exportedAt: new Date().toISOString(),
            // Add more data as needed (comments, preferences, etc.)
            comments: [],
            preferences: {},
            activity: [],
        };

        // Return as downloadable JSON
        return new NextResponse(JSON.stringify(userData, null, 2), {
            headers: {
                'Content-Type': 'application/json',
                'Content-Disposition': `attachment; filename="user-data-${Date.now()}.json"`,
            },
        });
    } catch (error) {
        console.error('GDPR export error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Veriler dışa aktarılırken bir hata oluştu.',
            },
            { status: 500 }
        );
    }
}
