import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { apiClient } from '@/utils/api'
import type { User, LoginRequest, RegisterRequest, AuthResponse, ApiResponse } from '@/types/auth'

interface AuthState {
    user: User | null
    token: string | null
    isLoading: boolean
    error: string | null
}

type AuthAction =
    | { type: 'AUTH_START' }
    | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
    | { type: 'AUTH_FAILURE'; payload: string }
    | { type: 'AUTH_LOGOUT' }
    | { type: 'CLEAR_ERROR' }

const initialState: AuthState = {
    user: null,
    token: localStorage.getItem('token'),
    isLoading: false,
    error: null,
}

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case 'AUTH_START':
            return { ...state, isLoading: true, error: null }
        case 'AUTH_SUCCESS':
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                isLoading: false,
                error: null,
            }
        case 'AUTH_FAILURE':
            return {
                ...state,
                user: null,
                token: null,
                isLoading: false,
                error: action.payload,
            }
        case 'AUTH_LOGOUT':
            return {
                ...state,
                user: null,
                token: null,
                isLoading: false,
                error: null,
            }
        case 'CLEAR_ERROR':
            return { ...state, error: null }
        default:
            return state
    }
}

interface AuthContextType extends AuthState {
    login: (credentials: LoginRequest) => Promise<void>
    register: (userData: RegisterRequest) => Promise<void>
    logout: () => void
    clearError: () => void
    updateProfile: (data: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState)

    useEffect(() => {
        // Set token in localStorage and API client
        if (state.token) {
            localStorage.setItem('token', state.token)
            apiClient.setToken(state.token)
        } else {
            localStorage.removeItem('token')
            apiClient.clearToken()
        }
    }, [state.token])

    // Initialize user from token on mount
    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem('token')
            if (token) {
                try {
                    apiClient.setToken(token)
                    const response: ApiResponse<{ user: User }> = await apiClient.get('/auth/me')

                    if (response.success && response.data) {
                        dispatch({
                            type: 'AUTH_SUCCESS',
                            payload: { user: response.data.user, token },
                        })
                    } else {
                        // Invalid token, clear it
                        localStorage.removeItem('token')
                        apiClient.clearToken()
                    }
                } catch (error) {
                    // Invalid token, clear it
                    localStorage.removeItem('token')
                    apiClient.clearToken()
                }
            }
        }

        initializeAuth()
    }, [])

    const login = async (credentials: LoginRequest) => {
        try {
            dispatch({ type: 'AUTH_START' })

            const response: ApiResponse<AuthResponse> = await apiClient.post('/auth/login', credentials)

            if (response.success && response.data) {
                const { user, token } = response.data
                apiClient.setToken(token)

                dispatch({
                    type: 'AUTH_SUCCESS',
                    payload: { user, token },
                })
            } else {
                throw new Error(response.error || 'Login failed')
            }
        } catch (error: any) {
            dispatch({
                type: 'AUTH_FAILURE',
                payload: error.message || 'Login failed',
            })
            throw error
        }
    }

    const register = async (userData: RegisterRequest) => {
        try {
            dispatch({ type: 'AUTH_START' })

            const response: ApiResponse<AuthResponse> = await apiClient.post('/auth/register', userData)

            if (response.success && response.data) {
                const { user, token } = response.data
                apiClient.setToken(token)

                dispatch({
                    type: 'AUTH_SUCCESS',
                    payload: { user, token },
                })
            } else {
                throw new Error(response.error || 'Registration failed')
            }
        } catch (error: any) {
            dispatch({
                type: 'AUTH_FAILURE',
                payload: error.message || 'Registration failed',
            })
            throw error
        }
    }

    const logout = () => {
        apiClient.clearToken()
        dispatch({ type: 'AUTH_LOGOUT' })
    }

    const clearError = () => {
        dispatch({ type: 'CLEAR_ERROR' })
    }

    const updateProfile = async (data: Partial<User>) => {
        try {
            dispatch({ type: 'AUTH_START' })

            const response: ApiResponse<{ user: User }> = await apiClient.put('/auth/me', data)

            if (response.success && response.data) {
                dispatch({
                    type: 'AUTH_SUCCESS',
                    payload: { user: response.data.user, token: state.token! },
                })
            } else {
                throw new Error(response.error || 'Profile update failed')
            }
        } catch (error: any) {
            dispatch({
                type: 'AUTH_FAILURE',
                payload: error.message || 'Profile update failed',
            })
            throw error
        }
    }

    const value: AuthContextType = {
        ...state,
        login,
        register,
        logout,
        clearError,
        updateProfile,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
} 