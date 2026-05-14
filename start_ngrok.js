const ngrok = require('@ngrok/ngrok');
const fs = require('fs');

async function run() {
  try {
    console.log('Authenticating with Ngrok...');
    
    // Connect to Ngrok
    const listener = await ngrok.forward({
      addr: 3000,
      authtoken: '3DJ2srA3d7GWddt7A3VhLBqU8fo_7QZAmWBkSwPfkxgDMXrgE'
    });

    const url = listener.url();
    console.log('Ngrok started securely at:', url);

    // Update .env.local
    let envContent = fs.readFileSync('.env.local', 'utf8');
    
    // Remove existing NEXT_PUBLIC_BASE_URL if it exists
    envContent = envContent.replace(/^NEXT_PUBLIC_BASE_URL=.*$/m, '');
    
    // Add new URL
    envContent += `\nNEXT_PUBLIC_BASE_URL=${url}\n`;
    
    // Clean up extra newlines
    envContent = envContent.replace(/\n{3,}/g, '\n\n');
    
    fs.writeFileSync('.env.local', envContent.trim() + '\n');
    console.log('Successfully injected NEXT_PUBLIC_BASE_URL into .env.local!');
    
    console.log('\n[INFO] Ngrok process is running in the background. Leave this process alive.');
    
    // Keep process alive indefinitely
    process.stdin.resume();
  } catch (err) {
    console.error('Error starting Ngrok:', err);
  }
}

run();
