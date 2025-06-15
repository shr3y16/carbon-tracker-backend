import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import {
    addActivityService,
    deleteActivityService,
    getActivitiesByUserIdService,
    getActivityByIdAndUserIdService,
    getSummaryService,
    updateActivityService,
} from '../services/activityService';
import { SortBy, SortOrder } from '../enums';
import { getUserIdOrThrow } from '../utils/validateUserId';

export const addActivityController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = getUserIdOrThrow(req);
        const { category, description, emission, date } = req.body;
        const activityDate = new Date(date);
        const activity = await addActivityService({
            category,
            description,
            emission,
            activityDate,
            userId,
        });
        res.status(201).json(activity);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};

export const deleteActivityController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = getUserIdOrThrow(req);
        const id = parseInt(req.params.id);
        const deletedActivity = await deleteActivityService(id, userId);
        res.status(201).json(deletedActivity);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};

export const getActivitiesByUserIdController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(500).json({ error: 'User ID missing after authentication' });
            return;
        }
        const {
            search = '',
            page = 1,
            limit = 10,
            sortBy = SortBy.DATE,
            sortOrder = SortOrder.DESC,
        } = req.query;
        const activities = await getActivitiesByUserIdService({
            userId,
            search: String(search),
            page: Number(page),
            limit: Number(limit),
            sortBy: sortBy as SortBy,
            sortOrder: sortOrder as SortOrder,
        });
        res.status(200).json(activities);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};

export const getActivitiesByIdController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = getUserIdOrThrow(req);
        const id = parseInt(req.params.id);
        const activity = await getActivityByIdAndUserIdService(id, userId);
        res.status(200).json(activity);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};

export const updateActivityController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = getUserIdOrThrow(req);
        const id = parseInt(req.params.id);
        const { category, description, emission, date } = req.body;
        let activityDate: Date | undefined;
        if (date) {
            activityDate = new Date(date);
        }
        const updatedActivity = await updateActivityService({
            category,
            description,
            emission,
            activityDate,
            userId,
            id,
        });
        res.status(200).json(updatedActivity);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};

export const getSummaryController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = getUserIdOrThrow(req);
        const summary = await getSummaryService(userId);
        res.status(200).json(summary);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};
