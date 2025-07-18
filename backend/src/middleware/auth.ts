import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AuthRequest extends Request {
    user?: {
        userId: string;
        email: string;
        role: string;
    };
}

export const authenticateToken = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'Access token required'
            });
        }

        const decoded = jwt.verify(token, process.env['JWT_SECRET']!) as {
            userId: string;
            email: string;
            role: string;
        };

        // Verify user still exists in database
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, email: true, role: true }
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'User no longer exists'
            });
        }

        req.user = {
            userId: user.id,
            email: user.email,
            role: user.role
        };
        next();
    } catch (error) {
        return res.status(403).json({
            success: false,
            error: 'Invalid token'
        });
    }
    // Add explicit return to satisfy TypeScript
    return;
};

export const requireRole = (roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: 'Insufficient permissions'
            });
        }

        next();
        return;
    };
};

export const requireVenueOwnership = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required'
            });
        }

        const venue = await prisma.venue.findUnique({
            where: { userId: req.user.userId }
        });

        if (!venue) {
            return res.status(403).json({
                success: false,
                error: 'Venue access required'
            });
        }

        (req as any).venue = venue;
        next();
        return;
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
}; 