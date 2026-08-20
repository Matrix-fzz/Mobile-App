import { Router } from 'express';
import {
    getUserActivities,
    markActivityAsRead,
    markAllActivitiesAsRead,
    deleteActivity
} from '../controllers/activitiesController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

// Route bach tjib kol notifications dyal l'user
router.get('/', protect, getUserActivities);

// Route bach t'marké kolshi bhal "read"
router.put('/mark-all-as-read', protect, markAllActivitiesAsRead);

// Route bach t'marké notification wehda bhal "read"
router.put('/:id/read', protect, markActivityAsRead);

// Route bach tmsseh notification wehda
router.delete('/:id', protect, deleteActivity);

export default router;