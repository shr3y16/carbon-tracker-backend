import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../utils/jwt';
export interface AuthRequest extends Request {
    userId?: number;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ error: 'Access token required' });
        return;
    }

    try {
        const payload = verifyToken(token) as { userId: number };
        req.userId = payload.userId;
        next();
    } catch {
        res.status(403).json({ error: 'Invalid or expired token' });
        return;
    }
};
