import { Router } from 'express';
import { registerUser, login, logout, me } from '../controllers/authController';
import { authenticate } from '../middlewares/authMiddleware';
import { authLimiter } from '../middlewares/rateLimiter';
import { validateBody } from '../middlewares/validation';
import { userRegistrationSchema, userLoginSchema } from '../schemas/validationSchemas';

const router = Router();

router.post('/register', validateBody(userRegistrationSchema), registerUser);
router.post('/login', authLimiter, validateBody(userLoginSchema), login);
router.post('/logout', logout);
router.get('/me', authenticate, me);

export default router;
