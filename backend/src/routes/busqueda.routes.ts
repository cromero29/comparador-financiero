import { Router } from 'express';
import { BusquedaController } from '@controllers/BusquedaController';

const router = Router();
const controller = new BusquedaController();

router.post('/registrar', controller.registrarBusqueda.bind(controller));
router.post('/engagement', controller.actualizarEngagement.bind(controller));

export default router;
