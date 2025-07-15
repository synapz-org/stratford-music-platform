import express from 'express';
import { body, query, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireRole, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get all venues
router.get('/', [
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

        const { search, page = 1, limit = 20 } = req.query;
        const skip = (page - 1) * limit;

        const where: any = {};
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { address: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [venues, total] = await Promise.all([
            prisma.venue.findMany({
                where,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                    _count: {
                        select: {
                            events: true,
                        },
                    },
                },
                orderBy: { name: 'asc' },
                skip,
                take: parseInt(limit),
            }),
            prisma.venue.count({ where }),
        ]);

        res.json({
            success: true,
            data: {
                venues,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit),
                },
            },
        });
    } catch (error) {
        console.error('Get venues error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get venues',
        });
    }
});

// Get single venue
router.get('/:id', async (req: any, res: any) => {
    try {
        const { id } = req.params;

        const venue = await prisma.venue.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                    },
                },
                events: {
                    where: { status: 'PUBLISHED' },
                    orderBy: { startTime: 'asc' },
                    take: 10,
                },
            },
        });

        if (!venue) {
            return res.status(404).json({
                success: false,
                error: 'Venue not found',
            });
        }

        res.json({
            success: true,
            data: { venue },
        });
    } catch (error) {
        console.error('Get venue error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get venue',
        });
    }
});

// Create venue (authenticated users)
router.post('/', authenticateToken, [
    body('name').trim().isLength({ min: 1, max: 200 }),
    body('address').trim().isLength({ min: 1 }),
    body('phone').optional().trim(),
    body('website').optional().isURL(),
    body('description').optional().trim(),
    body('capacity').optional().isInt({ min: 1 }),
    body('amenities').optional().isArray(),
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

        // Check if user already has a venue
        const existingVenue = await prisma.venue.findUnique({
            where: { userId: req.user!.userId },
        });

        if (existingVenue) {
            return res.status(400).json({
                success: false,
                error: 'User can only have one venue',
            });
        }

        const { name, address, phone, website, description, capacity, amenities } = req.body;

        const venue = await prisma.venue.create({
            data: {
                name,
                address,
                phone,
                website,
                description,
                capacity: capacity ? parseInt(capacity) : null,
                amenities: amenities || [],
                userId: req.user!.userId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        res.status(201).json({
            success: true,
            data: { venue },
        });
    } catch (error) {
        console.error('Create venue error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create venue',
        });
    }
});

// Update venue
router.put('/:id', authenticateToken, [
    body('name').optional().trim().isLength({ min: 1, max: 200 }),
    body('address').optional().trim().isLength({ min: 1 }),
    body('phone').optional().trim(),
    body('website').optional().isURL(),
    body('description').optional().trim(),
    body('capacity').optional().isInt({ min: 1 }),
    body('amenities').optional().isArray(),
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

        // Verify venue ownership
        const venue = await prisma.venue.findFirst({
            where: {
                id,
                userId: req.user!.userId,
            },
        });

        if (!venue) {
            return res.status(403).json({
                success: false,
                error: 'You can only update your own venue',
            });
        }

        const updatedVenue = await prisma.venue.update({
            where: { id },
            data: updateData,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        res.json({
            success: true,
            data: { venue: updatedVenue },
        });
    } catch (error) {
        console.error('Update venue error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update venue',
        });
    }
});

// Delete venue
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: any) => {
    try {
        const { id } = req.params;

        // Verify venue ownership
        const venue = await prisma.venue.findFirst({
            where: {
                id,
                userId: req.user!.userId,
            },
        });

        if (!venue) {
            return res.status(403).json({
                success: false,
                error: 'You can only delete your own venue',
            });
        }

        await prisma.venue.delete({
            where: { id },
        });

        res.json({
            success: true,
            message: 'Venue deleted successfully',
        });
    } catch (error) {
        console.error('Delete venue error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete venue',
        });
    }
});

export default router; 