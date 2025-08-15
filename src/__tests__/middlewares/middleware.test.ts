import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import { validateBody } from '../../middlewares/validation';
import { z } from 'zod';
import { clearAllMocks, mockUser, generateTestToken, HTTP_STATUS } from '../helpers/testHelpers';

// Mock do Prisma
jest.mock('../../prisma');

describe('Middlewares', () => {
  beforeEach(() => {
    clearAllMocks();
  });

  describe('Validation Middleware', () => {
    const testSchema = z.object({
      name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
      email: z.string().email('Email inválido'),
      age: z.number().min(0, 'Idade deve ser positiva').optional()
    });

    const app = express();
    app.use(express.json());
    
    app.post('/validate', validateBody(testSchema), (req, res) => {
      res.json({ message: 'Dados válidos', data: req.body });
    });

    it('deve aceitar dados válidos', async () => {
      const validData = {
        name: 'João Silva',
        email: 'joao@test.com',
        age: 30
      };

      const response = await request(app)
        .post('/validate')
        .send(validData);

      expect(response.status).toBe(HTTP_STATUS.OK);
      expect(response.body.message).toBe('Dados válidos');
      expect(response.body.data).toEqual(validData);
    });

    it('deve rejeitar dados inválidos', async () => {
      const invalidData = {
        name: 'J', // Muito curto
        email: 'email-invalido',
        age: -5 // Idade negativa
      };

      const response = await request(app)
        .post('/validate')
        .send(invalidData);

      expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
      expect(response.body.error).toBe('Dados de entrada inválidos');
      expect(response.body.details).toBeInstanceOf(Array);
      expect(response.body.details.length).toBeGreaterThan(0);
    });

    it('deve aceitar dados com campos opcionais ausentes', async () => {
      const dataWithoutOptional = {
        name: 'João Silva',
        email: 'joao@test.com'
        // age é opcional
      };

      const response = await request(app)
        .post('/validate')
        .send(dataWithoutOptional);

      expect(response.status).toBe(HTTP_STATUS.OK);
      expect(response.body.data).toEqual(dataWithoutOptional);
    });

    it('deve rejeitar dados com campos obrigatórios ausentes', async () => {
      const incompleteData = {
        name: 'João Silva'
        // email obrigatório ausente
      };

      const response = await request(app)
        .post('/validate')
        .send(incompleteData);

      expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
      expect(response.body.error).toBe('Dados de entrada inválidos');
      // Verificar se há pelo menos um erro de validação (simples)
      expect(response.body.details).toBeInstanceOf(Array);
      expect(response.body.details.length).toBeGreaterThan(0);
    });
  });

  describe('Error Handling Middleware', () => {
    const app = express();
    app.use(express.json());

    // Rota que gera erro para teste
    app.get('/error', (req, res, next) => {
      const error = new Error('Erro de teste');
      next(error);
    });

    // Rota que gera erro Prisma simulado
    app.get('/prisma-error', (req, res, next) => {
      const prismaError = new Error('Unique constraint failed');
      (prismaError as any).code = 'P2002';
      next(prismaError);
    });

    // Mock do error handler
    app.use((error: any, req: any, res: any, next: any) => {
      if (error.code === 'P2002') {
        return res.status(409).json({ error: 'Conflito de dados únicos' });
      }
      res.status(500).json({ error: 'Erro interno do servidor' });
    });

    it('deve tratar erros gerais', async () => {
      const response = await request(app)
        .get('/error');

      expect(response.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(response.body.error).toBe('Erro interno do servidor');
    });

    it('deve tratar erros específicos do Prisma', async () => {
      const response = await request(app)
        .get('/prisma-error');

      expect(response.status).toBe(HTTP_STATUS.CONFLICT);
      expect(response.body.error).toBe('Conflito de dados únicos');
    });
  });

  describe('JWT Token Generation', () => {
    it('deve gerar token válido', () => {
      const token = generateTestToken();
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');

      // Verificar se o token pode ser decodificado
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      expect(decoded.sub).toBe('user-123');
    });

    it('deve gerar token com userId específico', () => {
      const customUserId = 'custom-user-456';
      const token = generateTestToken(customUserId);
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      expect(decoded.sub).toBe(customUserId);
    });

    it('deve gerar token com expiração', () => {
      const token = generateTestToken();
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      
      expect(decoded.exp).toBeDefined();
      expect(decoded.exp > Math.floor(Date.now() / 1000)).toBe(true);
    });
  });

  describe('Test Helpers', () => {
    it('deve limpar mocks corretamente', () => {
      const mockFn = jest.fn();
      mockFn('test');
      expect(mockFn).toHaveBeenCalledWith('test');
      
      clearAllMocks();
      expect(mockFn).not.toHaveBeenCalled();
    });

    it('deve fornecer dados mock consistentes', () => {
      expect(mockUser).toHaveProperty('id');
      expect(mockUser).toHaveProperty('name');
      expect(mockUser).toHaveProperty('email');
      expect(mockUser.id).toBe('user-123');
    });

    it('deve fornecer constantes HTTP corretas', () => {
      expect(HTTP_STATUS.OK).toBe(200);
      expect(HTTP_STATUS.CREATED).toBe(201);
      expect(HTTP_STATUS.BAD_REQUEST).toBe(400);
      expect(HTTP_STATUS.UNAUTHORIZED).toBe(401);
      expect(HTTP_STATUS.NOT_FOUND).toBe(404);
      expect(HTTP_STATUS.CONFLICT).toBe(409);
      expect(HTTP_STATUS.INTERNAL_SERVER_ERROR).toBe(500);
    });
  });
}); 