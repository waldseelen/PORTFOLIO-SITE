import { groq } from 'next-sanity';

// Blog queries
export const featuredPostsQuery = groq`
  *[_type == "post" && featured == true] | order(publishedAt desc) [0...$limit] {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    "author": author->{
      name,
      "image": image.asset->url
    },
    "categories": categories[]->{
      title,
      slug
    },
    mainImage {
      asset->{
        _id,
        url
      },
      alt
    }
  }
`;

export const allPostsQuery = groq`
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    "author": author->{
      name,
      "image": image.asset->url
    },
    "categories": categories[]->{
      title,
      slug
    },
    mainImage {
      asset->{
        _id,
        url
      },
      alt
    }
  }
`;

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    body,
    publishedAt,
    "author": author->{
      name,
      bio,
      "image": image.asset->url
    },
    "categories": categories[]->{
      title,
      slug
    },
    mainImage {
      asset->{
        _id,
        url
      },
      alt
    },
    seo {
      metaTitle,
      metaDescription,
      shareGraphic
    }
  }
`;

export const postSlugsQuery = groq`
  *[_type == "post" && defined(slug.current)][].slug.current
`;

// Project queries
export const allProjectsQuery = groq`
  *[_type == "project"] | order(order asc, _createdAt desc) {
    _id,
    title,
    slug,
    excerpt,
    "categories": categories[]->{
      title,
      slug
    },
    mainImage {
      asset->{
        _id,
        url
      },
      alt
    },
    technologies,
    featured
  }
`;

export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    body,
    "categories": categories[]->{
      title,
      slug
    },
    mainImage {
      asset->{
        _id,
        url
      },
      alt
    },
    technologies,
    githubUrl,
    liveUrl,
    featured,
    seo {
      metaTitle,
      metaDescription,
      shareGraphic
    }
  }
`;

export const projectSlugsQuery = groq`
  *[_type == "project" && defined(slug.current)][].slug.current
`;

// Page queries
export const pageBySlugQuery = groq`
  *[_type == "page" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    body,
    seo {
      metaTitle,
      metaDescription,
      shareGraphic
    }
  }
`;

// Featured projects query
export const featuredProjectsQuery = groq`
  *[_type == "project" && featured == true] | order(order asc, _createdAt desc) [0...$limit] {
    _id,
    title,
    slug,
    excerpt,
    "categories": categories[]->{
      title,
      slug
    },
    mainImage {
      asset->{
        _id,
        url
      },
      alt
    },
    technologies,
    featured
  }
`;

// Site settings query
export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    title,
    description,
    logo {
      asset->{
        _id,
        url
      }
    },
    ogImage {
      asset->{
        _id,
        url
      }
    },
    author {
      name,
      email,
      bio,
      avatar {
        asset->{
          _id,
          url
        }
      }
    },
    social {
      twitter,
      github,
      linkedin,
      instagram,
      youtube
    },
    analytics {
      googleAnalyticsId,
      googleTagManagerId
    },
    contact {
      email,
      phone,
      address
    }
  }
`;
