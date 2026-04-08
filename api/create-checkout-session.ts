import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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

  try {
    // 1. Fetch current price ID from Supabase instead of environment variables
    const { data: planData, error: planError } = await supabase
      .from('membership_plans')
      .select('stripe_price_id, price')
      .eq('name', plan)
      .eq('is_active', true)
      .single();

    if (planError || !planData) {
      console.error('[Stripe] Plan lookup error:', planError);
      return res.status(404).json({ error: 'Plan not found or inactive' });
    }

    const priceId = planData.stripe_price_id;

    // Base URL for redirects — use vercel URL in production, or fallback for local
    const baseUrl = process.env.VITE_APP_URL || (req.headers.host ? `http://${req.headers.host}` : '');

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price: priceId!,
          quantity: 1,
        },
      ],
      mode: 'payment',
      metadata: {
        email: email || '',
        name: name || '',
        phone: phone || '',
        goal: goal || '',
        plan: plan,
        user_id: user_id || '',
        role_upgrade: 'client'
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
