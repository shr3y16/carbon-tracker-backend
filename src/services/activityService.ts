import { prisma } from '../db/prismaClient';
import { ActivityInput, EditActivityInput } from '../types';
import { deleteActivityByIdAndUserId, fetchActivityById, updateActivityByIdAndUserId } from '../db/activity';

export const addActivityService = async ({
    category,
    description,
    emission,
    activityDate,
    userId,
}: ActivityInput) => {
    try {
        return prisma.activity.create({
            data: {
                category,
                description,
                emission,
                date: activityDate,
                user: { connect: { id: userId } },
            },
        });
    } catch (error: any) {
        throw new Error(`${error.message}`);
    }
};

export const deleteActivityService = async (id: number, userId?: number) => {
    try {
        return await deleteActivityByIdAndUserId(id, userId);
    } catch (error: any) {
        throw new Error(`${error.message}`);
    }
};

export const getActivitiesByUserIdService = async (userId?: number) => {
    try {
        return prisma.activity.findMany({
            where: { userId },
        });
    } catch (error: any) {
        throw new Error(`${error.message}`);
    }
};

export const getActivityByIdAndUserIdService = async (id: number, userId?: number) => {
    try {
        return await fetchActivityById(id, userId);
    } catch (error: any) {
        throw new Error(`${error.message}`);
    }
};

export const updateActivityService = async ({
    id,
    userId,
    category,
    emission,
    description,
    activityDate,
}: EditActivityInput) => {
    try {
        return await updateActivityByIdAndUserId({
            id,
            userId,
            category,
            emission,
            description,
            activityDate,
        });
    } catch (error: any) {
        throw new Error(`${error.message}`);
    }
};
