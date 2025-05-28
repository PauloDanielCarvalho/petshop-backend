import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/authRoutes';
import petRoutes from './routes/petRoutes';
import appointmentRoutes from './routes/appointmentRoutes';
import { generalLimiter } from './middlewares/rateLimiter';
import { errorHandler, notFound } from './middlewares/errorHandler';
import { config } from './config';

dotenv.config();
const app = express();

// Rate limiting geral para toda a aplicação
app.use(generalLimiter);

app.use(express.json());
app.use(cookieParser());

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api', petRoutes);  
app.use('/api/appointments', appointmentRoutes);

// Middleware para rotas não encontradas
app.use(notFound);

// Middleware global de tratamento de erros
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`🚀 Servidor rodando na porta ${config.port}`);
  console.log(`🌍 Ambiente: ${config.environment}`);
});
