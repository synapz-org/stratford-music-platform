import React from 'react'
import { Link } from 'react-router-dom'
import { Calendar, MapPin, Music, ArrowRight, Play, Users } from 'lucide-react'

const HomePage: React.FC = () => {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-20"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Discover Stratford's
                            <span className="block text-secondary-300">Music & Arts Scene</span>
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
                            Experience live music, theatre, and cultural events in the heart of Ontario's
                            most vibrant arts community.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/events"
                                className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
                            >
                                <Calendar className="w-5 h-5 mr-2" />
                                Browse Events
                            </Link>
                            <Link
                                to="/venues"
                                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors inline-flex items-center justify-center"
                            >
                                <MapPin className="w-5 h-5 mr-2" />
                                Find Venues
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-10 left-10 w-20 h-20 bg-white opacity-10 rounded-full"></div>
                <div className="absolute bottom-20 right-20 w-32 h-32 bg-secondary-400 opacity-20 rounded-full"></div>
                <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-accent-400 opacity-30 rounded-full"></div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Why Choose Stratford Music?
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Your gateway to the best music and arts experiences in Stratford, Ontario.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Calendar className="w-8 h-8 text-primary-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Live Events</h3>
                            <p className="text-gray-600">
                                Discover upcoming concerts, theatre performances, and cultural events happening in Stratford.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MapPin className="w-8 h-8 text-secondary-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Local Venues</h3>
                            <p className="text-gray-600">
                                Explore the best venues in Stratford, from intimate cafes to grand theatres.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="w-8 h-8 text-accent-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Community</h3>
                            <p className="text-gray-600">
                                Connect with local artists, musicians, and fellow music lovers in our vibrant community.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Ready to Experience Stratford's Music Scene?
                    </h2>
                    <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
                        Join our community and never miss another amazing event in Stratford.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/register"
                            className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
                        >
                            <Users className="w-5 h-5 mr-2" />
                            Join Now
                        </Link>
                        <Link
                            to="/events"
                            className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors inline-flex items-center justify-center"
                        >
                            <Play className="w-5 h-5 mr-2" />
                            Explore Events
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default HomePage 