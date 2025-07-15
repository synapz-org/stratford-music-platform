import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, MapPin, Music, ArrowRight, Play, Users } from 'lucide-react'
import { Event } from '@stratford-music/shared'
import { api } from '@stratford-music/shared'
import EventCard from '../components/EventCard'

const HomePage: React.FC = () => {
    const [todayEvents, setTodayEvents] = useState<Event[]>([])
    const [featuredEvents, setFeaturedEvents] = useState<Event[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [todayResponse, featuredResponse] = await Promise.all([
                    api.events.getToday(),
                    api.events.getAll({ limit: 6, status: 'PUBLISHED' })
                ])

                const todayData = todayResponse as any
                const featuredData = featuredResponse as any

                setTodayEvents(todayData.data.events)
                setFeaturedEvents(featuredData.data.events)
            } catch (error) {
                console.error('Error fetching data:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [])

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

            {/* Today's Events */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Today's Events
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Don't miss out on what's happening in Stratford today. From live music to theatre performances.
                        </p>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="card animate-pulse">
                                    <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                                    <div className="p-6">
                                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                        <div className="h-3 bg-gray-200 rounded mb-4"></div>
                                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : todayEvents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {todayEvents.slice(0, 3).map((event) => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Music className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Events Today</h3>
                            <p className="text-gray-600 mb-6">Check out upcoming events or browse our venues.</p>
                            <Link
                                to="/events"
                                className="btn-primary inline-flex items-center"
                            >
                                Browse All Events
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </div>
                    )}
                </div>
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

            {/* Featured Events */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                                Featured Events
                            </h2>
                            <p className="text-lg text-gray-600">
                                Handpicked events you won't want to miss
                            </p>
                        </div>
                        <Link
                            to="/events"
                            className="btn-outline inline-flex items-center"
                        >
                            View All
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="card animate-pulse">
                                    <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                                    <div className="p-6">
                                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                        <div className="h-3 bg-gray-200 rounded mb-4"></div>
                                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featuredEvents.map((event) => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </div>
                    )}
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