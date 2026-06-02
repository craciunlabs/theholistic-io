// Serverless endpoint for The Holistic application forms.
// Sends the full application to the owner (reply-to = applicant) and a
// branded confirmation to the applicant. Runs on Vercel (Node runtime).
//
// Required env vars (set in Vercel project settings, NEVER in code/git):
//   RESEND_API_KEY   - Resend API key for theholistic.io
//   APPLY_TO         - owner inbox (e.g. claudiu@claudiucraciun.com)
//   APPLY_FROM       - verified sender (e.g. "The Holistic <applications@theholistic.io>")

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
  about: 'About them',
  situation: 'What they are dealing with',
  outcome: 'What success looks like',
  area: 'Focus areas',
  prior: 'Prior deep work',
  availability: 'Availability',
  'anything-else': 'Anything else',
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

  // Identity block (name + email) sits at the top, distinct from the body answers.
  // The remaining fields render as quiet label-over-answer blocks for easy reading.
  const bodyKeys = Object.keys(data).filter(
    (k) => k !== 'form' && k !== '_gotcha' && k !== 'name' && k !== 'email'
  );

  const blocks = bodyKeys.map((k) => {
    const label = FIELD_LABELS[k] || k;
    const val = esc(fmtValue(data[k])).replace(/\n/g, '<br>');
    return `<tr><td style="padding:18px 30px 0;">
        <div style="font:600 11px/1.4 -apple-system,Segoe UI,Inter,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#8a7d63;">${esc(label)}</div>
        <div style="margin-top:6px;font:400 15px/1.65 -apple-system,Segoe UI,Inter,sans-serif;color:#ece6da;">${val}</div>
      </td></tr>`;
  }).join('');

  return `<!doctype html><html><body style="margin:0;background:#0d0c0a;padding:28px 16px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;margin:0 auto;background:#14110d;border:1px solid #2a251d;border-radius:14px;overflow:hidden;">

      <tr><td style="padding:28px 30px 22px;border-bottom:1px solid #221e18;">
        <div style="font:600 11px/1 -apple-system,Segoe UI,Inter,sans-serif;letter-spacing:.18em;text-transform:uppercase;color:#c9a84c;">New application</div>
        <div style="margin-top:10px;font:500 25px/1.25 Georgia,'Times New Roman',serif;color:#f5f0e8;letter-spacing:.01em;">${esc(title)}</div>
      </td></tr>

      <tr><td style="padding:24px 30px 4px;">
        <div style="font:500 19px/1.3 Georgia,'Times New Roman',serif;color:#f5f0e8;">${esc(name) || 'Someone'}</div>
        <a href="mailto:${esc(email)}" style="display:inline-block;margin-top:4px;font:400 14px/1.5 -apple-system,Segoe UI,Inter,sans-serif;color:#c9a84c;text-decoration:none;">${esc(email)}</a>
      </td></tr>

      ${blocks}

      <tr><td style="padding:26px 30px 30px;">
        <a href="mailto:${esc(email)}" style="display:inline-block;background:#c9a84c;color:#1a1710;text-decoration:none;font:600 14px/1 -apple-system,Segoe UI,Inter,sans-serif;letter-spacing:.01em;padding:13px 22px;border-radius:9px;">Reply to ${esc(name.split(/\s+/)[0] || 'applicant')}</a>
        <div style="margin-top:12px;font:400 12px/1.5 -apple-system,Segoe UI,Inter,sans-serif;color:#6f6553;">Or just hit reply — your response goes straight to ${esc(email) || 'the applicant'}.</div>
      </td></tr>

    </table>
  </body></html>`;
}

function buildOwnerText(formKey, data) {
  const title = FORM_TITLES[formKey] || 'Application';
  const lines = [`NEW APPLICATION — ${title}`, ''];
  Object.keys(data)
    .filter((k) => k !== 'form' && k !== '_gotcha')
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
        <p style="margin:0 0 14px;font:400 15px/1.7 -apple-system,Segoe UI,Inter,sans-serif;color:#cfc7b6;">Thank you for trusting me with this. I read every application personally — for ${esc(title)} — and I will be in touch ${esc(window)} if I believe this is the right fit.</p>
        <p style="margin:0 0 14px;font:400 15px/1.7 -apple-system,Segoe UI,Inter,sans-serif;color:#cfc7b6;">This is the deep work most people put off. The fact that you reached out matters.</p>
        <p style="margin:22px 0 0;font:400 15px/1.7 -apple-system,Segoe UI,Inter,sans-serif;color:#cfc7b6;">Your friend in this —<br><span style="color:#f3eee2;">C.</span></p>
      </td></tr>
    </table>
  </body></html>`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
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

  // Honeypot — silently accept bot submissions without sending.
  if (data._gotcha) return res.status(200).json({ ok: true });

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
          html: buildApplicantHtml(formKey, applicantName),
          text: `Your application is in${applicantName ? ', ' + applicantName.split(/\s+/)[0] : ''}.\n\nThank you for trusting me with this. I read every application personally — for ${title} — and I will be in touch within 5 days if I believe this is the right fit.\n\nThis is the deep work most people put off. The fact that you reached out matters.\n\nYour friend in this —\nC.`,
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
