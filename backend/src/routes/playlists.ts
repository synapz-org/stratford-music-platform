import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get all playlists
router.get('/', async (req: any, res: any) => {
    try {
        const playlists = await prisma.playlist.findMany({
            include: {
                curator: {
                    select: { id: true, name: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        res.json({
            success: true,
            data: { playlists },
        });
    } catch (error) {
        console.error('Get playlists error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get playlists',
        });
    }
});

// Get single playlist
router.get('/:id', async (req: any, res: any) => {
    try {
        const { id } = req.params;

        const playlist = await prisma.playlist.findUnique({
            where: { id },
            include: {
                curator: {
                    select: { id: true, name: true },
                },
            },
        });

        if (!playlist) {
            return res.status(404).json({
                success: false,
                error: 'Playlist not found',
            });
        }

        res.json({
            success: true,
            data: { playlist },
        });
    } catch (error) {
        console.error('Get playlist error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get playlist',
        });
    }
});

export default router; 