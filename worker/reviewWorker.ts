import { Worker } from 'bullmq';
import { connection } from '../lib/redis.js';
import { sendWhatsAppMessage } from '../lib/twilio.js';

// Load environment variables for the standalone script
import 'dotenv/config';

console.log('Starting Review Worker...');

const worker = new Worker(
  'review-queue',
  async (job) => {
    const { phone } = job.data;
    console.log(`[Worker] Processing review job ${job.id} for phone ${phone}`);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.REVIEW_URL || 'http://localhost:3000';
    const reviewUrl = `${baseUrl}/review?phone=${encodeURIComponent(phone)}`;
    const reviewMessage = `😊 Hope you enjoyed! \nPlease review us: \n${reviewUrl}`;

    try {
      // Send the review request via WhatsApp using our existing helper
      await sendWhatsAppMessage({ to: phone, body: reviewMessage });
      console.log(`[Worker] Successfully sent review message to ${phone}`);
    } catch (error) {
      console.error(`[Worker] Failed to send review message to ${phone}:`, error);
      throw error; // Let BullMQ handle retries if configured
    }
  },
  { connection }
);

worker.on('completed', (job) => {
  console.log(`[Worker] Job ${job.id} has completed!`);
});

worker.on('failed', (job, err) => {
  console.error(`[Worker] Job ${job?.id} has failed with ${err.message}`);
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('Closing worker gracefully...');
  await worker.close();
  process.exit(0);
});
