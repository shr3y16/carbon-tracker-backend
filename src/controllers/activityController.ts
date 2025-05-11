import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { createActivity, removeActivityById } from '../services/activityService';

export const addActivity = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;
        const { category, description, emission, date } = req.body;
        const activityDate = new Date(date);
        const activity = await createActivity({
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

export const deleteActivityById = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;
        const id = parseInt(req.params.id);
        const deletedActivity = await removeActivityById(id, userId);
        res.status(201).json(deletedActivity);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};
