/**
 * Minimal transactional-email sender over the Resend REST API.
 *
 * Plain fetch, NO npm dependency. Inert until you set RESEND_API_KEY (and verify
 * the sending domain in Resend). emailConfigured() is false until then.
 */
const RESEND_KEY = process.env.RESEND_API_KEY;
const FROM = process.env.ALERTS_FROM || "HalalGauge <alerts@halalgauge.com>";

export function emailConfigured(): boolean {
  return !!RESEND_KEY;
}

export async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  if (!RESEND_KEY) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM, to, subject, html }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
