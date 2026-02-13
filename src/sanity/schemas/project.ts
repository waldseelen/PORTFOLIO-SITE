import { defineField, defineType } from 'sanity';

export const project = defineType({
    name: 'project',
    title: 'Project',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (Rule) => Rule.required().min(5).max(100),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'mainImage',
            title: 'Main Image',
            type: 'image',
            options: {
                hotspot: true,
            },
            description: 'Recommended size: 1200x630px (16:9 aspect ratio)',
            validation: (Rule) => Rule.required(),
            fields: [
                {
                    name: 'alt',
                    type: 'string',
                    title: 'Alternative Text',
                    description: 'REQUIRED for SEO and accessibility. Describe the image.',
                    validation: (Rule) => Rule.required().min(10).max(200),
                },
            ],
        }),
        defineField({
            name: 'excerpt',
            title: 'Short Description',
            type: 'text',
            rows: 3,
            validation: (Rule) => Rule.max(300),
        }),
        defineField({
            name: 'body',
            title: 'Full Description',
            type: 'blockContent',
        }),
        defineField({
            name: 'categories',
            title: 'Categories',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'category' }] }],
        }),
        defineField({
            name: 'technologies',
            title: 'Technologies',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                layout: 'tags',
            },
        }),
        defineField({
            name: 'githubUrl',
            title: 'GitHub URL',
            type: 'url',
        }),
        defineField({
            name: 'liveUrl',
            title: 'Live URL',
            type: 'url',
        }),
        defineField({
            name: 'featured',
            title: 'Featured',
            type: 'boolean',
            description: 'Show this project on the homepage',
            initialValue: false,
        }),
        defineField({
            name: 'order',
            title: 'Display Order',
            type: 'number',
            description: 'Lower numbers appear first',
            initialValue: 0,
        }),
        defineField({
            name: 'status',
            title: 'Status',
            type: 'string',
            options: {
                list: [
                    { title: 'In Progress', value: 'in-progress' },
                    { title: 'Completed', value: 'completed' },
                    { title: 'Archived', value: 'archived' },
                ],
                layout: 'radio',
            },
            initialValue: 'completed',
        }),
        defineField({
            name: 'startDate',
            title: 'Start Date',
            type: 'date',
        }),
        defineField({
            name: 'endDate',
            title: 'End Date',
            type: 'date',
        }),
        defineField({
            name: 'seo',
            title: 'SEO',
            type: 'object',
            fields: [
                {
                    name: 'metaTitle',
                    title: 'Meta Title',
                    type: 'string',
                    validation: (Rule) => Rule.max(60),
                },
                {
                    name: 'metaDescription',
                    title: 'Meta Description',
                    type: 'text',
                    rows: 3,
                    validation: (Rule) => Rule.max(160),
                },
                {
                    name: 'shareGraphic',
                    title: 'Share Graphic',
                    type: 'image',
                },
            ],
        }),
    ],
    preview: {
        select: {
            title: 'title',
            subtitle: 'excerpt',
            media: 'mainImage',
        },
    },
    orderings: [
        {
            title: 'Display Order',
            name: 'orderAsc',
            by: [{ field: 'order', direction: 'asc' }],
        },
        {
            title: 'Title',
            name: 'titleAsc',
            by: [{ field: 'title', direction: 'asc' }],
        },
    ],
});
