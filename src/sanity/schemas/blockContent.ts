import { defineArrayMember, defineType } from 'sanity';

/**
 * Medium-style Block Content Schema
 * Rich text editing with advanced features
 */
export const blockContent = defineType({
    title: 'Block Content',
    name: 'blockContent',
    type: 'array',
    of: [
        // === TEXT BLOCKS ===
        defineArrayMember({
            title: 'Block',
            type: 'block',
            styles: [
                { title: 'Normal', value: 'normal' },
                { title: 'Başlık 2', value: 'h2' },
                { title: 'Başlık 3', value: 'h3' },
                { title: 'Başlık 4', value: 'h4' },
                { title: 'Alıntı', value: 'blockquote' },
            ],
            lists: [
                { title: 'Madde', value: 'bullet' },
                { title: 'Numara', value: 'number' },
            ],
            marks: {
                decorators: [
                    { title: 'Kalın', value: 'strong' },
                    { title: 'İtalik', value: 'em' },
                    { title: 'Altı Çizili', value: 'underline' },
                    { title: 'Üzeri Çizili', value: 'strike-through' },
                    { title: 'Kod', value: 'code' },
                ],
                annotations: [
                    {
                        title: 'Link',
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
                                title: 'Yeni sekmede aç',
                                name: 'blank',
                                type: 'boolean',
                                initialValue: true,
                            },
                        ],
                    },
                    {
                        title: 'İç Link',
                        name: 'internalLink',
                        type: 'object',
                        fields: [
                            {
                                name: 'reference',
                                type: 'reference',
                                title: 'Referans',
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

        // === IMAGES ===
        defineArrayMember({
            type: 'image',
            options: { hotspot: true },
            fields: [
                {
                    name: 'alt',
                    type: 'string',
                    title: 'Alt Metin',
                    description: 'SEO ve erişilebilirlik için önemli',
                },
                {
                    name: 'caption',
                    type: 'string',
                    title: 'Açıklama',
                },
            ],
        }),

        // === CODE BLOCK ===
        defineArrayMember({
            type: 'object',
            name: 'codeBlock',
            title: 'Kod Bloğu',
            fields: [
                {
                    name: 'language',
                    title: 'Dil',
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
                            { title: 'React JSX', value: 'jsx' },
                            { title: 'React TSX', value: 'tsx' },
                        ],
                    },
                    initialValue: 'javascript',
                },
                {
                    name: 'filename',
                    title: 'Dosya Adı',
                    type: 'string',
                },
                {
                    name: 'code',
                    title: 'Kod',
                    type: 'text',
                    rows: 15,
                },
                {
                    name: 'showLineNumbers',
                    title: 'Satır Numaraları',
                    type: 'boolean',
                    initialValue: true,
                },
            ],
            preview: {
                select: {
                    language: 'language',
                    filename: 'filename',
                },
                prepare({ language, filename }) {
                    return {
                        title: filename || 'Kod Bloğu',
                        subtitle: language?.toUpperCase(),
                    };
                },
            },
        }),

        // === PULL QUOTE (Medium-style) ===
        defineArrayMember({
            type: 'object',
            name: 'pullQuote',
            title: 'Öne Çıkan Alıntı',
            fields: [
                {
                    name: 'quote',
                    title: 'Alıntı',
                    type: 'text',
                    rows: 3,
                    validation: (Rule) => Rule.required(),
                },
                {
                    name: 'attribution',
                    title: 'Kaynak',
                    type: 'string',
                },
            ],
            preview: {
                select: { quote: 'quote' },
                prepare({ quote }) {
                    return {
                        title: quote?.substring(0, 50) + '...',
                        subtitle: 'Öne Çıkan Alıntı',
                    };
                },
            },
        }),

        // === DIVIDER ===
        defineArrayMember({
            type: 'object',
            name: 'divider',
            title: 'Bölüm Ayırıcı',
            fields: [
                {
                    name: 'style',
                    title: 'Stil',
                    type: 'string',
                    options: {
                        list: [
                            { title: 'Üç Nokta (• • •)', value: 'dots' },
                            { title: 'Çizgi (—)', value: 'line' },
                            { title: 'Yıldızlar (* * *)', value: 'stars' },
                        ],
                    },
                    initialValue: 'dots',
                },
            ],
            preview: {
                prepare() {
                    return {
                        title: '• • •',
                        subtitle: 'Bölüm Ayırıcı',
                    };
                },
            },
        }),

        // === CALLOUT / TIP BOX ===
        defineArrayMember({
            type: 'object',
            name: 'callout',
            title: 'Bilgi Kutusu',
            fields: [
                {
                    name: 'type',
                    title: 'Tür',
                    type: 'string',
                    options: {
                        list: [
                            { title: 'İpucu', value: 'tip' },
                            { title: 'Bilgi', value: 'info' },
                            { title: 'Uyarı', value: 'warning' },
                            { title: 'Hata', value: 'error' },
                            { title: 'Başarı', value: 'success' },
                        ],
                    },
                    initialValue: 'info',
                },
                {
                    name: 'title',
                    title: 'Başlık',
                    type: 'string',
                },
                {
                    name: 'text',
                    title: 'Metin',
                    type: 'text',
                    rows: 3,
                    validation: (Rule) => Rule.required(),
                },
            ],
            preview: {
                select: { type: 'type', title: 'title', text: 'text' },
                prepare({ type, title, text }) {
                    return {
                        title: title || `${type?.toUpperCase()} Bilgi Kutusu`,
                        subtitle: text?.substring(0, 50),
                    };
                },
            },
        }),

        // === YOUTUBE EMBED ===
        defineArrayMember({
            type: 'object',
            name: 'youtube',
            title: 'YouTube Video',
            fields: [
                {
                    name: 'url',
                    title: 'YouTube URL',
                    type: 'url',
                    validation: (Rule) => Rule.required(),
                },
                {
                    name: 'caption',
                    title: 'Açıklama',
                    type: 'string',
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

        // === TWITTER/X EMBED ===
        defineArrayMember({
            type: 'object',
            name: 'tweet',
            title: 'Tweet',
            fields: [
                {
                    name: 'url',
                    title: 'Tweet URL',
                    type: 'url',
                    validation: (Rule) => Rule.required(),
                },
            ],
            preview: {
                select: { url: 'url' },
                prepare({ url }) {
                    return {
                        title: 'Tweet',
                        subtitle: url,
                    };
                },
            },
        }),
    ],
});
