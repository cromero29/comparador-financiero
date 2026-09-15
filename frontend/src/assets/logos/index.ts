// Logos de entidades financieras
import bancolombia from './bancolombia.svg';
import davivienda from './davivienda.svg';
import bbva from './bbva.svg';
import bancoBogota from './banco-bogota.svg';
import rappipay from './rappipay.svg';
import addi from './addi.svg';
import lineru from './lineru.svg';
import coofinep from './coofinep.svg';
import cajaSocial from './caja-social.svg';
import popular from './popular.svg';
import itau from './itau.svg';
import bancoomeva from './bancoomeva.svg';
import occidente from './occidente.svg';
import coomultrasan from './coomultrasan.svg';

// Mapeo de códigos de entidad a logos
export const LOGOS: Record<string, string> = {
  'BANCOLOMBIA': bancolombia,
  'DAVIVIENDA': davivienda,
  'BBVA': bbva,
  'BANCO_BOGOTA': bancoBogota,
  'RAPPIPAY': rappipay,
  'ADDI': addi,
  'LINERU': lineru,
  'COOFINEP': coofinep,
  'CAJA_SOCIAL': cajaSocial,
  'POPULAR': popular,
  'ITAU': itau,
  'BANCOOMEVA': bancoomeva,
  'OCCIDENTE': occidente,
  'COOMULTRASAN': coomultrasan,
};

// Función helper para obtener logo por código
export const getLogo = (codigo: string): string | undefined => {
  return LOGOS[codigo];
};
