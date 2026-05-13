require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

async function run() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error('Keys missing');
    return;
  }

  console.log('Connecting to Supabase...');
  const supabase = createClient(url, key);

  const { data, error } = await supabase
    .from('users')
    .upsert({ phone: 'whatsapp:+911234567890', consent: true }, { onConflict: 'phone' });

  if (error) {
    console.error('Failed to save:', error);
  } else {
    console.log('Successfully saved test user!', data);
  }
}

run();
