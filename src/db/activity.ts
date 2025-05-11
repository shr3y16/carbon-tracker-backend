import { prisma } from '../db/prismaClient';

export const getActivityById = async (id: number) => {
    try {
        const activity = await prisma.activity.findUnique({
            where: { id },
        });

        if (!activity) {
            throw new Error(`Activity with ID ${id} not found`);
        }

        return activity;
    } catch (error: any) {
        throw new Error(`${error.message}`);
    }
};
