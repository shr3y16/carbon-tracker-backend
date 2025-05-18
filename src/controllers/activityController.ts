import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import {
    addActivityService,
    deleteActivityService,
    getActivitiesByUserIdService,
    getActivityByIdAndUserIdService,
} from '../services/activityService';

export const addActivityController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;
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
        const userId = req.userId;
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
        const activities = await getActivitiesByUserIdService(userId);
        res.status(200).json(activities);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};

export const getActivitiesByIdController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;
        const id = parseInt(req.params.id);
        const activity = await getActivityByIdAndUserIdService(id, userId);
        res.status(200).json(activity);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};
