import { NextResponse } from 'next/server';
import { sendWhatsAppMessage } from '@/lib/twilio';

/**
 * Send Message API: /api/send
 * Accepts a JSON body and sends a WhatsApp message.
 * Supports both standard body messages and Twilio Content Templates (ContentSid).
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, message, contentSid, contentVariables } = body;

    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }
    
    const result = await sendWhatsAppMessage({ 
      to: phone, 
      body: message || (!contentSid ? "Hello! This is a test message from our Next.js App using Twilio." : undefined),
      contentSid: contentSid,
      contentVariables: contentVariables
    });

    return NextResponse.json({ success: true, messageId: result.sid }, { status: 200 });
  } catch (error: any) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: error.message || 'Failed to send message' }, { status: 500 });
  }
}
