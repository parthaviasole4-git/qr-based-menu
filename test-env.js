import { config } from 'dotenv';
const result = config({ path: '.env.local' });
console.log('Dotenv result:', result);
console.log('REDIS_URL:', process.env.REDIS_URL);
