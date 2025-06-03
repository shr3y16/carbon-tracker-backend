import redisClient from '../../src/config/redis';
import * as db from '../../src/db/activity';
import { prisma } from '../../src/db/prismaClient';
import { Prisma } from '@prisma/client';
import {
    addActivityService,
    deleteActivityService,
    getActivitiesByUserIdService,
    getActivityByIdAndUserIdService,
    getSummaryService,
    updateActivityService,
} from '../../src/services/activityService';
import { SortBy } from '../../src/enums';

jest.mock('../../src/db/prismaClient', () => ({
    prisma: {
        activity: {
            create: jest.fn(),
            delete: jest.fn(),
            findMany: jest.fn(),
            count: jest.fn(),
        },
    },
}));

jest.mock('../../src/config/redis', () => ({
    del: jest.fn(),
    get: jest.fn(),
    setEx: jest.fn(),
}));

jest.mock('../../src/db/activity', () => ({
    deleteActivityByIdAndUserId: jest.fn(),
    fetchActivityById: jest.fn(),
    updateActivityByIdAndUserId: jest.fn(),
    getSummaryByUserId: jest.fn(),
    getActivitiesByUserIdService: jest.fn(),
}));

describe('addActivityService', () => {
    const mockActivityInput = {
        category: 'Transportation',
        description: 'Car ride',
        emission: 50,
        activityDate: new Date('2025-06-03'),
        userId: 1,
    };

    beforeEach(() => {
        jest.clearAllMocks(); // Clears all mock calls, instances, and results
    });

    it('should create a new activity and clear the cache', async () => {
        const mockCreatedActivity = {
            id: 1,
            ...mockActivityInput,
        };

        (prisma.activity.create as jest.Mock).mockResolvedValue(mockCreatedActivity);

        const result = await addActivityService(mockActivityInput);

        expect(prisma.activity.create).toHaveBeenCalledWith({
            data: {
                category: mockActivityInput.category,
                description: mockActivityInput.description,
                emission: mockActivityInput.emission,
                date: mockActivityInput.activityDate,
                user: { connect: { id: mockActivityInput.userId } },
            },
        });

        expect(redisClient.del).toHaveBeenCalledWith(`summary:${mockActivityInput.userId}`);
        expect(result).toEqual(mockCreatedActivity);
    });

    it('should throw an error if activity creation fails', async () => {
        (prisma.activity.create as jest.Mock).mockRejectedValue(new Error('DB Error'));

        await expect(addActivityService(mockActivityInput)).rejects.toThrow('DB Error');
        expect(redisClient.del).not.toHaveBeenCalled();
    });
});

describe('deleteActivityService', () => {
    const mockActivity = {
        id: 1,
        category: 'Travel',
        description: 'Flight to NYC',
        emission: 100,
        date: new Date(),
        userId: 1,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should delete the activity and clear the cache', async () => {
        (db.deleteActivityByIdAndUserId as jest.Mock).mockResolvedValue(mockActivity);

        const result = await deleteActivityService(1, 1);

        expect(db.deleteActivityByIdAndUserId).toHaveBeenCalledWith(1, 1);
        expect(redisClient.del).toHaveBeenCalledWith('summary:1');
        expect(result).toEqual(mockActivity);
    });

    it('should throw an error if activity not found', async () => {
        (db.deleteActivityByIdAndUserId as jest.Mock).mockRejectedValue(
            new Error('Activity with ID 1 not found'),
        );

        await expect(deleteActivityService(1, 1)).rejects.toThrow('Activity with ID 1 not found');
        expect(redisClient.del).not.toHaveBeenCalled();
    });

    it('should throw an error if something else fails', async () => {
        (db.deleteActivityByIdAndUserId as jest.Mock).mockRejectedValue(
            new Error('Unexpected DB error'),
        );

        await expect(deleteActivityService(1, 1)).rejects.toThrow('Unexpected DB error');
        expect(redisClient.del).not.toHaveBeenCalled();
    });
});

describe('getActivityByIdAndUserIdService', () => {
    const mockActivity = {
        id: 1,
        category: 'Travel',
        description: 'Flight to NYC',
        emission: 100,
        date: new Date('2025-06-03'),
        userId: 1,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch an activity by ID and user ID', async () => {
        (db.fetchActivityById as jest.Mock).mockResolvedValue(mockActivity);

        const result = await getActivityByIdAndUserIdService(1, 1);

        expect(db.fetchActivityById).toHaveBeenCalledWith(1, 1);
        expect(result).toEqual(mockActivity);
    });

    it('should throw an error if the activity is not found', async () => {
        (db.fetchActivityById as jest.Mock).mockRejectedValue(
            new Error('Activity with ID 1 not found'),
        );

        await expect(getActivityByIdAndUserIdService(1, 1)).rejects.toThrow(
            'Activity with ID 1 not found',
        );
        expect(db.fetchActivityById).toHaveBeenCalledWith(1, 1);
    });

    it('should throw an error if there is a database issue', async () => {
        (db.fetchActivityById as jest.Mock).mockRejectedValue(
            new Error('Unexpected database error'),
        );

        await expect(getActivityByIdAndUserIdService(1, 1)).rejects.toThrow(
            'Unexpected database error',
        );
        expect(db.fetchActivityById).toHaveBeenCalledWith(1, 1);
    });
});

describe('updateActivityService', () => {
    const mockActivityInput = {
        id: 1,
        userId: 1,
        category: 'Transportation',
        description: 'Updated car ride',
        emission: 60,
        activityDate: new Date('2025-06-04'),
    };

    const mockUpdatedActivity = {
        id: 1,
        category: 'Transportation',
        description: 'Updated car ride',
        emission: 60,
        date: new Date('2025-06-04'),
        userId: 1,
    };

    beforeEach(() => {
        jest.clearAllMocks(); // Clears all mock calls, instances, and results
    });

    it('should update an activity and clear the cache', async () => {
        (db.updateActivityByIdAndUserId as jest.Mock).mockResolvedValue(mockUpdatedActivity);

        const result = await updateActivityService(mockActivityInput);

        expect(db.updateActivityByIdAndUserId).toHaveBeenCalledWith(mockActivityInput);
        expect(redisClient.del).toHaveBeenCalledWith(`summary:${mockActivityInput.userId}`);
        expect(result).toEqual(mockUpdatedActivity);
    });

    it('should throw an error if the activity is not found', async () => {
        (db.updateActivityByIdAndUserId as jest.Mock).mockRejectedValue(
            new Error('Activity with ID 1 not found'),
        );

        await expect(updateActivityService(mockActivityInput)).rejects.toThrow(
            'Activity with ID 1 not found',
        );
        expect(redisClient.del).not.toHaveBeenCalled();
    });

    it('should throw an error if there is a database issue', async () => {
        (db.updateActivityByIdAndUserId as jest.Mock).mockRejectedValue(
            new Error('Unexpected database error'),
        );

        await expect(updateActivityService(mockActivityInput)).rejects.toThrow(
            'Unexpected database error',
        );
        expect(redisClient.del).not.toHaveBeenCalled();
    });
});

describe('getSummaryService', () => {
    const mockUserId = 1;
    const mockSummary = {
        totalEmission: 200,
        emissionByCategory: {
            Transportation: 150,
            Food: 50,
        },
    };

    beforeEach(() => {
        jest.clearAllMocks(); // Clears all mock calls, instances, and results
    });

    it('should return cached summary if available', async () => {
        (redisClient.get as jest.Mock).mockResolvedValue(JSON.stringify(mockSummary));

        const result = await getSummaryService(mockUserId);

        expect(redisClient.get).toHaveBeenCalledWith(`summary:${mockUserId}`);
        expect(result).toEqual(mockSummary);
        expect(db.getSummaryByUserId).not.toHaveBeenCalled();
    });

    it('should fetch summary from the database if not cached', async () => {
        (redisClient.get as jest.Mock).mockResolvedValue(null);
        (db.getSummaryByUserId as jest.Mock).mockResolvedValue(mockSummary);

        const result = await getSummaryService(mockUserId);

        expect(redisClient.get).toHaveBeenCalledWith(`summary:${mockUserId}`);
        expect(db.getSummaryByUserId).toHaveBeenCalledWith(mockUserId);
        expect(redisClient.setEx).toHaveBeenCalledWith(
            `summary:${mockUserId}`,
            3600,
            JSON.stringify(mockSummary),
        );
        expect(result).toEqual(mockSummary);
    });

    it('should throw an error if fetching summary from the database fails', async () => {
        (redisClient.get as jest.Mock).mockResolvedValue(null);
        (db.getSummaryByUserId as jest.Mock).mockRejectedValue(new Error('Database query failed'));

        await expect(getSummaryService(mockUserId)).rejects.toThrow('Database query failed');
        expect(redisClient.get).toHaveBeenCalledWith(`summary:${mockUserId}`);
        expect(db.getSummaryByUserId).toHaveBeenCalledWith(mockUserId);
        expect(redisClient.setEx).not.toHaveBeenCalled();
    });

    it('should throw an error if Redis fails', async () => {
        (redisClient.get as jest.Mock).mockRejectedValue(new Error('Redis error'));

        await expect(getSummaryService(mockUserId)).rejects.toThrow('Redis error');
        expect(redisClient.get).toHaveBeenCalledWith(`summary:${mockUserId}`);
        expect(db.getSummaryByUserId).not.toHaveBeenCalled();
    });
});

describe('getActivitiesByUserIdService', () => {
    const mockUserId = 1;
    const mockActivities = [
        {
            id: 1,
            category: 'Transportation',
            description: 'Car ride',
            emission: 50,
            date: new Date('2025-06-03'),
            userId: mockUserId,
        },
        {
            id: 2,
            category: 'Food',
            description: 'Lunch',
            emission: 20,
            date: new Date('2025-06-02'),
            userId: mockUserId,
        },
    ];

    const mockPagination = {
        total: 2,
        page: 1,
        limit: 10,
        pages: 1,
    };

    beforeEach(() => {
        jest.clearAllMocks(); // Clears all mock calls, instances, and results
    });

    it('should fetch activities with pagination', async () => {
        (prisma.activity.findMany as jest.Mock).mockResolvedValue(mockActivities);
        (prisma.activity.count as jest.Mock).mockResolvedValue(mockPagination.total);

        const result = await getActivitiesByUserIdService({
            userId: mockUserId,
            search: '',
            page: 1,
            limit: 10,
            sortBy: SortBy.DATE,
            sortOrder: 'desc',
        });

        expect(prisma.activity.findMany).toHaveBeenCalledWith({
            where: {
                userId: mockUserId,
                OR: [
                    { category: { contains: '', mode: Prisma.QueryMode.insensitive } },
                    { description: { contains: '', mode: Prisma.QueryMode.insensitive } },
                ],
            },
            skip: 0,
            take: 10,
            orderBy: { date: 'desc' },
        });

        expect(prisma.activity.count).toHaveBeenCalledWith({
            where: {
                userId: mockUserId,
                OR: [
                    { category: { contains: '', mode: Prisma.QueryMode.insensitive } },
                    { description: { contains: '', mode: Prisma.QueryMode.insensitive } },
                ],
            },
        });

        expect(result).toEqual({
            data: mockActivities,
            pagination: mockPagination,
        });
    });

    it('should handle empty search results', async () => {
        (prisma.activity.findMany as jest.Mock).mockResolvedValue([]);
        (prisma.activity.count as jest.Mock).mockResolvedValue(0);

        const result = await getActivitiesByUserIdService({
            userId: mockUserId,
            search: 'nonexistent',
            page: 1,
            limit: 10,
            sortBy: SortBy.DATE,
            sortOrder: 'desc',
        });

        expect(prisma.activity.findMany).toHaveBeenCalledWith({
            where: {
                userId: mockUserId,
                OR: [
                    { category: { contains: 'nonexistent', mode: Prisma.QueryMode.insensitive } },
                    {
                        description: {
                            contains: 'nonexistent',
                            mode: Prisma.QueryMode.insensitive,
                        },
                    },
                ],
            },
            skip: 0,
            take: 10,
            orderBy: { date: 'desc' },
        });

        expect(prisma.activity.count).toHaveBeenCalledWith({
            where: {
                userId: mockUserId,
                OR: [
                    { category: { contains: 'nonexistent', mode: Prisma.QueryMode.insensitive } },
                    {
                        description: {
                            contains: 'nonexistent',
                            mode: Prisma.QueryMode.insensitive,
                        },
                    },
                ],
            },
        });

        expect(result).toEqual({
            data: [],
            pagination: {
                total: 0,
                page: 1,
                limit: 10,
                pages: 0,
            },
        });
    });

    it('should throw an error if the database query fails', async () => {
        (prisma.activity.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));

        await expect(
            getActivitiesByUserIdService({
                userId: mockUserId,
                search: '',
                page: 1,
                limit: 10,
                sortBy: SortBy.DATE,
                sortOrder: 'desc',
            }),
        ).rejects.toThrow('Database query failed');

        expect(prisma.activity.findMany).toHaveBeenCalled();
        expect(prisma.activity.count).not.toHaveBeenCalled();
    });
});
