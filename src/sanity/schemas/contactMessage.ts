import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'contactMessage',
    title: 'Contact Messages',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Name',
            type: 'string',
            validation: (Rule) => Rule.required(),
            readOnly: true,
        }),
        defineField({
            name: 'surname',
            title: 'Surname',
            type: 'string',
            readOnly: true,
        }),
        defineField({
            name: 'email',
            title: 'Email',
            type: 'string',
            validation: (Rule) => Rule.required().email(),
            readOnly: true,
        }),
        defineField({
            name: 'subject',
            title: 'Subject',
            type: 'string',
            validation: (Rule) => Rule.required(),
            readOnly: true,
        }),
        defineField({
            name: 'message',
            title: 'Message',
            type: 'text',
            validation: (Rule) => Rule.required(),
            readOnly: true,
        }),
        defineField({
            name: 'read',
            title: 'Read',
            type: 'boolean',
            initialValue: false,
        }),
        defineField({
            name: 'createdAt',
            title: 'Created At',
            type: 'datetime',
            readOnly: true,
        }),
        // System Fields for Spam Detection
        defineField({
            name: 'ipAddress',
            title: 'IP Address',
            type: 'string',
            readOnly: true,
            hidden: true,
        }),
        defineField({
            name: 'userAgent',
            title: 'User Agent',
            type: 'string',
            readOnly: true,
            hidden: true,
        }),
        defineField({
            name: 'referrer',
            title: 'Referrer URL',
            type: 'string',
            readOnly: true,
            hidden: true,
        }),
    ],
    preview: {
        select: {
            title: 'subject',
            subtitle: 'email',
            isRead: 'read',
        },
        prepare(selection) {
            const { title, subtitle, isRead } = selection
            return {
                title: title,
                subtitle: `${subtitle} ${isRead ? '(Read)' : '(Unread)'}`,
                media: isRead ? () => '✅' : () => '📩',
            }
        },
    },
})
