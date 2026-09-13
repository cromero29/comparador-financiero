import { Request, Response, NextFunction } from 'express';
import { logRequest } from '../config/logger';

// Middleware para logging de requests
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  
  // Interceptar el response para capturar el status code
  const originalSend = res.send;
  res.send = function (body): Response {
    const duration = Date.now() - startTime;
    
    logRequest(
      req.method,
      req.url,
      res.statusCode,
      duration
    );
    
    return originalSend.call(this, body);
  };
  
  next();
};

// Middleware para agregar metadata a responses
export const responseMetadata = (req: Request, res: Response, next: NextFunction) => {
  // Agregar método helper para enviar respuestas consistentes
  res.apiSuccess = function (data: any, statusCode: number = 200) {
    return this.status(statusCode).json({
      success: true,
      data,
      metadata: {
        timestamp: new Date().toISOString(),
      },
    });
  };
  
  next();
};

// Extender el tipo Response para incluir método helper
declare global {
  namespace Express {
    interface Response {
      apiSuccess(data: any, statusCode?: number): Response;
    }
  }
}
