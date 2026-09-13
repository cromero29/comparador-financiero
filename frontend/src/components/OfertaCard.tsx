import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { OfertaComparada } from '../types';
import { formatCurrency, formatPercentage } from '@utils/format';
import { RANKING_COLORS, ENTIDAD_ICONS } from '@config/constants';
import { trackClic } from '@services/api';

interface OfertaCardProps {
  oferta: OfertaComparada;
  onClickSolicitar?: (oferta: OfertaComparada) => void;
}

export const OfertaCard = ({ oferta, onClickSolicitar }: OfertaCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [logoError, setLogoError] = useState(false);
  
  const rankingColor = RANKING_COLORS[oferta.ranking.posicion as 1 | 2 | 3] || RANKING_COLORS.default;
  const icon = ENTIDAD_ICONS[oferta.entidad.nombre.toUpperCase().replace(/\s/g, '_')] || '🏦';
  
  const handleSolicitar = async () => {
    setIsRedirecting(true);
    
    try {
      // Tracking del clic (CPC)
      const response = await trackClic({
        productoId: oferta.id,
        posicion: oferta.ranking.posicion,
        montoSolicitado: 0, // No disponible en la oferta
        plazoMeses: oferta.condiciones.plazoMeses,
        tipoProducto: oferta.producto.tipo,
      });
      
      // Abrir URL en nueva pestaña
      window.open(response.urlRedirect, '_blank');
      
      // Callback opcional
      onClickSolicitar?.(oferta);
      
    } catch (error) {
      console.error('Error al redirigir:', error);
      // Fallback: abrir URL directamente
      window.open(oferta.urlSolicitud, '_blank');
    } finally {
      setIsRedirecting(false);
    }
  };
  
  return (
    <Card hover className={`border-l-4 ${oferta.ranking.posicion === 1 ? 'border-l-green-500' : 'border-l-primary-500'}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {oferta.entidad.logo && !logoError ? (
              <img 
                src={oferta.entidad.logo} 
                alt={oferta.entidad.nombre}
                className="h-12 w-auto object-contain"
                onError={() => setLogoError(true)}
              />
            ) : (
              <span className="text-4xl">{icon}</span>
            )}
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
          isLoading={isRedirecting}
        >
          {isRedirecting ? 'Redirigiendo...' : '🚀 Solicitar ahora'}
        </Button>
        
        <Button
          variant="ghost"
          fullWidth
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? '▲ Menos detalles' : '▼ Más detalles'}
        </Button>
      </CardFooter>
    </Card>
  );
};
