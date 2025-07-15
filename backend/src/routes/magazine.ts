import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireRole, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get all magazine issues
router.get('/issues', async (req: any, res: any) => {
    try {
        const issues = await prisma.magazineIssue.findMany({
            where: { status: 'PUBLISHED' },
            include: {
                _count: {
                    select: { articles: true },
                },
            },
            orderBy: { publishedAt: 'desc' },
        });

        res.json({
            success: true,
            data: { issues },
        });
    } catch (error) {
        console.error('Get magazine issues error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get magazine issues',
        });
    }
});

// Get single magazine issue
router.get('/issues/:id', async (req: any, res: any) => {
    try {
        const { id } = req.params;

        const issue = await prisma.magazineIssue.findUnique({
            where: { id },
            include: {
                articles: {
                    where: { status: 'PUBLISHED' },
                    include: {
                        author: {
                            select: { id: true, name: true },
                        },
                    },
                    orderBy: { publishedAt: 'asc' },
                },
            },
        });

        if (!issue) {
            return res.status(404).json({
                success: false,
                error: 'Magazine issue not found',
            });
        }

        res.json({
            success: true,
            data: { issue },
        });
    } catch (error) {
        console.error('Get magazine issue error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get magazine issue',
        });
    }
});

export default router; 