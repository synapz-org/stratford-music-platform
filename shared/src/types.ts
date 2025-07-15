// User and Authentication Types
export interface User {
    id: string;
    email: string;
    name?: string;
    role: UserRole;
    bio?: string;
    phone?: string;
    address?: string;
    createdAt: Date;
    updatedAt: Date;
}

export type UserRole = 'ADMIN' | 'VENUE' | 'ARTIST' | 'READER';

export interface AuthResponse {
    user: User;
    token: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    name?: string;
    role?: UserRole;
}

// Venue Types
export interface Venue {
    id: string;
    userId: string;
    name: string;
    address: string;
    phone?: string;
    website?: string;
    description?: string;
    capacity?: number;
    amenities: string[];
    createdAt: Date;
    user?: User;
    _count?: {
        events: number;
    };
}

export interface CreateVenueRequest {
    name: string;
    address: string;
    phone?: string;
    website?: string;
    description?: string;
    capacity?: number;
    amenities?: string[];
}

// Event Types
export interface Event {
    id: string;
    venueId: string;
    title: string;
    description: string;
    startTime: Date;
    endTime: Date;
    price?: number;
    category: EventCategory;
    status: EventStatus;
    createdAt: Date;
    venue?: Venue;
}

export type EventCategory =
    | 'LIVE_MUSIC'
    | 'STANDUP_COMEDY'
    | 'CLASSICAL_MUSIC'
    | 'THEATRE'
    | 'ART_GALLERY'
    | 'LITERATURE'
    | 'RESTAURANT_EVENT';

export type EventStatus = 'DRAFT' | 'PUBLISHED' | 'CANCELLED';

export interface CreateEventRequest {
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    price?: number;
    category: EventCategory;
    venueId: string;
}

export interface UpdateEventRequest {
    title?: string;
    description?: string;
    startTime?: string;
    endTime?: string;
    price?: number;
    category?: EventCategory;
    status?: EventStatus;
}

// Magazine Types
export interface MagazineIssue {
    id: string;
    title: string;
    monthYear: string;
    coverImage?: string;
    publishedAt?: Date;
    status: IssueStatus;
    createdAt: Date;
    articles?: Article[];
    _count?: {
        articles: number;
    };
}

export type IssueStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface Article {
    id: string;
    issueId: string;
    title: string;
    content: string;
    authorId: string;
    featuredImage?: string;
    publishedAt?: Date;
    status: ArticleStatus;
    createdAt: Date;
    author?: User;
}

export type ArticleStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

// Playlist Types
export interface Playlist {
    id: string;
    curatorId: string;
    title: string;
    description?: string;
    tracks: PlaylistTrack[];
    createdAt: Date;
    curator?: User;
}

export interface PlaylistTrack {
    title: string;
    artist: string;
    duration: string;
    url?: string;
}

// Advertisement Types
export interface Advertisement {
    id: string;
    advertiserId: string;
    issueId?: string;
    adType: AdType;
    content: string;
    paymentStatus: PaymentStatus;
    createdAt: Date;
    advertiser?: User;
}

export type AdType = 'BANNER' | 'SIDEBAR' | 'FEATURED' | 'CLASSIFIED';
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

// API Response Types
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    details?: any[];
    message?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

// Filter and Query Types
export interface EventFilters {
    category?: EventCategory;
    status?: EventStatus;
    date?: string;
    venueId?: string;
    search?: string;
    page?: number;
    limit?: number;
}

export interface VenueFilters {
    search?: string;
    page?: number;
    limit?: number;
}

// Form Types
export interface EventFormData {
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    price?: string;
    category: EventCategory;
    venueId: string;
}

export interface VenueFormData {
    name: string;
    address: string;
    phone?: string;
    website?: string;
    description?: string;
    capacity?: string;
    amenities: string[];
}

// UI Component Props
export interface EventCardProps {
    event: Event;
    onEdit?: (event: Event) => void;
    onDelete?: (eventId: string) => void;
    showActions?: boolean;
}

export interface VenueCardProps {
    venue: Venue;
    onEdit?: (venue: Venue) => void;
    onDelete?: (venueId: string) => void;
    showActions?: boolean;
}

// Utility Types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface ApiError {
    message: string;
    status: number;
    details?: any;
}

// Constants
export const EVENT_CATEGORIES: { value: EventCategory; label: string }[] = [
    { value: 'LIVE_MUSIC', label: 'Live Music' },
    { value: 'STANDUP_COMEDY', label: 'Stand-up Comedy' },
    { value: 'CLASSICAL_MUSIC', label: 'Classical Music' },
    { value: 'THEATRE', label: 'Theatre' },
    { value: 'ART_GALLERY', label: 'Art Gallery' },
    { value: 'LITERATURE', label: 'Literature' },
    { value: 'RESTAURANT_EVENT', label: 'Restaurant Event' },
];

export const USER_ROLES: { value: UserRole; label: string }[] = [
    { value: 'ADMIN', label: 'Administrator' },
    { value: 'VENUE', label: 'Venue Owner' },
    { value: 'ARTIST', label: 'Artist' },
    { value: 'READER', label: 'Reader' },
];

export const EVENT_STATUSES: { value: EventStatus; label: string }[] = [
    { value: 'DRAFT', label: 'Draft' },
    { value: 'PUBLISHED', label: 'Published' },
    { value: 'CANCELLED', label: 'Cancelled' },
]; 