import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { User, LoginRequest, RegisterRequest } from '@stratford-music/shared'
import { api } from '@stratford-music/shared'

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
        // Set token in localStorage if it exists
        if (state.token) {
            localStorage.setItem('token', state.token)
        } else {
            localStorage.removeItem('token')
        }
    }, [state.token])

    useEffect(() => {
        // Check if user is authenticated on app load
        const checkAuth = async () => {
            if (state.token && !state.user) {
                try {
                    dispatch({ type: 'AUTH_START' })
                    const response = await api.auth.getProfile()
                    const responseData = response as any
                    dispatch({
                        type: 'AUTH_SUCCESS',
                        payload: { user: responseData.data.user, token: state.token! },
                    })
                } catch (error) {
                    dispatch({ type: 'AUTH_FAILURE', payload: 'Session expired' })
                }
            }
        }

        checkAuth()
    }, [])

    const login = async (credentials: LoginRequest) => {
        try {
            dispatch({ type: 'AUTH_START' })
            const response = await api.auth.login(credentials)
            const responseData = response as any
            dispatch({
                type: 'AUTH_SUCCESS',
                payload: { user: responseData.data.user, token: responseData.data.token },
            })
        } catch (error: any) {
            dispatch({
                type: 'AUTH_FAILURE',
                payload: error.message || 'Login failed',
            })
        }
    }

    const register = async (userData: RegisterRequest) => {
        try {
            dispatch({ type: 'AUTH_START' })
            const response = await api.auth.register(userData)
            const responseData = response as any
            dispatch({
                type: 'AUTH_SUCCESS',
                payload: { user: responseData.data.user, token: responseData.data.token },
            })
        } catch (error: any) {
            dispatch({
                type: 'AUTH_FAILURE',
                payload: error.message || 'Registration failed',
            })
        }
    }

    const logout = () => {
        dispatch({ type: 'AUTH_LOGOUT' })
    }

    const clearError = () => {
        dispatch({ type: 'CLEAR_ERROR' })
    }

    const updateProfile = async (data: Partial<User>) => {
        try {
            const response = await api.auth.updateProfile(data)
            const responseData = response as any
            dispatch({
                type: 'AUTH_SUCCESS',
                payload: { user: responseData.data.user, token: state.token! },
            })
        } catch (error: any) {
            dispatch({
                type: 'AUTH_FAILURE',
                payload: error.message || 'Profile update failed',
            })
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