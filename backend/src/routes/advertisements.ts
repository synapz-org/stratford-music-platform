import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get all advertisements
router.get('/', async (req: any, res: any) => {
    try {
        const advertisements = await prisma.advertisement.findMany({
            include: {
                advertiser: {
                    select: { id: true, name: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        res.json({
            success: true,
            data: { advertisements },
        });
    } catch (error) {
        console.error('Get advertisements error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get advertisements',
        });
    }
});

export default router; 