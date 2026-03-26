import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default async function handler(req: any, res: any) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, goal, plan } = req.body;

  // Basic validation
  if (!name || !email || !phone || !goal) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Base URL for redirects — use vercel URL in production, or fallback for local
  const baseUrl = process.env.VITE_APP_URL || (req.headers.host ? `http://${req.headers.host}` : '');

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          // price_... ID from your Stripe Dashboard
          price: process.env.STRIPE_PRICE_ID!,
          quantity: 1,
        },
      ],
      mode: 'payment',
      // Metadata allows Make.com to receive all form data via Stripe webhooks
      metadata: {
        name,
        phone,
        goal,
        plan: plan || 'Transformation Plan',
      },
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/apply?cancelled=true`,
    });

    return res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error('[Stripe] create session error:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
