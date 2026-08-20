import { Router } from 'express';
import {
    createProperty,
    getUniqueCities, // L'import dyalha
    getAllProperties,
    getPropertyById,
    updateProperty,
    deleteProperty,
    addFeatureToProperty,
    removeFeatureFromProperty,
    uploadPropertyMedia,
    deletePropertyMedia,
    setPrimaryMedia
} from '../controllers/propertiesController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = Router();

// === PUBLIC ROUTES ===
// L'ORDRE (TERTIB) MOHIM BZAF HNA

// 1. L routes l khassa l lewwla
router.get('/cities', getUniqueCities);

// 2. 3ad men be3dha l routes l 3amma
router.get('/', getAllProperties);
router.get('/:id', getPropertyById);


// === PROTECTED ROUTES ===

router.post('/', protect, createProperty);
router.put('/:id', protect, updateProperty);
router.delete('/:id', protect, deleteProperty);

router.post('/:propertyId/features/:featureId', protect, addFeatureToProperty);
router.delete('/:propertyId/features/:featureId', protect, removeFeatureFromProperty);

// --- MEDIA ROUTES ---
router.post('/:propertyId/media', protect, upload.array('media', 10), uploadPropertyMedia);
router.delete('/media/:mediaId', protect, deletePropertyMedia);
router.put('/media/:mediaId/set-primary', protect, setPrimaryMedia);

export default router;