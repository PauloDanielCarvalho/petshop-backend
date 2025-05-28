import rateLimit from 'express-rate-limit';
import { Request } from 'express';

// Rate limiter geral para toda a API
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requisições por IP a cada 15 minutos
  message: {
    error: 'Muitas requisições deste IP, tente novamente em 15 minutos.',
    retryAfter: '15 minutos'
  },
  standardHeaders: true, // Retorna rate limit info nos headers `RateLimit-*`
  legacyHeaders: false, // Desabilita os headers `X-RateLimit-*`
});

// Rate limiter específico para autenticação (mais restritivo)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 tentativas de login por IP a cada 15 minutos
  message: {
    error: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
    retryAfter: '15 minutos'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Só aplica o limite em rotas específicas
  skip: (req: Request) => {
    // Não aplica rate limit nas rotas de registro e logout
    return req.path === '/register' || req.path === '/logout';
  }
});

// Rate limiter para criação de recursos (pets, appointments)
export const createLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 10, // máximo 10 criações por minuto
  message: {
    error: 'Muitas criações em pouco tempo. Aguarde 1 minuto.',
    retryAfter: '1 minuto'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter mais restritivo para operações sensíveis
export const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 50, // máximo 50 requisições por hora
  message: {
    error: 'Limite de requisições excedido. Tente novamente em 1 hora.',
    retryAfter: '1 hora'
  },
  standardHeaders: true,
  legacyHeaders: false,
}); 