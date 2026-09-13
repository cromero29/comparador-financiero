import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { env } from '../config/env';
import { Request, Response } from 'express';
import { ApiResponse } from '../types';

// Headers de seguridad con Helmet
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
});

// CORS configurado
export const corsOptions = cors({
  origin: (origin, callback) => {
    // Permitir requests sin origin (mobile apps, Postman, etc.)
    if (!origin) {
      return callback(null, true);
    }
    
    if (env.ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400, // 24 horas
});

// Rate limiter general
export const generalLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS, // 15 minutos por defecto
  max: env.RATE_LIMIT_MAX_REQUESTS, // 100 requests por defecto
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Demasiadas solicitudes. Por favor, espera un momento.',
    },
  } as ApiResponse,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Demasiadas solicitudes. Por favor, espera un momento.',
      },
    } as ApiResponse);
  },
});

// Rate limiter específico para comparación
export const comparacionLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 10, // 10 comparaciones por minuto
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Has alcanzado el límite de comparaciones. Espera 1 minuto.',
    },
  } as ApiResponse,
  keyGenerator: (req: Request) => {
    // Por IP o sessionId si existe
    return req.ip || req.headers['x-forwarded-for'] as string || 'unknown';
  },
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Has alcanzado el límite de comparaciones. Espera 1 minuto.',
      },
    } as ApiResponse);
  },
});

// Rate limiter para scraping (admin)
export const scrapingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 5, // 5 ejecuciones por hora
  skipSuccessfulRequests: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Límite de scraping alcanzado. Espera 1 hora.',
    },
  } as ApiResponse,
});
