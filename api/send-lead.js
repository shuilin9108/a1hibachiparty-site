/**
 * Native lead-capture endpoint for A1 Hibachi Party.
 *
 * Submitted from the quick-lead form on book-online.html. Keeps conversions
 * on a1hibachiparty.com so AW-18076137033 fires reliably.
 *
 * Required env var on Vercel: RESEND_API_KEY
 */
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Everyone who should see a new A1 lead.
// TODO: replace shuilin9108@gmail.com with the real A1 owner + operations
// emails when ready. shuilin9108@gmail.com is ShuiLink ops fallback so leads
// don't go silent in the meantime.
const LEAD_RECIPIENTS = [
  'shuilin9108@gmail.com',
  'leads@shuilink.com',
];

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isString(v) {
  return typeof v === 'string' && v.trim().length > 0;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    name = '',
    phone = '',
    email = '',
    date = '',
    guests = '',
    city = '',
    source = 'a1hibachiparty.com/book-online native form',
  } = req.body || {};

  if (!isString(name) || !isString(phone)) {
    return res.status(400).json({
      error: 'Missing required field',
      detail: 'name and phone are required',
    });
  }

  const safe = {
    name: escapeHtml(name),
    phone: escapeHtml(phone),
    email: escapeHtml(email),
    date: escapeHtml(date),
    guests: escapeHtml(guests),
    city: escapeHtml(city),
    source: escapeHtml(source),
  };

  try {
    const replyTo = isString(email) ? email : undefined;
    const { data, error } = await resend.emails.send({
      from: 'A1 Hibachi Party <leads@shuilink.com>',
      to: LEAD_RECIPIENTS,
      ...(replyTo && { reply_to: replyTo }),
      subject: `🔥 New A1 Hibachi Lead — ${name}`,
      html: `
        <h2>New Booking Lead — A1 Hibachi Party</h2>
        <p>Submitted from the native quick-lead form on book-online.html.
        Treat as a real lead — follow up within 1 hour for best conversion.</p>
        <table cellspacing="0" cellpadding="6" border="1" style="border-collapse:collapse;font-family:Arial,sans-serif">
          <tr><td><strong>Name</strong></td><td>${safe.name}</td></tr>
          <tr><td><strong>Phone</strong></td><td>${safe.phone}</td></tr>
          <tr><td><strong>Email</strong></td><td>${safe.email || '(not provided)'}</td></tr>
          <tr><td><strong>Event date</strong></td><td>${safe.date || '(not provided)'}</td></tr>
          <tr><td><strong>Guest count</strong></td><td>${safe.guests || '(not provided)'}</td></tr>
          <tr><td><strong>City</strong></td><td>${safe.city || '(not provided)'}</td></tr>
          <tr><td><strong>Source</strong></td><td>${safe.source}</td></tr>
          <tr><td><strong>Submitted</strong></td><td>${new Date().toLocaleString('en-US', {
            timeZone: 'America/New_York',
            dateStyle: 'medium',
            timeStyle: 'short',
          })} ET</td></tr>
        </table>
        <p style="margin-top:16px;color:#666">Source: ShuiLink native quick-lead form.</p>
      `,
    });

    if (error) {
      console.error('Resend rejected the send:', error);
      return res.status(502).json({
        error: 'Email provider rejected the message',
        detail: error,
      });
    }

    return res.status(200).json({ ok: true, message_id: data?.id });
  } catch (err) {
    console.error('send-lead exception', err);
    return res.status(500).json({
      error: 'Failed to send lead email',
      detail: err instanceof Error ? err.message : String(err),
    });
  }
}
