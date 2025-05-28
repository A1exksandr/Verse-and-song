
import { Router } from 'express'

import * as pageController from '../controllers/pageController.js'
const router = Router()

router.get('/', pageController.getHomePage); // GET http://localhost:3000/

export default router;