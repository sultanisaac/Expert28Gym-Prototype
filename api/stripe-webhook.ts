import Stripe from 'stripe';
import nodemailer from 'nodemailer';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16', // Fallback, normally it uses the one defined globally if not set
});

// Vercel configuration to disable the default body parser so we can read the raw body
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper function to read the raw body from the request stream
async function getRawBody(readable: any): Promise<Buffer> {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req: any, res: any) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let event;
  try {
    const rawBody = await getRawBody(req);
    const signature = req.headers['stripe-signature'];
    
    // Verify the webhook signature using the raw body and the secret from Stripe Dashboard
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature as string,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
    console.error(`[Stripe Webhook] Signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the specific checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // Extract customer details from the session
    const email = session.customer_details?.email || session.metadata?.email;
    const name = session.customer_details?.name || session.metadata?.name || 'Client';
    const plan = session.metadata?.plan || 'Expert28 Gym Membership';

    if (email) {
      console.log(`[Stripe Webhook] Payment successful for ${email}. Sending welcome email...`);
      // Trigger our nodemailer function to send the email directly
      const transactionId = (session.payment_intent as string) || session.id;
      await sendWelcomeEmail(email, name, plan, transactionId);
    } else {
      console.error('[Stripe Webhook] No email found in checkout session.');
    }
  } else {
    // Log other events we might receive but don't act on them right now
    console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
  }

  // Important: Always acknowledge receipt of the event to Stripe immediately
  res.status(200).json({ received: true });
}

/**
 * Sends a welcome email using Nodemailer & Gmail
 */
async function sendWelcomeEmail(toEmail: string, name: string, plan: string, transactionId: string) {
  try {
    // Configure the transporter with your Gmail credentials
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,       // e.g., 'sultan.isaac26@gmail.com'
        pass: process.env.GMAIL_APP_PASSWORD, // your 16-character App Password
      },
    });

    // Compose the email content
    const mailOptions = {
      from: `"Expert28 Gym" <${process.env.GMAIL_USER}>`,
      to: toEmail,
      subject: `Expert28 Gym: ${plan} Purchase Confirmed`,
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Expert28 Email Preview</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800;900&display=swap" rel="stylesheet">
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #f3f4f6;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }
    </style>
</head>
<body>
    <div style="background-color: #030712; color: #ffffff; padding: 40px 20px; max-width: 600px; margin: 20px auto; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.2);">
        
        <!-- Header/Logo -->
        <div style="text-align: center; margin-bottom: 48px;">
            <div style="font-weight: 800; font-size: 28px; letter-spacing: 2px; color: #ffffff; text-transform: uppercase;">
                EXPERT<span style="color: #10b981;">28</span>
            </div>
            <div style="font-size: 10px; color: #f59e0b; letter-spacing: 3px; margin-top: 4px; font-weight: 800;">
                ATHLETIC PERFORMANCE HUB
            </div>
        </div>

        <!-- Hero Heading -->
        <h1 style="font-size: 34px; font-weight: 900; font-style: italic; text-transform: uppercase; margin-bottom: 24px; line-height: 1.0; color: #ffffff; text-align: left; letter-spacing: -1px;">
            NO EXCUSES. <br><span style="color: #10b981;">IT STARTS NOW.</span>
        </h1>

        <!-- Email Body -->
        <p style="font-size: 16px; line-height: 1.6; color: #d1d5db; margin-bottom: 24px;">
            Athlete <strong style="color: #ffffff;">${name}</strong>,
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #d1d5db; margin-bottom: 32px;">
            Your purchase is confirmed and your protocol is officially live. You have successfully unlocked access to the <strong style="color: #ffffff;">${plan}</strong>. The lab is prepped. Your only job now is execution.
        </p>

        <!-- Transaction Details Card -->
        <div style="background-color: #0c111d; border: 1px solid #1f2937; border-radius: 12px; padding: 24px; margin-bottom: 40px;">
            <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; color: #10b981; margin-bottom: 20px; border-bottom: 1px solid #1f2937; padding-bottom: 10px;">
                Protocol Details
            </div>
            
            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                <tr>
                    <td style="color: #9ca3af; font-size: 14px; padding-bottom: 12px; width: 40%;">Membership:</td>
                    <td style="color: #ffffff; font-size: 14px; font-weight: 700; text-align: right; padding-bottom: 12px;">${plan}</td>
                </tr>
                <tr>
                    <td style="color: #10b981; font-size: 14px; padding-bottom: 12px;">Status:</td>
                    <td style="color: #10b981; font-size: 14px; font-weight: 900; text-align: right; padding-bottom: 12px;">ACTIVE</td>
                </tr>
                <tr>
                    <td style="color: #9ca3af; font-size: 14px; padding-top: 12px; border-top: 1px solid #1f2937;">Ref. ID:</td>
                    <td style="color: #6b7280; font-size: 12px; text-align: right; padding-top: 12px; font-family: monospace;">${transactionId}</td>
                </tr>
            </table>
        </div>

        <!-- Primary CTA -->
        <div style="text-align: center; margin-bottom: 48px;">
            <a href="https://expert28gym-prototype0.vercel.app/client/dashboard" style="background-color: #2563eb; color: #ffffff; padding: 18px 40px; border-radius: 6px; text-decoration: none; font-weight: 800; display: inline-block; text-transform: uppercase; font-size: 15px; letter-spacing: 1px;">
                Initialize Dashboard
            </a>
        </div>

        <!-- Next Steps Section -->
        <div style="margin-bottom: 48px; border-left: 3px solid #10b981; padding-left: 20px;">
            <p style="font-size: 14px; font-weight: 800; text-transform: uppercase; color: #ffffff; margin-bottom: 8px;">What's Next?</p>
            <p style="font-size: 13px; color: #9ca3af; line-height: 1.5; margin: 0;">A performance coach will contact you within 24 hours to schedule your on-site physical assessment and walkthrough.</p>
        </div>

        <!-- Footer -->
        <div style="border-top: 1px solid #1f2937; padding-top: 24px; text-align: center; font-size: 11px; color: #6b7280; line-height: 1.5;">
            <p style="margin-bottom: 8px;">Questions? Contact HQ at <a href="mailto:support@expert28.com" style="color: #10b981; text-decoration: none; font-weight: 700;">support@expert28.com</a></p>
            <p style="margin: 0; text-transform: uppercase; letter-spacing: 1px;">&copy; 2026 EXPERT28 GYM. ALL RIGHTS RESERVED.</p>
        </div>
        
    </div>
</body>
</html>`,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log(`[Nodemailer] Email sent successfully to ${toEmail}: ${info.messageId}`);
  } catch (error) {
    console.error(`[Nodemailer] Error sending email to ${toEmail}:`, error);
  }
}
