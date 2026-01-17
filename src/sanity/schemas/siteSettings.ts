import { defineField, defineType } from 'sanity';

export const siteSettings = defineType({
    name: 'siteSettings',
    title: 'Site Settings',
    type: 'document',
    groups: [
        { name: 'general', title: 'General' },
        { name: 'seo', title: 'SEO & Metadata' },
        { name: 'social', title: 'Social & Contact' },
        { name: 'integrations', title: 'Integrations' },
    ],
    fields: [
        defineField({
            name: 'title',
            title: 'Site Title',
            type: 'string',
            group: 'general',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Site Description',
            type: 'text',
            rows: 3,
            group: 'general',
        }),
        defineField({
            name: 'logo',
            title: 'Logo',
            type: 'image',
            group: 'general',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'favicon',
            title: 'Favicon',
            type: 'image',
            group: 'general',
        }),

        // SEO Group
        defineField({
            name: 'keywords',
            title: 'Keywords',
            type: 'array',
            of: [{ type: 'string' }],
            group: 'seo',
            options: { layout: 'tags' },
        }),
        defineField({
            name: 'ogImage',
            title: 'Default OG Image',
            type: 'image',
            group: 'seo',
            description: 'Default image for social sharing',
        }),
        defineField({
            name: 'robotsTxt',
            title: 'Custom robots.txt content',
            type: 'text',
            rows: 5,
            group: 'seo',
        }),

        // Social & CV
        defineField({
            name: 'socialLinks',
            title: 'Social Links',
            type: 'array',
            group: 'social',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'platform', title: 'Platform', type: 'string', options: { list: ['GitHub', 'LinkedIn', 'Twitter', 'Instagram', 'YouTube', 'Other'] } },
                        { name: 'url', title: 'URL', type: 'url' },
                    ]
                }
            ]
        }),
        defineField({
            name: 'resume',
            title: 'Resume / CV (PDF)',
            type: 'file',
            group: 'social',
            options: { accept: '.pdf' },
        }),
        defineField({
            name: 'mainAuthor',
            title: 'Main Author',
            type: 'reference',
            to: [{ type: 'author' }],
            group: 'general',
            description: 'The main author of the site (used for "About" section linkage)'
        }),

        // Integrations
        defineField({
            name: 'googleAnalyticsId',
            title: 'Google Analytics ID',
            type: 'string',
            group: 'integrations',
            description: 'e.g., G-XXXXXXXXXX',
        }),
        defineField({
            name: 'googleTagManagerId',
            title: 'Google Tag Manager ID',
            type: 'string',
            group: 'integrations',
            description: 'e.g., GTM-XXXXXX',
        }),
    ],
    preview: {
        select: {
            title: 'title',
            media: 'logo',
        },
    },
});
