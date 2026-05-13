const { Pool } = require('pg');

const regions = [
  'ap-south-1',
  'us-east-1',
  'ap-southeast-1',
  'eu-central-1',
  'eu-west-1',
  'eu-west-2',
  'ap-northeast-1',
  'ap-southeast-2',
  'ca-central-1',
  'sa-east-1',
  'us-west-1',
  'us-west-2'
];

async function testConnection() {
  for (const region of regions) {
    const url = `postgresql://postgres.iajokzidyommxwjhhhcp:Parthm%401234567@aws-0-${region}.pooler.supabase.com:6543/postgres`;
    const pool = new Pool({ connectionString: url, ssl: { rejectUnauthorized: false } });
    try {
      console.log(`Testing region ${region}...`);
      await pool.query('SELECT 1');
      console.log(`✅ SUCCESS! The correct region is ${region}`);
      process.exit(0);
    } catch (e) {
      // ignore
    }
    await pool.end();
  }
  console.log('❌ Failed all regions');
}

testConnection();
