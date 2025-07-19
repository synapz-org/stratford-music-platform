export interface User {
    id: string
    email: string
    name?: string
    role: UserRole
    bio?: string
    phone?: string
    address?: string
    createdAt: Date
    updatedAt: Date
}

export type UserRole = 'ADMIN' | 'VENUE' | 'ARTIST' | 'READER'

export interface AuthResponse {
    user: User
    token: string
}

export interface LoginRequest {
    email: string
    password: string
}

export interface RegisterRequest {
    email: string
    password: string
    name?: string
    role?: UserRole
}

export interface ApiResponse<T = any> {
    success: boolean
    data?: T
    error?: string
    details?: any[]
    message?: string
}
