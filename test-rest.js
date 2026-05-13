require('dotenv').config({ path: '.env.local' });

async function run() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  console.log('URL:', url);
  console.log('Key starts with:', key.substring(0, 15));

  const endpoint = `${url}/rest/v1/users`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'apikey': key,
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation, resolution=merge-duplicates'
    },
    body: JSON.stringify({ phone: '+1234567890', consent: true })
  });

  const text = await response.text();
  console.log('Status:', response.status);
  console.log('Response:', text);
}

run();
