import express from 'express';
import { authenticateToken } from '../middlewares/authMiddleware';
import {
    addActivityController,
    deleteActivityController,
    getActivitiesByIdController,
    getActivitiesByUserIdController,
    getSummaryController,
    updateActivityController,
} from '../controllers/activityController';
import {
    validateActivityIdParam,
    validateCreateActivity,
    validateGetActivitiesByUserId,
} from '../middlewares/validators/activityValidators';
import { handleValidation } from '../middlewares/validate';

const router = express.Router();

router.get(
    '/all',
    authenticateToken,
    validateGetActivitiesByUserId,
    handleValidation,
    getActivitiesByUserIdController,
);
router.get('/summary', authenticateToken, getSummaryController);
router.get('/:id', authenticateToken, validateActivityIdParam, handleValidation, getActivitiesByIdController);
router.post(
    '/add',
    authenticateToken,
    validateCreateActivity,
    handleValidation,
    addActivityController,
);
router.delete('/remove/:id', authenticateToken, deleteActivityController);
router.patch('/update/:id', authenticateToken, updateActivityController);

export default router;
