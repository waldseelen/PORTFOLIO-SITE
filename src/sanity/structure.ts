import type { StructureResolver } from 'sanity/structure';

/**
 * Custom Sanity Structure for organized content management
 * Medium-style blog with organized sections
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('İçerik Yönetimi')
    .items([
      // === BLOG SECTION ===
      S.listItem()
        .title('Blog')
        .child(
          S.list()
            .title('Blog Yönetimi')
            .items([
              S.listItem()
                .title('Tüm Yazılar')
                .schemaType('post')
                .child(
                  S.documentTypeList('post')
                    .title('Tüm Blog Yazıları')
                    .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                ),
              S.divider(),
              S.listItem()
                .title('Taslaklar')
                .schemaType('post')
                .child(
                  S.documentList()
                    .title('Taslak Yazılar')
                    .filter('_type == "post" && status == "draft"')
                ),
              S.listItem()
                .title('Yayında')
                .schemaType('post')
                .child(
                  S.documentList()
                    .title('Yayındaki Yazılar')
                    .filter('_type == "post" && status == "published"')
                    .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                ),
              S.listItem()
                .title('Öne Çıkanlar')
                .schemaType('post')
                .child(
                  S.documentList()
                    .title('Öne Çıkan Yazılar')
                    .filter('_type == "post" && featured == true')
                ),
              S.divider(),
              S.listItem()
                .title('Kategoriler')
                .schemaType('category')
                .child(S.documentTypeList('category').title('Kategoriler')),
            ])
        ),

      // === AUTHORS ===
      S.listItem()
        .title('Yazarlar')
        .schemaType('author')
        .child(S.documentTypeList('author').title('Yazarlar')),

      // === PROJECTS ===
      S.listItem()
        .title('Projeler')
        .schemaType('project')
        .child(S.documentTypeList('project').title('Projeler')),

      // === PAGES ===
      S.listItem()
        .title('Sayfalar')
        .schemaType('page')
        .child(S.documentTypeList('page').title('Sayfalar')),

      S.divider(),

      // === COMMENTS ===
      S.listItem()
        .title('Yorumlar')
        .schemaType('comment')
        .child(S.documentTypeList('comment').title('Tüm Yorumlar')),

      // === CONTACT MESSAGES ===
      S.listItem()
        .title('İletişim Mesajları')
        .schemaType('contactMessage')
        .child(S.documentTypeList('contactMessage').title('Gelen Mesajlar')),

      S.divider(),

      // === SETTINGS ===
      S.listItem()
        .title('Site Ayarları')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Site Ayarları')
        ),
    ]);
