// Serverless endpoint for The Holistic application forms.
// Sends the full application to the owner (reply-to = applicant) and a
// branded confirmation to the applicant. Runs on Vercel (Node runtime).
//
// Required env vars (set in Vercel project settings, NEVER in code/git):
//   RESEND_API_KEY   - Resend API key for theholistic.io
//   APPLY_TO         - owner inbox (e.g. claudiu@claudiucraciun.com)
//   APPLY_FROM       - verified sender (e.g. "The Holistic <applications@theholistic.io>")
//   APPLY_SECRET     - optional HMAC key for the form token; falls back to
//                      RESEND_API_KEY so no new env var is required.

import { createHmac } from 'node:crypto';

// Shared-Resend-account rule: every send is tagged project=theholistic so
// sibling businesses' webhook gates can identify (and ignore) our events.
const PROJECT_TAG = { name: 'project', value: 'theholistic' };

const FIELD_LABELS = {
  // Amazonian
  name: 'Name',
  email: 'Email',
  location: 'Where they are based',
  work: 'The work they do in the world',
  calling: 'What led them here',
  experience: 'Prior experience',
  timing: 'Timing',
  health: 'Health context (confidential)',
  // Clarity
  focus: 'What they are carrying',
  prior: 'Worked with a guide, coach, or mentor before',
  situation: 'The situation, in their words',
};

const FORM_TITLES = {
  amazonian: 'Traditional Amazonian Diets',
  clarity: 'Clarity Session',
};

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function fmtValue(v) {
  if (Array.isArray(v)) return v.length ? v.join(', ') : '—';
  const s = (v == null ? '' : String(v)).trim();
  return s.length ? s : '—';
}

function buildOwnerHtml(formKey, data) {
  const title = FORM_TITLES[formKey] || 'Application';
  const name = (data.name || '').trim();
  const email = (data.email || '').trim();

  const bodyKeys = Object.keys(data).filter(
    (k) => k !== 'form' && k !== '_gotcha' && k !== '_t' && k !== '_sig' && k !== 'name' && k !== 'email'
  );

  const rows = bodyKeys.map((k) => {
    const label = FIELD_LABELS[k] || k;
    const val = esc(fmtValue(data[k])).replace(/\n/g, '<br>');
    return `<p style="margin:0 0 16px;">
        <strong style="display:block;font-size:13px;color:#666;font-weight:600;margin-bottom:2px;">${esc(label)}</strong>
        <span style="font-size:15px;color:#222;line-height:1.5;">${val}</span>
      </p>`;
  }).join('');

  // Plain, fast-to-scan layout — this email is only ever read by the owner.
  return `<!doctype html><html><body style="margin:0;background:#fff;">
    <div style="max-width:560px;margin:0 auto;padding:28px 24px;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
      <p style="margin:0 0 2px;font-size:13px;color:#888;">New ${esc(title)} application</p>
      <p style="margin:0;font-size:20px;font-weight:600;color:#111;">${esc(name) || 'Someone'}</p>
      <p style="margin:2px 0 20px;"><a href="mailto:${esc(email)}" style="font-size:15px;color:#0a66c2;text-decoration:none;">${esc(email)}</a></p>
      <hr style="border:none;border-top:1px solid #eee;margin:0 0 20px;">
      ${rows}
      <p style="margin:20px 0 0;font-size:13px;color:#999;">Just hit reply — it goes straight to ${esc(email) || 'the applicant'}.</p>
    </div>
  </body></html>`;
}

function buildOwnerText(formKey, data) {
  const title = FORM_TITLES[formKey] || 'Application';
  const lines = [`NEW APPLICATION — ${title}`, ''];
  Object.keys(data)
    .filter((k) => k !== 'form' && k !== '_gotcha' && k !== '_t' && k !== '_sig')
    .forEach((k) => {
      lines.push(`${FIELD_LABELS[k] || k}:`);
      lines.push(fmtValue(data[k]));
      lines.push('');
    });
  lines.push('— Reply to this email to respond directly to the applicant.');
  return lines.join('\n');
}

const REPLY_WINDOW = { amazonian: 'within 48 hours', clarity: 'within 48 hours' };

function buildApplicantHtml(formKey, name) {
  const title = FORM_TITLES[formKey] || 'your application';
  const window = REPLY_WINDOW[formKey] || 'soon';
  const first = (name || '').trim().split(/\s+/)[0] || 'there';
  return `<!doctype html><html><body style="margin:0;background:#0e0c0a;padding:24px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#14110d;border:1px solid #2a251d;border-radius:12px;overflow:hidden;">
      <tr><td style="padding:30px 30px 8px;">
        <div style="font:600 12px/1 -apple-system,Segoe UI,Inter,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#c9a35b;">The Holistic</div>
      </td></tr>
      <tr><td style="padding:6px 30px 26px;">
        <h1 style="margin:0 0 16px;font:500 24px/1.3 Georgia,'Times New Roman',serif;color:#f3eee2;">Your application is in, ${esc(first)}.</h1>
        <p style="margin:0 0 14px;font:400 15px/1.7 -apple-system,Segoe UI,Inter,sans-serif;color:#cfc7b6;">Expect a response ${esc(window)}. I read each application myself — for ${esc(title)} — no automated replies, no sales sequence. If I believe I can genuinely help, you'll hear from me with a next step. If I'm not the right fit, I'll tell you that honestly.</p>
        <p style="margin:0 0 14px;font:400 15px/1.7 -apple-system,Segoe UI,Inter,sans-serif;color:#cfc7b6;">This is the deep work most people put off. The fact that you reached out matters.</p>
        <p style="margin:22px 0 0;font:400 15px/1.7 -apple-system,Segoe UI,Inter,sans-serif;color:#cfc7b6;">Your friend in this —<br><span style="color:#f3eee2;">C.</span></p>
      </td></tr>
    </table>
  </body></html>`;
}

// Browsers always send an Origin header on same-site JSON POSTs, so a missing
// Origin means a script hitting the API directly — reject it. (This closed the
// hole that let direct curl/bot POSTs bypass the browser entirely.)
function originAllowed(origin) {
  if (!origin) return false;
  try {
    const host = new URL(origin).hostname;
    return (
      host === 'theholistic.io' ||
      host === 'www.theholistic.io' ||
      host === 'localhost' ||
      host.endsWith('.vercel.app')
    );
  } catch {
    return false;
  }
}

const MAX_FIELDS = 30;
const MAX_FIELD_LENGTH = 5000;

// Best-effort per-IP rate limit. Serverless instances don't share memory, so
// this is a burst-curb, not a hard guarantee — good enough for a quiet form.
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const rateMap = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const hits = (rateMap.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  hits.push(now);
  rateMap.set(ip, hits);
  if (rateMap.size > 1000) {
    // Drop stale entries so the map can't grow unbounded.
    for (const [k, v] of rateMap) {
      if (!v.some((t) => now - t < RATE_WINDOW_MS)) rateMap.delete(k);
    }
  }
  return hits.length > RATE_MAX;
}

// Form token: GET issues a server-signed timestamp the page JS attaches to its
// submit. Verifying server-side avoids client-clock skew entirely; a valid
// token proves the submitter at least loaded our page recently.
const TOKEN_MAX_AGE_MS = 24 * 60 * 60 * 1000;

function tokenSecret() {
  return process.env.APPLY_SECRET || process.env.RESEND_API_KEY || '';
}

function signToken(t) {
  return createHmac('sha256', tokenSecret()).update(String(t)).digest('hex');
}

function tokenValid(t, sig) {
  const ts = Number(t);
  if (!Number.isFinite(ts) || typeof sig !== 'string') return false;
  if (Date.now() - ts > TOKEN_MAX_AGE_MS || Date.now() - ts < 0) return false;
  return signToken(ts) === sig;
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const t = Date.now();
    return res.status(200).json({ t, sig: signToken(t) });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  if (!originAllowed(req.headers.origin)) {
    return res.status(403).json({ ok: false, error: 'Forbidden' });
  }

  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (rateLimited(ip)) {
    return res.status(429).json({ ok: false, error: 'Too many requests. Please try again shortly.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toAddr = process.env.APPLY_TO;
  const fromAddr = process.env.APPLY_FROM;
  if (!apiKey || !toAddr || !fromAddr) {
    return res.status(500).json({ ok: false, error: 'Email is not configured yet.' });
  }

  let data = req.body;
  if (typeof data === 'string') {
    try { data = JSON.parse(data); } catch { data = {}; }
  }
  data = data || {};

  // Cap payload shape so a hostile client can't inflate the emails.
  data = Object.fromEntries(
    Object.entries(data)
      .slice(0, MAX_FIELDS)
      .map(([k, v]) => [
        String(k).slice(0, 64),
        typeof v === 'string' ? v.slice(0, MAX_FIELD_LENGTH) : v,
      ])
  );

  // Honeypot — silently accept bot submissions without sending.
  if (data._gotcha) return res.status(200).json({ ok: true });

  // Link-spam heuristic — real applicants rarely paste more than a link or
  // two; classic spam payloads carry many. Silently accept without sending.
  const urlCount = (Object.values(data).filter((v) => typeof v === 'string').join(' ').match(/https?:\/\//gi) || []).length;
  if (urlCount > 2) return res.status(200).json({ ok: true });

  // Form token (issued by GET above). Invalid/missing → visible error so a
  // real person on a stale page can recover; the client refetches on retry.
  if (!tokenValid(data._t, data._sig)) {
    return res.status(400).json({ ok: false, error: 'Please refresh the page and try again.' });
  }

  const formKey = data.form === 'clarity' ? 'clarity' : 'amazonian';
  const applicantEmail = (data.email || '').trim();
  const applicantName = (data.name || '').trim();

  if (!applicantEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(applicantEmail)) {
    return res.status(400).json({ ok: false, error: 'A valid email is required.' });
  }

  const title = FORM_TITLES[formKey];

  try {
    // 1) Full application to the owner, reply-to = applicant.
    const ownerResp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: fromAddr,
        to: [toAddr],
        reply_to: applicantName ? `${applicantName} <${applicantEmail}>` : applicantEmail,
        subject: `New ${title} application — ${applicantName || applicantEmail}`,
        html: buildOwnerHtml(formKey, data),
        text: buildOwnerText(formKey, data),
        tags: [PROJECT_TAG, { name: 'category', value: 'application-owner' }, { name: 'form', value: formKey }],
      }),
    });

    if (!ownerResp.ok) {
      const detail = await ownerResp.text();
      console.error('Resend owner email failed:', ownerResp.status, detail);
      return res.status(502).json({ ok: false, error: 'Could not send the application.' });
    }

    // 2) Branded confirmation to the applicant (best-effort; don't fail the request).
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: fromAddr,
          to: [applicantEmail],
          reply_to: toAddr,
          subject: `Your application is in — The Holistic`,
          tags: [PROJECT_TAG, { name: 'category', value: 'application-confirmation' }, { name: 'form', value: formKey }],
          html: buildApplicantHtml(formKey, applicantName),
          text: `Your application is in${applicantName ? ', ' + applicantName.split(/\s+/)[0] : ''}.\n\nExpect a response within 48 hours. I read each application myself — for ${title} — no automated replies, no sales sequence. If I believe I can genuinely help, you'll hear from me with a next step. If I'm not the right fit, I'll tell you that honestly.\n\nThis is the deep work most people put off. The fact that you reached out matters.\n\nYour friend in this —\nC.`,
        }),
      });
    } catch (e) {
      console.error('Applicant confirmation failed (non-fatal):', e);
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('apply handler error:', err);
    return res.status(500).json({ ok: false, error: 'Something went wrong.' });
  }
}
