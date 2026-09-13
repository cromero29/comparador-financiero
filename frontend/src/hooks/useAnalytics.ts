import { useCallback } from 'react';
import { trackEvento } from '@services/api';

export const useAnalytics = () => {
  const track = useCallback(async (
    tipoEvento: string,
    categoria: string,
    accion: string,
    metadata: Record<string, any> = {}
  ) => {
    try {
      await trackEvento({
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
