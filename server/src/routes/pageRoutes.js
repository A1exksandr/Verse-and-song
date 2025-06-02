
import { Router } from 'express'

import * as pageController from '../controllers/pageController.js'
const router = Router()

router.get('/', pageController.getHomePage); // GET http://localhost:3000/

router.get('/authors', pageController.getAuthorsPage); // GET http://localhost:3000/authors
router.get('/genres', pageController.getGenresPage); // GET http://localhost:3000/genres

router.get('/about', pageController.getAboutPage); // GET http://localhost:3000/about

export default router;