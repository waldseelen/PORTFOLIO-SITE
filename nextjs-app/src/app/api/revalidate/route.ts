import { parseBody } from 'next-sanity/webhook';
import { revalidatePath, revalidateTag } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';

// Sanity webhook secret for verification
const SANITY_REVALIDATE_SECRET = process.env.SANITY_REVALIDATE_SECRET;

export async function POST(request: NextRequest) {
    try {
        // Verify the webhook signature
        if (!SANITY_REVALIDATE_SECRET) {
            return NextResponse.json(
                { message: 'Missing SANITY_REVALIDATE_SECRET' },
                { status: 500 }
            );
        }

        const { body, isValidSignature } = await parseBody<{
            _type: string;
            slug?: { current?: string };
        }>(request, SANITY_REVALIDATE_SECRET);

        if (!isValidSignature) {
            return NextResponse.json(
                { message: 'Invalid signature' },
                { status: 401 }
            );
        }

        if (!body?._type) {
            return NextResponse.json(
                { message: 'Bad Request' },
                { status: 400 }
            );
        }

        // Revalidate based on document type
        const { _type, slug } = body;
        const slugValue = slug?.current;

        switch (_type) {
            case 'post':
                // Revalidate blog list and specific post
                revalidateTag('blog');
                if (slugValue) {
                    revalidateTag(`blog-post-${slugValue}`);
                    revalidatePath(`/blog/${slugValue}`);
                }
                revalidatePath('/blog');
                break;

            case 'project':
                // Revalidate projects list and specific project
                revalidateTag('projects');
                if (slugValue) {
                    revalidateTag(`project-${slugValue}`);
                    revalidatePath(`/projects/${slugValue}`);
                }
                revalidatePath('/projects');
                break;

            case 'page':
                // Revalidate specific page
                revalidateTag('pages');
                if (slugValue) {
                    revalidateTag(`page-${slugValue}`);
                    revalidatePath(`/${slugValue}`);
                }
                break;

            case 'author':
            case 'category':
                // Revalidate all content that might reference these
                revalidateTag('blog');
                revalidateTag('projects');
                revalidatePath('/blog');
                revalidatePath('/projects');
                break;

            default:
                // For unknown types, just revalidate homepage
                revalidatePath('/');
        }

        return NextResponse.json({
            message: `Revalidated ${_type}${slugValue ? `: ${slugValue}` : ''}`,
            now: Date.now(),
        });
    } catch (error) {
        console.error('Revalidation error:', error);
        return NextResponse.json(
            { message: 'Error revalidating' },
            { status: 500 }
        );
    }
}
