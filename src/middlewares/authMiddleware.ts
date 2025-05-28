import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../prisma';
import { config } from '../config';

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  // Busca o token no cookie chamado 'token'
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ 
      error: 'Token de acesso não fornecido',
      code: 'TOKEN_NOT_PROVIDED'
    });
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret) as { sub: string };
    const user = await prisma.user.findUnique({ 
      where: { id: decoded.sub },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(401).json({ 
        error: 'Usuário não encontrado',
        code: 'USER_NOT_FOUND'
      });
    }

    (req as any).user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ 
        error: 'Token expirado',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    return res.status(401).json({ 
      error: 'Token inválido',
      code: 'INVALID_TOKEN'
    });
  }
};