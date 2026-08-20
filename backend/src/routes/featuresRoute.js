import { Router } from 'express';

import {
    createFeature,
    getAllFeatures,
    getFeatureById,
    updateFeature,
    deleteFeature
} from '../controllers/featuresController.js';

// Jib l'middlewares dyal sécurité
import { protect, admin } from '../middleware/authMiddleware.js';

const router = Router();

// Route '/' => L'iḍafa (POST) o bach tjib kolshi (GET)
router.route('/')
    .get(getAllFeatures) // Ay wehd y9der ychof l'features
    .post(protect, admin, createFeature); // Ghi l'admin li yzid

// Route '/:id' => Bach tjib, tbedel, wla tmsseh feature wehda b l'ID
router.route('/:id')
    .get(getFeatureById) // Ay wehd y9der ychof
    .put(protect, admin, updateFeature) // Ghi l'admin li ybedel
    .delete(protect, admin, deleteFeature); // Ghi l'admin li ymsseh

export default router;