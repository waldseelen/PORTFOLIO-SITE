import { defineField, defineType } from 'sanity';

// Supported languages
export const supportedLanguages = [
    { id: 'tr', title: 'Türkçe', isDefault: true },
    { id: 'en', title: 'English' },
] as const;

export type SupportedLanguage = (typeof supportedLanguages)[number]['id'];

// Localized string field type
export const localizedString = defineType({
    name: 'localizedString',
    title: 'Localized String',
    type: 'object',
    fieldsets: [
        {
            name: 'translations',
            title: 'Translations',
            options: { collapsible: true, collapsed: false },
        },
    ],
    fields: supportedLanguages.map((lang) =>
        defineField({
            name: lang.id,
            title: lang.title,
            type: 'string',
            fieldset: 'translations',
        })
    ),
});

// Localized text field type (multiline)
export const localizedText = defineType({
    name: 'localizedText',
    title: 'Localized Text',
    type: 'object',
    fieldsets: [
        {
            name: 'translations',
            title: 'Translations',
            options: { collapsible: true, collapsed: false },
        },
    ],
    fields: supportedLanguages.map((lang) =>
        defineField({
            name: lang.id,
            title: lang.title,
            type: 'text',
            rows: 3,
            fieldset: 'translations',
        })
    ),
});

// Localized block content field type
export const localizedBlockContent = defineType({
    name: 'localizedBlockContent',
    title: 'Localized Block Content',
    type: 'object',
    fieldsets: [
        {
            name: 'translations',
            title: 'Translations',
            options: { collapsible: true, collapsed: false },
        },
    ],
    fields: supportedLanguages.map((lang) =>
        defineField({
            name: lang.id,
            title: lang.title,
            type: 'blockContent',
            fieldset: 'translations',
        })
    ),
});

// Helper function to get localized value
export function getLocalizedValue<T>(
    field: Record<string, T> | undefined,
    locale: SupportedLanguage
): T | undefined {
    if (!field) return undefined;

    // Try requested locale first
    if (field[locale]) return field[locale];

    // Fallback to default locale (Turkish)
    if (field['tr']) return field['tr'];

    // Fallback to any available locale
    const availableLocale = Object.keys(field).find((key) => field[key]);
    return availableLocale ? field[availableLocale] : undefined;
}
