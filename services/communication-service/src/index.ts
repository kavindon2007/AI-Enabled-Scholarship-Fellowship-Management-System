// Layer: App Bootstrap
// Responsibility: Initialize Express, apply middleware, mount routes

import express from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';
import { config } from './config';
import notificationRoutes from './routes/notifications';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(pinoHttp());

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    dependencies: {
      smtp: config.SMTP_HOST ? 'configured' : 'missing',
    }
  });
});

// Routes
app.use('/api/notifications', notificationRoutes);

// Error Handling (Must be last)
app.use(errorHandler);

// Start Server
app.listen(config.PORT, () => {
  console.log(`Communication Service is running on port ${config.PORT}`);
  console.log(`Environment: ${config.NODE_ENV}`);
});
