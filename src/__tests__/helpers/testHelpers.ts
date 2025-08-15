import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Dados de teste mock
export const mockUser = {
  id: 'user-123',
  name: 'João Silva',
  email: 'joao@test.com',
  password: 'hashedpassword',
  createdAt: new Date(),
};

export const mockPet = {
  id: 'pet-123',
  name: 'Rex',
  species: 'Cão',
  breed: 'Labrador',
  age: 3,
  userId: 'user-123',
  createdAt: new Date(),
};

export const mockAppointment = {
  id: 'appointment-123',
  date: new Date('2025-12-20T14:00:00Z'),
  reason: 'Consulta de rotina',
  status: 'PENDING' as const,
  petId: 'pet-123',
  userId: 'user-123',
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Gerar token JWT para testes
export const generateTestToken = (userId: string = 'user-123'): string => {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET!, {
    expiresIn: '1h'
  });
};

// Hash de senha para testes
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

// Limpar mocks
export const clearAllMocks = () => {
  jest.clearAllMocks();
};

// Mock de request com usuário autenticado
export const mockAuthenticatedUser = {
  user: mockUser
};

// Datas de teste (todas futuras)
export const testDates = {
  future: new Date(Date.now() + 24 * 60 * 60 * 1000), // Amanhã
  past: new Date(Date.now() - 24 * 60 * 60 * 1000),   // Ontem
  businessHour: new Date('2025-12-20T14:00:00Z'),     // Sexta 14h (futuro)
  outsideBusinessHour: new Date('2025-12-20T20:00:00Z'), // Sexta 20h (futuro)
  sunday: new Date('2025-12-21T14:00:00Z'),           // Domingo (futuro)
};

// Status de resposta HTTP
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
}; 