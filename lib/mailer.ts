import 'server-only';
import nodemailer from 'nodemailer';

/**
 * UzTeam transactional mailer.
 *
 * Env (set in cPanel → Node.js App → Environment variables):
 *   SMTP_HOST  e.g. mail.uz-team.uz
 *   SMTP_PORT  465 (SSL) or 587 (STARTTLS)
 *   SMTP_USER  e.g. no-reply@uz-team.uz
 *   SMTP_PASS  mailbox password
 *   MAIL_FROM  optional, defaults to "UzTeam <SMTP_USER>"
 *
 * When SMTP is not configured the mailer degrades gracefully (logs + skips),
 * so lead capture never fails because of email issues.
 */

let cached: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter | null {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  if (cached) return cached;

  const port = Number(SMTP_PORT || 465);
  cached = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    connectionTimeout: 10_000,
  });
  return cached;
}

const STRINGS = {
  uz: {
    subject: "So'rovingiz qabul qilindi — UzTeam",
    preheader: "Tez orada siz bilan bog'lanamiz.",
    greeting: (name: string) => `Assalomu alaykum, ${name}!`,
    body1: "So'rovingiz muvaffaqiyatli qabul qilindi. Rahmat!",
    body2:
      "Jamoamiz uni ko'rib chiqib, bir ish kuni ichida siz bilan bog'lanadi. Qo'shimcha savollaringiz bo'lsa, shu xatga javob yozishingiz mumkin.",
    cta: 'Saytga qaytish',
    footer: "Bu xat avtomatik yuborildi — UzTeam so'rovlar tizimi.",
  },
  ru: {
    subject: 'Ваша заявка принята — UzTeam',
    preheader: 'Мы скоро свяжемся с вами.',
    greeting: (name: string) => `Здравствуйте, ${name}!`,
    body1: 'Ваша заявка успешно принята. Спасибо!',
    body2:
      'Наша команда рассмотрит её и свяжется с вами в течение одного рабочего дня. Если появятся вопросы — просто ответьте на это письмо.',
    cta: 'Вернуться на сайт',
    footer: 'Это автоматическое письмо — система заявок UzTeam.',
  },
  en: {
    subject: 'We received your request — UzTeam',
    preheader: 'We will get back to you shortly.',
    greeting: (name: string) => `Hello, ${name}!`,
    body1: 'Your request has been received. Thank you!',
    body2:
      'Our team will review it and get back to you within one business day. If you have any questions, just reply to this email.',
    cta: 'Back to the website',
    footer: 'This is an automated message from the UzTeam request system.',
  },
} as const;

type Locale = keyof typeof STRINGS;

function buildHtml(name: string, locale: Locale, siteUrl: string): string {
  const s = STRINGS[locale];
  return `<!doctype html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background-color:#eef1f7;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <span style="display:none;max-height:0;overflow:hidden;">${s.preheader}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#eef1f7;padding:32px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

        <!-- Header -->
        <tr><td style="padding:0 0 20px;" align="center">
          <table role="presentation" cellpadding="0" cellspacing="0"><tr>
            <td style="background-color:#4f6bed;border-radius:12px;width:44px;height:44px;text-align:center;vertical-align:middle;">
              <span style="color:#ffffff;font-size:20px;font-weight:700;">U</span>
            </td>
            <td style="padding-left:12px;">
              <span style="font-size:22px;font-weight:700;color:#1a2036;">UzTeam</span>
            </td>
          </tr></table>
        </td></tr>

        <!-- Card -->
        <tr><td style="background-color:#ffffff;border-radius:16px;padding:40px 36px;box-shadow:0 4px 24px rgba(26,32,54,0.08);">

          <!-- Check icon -->
          <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:0 auto 24px;"><tr>
            <td style="background-color:#e7f8f0;border-radius:50%;width:64px;height:64px;text-align:center;vertical-align:middle;">
              <span style="font-size:30px;line-height:64px;">✅</span>
            </td>
          </tr></table>

          <h1 style="margin:0 0 8px;font-size:22px;color:#1a2036;text-align:center;">${s.greeting(name)}</h1>
          <p style="margin:0 0 6px;font-size:16px;color:#1a2036;text-align:center;font-weight:600;">${s.body1}</p>
          <p style="margin:0 0 28px;font-size:14px;line-height:1.6;color:#5b6478;text-align:center;">${s.body2}</p>

          <!-- CTA -->
          <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:0 auto;"><tr>
            <td style="background-color:#4f6bed;border-radius:999px;">
              <a href="${siteUrl}" style="display:inline-block;padding:13px 34px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;">${s.cta}</a>
            </td>
          </tr></table>

        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:20px 12px 0;text-align:center;">
          <p style="margin:0 0 4px;font-size:12px;color:#8a91a5;">${s.footer}</p>
          <p style="margin:0;font-size:12px;color:#8a91a5;">© ${new Date().getFullYear()} UzTeam · <a href="${siteUrl}" style="color:#4f6bed;text-decoration:none;">uz-team.uz</a></p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/** Send the "request received" acknowledgement. Never throws. */
export async function sendRequestReceivedEmail(opts: {
  to: string;
  name: string;
  locale?: string;
}): Promise<boolean> {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn('📭 SMTP not configured — acknowledgement email skipped for', opts.to);
    return false;
  }

  const locale: Locale = (['uz', 'ru', 'en'] as const).includes(opts.locale as Locale)
    ? (opts.locale as Locale)
    : 'uz';
  const s = STRINGS[locale];
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://uz-team.uz';
  const from = process.env.MAIL_FROM || `UzTeam <${process.env.SMTP_USER}>`;

  try {
    await transporter.sendMail({
      from,
      to: opts.to,
      subject: s.subject,
      html: buildHtml(opts.name, locale, siteUrl),
      text: `${s.greeting(opts.name)}\n\n${s.body1}\n${s.body2}\n\n${siteUrl}`,
    });
    console.log('📬 Acknowledgement email sent to', opts.to);
    return true;
  } catch (err) {
    console.error('📭 Email send failed:', err);
    return false;
  }
}
