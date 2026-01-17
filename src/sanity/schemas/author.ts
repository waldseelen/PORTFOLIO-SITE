import { defineField, defineType } from 'sanity';

export const author = defineType({
    name: 'author',
    title: 'Author',
    type: 'document',
    groups: [
        { name: 'info', title: 'Personal Info' },
        { name: 'about', title: 'About & Bio' },
        { name: 'skills', title: 'Skills' },
        { name: 'timeline', title: 'Timeline & Experience' },
    ],
    fields: [
        defineField({
            name: 'name',
            title: 'Name',
            type: 'string',
            group: 'info',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            group: 'info',
            options: {
                source: 'name',
                maxLength: 96,
            },
        }),
        defineField({
            name: 'image',
            title: 'Profile Image',
            type: 'image',
            group: 'info',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'email',
            title: 'Email',
            type: 'string',
            group: 'info',
            validation: (Rule) => Rule.email(),
        }),
        defineField({
            name: 'role',
            title: 'Role / Job Title',
            type: 'string',
            group: 'info',
            description: 'e.g. Full Stack Developer',
        }),
        defineField({
            name: 'location',
            title: 'Location',
            type: 'string',
            group: 'info',
        }),
        defineField({
            name: 'bio',
            title: 'Short Bio',
            type: 'text',
            rows: 3,
            group: 'about',
            description: 'Short intro for cards or meta description',
        }),
        defineField({
            name: 'about',
            title: 'Full About Section',
            type: 'blockContent', // Rich text
            group: 'about',
        }),

        // Skills
        defineField({
            name: 'skills',
            title: 'Skills',
            type: 'array',
            group: 'skills',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'name', title: 'Skill Name', type: 'string' },
                        { name: 'level', title: 'Level (1-100)', type: 'number', validation: (Rule) => Rule.min(0).max(100) },
                        { name: 'category', title: 'Category', type: 'string', options: { list: ['Frontend', 'Backend', 'DevOps', 'Design', 'Other'] } },
                        { name: 'icon', title: 'Icon (Optional)', type: 'image' },
                    ],
                    preview: {
                        select: {
                            title: 'name',
                            subtitle: 'level',
                        }
                    }
                }
            ]
        }),

        // Timeline
        defineField({
            name: 'timeline',
            title: 'Experience & Education',
            type: 'array',
            group: 'timeline',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'title', title: 'Role / Degree', type: 'string' },
                        { name: 'company', title: 'Company / School', type: 'string' },
                        { name: 'startDate', title: 'Start Date', type: 'date' },
                        { name: 'endDate', title: 'End Date', type: 'date', description: 'Leave empty for "Present"' },
                        { name: 'isCurrent', title: 'Is Current?', type: 'boolean', initialValue: false },
                        { name: 'description', title: 'Description', type: 'text' },
                        { name: 'type', title: 'Type', type: 'string', options: { list: ['work', 'education'] } },
                    ],
                    preview: {
                        select: {
                            title: 'title',
                            subtitle: 'company',
                        }
                    }
                }
            ]
        }),
    ],
    preview: {
        select: {
            title: 'name',
            media: 'image',
        },
    },
});

