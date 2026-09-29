import cron from 'node-cron';
import { SeedingAlertService } from '../services/seedingAlertService';

export class SeedingCronJob {
  constructor(private seedingAlertService: SeedingAlertService) {}

  start() {
    // Run exactly at 00:00 every day
    cron.schedule('0 0 * * *', async () => {
      try {
        console.log('Starting daily seeding pre-failure check...');
        await this.seedingAlertService.checkPreFailureAlerts();
        console.log('Finished daily seeding pre-failure check.');
      } catch (error) {
        console.error('Error during daily seeding check:', error);
      }
    });
  }
}
