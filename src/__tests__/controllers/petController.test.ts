import request from 'supertest';
import express from 'express';
import { createPet, getAllPets, getPetById } from '../../controllers/petController';
import prisma from '../../prisma';
import { clearAllMocks, mockUser, mockPet, HTTP_STATUS } from '../helpers/testHelpers';

// Mock do Prisma
jest.mock('../../prisma');
const mockPrisma = prisma as any;

// Configurar app de teste
const app = express();
app.use(express.json());

// Mock de middleware de autenticação
const mockAuth = (req: any, res: any, next: any) => {
  req.user = mockUser;
  next();
};

app.post('/pets', mockAuth, createPet);
app.get('/pets', mockAuth, getAllPets);
app.get('/pets/:id', mockAuth, getPetById);

describe('PetController', () => {
  beforeEach(() => {
    clearAllMocks();
  });

  describe('POST /pets', () => {
    const validPetData = {
      name: 'Rex',
      species: 'Cão',
      breed: 'Labrador',
      age: 3
    };

    it('deve criar um pet com sucesso', async () => {
      mockPrisma.pet.create.mockResolvedValue({
        ...mockPet,
        ...validPetData,
        userId: mockUser.id
      });

      const response = await request(app)
        .post('/pets')
        .send(validPetData);

      expect(response.status).toBe(HTTP_STATUS.CREATED);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(validPetData.name);
      expect(response.body.userId).toBe(mockUser.id);
    });

    it('deve criar pet mesmo sem validação de entrada', async () => {
      // O controller atual não tem validação obrigatória
      mockPrisma.pet.create.mockResolvedValue({
        ...mockPet,
        name: undefined,
        species: undefined,
        breed: undefined,
        age: undefined,
        userId: mockUser.id
      });

      const response = await request(app)
        .post('/pets')
        .send({});

      expect(response.status).toBe(HTTP_STATUS.CREATED);
    });

    it('deve tratar erro do banco de dados', async () => {
      mockPrisma.pet.create.mockRejectedValue(new Error('Erro no banco'));

      const response = await request(app)
        .post('/pets')
        .send(validPetData);

      expect(response.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
    });
  });

  describe('GET /pets', () => {
    it('deve listar pets do usuário', async () => {
      const pets = [{
        ...mockPet,
        createdAt: mockPet.createdAt.toISOString() // Serializar para string
      }];
      mockPrisma.pet.findMany.mockResolvedValue(pets);

      const response = await request(app)
        .get('/pets');

      expect(response.status).toBe(HTTP_STATUS.OK);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].id).toBe(mockPet.id);
      expect(response.body[0].name).toBe(mockPet.name);
    });

    it('deve retornar lista vazia se usuário não tem pets', async () => {
      mockPrisma.pet.findMany.mockResolvedValue([]);

      const response = await request(app)
        .get('/pets');

      expect(response.status).toBe(HTTP_STATUS.OK);
      expect(response.body).toHaveLength(0);
    });

    it('deve tratar erro do banco de dados', async () => {
      mockPrisma.pet.findMany.mockRejectedValue(new Error('Erro no banco'));

      const response = await request(app)
        .get('/pets');

      expect(response.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
    });
  });

  describe('GET /pets/:id', () => {
    it('deve retornar pet específico', async () => {
      const petWithStringDate = {
        ...mockPet,
        createdAt: mockPet.createdAt.toISOString()
      };
      mockPrisma.pet.findFirst.mockResolvedValue(petWithStringDate);

      const response = await request(app)
        .get(`/pets/${mockPet.id}`);

      expect(response.status).toBe(HTTP_STATUS.OK);
      expect(response.body.id).toBe(mockPet.id);
      expect(response.body.name).toBe(mockPet.name);
    });

    it('deve retornar erro se pet não existe', async () => {
      mockPrisma.pet.findFirst.mockResolvedValue(null);

      const response = await request(app)
        .get(`/pets/${mockPet.id}`);

      expect(response.status).toBe(HTTP_STATUS.NOT_FOUND);
      expect(response.body.error).toBe('Pet not found');
    });

    it('deve tratar erro do banco de dados', async () => {
      mockPrisma.pet.findFirst.mockRejectedValue(new Error('Erro no banco'));

      const response = await request(app)
        .get(`/pets/${mockPet.id}`);

      expect(response.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
    });
  });

  describe('Validações de Segurança', () => {
    it('deve permitir acesso apenas aos pets do próprio usuário', async () => {
      mockPrisma.pet.findMany.mockResolvedValue([]);

      await request(app)
        .get('/pets');

      expect(mockPrisma.pet.findMany).toHaveBeenCalledWith({
        where: { userId: mockUser.id }
      });
    });

    it('deve filtrar pet por usuário na busca individual', async () => {
      mockPrisma.pet.findFirst.mockResolvedValue(null);

      await request(app)
        .get(`/pets/${mockPet.id}`);

      expect(mockPrisma.pet.findFirst).toHaveBeenCalledWith({
        where: {
          id: mockPet.id,
          userId: mockUser.id
        }
      });
    });
  });
}); 