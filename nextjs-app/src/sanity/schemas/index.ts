import { author } from './author';
import { blockContent } from './blockContent';
import { category } from './category';
import { page } from './page';
import { post } from './post';
import { project } from './project';
import { siteSettings } from './siteSettings';

export const schemaTypes = [
    // Document types
    post,
    author,
    category,
    project,
    page,
    siteSettings,
    // Object types
    blockContent,
];
