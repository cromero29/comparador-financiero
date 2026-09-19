import { useCallback } from 'react';
import { trackingService } from '@services/tracking';

export const useAnalytics = () => {
  const track = useCallback(async (
    tipoEvento: string,
    categoria: string,
    accion: string,
    metadata: Record<string, any> = {}
  ) => {
    try {
      await trackingService.registrarEvento({
        tipoEvento,
        categoria,
        accion,
        metadata,
      });
    } catch (error) {
      // Silenciar errores de tracking
      console.warn('Error tracking event:', error);
    }
  }, []);
  
  return { track };
};
