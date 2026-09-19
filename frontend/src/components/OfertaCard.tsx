import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { OfertaComparada } from '../types';
import { formatCurrency, formatPercentage } from '@utils/format';
import { RANKING_COLORS, ENTIDAD_ICONS } from '@config/constants';
import { trackingService } from '@services/tracking';
import { getLogo } from '@/assets/logos';

interface OfertaCardProps {
  oferta: OfertaComparada;
  montoSolicitado: number;
  paginaActual?: number;
  edad?: number;
  ingresos?: number;
  tipoEmpleo?: string;
  onClickSolicitar?: (oferta: OfertaComparada) => void;
}

export const OfertaCard = ({ 
  oferta, 
  montoSolicitado, 
  paginaActual = 1,
  edad = 30,
  ingresos = 3000000,
  tipoEmpleo = 'dependiente',
  onClickSolicitar 
}: OfertaCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  
  const rankingColor = RANKING_COLORS[oferta.ranking.posicion as 1 | 2 | 3] || RANKING_COLORS.default;
  const logoLocal = getLogo(oferta.entidad.codigo);
  
  const handleToggleDetails = () => {
    setShowDetails(!showDetails);
    
    // Registrar que expandió la oferta
    if (!showDetails) {
      trackingService.registrarOfertaExpandida();
    }
  };
  
  const handleSolicitar = () => {
    // IMPORTANTE: abrir la pestaña de inmediato, dentro del gesto del usuario.
    // Los navegadores móviles (Safari/Chrome) bloquean window.open si ocurre
    // después de un await. Por eso abrimos primero y trackeamos en segundo plano.
    const nuevaVentana = window.open(oferta.urlSolicitud, '_blank', 'noopener,noreferrer');

    // Si el navegador bloqueó el popup, navegamos en la misma pestaña como fallback
    if (!nuevaVentana) {
      // Registrar el clic sin bloquear y luego redirigir
      trackingService.registrarClic(construirDatosClic()).catch(console.error);
      window.location.href = oferta.urlSolicitud;
      return;
    }

    // Registrar el clic en segundo plano (no bloquea la navegación)
    trackingService.registrarClic(construirDatosClic()).catch(console.error);

    onClickSolicitar?.(oferta);
  };

  // Construye el payload de tracking del clic
  const construirDatosClic = () => ({
    productoId: oferta.id,
    entidadId: oferta.entidad.id,
    entidadNombre: oferta.entidad.nombre,
    entidadTipo: oferta.entidad.tipo,
    posicion: oferta.ranking.posicion,
    paginaResultados: paginaActual,
    montoSolicitado,
    plazoMeses: oferta.condiciones.plazoMeses,
    tipoProducto: oferta.producto.tipo,
    tasaOfrecida: oferta.condiciones.tasaEfectivaAnual,
    cuotaOfrecida: oferta.cuota.total,
    edad,
    ingresos,
    tipoEmpleo,
    urlDestino: oferta.urlSolicitud,
  });
  
  return (
    <Card hover className={`border-l-4 ${oferta.ranking.posicion === 1 ? 'border-l-green-500' : 'border-l-primary-500'}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-28 h-20 flex items-center justify-center bg-white rounded-lg border border-gray-200 p-3">
              <img 
                src={logoLocal} 
                alt={oferta.entidad.nombre}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div>
              <CardTitle className="text-lg">{oferta.entidad.nombre}</CardTitle>
              <p className="text-sm text-gray-600">{oferta.producto.nombre}</p>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-1">
            <Badge variant={oferta.ranking.posicion === 1 ? 'success' : 'primary'}>
              #{oferta.ranking.posicion}
            </Badge>
            <Badge variant="default">{oferta.entidad.tipo}</Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Información principal */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500 uppercase">TEA</p>
            <p className="text-lg font-bold text-primary-600">
              {formatPercentage(oferta.condiciones.tasaEfectivaAnual)}
            </p>
          </div>
          
          <div>
            <p className="text-xs text-gray-500 uppercase">Cuota mensual</p>
            <p className="text-lg font-bold">
              {formatCurrency(oferta.cuota.total)}
            </p>
          </div>
          
          <div>
            <p className="text-xs text-gray-500 uppercase">Total a pagar</p>
            <p className="text-lg font-bold">
              {formatCurrency(oferta.totales.aPagar)}
            </p>
          </div>
          
          <div>
            <p className="text-xs text-gray-500 uppercase">Costo total</p>
            <p className="text-lg font-bold text-gray-700">
              {formatCurrency(oferta.totales.costoTotal)}
            </p>
          </div>
        </div>
        
        {/* Ahorro en compra de cartera */}
        {oferta.ahorroCompraCartera && (
          <div className="bg-success-50 border border-success-200 rounded-lg p-4 mb-4">
            <h4 className="text-sm font-semibold text-success-800 mb-2">
              ✨ Ahorrarías con esta opción
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-success-700">En cuota mensual</p>
                <p className="font-bold text-success-900">
                  {formatCurrency(oferta.ahorroCompraCartera.ahorroCuota)}
                </p>
              </div>
              <div>
                <p className="text-xs text-success-700">Total</p>
                <p className="font-bold text-success-900">
                  {formatCurrency(oferta.ahorroCompraCartera.ahorroTotal)}
                  <span className="text-sm ml-1">
                    ({formatPercentage(oferta.ahorroCompraCartera.porcentajeAhorro)})
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Razonamiento */}
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <p className="text-sm text-gray-700">
            💡 {oferta.ranking.razonamiento}
          </p>
        </div>
        
        {/* Detalles expandibles */}
        {showDetails && (
          <div className="space-y-3 pt-3 border-t">
            <div>
              <h5 className="text-sm font-semibold mb-2">Desglose de cuota</h5>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Capital + Interés</span>
                  <span className="font-medium">{formatCurrency(oferta.cuota.mensual)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Seguro de vida</span>
                  <span className="font-medium">{formatCurrency(oferta.cuota.seguroVida)}</span>
                </div>
                {oferta.cuota.seguroDesempleo > 0 && (
                  <div className="flex justify-between">
                    <span>Seguro desempleo</span>
                    <span className="font-medium">{formatCurrency(oferta.cuota.seguroDesempleo)}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h5 className="text-sm font-semibold mb-2">Costos adicionales</h5>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Estudio de crédito</span>
                  <span className="font-medium">{formatCurrency(oferta.costos.estudio)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Administración</span>
                  <span className="font-medium">{formatCurrency(oferta.costos.administracion)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Seguros total</span>
                  <span className="font-medium">{formatCurrency(oferta.costos.seguros)}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h5 className="text-sm font-semibold mb-2">Tasas</h5>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Tasa N.M.V.</span>
                  <span className="font-medium">{formatPercentage(oferta.condiciones.tasaNominalMensual)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tasa N.A.</span>
                  <span className="font-medium">{formatPercentage(oferta.condiciones.tasaNominalAnual)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tasa E.A.</span>
                  <span className="font-medium">{formatPercentage(oferta.condiciones.tasaEfectivaAnual)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex-col sm:flex-row gap-2">
        <Button
          variant="primary"
          fullWidth
          onClick={handleSolicitar}
        >
          🚀 Solicitar ahora
        </Button>
        
        <Button
          variant="ghost"
          fullWidth
          onClick={handleToggleDetails}
        >
          {showDetails ? '▲ Menos detalles' : '▼ Más detalles'}
        </Button>
      </CardFooter>
    </Card>
  );
};
