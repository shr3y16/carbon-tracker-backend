import { prisma } from '../db/prismaClient';

export const fetchActivityById = async (id: number, userId?: number) => {
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

export const deleteActivityController = async (id: number, userId?: number) => {
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