import { SfmsEvent, KAFKA_TOPICS } from '@ai-sfms/shared-types';

export class KafkaProducer {
  async connect() {
    // Mock connection
  }

  async disconnect() {
    // Mock disconnection
  }

  async publish(topic: string, event: SfmsEvent) {
    // In a real implementation this would serialize to JSON and send to the cluster.
    console.log(`[KafkaProducer] Published to ${topic}:`, event.eventId);
  }
}

export const kafkaProducer = new KafkaProducer();
