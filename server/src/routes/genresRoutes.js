import { Router} from 'express';

import { getAll, getOne } from '../controllers/genresController.js';

const router = Router();
// GET all genres
router.get('/', getAll); // GET http://localhost:3000/api/v1/geners
// GET genres by ID
router.get('/:id', getOne); // GET http://localhost:3000/api/v1/geners/:id
// POST create a new genre
// router.post('/', createGenre); // POST http://localhost:3000/api/v1/geners


export default router;