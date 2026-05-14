const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function fixDatabase() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to database...');

    // Add rating column if it doesn't exist
    await client.query(`
      ALTER TABLE public.users
      ADD COLUMN IF NOT EXISTS rating INT;
    `);
    console.log('Added rating column');

    // Add comment column if it doesn't exist
    await client.query(`
      ALTER TABLE public.users
      ADD COLUMN IF NOT EXISTS comment TEXT;
    `);
    console.log('Added comment column');

    // Also force a schema cache reload for PostgREST by notifying
    await client.query('NOTIFY pgrst, \'reload schema\'');
    console.log('Reloaded PostgREST schema cache');

    console.log('Database successfully fixed!');
  } catch (err) {
    console.error('Error fixing database:', err);
  } finally {
    await client.end();
  }
}

fixDatabase();
