import { Router } from 'express';
import { registerUser, loginUser, getUserProfile, sendVerificationCode, verifyCode  } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { 
    generateTwoFactorSecret, 
    verifyAndEnableTwoFactor, 
    disableTwoFactor ,
    getRecoveryCodes,
} from '../controllers/twoFactorController.js';
const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.post('/send-verification', protect, sendVerificationCode);
router.post('/verify-code', protect, verifyCode);
router.post('/2fa/generate', protect, generateTwoFactorSecret);
router.post('/2fa/verify', protect, verifyAndEnableTwoFactor);
router.post('/2fa/disable', protect, disableTwoFactor);
router.get('/2fa/recovery-codes', protect, getRecoveryCodes);
export default router;