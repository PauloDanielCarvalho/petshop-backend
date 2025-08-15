import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prisma';
import { config } from '../config';
import { asyncHandler } from '../middlewares/errorHandler';

// Cadastro de usuário
export const registerUser = asyncHandler(async (req: Request, res: Response): Promise<any> => {
  const { name, email, password } = req.body;

  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    return res.status(409).json({ 
      error: 'Usuário já existe com este email',
      code: 'USER_ALREADY_EXISTS'
    });
  }

  const hashedPassword = await bcrypt.hash(password, config.bcrypt.saltRounds);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  // Gera o token JWT
  const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET!, {
    expiresIn: '7d'
  });

  // Define o cookie de autenticação
  res.cookie('token', token, config.cookies);

  return res.status(201).json({ 
    message: 'Usuário criado e logado com sucesso', 
    user: { 
      id: user.id, 
      name: user.name, 
      email: user.email 
    } 
  });
});

// Login de usuário
export const login = asyncHandler(async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res.status(401).json({ 
      error: 'Credenciais inválidas',
      code: 'INVALID_CREDENTIALS'
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  
  if (!isPasswordValid) {
    return res.status(401).json({ 
      error: 'Credenciais inválidas',
      code: 'INVALID_CREDENTIALS'
    });
  }

  const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET!, {
    expiresIn: '7d'
  });

  res.cookie('token', token, config.cookies);

  res.json({ 
    message: 'Login realizado com sucesso',
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  });
});

// Logout
export const logout = asyncHandler(async (req: Request, res: Response): Promise<any> => {
  res.clearCookie('token');
  res.json({ message: 'Logout realizado com sucesso' });
});

// Rota protegida - perfil do usuário
export const me = asyncHandler(async (req: Request, res: Response): Promise<any> => {
  const user = (req as any).user;
  
  if (!user) {
    return res.status(401).json({ 
      error: 'Usuário não autenticado',
      code: 'NOT_AUTHENTICATED'
    });
  }
  
  res.json({ 
    user: { 
      id: user.id, 
      name: user.name, 
      email: user.email,
      createdAt: user.createdAt
    } 
  });
});