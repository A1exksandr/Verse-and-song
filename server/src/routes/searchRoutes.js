import { Router } from 'express';

import * as searchController from '../controllers/searchController.js';
const router = Router();

router.get('/', searchController.search); // GET http://localhost:3000/api/v1/search?q=Пушкин

export default router;