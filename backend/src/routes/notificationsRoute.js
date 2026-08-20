import { Router } from 'express';
import { getUserActivities, markActivityAsRead } from '../controllers/activitiesController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', protect, getUserActivities);
router.put('/:activityId/read', protect, markActivityAsRead);

export default router;