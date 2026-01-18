import { defineField, defineType } from 'sanity';

/**
 * Medium-style Blog Post Schema
 * Rich content editing with reading time, claps, series support
 */
export const post = defineType({
    name: 'post',
    title: 'Blog Post',
    type: 'document',
    groups: [
        { name: 'content', title: 'İçerik', default: true },
        { name: 'meta', title: 'Meta & SEO' },
        { name: 'engagement', title: 'Etkileşim' },
        { name: 'settings', title: 'Ayarlar' },
    ],
    fields: [
        // === CONTENT GROUP ===
        defineField({
            name: 'title',
            title: 'Başlık',
            type: 'string',
            group: 'content',
            description: 'Dikkat çekici ve açıklayıcı bir başlık yazın',
            validation: (Rule) => Rule.required().min(10).max(100),
        }),
        defineField({
            name: 'subtitle',
            title: 'Alt Başlık',
            type: 'string',
            group: 'content',
            description: 'Medium tarzı alt başlık (opsiyonel)',
            validation: (Rule) => Rule.max(150),
        }),
        defineField({
            name: 'slug',
            title: 'URL Slug',
            type: 'slug',
            group: 'content',
            options: {
                source: 'title',
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'author',
            title: 'Yazar',
            type: 'reference',
            group: 'content',
            to: [{ type: 'author' }],
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'coverImage',
            title: 'Kapak Görseli',
            type: 'image',
            group: 'content',
            options: {
                hotspot: true,
            },
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
                    title: 'Görsel Açıklaması',
                },
                {
                    name: 'credit',
                    type: 'string',
                    title: 'Fotoğrafçı/Kaynak',
                },
            ],
        }),
        defineField({
            name: 'excerpt',
            title: 'Özet',
            type: 'text',
            group: 'content',
            rows: 3,
            description: 'Kart görünümlerinde ve SEO için kullanılır (max 300 karakter)',
            validation: (Rule) => Rule.required().max(300),
        }),
        defineField({
            name: 'body',
            title: 'İçerik',
            type: 'blockContent',
            group: 'content',
        }),

        // === META GROUP ===
        defineField({
            name: 'categories',
            title: 'Kategoriler',
            type: 'array',
            group: 'meta',
            of: [{ type: 'reference', to: [{ type: 'category' }] }],
            validation: (Rule) => Rule.required().min(1).max(3),
        }),
        defineField({
            name: 'tags',
            title: 'Etiketler',
            type: 'array',
            group: 'meta',
            of: [{ type: 'string' }],
            options: {
                layout: 'tags',
            },
            description: 'Virgülle ayırarak etiket ekleyin',
        }),
        defineField({
            name: 'publishedAt',
            title: 'Yayın Tarihi',
            type: 'datetime',
            group: 'meta',
            initialValue: () => new Date().toISOString(),
        }),
        defineField({
            name: 'updatedAt',
            title: 'Güncelleme Tarihi',
            type: 'datetime',
            group: 'meta',
        }),
        defineField({
            name: 'readingTime',
            title: 'Okuma Süresi (dk)',
            type: 'number',
            group: 'meta',
            description: 'Otomatik hesaplanabilir veya manuel girilebilir',
            validation: (Rule) => Rule.min(1).max(60),
        }),
        defineField({
            name: 'seo',
            title: 'SEO Ayarları',
            type: 'object',
            group: 'meta',
            options: { collapsible: true, collapsed: true },
            fields: [
                {
                    name: 'metaTitle',
                    title: 'Meta Başlık',
                    type: 'string',
                    description: 'Google sonuçlarında görünür (max 60 karakter)',
                    validation: (Rule) => Rule.max(60),
                },
                {
                    name: 'metaDescription',
                    title: 'Meta Açıklama',
                    type: 'text',
                    rows: 3,
                    description: 'Google sonuçlarında görünür (max 160 karakter)',
                    validation: (Rule) => Rule.max(160),
                },
                {
                    name: 'canonicalUrl',
                    title: 'Canonical URL',
                    type: 'url',
                    description: 'Başka bir yerde yayınlandıysa orijinal URL',
                },
                {
                    name: 'ogImage',
                    title: 'Sosyal Medya Görseli',
                    type: 'image',
                    description: '1200x630px önerilir',
                },
            ],
        }),

        // === ENGAGEMENT GROUP ===
        defineField({
            name: 'claps',
            title: 'Alkış Sayısı',
            type: 'number',
            group: 'engagement',
            initialValue: 0,
            readOnly: true,
            description: 'Medium tarzı alkış sayacı (API ile güncellenir)',
        }),
        defineField({
            name: 'views',
            title: 'Görüntülenme',
            type: 'number',
            group: 'engagement',
            initialValue: 0,
            readOnly: true,
        }),
        defineField({
            name: 'shares',
            title: 'Paylaşım Sayısı',
            type: 'number',
            group: 'engagement',
            initialValue: 0,
            readOnly: true,
        }),
        defineField({
            name: 'commentsEnabled',
            title: 'Yorumlar Açık',
            type: 'boolean',
            group: 'engagement',
            initialValue: true,
        }),

        // === SETTINGS GROUP ===
        defineField({
            name: 'featured',
            title: 'Öne Çıkan',
            type: 'boolean',
            group: 'settings',
            description: 'Ana sayfada göster',
            initialValue: false,
        }),
        defineField({
            name: 'status',
            title: 'Durum',
            type: 'string',
            group: 'settings',
            options: {
                list: [
                    { title: 'Taslak', value: 'draft' },
                    { title: 'İncelemede', value: 'review' },
                    { title: 'Yayında', value: 'published' },
                    { title: 'Arşiv', value: 'archived' },
                ],
                layout: 'radio',
            },
            initialValue: 'draft',
        }),
        defineField({
            name: 'series',
            title: 'Yazı Serisi',
            type: 'object',
            group: 'settings',
            description: 'Çok parçalı yazılar için',
            options: { collapsible: true, collapsed: true },
            fields: [
                {
                    name: 'name',
                    title: 'Seri Adı',
                    type: 'string',
                },
                {
                    name: 'part',
                    title: 'Bölüm Numarası',
                    type: 'number',
                },
                {
                    name: 'totalParts',
                    title: 'Toplam Bölüm',
                    type: 'number',
                },
            ],
        }),
        defineField({
            name: 'relatedPosts',
            title: 'İlgili Yazılar',
            type: 'array',
            group: 'settings',
            of: [{ type: 'reference', to: [{ type: 'post' }] }],
            validation: (Rule) => Rule.max(3),
        }),
    ],
    preview: {
        select: {
            title: 'title',
            author: 'author.name',
            media: 'coverImage',
            status: 'status',
            publishedAt: 'publishedAt',
        },
        prepare({ title, author, media, status, publishedAt }) {
            const statusIcons: Record<string, string> = {
                draft: '📝',
                review: '👀',
                published: '✅',
                archived: '📦',
            };
            const date = publishedAt
                ? new Date(publishedAt).toLocaleDateString('tr-TR')
                : 'Tarih yok';

            return {
                title: `${statusIcons[status] || '📝'} ${title}`,
                subtitle: `${author || 'Yazar yok'} • ${date}`,
                media,
            };
        },
    },
    orderings: [
        {
            title: 'Yayın Tarihi (Yeni)',
            name: 'publishedAtDesc',
            by: [{ field: 'publishedAt', direction: 'desc' }],
        },
        {
            title: 'Yayın Tarihi (Eski)',
            name: 'publishedAtAsc',
            by: [{ field: 'publishedAt', direction: 'asc' }],
        },
        {
            title: 'Görüntülenme',
            name: 'viewsDesc',
            by: [{ field: 'views', direction: 'desc' }],
        },
        {
            title: 'Alkış Sayısı',
            name: 'clapsDesc',
            by: [{ field: 'claps', direction: 'desc' }],
        },
    ],
});
