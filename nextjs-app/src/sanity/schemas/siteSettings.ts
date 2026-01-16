import { defineField, defineType } from 'sanity';

export const siteSettings = defineType({
    name: 'siteSettings',
    title: 'Site Settings',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Site Title',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Site Description',
            type: 'text',
            rows: 3,
        }),
        defineField({
            name: 'logo',
            title: 'Logo',
            type: 'image',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'favicon',
            title: 'Favicon',
            type: 'image',
        }),
        defineField({
            name: 'ogImage',
            title: 'Default OG Image',
            type: 'image',
            description: 'Default image for social sharing',
        }),
        defineField({
            name: 'author',
            title: 'Site Author',
            type: 'object',
            fields: [
                {
                    name: 'name',
                    title: 'Name',
                    type: 'string',
                },
                {
                    name: 'email',
                    title: 'Email',
                    type: 'string',
                },
                {
                    name: 'bio',
                    title: 'Bio',
                    type: 'text',
                    rows: 4,
                },
                {
                    name: 'avatar',
                    title: 'Avatar',
                    type: 'image',
                },
            ],
        }),
        defineField({
            name: 'social',
            title: 'Social Links',
            type: 'object',
            fields: [
                {
                    name: 'twitter',
                    title: 'Twitter',
                    type: 'url',
                },
                {
                    name: 'github',
                    title: 'GitHub',
                    type: 'url',
                },
                {
                    name: 'linkedin',
                    title: 'LinkedIn',
                    type: 'url',
                },
                {
                    name: 'instagram',
                    title: 'Instagram',
                    type: 'url',
                },
                {
                    name: 'youtube',
                    title: 'YouTube',
                    type: 'url',
                },
            ],
        }),
        defineField({
            name: 'analytics',
            title: 'Analytics',
            type: 'object',
            fields: [
                {
                    name: 'googleAnalyticsId',
                    title: 'Google Analytics ID',
                    type: 'string',
                    description: 'e.g., G-XXXXXXXXXX',
                },
                {
                    name: 'googleTagManagerId',
                    title: 'Google Tag Manager ID',
                    type: 'string',
                    description: 'e.g., GTM-XXXXXX',
                },
            ],
        }),
        defineField({
            name: 'contact',
            title: 'Contact Information',
            type: 'object',
            fields: [
                {
                    name: 'email',
                    title: 'Contact Email',
                    type: 'string',
                },
                {
                    name: 'phone',
                    title: 'Phone',
                    type: 'string',
                },
                {
                    name: 'address',
                    title: 'Address',
                    type: 'text',
                    rows: 3,
                },
            ],
        }),
    ],
    preview: {
        select: {
            title: 'title',
            media: 'logo',
        },
    },
});
