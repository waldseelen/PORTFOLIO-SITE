/**
 * Data Layer - Central Export
 * Re-exports all data fetching functions
 */

// Blog data
export {
    getAllPostSlugs, getAllPosts,
    getFeaturedPosts,
    getPostBySlug, getPostsByCategory,
    getRelatedPosts
} from './blog';

// Project data
export {
    getAllProjectSlugs, getAllProjects, getAllTechnologies, getFeaturedProjects,
    getProjectBySlug, getProjectsByTechnology
} from './projects';

// Settings & Pages
export { getPageBySlug, getSiteSettings } from './settings';

