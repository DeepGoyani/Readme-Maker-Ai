import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase } from './database.js';

// Routes
import authRoutes from './routes/auth.js';
import reposRoutes from './routes/repos.js';
import generateRoutes from './routes/generate.js';
import readmesRoutes from './routes/readmes.js';
import healthRoutes from './routes/health.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Initialize database and start server
async function startServer() {
  try {
    await initDatabase();
    console.log('Database connected successfully');

    // Routes
    app.use('/api/health', healthRoutes);
    app.use('/api/auth', authRoutes);
    app.use('/api/repos', reposRoutes);
    app.use('/api/generate', generateRoutes);
    app.use('/api/readmes', readmesRoutes);

    // Error handling
    app.use((err, req, res, next) => {
      console.error('Error:', err);
      res.status(500).json({ 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    });

    // 404 handler
    app.use((req, res) => {
      res.status(404).json({ error: 'Endpoint not found' });
    });

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:8080'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
