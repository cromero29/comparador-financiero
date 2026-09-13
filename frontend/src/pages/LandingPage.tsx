import { useNavigate } from 'react-router-dom';
import { ComparacionForm } from '@components/ComparacionForm';
import { ComparacionFormData } from '@types/index';
import { trackEvento } from '@services/api';
import { TEXTOS } from '@config/constants';

export const LandingPage = () => {
  const navigate = useNavigate();
  
  const handleSubmit = async (data: ComparacionFormData) => {
    // Tracking
    await trackEvento({
      tipoEvento: 'form_complete',
      categoria: 'comparacion',
      accion: 'submit',
      metadata: {
        tipoProducto: data.tipoProducto,
        monto: data.montoSolicitado,
        plazo: data.plazoMeses,
      },
    });
    
    // Navegar a resultados con datos en state
    navigate('/resultados', { state: { formData: data } });
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">💳</span>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{TEXTOS.APP_NAME}</h1>
                <p className="text-sm text-gray-600">{TEXTOS.APP_DESCRIPTION}</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-4">
              <a href="#como-funciona" className="text-sm text-gray-600 hover:text-primary-600">
                ¿Cómo funciona?
              </a>
              <a href="#beneficios" className="text-sm text-gray-600 hover:text-primary-600">
                Beneficios
              </a>
            </div>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="container-custom py-12 md:py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Encuentra el <span className="text-primary-600">mejor crédito</span> en minutos
          </h2>
          <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
            Comparamos ofertas de múltiples entidades financieras para que obtengas 
            la tasa más baja y las mejores condiciones.
          </p>
        </div>
        
        {/* Formulario principal */}
        <div className="max-w-2xl mx-auto">
          <ComparacionForm onSubmit={handleSubmit} />
        </div>
        
        {/* Características */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="font-semibold mb-2">Rápido y fácil</h3>
            <p className="text-sm text-gray-600">
              Completa el formulario en menos de 2 minutos
            </p>
          </div>
          
          <div className="text-center">
            <div className="text-4xl mb-3">🔒</div>
            <h3 className="font-semibold mb-2">100% seguro</h3>
            <p className="text-sm text-gray-600">
              Tus datos están protegidos y no los compartimos
            </p>
          </div>
          
          <div className="text-center">
            <div className="text-4xl mb-3">💰</div>
            <h3 className="font-semibold mb-2">Gratis siempre</h3>
            <p className="text-sm text-gray-600">
              Sin costos ocultos, compara todas las veces que quieras
            </p>
          </div>
        </div>
      </section>
      
      {/* Cómo funciona */}
      <section id="como-funciona" className="bg-white py-16">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">¿Cómo funciona?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">1</span>
              </div>
              <h3 className="font-semibold mb-2">Completa el formulario</h3>
              <p className="text-sm text-gray-600">
                Dinos cuánto necesitas y en cuánto tiempo quieres pagarlo
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">2</span>
              </div>
              <h3 className="font-semibold mb-2">Comparamos ofertas</h3>
              <p className="text-sm text-gray-600">
                Buscamos en múltiples entidades financieras en tiempo real
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">3</span>
              </div>
              <h3 className="font-semibold mb-2">Elige la mejor</h3>
              <p className="text-sm text-gray-600">
                Te mostramos las 5 mejores opciones ordenadas de mejor a peor
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">4</span>
              </div>
              <h3 className="font-semibold mb-2">Solicita directamente</h3>
              <p className="text-sm text-gray-600">
                Te redirigimos al sitio de la entidad para completar tu solicitud
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Beneficios */}
      <section id="beneficios" className="py-16 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">¿Por qué comparar?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">💸</span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Ahorra dinero</h3>
                <p className="text-sm text-gray-600">
                  Una diferencia de 1% en la tasa puede significar millones en ahorro
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">⏱️</span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Ahorra tiempo</h3>
                <p className="text-sm text-gray-600">
                  No necesitas visitar múltiples sitios web ni hacer llamadas
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Información clara</h3>
                <p className="text-sm text-gray-600">
                  Comparamos tasa, cuota, costos totales y más en un solo lugar
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">✅</span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Decisión informada</h3>
                <p className="text-sm text-gray-600">
                  Conoce todas tus opciones antes de comprometerte
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-4">{TEXTOS.APP_NAME}</h3>
              <p className="text-sm text-gray-400">
                Comparamos créditos para que tomes la mejor decisión financiera.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Enlaces</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-white">Términos y condiciones</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Política de privacidad</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Preguntas frecuentes</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Contacto</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>📧 soporte@comparador.com</li>
                <li>🔒 privacidad@comparador.com</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p className="mb-2">
              ⚠️ Las tasas y condiciones son referenciales y pueden variar. 
              Valida directamente con la entidad antes de solicitar.
            </p>
            <p>
              © 2026 {TEXTOS.APP_NAME}. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
