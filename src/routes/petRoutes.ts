import { Router } from 'express';
import { createPet, getAllPets, getPetById } from '../controllers/petController';
import { authenticate } from '../middlewares/authMiddleware';
import { createLimiter } from '../middlewares/rateLimiter';
import { validateBody, validateParams } from '../middlewares/validation';
import { petCreateSchema, uuidParamSchema } from '../schemas/validationSchemas';

const router = Router();

router.post('/pets', authenticate, createLimiter, validateBody(petCreateSchema), createPet);
router.get('/pets', authenticate, getAllPets);
router.get('/pets/:id', authenticate, validateParams(uuidParamSchema), getPetById);

export default router;
