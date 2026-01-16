import { defineArrayMember, defineType } from 'sanity';

/**
 * Block Content schema for rich text editing
 * Used for blog posts, project descriptions, and page content
 */
export const blockContent = defineType({
    title: 'Block Content',
    name: 'blockContent',
    type: 'array',
    of: [
        defineArrayMember({
            title: 'Block',
            type: 'block',
            styles: [
                { title: 'Normal', value: 'normal' },
                { title: 'H1', value: 'h1' },
                { title: 'H2', value: 'h2' },
                { title: 'H3', value: 'h3' },
                { title: 'H4', value: 'h4' },
                { title: 'Quote', value: 'blockquote' },
            ],
            lists: [
                { title: 'Bullet', value: 'bullet' },
                { title: 'Numbered', value: 'number' },
            ],
            marks: {
                decorators: [
                    { title: 'Strong', value: 'strong' },
                    { title: 'Emphasis', value: 'em' },
                    { title: 'Underline', value: 'underline' },
                    { title: 'Strike', value: 'strike-through' },
                    { title: 'Code', value: 'code' },
                ],
                annotations: [
                    {
                        title: 'URL',
                        name: 'link',
                        type: 'object',
                        fields: [
                            {
                                title: 'URL',
                                name: 'href',
                                type: 'url',
                                validation: (Rule) =>
                                    Rule.uri({
                                        scheme: ['http', 'https', 'mailto', 'tel'],
                                    }),
                            },
                            {
                                title: 'Open in new tab',
                                name: 'blank',
                                type: 'boolean',
                                initialValue: true,
                            },
                        ],
                    },
                    {
                        title: 'Internal Link',
                        name: 'internalLink',
                        type: 'object',
                        fields: [
                            {
                                name: 'reference',
                                type: 'reference',
                                title: 'Reference',
                                to: [
                                    { type: 'post' },
                                    { type: 'project' },
                                    { type: 'page' },
                                ],
                            },
                        ],
                    },
                ],
            },
        }),
        defineArrayMember({
            type: 'image',
            options: { hotspot: true },
            fields: [
                {
                    name: 'alt',
                    type: 'string',
                    title: 'Alternative Text',
                    description: 'Important for SEO and accessibility',
                },
                {
                    name: 'caption',
                    type: 'string',
                    title: 'Caption',
                },
            ],
        }),
        defineArrayMember({
            type: 'object',
            name: 'codeBlock',
            title: 'Code Block',
            fields: [
                {
                    name: 'language',
                    title: 'Language',
                    type: 'string',
                    options: {
                        list: [
                            { title: 'JavaScript', value: 'javascript' },
                            { title: 'TypeScript', value: 'typescript' },
                            { title: 'Python', value: 'python' },
                            { title: 'HTML', value: 'html' },
                            { title: 'CSS', value: 'css' },
                            { title: 'JSON', value: 'json' },
                            { title: 'Bash', value: 'bash' },
                            { title: 'SQL', value: 'sql' },
                            { title: 'GraphQL', value: 'graphql' },
                            { title: 'Markdown', value: 'markdown' },
                        ],
                    },
                },
                {
                    name: 'filename',
                    title: 'Filename',
                    type: 'string',
                },
                {
                    name: 'code',
                    title: 'Code',
                    type: 'text',
                    rows: 10,
                },
            ],
            preview: {
                select: {
                    language: 'language',
                    filename: 'filename',
                },
                prepare({ language, filename }) {
                    return {
                        title: filename || 'Code Block',
                        subtitle: language,
                    };
                },
            },
        }),
        defineArrayMember({
            type: 'object',
            name: 'youtube',
            title: 'YouTube Embed',
            fields: [
                {
                    name: 'url',
                    title: 'YouTube URL',
                    type: 'url',
                },
            ],
            preview: {
                select: { url: 'url' },
                prepare({ url }) {
                    return {
                        title: 'YouTube Video',
                        subtitle: url,
                    };
                },
            },
        }),
        defineArrayMember({
            type: 'object',
            name: 'callout',
            title: 'Callout',
            fields: [
                {
                    name: 'type',
                    title: 'Type',
                    type: 'string',
                    options: {
                        list: [
                            { title: 'Info', value: 'info' },
                            { title: 'Warning', value: 'warning' },
                            { title: 'Success', value: 'success' },
                            { title: 'Error', value: 'error' },
                            { title: 'Tip', value: 'tip' },
                        ],
                    },
                    initialValue: 'info',
                },
                {
                    name: 'text',
                    title: 'Text',
                    type: 'text',
                    rows: 3,
                },
            ],
            preview: {
                select: {
                    type: 'type',
                    text: 'text',
                },
                prepare({ type, text }) {
                    return {
                        title: `${type?.toUpperCase()} Callout`,
                        subtitle: text,
                    };
                },
            },
        }),
    ],
});
