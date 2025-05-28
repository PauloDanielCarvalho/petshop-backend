import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

type ValidationTarget = 'body' | 'query' | 'params';

export const validate = (schema: z.ZodSchema<any>, target: ValidationTarget = 'body') => {
  return (req: Request, res: Response, next: NextFunction): any => {
    try {
      let dataToValidate;
      
      switch (target) {
        case 'body':
          dataToValidate = req.body;
          break;
        case 'query':
          dataToValidate = req.query;
          break;
        case 'params':
          dataToValidate = req.params;
          break;
        default:
          dataToValidate = req.body;
      }

      const validated = schema.parse(dataToValidate);
      
      // Atualiza o objeto original com os dados validados e transformados
      switch (target) {
        case 'body':
          req.body = validated;
          break;
        case 'query':
          req.query = validated;
          break;
        case 'params':
          req.params = validated;
          break;
      }
      
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));

        return res.status(400).json({
          error: 'Dados de entrada inválidos',
          details: formattedErrors
        });
      }
      
      return res.status(500).json({
        error: 'Erro interno do servidor durante validação'
      });
    }
  };
};

// Middleware específico para validação de corpo
export const validateBody = (schema: z.ZodSchema<any>) => validate(schema, 'body');

// Middleware específico para validação de query parameters  
export const validateQuery = (schema: z.ZodSchema<any>) => validate(schema, 'query');

// Middleware específico para validação de path parameters
export const validateParams = (schema: z.ZodSchema<any>) => validate(schema, 'params'); 