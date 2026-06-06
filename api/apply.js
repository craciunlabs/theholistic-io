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

  const bodyKeys = Object.keys(data).filter(
    (k) => k !== 'form' && k !== '_gotcha' && k !== 'name' && k !== 'email'
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
        <p style="margin:0 0 14px;font:400 15px/1.7 -apple-system,Segoe UI,Inter,sans-serif;color:#cfc7b6;">Expect a response ${esc(window)}. I read each application myself — for ${esc(title)} — no automated replies, no sales sequence. If I believe I can genuinely help, you'll hear from me with a next step. If I'm not the right fit, I'll tell you that honestly.</p>
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
