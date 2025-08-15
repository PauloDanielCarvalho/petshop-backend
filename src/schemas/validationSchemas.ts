import { z } from 'zod';

// 👤 USER SCHEMAS
export const userRegistrationSchema = z.object({
  name: z.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .trim(),
  email: z.string()
    .email('Email deve ter um formato válido')
    .toLowerCase()
    .trim(),
  password: z.string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .max(100, 'Senha deve ter no máximo 100 caracteres')
});

export const userLoginSchema = z.object({
  email: z.string()
    .email('Email deve ter um formato válido')
    .toLowerCase()
    .trim(),
  password: z.string()
    .min(1, 'Senha é obrigatória')
});

// 🐕 PET SCHEMAS
export const petCreateSchema = z.object({
  name: z.string()
    .min(1, 'Nome do pet é obrigatório')
    .max(50, 'Nome deve ter no máximo 50 caracteres')
    .trim(),
  species: z.string()
    .min(1, 'Espécie é obrigatória')
    .max(30, 'Espécie deve ter no máximo 30 caracteres')
    .trim(),
  breed: z.string()
    .max(50, 'Raça deve ter no máximo 50 caracteres')
    .trim()
    .optional(),
  age: z.number()
    .int('Idade deve ser um número inteiro')
    .min(0, 'Idade deve ser maior ou igual a 0')
    .max(30, 'Idade deve ser menor ou igual a 30')
    .optional()
});

export const petUpdateSchema = petCreateSchema.partial();

// 📅 APPOINTMENT SCHEMAS
export const appointmentCreateSchema = z.object({
  date: z.string()
    .refine((date) => {
      const appointmentDate = new Date(date);
      const now = new Date();
      return appointmentDate > now;
    }, 'Data do agendamento deve ser no futuro'),
  reason: z.string()
    .min(5, 'Motivo deve ter pelo menos 5 caracteres')
    .max(200, 'Motivo deve ter no máximo 200 caracteres')
    .trim(),
  petId: z.string()
    .uuid('Pet ID deve ser um UUID válido')
});

export const appointmentUpdateSchema = z.object({
  date: z.string()
    .refine((date) => {
      const appointmentDate = new Date(date);
      const now = new Date();
      return appointmentDate > now;
    }, 'Data do agendamento deve ser no futuro')
    .optional(),
  reason: z.string()
    .min(5, 'Motivo deve ter pelo menos 5 caracteres')
    .max(200, 'Motivo deve ter no máximo 200 caracteres')
    .trim()
    .optional(),
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'])
    .optional()
});

// 🔍 QUERY SCHEMAS
export const appointmentQuerySchema = z.object({
  date: z.string().optional(),
  petId: z.string().uuid('Pet ID deve ser um UUID válido').optional(),
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']).optional()
});

// 📄 PAGINATION SCHEMA
export const paginationSchema = z.object({
  page: z.string()
    .transform((val) => parseInt(val))
    .refine((val) => val > 0, 'Página deve ser maior que 0')
    .optional()
    .default('1'),
  limit: z.string()
    .transform((val) => parseInt(val))
    .refine((val) => val > 0 && val <= 100, 'Limite deve ser entre 1 e 100')
    .optional()
    .default('10')
});

// 🆔 PARAM SCHEMAS
export const uuidParamSchema = z.object({
  id: z.string().uuid('ID deve ser um UUID válido')
}); 