// Clase base para errores personalizados
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

// Errores específicos
export class ValidationError extends AppError {
  constructor(message: string, public details?: any) {
    super(400, 'VALIDATION_ERROR', message);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(404, 'NOT_FOUND', `${resource} no encontrado`);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'No autorizado') {
    super(401, 'UNAUTHORIZED', message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Acceso denegado') {
    super(403, 'FORBIDDEN', message);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, 'CONFLICT', message);
  }
}

export class TooManyRequestsError extends AppError {
  constructor(message = 'Demasiadas solicitudes') {
    super(429, 'TOO_MANY_REQUESTS', message);
  }
}

export class InternalServerError extends AppError {
  constructor(message = 'Error interno del servidor') {
    super(500, 'INTERNAL_SERVER_ERROR', message, false);
  }
}

export class ScraperError extends AppError {
  constructor(message: string, public entidad?: string) {
    super(500, 'SCRAPER_ERROR', message, false);
  }
}
