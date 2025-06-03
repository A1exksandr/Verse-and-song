import express from 'express';
import cors from 'cors';
import path from 'path';
import expressLayouts from 'express-ejs-layouts';
import pageRoutes from './routes/pageRoutes.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 3000;
const app = express();

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Static files
app.use(express.static(path.join(__dirname, '../public'))); // Serve static files from the 'public' directory


app.use('/', pageRoutes); // GET http://localhost:3000/ ---> ejs response


app.use('/authors', pageRoutes); // GET http://localhost:3000/authors ---> ejs response

//GET genres
app.use('/genres', pageRoutes); // GET http://localhost:3000/genres ---> ejs response

// GET раздел об авторе
app.use('/about', pageRoutes); // GET http://localhost:3000/about ---> ejs response

export default app;
