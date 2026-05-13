import { config } from 'dotenv';
config({ path: '.env.local' });
import Redis from 'ioredis';

// ioredis is recommended by BullMQ for robust connection handling
const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

// Configure Redis connection
// We use maxRetriesPerRequest: null because BullMQ strictly requires it.
export const connection = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
  tls: redisUrl.startsWith('rediss://') ? { rejectUnauthorized: false } : undefined,
});

connection.on('error', (err) => {
  console.error('Redis connection error:', err);
});
