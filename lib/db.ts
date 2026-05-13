import { config } from 'dotenv';
config({ path: '.env.local' });

/**
 * Saves a user and their consent status into the database.
 * If the user already exists (by phone), updates their consent.
 */
export async function saveUser(phone: string, consent: boolean) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.warn('Supabase URL or Key is not set. Skipping saveUser.');
    return;
  }

  const endpoint = `${url}/rest/v1/users`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation, resolution=merge-duplicates'
      },
      body: JSON.stringify({ phone, consent })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Supabase API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log(`Saved user ${phone} with consent: ${consent}`);
    return data[0];
  } catch (error) {
    console.error('Database error in saveUser:', error);
    throw error;
  }
}

// Keep a dummy pool export in case other files import it
export default {};
