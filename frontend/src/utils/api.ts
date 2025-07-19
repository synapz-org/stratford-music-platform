const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

export class ApiError extends Error {
    constructor(
        public status: number,
        public override message: string,
        public details?: any
    ) {
        super(message)
        this.name = 'ApiError'
    }
}

const getAuthHeaders = (token?: string) => {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`
    }

    return headers
}

const parseApiResponse = async <T>(response: Response): Promise<T> => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({})) as any
        throw new ApiError(
            response.status,
            errorData.error || response.statusText,
            errorData.details
        )
    }

    return response.json() as Promise<T>
}

export class ApiClient {
    private baseUrl: string
    private token?: string

    constructor(baseUrl: string = API_BASE_URL) {
        this.baseUrl = baseUrl
    }

    setToken(token: string) {
        this.token = token
    }

    clearToken() {
        this.token = undefined
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`
        const headers = getAuthHeaders(this.token)

        const config: RequestInit = {
            ...options,
            headers: {
                ...headers,
                ...options.headers,
            },
        }

        const response = await fetch(url, config)
        return parseApiResponse<T>(response)
    }

    async get<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, { method: 'GET' })
    }

    async post<T>(endpoint: string, data?: any): Promise<T> {
        const config: RequestInit = { method: 'POST' }
        if (data) {
            config.body = JSON.stringify(data)
        }
        return this.request<T>(endpoint, config)
    }

    async put<T>(endpoint: string, data?: any): Promise<T> {
        const config: RequestInit = { method: 'PUT' }
        if (data) {
            config.body = JSON.stringify(data)
        }
        return this.request<T>(endpoint, config)
    }

    async delete<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, { method: 'DELETE' })
    }
}

export const apiClient = new ApiClient()
