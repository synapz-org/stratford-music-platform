// API Configuration
export const API_BASE_URL = process.env['REACT_APP_API_URL'] || 'http://localhost:3001/api';

export const API_ENDPOINTS = {
    // Authentication
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        ME: '/auth/me',
    },

    // Events
    EVENTS: {
        LIST: '/events',
        TODAY: '/events/today',
        DETAIL: (id: string) => `/events/${id}`,
        CREATE: '/events',
        UPDATE: (id: string) => `/events/${id}`,
        DELETE: (id: string) => `/events/${id}`,
    },

    // Venues
    VENUES: {
        LIST: '/venues',
        DETAIL: (id: string) => `/venues/${id}`,
        CREATE: '/venues',
        UPDATE: (id: string) => `/venues/${id}`,
        DELETE: (id: string) => `/venues/${id}`,
    },

    // Users
    USERS: {
        LIST: '/users',
    },

    // Magazine
    MAGAZINE: {
        ISSUES: '/magazine/issues',
        ISSUE_DETAIL: (id: string) => `/magazine/issues/${id}`,
    },

    // Playlists
    PLAYLISTS: {
        LIST: '/playlists',
        DETAIL: (id: string) => `/playlists/${id}`,
    },

    // Advertisements
    ADVERTISEMENTS: {
        LIST: '/advertisements',
    },
} as const;

// HTTP Methods
export const HTTP_METHODS = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
    PATCH: 'PATCH',
} as const;

// API Headers
export const getAuthHeaders = (token?: string) => {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
};

// API Error Handling
export class ApiError extends Error {
    constructor(
        public status: number,
        public override message: string,
        public details?: any
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

// API Response Parsing
export const parseApiResponse = async <T>(response: Response): Promise<T> => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({})) as any;
        throw new ApiError(
            response.status,
            errorData.error || response.statusText,
            errorData.details
        );
    }

    return response.json() as Promise<T>;
};

// Generic API Client
export class ApiClient {
    private baseUrl: string;
    private token?: string;

    constructor(baseUrl: string = API_BASE_URL) {
        this.baseUrl = baseUrl;
    }

    setToken(token: string) {
        this.token = token;
    }

    clearToken() {
        this.token = undefined as any;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;
        const headers = getAuthHeaders(this.token);

        const config: RequestInit = {
            ...options,
            headers: {
                ...headers,
                ...options.headers,
            },
        };

        const response = await fetch(url, config);
        return parseApiResponse<T>(response);
    }

    // GET request
    async get<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, { method: HTTP_METHODS.GET });
    }

    // POST request
    async post<T>(endpoint: string, data?: any): Promise<T> {
        const config: RequestInit = { method: HTTP_METHODS.POST };
        if (data) {
            config.body = JSON.stringify(data);
        }
        return this.request<T>(endpoint, config);
    }

    // PUT request
    async put<T>(endpoint: string, data?: any): Promise<T> {
        const config: RequestInit = { method: HTTP_METHODS.PUT };
        if (data) {
            config.body = JSON.stringify(data);
        }
        return this.request<T>(endpoint, config);
    }

    // DELETE request
    async delete<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, { method: HTTP_METHODS.DELETE });
    }

    // PATCH request
    async patch<T>(endpoint: string, data?: any): Promise<T> {
        const config: RequestInit = { method: HTTP_METHODS.PATCH };
        if (data) {
            config.body = JSON.stringify(data);
        }
        return this.request<T>(endpoint, config);
    }
}

// Default API client instance
export const apiClient = new ApiClient();

// Utility functions for common API operations
export const api = {
    // Authentication
    auth: {
        login: (credentials: { email: string; password: string }) =>
            apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials),

        register: (userData: { email: string; password: string; name?: string; role?: string }) =>
            apiClient.post(API_ENDPOINTS.AUTH.REGISTER, userData),

        getProfile: () => apiClient.get(API_ENDPOINTS.AUTH.ME),

        updateProfile: (data: any) => apiClient.put(API_ENDPOINTS.AUTH.ME, data),
    },

    // Events
    events: {
        getAll: (filters?: Record<string, any>) => {
            const params = new URLSearchParams(filters);
            return apiClient.get(`${API_ENDPOINTS.EVENTS.LIST}?${params}`);
        },

        getToday: () => apiClient.get(API_ENDPOINTS.EVENTS.TODAY),

        getById: (id: string) => apiClient.get(API_ENDPOINTS.EVENTS.DETAIL(id)),

        create: (data: any) => apiClient.post(API_ENDPOINTS.EVENTS.CREATE, data),

        update: (id: string, data: any) => apiClient.put(API_ENDPOINTS.EVENTS.UPDATE(id), data),

        delete: (id: string) => apiClient.delete(API_ENDPOINTS.EVENTS.DELETE(id)),
    },

    // Venues
    venues: {
        getAll: (filters?: Record<string, any>) => {
            const params = new URLSearchParams(filters);
            return apiClient.get(`${API_ENDPOINTS.VENUES.LIST}?${params}`);
        },

        getById: (id: string) => apiClient.get(API_ENDPOINTS.VENUES.DETAIL(id)),

        create: (data: any) => apiClient.post(API_ENDPOINTS.VENUES.CREATE, data),

        update: (id: string, data: any) => apiClient.put(API_ENDPOINTS.VENUES.UPDATE(id), data),

        delete: (id: string) => apiClient.delete(API_ENDPOINTS.VENUES.DELETE(id)),
    },

    // Magazine
    magazine: {
        getIssues: () => apiClient.get(API_ENDPOINTS.MAGAZINE.ISSUES),

        getIssue: (id: string) => apiClient.get(API_ENDPOINTS.MAGAZINE.ISSUE_DETAIL(id)),
    },

    // Playlists
    playlists: {
        getAll: () => apiClient.get(API_ENDPOINTS.PLAYLISTS.LIST),

        getById: (id: string) => apiClient.get(API_ENDPOINTS.PLAYLISTS.DETAIL(id)),
    },

    // Advertisements
    advertisements: {
        getAll: () => apiClient.get(API_ENDPOINTS.ADVERTISEMENTS.LIST),
    },
}; 