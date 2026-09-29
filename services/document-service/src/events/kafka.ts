// Layer: Events (Infrastructure)
// Responsibility: Kafka producers and consumers initialization

import { Kafka, Producer } from 'kafkajs';
import { config } from '../config/index.js';

let producer: Producer | null = null;

const kafka = new Kafka({
  clientId: config.KAFKA_CLIENT_ID,
  brokers: config.KAFKA_BROKERS,
});

export async function getProducer(): Promise<Producer> {
  if (!producer) {
    producer = kafka.producer();
    await producer.connect();
    console.log('✅ Connected to Kafka Producer');
  }
  return producer;
}

export async function disconnectProducer(): Promise<void> {
  if (producer) {
    await producer.disconnect();
    producer = null;
  }
}
