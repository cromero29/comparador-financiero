import { Router } from 'express';
import { ProductoController } from '../controllers/ProductoController';

const router = Router();
const controller = new ProductoController();

// GET /api/v1/productos - Obtener todos los productos
router.get('/', controller.getAll);

// GET /api/v1/productos/estadisticas - Estadísticas
router.get('/estadisticas', controller.getEstadisticas);

// GET /api/v1/productos/tipo/:tipo - Productos por tipo
router.get('/tipo/:tipo', controller.getByTipo);

// GET /api/v1/productos/:id - Producto por ID
router.get('/:id', controller.getById);

export { router as productoRoutes };
