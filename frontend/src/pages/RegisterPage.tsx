import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, User, UserCheck } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
import LoadingSpinner from '@/components/LoadingSpinner'
import type { UserRole } from '@/types/auth'

const RegisterPage: React.FC = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [name, setName] = useState('')
    const [role, setRole] = useState<UserRole>('READER')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    const { register } = useAuth()
    const navigate = useNavigate()

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        // Email validation
        if (!email) {
            newErrors.email = 'Email is required'
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email is invalid'
        }

        // Name validation
        if (!name.trim()) {
            newErrors.name = 'Name is required'
        } else if (name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters'
        }

        // Password validation
        if (!password) {
            newErrors.password = 'Password is required'
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters'
        }

        // Confirm password validation
        if (!confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password'
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setIsLoading(true)

        try {
            console.log('Attempting registration with:', {
                email: email.trim(),
                name: name.trim(),
                role,
                apiUrl: 'https://stratford-music-platform-production.up.railway.app/api'
            })
            
            await register({
                email: email.trim(),
                password,
                name: name.trim(),
                role
            })
            toast.success('Welcome to Stratford Music Platform!')
            navigate('/')
        } catch (error: any) {
            console.error('Registration error:', error)
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                toast.error('Network error: Unable to connect to server. Please check your connection.')
            } else if (error.status === 400) {
                toast.error(error.message || 'Invalid registration data')
            } else if (error.status === 500) {
                toast.error('Server error: Please try again later')
            } else {
                toast.error(error.message || 'Registration failed')
            }
        } finally {
            setIsLoading(false)
        }
    }

    const roleOptions = [
        { value: 'READER' as UserRole, label: 'Reader', description: 'Browse events and read the magazine' },
        { value: 'ARTIST' as UserRole, label: 'Artist', description: 'Create playlists and contribute content' },
        { value: 'VENUE' as UserRole, label: 'Venue Owner', description: 'Manage venues and create events' },
    ]

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Join the Stratford Music community
                    </p>
                </div>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="card">
                    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                        {/* Name Field */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Full Name
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className={`input pl-10 ${errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                                    placeholder="Enter your full name"
                                />
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            </div>
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`input pl-10 ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                                    placeholder="Enter your email"
                                />
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>

                        {/* Role Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Account Type
                            </label>
                            <div className="space-y-3">
                                {roleOptions.map((option) => (
                                    <div key={option.value} className="flex items-start">
                                        <div className="flex items-center h-5">
                                            <input
                                                id={option.value}
                                                name="role"
                                                type="radio"
                                                value={option.value}
                                                checked={role === option.value}
                                                onChange={(e) => setRole(e.target.value as UserRole)}
                                                className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300"
                                            />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label htmlFor={option.value} className="font-medium text-gray-700 cursor-pointer">
                                                {option.label}
                                            </label>
                                            <p className="text-gray-500">{option.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`input pl-10 pr-10 ${errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                                    placeholder="Enter your password"
                                />
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className={`input pl-10 pr-10 ${errors.confirmPassword ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                                    placeholder="Confirm your password"
                                />
                                <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                            )}
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn-primary w-full flex items-center justify-center"
                            >
                                {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
                                {isLoading ? 'Creating account...' : 'Create account'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary-600 hover:text-primary-500 font-medium">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage 