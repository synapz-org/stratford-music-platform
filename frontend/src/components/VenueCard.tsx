import React from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Phone, Globe, Users } from 'lucide-react'
import { Venue } from '@stratford-music/shared'

interface VenueCardProps {
    venue: Venue
    showActions?: boolean
    onEdit?: (venue: Venue) => void
    onDelete?: (venueId: string) => void
}

const VenueCard: React.FC<VenueCardProps> = ({
    venue,
    showActions = false,
    onEdit,
    onDelete
}) => {
    return (
        <div className="card hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
                {/* Venue Name */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    <Link to={`/venues/${venue.id}`} className="hover:text-primary-600 transition-colors">
                        {venue.name}
                    </Link>
                </h3>

                {/* Venue Description */}
                {venue.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {venue.description}
                    </p>
                )}

                {/* Venue Details */}
                <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{venue.address}</span>
                    </div>

                    {venue.phone && (
                        <div className="flex items-center text-sm text-gray-500">
                            <Phone className="w-4 h-4 mr-2" />
                            <span>{venue.phone}</span>
                        </div>
                    )}

                    {venue.website && (
                        <div className="flex items-center text-sm text-gray-500">
                            <Globe className="w-4 h-4 mr-2" />
                            <a
                                href={venue.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary-600 hover:text-primary-700"
                            >
                                Visit Website
                            </a>
                        </div>
                    )}

                    {venue.capacity && (
                        <div className="flex items-center text-sm text-gray-500">
                            <Users className="w-4 h-4 mr-2" />
                            <span>Capacity: {venue.capacity}</span>
                        </div>
                    )}
                </div>

                {/* Amenities */}
                {venue.amenities && venue.amenities.length > 0 && (
                    <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                            {venue.amenities.slice(0, 3).map((amenity, index) => (
                                <span key={index} className="badge-outline text-xs">
                                    {amenity}
                                </span>
                            ))}
                            {venue.amenities.length > 3 && (
                                <span className="badge-outline text-xs">
                                    +{venue.amenities.length - 3} more
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Actions */}
                {showActions && (
                    <div className="flex space-x-2 pt-4 border-t border-gray-200">
                        <button
                            onClick={() => onEdit?.(venue)}
                            className="btn-outline btn-sm flex-1"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => onDelete?.(venue.id)}
                            className="btn-ghost btn-sm text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                            Delete
                        </button>
                    </div>
                )}

                {/* View Details Link */}
                {!showActions && (
                    <Link
                        to={`/venues/${venue.id}`}
                        className="btn-primary btn-sm w-full justify-center"
                    >
                        View Details
                    </Link>
                )}
            </div>
        </div>
    )
}

export default VenueCard 