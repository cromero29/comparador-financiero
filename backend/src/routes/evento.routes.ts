import { Router } from 'express';
import { EventoController } from '@controllers/EventoController';

const router = Router();
const controller = new EventoController();

router.post('/registrar', controller.registrarEvento.bind(controller));

export default router;
