import type { StructureBuilder } from 'sanity/structure'
import { Dashboard } from './components/Dashboard'

export const myStructure = (S: StructureBuilder) =>
    S.list()
        .title('Command Center')
        .items([
            // Dashboard Item
            S.listItem()
                .title('Dashboard')
                .icon(() => '📊')
                .child(
                    S.component()
                        .component(Dashboard)
                        .title('Dashboard')
                ),

            S.divider(),

            // Content Management
            S.documentTypeListItem('post').title('Blog Posts').icon(() => '📝'),
            S.documentTypeListItem('project').title('Projects').icon(() => '🚀'),

            S.divider(),

            // Inbox Section
            S.listItem()
                .title('Inbox')
                .icon(() => '📥')
                .child(
                    S.list()
                        .title('Inbox')
                        .items([
                            S.listItem()
                                .title('Unread Messages')
                                .icon(() => '🔴')
                                .child(
                                    S.documentList()
                                        .title('Unread Messages')
                                        .filter('_type == "contactMessage" && read == false')
                                ),
                            S.listItem()
                                .title('Read Messages')
                                .icon(() => '✅')
                                .child(
                                    S.documentList()
                                        .title('Read Messages')
                                        .filter('_type == "contactMessage" && read == true')
                                ),
                            S.documentTypeListItem('contactMessage').title('All Messages').icon(() => '📨'),
                        ])
                ),

            S.divider(),

            // Settings & Configuration
            S.listItem()
                .title('Authors')
                .icon(() => '🧑‍💻')
                .child(
                    S.documentTypeList('author')
                        .title('Authors')
                ),

            S.listItem()
                .title('Site Settings')
                .icon(() => '⚙️')
                .child(
                    S.document()
                        .schemaType('siteSettings')
                        .documentId('siteSettings')
                        .title('Site Settings')
                ),

            // Categories & Pages (Lower Priority)
            S.documentTypeListItem('category').title('Categories').icon(() => '🏷️'),
            S.documentTypeListItem('page').title('Static Pages').icon(() => '📄'),
        ])

