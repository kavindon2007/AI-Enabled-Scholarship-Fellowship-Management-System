// Kafka Consumption and Production Mapping
import { Kafka, Producer, Consumer } from 'kafkajs';
import { env } from '../config';

export class DisbursementEvents {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;

  constructor() {
    this.kafka = new Kafka({
      clientId: 'disbursement-service',
      brokers: env.KAFKA_BROKERS.split(','),
    });
    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: 'disbursement-service-group' });
  }

  async connect() {
    await this.producer.connect();
    await this.consumer.connect();
  }

  async disconnect() {
    await this.producer.disconnect();
    await this.consumer.disconnect();
  }

  async publishDisbursementStatus(disbursementId: string, status: string) {
    await this.producer.send({
      topic: 'disbursement-status-updates',
      messages: [{ key: disbursementId, value: JSON.stringify({ disbursementId, status, timestamp: new Date().toISOString() }) }],
    });
  }

  async startListening() {
    await this.consumer.subscribe({ topic: 'application-approved', fromBeginning: true });
    
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        if (!message.value) return;
        const event = JSON.parse(message.value.toString());
        console.log(`Received event on ${topic}:`, event);
        // Handle application-approved logic (e.g., triggering disbursement)
      },
    });
  }
}
