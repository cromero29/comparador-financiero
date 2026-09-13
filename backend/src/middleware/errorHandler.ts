import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/errors';
import { logger, logError } from '../config/logger';
import { ApiResponse } from '../types';

// Middleware para manejar errores
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log del error
  logError(err, {
    method: req.method,
    url: req.url,
    body: req.body,
    query: req.query,
  });

  // Error de validación de Zod
  if (err instanceof ZodError) {
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Datos inválidos',
        details: err.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      },
    };
    return res.status(400).json(response);
  }

  // Errores de aplicación personalizados
  if (err instanceof AppError) {
    const response: ApiResponse = {
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: (err as any).details,
      },
    };
    return res.status(err.statusCode).json(response);
  }

  // Errores de Prisma
  if (err.name === 'PrismaClientKnownRequestError') {
    const prismaError = err as any;
    
    // Unique constraint violation
    if (prismaError.code === 'P2002') {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'DUPLICATE_ENTRY',
          message: 'El registro ya existe',
          details: prismaError.meta,
        },
      };
      return res.status(409).json(response);
    }
    
    // Record not found
    if (prismaError.code === 'P2025') {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Registro no encontrado',
        },
      };
      return res.status(404).json(response);
    }
  }

  // Error genérico del servidor
  const response: ApiResponse = {
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: process.env.NODE_ENV === 'production' 
        ? 'Error interno del servidor' 
        : err.message,
    },
  };
  
  res.status(500).json(response);
};

// Middleware para rutas no encontradas
export const notFoundHandler = (req: Request, res: Response) => {
  const response: ApiResponse = {
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Ruta no encontrada: ${req.method} ${req.url}`,
    },
  };
  
  res.status(404).json(response);
};

// Wrapper para async route handlers
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
