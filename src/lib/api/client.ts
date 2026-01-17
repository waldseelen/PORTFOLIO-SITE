/**
 * Django API Client
 *
 * A centralized API client for communicating with the Django backend.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    pagination?: {
        current_page: number;
        total_pages: number;
        total_items: number;
        has_next: boolean;
        has_previous: boolean;
    };
}

interface RequestOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    body?: unknown;
    headers?: Record<string, string>;
    cache?: RequestCache;
    next?: NextFetchRequestConfig;
}

async function apiRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    const { method = 'GET', body, headers = {}, cache, next } = options;

    const url = `${API_BASE_URL}${endpoint}`;

    const fetchOptions: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
        cache,
    };

    // Add Next.js specific options
    if (next) {
        (fetchOptions as RequestInit & { next: NextFetchRequestConfig }).next = next;
    }

    if (body) {
        fetchOptions.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(url, fetchOptions);
        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: data.error || `HTTP error ${response.status}`,
            };
        }

        return data;
    } catch (error) {
        console.error(`API request failed: ${endpoint}`, error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Network error',
        };
    }
}

// Blog API
export const blogApi = {
    getPosts: (page = 1) =>
        apiRequest<unknown[]>(`/api/blog/posts/?page=${page}`, {
            next: { revalidate: 21600 }, // 6 hours
        }),

    getPost: (slug: string) =>
        apiRequest<unknown>(`/api/blog/posts/${slug}/`, {
            next: { revalidate: 86400 }, // 24 hours
        }),

    getCategories: () =>
        apiRequest<unknown[]>('/api/blog/categories/', {
            next: { revalidate: 86400 },
        }),

    getPostsByCategory: (slug: string, page = 1) =>
        apiRequest<unknown[]>(`/api/blog/categories/${slug}/?page=${page}`, {
            next: { revalidate: 21600 },
        }),

    getFeaturedPosts: () =>
        apiRequest<unknown[]>('/api/blog/featured/', {
            next: { revalidate: 21600 },
        }),

    getRecentPosts: (limit = 5) =>
        apiRequest<unknown[]>(`/api/blog/recent/?limit=${limit}`, {
            next: { revalidate: 3600 }, // 1 hour
        }),

    searchPosts: (query: string, page = 1) =>
        apiRequest<unknown[]>(`/api/blog/search/?q=${encodeURIComponent(query)}&page=${page}`),
};

// Projects/Portfolio API
export const projectsApi = {
    getProjects: (page = 1) =>
        apiRequest<unknown[]>(`/api/portfolio/projects/?page=${page}`, {
            next: { revalidate: 21600 },
        }),

    getProject: (slug: string) =>
        apiRequest<unknown>(`/api/portfolio/projects/${slug}/`, {
            next: { revalidate: 86400 },
        }),

    getFeaturedProjects: () =>
        apiRequest<unknown[]>('/api/portfolio/featured/', {
            next: { revalidate: 21600 },
        }),

    getTechnologies: () =>
        apiRequest<unknown[]>('/api/portfolio/technologies/', {
            next: { revalidate: 86400 },
        }),
};

// Tools API
export const toolsApi = {
    getTools: (page = 1) =>
        apiRequest<unknown[]>(`/api/tools/?page=${page}`, {
            next: { revalidate: 21600 },
        }),

    getTool: (slug: string) =>
        apiRequest<unknown>(`/api/tools/${slug}/`, {
            next: { revalidate: 86400 },
        }),

    getFeaturedTools: () =>
        apiRequest<unknown[]>('/api/tools/featured/', {
            next: { revalidate: 21600 },
        }),

    getCategories: () =>
        apiRequest<unknown[]>('/api/tools/categories/', {
            next: { revalidate: 86400 },
        }),
};

// Contact API
export const contactApi = {
    submit: (data: { name: string; email: string; subject?: string; message: string }) =>
        apiRequest<{ id: number; message: string }>('/api/contact/submit/', {
            method: 'POST',
            body: data,
        }),

    getInfo: () =>
        apiRequest<{ email: string; social: Record<string, string>; location: string }>(
            '/api/contact/info/',
            { next: { revalidate: 86400 } }
        ),
};

// Chat API
export const chatApi = {
    sendMessage: (message: string, sessionId?: string) =>
        apiRequest<{ session_id: string; message: string; response: string }>(
            '/api/chat/message/',
            {
                method: 'POST',
                body: { message, session_id: sessionId },
            }
        ),

    getHistory: (sessionId: string) =>
        apiRequest<{ session_id: string; messages: unknown[] }>(
            `/api/chat/history/?session_id=${sessionId}`
        ),

    clearChat: (sessionId: string) =>
        apiRequest<{ message: string }>('/api/chat/clear/', {
            method: 'POST',
            body: { session_id: sessionId },
        }),
};

// Search API
export const searchApi = {
    search: (query: string, page = 1) =>
        apiRequest<unknown[]>(`/api/search/?q=${encodeURIComponent(query)}&page=${page}`),

    autocomplete: (query: string) =>
        apiRequest<string[]>(`/api/search/autocomplete/?q=${encodeURIComponent(query)}`),

    filters: () =>
        apiRequest<Record<string, unknown[]>>('/api/search/filters/', {
            next: { revalidate: 86400 },
        }),
};

// Health check
export const healthApi = {
    check: () => apiRequest<{ status: string; timestamp: string }>('/api/health/'),
};

// Combined API object
export const api = {
    blog: blogApi,
    projects: projectsApi,
    tools: toolsApi,
    contact: contactApi,
    chat: chatApi,
    search: searchApi,
    health: healthApi,
};
