import { Router} from 'express';

import { getAll, getOne } from '../controllers/authorController.js';

const router = Router();
// GET all authors
router.get('/', getAll); // GET http://localhost:3000/api/v1/authors
// GET author by ID
router.get('/:id', getOne); // GET http://localhost:3000/api/v1/authors/:id
// POST create a new author
// router.post('/', createAuthor); // POST http://localhost:3000/api/v1/authors


export default router;