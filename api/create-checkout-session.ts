import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default async function handler(req: any, res: any) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, goal, plan, user_id } = req.body;

  // Basic validation
  if (!email || !plan) {
    return res.status(400).json({ error: 'Missing required fields: email or plan' });
  }

  // Map plan names to their respective Price IDs from environment variables
  let priceId = process.env.STRIPE_PRICE_ELITE; // Default fallback
  const isSubscription = plan !== '7-Day Trial';

  if (plan === 'Base Expert') priceId = process.env.STRIPE_PRICE_BASE;
  if (plan === '7-Day Trial') priceId = process.env.STRIPE_PRICE_TRIAL;

  // Base URL for redirects — use vercel URL in production, or fallback for local
  const baseUrl = process.env.VITE_APP_URL || (req.headers.host ? `http://${req.headers.host}` : '');

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price: priceId!,
          quantity: 1,
        },
      ],
      mode: isSubscription ? 'subscription' : 'payment',
      // Metadata allows Make.com to receive all form data via Stripe webhooks
      metadata: {
        name: name || '',
        phone: phone || '',
        goal: goal || '',
        plan: plan,
        user_id: user_id || '',
        role_upgrade: 'client' // Specific flag for webhooks
      },
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/client/dashboard?cancelled=true`,
    });

    return res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error('[Stripe] create session error:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
