import { Request, Response } from 'express';
import prisma from '../prisma';
import { asyncHandler } from '../middlewares/errorHandler';

// Função para validar horário comercial
const isBusinessHour = (date: Date): boolean => {
  const hour = date.getHours();
  const day = date.getDay(); // 0 = domingo, 6 = sábado
  
  // Segunda a sexta: 8h às 18h, Sábado: 8h às 12h
  if (day >= 1 && day <= 5) {
    return hour >= 8 && hour < 18;
  } else if (day === 6) {
    return hour >= 8 && hour < 12;
  }
  return false; // Domingo fechado
};

// Função para verificar disponibilidade
const isTimeSlotAvailable = async (date: Date, excludeId?: string) => {
  const where: any = {
    date,
    status: {
      in: ['PENDING', 'CONFIRMED']
    }
  };
  
  if (excludeId) {
    where.id = { not: excludeId };
  }
  
  const existing = await prisma.appointment.findFirst({ where });
  return !existing;
};

export const createAppointment = asyncHandler(async (req: Request, res: Response): Promise<any> => {
  const userId = (req as any).user.id;
  const { date, reason, petId } = req.body;
  
  const appointmentDate = new Date(date);
  const now = new Date();

  // Validações de negócio
  if (appointmentDate <= now) {
    return res.status(400).json({
      error: 'Data do agendamento deve ser no futuro',
      code: 'INVALID_DATE'
    });
  }

  if (!isBusinessHour(appointmentDate)) {
    return res.status(400).json({
      error: 'Agendamento fora do horário comercial (Seg-Sex: 8h-18h, Sáb: 8h-12h)',
      code: 'OUTSIDE_BUSINESS_HOURS'
    });
  }

  // Verificar se o pet pertence ao usuário
  const pet = await prisma.pet.findFirst({
    where: { id: petId, userId }
  });

  if (!pet) {
    return res.status(404).json({
      error: 'Pet não encontrado ou não pertence ao usuário',
      code: 'PET_NOT_FOUND'
    });
  }

  // Verificar disponibilidade do horário
  const isAvailable = await isTimeSlotAvailable(appointmentDate);
  if (!isAvailable) {
    return res.status(409).json({
      error: 'Horário não disponível',
      code: 'TIME_SLOT_UNAVAILABLE'
    });
  }

  const appointment = await prisma.appointment.create({
    data: {
      date: appointmentDate,
      reason,
      status: 'PENDING',
      petId,
      userId
    },
    include: {
      pet: {
        select: { id: true, name: true, species: true }
      }
    }
  });

  res.status(201).json({
    message: 'Agendamento criado com sucesso',
    appointment
  });
});

export const getAppointments = asyncHandler(async (req: Request, res: Response): Promise<any> => {
  const userId = (req as any).user.id;
  const { date, petId, status, page = '1', limit = '10' } = req.query;

  const filters: any = { userId };

  // Filtros opcionais
  if (date) {
    const parsedDate = new Date(date as string);
    filters.date = {
      gte: new Date(parsedDate.setHours(0, 0, 0, 0)),
      lte: new Date(parsedDate.setHours(23, 59, 59, 999))
    };
  }

  if (petId) filters.petId = petId;
  if (status) filters.status = status;

  // Paginação
  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const skip = (pageNum - 1) * limitNum;

  const [appointments, total] = await Promise.all([
    prisma.appointment.findMany({
      where: filters,
      include: { 
        pet: {
          select: { id: true, name: true, species: true }
        }
      },
      orderBy: { date: 'asc' },
      skip,
      take: limitNum
    }),
    prisma.appointment.count({ where: filters })
  ]);

  res.json({
    appointments,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum)
    }
  });
});

export const updateAppointment = asyncHandler(async (req: Request, res: Response): Promise<any> => {
  const userId = (req as any).user.id;
  const { id } = req.params;
  const { date, reason, status } = req.body;

  // Verificar se o agendamento pertence ao usuário
  const existingAppointment = await prisma.appointment.findFirst({
    where: { id, userId }
  });

  if (!existingAppointment) {
    return res.status(404).json({
      error: 'Agendamento não encontrado',
      code: 'APPOINTMENT_NOT_FOUND'
    });
  }

  const updateData: any = {};

  // Validar nova data se fornecida
  if (date) {
    const appointmentDate = new Date(date);
    const now = new Date();

    if (appointmentDate <= now) {
      return res.status(400).json({
        error: 'Data do agendamento deve ser no futuro',
        code: 'INVALID_DATE'
      });
    }

    if (!isBusinessHour(appointmentDate)) {
      return res.status(400).json({
        error: 'Agendamento fora do horário comercial',
        code: 'OUTSIDE_BUSINESS_HOURS'
      });
    }

    // Verificar disponibilidade (excluindo o próprio agendamento)
    const isAvailable = await isTimeSlotAvailable(appointmentDate, id);
    if (!isAvailable) {
      return res.status(409).json({
        error: 'Horário não disponível',
        code: 'TIME_SLOT_UNAVAILABLE'
      });
    }

    updateData.date = appointmentDate;
  }

  if (reason) updateData.reason = reason;
  if (status) updateData.status = status;

  const updatedAppointment = await prisma.appointment.update({
    where: { id },
    data: updateData,
    include: {
      pet: {
        select: { id: true, name: true, species: true }
      }
    }
  });

  res.json({
    message: 'Agendamento atualizado com sucesso',
    appointment: updatedAppointment
  });
});

export const deleteAppointment = asyncHandler(async (req: Request, res: Response): Promise<any> => {
  const userId = (req as any).user.id;
  const { id } = req.params;

  // Verificar se o agendamento pertence ao usuário
  const existingAppointment = await prisma.appointment.findFirst({
    where: { id, userId }
  });

  if (!existingAppointment) {
    return res.status(404).json({
      error: 'Agendamento não encontrado',
      code: 'APPOINTMENT_NOT_FOUND'
    });
  }

  // Não permitir deletar agendamentos já confirmados ou em andamento
  if (existingAppointment.status === 'CONFIRMED') {
    return res.status(400).json({
      error: 'Não é possível deletar agendamentos confirmados. Cancele primeiro.',
      code: 'CANNOT_DELETE_CONFIRMED'
    });
  }

  await prisma.appointment.delete({
    where: { id }
  });

  res.json({
    message: 'Agendamento deletado com sucesso'
  });
});

export const getAvailableSlots = asyncHandler(async (req: Request, res: Response): Promise<any> => {
  const { date } = req.query;
  
  if (!date) {
    return res.status(400).json({
      error: 'Data é obrigatória',
      code: 'DATE_REQUIRED'
    });
  }

  const targetDate = new Date(date as string);
  const slots = [];
  
  // Gerar slots de 1 em 1 hora
  for (let hour = 8; hour < 18; hour++) {
    const slotDate = new Date(targetDate);
    slotDate.setHours(hour, 0, 0, 0);
    
    if (isBusinessHour(slotDate)) {
      const isAvailable = await isTimeSlotAvailable(slotDate);
      slots.push({
        time: slotDate.toISOString(),
        available: isAvailable
      });
    }
  }

  res.json({ date: targetDate.toDateString(), slots });
});
