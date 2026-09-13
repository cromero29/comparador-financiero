import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Button } from './ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/Card';
import { TipoProducto, TipoEmpleo, ComparacionFormData } from '@types/index';
import { RANGOS, DEFAULTS, TEXTOS } from '@config/constants';
import { formatCurrency, formatNumber } from '@utils/format';

// Schema de validación
const comparacionSchema = z.object({
  tipoProducto: z.nativeEnum(TipoProducto),
  montoSolicitado: z.number()
    .min(RANGOS.MONTO.MIN, `Mínimo ${formatCurrency(RANGOS.MONTO.MIN)}`)
    .max(RANGOS.MONTO.MAX, `Máximo ${formatCurrency(RANGOS.MONTO.MAX)}`),
  plazoMeses: z.number()
    .int('Debe ser un número entero')
    .min(RANGOS.PLAZO.MIN, `Mínimo ${RANGOS.PLAZO.MIN} meses`)
    .max(RANGOS.PLAZO.MAX, `Máximo ${RANGOS.PLAZO.MAX} meses`),
  ingresos: z.number()
    .min(RANGOS.INGRESOS.MIN, `Mínimo ${formatCurrency(RANGOS.INGRESOS.MIN)}`),
  edad: z.number()
    .int('Debe ser un número entero')
    .min(RANGOS.EDAD.MIN, `Mínimo ${RANGOS.EDAD.MIN} años`)
    .max(RANGOS.EDAD.MAX, `Máximo ${RANGOS.EDAD.MAX} años`),
  tipoEmpleo: z.nativeEnum(TipoEmpleo),
  // Compra de cartera
  deudaActual: z.number().optional(),
  cuotaActual: z.number().optional(),
  tasaActual: z.number().optional(),
});

interface ComparacionFormProps {
  onSubmit: (data: ComparacionFormData) => void;
  isLoading?: boolean;
}

export const ComparacionForm = ({ onSubmit, isLoading = false }: ComparacionFormProps) => {
  const [tipoProducto, setTipoProducto] = useState<TipoProducto>(TipoProducto.LIBRE_INVERSION);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ComparacionFormData>({
    resolver: zodResolver(comparacionSchema),
    defaultValues: {
      tipoProducto: TipoProducto.LIBRE_INVERSION,
      montoSolicitado: DEFAULTS.MONTO,
      plazoMeses: DEFAULTS.PLAZO,
      ingresos: DEFAULTS.INGRESOS,
      edad: DEFAULTS.EDAD,
      tipoEmpleo: TipoEmpleo.DEPENDIENTE,
    },
  });
  
  const montoSolicitado = watch('montoSolicitado');
  const plazoMeses = watch('plazoMeses');
  const ingresos = watch('ingresos');
  
  const handleTipoProductoChange = (tipo: TipoProducto) => {
    setTipoProducto(tipo);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparar Créditos</CardTitle>
        <CardDescription>
          Completa la información para encontrar las mejores ofertas
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Tipo de producto */}
          <div>
            <label className="label">Tipo de crédito</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleTipoProductoChange(TipoProducto.LIBRE_INVERSION)}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  tipoProducto === TipoProducto.LIBRE_INVERSION
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  {...register('tipoProducto')}
                  value={TipoProducto.LIBRE_INVERSION}
                  checked={tipoProducto === TipoProducto.LIBRE_INVERSION}
                  className="sr-only"
                />
                <div className="text-sm font-medium">
                  {TEXTOS.TIPOS_PRODUCTO.LIBRE_INVERSION}
                </div>
              </button>
              
              <button
                type="button"
                onClick={() => handleTipoProductoChange(TipoProducto.COMPRA_CARTERA)}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  tipoProducto === TipoProducto.COMPRA_CARTERA
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  {...register('tipoProducto')}
                  value={TipoProducto.COMPRA_CARTERA}
                  checked={tipoProducto === TipoProducto.COMPRA_CARTERA}
                  className="sr-only"
                />
                <div className="text-sm font-medium">
                  {TEXTOS.TIPOS_PRODUCTO.COMPRA_CARTERA}
                </div>
              </button>
            </div>
          </div>
          
          {/* Monto solicitado */}
          <div>
            <Input
              type="number"
              label="Monto solicitado"
              placeholder="Ejemplo: 30000000"
              {...register('montoSolicitado', { valueAsNumber: true })}
              error={errors.montoSolicitado?.message}
            />
            <p className="text-sm text-gray-600 mt-2">
              💰 {formatCurrency(montoSolicitado || 0)}
            </p>
          </div>
          
          {/* Plazo */}
          <div>
            <Input
              type="number"
              label="Plazo (meses)"
              placeholder="Ejemplo: 36"
              {...register('plazoMeses', { valueAsNumber: true })}
              error={errors.plazoMeses?.message}
            />
            <p className="text-sm text-gray-600 mt-2">
              📅 {plazoMeses} meses ({Math.floor((plazoMeses || 0) / 12)} años)
            </p>
          </div>
          
          {/* Ingresos mensuales */}
          <div>
            <Input
              type="number"
              label="Ingresos mensuales"
              placeholder="Ejemplo: 5000000"
              {...register('ingresos', { valueAsNumber: true })}
              error={errors.ingresos?.message}
            />
            <p className="text-sm text-gray-600 mt-2">
              💵 {formatCurrency(ingresos || 0)} / mes
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Edad */}
            <Input
              type="number"
              label="Edad"
              placeholder="Ejemplo: 35"
              {...register('edad', { valueAsNumber: true })}
              error={errors.edad?.message}
            />
            
            {/* Tipo de empleo */}
            <Select
              label="Tipo de empleo"
              {...register('tipoEmpleo')}
              error={errors.tipoEmpleo?.message}
              options={[
                { value: TipoEmpleo.DEPENDIENTE, label: TEXTOS.TIPOS_EMPLEO.dependiente },
                { value: TipoEmpleo.INDEPENDIENTE, label: TEXTOS.TIPOS_EMPLEO.independiente },
                { value: TipoEmpleo.PENSIONADO, label: TEXTOS.TIPOS_EMPLEO.pensionado },
              ]}
            />
          </div>
          
          {/* Campos adicionales para compra de cartera */}
          {tipoProducto === TipoProducto.COMPRA_CARTERA && (
            <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900">Información de tu deuda actual</h4>
              
              <Input
                type="number"
                label="Deuda actual total"
                placeholder="Ejemplo: 20000000"
                {...register('deudaActual', { valueAsNumber: true })}
                error={errors.deudaActual?.message}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="number"
                  label="Cuota mensual actual"
                  placeholder="Ejemplo: 800000"
                  {...register('cuotaActual', { valueAsNumber: true })}
                  error={errors.cuotaActual?.message}
                />
                
                <Input
                  type="number"
                  step="0.01"
                  label="Tasa actual mensual (%)"
                  placeholder="Ejemplo: 2.5"
                  {...register('tasaActual', { valueAsNumber: true })}
                  error={errors.tasaActual?.message}
                />
              </div>
            </div>
          )}
          
          <Button
            type="submit"
            size="lg"
            fullWidth
            isLoading={isLoading}
          >
            🔍 Comparar Ofertas
          </Button>
          
          <p className="text-xs text-gray-500 text-center">
            Al comparar, aceptas nuestros términos y condiciones
          </p>
        </form>
      </CardContent>
    </Card>
  );
};
