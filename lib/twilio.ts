/**
 * Helper file to interact with Twilio REST API using native fetch.
 * This keeps the application lightweight by not requiring the 'twilio' package.
 */

export interface TwilioMessageOptions {
  to: string;
  body?: string;
  contentSid?: string;
  contentVariables?: Record<string, string>;
}

export async function sendWhatsAppMessage(options: TwilioMessageOptions) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    throw new Error('Twilio environment variables are not configured properly.');
  }

  // Ensure the 'to' number has the whatsapp: prefix
  const formattedTo = options.to.startsWith('whatsapp:') ? options.to : `whatsapp:${options.to}`;

  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

  // Create form-data for the Twilio API
  const formData = new URLSearchParams();
  formData.append('To', formattedTo);
  formData.append('From', fromNumber);
  
  if (options.contentSid) {
    formData.append('ContentSid', options.contentSid);
    if (options.contentVariables) {
      formData.append('ContentVariables', JSON.stringify(options.contentVariables));
    }
  } else if (options.body) {
    formData.append('Body', options.body);
  } else {
    throw new Error('Must provide either body or contentSid');
  }

  // Send request using native fetch with Basic Auth
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
    },
    body: formData.toString(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to send WhatsApp message');
  }

  return data;
}
