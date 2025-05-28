import request from 'supertest';
import express from 'express';
import { 
  createAppointment, 
  getAppointments, 
  updateAppointment, 
  deleteAppointment,
  getAvailableSlots 
} from '../../controllers/appointmentController';
import prisma from '../../prisma';
import { clearAllMocks, mockUser, mockPet, mockAppointment, testDates, HTTP_STATUS } from '../helpers/testHelpers';

// Mock do Prisma
jest.mock('../../prisma');
const mockPrisma = prisma as any;

// Configurar app de teste - SEM middlewares de validação para teste direto dos controllers
const app = express();
app.use(express.json());

// Mock de middleware de autenticação
const mockAuth = (req: any, res: any, next: any) => {
  req.user = mockUser;
  next();
};

app.post('/appointments', mockAuth, createAppointment);
app.get('/appointments', mockAuth, getAppointments);
app.put('/appointments/:id', mockAuth, updateAppointment);
app.delete('/appointments/:id', mockAuth, deleteAppointment);
app.get('/appointments/available-slots', mockAuth, getAvailableSlots);

describe('AppointmentController', () => {
  beforeEach(() => {
    clearAllMocks();
  });

  describe('POST /appointments', () => {
    const validAppointmentData = {
      date: testDates.businessHour.toISOString(),
      reason: 'Consulta de rotina',
      petId: mockPet.id
    };

    it('deve criar agendamento com sucesso', async () => {
      mockPrisma.pet.findFirst.mockResolvedValue(mockPet);
      mockPrisma.appointment.findFirst.mockResolvedValue(null); // Horário disponível
      mockPrisma.appointment.create.mockResolvedValue({
        ...mockAppointment,
        pet: {
          id: mockPet.id,
          name: mockPet.name,
          species: mockPet.species
        }
      });

      const response = await request(app)
        .post('/appointments')
        .send(validAppointmentData);

      expect(response.status).toBe(HTTP_STATUS.CREATED);
      expect(response.body.message).toBe('Agendamento criado com sucesso');
      expect(response.body.appointment).toHaveProperty('id');
      expect(response.body.appointment.pet).toEqual(expect.objectContaining({
        id: mockPet.id,
        name: mockPet.name
      }));
    });

    it('deve rejeitar agendamento no passado', async () => {
      const pastAppointmentData = {
        ...validAppointmentData,
        date: testDates.past.toISOString()
      };

      const response = await request(app)
        .post('/appointments')
        .send(pastAppointmentData);

      expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
      expect(response.body.error).toBe('Data do agendamento deve ser no futuro');
      expect(response.body.code).toBe('INVALID_DATE');
    });

    it('deve rejeitar agendamento fora do horário comercial', async () => {
      const outsideBusinessHourData = {
        ...validAppointmentData,
        date: testDates.outsideBusinessHour.toISOString()
      };

      const response = await request(app)
        .post('/appointments')
        .send(outsideBusinessHourData);

      expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
      expect(response.body.error).toBe('Agendamento fora do horário comercial (Seg-Sex: 8h-18h, Sáb: 8h-12h)');
      expect(response.body.code).toBe('OUTSIDE_BUSINESS_HOURS');
    });

    it('deve rejeitar agendamento aos domingos', async () => {
      const sundayAppointmentData = {
        ...validAppointmentData,
        date: testDates.sunday.toISOString()
      };

      const response = await request(app)
        .post('/appointments')
        .send(sundayAppointmentData);

      expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
      expect(response.body.error).toBe('Agendamento fora do horário comercial (Seg-Sex: 8h-18h, Sáb: 8h-12h)');
      expect(response.body.code).toBe('OUTSIDE_BUSINESS_HOURS');
    });

    it('deve rejeitar se pet não pertence ao usuário', async () => {
      mockPrisma.pet.findFirst.mockResolvedValue(null);

      const response = await request(app)
        .post('/appointments')
        .send(validAppointmentData);

      expect(response.status).toBe(HTTP_STATUS.NOT_FOUND);
      expect(response.body.error).toBe('Pet não encontrado ou não pertence ao usuário');
      expect(response.body.code).toBe('PET_NOT_FOUND');
    });

    it('deve rejeitar se horário não está disponível', async () => {
      mockPrisma.pet.findFirst.mockResolvedValue(mockPet);
      mockPrisma.appointment.findFirst.mockResolvedValue(mockAppointment); // Horário ocupado

      const response = await request(app)
        .post('/appointments')
        .send(validAppointmentData);

      expect(response.status).toBe(HTTP_STATUS.CONFLICT);
      expect(response.body.error).toBe('Horário não disponível');
      expect(response.body.code).toBe('TIME_SLOT_UNAVAILABLE');
    });
  });

  describe('GET /appointments', () => {
    it('deve listar agendamentos com paginação', async () => {
      const appointments = [mockAppointment];
      mockPrisma.appointment.findMany.mockResolvedValue(appointments);
      mockPrisma.appointment.count.mockResolvedValue(1);

      const response = await request(app)
        .get('/appointments')
        .query({ page: 1, limit: 10 });

      expect(response.status).toBe(HTTP_STATUS.OK);
      expect(response.body.appointments).toHaveLength(1);
      expect(response.body.pagination).toEqual({
        page: 1,
        limit: 10,
        total: 1,
        pages: 1
      });
    });

    it('deve filtrar agendamentos por data', async () => {
      mockPrisma.appointment.findMany.mockResolvedValue([]);
      mockPrisma.appointment.count.mockResolvedValue(0);

      const response = await request(app)
        .get('/appointments')
        .query({ date: '2025-12-20' });

      expect(response.status).toBe(HTTP_STATUS.OK);
      expect(mockPrisma.appointment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            userId: mockUser.id,
            date: expect.objectContaining({
              gte: expect.any(Date),
              lte: expect.any(Date)
            })
          })
        })
      );
    });

    it('deve filtrar agendamentos por pet', async () => {
      mockPrisma.appointment.findMany.mockResolvedValue([]);
      mockPrisma.appointment.count.mockResolvedValue(0);

      const response = await request(app)
        .get('/appointments')
        .query({ petId: mockPet.id });

      expect(response.status).toBe(HTTP_STATUS.OK);
      expect(mockPrisma.appointment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            userId: mockUser.id,
            petId: mockPet.id
          })
        })
      );
    });

    it('deve filtrar agendamentos por status', async () => {
      mockPrisma.appointment.findMany.mockResolvedValue([]);
      mockPrisma.appointment.count.mockResolvedValue(0);

      const response = await request(app)
        .get('/appointments')
        .query({ status: 'PENDING' });

      expect(response.status).toBe(HTTP_STATUS.OK);
      expect(mockPrisma.appointment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            userId: mockUser.id,
            status: 'PENDING'
          })
        })
      );
    });
  });

  describe('PUT /appointments/:id', () => {
    const updateData = {
      date: testDates.businessHour.toISOString(),
      reason: 'Consulta urgente',
      status: 'CONFIRMED'
    };

    it('deve atualizar agendamento com sucesso', async () => {
      mockPrisma.appointment.findFirst.mockResolvedValueOnce(mockAppointment); // Appointment exists
      mockPrisma.appointment.findFirst.mockResolvedValueOnce(null); // Time slot available
      mockPrisma.appointment.update.mockResolvedValue({
        ...mockAppointment,
        ...updateData,
        pet: {
          id: mockPet.id,
          name: mockPet.name,
          species: mockPet.species
        }
      });

      const response = await request(app)
        .put(`/appointments/${mockAppointment.id}`)
        .send(updateData);

      expect(response.status).toBe(HTTP_STATUS.OK);
      expect(response.body.message).toBe('Agendamento atualizado com sucesso');
      expect(response.body.appointment.reason).toBe(updateData.reason);
      expect(response.body.appointment.status).toBe(updateData.status);
    });

    it('deve rejeitar se agendamento não existe', async () => {
      mockPrisma.appointment.findFirst.mockResolvedValue(null);

      const response = await request(app)
        .put(`/appointments/${mockAppointment.id}`)
        .send(updateData);

      expect(response.status).toBe(HTTP_STATUS.NOT_FOUND);
      expect(response.body.error).toBe('Agendamento não encontrado');
      expect(response.body.code).toBe('APPOINTMENT_NOT_FOUND');
    });

    it('deve rejeitar nova data no passado', async () => {
      mockPrisma.appointment.findFirst.mockResolvedValue(mockAppointment);

      const pastUpdateData = {
        ...updateData,
        date: testDates.past.toISOString()
      };

      const response = await request(app)
        .put(`/appointments/${mockAppointment.id}`)
        .send(pastUpdateData);

      expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
      expect(response.body.error).toBe('Data do agendamento deve ser no futuro');
      expect(response.body.code).toBe('INVALID_DATE');
    });

    it('deve rejeitar se nova data não está disponível', async () => {
      mockPrisma.appointment.findFirst.mockResolvedValueOnce(mockAppointment); // Appointment exists
      mockPrisma.appointment.findFirst.mockResolvedValueOnce(mockAppointment); // Time slot occupied

      const response = await request(app)
        .put(`/appointments/${mockAppointment.id}`)
        .send(updateData);

      expect(response.status).toBe(HTTP_STATUS.CONFLICT);
      expect(response.body.error).toBe('Horário não disponível');
      expect(response.body.code).toBe('TIME_SLOT_UNAVAILABLE');
    });
  });

  describe('DELETE /appointments/:id', () => {
    it('deve deletar agendamento com sucesso', async () => {
      mockPrisma.appointment.findFirst.mockResolvedValue({
        ...mockAppointment,
        status: 'PENDING'
      });
      mockPrisma.appointment.delete.mockResolvedValue(mockAppointment);

      const response = await request(app)
        .delete(`/appointments/${mockAppointment.id}`);

      expect(response.status).toBe(HTTP_STATUS.OK);
      expect(response.body.message).toBe('Agendamento deletado com sucesso');
    });

    it('deve rejeitar se agendamento não existe', async () => {
      mockPrisma.appointment.findFirst.mockResolvedValue(null);

      const response = await request(app)
        .delete(`/appointments/${mockAppointment.id}`);

      expect(response.status).toBe(HTTP_STATUS.NOT_FOUND);
      expect(response.body.error).toBe('Agendamento não encontrado');
      expect(response.body.code).toBe('APPOINTMENT_NOT_FOUND');
    });

    it('deve rejeitar deletar agendamento confirmado', async () => {
      mockPrisma.appointment.findFirst.mockResolvedValue({
        ...mockAppointment,
        status: 'CONFIRMED'
      });

      const response = await request(app)
        .delete(`/appointments/${mockAppointment.id}`);

      expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
      expect(response.body.error).toBe('Não é possível deletar agendamentos confirmados. Cancele primeiro.');
      expect(response.body.code).toBe('CANNOT_DELETE_CONFIRMED');
    });
  });

  describe('GET /appointments/available-slots', () => {
    it('deve retornar slots disponíveis para uma data', async () => {
      // Mock: apenas o slot das 10h está ocupado
      mockPrisma.appointment.findFirst
        .mockResolvedValueOnce(null)  // 8h - disponível
        .mockResolvedValueOnce(null)  // 9h - disponível
        .mockResolvedValueOnce(mockAppointment) // 10h - ocupado
        .mockResolvedValueOnce(null); // 11h - disponível

      const response = await request(app)
        .get('/appointments/available-slots')
        .query({ date: '2025-12-20' });

      expect(response.status).toBe(HTTP_STATUS.OK);
      expect(response.body.date).toBeDefined();
      expect(response.body.slots).toBeInstanceOf(Array);
      expect(response.body.slots.length).toBeGreaterThan(0);
      
      // Verificar estrutura dos slots
      response.body.slots.forEach((slot: any) => {
        expect(slot).toHaveProperty('time');
        expect(slot).toHaveProperty('available');
        expect(typeof slot.available).toBe('boolean');
      });
    });

    it('deve rejeitar se data não fornecida', async () => {
      const response = await request(app)
        .get('/appointments/available-slots');

      expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
      expect(response.body.error).toBe('Data é obrigatória');
      expect(response.body.code).toBe('DATE_REQUIRED');
    });
  });

  describe('Validações de Segurança', () => {
    it('deve permitir acesso apenas aos agendamentos do próprio usuário', async () => {
      mockPrisma.appointment.findMany.mockResolvedValue([]);
      mockPrisma.appointment.count.mockResolvedValue(0);

      await request(app)
        .get('/appointments');

      expect(mockPrisma.appointment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            userId: mockUser.id
          })
        })
      );
    });

    it('deve verificar propriedade do agendamento na atualização', async () => {
      mockPrisma.appointment.findFirst.mockResolvedValue(null);

      const response = await request(app)
        .put(`/appointments/${mockAppointment.id}`)
        .send({ reason: 'Tentativa de hack' });

      expect(response.status).toBe(HTTP_STATUS.NOT_FOUND);
      expect(mockPrisma.appointment.findFirst).toHaveBeenCalledWith({
        where: {
          id: mockAppointment.id,
          userId: mockUser.id
        }
      });
    });

    it('deve verificar propriedade do agendamento na exclusão', async () => {
      mockPrisma.appointment.findFirst.mockResolvedValue(null);

      const response = await request(app)
        .delete(`/appointments/${mockAppointment.id}`);

      expect(response.status).toBe(HTTP_STATUS.NOT_FOUND);
      expect(mockPrisma.appointment.findFirst).toHaveBeenCalledWith({
        where: {
          id: mockAppointment.id,
          userId: mockUser.id
        }
      });
    });
  });
}); 