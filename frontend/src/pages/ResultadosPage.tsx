import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { OfertaCard } from '@components/OfertaCard';
import { Button } from '@components/ui/Button';
import { Loading, CardSkeleton } from '@components/ui/Loading';
import { ComparacionFormData, ResultadoComparacion } from '../types';
import { compararOfertas, trackEvento } from '@services/api';
import { formatCurrency, formatPercentage } from '@utils/format';
import { TEXTOS } from '@config/constants';

export const ResultadosPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [resultado, setResultado] = useState<ResultadoComparacion | null>(null);
  
  const formData = location.state?.formData as ComparacionFormData | undefined;
  
  // Mutation para comparar
  const { mutate: comparar, isPending } = useMutation({
    mutationFn: compararOfertas,
    onSuccess: async (data) => {
      setResultado(data);
      
      // Tracking
      await trackEvento({
        tipoEvento: 'results_view',
        categoria: 'comparacion',
        accion: 'view',
        metadata: {
          tipoProducto: formData?.tipoProducto,
          ofertasEncontradas: data.ofertas.length,
          mejorTasa: data.resumen.mejorTasa,
        },
      });
    },
    onError: (error) => {
      console.error('Error al comparar:', error);
    },
  });
  
  useEffect(() => {
    // Si no hay formData, redirigir al inicio
    if (!formData) {
      navigate('/');
      return;
    }
    
    // Ejecutar comparación
    comparar(formData);
  }, [formData, navigate, comparar]);
  
  const handleNuevaComparacion = () => {
    navigate('/');
  };
  
  if (!formData) {
    return null;
  }
  
  if (isPending) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="container-custom py-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">💳</span>
              <h1 className="text-xl font-bold">{TEXTOS.APP_NAME}</h1>
            </div>
          </div>
        </header>
        
        <div className="container-custom py-16">
          <Loading
            size="lg"
            text="Comparando ofertas en múltiples entidades..."
          />
          
          <div className="mt-12 space-y-4 max-w-4xl mx-auto">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </div>
      </div>
    );
  }
  
  if (!resultado) {
    return null;
  }
  
  const tieneOfertas = resultado.ofertas.length > 0;
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">💳</span>
              <h1 className="text-xl font-bold">{TEXTOS.APP_NAME}</h1>
            </div>
            
            <Button variant="ghost" onClick={handleNuevaComparacion}>
              ← Nueva comparación
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container-custom py-8">
        {tieneOfertas ? (
          <>
            {/* Resumen */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">
                ✨ Encontramos {resultado.resumen.totalOfertas} {resultado.resumen.totalOfertas === 1 ? 'oferta' : 'ofertas'} para ti
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Monto solicitado</p>
                  <p className="text-lg font-bold">
                    {formatCurrency(formData.montoSolicitado)}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Plazo</p>
                  <p className="text-lg font-bold">
                    {formData.plazoMeses} meses
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Mejor tasa (TEA)</p>
                  <p className="text-lg font-bold text-success-600">
                    {formatPercentage(resultado.resumen.mejorTasa)}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Mejor cuota</p>
                  <p className="text-lg font-bold text-success-600">
                    {formatCurrency(resultado.resumen.mejorCuota)}
                  </p>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mt-4">
                💡 Las ofertas están ordenadas de mejor a peor según tasa, costo total y condiciones
              </p>
            </div>
            
            {/* Lista de ofertas */}
            <div className="space-y-4">
              {resultado.ofertas.map((oferta) => (
                <OfertaCard key={oferta.id} oferta={oferta} />
              ))}
            </div>
            
            {/* Disclaimer */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-8">
              <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Importante</h3>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Los cálculos son estimados basados en información pública</li>
                <li>• La aprobación y condiciones finales dependen de cada entidad</li>
                <li>• Te recomendamos validar toda la información antes de solicitar</li>
                <li>• Datos actualizados: {new Date(resultado.fechaConsulta).toLocaleDateString('es-CO')}</li>
              </ul>
            </div>
          </>
        ) : (
          // Sin resultados
          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="text-6xl mb-6">😔</div>
            <h2 className="text-2xl font-bold mb-4">
              No encontramos ofertas para tus criterios
            </h2>
            <p className="text-gray-600 mb-8">
              Esto puede deberse a que el monto solicitado está fuera de los rangos disponibles 
              o tus ingresos no son suficientes para la cuota calculada.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold text-blue-900 mb-3">💡 Sugerencias:</h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>✓ Intenta con un monto menor</li>
                <li>✓ Aumenta el plazo para reducir la cuota mensual</li>
                <li>✓ Verifica que tus ingresos sean correctos</li>
                <li>✓ Considera incluir ingresos adicionales si los tienes</li>
              </ul>
            </div>
            
            <Button onClick={handleNuevaComparacion} size="lg">
              🔄 Intentar con otros valores
            </Button>
          </div>
        )}
      </main>
      
      {/* Footer simple */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="container-custom text-center">
          <p className="text-sm text-gray-400">
            © 2026 {TEXTOS.APP_NAME}. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};
