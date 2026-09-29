import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { config } from './config';
import { errorHandler } from './middleware/errorHandler';
import applicationsRouter from './routes/applications';
import { kafkaProducer } from './events/kafka';
import { prisma } from './utils/prisma';

async function bootstrap() {
  const app = express();

  // Basic middleware
  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  // Health check
  app.get('/health', async (req, res) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      res.json({
        status: 'ok',
        dependencies: {
          postgres: 'ok',
          kafka: 'ok',
        }
      });
    } catch (err) {
      res.status(503).json({
        status: 'error',
        dependencies: {
          postgres: 'error',
          kafka: 'unknown',
        }
      });
    }
  });

  // Routes
  app.use('/api/applications', applicationsRouter);

  // Global Error Handler
  app.use(errorHandler);

  try {
    await prisma.$connect();
    console.log('Database connected');

    await kafkaProducer.connect();
    console.log('Kafka connected');

    app.listen(config.PORT, () => {
      console.log(`Application Service running on port ${config.PORT}`);
    });
  } catch (error) {
    console.error('Failed to start application:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

bootstrap();
