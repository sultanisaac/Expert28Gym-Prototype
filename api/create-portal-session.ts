import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Missing required field: email' });
  }

  const baseUrl =
    process.env.VITE_APP_URL ||
    (req.headers.host ? `http://${req.headers.host}` : '');

  try {
    // Find the Stripe customer by email
    const customers = await stripe.customers.list({ email, limit: 1 });

    if (!customers.data.length) {
      return res.status(404).json({
        error: 'No billing account found for this email. Please contact support.',
      });
    }

    const customerId = customers.data[0].id;

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${baseUrl}/client/dashboard`,
    });

    return res.status(200).json({ url: portalSession.url });
  } catch (err: any) {
    console.error('[Stripe] create portal session error:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
