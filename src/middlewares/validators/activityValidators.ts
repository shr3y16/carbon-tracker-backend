import { body, param, query } from 'express-validator';
import { SortBy, SortOrder } from '../../enums';

export const validateCreateActivity = [
    body('category')
        .isString()
        .withMessage('Category must be a string')
        .notEmpty()
        .withMessage('Category cannot be empty'),
    body('description').optional().isString(),
    body('emission').isFloat({ gt: 0 }).withMessage('Emission must be a number > 0'),
    body('date').isISO8601().withMessage('Date must be in ISO 8601 format'),
];

export const validateActivityIdParam = [
    param('id').isInt().withMessage('Activity ID must be an integer'),
];

export const validateGetActivitiesByUserId = [
    query('search').optional().isString().withMessage('Search term must be a string'),
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be an integer greater than or equal to 1'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be an integer between 1 and 100'),
    query('sortBy')
        .optional()
        .isIn(Object.values(SortBy))
        .withMessage(`sortBy must be one of: ${Object.values(SortBy).join(', ')}`),
    query('sortOrder')
        .optional()
        .isIn(Object.values(SortOrder))
        .withMessage(`sortOrder must be one of: ${Object.values(SortOrder).join(', ')}`),
];
