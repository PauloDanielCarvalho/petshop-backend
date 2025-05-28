import { Router } from 'express';
import { 
  createAppointment, 
  getAppointments, 
  updateAppointment, 
  deleteAppointment,
  getAvailableSlots 
} from '../controllers/appointmentController';
import { authenticate } from '../middlewares/authMiddleware';
import { createLimiter } from '../middlewares/rateLimiter';
import { validateBody, validateQuery, validateParams } from '../middlewares/validation';
import { 
  appointmentCreateSchema, 
  appointmentQuerySchema, 
  appointmentUpdateSchema,
  uuidParamSchema,
  paginationSchema 
} from '../schemas/validationSchemas';

const router = Router();

// Criar agendamento
router.post('/', 
  authenticate, 
  createLimiter, 
  validateBody(appointmentCreateSchema), 
  createAppointment
);

// Listar agendamentos com filtros e paginação
router.get('/', 
  authenticate, 
  validateQuery(appointmentQuerySchema.merge(paginationSchema)), 
  getAppointments
);

// Buscar slots disponíveis
router.get('/available-slots', 
  authenticate, 
  getAvailableSlots
);

// Atualizar agendamento
router.put('/:id', 
  authenticate, 
  validateParams(uuidParamSchema),
  validateBody(appointmentUpdateSchema), 
  updateAppointment
);

// Deletar agendamento
router.delete('/:id', 
  authenticate, 
  validateParams(uuidParamSchema),
  deleteAppointment
);

export default router;
