import { prisma } from '../db/prismaClient';
import { Prisma } from '@prisma/client';
import { ActivityInput, EditActivityInput, GetActivitiesInput } from '../types';
import {
    deleteActivityByIdAndUserId,
    fetchActivityById,
    updateActivityByIdAndUserId,
} from '../db/activity';

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

export const getActivitiesByUserIdService = async ({
    userId,
    search = '',
    page = 1,
    limit = 10,
}: GetActivitiesInput) => {
    try {
        const skip = (page - 1) * limit;

        const where = {
            userId,
            OR: [
                { category: { contains: search, mode: Prisma.QueryMode.insensitive } },
                { description: { contains: search, mode: Prisma.QueryMode.insensitive } },
            ],
        };

        const [activities, total] = await Promise.all([
            prisma.activity.findMany({
                where,
                skip,
                take: limit,
                orderBy: { date: 'desc' },
            }),
            prisma.activity.count({ where }),
        ]);

        return {
            data: activities,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        };
    } catch (err) {
        console.error('Error in getActivitiesService:', err);
        throw new Error('Database query failed');
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
