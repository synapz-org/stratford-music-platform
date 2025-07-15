import express from 'express';
import { body, query, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireRole, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get all events with filtering
router.get('/', [
    query('category').optional().isIn(['LIVE_MUSIC', 'STANDUP_COMEDY', 'CLASSICAL_MUSIC', 'THEATRE', 'ART_GALLERY', 'LITERATURE', 'RESTAURANT_EVENT']),
    query('status').optional().isIn(['DRAFT', 'PUBLISHED', 'CANCELLED']),
    query('date').optional().isISO8601(),
    query('venueId').optional().isString(),
    query('search').optional().isString(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
], async (req: any, res: any) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: errors.array(),
            });
        }

        const {
            category,
            status = 'PUBLISHED',
            date,
            venueId,
            search,
            page = 1,
            limit = 20,
        } = req.query;

        const skip = (page - 1) * limit;

        // Build where clause
        const where: any = { status };

        if (category) where.category = category;
        if (venueId) where.venueId = venueId;
        if (date) {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);
            where.startTime = {
                gte: startOfDay,
                lte: endOfDay,
            };
        }
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { venue: { name: { contains: search, mode: 'insensitive' } } },
            ];
        }

        const [events, total] = await Promise.all([
            prisma.event.findMany({
                where,
                include: {
                    venue: {
                        select: {
                            id: true,
                            name: true,
                            address: true,
                            phone: true,
                            website: true,
                        },
                    },
                },
                orderBy: { startTime: 'asc' },
                skip,
                take: parseInt(limit),
            }),
            prisma.event.count({ where }),
        ]);

        res.json({
            success: true,
            data: {
                events,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit),
                },
            },
        });
    } catch (error) {
        console.error('Get events error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get events',
        });
    }
});

// Get today's events
router.get('/today', async (req: any, res: any) => {
    try {
        const today = new Date();
        const startOfDay = new Date(today);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);

        const events = await prisma.event.findMany({
            where: {
                status: 'PUBLISHED',
                startTime: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
            },
            include: {
                venue: {
                    select: {
                        id: true,
                        name: true,
                        address: true,
                        phone: true,
                        website: true,
                    },
                },
            },
            orderBy: { startTime: 'asc' },
        });

        res.json({
            success: true,
            data: { events },
        });
    } catch (error) {
        console.error('Get today events error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get today\'s events',
        });
    }
});

// Get single event
router.get('/:id', async (req: any, res: any) => {
    try {
        const { id } = req.params;

        const event = await prisma.event.findUnique({
            where: { id },
            include: {
                venue: {
                    select: {
                        id: true,
                        name: true,
                        address: true,
                        phone: true,
                        website: true,
                        description: true,
                        capacity: true,
                        amenities: true,
                    },
                },
            },
        });

        if (!event) {
            return res.status(404).json({
                success: false,
                error: 'Event not found',
            });
        }

        res.json({
            success: true,
            data: { event },
        });
    } catch (error) {
        console.error('Get event error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get event',
        });
    }
});

// Create event (venue owners only)
router.post('/', authenticateToken, requireRole(['VENUE', 'ADMIN']), [
    body('title').trim().isLength({ min: 1, max: 200 }),
    body('description').trim().isLength({ min: 1 }),
    body('startTime').isISO8601(),
    body('endTime').isISO8601(),
    body('price').optional().isFloat({ min: 0 }),
    body('category').isIn(['LIVE_MUSIC', 'STANDUP_COMEDY', 'CLASSICAL_MUSIC', 'THEATRE', 'ART_GALLERY', 'LITERATURE', 'RESTAURANT_EVENT']),
    body('venueId').isString(),
], async (req: AuthRequest, res: any) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: errors.array(),
            });
        }

        const { title, description, startTime, endTime, price, category, venueId } = req.body;

        // Verify venue ownership (unless admin)
        if (req.user!.role !== 'ADMIN') {
            const venue = await prisma.venue.findFirst({
                where: {
                    id: venueId,
                    userId: req.user!.userId,
                },
            });

            if (!venue) {
                return res.status(403).json({
                    success: false,
                    error: 'You can only create events for your own venue',
                });
            }
        }

        const event = await prisma.event.create({
            data: {
                title,
                description,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                price: price ? parseFloat(price) : null,
                category,
                venueId,
            },
            include: {
                venue: {
                    select: {
                        id: true,
                        name: true,
                        address: true,
                    },
                },
            },
        });

        res.status(201).json({
            success: true,
            data: { event },
        });
    } catch (error) {
        console.error('Create event error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create event',
        });
    }
});

// Update event
router.put('/:id', authenticateToken, requireRole(['VENUE', 'ADMIN']), [
    body('title').optional().trim().isLength({ min: 1, max: 200 }),
    body('description').optional().trim().isLength({ min: 1 }),
    body('startTime').optional().isISO8601(),
    body('endTime').optional().isISO8601(),
    body('price').optional().isFloat({ min: 0 }),
    body('category').optional().isIn(['LIVE_MUSIC', 'STANDUP_COMEDY', 'CLASSICAL_MUSIC', 'THEATRE', 'ART_GALLERY', 'LITERATURE', 'RESTAURANT_EVENT']),
    body('status').optional().isIn(['DRAFT', 'PUBLISHED', 'CANCELLED']),
], async (req: AuthRequest, res: any) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: errors.array(),
            });
        }

        const { id } = req.params;
        const updateData = req.body;

        // Verify event ownership (unless admin)
        if (req.user!.role !== 'ADMIN') {
            const event = await prisma.event.findFirst({
                where: {
                    id,
                    venue: {
                        userId: req.user!.userId,
                    },
                },
            });

            if (!event) {
                return res.status(403).json({
                    success: false,
                    error: 'You can only update events for your own venue',
                });
            }
        }

        const event = await prisma.event.update({
            where: { id },
            data: updateData,
            include: {
                venue: {
                    select: {
                        id: true,
                        name: true,
                        address: true,
                    },
                },
            },
        });

        res.json({
            success: true,
            data: { event },
        });
    } catch (error) {
        console.error('Update event error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update event',
        });
    }
});

// Delete event
router.delete('/:id', authenticateToken, requireRole(['VENUE', 'ADMIN']), async (req: AuthRequest, res: any) => {
    try {
        const { id } = req.params;

        // Verify event ownership (unless admin)
        if (req.user!.role !== 'ADMIN') {
            const event = await prisma.event.findFirst({
                where: {
                    id,
                    venue: {
                        userId: req.user!.userId,
                    },
                },
            });

            if (!event) {
                return res.status(403).json({
                    success: false,
                    error: 'You can only delete events for your own venue',
                });
            }
        }

        await prisma.event.delete({
            where: { id },
        });

        res.json({
            success: true,
            message: 'Event deleted successfully',
        });
    } catch (error) {
        console.error('Delete event error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete event',
        });
    }
});

export default router; 