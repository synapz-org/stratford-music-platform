import React from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Clock, MapPin, DollarSign, Music } from 'lucide-react'
import { Event, EVENT_CATEGORIES } from '@stratford-music/shared'

interface EventCardProps {
    event: Event
    showActions?: boolean
    onEdit?: (event: Event) => void
    onDelete?: (eventId: string) => void
}

const EventCard: React.FC<EventCardProps> = ({
    event,
    showActions = false,
    onEdit,
    onDelete
}) => {
    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
        })
    }

    const formatTime = (date: Date) => {
        return new Date(date).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
        })
    }

    const getCategoryLabel = (category: string) => {
        const categoryData = EVENT_CATEGORIES.find(cat => cat.value === category)
        return categoryData?.label || category
    }

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'LIVE_MUSIC':
                return <Music className="w-4 h-4" />
            case 'STANDUP_COMEDY':
                return <span className="text-lg">🎭</span>
            case 'CLASSICAL_MUSIC':
                return <span className="text-lg">🎼</span>
            case 'THEATRE':
                return <span className="text-lg">🎪</span>
            case 'ART_GALLERY':
                return <span className="text-lg">🎨</span>
            case 'LITERATURE':
                return <span className="text-lg">📚</span>
            case 'RESTAURANT_EVENT':
                return <span className="text-lg">🍽️</span>
            default:
                return <Music className="w-4 h-4" />
        }
    }

    return (
        <div className="card hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
            {/* Event Image Placeholder */}
            <div className="h-48 bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                <div className="text-center">
                    {getCategoryIcon(event.category)}
                    <p className="text-sm text-gray-600 mt-2">{getCategoryLabel(event.category)}</p>
                </div>
            </div>

            <div className="p-6">
                {/* Event Title */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    <Link to={`/events/${event.id}`}>
                        {event.title}
                    </Link>
                </h3>

                {/* Event Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {event.description}
                </p>

                {/* Event Details */}
                <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{formatDate(event.startTime)}</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
                    </div>

                    {event.venue && (
                        <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span>{event.venue.name}</span>
                        </div>
                    )}

                    {event.price && (
                        <div className="flex items-center text-sm text-gray-500">
                            <DollarSign className="w-4 h-4 mr-2" />
                            <span>${event.price}</span>
                        </div>
                    )}
                </div>

                {/* Category Badge */}
                <div className="mb-4">
                    <span className="badge-primary">
                        {getCategoryLabel(event.category)}
                    </span>
                </div>

                {/* Actions */}
                {showActions && (
                    <div className="flex space-x-2 pt-4 border-t border-gray-200">
                        <button
                            onClick={() => onEdit?.(event)}
                            className="btn-outline btn-sm flex-1"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => onDelete?.(event.id)}
                            className="btn-ghost btn-sm text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                            Delete
                        </button>
                    </div>
                )}

                {/* View Details Link */}
                {!showActions && (
                    <Link
                        to={`/events/${event.id}`}
                        className="btn-primary btn-sm w-full justify-center"
                    >
                        View Details
                    </Link>
                )}
            </div>
        </div>
    )
}

export default EventCard 