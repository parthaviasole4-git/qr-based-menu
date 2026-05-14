import { NextResponse } from 'next/server';
import { sendWhatsAppMessage } from '@/lib/twilio';
import { saveUser } from '@/lib/db';
import { addReviewJob } from '@/lib/queue';

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

    if (!from || !body) {
      return NextResponse.json({ error: 'Missing From or Body in request' }, { status: 400 });
    }

    console.log(`[Webhook] Incoming message from ${from}: ${body}`);

    // Detect consent: if message contains 'no-promo', user opted out
    const hasConsent = !body.toLowerCase().includes('no-promo');

    // 1. Save user to database (wrapped in try/catch so DB timeouts don't break the bot)
    try {
      await saveUser(from, hasConsent);
    } catch (dbError) {
      console.error('[Webhook] Database save failed (IPv6 timeout?), continuing to send menu:', dbError);
    }

    // 2. Automatically send the menu message
    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') || host.includes('172.20') ? 'http' : 'https';
    const menuUrl = process.env.MENU_URL || `${protocol}://${host}`;
    
    const replyMessage = `Hi 👋\nHere’s our menu:\n${menuUrl}`;
    await sendWhatsAppMessage({ to: from, body: replyMessage });

    // 3. Add a delayed review job
    try {
      const delayMs = parseInt(process.env.REVIEW_DELAY_MS || '60000', 10);
      await addReviewJob(from, delayMs);
    } catch (queueError) {
      console.error('[Webhook] Failed to queue review job:', queueError);
    }

    // Return empty TwiML since we already replied asynchronously
    return new NextResponse('<?xml version="1.0" encoding="UTF-8"?><Response></Response>', {
      status: 200,
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  } catch (error) {
    console.error('[Webhook] Error handling webhook:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
