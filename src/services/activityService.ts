import { prisma } from '../db/prismaClient';
import { ActivityInput } from '../types';
import { getActivityById } from '../db/activity';

export const createActivity = async ({
    category,
    description,
    emission,
    activityDate,
    userId,
}: ActivityInput) => {
    return prisma.activity.create({
        data: {
            category,
            description,
            emission,
            date: activityDate,
            user: { connect: { id: userId } },
        },
    });
};

export const removeActivityById = async (id: number, userId: number | undefined) => {
    try {
        const activity = await getActivityById(id);

        if (activity.userId !== userId) {
            throw new Error('You are not authorized to delete this activity');
        }

        return prisma.activity.delete({
            where: { id },
        });
    } catch (error: any) {
        throw new Error(`${error.message}`);
    }
};
