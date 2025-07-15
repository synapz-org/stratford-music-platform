import React from 'react'
import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

const NotFoundPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="text-center">
                <h1 className="text-9xl font-bold text-primary-600">404</h1>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h2>
                <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/"
                        className="btn-primary inline-flex items-center"
                    >
                        <Home className="w-4 h-4 mr-2" />
                        Go Home
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="btn-outline inline-flex items-center"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    )
}

export default NotFoundPage 