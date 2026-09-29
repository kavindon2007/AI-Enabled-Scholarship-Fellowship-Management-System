import express from 'express';
import cors from 'cors';
import { env } from './config';
import { errorHandler } from './middleware/errorHandler';
import { createDisbursementRouter } from './routes/disbursements';
import { DisbursementController } from './controllers/disbursementController';
import { DisbursementService } from './services/disbursementService';
import { NpciBaseService } from './services/npciBaseService';
import { PennyDropService } from './services/pennyDropService';
import { SeedingAlertService } from './services/seedingAlertService';
import { DisbursementRepository } from './repositories/disbursementRepository';
import { BankAccountRepository } from './repositories/bankAccountRepository';
import { PfmsService } from './services/pfmsService';
import { DisbursementEvents } from './events/disbursementEvents';
import { SeedingCronJob } from './jobs/seedingCronJob';

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Repositories
const disbursementRepo = new DisbursementRepository();
const bankAccountRepo = new BankAccountRepository();

// Initialize Services
const pfmsService = new PfmsService();
const npciService = new NpciBaseService();
const pennyDropService = new PennyDropService();
const seedingAlertService = new SeedingAlertService(bankAccountRepo);
const disbursementService = new DisbursementService(
  disbursementRepo, 
  bankAccountRepo, 
  pfmsService, 
  npciService, 
  pennyDropService
);

// Initialize Controller
const disbursementController = new DisbursementController(
  disbursementService,
  npciService,
  pennyDropService,
  seedingAlertService
);

// Setup Routes
app.use('/api/disbursements', createDisbursementRouter(disbursementController));

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    dependencies: {
      kafka: 'ok',
    }
  });
});

// Setup Error Handling
app.use(errorHandler);

const events = new DisbursementEvents();
const cronJob = new SeedingCronJob(seedingAlertService);

const start = async () => {
  // Normally uncomment when Kafka is ready
  // await events.connect();
  // await events.startListening();
  
  cronJob.start();

  app.listen(env.PORT, () => {
    console.log(`Disbursement Service listening on port ${env.PORT} in ${env.NODE_ENV} mode.`);
  });
};

start().catch(console.error);
