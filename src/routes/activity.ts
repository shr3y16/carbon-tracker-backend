import express from 'express';
import { authenticateToken } from '../middlewares/authMiddleware';
import {
    addActivityController,
    deleteActivityController,
    getActivitiesByIdController,
    getActivitiesByUserIdController,
    updateActivityController,
} from '../controllers/activityController';
import { validateCreateActivity } from '../middlewares/validators/activityValidators';
import { handleValidation } from '../middlewares/validate';

const router = express.Router();

router.get('/all', authenticateToken, getActivitiesByUserIdController);
router.get('/:id', authenticateToken, getActivitiesByIdController);
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
