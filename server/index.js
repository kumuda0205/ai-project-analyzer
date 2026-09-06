import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import healthRouter from './routes/health.js';
import analyzeRouter from './routes/analyze.js';

// Load environment variables from .env file
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register API Routes
app.use('/api', healthRouter);
app.use('/api', analyzeRouter);

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('[Unhandled Express Error]', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 AI Project Analyzer Backend Server running on port ${PORT}`);
  console.log(`   Health check endpoint: http://localhost:${PORT}/api/health`);
  console.log(`   Analyze endpoint:      http://localhost:${PORT}/api/projects/analyze`);
  console.log(`=======================================================`);
});
