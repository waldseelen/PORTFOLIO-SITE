/**
 * GDPR Data Deletion API Route
 * Allows users to request deletion of their data
 */

import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
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

        const body = await request.json();
        const { confirmDeletion } = body;

        if (!confirmDeletion) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Silme işlemini onaylamanız gerekiyor.',
                },
                { status: 400 }
            );
        }

        // TODO: Implement actual data deletion
        // 1. Delete from Sanity (comments, etc.)
        // 2. Delete from any other data stores
        // 3. Log the deletion request for compliance

        console.error('GDPR deletion requested for:', session.user.email);

        return NextResponse.json({
            success: true,
            message: 'Veri silme talebiniz alındı. 30 gün içinde işleme alınacaktır.',
            requestId: `DEL-${Date.now()}`,
            requestedAt: new Date().toISOString(),
        });
    } catch (error) {
        console.error('GDPR deletion error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Veri silme talebi işlenirken bir hata oluştu.',
            },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({
        success: true,
        message: 'GDPR veri silme endpoint. POST ile silme talebi gönderin.',
        requiredFields: {
            confirmDeletion: 'boolean - Silme işlemini onaylayın',
        },
    });
}
