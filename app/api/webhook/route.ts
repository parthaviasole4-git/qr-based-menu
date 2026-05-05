import { NextResponse } from 'next/server';
import { sendWhatsAppMessage } from '@/lib/twilio';

/**
 * Webhook API: /api/webhook
 * Handles incoming WhatsApp messages from Twilio.
 */
export async function POST(request: Request) {
  try {
    // Twilio sends data as application/x-www-form-urlencoded
    const text = await request.text();
    const formData = new URLSearchParams(text);

    // Extract the sender's WhatsApp number and the message content
    const from = formData.get('From');
    const body = formData.get('Body');

    // 1. Log the extracted values as requested
    console.log('--- Incoming WhatsApp Message ---');
    console.log(`From: ${from}`);
    console.log(`Body: ${body}`);
    console.log('---------------------------------');

    if (!from || !body) {
      return NextResponse.json({ error: 'Missing From or Body in request' }, { status: 400 });
    }

    // 2. Automatically send a reply message back to the same number
    const replyMessage = `Hi 👋\nHere’s our menu:\nhttps://yourmenu.com`;
    
    // Using our helper to send the reply
    await sendWhatsAppMessage({ to: from, body: replyMessage });

    // 3. Return a valid response to Twilio
    // We return empty TwiML since we already replied asynchronously
    return new NextResponse('<?xml version="1.0" encoding="UTF-8"?><Response></Response>', {
      status: 200,
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  } catch (error) {
    console.error('Error handling webhook:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
