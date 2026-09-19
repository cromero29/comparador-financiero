import api from './api';

// Fingerprint simple del navegador (mejorable con FingerprintJS)
const getFingerprint = (): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('fingerprint', 2, 2);
  }
  const canvasData = canvas.toDataURL();
  
  const data = `${navigator.userAgent}|${navigator.language}|${screen.width}x${screen.height}|${canvasData.substring(0, 50)}`;
  
  // Hash simple
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
};

// Detectar tipo de dispositivo
const getDeviceType = (): string => {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
};

// Detectar navegador
const getBrowser = (): string => {
  const ua = navigator.userAgent;
  if (ua.includes('Firefox')) return 'firefox';
  if (ua.includes('Chrome')) return 'chrome';
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'safari';
  if (ua.includes('Edge')) return 'edge';
  return 'other';
};

// Detectar SO
const getOS = (): string => {
  const ua = navigator.userAgent;
  if (ua.includes('Win')) return 'Windows';
  if (ua.includes('Mac')) return 'MacOS';
  if (ua.includes('Linux')) return 'Linux';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
  return 'Other';
};

// Obtener parámetros UTM de la URL
const getUTMParams = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get('utm_source') || undefined,
    utmMedium: params.get('utm_medium') || undefined,
    utmCampaign: params.get('utm_campaign') || undefined,
    utmContent: params.get('utm_content') || undefined,
    utmTerm: params.get('utm_term') || undefined,
  };
};

class TrackingService {
  private sesionId: string | null = null;
  private busquedaId: string | null = null;
  private inicioVisualizacionResultados: number | null = null;
  private ofertasExpandidasCount: number = 0;

  /**
   * Inicializar sesión
   */
  async inicializarSesion(): Promise<string> {
    // Si ya existe sesión VÁLIDA en sessionStorage, usar esa
    const sesionExistente = sessionStorage.getItem('sesionId');
    if (sesionExistente && !sesionExistente.startsWith('temp_')) {
      this.sesionId = sesionExistente;
      return sesionExistente;
    }

    try {
      const response = await api.post('/sesion/iniciar', {
        fingerprint: getFingerprint(),
        ipAddress: undefined, // Se captura en backend
        userAgent: navigator.userAgent,
        dispositivo: getDeviceType(),
        navegador: getBrowser(),
        sistemaOperativo: getOS(),
        ...getUTMParams(),
        referrer: document.referrer || undefined,
      });

      this.sesionId = response.data.sesionId;
      sessionStorage.setItem('sesionId', this.sesionId!);
      
      return this.sesionId!;
    } catch (error) {
      console.error('Error al inicializar sesión:', error);
      // NO cachear IDs temporales para reintentar en la próxima llamada
      this.sesionId = null;
      sessionStorage.removeItem('sesionId');
      throw error;
    }
  }

  /**
   * Obtener sesión ID (lazy init)
   */
  async getSesionId(): Promise<string | null> {
    if (this.sesionId && !this.sesionId.startsWith('temp_')) {
      return this.sesionId;
    }
    try {
      return await this.inicializarSesion();
    } catch (error) {
      console.warn('No se pudo obtener sesión válida:', error);
      return null;
    }
  }

  /**
   * Registrar búsqueda completa
   */
  async registrarBusqueda(params: {
    tipoProducto: string;
    montoSolicitado: number;
    plazoMeses: number;
    ingresos: number;
    edad: number;
    tipoEmpleo: string;
    deudaActual?: number;
    cuotaActual?: number;
    tasaActual?: number;
    ofertasEncontradas: number;
    mejorTasa: number;
    mejorCuota: number;
    entidad1Id?: string;
    entidad2Id?: string;
    entidad3Id?: string;
  }) {
    try {
      const sesionId = await this.getSesionId();
      if (!sesionId) {
        console.warn('Sin sesión válida, no se registra búsqueda');
        return;
      }
      
      const response = await api.post('/busqueda/registrar', {
        sesionId,
        ...params
      });

      this.busquedaId = response.data.busquedaId;
      
      // Iniciar contador de tiempo en resultados
      this.inicioVisualizacionResultados = Date.now();
      this.ofertasExpandidasCount = 0;

      return response.data;
    } catch (error) {
      console.error('Error al registrar búsqueda:', error);
    }
  }

  /**
   * Registrar que se expandió una oferta
   */
  registrarOfertaExpandida() {
    this.ofertasExpandidasCount++;
  }

  /**
   * Actualizar engagement de búsqueda
   */
  async actualizarEngagement(generoClic: boolean = false, clicsGenerados: number = 0) {
    if (!this.busquedaId || !this.inicioVisualizacionResultados) return;

    try {
      const tiempoEnResultados = Math.floor((Date.now() - this.inicioVisualizacionResultados) / 1000);
      
      await api.post('/busqueda/engagement', {
        busquedaId: this.busquedaId,
        tiempoEnResultados,
        ofertasExpandidas: this.ofertasExpandidasCount,
        generoClic,
        clicsGenerados
      });
    } catch (error) {
      console.error('Error al actualizar engagement:', error);
    }
  }

  /**
   * Registrar clic en "Solicitar ahora"
   */
  async registrarClic(params: {
    productoId: string;
    entidadId: string;
    entidadNombre: string;
    entidadTipo: string;
    posicion: number;
    paginaResultados: number;
    montoSolicitado: number;
    plazoMeses: number;
    tipoProducto: string;
    tasaOfrecida: number;
    cuotaOfrecida: number;
    edad: number;
    ingresos: number;
    tipoEmpleo: string;
    urlDestino: string;
  }) {
    try {
      const sesionId = await this.getSesionId();
      if (!sesionId) {
        console.warn('Sin sesión válida, no se registra clic');
        return;
      }
      
      const response = await api.post('/clic/registrar', {
        sesionId,
        busquedaId: this.busquedaId,
        ...params,
        redireccionExitosa: true
      });

      // Actualizar engagement indicando que generó clic
      await this.actualizarEngagement(true, 1);

      return response.data;
    } catch (error) {
      console.error('Error al registrar clic:', error);
    }
  }

  /**
   * Registrar evento genérico
   */
  async registrarEvento(params: {
    tipoEvento: string;
    categoria: string;
    accion: string;
    etiqueta?: string;
    metadata?: any;
  }) {
    try {
      const sesionId = await this.getSesionId();
      if (!sesionId) {
        console.warn('Sin sesión válida, no se registra evento');
        return;
      }
      
      await api.post('/evento/registrar', {
        sesionId,
        ...params,
        url: window.location.href,
        pathname: window.location.pathname
      });
    } catch (error) {
      console.error('Error al registrar evento:', error);
    }
  }

  /**
   * Resetear tracking (para nueva búsqueda)
   */
  resetearBusqueda() {
    this.busquedaId = null;
    this.inicioVisualizacionResultados = null;
    this.ofertasExpandidasCount = 0;
  }
}

// Instancia singleton
export const trackingService = new TrackingService();

// Hook para React
export const useTracking = () => {
  return trackingService;
};
