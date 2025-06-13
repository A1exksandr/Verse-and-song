
import { Router } from 'express'

import * as pageController from '../controllers/pageController.js'
const router = Router()

router.get('/', pageController.getHomePage); // GET http://localhost:3000/

router.get('/authors', pageController.getAuthorsPage); // GET http://localhost:3000/authors
router.get('/authors/:id', pageController.getAuthorPage) // GET http://localhost:3000/authors/683dd2abff2e924c9d2c1a0d

router.get('/genres', pageController.getGenresPage); // GET http://localhost:3000/genres

 router.get('/about', pageController.getAboutPage); // GET http://localhost:3000/about

 router.get('/works/:id', pageController.getWorkPage); // GET http://localhost:3000/works/:id

export default router;