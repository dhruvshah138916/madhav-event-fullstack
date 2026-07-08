// Sends email over plain HTTPS via Brevo's API — no SMTP ports involved,
// so it works even on networks that block 465/587.

// ── How to enable real emails (works even when SMTP ports are blocked) ──
// Many college/hostel Wi-Fi networks block outgoing SMTP ports (465/587),
// which makes Gmail's SMTP time out no matter what settings you use. The
// fix is to send email over plain HTTPS instead, using Brevo's free email
// API (300 emails/day, no card required):
//
// 1. Sign up free at https://www.brevo.com
// 2. Go to Settings → Senders & IP → Senders, add and verify the email
//    address you want to send FROM (click the verification link they email you).
// 3. Go to Settings → SMTP & API → API Keys → "Generate a new API key".
// 4. In backend/.env, set:
//      BREVO_API_KEY=your-api-key-here
//      BREVO_SENDER_EMAIL=the-verified-email-from-step-2@example.com
// If these are left empty, the app still works — it just logs to the
// console instead of actually sending an email, so booking never breaks.
// ──────────────────────────────────────────────────────────────────────────

const BREVO_API_KEY = process.env.BREVO_API_KEY
const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL

function buildEmailHtml(booking) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; border: 1px solid #eee; border-radius: 12px; overflow: hidden;">
      <div style="background: #00ADB5; color: #ffffff; padding: 18px 24px;">
        <h2 style="margin: 0; font-size: 20px;">Booking Confirmed</h2>
      </div>
      <div style="padding: 24px; color: #222831;">
        <p>Hi ${booking.attendeeName},</p>
        <p>Your booking for <strong>${booking.eventTitle}</strong> is confirmed. Here are your details:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <tr>
            <td style="padding: 6px 0; color: #606D6D;">Booking ID</td>
            <td style="padding: 6px 0; text-align: right;"><strong>${booking._id}</strong></td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #606D6D;">Date &amp; Time</td>
            <td style="padding: 6px 0; text-align: right;">${booking.eventDate} · ${booking.eventTime}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #606D6D;">Venue</td>
            <td style="padding: 6px 0; text-align: right;">${booking.venue}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #606D6D;">Seats</td>
            <td style="padding: 6px 0; text-align: right;">${booking.seats}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #606D6D;">Total Paid</td>
            <td style="padding: 6px 0; text-align: right;">
              <strong>${booking.totalPrice === 0 ? 'Free' : '₹' + booking.totalPrice}</strong>
            </td>
          </tr>
        </table>
        <p style="color: #606D6D; font-size: 13px;">
          This is an automated email from Madhav Event. Please keep it for your records.
        </p>
      </div>
    </div>
  `
}

// Sends the confirmation email. Never throws — a failed email should never
// break the booking itself, so any error is just logged.
async function sendBookingConfirmationEmail(booking) {
  if (!BREVO_API_KEY || !BREVO_SENDER_EMAIL) {
    console.log(`[email skipped — not configured] Would have emailed ${booking.userEmail} about "${booking.eventTitle}"`)
    return
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        sender: { name: 'Madhav Event', email: BREVO_SENDER_EMAIL },
        to: [{ email: booking.userEmail, name: booking.attendeeName }],
        subject: `Booking Confirmed — ${booking.eventTitle}`,
        htmlContent: buildEmailHtml(booking),
      }),
    })

    if (!response.ok) {
      const errorBody = await response.text()
      throw new Error(`Brevo API returned ${response.status}: ${errorBody}`)
    }

    console.log('Confirmation email sent to', booking.userEmail)
  } catch (err) {
    console.error('Failed to send confirmation email:', err.message)
  }
}

module.exports = { sendBookingConfirmationEmail }
