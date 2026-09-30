import type { APIRoute } from 'astro';

export const prerender = false;

const MAX_NAME_LENGTH = 120;
const MAX_EMAIL_LENGTH = 254;
const MAX_SUBJECT_LENGTH = 80;
const MAX_MESSAGE_LENGTH = 4000;

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
  website?: unknown;
};

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });

function textField(value: unknown, maxLength: number): string {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return entities[character];
  });
}

export const POST: APIRoute = async ({ request, locals }) => {
  if (request.headers.get('content-type')?.toLowerCase().includes('application/json') !== true) {
    return json({ code: 'INVALID_CONTENT_TYPE', message: 'Request must be JSON.' }, 415);
  }

  let payload: ContactPayload;
  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return json({ code: 'INVALID_JSON', message: 'Request body is not valid JSON.' }, 400);
  }

  if (textField(payload.website, 200)) {
    return json({ code: 'SPAM_REJECTED', message: 'Message rejected.' }, 400);
  }

  const name = textField(payload.name, MAX_NAME_LENGTH);
  const email = textField(payload.email, MAX_EMAIL_LENGTH);
  const subject = textField(payload.subject, MAX_SUBJECT_LENGTH);
  const message = textField(payload.message, MAX_MESSAGE_LENGTH);

  if (!name || !subject || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({
      code: 'INVALID_INPUT',
      message: 'Please provide a valid name, email, subject, and message.',
    }, 422);
  }

  const runtime = (locals as { runtime?: { env?: Record<string, string | undefined> } }).runtime;
  const env = runtime?.env ?? {};
  const apiKey = env.RESEND_API_KEY;
  const from = env.RESEND_FROM_EMAIL;
  const recipient = env.SUPPORT_EMAIL;

  if (!apiKey || !from || !recipient) {
    console.error('Contact email is not configured. Required: RESEND_API_KEY, RESEND_FROM_EMAIL, SUPPORT_EMAIL');
    return json({ code: 'EMAIL_NOT_CONFIGURED', message: 'Email service is temporarily unavailable.' }, 503);
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br />');

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [recipient],
        reply_to: email,
        subject: `[SaveFileTool Contact] ${subject}`,
        html: `<h2>${safeSubject}</h2><p><strong>Name:</strong> ${safeName}</p><p><strong>Email:</strong> ${safeEmail}</p><hr /><p>${safeMessage}</p>`,
      }),
    });

    if (!response.ok) {
      const providerError = await response.text();
      console.error('Resend contact email failed:', response.status, providerError);
      return json({ code: 'EMAIL_PROVIDER_ERROR', message: 'Message could not be sent.' }, 502);
    }

    return json({ code: 'SENT', message: 'Message sent successfully.' });
  } catch (error) {
    console.error('Contact email request failed:', error);
    return json({ code: 'EMAIL_SEND_FAILED', message: 'Message could not be sent.' }, 502);
  }
};
