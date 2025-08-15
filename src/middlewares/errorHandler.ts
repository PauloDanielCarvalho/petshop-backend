import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  console.error('❌ Error:', error);

  // Erro de validação do Prisma (dados duplicados)
  if (error.code === 'P2002') {
    const field = error.meta?.target?.[0] || 'campo';
    return res.status(409).json({
      error: `${field.charAt(0).toUpperCase() + field.slice(1)} já existe`,
      code: 'DUPLICATE_ENTRY'
    });
  }

  // Erro de registro não encontrado no Prisma
  if (error.code === 'P2025') {
    return res.status(404).json({
      error: 'Registro não encontrado',
      code: 'NOT_FOUND'
    });
  }

  // Erro de relacionamento no Prisma
  if (error.code === 'P2003') {
    return res.status(400).json({
      error: 'Relacionamento inválido entre registros',
      code: 'INVALID_RELATION'
    });
  }

  // Erro JWT (token inválido/expirado)
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Token de acesso inválido',
      code: 'INVALID_TOKEN'
    });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token de acesso expirado',
      code: 'EXPIRED_TOKEN'
    });
  }

  // Erro de sintaxe JSON
  if (error instanceof SyntaxError && 'body' in error) {
    return res.status(400).json({
      error: 'JSON mal formatado',
      code: 'INVALID_JSON'
    });
  }

  // Erro de validação personalizado
  if (error.status === 400 && error.message) {
    return res.status(400).json({
      error: error.message,
      code: 'VALIDATION_ERROR'
    });
  }

  // Erro de autorização
  if (error.status === 401) {
    return res.status(401).json({
      error: 'Não autorizado',
      code: 'UNAUTHORIZED'
    });
  }

  // Erro de permissão
  if (error.status === 403) {
    return res.status(403).json({
      error: 'Acesso negado',
      code: 'FORBIDDEN'
    });
  }

  // Erro não encontrado
  if (error.status === 404) {
    return res.status(404).json({
      error: 'Recurso não encontrado',
      code: 'NOT_FOUND'
    });
  }

  // Erro interno do servidor (padrão)
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return res.status(500).json({
    error: 'Erro interno do servidor',
    code: 'INTERNAL_ERROR',
    ...(isDevelopment && {
      details: error.message,
      stack: error.stack
    })
  });
};

// Middleware para capturar erros assíncronos
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Middleware para rotas não encontradas
export const notFound = (req: Request, res: Response, next: NextFunction): any => {
  const error = new Error(`Rota não encontrada - ${req.originalUrl}`);
  (error as any).status = 404;
  next(error);
}; 