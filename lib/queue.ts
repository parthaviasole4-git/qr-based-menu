import { config } from 'dotenv';
config({ path: '.env.local' });
import { Queue } from 'bullmq';
import { connection } from './redis';

// Create the Review Queue instance
export const reviewQueue = new Queue('review-queue', { connection });

/**
 * Adds a new job to the review queue to be processed after the specified delay.
 * 
 * @param phone The WhatsApp number to send the review to
 * @param delay The delay in milliseconds
 */
export async function addReviewJob(phone: string, delay: number) {
  if (!process.env.REDIS_URL) {
    console.warn('REDIS_URL is not set. Skipping addReviewJob.');
    return;
  }

  // Add the job to the queue
  await reviewQueue.add(
    'send-review',
    { phone },
    { delay } // BullMQ will wait this many milliseconds before processing
  );
  
  console.log(`Added review job for ${phone} with a delay of ${delay}ms`);
}
