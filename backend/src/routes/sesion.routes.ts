import { Router } from 'express';
import { SesionController } from '@controllers/SesionController';

const router = Router();
const controller = new SesionController();

router.post('/iniciar', controller.iniciarSesion.bind(controller));

export default router;
