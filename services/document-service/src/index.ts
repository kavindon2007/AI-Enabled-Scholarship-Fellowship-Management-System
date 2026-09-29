// Layer: App Bootstrap
// Responsibility: Initialize Express, apply global middleware, mount routes.

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { pino } from 'pino';
import rateLimit from 'express-rate-limit';

import { config } from './config/index.js';
import documentRoutes from './routes/documents.js';
import { errorHandler } from './middleware/errorHandler.js';
import { disconnectProducer } from './events/kafka.js';

const app = express();
const logger = pino();

// Security and utility middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    dependencies: {
      minio: 'ok', // In real app, ping minio
      kafka: 'ok', // In real app, check kafka connection
    }
  });
});

// Mount Routes
app.use('/api/documents', documentRoutes);

// Global Error Handler
app.use(errorHandler);

const server = app.listen(config.PORT, () => {
  logger.info(`✅ Document Service running on port ${config.PORT}`);
});

// Graceful shutdown
const shutdown = async () => {
  logger.info('Shutting down gracefully...');
  server.close(async () => {
    logger.info('HTTP server closed.');
    await disconnectProducer();
    process.exit(0);
  });
  
  // Force shutdown
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
