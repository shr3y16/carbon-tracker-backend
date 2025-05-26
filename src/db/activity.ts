import { prisma } from '../db/prismaClient';
import { EditActivityInput } from '../types';

export const fetchActivityById = async (id: number, userId: number) => {
    try {
        const activity = await prisma.activity.findUnique({
            where: { id, userId },
        });

        if (!activity) {
            throw new Error(`Activity with ID ${id} not found`);
        }

        return activity;
    } catch (error: any) {
        throw new Error(`${error.message}`);
    }
};

export const deleteActivityByIdAndUserId = async (id: number, userId: number) => {
    try {
        const deletedActivity = await prisma.activity.delete({
            where: { id, userId },
        });

        if (!deletedActivity) {
            throw new Error(`Activity with ID ${id} not found`);
        }

        return deletedActivity;
    } catch (error: any) {
        throw new Error(`${error.message}`);
    }
};

export const updateActivityByIdAndUserId = async ({
    id,
    userId,
    category,
    emission,
    description,
    activityDate,
}: EditActivityInput) => {
    try {
        const activity = await prisma.activity.findUnique({
            where: { id, userId },
        });

        if (!activity) {
            throw new Error(`Activity with ID ${id} not found`);
        }

        return await prisma.activity.update({
            where: { id, userId },
            data: {
                category,
                emission,
                description,
                date: activityDate,
            },
        });
    } catch (error: any) {
        throw new Error(`${error.message}`);
    }
};
