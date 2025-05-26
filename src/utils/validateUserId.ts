import { AuthRequest } from '../middlewares/authMiddleware';

export function getUserIdOrThrow(req: AuthRequest): number {
    if (!req.userId) {
        throw new Error('User ID missing after authentication');
    }
    return req.userId;
}
