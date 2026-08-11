import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './frameWork/routes/authRoutes';
import { errorHandler } from './adapters/middlewares/error/errorMiddleware';

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'FoodFlow Backend API is running smoothly',
    timestamp: new Date()
  });
});

// API Routes
app.use('/api/auth', authRoutes);

// Centralized Error Handling Middleware
app.use(errorHandler);

export default app;
