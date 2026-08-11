import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './frameWork/routes/authRoutes';
import donationRoutes from './frameWork/routes/donationRoutes';
import lotRoutes from './frameWork/routes/lotRoutes';
import aiRoutes from './frameWork/routes/aiRoutes';
import recipientRoutes from './frameWork/routes/recipientRoutes';
import distributionRoutes from './frameWork/routes/distributionRoutes';
import reportRoutes from './frameWork/routes/reportRoutes';
import notificationRoutes from './frameWork/routes/notificationRoutes';
import warehouseRoutes from './frameWork/routes/warehouseRoutes';
import auditRoutes from './frameWork/routes/auditRoutes';
import { errorHandler } from './adapters/middlewares/error/errorMiddleware';

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

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
app.use('/api/donations', donationRoutes);
app.use('/api/lots', lotRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/recipients', recipientRoutes);
app.use('/api/distributions', distributionRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/warehouses', warehouseRoutes);
app.use('/api/audit', auditRoutes);

// Centralized Error Handling Middleware
app.use(errorHandler);

export default app;
