import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server
  port: parseInt(process.env.PORT || '5000'),
  environment: process.env.NODE_ENV || 'development',
  
  // Database
  database: {
    url: process.env.DATABASE_URL!
  },
  
  // JWT
  jwt: {
    secret: process.env.JWT_SECRET!,
    expiresIn: '7d'
  },
  
  // Cookies
  cookies: {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dias
  },
  
  // Security
  bcrypt: {
    saltRounds: 12
  }
};

// Validação de variáveis obrigatórias
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Variável de ambiente obrigatória não encontrada: ${envVar}`);
    process.exit(1);
  }
} 