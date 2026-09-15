import { Router } from 'express';
import { ClicController } from '@controllers/ClicController';

const router = Router();
const controller = new ClicController();

router.post('/registrar', controller.registrarClic.bind(controller));

export default router;
