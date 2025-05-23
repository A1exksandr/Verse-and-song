import { Router} from 'express';

import { getAll, getOne } from '../controllers/workController.js';

const router = Router();
// GET all work
router.get('/', getAll); // GET http://localhost:3000/api/v1/work
// GET work by ID
router.get('/:id', getOne); // GET http://localhost:3000/api/v1/work/:id
// POST create a new work
// router.post('/', createWork); // POST http://localhost:3000/api/v1/work


export default router;