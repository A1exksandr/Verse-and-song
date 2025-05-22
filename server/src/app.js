import express from 'express';
import cors from 'cors';
import authorRoutes from './routes/authorRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: '*',
}));
app.use(express.json());

// Routes
app.use('/api/v1/authors', authorRoutes); // GET http://localhost:3000/api/v1/authors
// app.use('/api/v1/works', worksRoutes);
// app.use('/api/v1/genres', genresRoutes);

export default app;
