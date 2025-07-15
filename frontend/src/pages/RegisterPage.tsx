import React from 'react'
import { Link } from 'react-router-dom'

const RegisterPage: React.FC = () => {
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
                    <div className="text-center py-8">
                        <p className="text-gray-600 mb-4">Registration form coming soon...</p>
                        <Link to="/login" className="btn-primary">
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage 